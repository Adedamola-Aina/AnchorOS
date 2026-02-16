"use strict";
/**
 * Shared Transactions — member-initiated writes + scope migration
 *
 * Allows family members to add transactions to shared accounts and
 * provides a one-time migration to fix account scope flags.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixSharedAccountScopes = exports.addTransactionToSharedAccount = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const config_1 = require("./config");
const rateLimit_1 = require("./rateLimit");
// ============================================================================
// Add Transaction to Shared Account
// ============================================================================
exports.addTransactionToSharedAccount = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated');
    }
    await (0, rateLimit_1.enforceRateLimit)('transactionCreate', request.auth.uid);
    const callerUid = request.auth.uid;
    const { accountId, transaction } = request.data;
    if (!accountId || !transaction) {
        throw new https_1.HttpsError('invalid-argument', 'accountId and transaction are required');
    }
    const sentOwnerId = request.data.accountOwnerId;
    if (!sentOwnerId) {
        throw new https_1.HttpsError('invalid-argument', 'accountOwnerId is required for shared transactions');
    }
    const accountRef = config_1.db.collection('artifacts').doc(config_1.APP_ID)
        .collection('users').doc(sentOwnerId)
        .collection('accounts').doc(accountId);
    const accountSnap = await accountRef.get();
    if (!accountSnap.exists) {
        throw new https_1.HttpsError('not-found', 'Account not found');
    }
    const accountData = accountSnap.data();
    const isOwner = accountData.ownerId === callerUid || !accountData.ownerId;
    const hasSharedAccess = accountData.sharedWith?.[callerUid];
    if (!isOwner && !hasSharedAccess) {
        throw new https_1.HttpsError('permission-denied', 'You do not have access to this account');
    }
    const callerDoc = await config_1.db.collection('artifacts').doc(config_1.APP_ID)
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
    const transactionsRef = config_1.db.collection('artifacts').doc(config_1.APP_ID)
        .collection('users').doc(sentOwnerId)
        .collection('finance');
    const newTransactionRef = await transactionsRef.add(transactionData);
    const balanceChange = transaction.type === 'income'
        ? transaction.amountCents
        : -transaction.amountCents;
    await accountRef.update({
        balanceCents: firestore_1.FieldValue.increment(balanceChange),
    });
    return { success: true, transactionId: newTransactionRef.id };
});
// ============================================================================
// One-Time Migration: Fix Shared Account Scopes
// ============================================================================
exports.fixSharedAccountScopes = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const userId = request.auth.uid;
    const accountsSnapshot = await config_1.db
        .collection('artifacts')
        .doc(config_1.APP_ID)
        .collection('users')
        .doc(userId)
        .collection('accounts')
        .get();
    const batch = config_1.db.batch();
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
});
//# sourceMappingURL=sharedTransactions.js.map