"use strict";
/**
 * Family Triggers — Firestore write trigger, scheduled cleanup, migration
 *
 * Background / scheduled functions that support the family mode feature.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupExpiredInvitations = exports.onSharedTransactionWrite = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const config_1 = require("./config");
const helpers_1 = require("./helpers");
// ============================================================================
// Firestore Trigger — Shared Transaction Notification
// ============================================================================
exports.onSharedTransactionWrite = (0, firestore_1.onDocumentWritten)('artifacts/{appId}/users/{userId}/finance/{transactionId}', async (event) => {
    const { userId, transactionId } = event.params;
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    let action;
    if (!before && after)
        action = 'added';
    else if (before && !after)
        action = 'deleted';
    else if (before && after)
        action = 'modified';
    else
        return;
    const txData = after || before;
    if (!txData?.accountId)
        return;
    const accountRef = config_1.db.collection('artifacts').doc(config_1.APP_ID)
        .collection('users').doc(userId)
        .collection('accounts').doc(txData.accountId);
    const accountDoc = await accountRef.get();
    if (!accountDoc.exists)
        return;
    const accountData = accountDoc.data();
    const sharedWith = accountData?.sharedWith || {};
    const sharedUserIds = Object.keys(sharedWith);
    if (sharedUserIds.length === 0)
        return;
    const actorProfileRef = config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('users').doc(userId);
    const actorProfile = await actorProfileRef.get();
    const actorName = actorProfile.data()?.name || 'Family member';
    const amount = Math.abs(txData.amountCents / 100).toFixed(2);
    const currency = txData.currency || 'NGN';
    const formattedAmount = `${currency} ${amount}`;
    const description = txData.description || 'transaction';
    const notifications = [];
    for (const sharedUserId of sharedUserIds) {
        if (sharedUserId === userId)
            continue;
        let message;
        let title;
        switch (action) {
            case 'added':
                title = 'Transaction Added';
                message = `${actorName} added ${description} - ${formattedAmount}`;
                break;
            case 'modified':
                title = 'Transaction Updated';
                message = `${actorName} updated ${description}`;
                break;
            case 'deleted':
                title = 'Transaction Deleted';
                message = `${actorName} deleted ${description}`;
                break;
        }
        notifications.push((0, helpers_1.createNotification)(sharedUserId, `shared_transaction_${action}`, title, message, userId, actorName, { accountId: txData.accountId, accountName: accountData?.name, transactionId }));
        notifications.push((0, helpers_1.createAuditLog)(`shared_tx_${action}`, userId, {
            transactionId, accountId: txData.accountId,
            notifiedUsers: sharedUserIds.filter(id => id !== userId),
        }));
    }
    await Promise.all(notifications);
    return;
});
// ============================================================================
// Scheduled Cleanup — Expired Invitations
// ============================================================================
exports.cleanupExpiredInvitations = (0, scheduler_1.onSchedule)({ schedule: '0 3 * * *', timeZone: 'UTC' }, async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const invitationsRef = config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('family_invitations');
    try {
        const expiredQuery = invitationsRef
            .where('expiresAt', '<', now.toISOString())
            .where('status', '==', 'pending');
        const expiredSnap = await expiredQuery.get();
        if (!expiredSnap.empty) {
            const batch = config_1.db.batch();
            expiredSnap.docs.forEach(doc => batch.update(doc.ref, { status: 'expired' }));
            await batch.commit();
            console.log(`Marked ${expiredSnap.size} invitations as expired`);
        }
        const oldQuery = invitationsRef.where('createdAt', '<', thirtyDaysAgo.toISOString());
        const oldSnap = await oldQuery.get();
        if (!oldSnap.empty) {
            const batch = config_1.db.batch();
            oldSnap.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log(`Deleted ${oldSnap.size} old invitations`);
        }
        return;
    }
    catch (error) {
        console.error('Invitation cleanup failed:', error);
        throw error;
    }
});
//# sourceMappingURL=familyTriggers.js.map