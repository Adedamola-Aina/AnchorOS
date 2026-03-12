/**
 * Family Sharing — account sharing, notifications, triggers, maintenance
 *
 * Runtime operations for shared accounts, notification management,
 * Firestore write trigger, scheduled cleanup, and v1→v2 migration.
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog, createNotification, getActiveConnection } from './helpers';

// ============================================================================
// Share / Unshare Account
// ============================================================================

export const shareAccount = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { accountId, share } = request.data as { accountId: string; share: boolean };
        const ownerUid = request.auth.uid;

        await enforceRateLimit('shareAccount', ownerUid);

        const connection = await getActiveConnection(ownerUid);
        if (!connection) {
            throw new HttpsError('failed-precondition', 'No active family connection');
        }
        if (connection.ownerUid !== ownerUid) {
            throw new HttpsError('permission-denied', 'Only the account owner can share accounts');
        }

        const memberUid = connection.memberUid;
        const accountRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(ownerUid)
            .collection('accounts').doc(accountId);
        const accountDoc = await accountRef.get();

        if (!accountDoc.exists) {
            throw new HttpsError('not-found', 'Account not found');
        }

        const accountName = accountDoc.data()?.name || 'Unknown Account';

        if (share) {
            await accountRef.update({
                [`sharedWith.${memberUid}`]: { grantedAt: new Date().toISOString(), grantedBy: ownerUid },
                scope: 'family',
            });
            await createNotification(
                memberUid, 'account_shared', '👥 Account Shared',
                `${connection.ownerDisplayName} has shared "${accountName}" with you. You can now view and add transactions.`,
                ownerUid, connection.ownerDisplayName, { accountId, accountName }
            );
            await createAuditLog('account_shared', ownerUid, { accountId, accountName, memberUid });
        } else {
            await accountRef.update({
                [`sharedWith.${memberUid}`]: FieldValue.delete(),
            });
            await createNotification(
                memberUid, 'account_unshared', 'Account Access Removed',
                `Access to "${accountName}" has been removed.`,
                ownerUid, connection.ownerDisplayName, { accountId, accountName }
            );
            await createAuditLog('account_unshared', ownerUid, { accountId, accountName, memberUid });
        }

        return { success: true };
    }
);

// ============================================================================
// Get Shared Accounts With Me
// ============================================================================

export const getSharedAccountsWithMe = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const memberUid = request.auth.uid;
        await enforceRateLimit('getSharedAccounts', memberUid);

        const accountsQuery = db.collectionGroup('accounts')
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
    }
);

// ============================================================================
// Disconnect Family
// ============================================================================

export const disconnectFamily = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const callerUid = request.auth.uid;
        await enforceRateLimit('disconnectFamily', callerUid);

        const connection = await getActiveConnection(callerUid);
        if (!connection) {
            throw new HttpsError('failed-precondition', 'No active family connection');
        }

        const isOwner = connection.ownerUid === callerUid;
        const otherUid = isOwner ? connection.memberUid : connection.ownerUid;

        const connectionRef = db.collection('artifacts').doc(APP_ID)
            .collection('family_connections').doc(connection.id);

        await connectionRef.update({
            status: 'disconnected',
            disconnectedAt: new Date().toISOString(),
            disconnectedBy: callerUid,
        });

        // Always clean up shared accounts on the owner's side
        const ownerUid = connection.ownerUid;
        const memberUid = connection.memberUid;
        const accountsRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(ownerUid).collection('accounts');
        const accountsSnapshot = await accountsRef.get();
        const batch = db.batch();

        accountsSnapshot.docs.forEach(doc => {
            const docData = doc.data();
            if (docData.sharedWith?.[memberUid]) {
                batch.update(doc.ref, {
                    [`sharedWith.${memberUid}`]: FieldValue.delete(),
                });
            }
        });

        await batch.commit();

        const callerName = isOwner ? connection.ownerDisplayName : connection.memberDisplayName;
        await createNotification(
            otherUid, 'family_disconnected', 'Family Disconnected',
            isOwner
                ? `${callerName} has removed you from their household. All shared account access has been revoked.`
                : `${callerName} has left your household.`,
            callerUid, callerName
        );

        await createAuditLog(isOwner ? 'member_removed' : 'member_left', callerUid, {
            connectionId: connection.id, otherUid,
        });

        return { success: true };
    }
);
