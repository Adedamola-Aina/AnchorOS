import { logger } from 'firebase-functions';
import { createHash } from 'node:crypto';
import { db, APP_ID } from './config';
import { getAccountDetails, getAllTransactions } from './mono/monoClient';
import { mapAndDeduplicate } from './mono/transactionMapper';
import type { BankConnectionDoc, MonoWebhookEvent } from './mono/monoTypes';

const BATCH_CHUNK_SIZE = 400;

/**
 * Deterministic, document-id-safe id for a synced finance document.
 *
 * The same provider transaction always maps to the same document, so a redelivery
 * or a concurrent duplicate delivery overwrites rather than inserting a second
 * copy. This is the durable idempotency guarantee for financial writes; the
 * connection's `lastProcessedEventId` marker is only a re-sync fast path.
 */
export function financeDocId(anchorAccountId: string, externalTransactionId: string): string {
    return createHash('sha256').update(`${anchorAccountId}:${externalTransactionId}`).digest('hex');
}

export async function handleAccountUpdated(monoAccountId: string, eventId?: string): Promise<void> {
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

    // FI-01: fast path only. A retry of an event that is not the most recently
    // applied one still reaches the sync below, where per-transaction identity
    // (deterministic finance doc ids + the existing-id filter) keeps it idempotent.
    if (eventId && connection.lastProcessedEventId === eventId) {
        logger.info(`[Webhook] Event ${eventId} already applied for ${connection.anchorAccountId}; skipping`);
        return;
    }

    const { userId, anchorAccountId } = connection;
    const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId);
    const accountRef = userRef.collection('accounts').doc(anchorAccountId);

    const accountSnap = await accountRef.get();
    if (!accountSnap.exists || accountSnap.data()?.source !== 'linked') return;

    const currency = accountSnap.data()!.currency === 'USD' ? 'USD' : 'NGN';

    const [details, history] = await Promise.all([
        getAccountDetails(monoAccountId),
        getAllTransactions(monoAccountId),
    ]);

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

    const newTxns = mapAndDeduplicate(history.transactions, anchorAccountId, currency, existingIds);

    if (history.truncated) {
        logger.warn(
            `[Webhook] Transaction history truncated for ${anchorAccountId}: ` +
            `imported ${history.transactions.length} of ${history.total} rows in ${history.pages} pages`,
        );
    }

    for (let i = 0; i < newTxns.length; i += BATCH_CHUNK_SIZE) {
        const chunk = newTxns.slice(i, i + BATCH_CHUNK_SIZE);
        const batch = db.batch();
        const financeCollection = userRef.collection('finance');
        for (const tx of chunk) {
            const externalId = tx.externalTransactionId;
            batch.set(
                externalId
                    ? financeCollection.doc(financeDocId(anchorAccountId, externalId))
                    : financeCollection.doc(),
                {
                    ...tx,
                    ...(eventId ? { appliedEventId: eventId } : {}),
                    createdAt: new Date().toISOString(),
                    isSoftDeleted: false,
                },
            );
        }
        await batch.commit();
    }

    await accountRef.update({
        balanceCents: Math.round(details.account.balance * 100),
        'externalConnection.lastSyncedAt': new Date().toISOString(),
        'externalConnection.syncStatus': 'active',
    });

    await connDoc.ref.update({
        lastSyncAt: new Date().toISOString(),
        ...(eventId ? { lastProcessedEventId: eventId } : {}),
    });

    if (newTxns.length > 0) {
        logger.info(`[Webhook] Synced ${newTxns.length} txns for ${anchorAccountId}`);
    }
}

export async function handleReauthorisation(monoAccountId: string): Promise<void> {
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

    logger.info(`[Webhook] Reauth required for account ${connection.anchorAccountId}`);
}

// Re-export the type narrowly so bankWebhook.ts can import it
export type { MonoWebhookEvent };
