"use strict";
/**
 * Family Sharing — account sharing, notifications, triggers, maintenance
 *
 * Runtime operations for shared accounts, notification management,
 * Firestore write trigger, scheduled cleanup, and v1→v2 migration.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFamily = exports.getSharedAccountsWithMe = exports.shareAccount = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const config_1 = require("./config");
const rateLimit_1 = require("./rateLimit");
const helpers_1 = require("./helpers");
// ============================================================================
// Share / Unshare Account
// ============================================================================
exports.shareAccount = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const { accountId, share } = request.data;
    const ownerUid = request.auth.uid;
    await (0, rateLimit_1.enforceRateLimit)('shareAccount', ownerUid);
    const connection = await (0, helpers_1.getActiveConnection)(ownerUid);
    if (!connection) {
        throw new https_1.HttpsError('failed-precondition', 'No active family connection');
    }
    if (connection.ownerUid !== ownerUid) {
        throw new https_1.HttpsError('permission-denied', 'Only the account owner can share accounts');
    }
    const memberUid = connection.memberUid;
    const accountRef = config_1.db.collection('artifacts').doc(config_1.APP_ID)
        .collection('users').doc(ownerUid)
        .collection('accounts').doc(accountId);
    const accountDoc = await accountRef.get();
    if (!accountDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Account not found');
    }
    const accountName = accountDoc.data()?.name || 'Unknown Account';
    if (share) {
        await accountRef.update({
            [`sharedWith.${memberUid}`]: { grantedAt: new Date().toISOString(), grantedBy: ownerUid },
            scope: 'family',
        });
        await (0, helpers_1.createNotification)(memberUid, 'account_shared', '👥 Account Shared', `${connection.ownerDisplayName} has shared "${accountName}" with you. You can now view and add transactions.`, ownerUid, connection.ownerDisplayName, { accountId, accountName });
        await (0, helpers_1.createAuditLog)('account_shared', ownerUid, { accountId, accountName, memberUid });
    }
    else {
        await accountRef.update({
            [`sharedWith.${memberUid}`]: firestore_1.FieldValue.delete(),
        });
        await (0, helpers_1.createNotification)(memberUid, 'account_unshared', 'Account Access Removed', `Access to "${accountName}" has been removed.`, ownerUid, connection.ownerDisplayName, { accountId, accountName });
        await (0, helpers_1.createAuditLog)('account_unshared', ownerUid, { accountId, accountName, memberUid });
    }
    return { success: true };
});
// ============================================================================
// Get Shared Accounts With Me
// ============================================================================
exports.getSharedAccountsWithMe = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const memberUid = request.auth.uid;
    const accountsQuery = config_1.db.collectionGroup('accounts')
        .where(`sharedWith.${memberUid}.grantedAt`, '!=', null);
    const snapshot = await accountsQuery.get();
    const sharedAccounts = snapshot.docs.map(doc => {
        const data = doc.data();
        const pathParts = doc.ref.path.split('/');
        const ownerUid = pathParts[3];
        return {
            id: doc.id,
            ownerUid,
            name: data.name,
            type: data.type,
            balanceCents: data.balanceCents,
            currency: data.currency,
            color: data.color,
            scope: data.scope || 'family',
            sharedAt: data.sharedWith?.[memberUid]?.grantedAt,
        };
    });
    return { accounts: sharedAccounts };
});
// ============================================================================
// Disconnect Family
// ============================================================================
exports.disconnectFamily = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const callerUid = request.auth.uid;
    await (0, rateLimit_1.enforceRateLimit)('disconnectFamily', callerUid);
    const connection = await (0, helpers_1.getActiveConnection)(callerUid);
    if (!connection) {
        throw new https_1.HttpsError('failed-precondition', 'No active family connection');
    }
    const isOwner = connection.ownerUid === callerUid;
    const otherUid = isOwner ? connection.memberUid : connection.ownerUid;
    const connectionRef = config_1.db.collection('artifacts').doc(config_1.APP_ID)
        .collection('family_connections').doc(connection.id);
    await connectionRef.update({
        status: 'disconnected',
        disconnectedAt: new Date().toISOString(),
        disconnectedBy: callerUid,
    });
    if (isOwner) {
        const accountsRef = config_1.db.collection('artifacts').doc(config_1.APP_ID)
            .collection('users').doc(callerUid).collection('accounts');
        const accountsSnapshot = await accountsRef.get();
        const batch = config_1.db.batch();
        accountsSnapshot.docs.forEach(doc => {
            const docData = doc.data();
            if (docData.sharedWith?.[otherUid]) {
                batch.update(doc.ref, {
                    [`sharedWith.${otherUid}`]: firestore_1.FieldValue.delete(),
                });
            }
        });
        await batch.commit();
    }
    const callerName = isOwner ? connection.ownerDisplayName : connection.memberDisplayName;
    await (0, helpers_1.createNotification)(otherUid, 'family_disconnected', 'Family Disconnected', isOwner
        ? `${callerName} has removed you from their household. All shared account access has been revoked.`
        : `${callerName} has left your household.`, callerUid, callerName);
    await (0, helpers_1.createAuditLog)(isOwner ? 'member_removed' : 'member_left', callerUid, {
        connectionId: connection.id, otherUid,
    });
    return { success: true };
});
//# sourceMappingURL=familySharing.js.map