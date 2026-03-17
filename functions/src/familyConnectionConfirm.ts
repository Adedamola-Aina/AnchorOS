import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog, createNotification } from './helpers';
import type { FamilyInvitation, FamilyConnection } from './types';

/**
 * Confirm Connection — owner confirms after the invitee has accepted.
 */
export const confirmConnection = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId, confirmed } = request.data as { inviteId: string; password: string; confirmed: boolean };
        const ownerUid = request.auth.uid;

        await enforceRateLimit('invite', ownerUid);

        const inviteRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations').doc(inviteId);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            throw new HttpsError('not-found', 'Invitation not found');
        }

        const invite = inviteDoc.data() as FamilyInvitation;

        if (invite.ownerUid !== ownerUid) {
            throw new HttpsError('permission-denied', 'Only the invitation owner can confirm');
        }
        if (invite.status !== 'awaiting_confirmation') {
            throw new HttpsError('failed-precondition', 'Invitation is not awaiting confirmation');
        }
        if (!invite.inviteeUid) {
            throw new HttpsError('failed-precondition', 'Invitee has not accepted yet');
        }

        if (!confirmed) {
            await inviteRef.update({ status: 'rejected' });

            await createNotification(
                invite.inviteeUid,
                'invitation_rejected',
                'Family Connection Declined',
                `${invite.ownerDisplayName} has declined the family connection.`,
                ownerUid,
                invite.ownerDisplayName
            );

            await createAuditLog('connection_rejected', ownerUid, { inviteId, inviteeUid: invite.inviteeUid });
            return { success: true, rejected: true };
        }

        const inviteeProfileRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(invite.inviteeUid);
        const inviteeProfile = await inviteeProfileRef.get();
        const memberDisplayName = inviteeProfile.data()?.name || invite.inviteeEmail.split('@')[0];

        const connectionId = `${ownerUid}_${invite.inviteeUid}`;
        const connectionRef = db.collection('artifacts').doc(APP_ID).collection('family_connections').doc(connectionId);
        const connection: FamilyConnection = {
            id: connectionRef.id,
            ownerUid,
            memberUid: invite.inviteeUid,
            ownerDisplayName: invite.ownerDisplayName,
            memberDisplayName,
            status: 'active',
            connectedAt: new Date().toISOString(),
        };

        await connectionRef.set(connection);
        await inviteRef.update({ status: 'accepted', confirmedAt: new Date().toISOString() });

        await createNotification(
            ownerUid, 'family_connected', '🎉 Family Connected!',
            `You're now connected with ${memberDisplayName}. No accounts are shared yet. Go to Finance to choose which accounts to share.`,
            invite.inviteeUid, memberDisplayName
        );
        await createNotification(
            invite.inviteeUid, 'family_connected', '👥 Family Connected!',
            `You're now connected to ${invite.ownerDisplayName}'s household. They'll choose which accounts to share with you. Shared accounts will appear in your Finance section once they do.`,
            ownerUid, invite.ownerDisplayName
        );

        await createAuditLog('connection_confirmed', ownerUid, {
            inviteId, inviteeUid: invite.inviteeUid, connectionId: connectionRef.id,
        });

        return {
            success: true,
            redirect: '/finance',
            message: `You're now connected with ${memberDisplayName}. No accounts are shared yet. Go to Finance to choose which accounts to share.`,
            memberName: memberDisplayName,
        };
    }
);
