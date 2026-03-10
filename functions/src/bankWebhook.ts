/**
 * Bank Webhook — receives real-time events from Mono
 *
 * Verifies webhook signature, then routes events:
 *  - account_updated → trigger sync
 *  - mono.events.reauthorisation_required → mark reconnect
 */
import { onRequest } from 'firebase-functions/v2/https';
import { createHash, createHmac } from 'node:crypto';
import { db, APP_ID } from './config';
import { getAccountDetails, getTransactions } from './mono/monoClient';
import { mapAndDeduplicate } from './mono/transactionMapper';
import type { BankConnectionDoc, MonoWebhookEvent } from './mono/monoTypes';

const BATCH_CHUNK_SIZE = 400;
/** Keep seen event fingerprints for 24 hours to detect replays */
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

/**
 * Generate a short fingerprint from the raw request body for replay detection.
 */
function eventFingerprint(rawBody: string): string {
    return createHash('sha256').update(rawBody).digest('hex').slice(0, 32);
}

/**
 * Check if this event was already processed (replay attack detection).
 * Uses a Firestore transaction to atomically claim the fingerprint slot,
 * preventing TOCTOU races under concurrent delivery.
 * Returns true if it is a replay.
 */
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

async function handleAccountUpdated(monoAccountId: string): Promise<void> {
    // Find the connection
    const connSnap = await db.collectionGroup('bankConnections')
        .where('monoAccountId', '==', monoAccountId)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (connSnap.empty) {
        console.warn(`[Webhook] No active connection for Mono account ${monoAccountId}`);
        return;
    }

    const connDoc = connSnap.docs[0];
    const connection = connDoc.data() as BankConnectionDoc;
    const { userId, anchorAccountId } = connection;
    const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId);
    const accountRef = userRef.collection('accounts').doc(anchorAccountId);

    const accountSnap = await accountRef.get();
    if (!accountSnap.exists || accountSnap.data()?.source !== 'linked') return;

    const currency = accountSnap.data()!.currency === 'USD' ? 'USD' : 'NGN';

    // Fetch latest data from Mono
    const [details, txResponse] = await Promise.all([
        getAccountDetails(monoAccountId),
        getTransactions(monoAccountId, { paginate: false }),
    ]);

    // Deduplicate
    const existingSnap = await userRef.collection('finance')
        .where('accountId', '==', anchorAccountId)
        .where('source', '==', 'synced')
        .select('externalTransactionId')
        .get();

    const existingIds = new Set<string>();
    existingSnap.docs.forEach((doc) => {
        const extId = doc.data().externalTransactionId;
        if (extId) existingIds.add(extId);
    });

    const newTxns = mapAndDeduplicate(txResponse.data, anchorAccountId, currency, existingIds);

    // Write new transactions
    for (let i = 0; i < newTxns.length; i += BATCH_CHUNK_SIZE) {
        const chunk = newTxns.slice(i, i + BATCH_CHUNK_SIZE);
        const batch = db.batch();
        for (const tx of chunk) {
            batch.set(userRef.collection('finance').doc(), {
                ...tx,
                createdAt: new Date().toISOString(),
                isSoftDeleted: false,
            });
        }
        await batch.commit();
    }

    // Update balance
    await accountRef.update({
        balanceCents: Math.round(details.account.balance * 100),
        'externalConnection.lastSyncedAt': new Date().toISOString(),
        'externalConnection.syncStatus': 'active',
    });

    await connDoc.ref.update({ lastSyncAt: new Date().toISOString() });

    if (newTxns.length > 0) {
        console.log(`[Webhook] Synced ${newTxns.length} txns for ${anchorAccountId}`);
    }
}

async function handleReauthorisation(monoAccountId: string): Promise<void> {
    const connSnap = await db.collectionGroup('bankConnections')
        .where('monoAccountId', '==', monoAccountId)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (connSnap.empty) return;

    const connDoc = connSnap.docs[0];
    const connection = connDoc.data() as BankConnectionDoc;
    const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(connection.userId);
    const accountRef = userRef.collection('accounts').doc(connection.anchorAccountId);

    await accountRef.update({ 'externalConnection.syncStatus': 'reconnect_required' });
    await connDoc.ref.update({ status: 'reconnect_required' });

    console.log(`[Webhook] Reauth required for account ${connection.anchorAccountId}`);
}

/**
 * HTTP endpoint that Mono calls with webhook events.
 */
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
