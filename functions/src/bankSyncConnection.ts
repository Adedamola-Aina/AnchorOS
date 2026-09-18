import { logger } from 'firebase-functions';
import { db, APP_ID } from './config';
import { getAccountDetails, getAllTransactions } from './mono/monoClient';
import { mapAndDeduplicate, financeDocId } from './mono/transactionMapper';
import type { BankConnectionDoc } from './mono/monoTypes';

const BATCH_CHUNK_SIZE = 400;

/**
 * Sync transactions for a single bank connection.
 * Returns the number of new transactions written.
 */
export async function syncConnection(
    connection: BankConnectionDoc,
    connectionRef: FirebaseFirestore.DocumentReference,
): Promise<number> {
    const { monoAccountId, anchorAccountId, userId } = connection;
    const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId);
    const accountRef = userRef.collection('accounts').doc(anchorAccountId);

    // Verify account still exists and is linked
    const accountSnap = await accountRef.get();
    if (!accountSnap.exists || accountSnap.data()?.source !== 'linked') return 0;

    const accountData = accountSnap.data()!;
    const currency = accountData.currency === 'USD' ? 'USD' : 'NGN';

    // Fetch balance + the WHOLE transaction history (FI-03: follow paging.next)
    let details, history;
    try {
        [details, history] = await Promise.all([
            getAccountDetails(monoAccountId),
            getAllTransactions(monoAccountId),
        ]);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);

        // Mark as reconnect_required if auth expired
        if (message.includes('401') || message.includes('REAUTHORISATION')) {
            await accountRef.update({ 'externalConnection.syncStatus': 'reconnect_required' });
            await connectionRef.update({ status: 'reconnect_required' });
            console.warn(`[BankSync] Reconnect required for account ${anchorAccountId}`);
        } else {
            console.error(`[BankSync] Sync failed for ${anchorAccountId}:`, message);
        }
        return 0;
    }

    // Gather existing external IDs to deduplicate
    const existingTxSnap = await userRef.collection('finance')
        .where('accountId', '==', anchorAccountId)
        .where('source', '==', 'synced')
        .select('externalTransactionId')
        .get();

    const existingIds = new Set<string>();
    existingTxSnap.docs.forEach((doc) => {
        const extId = doc.data().externalTransactionId;
        if (extId) existingIds.add(extId);
    });

    // Map and deduplicate
    const newTransactions = mapAndDeduplicate(history.transactions, anchorAccountId, currency, existingIds);

    if (history.truncated) {
        logger.warn(
            `[BankSync] Transaction history truncated for ${anchorAccountId}: ` +
            `imported ${history.transactions.length} of ${history.total} rows in ${history.pages} pages`,
        );
    }

    // Write new transactions in batches
    for (let i = 0; i < newTransactions.length; i += BATCH_CHUNK_SIZE) {
        const chunk = newTransactions.slice(i, i + BATCH_CHUNK_SIZE);
        const batch = db.batch();
        for (const tx of chunk) {
            // FI-18: deterministic ids, so a concurrent sync overwrites rather than
            // inserting a second copy of the same provider transaction.
            const externalId = tx.externalTransactionId;
            batch.set(
                externalId
                    ? userRef.collection('finance').doc(financeDocId(anchorAccountId, externalId))
                    : userRef.collection('finance').doc(),
                {
                    ...tx,
                    createdAt: new Date().toISOString(),
                    isSoftDeleted: false,
                },
            );
        }
        await batch.commit();
    }

    // Update balance
    const newBalanceCents = Math.round(details.account.balance * 100);
    await accountRef.update({
        balanceCents: newBalanceCents,
        'externalConnection.lastSyncedAt': new Date().toISOString(),
        'externalConnection.syncStatus': 'active',
    });

    await connectionRef.update({ lastSyncAt: new Date().toISOString(), status: 'active' });

    if (newTransactions.length > 0) {
        logger.info(`[BankSync] Synced ${newTransactions.length} new txns for ${anchorAccountId}`);
    }

    return newTransactions.length;
}
