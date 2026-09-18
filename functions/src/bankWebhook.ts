import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { db } from './config';
import { handleAccountUpdated, handleReauthorisation } from './webhookHandlers';
import type { MonoWebhookEvent } from './mono/monoTypes';

const EVENTS_COLLECTION = 'webhook_events';

/** How long a completed event is retained for duplicate detection (Firestore TTL field). */
export const COMPLETED_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Bound on how long a single worker may hold an event before its claim counts as
 * abandoned. Recovery is bounded in time rather than immediate, so a live-but-slow
 * worker is never pre-empted.
 */
export const CLAIM_LEASE_MS = 2 * 60 * 1000;

/** After this many abandoned attempts an event stops auto-reclaiming and surfaces for review. */
export const MAX_CLAIM_ATTEMPTS = 5;

export type ClaimOutcome = 'claimed' | 'completed' | 'active' | 'exhausted';

export interface ClaimResult {
    outcome: ClaimOutcome;
    claimId: string;
    attempts: number;
}

/**
 * Mono webhook authentication (FI-02).
 *
 * Mono's documented contract: every request carries a `mono-webhook-secret`
 * header whose value must match the configured webhook secret. There is no HMAC
 * and no signature over the body. Comparison is constant-time and fails closed
 * when either side is missing. The secret value is never logged.
 */
export function verifyWebhookSecret(
    provided: string | undefined,
    secret: string | undefined = process.env.MONO_WEBHOOK_SECRET,
): boolean {
    if (!secret || !provided) return false;

    const expected = Buffer.from(secret, 'utf8');
    const actual = Buffer.from(provided, 'utf8');
    if (expected.length !== actual.length) return false;
    return timingSafeEqual(expected, actual);
}

/**
 * Deduplication key. Mono's documented `event_id` is authoritative; a body hash
 * is used only when the provider omits or malforms it.
 */
export function eventKey(payload: MonoWebhookEvent, rawFallback: string): string {
    const rawId = typeof payload.event_id === 'string' ? payload.event_id : '';
    const safeId = rawId.replace(/[^A-Za-z0-9_-]/g, '');
    if (safeId.length >= 8) return `evt_${safeId}`;

    const digest = createHash('sha256').update(rawFallback).digest('hex').slice(0, 40);
    return `body_${digest}`;
}

function eventRef(key: string) {
    return db.collection(EVENTS_COLLECTION).doc(key);
}

/**
 * Claim an event for processing (FI-01).
 *
 * Distinguishes the three states that matter:
 *  - `completed` → duplicate delivery; acknowledge without reprocessing.
 *  - `active`    → a live claim (lease not expired) held by another worker. This
 *                  must NOT be treated as a duplicate, otherwise a worker crash
 *                  would silently discard the event; it is a retryable outcome.
 *  - `claimed`   → the claim is ours (fresh, or recovered after an abandoned
 *                  lease). Ownership is a per-call `claimId`, so a previous
 *                  worker can never complete or delete our claim.
 *
 * Recovery is bounded by `CLAIM_LEASE_MS`; past `MAX_CLAIM_ATTEMPTS` the event
 * stops auto-reclaiming (`exhausted`) instead of looping forever.
 */
export async function claimEvent(
    key: string,
    nowMs: number = Date.now(),
    claimId: string = randomUUID(),
): Promise<ClaimResult> {
    const ref = eventRef(key);

    return db.runTransaction(async (txn) => {
        const snap = await txn.get(ref);
        const data = snap.exists ? (snap.data() as Record<string, unknown>) : undefined;
        const expiresAt = new Date(nowMs + COMPLETED_TTL_MS);

        if (data?.status === 'completed') {
            return {
                outcome: 'completed' as const,
                claimId: String(data.claimId ?? ''),
                attempts: Number(data.attempts ?? 0),
            };
        }

        if (data?.status === 'processing') {
            const leaseUntilMs = Number(data.leaseUntilMs ?? 0);
            const attempts = Number(data.attempts ?? 0);

            if (leaseUntilMs > nowMs) {
                return { outcome: 'active' as const, claimId: String(data.claimId ?? ''), attempts };
            }
            if (attempts >= MAX_CLAIM_ATTEMPTS) {
                return { outcome: 'exhausted' as const, claimId: String(data.claimId ?? ''), attempts };
            }

            // Abandoned claim (lease expired): take ownership, bounded by attempts.
            txn.set(
                ref,
                {
                    status: 'processing',
                    claimId,
                    claimedAt: new Date(nowMs).toISOString(),
                    leaseUntilMs: nowMs + CLAIM_LEASE_MS,
                    attempts: attempts + 1,
                    expiresAt,
                },
                { merge: true },
            );
            return { outcome: 'claimed' as const, claimId, attempts: attempts + 1 };
        }

        txn.set(ref, {
            status: 'processing',
            claimId,
            claimedAt: new Date(nowMs).toISOString(),
            leaseUntilMs: nowMs + CLAIM_LEASE_MS,
            attempts: 1,
            expiresAt,
        });
        return { outcome: 'claimed' as const, claimId, attempts: 1 };
    });
}

/**
 * Mark an event completed — only if this worker still owns the claim.
 * Returns false when a newer worker has taken over (stale-worker protection).
 */
export async function completeEvent(key: string, claimId: string, nowMs: number = Date.now()): Promise<boolean> {
    const ref = eventRef(key);

    return db.runTransaction(async (txn) => {
        const snap = await txn.get(ref);
        if (!snap.exists) return false;

        const data = snap.data() as Record<string, unknown>;
        if (data.claimId !== claimId) return false;

        txn.set(
            ref,
            {
                status: 'completed',
                completedAt: new Date(nowMs).toISOString(),
                leaseUntilMs: 0,
                expiresAt: new Date(nowMs + COMPLETED_TTL_MS),
            },
            { merge: true },
        );
        return true;
    });
}

/**
 * Release a failed claim so Mono's redelivery can be processed immediately.
 * Returns false when a newer worker owns the claim — a stale worker must never
 * delete a live claim.
 */
export async function releaseEvent(key: string, claimId: string): Promise<boolean> {
    const ref = eventRef(key);

    return db.runTransaction(async (txn) => {
        const snap = await txn.get(ref);
        if (!snap.exists) return false;

        const data = snap.data() as Record<string, unknown>;
        if (data.claimId !== claimId) return false;

        txn.delete(ref);
        return true;
    });
}

/**
 * Parse the request body. firebase-functions normally parses JSON already; the
 * string branch keeps a raw/text body (and tests) working. Returns null on
 * malformed input so the caller can fail closed.
 */
function parsePayload(req: { body?: unknown }): MonoWebhookEvent | null {
    if (typeof req.body === 'string') {
        try {
            return JSON.parse(req.body) as MonoWebhookEvent;
        } catch {
            return null;
        }
    }
    if (req.body && typeof req.body === 'object') return req.body as MonoWebhookEvent;
    return null;
}

export const monoWebhook = onRequest(
    { cors: false, secrets: ['MONO_SECRET_KEY', 'MONO_WEBHOOK_SECRET'] },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method not allowed');
            return;
        }

        // Documented contract: the header value must match the configured secret.
        // The value is never logged.
        const providedSecret = req.headers['mono-webhook-secret'] as string | undefined;
        if (!verifyWebhookSecret(providedSecret)) {
            logger.warn('[Webhook] Rejected: missing or invalid mono-webhook-secret');
            res.status(401).send('Unauthorized request.');
            return;
        }

        const payload = parsePayload(req);
        if (!payload) {
            res.status(400).send('Malformed or missing body');
            return;
        }

        const monoAccountId = payload.data?.account?._id;
        if (!monoAccountId) {
            res.status(400).send('Missing account ID');
            return;
        }

        const rawFallback = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
        const key = eventKey(payload, rawFallback);
        const claim = await claimEvent(key);

        if (claim.outcome === 'completed') {
            logger.info(`[Webhook] Duplicate delivery for completed event ${key}`);
            res.status(200).json({ received: true, duplicate: true });
            return;
        }

        if (claim.outcome === 'active') {
            // Another worker holds a live claim. Retryable, so a crash on their
            // side cannot silently discard the event.
            logger.warn(`[Webhook] Event ${key} is being processed by another worker; asking for redelivery`);
            res.status(503).json({ received: false, retry: true, reason: 'in_progress' });
            return;
        }

        if (claim.outcome === 'exhausted') {
            logger.error(`[Webhook] Event ${key} exceeded ${MAX_CLAIM_ATTEMPTS} attempts; manual review required`);
            res.status(500).json({ received: false, reason: 'attempts_exhausted' });
            return;
        }

        logger.info(`[Webhook] Received event: ${payload.event} for ${monoAccountId}`);

        try {
            if (payload.event === 'mono.events.account_updated' || payload.event === 'account_updated') {
                await handleAccountUpdated(monoAccountId, payload.event_id);
            } else if (payload.event === 'mono.events.reauthorisation_required' || payload.event === 'reauthorisation_required') {
                await handleReauthorisation(monoAccountId);
            }

            try {
                await completeEvent(key, claim.claimId);
            } catch (completionError) {
                // The handler's work is done. Failing to record completion must
                // not cause a duplicate financial application on redelivery: the
                // handler is idempotent per event_id, and the stale claim is
                // recovered under a new claimId once the lease expires.
                logger.error(`[Webhook] Failed to record completion for ${key}:`, completionError);
            }

            res.status(200).json({ received: true });
        } catch (error) {
            logger.error(`[Webhook] Error handling ${payload.event}:`, error);

            // Release so Mono's redelivery is processed immediately instead of
            // waiting for the lease to expire.
            try {
                await releaseEvent(key, claim.claimId);
            } catch (releaseError) {
                logger.error('[Webhook] Failed to release event claim:', releaseError);
            }

            res.status(500).send('Internal error');
        }
    },
);
