import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog, createNotification, getActiveConnection } from './helpers';

/**
 * Disconnect Family — marks the family connection as disconnected
 * and revokes all shared account access.
 */
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
