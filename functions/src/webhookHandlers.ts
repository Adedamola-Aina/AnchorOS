import { logger } from 'firebase-functions';
import { db, APP_ID } from './config';
import { getAccountDetails, getTransactions } from './mono/monoClient';
import { mapAndDeduplicate } from './mono/transactionMapper';
import type { BankConnectionDoc, MonoWebhookEvent } from './mono/monoTypes';

const BATCH_CHUNK_SIZE = 400;

export async function handleAccountUpdated(monoAccountId: string): Promise<void> {
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

    const [details, txResponse] = await Promise.all([
        getAccountDetails(monoAccountId),
        getTransactions(monoAccountId, { paginate: false }),
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

    const newTxns = mapAndDeduplicate(txResponse.data, anchorAccountId, currency, existingIds);

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

    await accountRef.update({
        balanceCents: Math.round(details.account.balance * 100),
        'externalConnection.lastSyncedAt': new Date().toISOString(),
        'externalConnection.syncStatus': 'active',
    });

    await connDoc.ref.update({ lastSyncAt: new Date().toISOString() });

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
