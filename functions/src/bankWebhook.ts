import { onRequest } from 'firebase-functions/v2/https';
import { createHash, createHmac } from 'node:crypto';
import { db } from './config';
import { handleAccountUpdated, handleReauthorisation } from './webhookHandlers';
import type { MonoWebhookEvent } from './mono/monoTypes';

const REPLAY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function verifySignature(rawBody: string, signature: string | undefined): boolean {
    const secret = process.env.MONO_WEBHOOK_SECRET;
    if (!secret || !signature) return false;
    const expected = createHmac('sha512', secret).update(rawBody).digest('hex');
    // Constant-time comparison
    if (expected.length !== signature.length) return false;
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
        mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return mismatch === 0;
}

function eventFingerprint(rawBody: string): string {
    return createHash('sha256').update(rawBody).digest('hex').slice(0, 32);
}

async function isReplayEvent(fingerprint: string): Promise<boolean> {
    const ref = db.collection('webhook_events').doc(fingerprint);
    const isReplay = await db.runTransaction(async (txn) => {
        const snap = await txn.get(ref);
        if (snap.exists) return true;
        const expiresAt = new Date(Date.now() + REPLAY_CACHE_TTL_MS).toISOString();
        txn.set(ref, { processedAt: new Date().toISOString(), expiresAt });
        return false;
    });
    return isReplay;
}

export const monoWebhook = onRequest(
    { cors: false, secrets: ['MONO_SECRET_KEY', 'MONO_WEBHOOK_SECRET'] },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method not allowed');
            return;
        }

        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        const signature = req.headers['mono-webhook-secret'] as string | undefined;

        if (!verifySignature(rawBody, signature)) {
            console.warn('[Webhook] Invalid signature — rejecting');
            res.status(401).send('Invalid signature');
            return;
        }

        // Replay attack protection: reject events with identical body fingerprints
        const fingerprint = eventFingerprint(rawBody);
        const replay = await isReplayEvent(fingerprint);
        if (replay) {
            console.warn('[Webhook] Duplicate event rejected (replay protection)');
            // Return 200 to prevent Mono from retrying a legitimately processed event
            res.status(200).json({ received: true, duplicate: true });
            return;
        }

        const payload: MonoWebhookEvent = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const event = payload.event;
        const monoAccountId = payload.data?.account?._id;

        if (!monoAccountId) {
            res.status(400).send('Missing account ID');
            return;
        }

        console.log(`[Webhook] Received event: ${event} for ${monoAccountId}`);

        try {
            if (event === 'account_updated' || event === 'mono.events.account_updated') {
                await handleAccountUpdated(monoAccountId);
            } else if (event === 'reauthorisation_required' || event === 'mono.events.reauthorisation_required') {
                await handleReauthorisation(monoAccountId);
            }
            // Acknowledge all events to prevent retries
            res.status(200).json({ received: true });
        } catch (err) {
            console.error(`[Webhook] Error handling ${event}:`, err);
            res.status(500).send('Internal error');
        }
    },
);
