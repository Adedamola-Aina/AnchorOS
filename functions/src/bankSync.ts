/**
 * Bank Sync — scheduled and on-demand transaction sync via Mono
 *
 * Pulls transaction history and balance updates from linked bank accounts.
 * Deduplicates against existing externalTransactionId values.
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createFinanceAuditLog } from './helpers';
import type { BankConnectionDoc } from './mono/monoTypes';
import { syncConnection } from './bankSyncConnection';

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
export const syncBankAccountNow = secureOnCall(
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
