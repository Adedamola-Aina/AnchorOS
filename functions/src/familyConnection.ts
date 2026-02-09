/**
 * Family Connection — accept, confirm, disconnect
 *
 * Handles the second half of the invitation lifecycle (verification +
 * connection establishment) and the disconnect flow.
 */

import * as functions from 'firebase-functions';
import * as bcrypt from 'bcrypt';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog, createNotification } from './helpers';
import type { FamilyInvitation, FamilyConnection } from './types';

// ============================================================================
// Accept Invitation (invitee enters verification code)
// ============================================================================

export const acceptInvitation = functions.https.onCall(
    async (data: { inviteId: string; verificationCode: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId, verificationCode } = data;
        const inviteeUid = context.auth.uid;

        await enforceRateLimit('codeVerification', inviteId);

        const inviteRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations').doc(inviteId);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Invitation not found');
        }

        const invite = inviteDoc.data() as FamilyInvitation;

        if (invite.status === 'locked') {
            throw new functions.https.HttpsError('failed-precondition', 'This invitation is locked due to too many failed attempts');
        }
        if (invite.status !== 'pending') {
            throw new functions.https.HttpsError('failed-precondition', 'This invitation is no longer valid');
        }
        if (new Date(invite.expiresAt) < new Date()) {
            await inviteRef.update({ status: 'expired' });
            throw new functions.https.HttpsError('failed-precondition', 'This invitation has expired');
        }

        const codeMatch = await bcrypt.compare(verificationCode, invite.verificationCodeHash);

        if (!codeMatch) {
            const newAttempts = invite.verificationAttempts + 1;

            if (newAttempts >= 5) {
                await inviteRef.update({
                    status: 'locked',
                    lockedAt: new Date().toISOString(),
                    verificationAttempts: newAttempts,
                });
                await createAuditLog('invitation_locked', inviteeUid, { inviteId, attempts: newAttempts });
                throw new functions.https.HttpsError('failed-precondition', 'Too many failed attempts. Invitation locked.');
            }

            await inviteRef.update({ verificationAttempts: newAttempts });
            await createAuditLog('verification_failed', inviteeUid, { inviteId, attempts: newAttempts });

            return { success: false, attemptsRemaining: 5 - newAttempts };
        }

        await inviteRef.update({
            status: 'awaiting_confirmation',
            inviteeUid,
            acceptedAt: new Date().toISOString(),
        });

        await createNotification(
            invite.ownerUid,
            'invitation_accepted',
            'Family Invitation Accepted',
            `${context.auth.token.email} has accepted your invitation and entered the correct verification code. Please confirm the connection.`,
            inviteeUid,
            context.auth.token.email || 'Unknown'
        );

        await createAuditLog('verification_success', inviteeUid, { inviteId });
        await createAuditLog('invitation_accepted', inviteeUid, { inviteId, ownerUid: invite.ownerUid });

        return { success: true };
    }
);

// ============================================================================
// Confirm Connection (owner confirms after invitee accepts)
// ============================================================================

export const confirmConnection = functions.https.onCall(
    async (data: { inviteId: string; password: string; confirmed: boolean }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId, confirmed } = data;
        const ownerUid = context.auth.uid;

        await enforceRateLimit('invite', ownerUid);

        const inviteRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations').doc(inviteId);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Invitation not found');
        }

        const invite = inviteDoc.data() as FamilyInvitation;

        if (invite.ownerUid !== ownerUid) {
            throw new functions.https.HttpsError('permission-denied', 'Only the invitation owner can confirm');
        }
        if (invite.status !== 'awaiting_confirmation') {
            throw new functions.https.HttpsError('failed-precondition', 'Invitation is not awaiting confirmation');
        }
        if (!invite.inviteeUid) {
            throw new functions.https.HttpsError('failed-precondition', 'Invitee has not accepted yet');
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
