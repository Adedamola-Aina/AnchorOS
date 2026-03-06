/**
 * Family Invitations — create, revoke, validate, accept
 *
 * Handles the invitation lifecycle from creation through acceptance.
 * The confirmConnection step lives in familyConnection.ts.
 */
// @ts-nocheck


import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as bcrypt from 'bcrypt';
import { db, APP_ID, BCRYPT_SALT_ROUNDS, getResend, EMAIL_FROM, APP_URL } from './config';
import { enforceRateLimit } from './rateLimit';
import {
    createAuditLog,
    getActiveConnection,
    generateVerificationCode,
} from './helpers';
import type { FamilyInvitation } from './types';

// ============================================================================
// Create Invitation
// ============================================================================

export const createFamilyInvitation = onCall(
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

/** Build the HTML email body for a family invitation. */
function buildInvitationEmail(ownerName: string, inviteId: string, code: string): string {
    return `<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;"><div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);"><div style="background:#0f172a;padding:32px;text-align:center;"><h1 style="color:white;margin:0;font-size:24px;letter-spacing:-0.5px;">⚓ Anchor OS</h1></div><div style="padding:40px 32px;"><h2 style="color:#0f172a;font-size:24px;margin:0 0 16px;text-align:center;">Join ${ownerName}'s Family</h2><p style="color:#475569;font-size:16px;line-height:1.6;text-align:center;margin-bottom:32px;">You've been invited to connect directly in Anchor OS. This will allow you to share accounts, track shared expenses, and manage your household commitments together.</p><div style="text-align:center;margin-bottom:24px;"><a href="${APP_URL}/accept-invite?token=${inviteId}" style="display:inline-block;background:#2563eb;color:white;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 4px 6px -1px rgba(37,99,235,0.2);">Accept Invitation</a></div><div style="background:#f1f5f9;border-radius:8px;padding:16px;text-align:center;margin-bottom:32px;"><p style="color:#475569;font-size:14px;margin:0 0 8px;">Your verification code:</p><p style="color:#0f172a;font-size:24px;font-weight:bold;letter-spacing:4px;margin:0;">${code}</p></div><div style="border-top:1px solid #e2e8f0;padding-top:32px;"><h3 style="color:#0f172a;font-size:16px;margin:0 0 16px;">What happens next?</h3><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="vertical-align:top;width:24px;padding-bottom:16px;"><div style="background:#eff6ff;color:#2563eb;width:24px;height:24px;border-radius:12px;text-align:center;line-height:24px;font-size:14px;font-weight:bold;">1</div></td><td style="padding-left:12px;padding-bottom:16px;"><div style="color:#334155;font-size:14px;font-weight:600;">Create your account</div><div style="color:#64748b;font-size:14px;">If you don't have one, you'll be asked to sign up first.</div></td></tr><tr><td style="vertical-align:top;width:24px;"><div style="background:#eff6ff;color:#2563eb;width:24px;height:24px;border-radius:12px;text-align:center;line-height:24px;font-size:14px;font-weight:bold;">2</div></td><td style="padding-left:12px;"><div style="color:#334155;font-size:14px;font-weight:600;">Confirm & Connect</div><div style="color:#64748b;font-size:14px;">Enter your verification code and confirm the connection.</div></td></tr></table></div></div><div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e2e8f0;"><p style="color:#94a3b8;font-size:12px;margin:0;">This invitation expires in 7 days. If you didn't expect this, you can ignore this email.</p></div></div></body></html>`;
}

// ============================================================================
// Revoke Invitation
// ============================================================================

export const revokeInvitation = onCall(
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

export const validateInvitationToken = onCall(
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
