/**
 * Shared Transactions — member-initiated writes + scope migration
 *
 * Allows family members to add transactions to shared accounts and
 * provides a one-time migration to fix account scope flags.
 */

import * as functions from 'firebase-functions';
import { admin, db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';

// ============================================================================
// Add Transaction to Shared Account
// ============================================================================

export const addTransactionToSharedAccount = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
        }

        await enforceRateLimit('transactionCreate', context.auth.uid);

        const callerUid = context.auth.uid;
        const { accountId, transaction } = data as {
            accountId: string;
            transaction: {
                title: string;
                amountCents: number;
                type: 'income' | 'expense';
                category: string;
                transactionDate?: string;
            };
        };

        if (!accountId || !transaction) {
            throw new functions.https.HttpsError('invalid-argument', 'accountId and transaction are required');
        }

        const sentOwnerId = (data as Record<string, unknown>).accountOwnerId as string | undefined;

        if (!sentOwnerId) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'accountOwnerId is required for shared transactions'
            );
        }

        const accountRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(sentOwnerId)
            .collection('accounts').doc(accountId);
        const accountSnap = await accountRef.get();

        if (!accountSnap.exists) {
            throw new functions.https.HttpsError('not-found', 'Account not found');
        }

        const accountData = accountSnap.data()!;

        const isOwner = accountData.ownerId === callerUid || !accountData.ownerId;
        const hasSharedAccess = accountData.sharedWith?.[callerUid];

        if (!isOwner && !hasSharedAccess) {
            throw new functions.https.HttpsError('permission-denied', 'You do not have access to this account');
        }

        const callerDoc = await db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(callerUid).get();
        const callerName = callerDoc.data()?.name || 'Family Member';

        const now = new Date();
        const transactionData = {
            title: transaction.title,
            amountCents: transaction.amountCents,
            type: transaction.type,
            category: transaction.category,
            accountId,
            accountName: accountData.name,
            currency: accountData.currency,
            scope: 'family',
            date: now.toISOString(),
            transactionDate: transaction.transactionDate || now.toISOString(),
            createdBy: callerUid,
            createdByName: callerName,
            accountOwnerId: sentOwnerId,
        };

        const transactionsRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(sentOwnerId)
            .collection('finance');
        const newTransactionRef = await transactionsRef.add(transactionData);

        const balanceChange = transaction.type === 'income'
            ? transaction.amountCents
            : -transaction.amountCents;

        await accountRef.update({
            balanceCents: admin.firestore.FieldValue.increment(balanceChange),
        });

        return { success: true, transactionId: newTransactionRef.id };
    }
);

// ============================================================================
// One-Time Migration: Fix Shared Account Scopes
// ============================================================================

export const fixSharedAccountScopes = functions.https.onCall(
    async (_data: unknown, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const userId = context.auth.uid;

        const accountsSnapshot = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(userId)
            .collection('accounts')
            .get();

        const batch = db.batch();
        let fixedCount = 0;

        for (const accountDoc of accountsSnapshot.docs) {
            const data = accountDoc.data();

            if (data.sharedWith && Object.keys(data.sharedWith).length > 0) {
                if (data.scope !== 'family') {
                    batch.update(accountDoc.ref, { scope: 'family' });
                    fixedCount++;
                }
            }
        }

        if (fixedCount > 0) {
            await batch.commit();
        }

        return {
            success: true,
            accountsFixed: fixedCount,
            message: `Fixed ${fixedCount} shared account(s)`,
        };
    }
);
