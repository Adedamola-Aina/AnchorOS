/**
 * Family Invitations — create, revoke, validate, accept
 *
 * Handles the invitation lifecycle from creation through acceptance.
 * The confirmConnection step lives in familyConnection.ts.
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import * as bcrypt from 'bcrypt';
import { db, APP_ID, BCRYPT_SALT_ROUNDS, getResend, EMAIL_FROM } from './config';
import { enforceRateLimit } from './rateLimit';
import {
    createAuditLog,
    getActiveConnection,
    generateVerificationCode,
} from './helpers';
import { buildInvitationEmail } from './invitationEmailBuilder';
import type { FamilyInvitation } from './types';

// ============================================================================
// Create Invitation
// ============================================================================

export const createFamilyInvitation = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteeEmail, password: _password } = request.data as { inviteeEmail: string; password: string };
        const ownerUid = request.auth.uid;
        const ownerEmail = request.auth.token.email;

        if (!ownerEmail) {
            throw new HttpsError('failed-precondition', 'Your email must be verified');
        }

        if (!inviteeEmail || !_password) {
            throw new HttpsError('invalid-argument', 'Invitee email and password are required');
        }

        await enforceRateLimit('createInvitation', ownerUid);

        const invitationsRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations');
        const existingQuery = await invitationsRef
            .where('ownerUid', '==', ownerUid)
            .where('inviteeEmail', '==', inviteeEmail)
            .where('status', '==', 'pending')
            .limit(1)
            .get();

        if (!existingQuery.empty) {
            throw new HttpsError('already-exists', 'You already have a pending invitation to this email');
        }

        const existingConnection = await getActiveConnection(ownerUid);
        if (existingConnection) {
            throw new HttpsError('already-exists', 'You already have an active family connection');
        }

        const ownerProfileRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(ownerUid);
        const ownerProfile = await ownerProfileRef.get();
        const ownerDisplayName = ownerProfile.data()?.name || ownerEmail.split('@')[0];

        const verificationCode = generateVerificationCode();
        const verificationCodeHash = await bcrypt.hash(verificationCode, BCRYPT_SALT_ROUNDS);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const inviteRef = invitationsRef.doc();
        const invitation: FamilyInvitation = {
            id: inviteRef.id,
            ownerUid,
            ownerEmail,
            ownerDisplayName,
            inviteeEmail,
            status: 'pending',
            verificationCodeHash,
            verificationAttempts: 0,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
        };

        await inviteRef.set(invitation);

        try {
            await getResend().emails.send({
                from: EMAIL_FROM,
                to: inviteeEmail,
                subject: `${ownerDisplayName} invited you to join their family on Anchor`,
                html: buildInvitationEmail(ownerDisplayName, inviteRef.id, verificationCode),
            });
        } catch (emailError) {
            console.error('Failed to send invitation email:', emailError);
        }

        await createAuditLog('invitation_sent', ownerUid, { inviteeEmail, inviteId: inviteRef.id });

        return { success: true, inviteId: inviteRef.id };
    }
);
// ============================================================================

export const revokeInvitation = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId } = request.data as { inviteId: string };
        const ownerUid = request.auth.uid;

        await enforceRateLimit('revokeInvitation', ownerUid);

        const inviteRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations').doc(inviteId);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            throw new HttpsError('not-found', 'Invitation not found');
        }

        const invite = inviteDoc.data() as FamilyInvitation;

        if (invite.ownerUid !== ownerUid) {
            throw new HttpsError('permission-denied', 'You can only revoke your own invitations');
        }

        if (invite.status !== 'pending') {
            throw new HttpsError('failed-precondition', 'Only pending invitations can be revoked');
        }

        await inviteRef.update({ status: 'revoked', revokedAt: new Date().toISOString() });
        await createAuditLog('invitation_revoked', ownerUid, { inviteId });

        return { success: true };
    }
);

// ============================================================================
// Validate Invitation Token
// ============================================================================

export const validateInvitationToken = secureOnCall(
    async (request) => {
        const { token } = request.data as { token: string };

        if (!token) {
            throw new HttpsError('invalid-argument', 'Token is required');
        }

        await enforceRateLimit('tokenValidation', token);

        const inviteRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations').doc(token);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            return { valid: false, error: 'Invalid or expired invitation link.' };
        }

        const invite = inviteDoc.data() as FamilyInvitation;
        const now = new Date();

        if (invite.status === 'locked') {
            return { valid: false, error: 'This invitation has been locked due to too many failed attempts.', isLocked: true };
        }
        if (invite.status === 'revoked') {
            return { valid: false, error: 'This invitation has been cancelled by the sender.' };
        }
        if (invite.status === 'accepted') {
            return { valid: false, error: 'This invitation has already been accepted.' };
        }
        if (new Date(invite.expiresAt) < now) {
            return { valid: false, error: 'This invitation has expired.', isExpired: true };
        }
        if (invite.status !== 'pending' && invite.status !== 'awaiting_confirmation') {
            return { valid: false, error: 'This invitation is no longer valid.' };
        }

        return {
            valid: true,
            ownerDisplayName: invite.ownerDisplayName,
            expiresAt: invite.expiresAt,
            status: invite.status,
        };
    }
);
