/**
 * Family Connection — accept, confirm, disconnect
 *
 * Handles the second half of the invitation lifecycle (verification +
 * connection establishment) and the disconnect flow.
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import * as bcrypt from 'bcrypt';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createAuditLog, createNotification } from './helpers';
import type { FamilyInvitation } from './types';

export { confirmConnection } from './familyConnectionConfirm';

// ============================================================================
// Accept Invitation (invitee enters verification code)
// ============================================================================

export const acceptInvitation = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId, verificationCode } = request.data as { inviteId: string; verificationCode: string };
        const inviteeUid = request.auth.uid;

        await enforceRateLimit('codeVerification', inviteId);

        const inviteRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations').doc(inviteId);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            throw new HttpsError('not-found', 'Invitation not found');
        }

        const invite = inviteDoc.data() as FamilyInvitation;

        if (invite.status === 'locked') {
            throw new HttpsError('failed-precondition', 'This invitation is locked due to too many failed attempts');
        }
        if (invite.status !== 'pending') {
            throw new HttpsError('failed-precondition', 'This invitation is no longer valid');
        }
        if (new Date(invite.expiresAt) < new Date()) {
            await inviteRef.update({ status: 'expired' });
            throw new HttpsError('failed-precondition', 'This invitation has expired');
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
                throw new HttpsError('failed-precondition', 'Too many failed attempts. Invitation locked.');
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
            `${request.auth.token.email} has accepted your invitation and entered the correct verification code. Please confirm the connection.`,
            inviteeUid,
            request.auth.token.email || 'Unknown'
        );

        await createAuditLog('verification_success', inviteeUid, { inviteId });
        await createAuditLog('invitation_accepted', inviteeUid, { inviteId, ownerUid: invite.ownerUid });

        return { success: true };
    }
);
