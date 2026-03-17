import { db, APP_ID } from './config';
import { getAccountDetails, getTransactions } from './mono/monoClient';
import { mapAndDeduplicate } from './mono/transactionMapper';
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

    // Fetch balance + transactions from Mono
    let details, txResponse;
    try {
        [details, txResponse] = await Promise.all([
            getAccountDetails(monoAccountId),
            getTransactions(monoAccountId, { paginate: false }),
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
    const newTransactions = mapAndDeduplicate(txResponse.data, anchorAccountId, currency, existingIds);

    // Write new transactions in batches
    for (let i = 0; i < newTransactions.length; i += BATCH_CHUNK_SIZE) {
        const chunk = newTransactions.slice(i, i + BATCH_CHUNK_SIZE);
        const batch = db.batch();
        for (const tx of chunk) {
            const txRef = userRef.collection('finance').doc();
            batch.set(txRef, {
                ...tx,
                createdAt: new Date().toISOString(),
                isSoftDeleted: false,
            });
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
        console.log(`[BankSync] Synced ${newTransactions.length} new txns for ${anchorAccountId}`);
    }

    return newTransactions.length;
}
