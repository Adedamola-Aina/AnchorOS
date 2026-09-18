import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { db } from './config';
import { handleAccountUpdated, handleReauthorisation } from './webhookHandlers';
import type { MonoWebhookEvent } from './mono/monoTypes';

const REPLAY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * FI-02 (issue #118 / register): verify the HMAC over the **raw request bytes**.
 *
 * Mono signs the exact payload it sent. Re-serializing `req.body` (JSON.stringify)
 * changes whitespace/key order, so the digest can never match — the channel was
 * effectively dead. `req.rawBody` is the untouched byte buffer provided by
 * firebase-functions.
 */
export function verifySignature(rawBody: Buffer, signature: string | undefined): boolean {
    const secret = process.env.MONO_WEBHOOK_SECRET;
    if (!secret || !signature) return false;

    const expected = createHmac('sha512', secret).update(rawBody).digest();
    let provided: Buffer;
    try {
        provided = Buffer.from(signature.trim(), 'hex');
    } catch {
        return false;
    }
    if (provided.length !== expected.length) return false;
    return timingSafeEqual(expected, provided);
}

export function eventFingerprint(rawBody: Buffer): string {
    return createHash('sha256').update(rawBody).digest('hex').slice(0, 32);
}

function eventRef(fingerprint: string) {
    return db.collection('webhook_events').doc(fingerprint);
}

/**
 * FI-01 (register): claim the event *before* handling so concurrent identical
 * deliveries cannot both process, but only MARK it processed after the handler
 * succeeds. A failure releases the claim so Mono's retry for the same body can
 * still converge instead of being dropped as a duplicate.
 */
export async function claimEvent(fingerprint: string): Promise<boolean> {
    const ref = eventRef(fingerprint);
    return db.runTransaction(async (txn) => {
        const snap = await txn.get(ref);
        if (snap.exists) return false;
        // RA-04 (#148): a Firestore TTL policy only expires timestamp fields, so
        // this must be a Date (converted to a Timestamp by the Admin SDK) rather
        // than an ISO string. See config/firestore.indexes.json -> webhook_events.
        const expiresAt = new Date(Date.now() + REPLAY_CACHE_TTL_MS);
        txn.set(ref, {
            status: 'processing',
            claimedAt: new Date().toISOString(),
            expiresAt,
        });
        return true;
    });
}

export async function completeEvent(fingerprint: string): Promise<void> {
    const expiresAt = new Date(Date.now() + REPLAY_CACHE_TTL_MS);
    await eventRef(fingerprint).set(
        { status: 'processed', processedAt: new Date().toISOString(), expiresAt },
        { merge: true },
    );
}

export async function releaseEvent(fingerprint: string): Promise<void> {
    await eventRef(fingerprint).delete();
}

export const monoWebhook = onRequest(
    { cors: false, secrets: ['MONO_SECRET_KEY', 'MONO_WEBHOOK_SECRET'] },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method not allowed');
            return;
        }

        // FI-02: the signature must be verified over the raw bytes, never a
        // re-serialized body. Fail closed when the raw buffer is unavailable.
        const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;
        if (!rawBody || rawBody.length === 0) {
            logger.warn('[Webhook] Missing raw body — rejecting');
            res.status(400).send('Missing body');
            return;
        }

        const signature = req.headers['mono-webhook-secret'] as string | undefined;
        if (!verifySignature(rawBody, signature)) {
            console.warn('[Webhook] Invalid signature — rejecting');
            res.status(401).send('Invalid signature');
            return;
        }

        let payload: MonoWebhookEvent;
        try {
            payload = JSON.parse(rawBody.toString('utf8')) as MonoWebhookEvent;
        } catch {
            res.status(400).send('Malformed JSON');
            return;
        }

        const event = payload.event;
        const monoAccountId = payload.data?.account?._id;

        if (!monoAccountId) {
            res.status(400).send('Missing account ID');
            return;
        }

        // FI-01: claim first (serializes concurrent identical deliveries), mark
        // processed only after the handler succeeds, release on failure.
        const fingerprint = eventFingerprint(rawBody);
        const claimed = await claimEvent(fingerprint);
        if (!claimed) {
            console.warn('[Webhook] Duplicate event rejected (replay protection)');
            // Return 200 to prevent Mono from retrying an already-handled event
            res.status(200).json({ received: true, duplicate: true });
            return;
        }

        logger.info(`[Webhook] Received event: ${event} for ${monoAccountId}`);

        try {
            if (event === 'account_updated' || event === 'mono.events.account_updated') {
                await handleAccountUpdated(monoAccountId);
            } else if (event === 'reauthorisation_required' || event === 'mono.events.reauthorisation_required') {
                await handleReauthorisation(monoAccountId);
            }
            await completeEvent(fingerprint);
            // Acknowledge all events to prevent retries
            res.status(200).json({ received: true });
        } catch (err) {
            console.error(`[Webhook] Error handling ${event}:`, err);
            // FI-01: release the claim so Mono's retry of this same body is not
            // discarded as a duplicate of a failed attempt.
            try {
                await releaseEvent(fingerprint);
            } catch (releaseErr) {
                console.error('[Webhook] Failed to release event claim:', releaseErr);
            }
            res.status(500).send('Internal error');
        }
    },
);
