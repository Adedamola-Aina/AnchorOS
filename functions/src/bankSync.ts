/**
 * Bank Sync — scheduled and on-demand transaction sync via Mono
 *
 * Pulls transaction history and balance updates from linked bank accounts.
 * Deduplicates against existing externalTransactionId values.
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createFinanceAuditLog } from './helpers';
import { getAccountDetails, getTransactions } from './mono/monoClient';
import { mapAndDeduplicate } from './mono/transactionMapper';
import type { BankConnectionDoc } from './mono/monoTypes';

const BATCH_CHUNK_SIZE = 400;

/**
 * Sync transactions for a single bank connection.
 * Returns the number of new transactions written.
 */
async function syncConnection(connection: BankConnectionDoc, connectionRef: FirebaseFirestore.DocumentReference): Promise<number> {
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
            await accountRef.update({
                'externalConnection.syncStatus': 'reconnect_required',
            });
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
    const newTransactions = mapAndDeduplicate(
        txResponse.data, anchorAccountId, currency, existingIds,
    );

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

    // Update connection timestamp
    await connectionRef.update({ lastSyncAt: new Date().toISOString(), status: 'active' });

    if (newTransactions.length > 0) {
        console.log(`[BankSync] Synced ${newTransactions.length} new txns for ${anchorAccountId}`);
    }

    return newTransactions.length;
}

/**
 * Scheduled sync — runs every 6 hours, syncs all active bank connections.
 */
export const syncBankTransactions = onSchedule(
    { schedule: 'every 6 hours', timeZone: 'UTC', secrets: ['MONO_SECRET_KEY'] },
    async () => {
        console.log('[BankSync] Starting scheduled sync...');

        // Query all active connections across all users
        const connectionsSnap = await db.collectionGroup('bankConnections')
            .where('status', '==', 'active')
            .get();

        if (connectionsSnap.empty) {
            console.log('[BankSync] No active connections to sync.');
            return;
        }

        console.log(`[BankSync] Found ${connectionsSnap.size} active connection(s).`);
        let totalSynced = 0;

        for (const doc of connectionsSnap.docs) {
            const connection = doc.data() as BankConnectionDoc;
            try {
                const count = await syncConnection(connection, doc.ref);
                totalSynced += count;
            } catch (err) {
                console.error(`[BankSync] Error syncing ${connection.anchorAccountId}:`, err);
            }
        }

        console.log(`[BankSync] Completed. Total new transactions: ${totalSynced}`);
    },
);

/**
 * On-demand sync — lets a user manually refresh their linked account.
 */
export const syncBankAccountNow = onCall(
    { secrets: ['MONO_SECRET_KEY'] },
    async (request) => {
        if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required.');
        const uid = request.auth.uid;
        const { accountId } = request.data as { accountId?: string };
        if (!accountId || typeof accountId !== 'string') {
            throw new HttpsError('invalid-argument', 'Account ID is required.');
        }

        await enforceRateLimit('bankSync', uid);

        const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(uid);
        const connSnap = await userRef.collection('bankConnections')
            .where('anchorAccountId', '==', accountId)
            .where('status', 'in', ['active', 'reconnect_required'])
            .limit(1)
            .get();

        if (connSnap.empty) {
            throw new HttpsError('not-found', 'No active bank connection for this account.');
        }

        const connDoc = connSnap.docs[0];
        const connection = connDoc.data() as BankConnectionDoc;
        const count = await syncConnection(connection, connDoc.ref);

        await createFinanceAuditLog('bank_sync_manual', uid, {
            accountId, newTransactions: count,
        });

        return { synced: count };
    },
);
