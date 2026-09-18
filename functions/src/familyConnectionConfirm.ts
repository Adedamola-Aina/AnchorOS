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
        const connectionsRef = db.collection('artifacts').doc(APP_ID).collection('family_connections');
        const connectionRef = connectionsRef.doc(connectionId);
        const connection: FamilyConnection = {
            id: connectionRef.id,
            ownerUid,
            memberUid: invite.inviteeUid,
            ownerDisplayName: invite.ownerDisplayName,
            memberDisplayName,
            status: 'active',
            connectedAt: new Date().toISOString(),
        };

        // FS-03 (decision AM-1 option a): enforce ONE active household per side.
        // Without this guard an owner — or an invitee — can hold two active
        // connections, and the family predicate then treats both as authoritative
        // grants. Atomic so two concurrent confirms cannot both pass the check;
        // the (ownerUid,status) and (memberUid,status) composite indexes already
        // exist for these queries.
        await db.runTransaction(async (transaction) => {
            const [activeAsOwner, activeAsMember] = await Promise.all([
                transaction.get(connectionsRef.where('ownerUid', '==', ownerUid).where('status', '==', 'active')),
                transaction.get(connectionsRef.where('memberUid', '==', invite.inviteeUid).where('status', '==', 'active')),
            ]);

            // A retry after a successful confirm must stay idempotent, so ignore
            // the connection this call is about to (re)write.
            if (activeAsOwner.docs.some((d) => d.id !== connectionId)) {
                throw new HttpsError(
                    'failed-precondition',
                    'You already have an active family connection. Disconnect it before connecting to someone else.'
                );
            }
            if (activeAsMember.docs.some((d) => d.id !== connectionId)) {
                throw new HttpsError(
                    'failed-precondition',
                    'That person is already connected to another household.'
                );
            }

            transaction.set(connectionRef, connection);
            transaction.update(inviteRef, { status: 'accepted', confirmedAt: new Date().toISOString() });
        });

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
