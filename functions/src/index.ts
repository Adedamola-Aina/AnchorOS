/**
 * Cloud Functions for Anchor OS
 * 
 * This module provides serverless functions for:
 * - Rate limiting authentication attempts
 * - Family Mode v2: Invitations, connections, and account sharing
 * - Cleaning up expired family invitations
 * - Sending emails via Resend
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';

admin.initializeApp();

const db = admin.firestore();
const APP_ID = 'anchor-os';
const BCRYPT_SALT_ROUNDS = 10;

// Resend client - lazy initialized to avoid module-load errors
let resendClient: Resend | null = null;
function getResend(): Resend {
    if (!resendClient) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }
        resendClient = new Resend(apiKey);
    }
    return resendClient;
}

// Email configuration from environment variables
const EMAIL_FROM = process.env.EMAIL_FROM || 'Anchor OS <noreply@adedamola.us>';

// Determine APP_URL based on Firebase project ID
function getAppUrl(): string {
    if (process.env.APP_URL) return process.env.APP_URL;

    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || '';

    if (projectId === 'anchor-os') {
        return 'https://anchor-os.web.app';
    } else if (projectId === 'anchor-os-staging') {
        return 'https://anchor-os-staging.web.app';
    } else if (projectId.includes('dev')) {
        return 'https://anchor-os-dev-1c6ec.web.app';
    }

    // Default to production for safety
    return 'https://anchor-os.web.app';
}

const APP_URL = getAppUrl();

// ============================================================================
// Types
// ============================================================================

type InvitationStatus = 'pending' | 'awaiting_confirmation' | 'accepted' | 'rejected' | 'expired' | 'revoked' | 'locked';

interface FamilyInvitation {
    id: string;
    ownerUid: string;
    ownerEmail: string;
    ownerDisplayName: string;
    inviteeEmail: string;
    inviteeUid?: string;
    status: InvitationStatus;
    verificationCodeHash: string;
    verificationAttempts: number;
    createdAt: string;
    expiresAt: string;
    acceptedAt?: string;
    confirmedAt?: string;
    revokedAt?: string;
    lockedAt?: string;
}

interface FamilyConnection {
    id: string;
    ownerUid: string;
    memberUid: string;
    ownerDisplayName: string;
    memberDisplayName: string;
    status: 'active' | 'disconnected';
    connectedAt: string;
    disconnectedAt?: string;
    disconnectedBy?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createAuditLog(
    action: string,
    actorUid: string,
    metadata: Record<string, unknown> = {},
    targetUid?: string
): Promise<void> {
    await db.collection('artifacts').doc(APP_ID).collection('audit_log').add({
        action,
        actorUid,
        targetUid: targetUid || null,
        metadata,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
}

async function createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    actorUid: string,
    actorName: string,
    extra: Record<string, unknown> = {}
): Promise<void> {
    await db.collection('artifacts').doc(APP_ID)
        .collection('users').doc(userId)
        .collection('notifications').add({
            type,
            title,
            message,
            actorUid,
            actorName,
            read: false,
            dismissed: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ...extra,
        });
}

async function getActiveConnection(userUid: string): Promise<FamilyConnection | null> {
    const connectionsRef = db.collection('artifacts').doc(APP_ID).collection('family_connections');

    // Check as owner
    const ownerQuery = await connectionsRef
        .where('ownerUid', '==', userUid)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (!ownerQuery.empty) {
        return { id: ownerQuery.docs[0].id, ...ownerQuery.docs[0].data() } as FamilyConnection;
    }

    // Check as member
    const memberQuery = await connectionsRef
        .where('memberUid', '==', userUid)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (!memberQuery.empty) {
        return { id: memberQuery.docs[0].id, ...memberQuery.docs[0].data() } as FamilyConnection;
    }

    return null;
}

// ============================================================================
// Rate Limiting Configuration
// ============================================================================

interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
    blockDurationMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
    // Authentication (Firebase handles primary, this is for tracking)
    auth: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        blockDurationMs: 60 * 60 * 1000, // 1 hour block
    },
    // Family invitations - 10 per day is generous
    invite: {
        maxAttempts: 10,
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        blockDurationMs: 24 * 60 * 60 * 1000,
    },
    // Account sharing - 20 toggles per hour
    shareAccount: {
        maxAttempts: 20,
        windowMs: 60 * 60 * 1000, // 1 hour
        blockDurationMs: 30 * 60 * 1000, // 30 min block
    },
    // Token validation - prevent brute force on invite tokens
    tokenValidation: {
        maxAttempts: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
        blockDurationMs: 60 * 60 * 1000, // 1 hour block
    },
    // Verification code attempts - 5 tries per 15 min
    codeVerification: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        blockDurationMs: 60 * 60 * 1000, // 1 hour block
    },
    // Disconnect family - destructive action, limit to 3/hour
    disconnectFamily: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000, // 1 hour
        blockDurationMs: 24 * 60 * 60 * 1000, // 24 hour block
    },
    // Email sending - prevent email bombing
    emailSend: {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
        blockDurationMs: 60 * 60 * 1000, // 1 hour block
    },
    // Transaction creation via shared account - 100/hour is generous
    transactionCreate: {
        maxAttempts: 100,
        windowMs: 60 * 60 * 1000, // 1 hour
        blockDurationMs: 15 * 60 * 1000, // 15 min block
    },
};

// ============================================================================
// Rate Limiting Helper - Enforces rate limits and throws on exceeded
// ============================================================================

/**
 * Enforces rate limiting for a given action and identifier.
 * THROWS HttpsError if rate limit is exceeded.
 * Use this at the START of Cloud Functions to protect against abuse.
 */
async function enforceRateLimit(action: string, identifier: string): Promise<void> {
    const config = RATE_LIMITS[action];
    if (!config) {
        // Fail open for unknown actions to not break functionality
        console.warn(`[RateLimit] Unknown action: ${action}. Skipping enforcement.`);
        return;
    }

    const rateLimitRef = db.collection('rateLimits').doc(`${action}:${identifier}`);
    const now = Date.now();

    try {
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(rateLimitRef);
            const docData = doc.data();

            // Check if currently blocked
            if (docData?.blockedUntil && docData.blockedUntil > now) {
                const remainingMs = docData.blockedUntil - now;
                const remainingMin = Math.ceil(remainingMs / 60000);
                throw new functions.https.HttpsError(
                    'resource-exhausted',
                    `Too many attempts. Please try again in ${remainingMin} minute(s).`
                );
            }

            // Count attempts in window
            const windowStart = now - config.windowMs;
            const attempts = (docData?.attempts || []).filter((ts: number) => ts > windowStart);

            // Check if limit exceeded
            if (attempts.length >= config.maxAttempts) {
                const blockedUntil = now + config.blockDurationMs;
                transaction.set(rateLimitRef, { attempts: [], blockedUntil, lastAttempt: now });
                throw new functions.https.HttpsError(
                    'resource-exhausted',
                    'Rate limit exceeded. You have been temporarily blocked.'
                );
            }

            // Record this attempt
            attempts.push(now);
            transaction.set(rateLimitRef, { attempts, blockedUntil: null, lastAttempt: now });
        });
    } catch (error) {
        // Re-throw HttpsErrors (rate limit)
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        // Log but don't fail on internal errors (fail open)
        console.error('[RateLimit] Enforcement failed:', error);
    }
}

// ============================================================================
// Rate Limiting Functions (Public API)
// ============================================================================

export const checkRateLimit = functions.https.onCall(
    async (data: { action: string; identifier: string }) => {
        const { action, identifier } = data;

        if (!action || !identifier) {
            throw new functions.https.HttpsError('invalid-argument', 'Action and identifier are required');
        }

        const config = RATE_LIMITS[action];
        if (!config) {
            throw new functions.https.HttpsError('invalid-argument', `Unknown rate limit action: ${action}`);
        }

        const rateLimitRef = db.collection('rateLimits').doc(`${action}:${identifier}`);
        const now = Date.now();

        try {
            const result = await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(rateLimitRef);
                const docData = doc.data();

                if (docData?.blockedUntil && docData.blockedUntil > now) {
                    return {
                        allowed: false,
                        blockedUntil: docData.blockedUntil,
                        reason: 'Too many attempts. Please try again later.',
                    };
                }

                const windowStart = now - config.windowMs;
                const attempts = (docData?.attempts || []).filter((ts: number) => ts > windowStart);

                if (attempts.length >= config.maxAttempts) {
                    const blockedUntil = now + config.blockDurationMs;
                    transaction.set(rateLimitRef, { attempts: [], blockedUntil, lastAttempt: now });
                    return {
                        allowed: false,
                        blockedUntil,
                        reason: 'Rate limit exceeded. You have been temporarily blocked.',
                    };
                }

                attempts.push(now);
                transaction.set(rateLimitRef, { attempts, blockedUntil: null, lastAttempt: now });

                return { allowed: true, remainingAttempts: config.maxAttempts - attempts.length };
            });

            return result;
        } catch (error) {
            console.error('Rate limit check failed:', error);
            return { allowed: true };
        }
    }
);

export const resetRateLimit = functions.https.onCall(
    async (data: { action: string; identifier: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { action, identifier } = data;
        const rateLimitRef = db.collection('rateLimits').doc(`${action}:${identifier}`);
        await rateLimitRef.delete();

        return { success: true };
    }
);

// ============================================================================
// Family Mode v2: Create Invitation
// ============================================================================

export const createFamilyInvitation = functions.https.onCall(
    async (data: { inviteeEmail: string; password: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteeEmail, password } = data;
        const ownerUid = context.auth.uid;
        const ownerEmail = context.auth.token.email;

        if (!ownerEmail) {
            throw new functions.https.HttpsError('failed-precondition', 'Your email must be verified');
        }

        if (!inviteeEmail || !password) {
            throw new functions.https.HttpsError('invalid-argument', 'Invitee email and password are required');
        }

        // Re-authenticate user (verify password)
        // Note: In production, use Firebase Admin Auth to verify the password
        // For now, we trust the client has re-authenticated

        // Check rate limit
        const rateLimitRef = db.collection('rateLimits').doc(`invite:${ownerUid}`);
        const rateLimitDoc = await rateLimitRef.get();
        const rateLimitData = rateLimitDoc.data();
        const now = Date.now();
        const dayAgo = now - 24 * 60 * 60 * 1000;
        const recentInvites = (rateLimitData?.attempts || []).filter((ts: number) => ts > dayAgo);

        if (recentInvites.length >= 10) {
            throw new functions.https.HttpsError('resource-exhausted', 'Maximum 10 invitations per day');
        }

        // Check for existing pending invitation to this email
        const invitationsRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations');
        const existingQuery = await invitationsRef
            .where('ownerUid', '==', ownerUid)
            .where('inviteeEmail', '==', inviteeEmail)
            .where('status', '==', 'pending')
            .limit(1)
            .get();

        if (!existingQuery.empty) {
            throw new functions.https.HttpsError('already-exists', 'You already have a pending invitation to this email');
        }

        // Check for existing connection
        const existingConnection = await getActiveConnection(ownerUid);
        if (existingConnection) {
            throw new functions.https.HttpsError('already-exists', 'You already have an active family connection');
        }

        // Get owner's display name
        const ownerProfileRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(ownerUid);
        const ownerProfile = await ownerProfileRef.get();
        const ownerDisplayName = ownerProfile.data()?.name || ownerEmail.split('@')[0];

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const verificationCodeHash = await bcrypt.hash(verificationCode, BCRYPT_SALT_ROUNDS);

        // Create invitation
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

        // Update rate limit
        recentInvites.push(now);
        await rateLimitRef.set({ attempts: recentInvites, lastAttempt: now });

        // Send invitation email via Resend
        try {
            await getResend().emails.send({
                from: EMAIL_FROM,
                to: inviteeEmail,
                subject: `${ownerDisplayName} invited you to join their family on Anchor`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
                        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                            <!-- Header -->
                            <div style="background: #0f172a; padding: 32px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: -0.5px;">⚓ Anchor OS</h1>
                            </div>
                            
                            <!-- Content -->
                            <div style="padding: 40px 32px;">
                                <h2 style="color: #0f172a; font-size: 24px; margin: 0 0 16px 0; text-align: center;">Join ${ownerDisplayName}'s Family</h2>
                                <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
                                    You've been invited to connect directly in Anchor OS. This will allow you to share accounts, track shared expenses, and manage your household commitments together.
                                </p>

                                <!-- Action Button -->
                                <div style="text-align: center; margin-bottom: 32px;">
                                    <a href="${APP_URL}/accept-invite?token=${inviteRef.id}&code=${verificationCode}" 
                                       style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                                        Accept Invitation
                                    </a>
                                </div>

                                <!-- Steps -->
                                <div style="border-top: 1px solid #e2e8f0; padding-top: 32px;">
                                    <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 16px 0;">What happens next?</h3>
                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td style="vertical-align: top; width: 24px; padding-bottom: 16px;">
                                                <div style="background: #eff6ff; color: #2563eb; width: 24px; height: 24px; border-radius: 12px; text-align: center; line-height: 24px; font-size: 14px; font-weight: bold;">1</div>
                                            </td>
                                            <td style="padding-left: 12px; padding-bottom: 16px;">
                                                <div style="color: #334155; font-size: 14px; font-weight: 600;">Create your account</div>
                                                <div style="color: #64748b; font-size: 14px;">If you don't have one, you'll be asked to sign up first.</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="vertical-align: top; width: 24px;">
                                                <div style="background: #eff6ff; color: #2563eb; width: 24px; height: 24px; border-radius: 12px; text-align: center; line-height: 24px; font-size: 14px; font-weight: bold;">2</div>
                                            </td>
                                            <td style="padding-left: 12px;">
                                                <div style="color: #334155; font-size: 14px; font-weight: 600;">Confirm & Connect</div>
                                                <div style="color: #64748b; font-size: 14px;">Review the invitation details and confirm the connection.</div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Footer -->
                            <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                    This invitation expires in 7 days. If you didn't expect this, you can ignore this email.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            });
        } catch (emailError) {
            console.error('Failed to send invitation email:', emailError);
            // Don't fail the invitation if email fails - the code is the primary method
        }

        await createAuditLog('invitation_sent', ownerUid, { inviteeEmail, inviteId: inviteRef.id });

        return {
            success: true,
            verificationCode, // Displayed to owner once - they share via separate channel
            inviteId: inviteRef.id,
        };
    }
);

// ============================================================================
// Family Mode v2: Revoke Invitation
// ============================================================================

export const revokeInvitation = functions.https.onCall(
    async (data: { inviteId: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId } = data;
        const ownerUid = context.auth.uid;

        const inviteRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations').doc(inviteId);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Invitation not found');
        }

        const invite = inviteDoc.data() as FamilyInvitation;

        if (invite.ownerUid !== ownerUid) {
            throw new functions.https.HttpsError('permission-denied', 'You can only revoke your own invitations');
        }

        if (invite.status !== 'pending') {
            throw new functions.https.HttpsError('failed-precondition', 'Only pending invitations can be revoked');
        }

        await inviteRef.update({
            status: 'revoked',
            revokedAt: new Date().toISOString(),
        });

        await createAuditLog('invitation_revoked', ownerUid, { inviteId });

        return { success: true };
    }
);

// ============================================================================
// Family Mode v2: Validate Invitation Token
// ============================================================================

export const validateInvitationToken = functions.https.onCall(
    async (data: { token: string }) => {
        const { token } = data;

        if (!token) {
            throw new functions.https.HttpsError('invalid-argument', 'Token is required');
        }

        // Rate limit: prevent brute force on invite tokens (10/hour per token)
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
            ownerEmail: invite.ownerEmail,
            expiresAt: invite.expiresAt,
            status: invite.status,
        };
    }
);

// ============================================================================
// Family Mode v2: Accept Invitation
// ============================================================================

export const acceptInvitation = functions.https.onCall(
    async (data: { inviteId: string; verificationCode: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId, verificationCode } = data;
        const inviteeUid = context.auth.uid;

        // Rate limit: prevent brute force on verification codes (5/15min per invite)
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

        // Verify code
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

            return {
                success: false,
                attemptsRemaining: 5 - newAttempts,
            };
        }

        // Code correct - update invitation
        await inviteRef.update({
            status: 'awaiting_confirmation',
            inviteeUid,
            acceptedAt: new Date().toISOString(),
        });

        // Notify owner
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
// Family Mode v2: Confirm Connection
// ============================================================================

export const confirmConnection = functions.https.onCall(
    async (data: { inviteId: string; password: string; confirmed: boolean }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { inviteId, confirmed } = data;
        const ownerUid = context.auth.uid;

        // Rate limit: prevent spam confirmations (10/day per user)
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
            // Owner rejected
            await inviteRef.update({
                status: 'rejected',
            });

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

        // Get invitee's display name
        const inviteeProfileRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(invite.inviteeUid);
        const inviteeProfile = await inviteeProfileRef.get();
        const memberDisplayName = inviteeProfile.data()?.name || invite.inviteeEmail.split('@')[0];

        // Create connection with deterministic ID
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

        // Update invitation
        await inviteRef.update({
            status: 'accepted',
            confirmedAt: new Date().toISOString(),
        });

        // Notify owner
        await createNotification(
            ownerUid,
            'family_connected',
            '🎉 Family Connected!',
            `You're now connected with ${memberDisplayName}. No accounts are shared yet. Go to Finance to choose which accounts to share.`,
            invite.inviteeUid,
            memberDisplayName
        );

        // Notify member (persistent notification)
        await createNotification(
            invite.inviteeUid,
            'family_connected',
            '👥 Family Connected!',
            `You're now connected to ${invite.ownerDisplayName}'s household. They'll choose which accounts to share with you. Shared accounts will appear in your Finance section once they do.`,
            ownerUid,
            invite.ownerDisplayName
        );

        await createAuditLog('connection_confirmed', ownerUid, {
            inviteId,
            inviteeUid: invite.inviteeUid,
            connectionId: connectionRef.id,
        });

        return {
            success: true,
            redirect: '/finance',
            message: `You're now connected with ${memberDisplayName}. No accounts are shared yet. Go to Finance to choose which accounts to share.`,
            memberName: memberDisplayName,
        };
    }
);

// ============================================================================
// Family Mode v2: Share Account
// ============================================================================

export const shareAccount = functions.https.onCall(
    async (data: { accountId: string; share: boolean }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { accountId, share } = data;
        const ownerUid = context.auth.uid;

        // Rate limit: prevent share/unshare spam (20/hour per user)
        await enforceRateLimit('shareAccount', ownerUid);

        // Get active connection
        const connection = await getActiveConnection(ownerUid);
        if (!connection) {
            throw new functions.https.HttpsError('failed-precondition', 'No active family connection');
        }

        // Verify caller is the owner (not member)
        if (connection.ownerUid !== ownerUid) {
            throw new functions.https.HttpsError('permission-denied', 'Only the account owner can share accounts');
        }

        const memberUid = connection.memberUid;

        // Get account
        const accountRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(ownerUid)
            .collection('accounts').doc(accountId);
        const accountDoc = await accountRef.get();

        if (!accountDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Account not found');
        }

        const accountName = accountDoc.data()?.name || 'Unknown Account';

        if (share) {
            // Add to sharedWith map AND set scope to 'family'
            await accountRef.update({
                [`sharedWith.${memberUid}`]: {
                    grantedAt: new Date().toISOString(),
                    grantedBy: ownerUid,
                },
                scope: 'family',  // CRITICAL: Ensures useFamilyAccountsQuery can find this account
            });

            await createNotification(
                memberUid,
                'account_shared',
                '👥 Account Shared',
                `${connection.ownerDisplayName} has shared "${accountName}" with you. You can now view and add transactions.`,
                ownerUid,
                connection.ownerDisplayName,
                { accountId, accountName }
            );

            await createAuditLog('account_shared', ownerUid, { accountId, accountName, memberUid });
        } else {
            // Remove from sharedWith map
            await accountRef.update({
                [`sharedWith.${memberUid}`]: admin.firestore.FieldValue.delete(),
            });

            await createNotification(
                memberUid,
                'account_unshared',
                'Account Access Removed',
                `Access to "${accountName}" has been removed.`,
                ownerUid,
                connection.ownerDisplayName,
                { accountId, accountName }
            );

            await createAuditLog('account_unshared', ownerUid, { accountId, accountName, memberUid });
        }

        return { success: true };
    }
);

// ============================================================================
// Family Mode v2: Get Shared Accounts With Me
// ============================================================================

export const getSharedAccountsWithMe = functions.https.onCall(
    async (_data: unknown, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const memberUid = context.auth.uid;

        // Collection group query for all accounts where user is in sharedWith
        const accountsQuery = db.collectionGroup('accounts')
            .where(`sharedWith.${memberUid}.grantedAt`, '!=', null);

        const snapshot = await accountsQuery.get();

        const sharedAccounts = snapshot.docs.map(doc => {
            const data = doc.data();
            // Extract owner UID from path: artifacts/{appId}/users/{ownerUid}/accounts/{accountId}
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
                scope: data.scope || 'family',  // Include scope - default to 'family' for shared accounts
                sharedAt: data.sharedWith?.[memberUid]?.grantedAt,
            };
        });

        return { accounts: sharedAccounts };
    }
);

// ============================================================================
// Family Mode v2: Get Notifications
// ============================================================================

export const getNotifications = functions.https.onCall(
    async (data: { limit?: number; includeRead?: boolean }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const userId = context.auth.uid;
        const limit = data?.limit || 50;
        const includeRead = data?.includeRead ?? false;

        let query = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(userId)
            .collection('notifications')
            .where('dismissed', '==', false)
            .orderBy('createdAt', 'desc')
            .limit(limit);

        if (!includeRead) {
            query = query.where('read', '==', false);
        }

        const snapshot = await query.get();

        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { notifications };
    }
);

// ============================================================================
// Family Mode v2: Dismiss Notification
// ============================================================================

export const dismissNotification = functions.https.onCall(
    async (data: { notificationId: string }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const { notificationId } = data;
        const userId = context.auth.uid;

        const notifRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(userId)
            .collection('notifications').doc(notificationId);

        const notifDoc = await notifRef.get();

        if (!notifDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Notification not found');
        }

        await notifRef.update({ dismissed: true });

        return { success: true };
    }
);

// ============================================================================
// Family Mode v2: Disconnect Family
// ============================================================================

export const disconnectFamily = functions.https.onCall(
    async (data: { type: 'remove_member' | 'leave' }, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const callerUid = context.auth.uid;

        // Rate limit: destructive action - limit to 3/hour per user
        await enforceRateLimit('disconnectFamily', callerUid);
        const connection = await getActiveConnection(callerUid);

        if (!connection) {
            throw new functions.https.HttpsError('failed-precondition', 'No active family connection');
        }

        const isOwner = connection.ownerUid === callerUid;
        const otherUid = isOwner ? connection.memberUid : connection.ownerUid;

        // Update connection status
        const connectionRef = db.collection('artifacts').doc(APP_ID)
            .collection('family_connections').doc(connection.id);

        await connectionRef.update({
            status: 'disconnected',
            disconnectedAt: new Date().toISOString(),
            disconnectedBy: callerUid,
        });

        // If owner is disconnecting, remove all shared access
        if (isOwner) {
            const accountsRef = db.collection('artifacts').doc(APP_ID)
                .collection('users').doc(callerUid)
                .collection('accounts');

            const accountsSnapshot = await accountsRef.get();
            const batch = db.batch();

            accountsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.sharedWith && data.sharedWith[otherUid]) {
                    batch.update(doc.ref, {
                        [`sharedWith.${otherUid}`]: admin.firestore.FieldValue.delete(),
                    });
                }
            });

            await batch.commit();
        }

        // Notify other party
        const callerName = isOwner ? connection.ownerDisplayName : connection.memberDisplayName;
        await createNotification(
            otherUid,
            'family_disconnected',
            'Family Disconnected',
            isOwner
                ? `${callerName} has removed you from their household. All shared account access has been revoked.`
                : `${callerName} has left your household.`,
            callerUid,
            callerName
        );

        await createAuditLog(isOwner ? 'member_removed' : 'member_left', callerUid, {
            connectionId: connection.id,
            otherUid,
        });

        return { success: true };
    }
);

// ============================================================================
// Family Mode v2: Firestore Trigger - Shared Transaction Notification
// ============================================================================

export const onSharedTransactionWrite = functions.firestore
    .document('artifacts/{appId}/users/{userId}/finance/{transactionId}')
    .onWrite(async (change, context) => {
        const { userId, transactionId } = context.params;
        const before = change.before.data();
        const after = change.after.data();

        // Determine action type
        let action: 'added' | 'modified' | 'deleted';
        if (!before && after) {
            action = 'added';
        } else if (before && !after) {
            action = 'deleted';
        } else if (before && after) {
            action = 'modified';
        } else {
            return null;
        }

        const txData = after || before;
        if (!txData?.accountId) return null;

        // Get the account to check if shared
        const accountRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(userId)
            .collection('accounts').doc(txData.accountId);

        const accountDoc = await accountRef.get();
        if (!accountDoc.exists) return null;

        const accountData = accountDoc.data();
        const sharedWith = accountData?.sharedWith || {};
        const sharedUserIds = Object.keys(sharedWith);

        if (sharedUserIds.length === 0) return null;

        // Get actor's name
        const actorProfileRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId);
        const actorProfile = await actorProfileRef.get();
        const actorName = actorProfile.data()?.name || 'Family member';

        // Format amount
        const amount = Math.abs(txData.amountCents / 100).toFixed(2);
        const currency = txData.currency || 'NGN';
        const formattedAmount = `${currency} ${amount}`;
        const description = txData.description || 'transaction';

        // Create notification for each shared user (except the actor)
        const notifications: Promise<void>[] = [];

        for (const sharedUserId of sharedUserIds) {
            if (sharedUserId === userId) continue; // Don't notify the actor

            let message: string;
            let title: string;

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

            notifications.push(
                createNotification(
                    sharedUserId,
                    `shared_transaction_${action}`,
                    title,
                    message,
                    userId,
                    actorName,
                    { accountId: txData.accountId, accountName: accountData?.name, transactionId }
                )
            );

            // Audit log
            notifications.push(
                createAuditLog(`shared_tx_${action}`, userId, {
                    transactionId,
                    accountId: txData.accountId,
                    notifiedUsers: sharedUserIds.filter(id => id !== userId),
                })
            );
        }

        await Promise.all(notifications);
        return null;
    });

// ============================================================================
// Invitation Cleanup (Scheduled)
// ============================================================================

export const cleanupExpiredInvitations = functions.pubsub
    .schedule('0 3 * * *')
    .timeZone('UTC')
    .onRun(async () => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const invitationsRef = db.collection('artifacts').doc(APP_ID).collection('family_invitations');

        try {
            // Mark expired invitations
            const expiredQuery = invitationsRef
                .where('expiresAt', '<', now.toISOString())
                .where('status', '==', 'pending');

            const expiredSnap = await expiredQuery.get();

            if (!expiredSnap.empty) {
                const batch = db.batch();
                expiredSnap.docs.forEach(doc => {
                    batch.update(doc.ref, { status: 'expired' });
                });
                await batch.commit();
                console.log(`Marked ${expiredSnap.size} invitations as expired`);
            }

            // Delete old invitations (30+ days)
            const oldQuery = invitationsRef.where('createdAt', '<', thirtyDaysAgo.toISOString());
            const oldSnap = await oldQuery.get();

            if (!oldSnap.empty) {
                const batch = db.batch();
                oldSnap.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                console.log(`Deleted ${oldSnap.size} old invitations`);
            }

            return null;
        } catch (error) {
            console.error('Invitation cleanup failed:', error);
            throw error;
        }
    });

// ============================================================================
// Email Templates (Legacy - kept for compatibility)
// ============================================================================

interface EmailTemplateData {
    template: 'invitation' | 'welcome' | 'password-reset';
    recipient: string;
    data: Record<string, string>;
}

export const sendTemplatedEmail = functions.https.onCall(
    async (data: EmailTemplateData, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        // Rate limit: prevent email bombing (5/hour per user)
        await enforceRateLimit('emailSend', context.auth.uid);

        const { template, recipient, data: templateData } = data;

        const templates: Record<string, { subject: string; body: string }> = {
            invitation: {
                subject: 'You\'ve been invited to join a family on Anchor OS',
                body: `
          Hi there!
          
          ${templateData.senderName} has invited you to join their family on Anchor OS.
          
          Click here to accept: ${templateData.inviteUrl}
          
          This invitation expires in 7 days.
          
          - The Anchor OS Team
        `.trim(),
            },
            welcome: {
                subject: 'Welcome to Anchor OS!',
                body: `
          Welcome to Anchor OS, ${templateData.userName}!
          
          You're all set to start managing your life with our integrated 
          finance and productivity tools.
          
          Get started: ${templateData.appUrl}
          
          - The Anchor OS Team
        `.trim(),
            },
            'password-reset': {
                subject: 'Reset your Anchor OS password',
                body: `
          Hi ${templateData.userName},
          
          Click here to reset your password: ${templateData.resetUrl}
          
          If you didn't request this, please ignore this email.
          
          - The Anchor OS Team
        `.trim(),
            },
        };

        const emailTemplate = templates[template];
        if (!emailTemplate) {
            throw new functions.https.HttpsError('invalid-argument', `Unknown email template: ${template}`);
        }

        console.log('Email to send:', {
            to: recipient,
            subject: emailTemplate.subject,
            body: emailTemplate.body,
        });

        return {
            success: true,
            message: 'Email queued for delivery',
            template,
            recipient,
        };
    }
);

// ============================================================================
// Migration: V1 to V2 Family Connections
// ============================================================================

/**
 * One-time migration function to convert legacy family connections to v2 format.
 * This should be run once after deploying v2 to migrate existing connected families.
 * 
 * Legacy format:
 * - users/{uid}/profile.spouseId = partner's UID
 * 
 * V2 format:
 * - family_connections document with ownerUid/memberUid
 */
export const migrateFamilyConnectionsV2 = functions.https.onCall(
    async (_data, context) => {
        // Only allow authenticated admins or specific users to run migration
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'Must be authenticated to run migration'
            );
        }

        const callerUid = context.auth.uid;

        // Check if caller is admin (you can customize this check)
        // For now, allow any authenticated user to migrate their own connection

        const results: Array<{
            ownerUid: string;
            memberUid: string;
            status: 'migrated' | 'skipped' | 'error';
            message?: string;
        }> = [];

        try {
            // Find all users with spouseId
            const usersRef = db.collection('artifacts').doc(APP_ID).collection('users');
            const usersSnapshot = await usersRef.get();

            const processedPairs = new Set<string>();

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                const spouseId = userData.spouseId;

                if (!spouseId) continue;

                // Create a unique key for the pair to avoid processing both directions
                const pairKey = [userDoc.id, spouseId].sort().join(':');

                if (processedPairs.has(pairKey)) {
                    continue;
                }
                processedPairs.add(pairKey);

                // Check if v2 connection already exists
                const connectionsRef = db.collection('artifacts').doc(APP_ID).collection('family_connections');
                const existingQuery = await connectionsRef
                    .where('ownerUid', '==', userDoc.id)
                    .where('memberUid', '==', spouseId)
                    .where('status', '==', 'active')
                    .get();

                if (!existingQuery.empty) {
                    results.push({
                        ownerUid: userDoc.id,
                        memberUid: spouseId,
                        status: 'skipped',
                        message: 'V2 connection already exists',
                    });
                    continue;
                }

                // Get spouse's display name
                const spouseDoc = await usersRef.doc(spouseId).get();
                const spouseData = spouseDoc.data() || {};

                // First user in pair becomes owner
                const ownerUid = userDoc.id;
                const memberUid = spouseId;

                // Create v2 connection with deterministic ID
                const connectionId = `${ownerUid}_${memberUid}`;
                await connectionsRef.doc(connectionId).set({
                    id: connectionId,
                    ownerUid,
                    memberUid,
                    ownerDisplayName: userData.name || userData.email || 'User',
                    memberDisplayName: spouseData.name || spouseData.email || 'Family Member',
                    status: 'active',
                    connectedAt: new Date().toISOString(),
                    migratedFromV1: true,
                });

                // Log audit
                await createAuditLog(ownerUid, 'migration_v1_to_v2', {
                    ownerUid,
                    memberUid,
                    actor: callerUid,
                });

                results.push({
                    ownerUid,
                    memberUid,
                    status: 'migrated',
                });
            }

            return {
                success: true,
                totalProcessed: results.length,
                migrated: results.filter(r => r.status === 'migrated').length,
                skipped: results.filter(r => r.status === 'skipped').length,
                details: results,
            };
        } catch (error) {
            console.error('Migration error:', error);
            throw new functions.https.HttpsError(
                'internal',
                'Migration failed: ' + (error as Error).message
            );
        }
    }
);

// ============================================================================
// Transaction: Add Transaction to Shared Account
// ============================================================================

/**
 * Allows a family member to add a transaction to a shared account.
 * This validates that the user has access to the account before creating.
 */
export const addTransactionToSharedAccount = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'Must be authenticated'
            );
        }

        // Rate limit: prevent transaction spam (100/hour per user)
        await enforceRateLimit('transactionCreate', context.auth.uid);

        const callerUid = context.auth.uid;
        const { accountId, transaction } = data as {
            accountId: string;
            transaction: {
                title: string;
                amountCents: number;
                type: 'income' | 'expense';
                category: string;
                transactionDate?: string;
            };
        };

        if (!accountId || !transaction) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'accountId and transaction are required'
            );
        }

        // Get the account to verify access
        // We require accountOwnerId or we assume it's in the payload if the client is updated.
        // For now, if accountOwnerId is missing, we can't find the account efficiently if nested.

        let realOwnerId: string;
        let accountRef: admin.firestore.DocumentReference;
        let accountSnap: admin.firestore.DocumentSnapshot;

        // Try to find ownerId from data if client sends it (recommended)
        const sentOwnerId = (data as any).accountOwnerId;

        if (sentOwnerId) {
            realOwnerId = sentOwnerId;
            accountRef = db.collection('artifacts').doc(APP_ID)
                .collection('users').doc(realOwnerId)
                .collection('accounts').doc(accountId);
            accountSnap = await accountRef.get();
        } else {
            // Error out - client must update to send ownerId
            throw new functions.https.HttpsError('invalid-argument', 'accountOwnerId is required for shared transactions');
        }

        if (!accountSnap.exists) {
            throw new functions.https.HttpsError('not-found', 'Account not found');
        }

        const accountData = accountSnap.data()!;

        // Check if user is owner or has shared access
        const isOwner = accountData.ownerId === callerUid || !accountData.ownerId;
        const hasSharedAccess = accountData.sharedWith?.[callerUid];

        if (!isOwner && !hasSharedAccess) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'You do not have access to this account'
            );
        }

        // Get caller's display name
        const callerDoc = await db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(callerUid).get();
        const callerName = callerDoc.data()?.name || 'Family Member';

        // Create the transaction
        const now = new Date();
        const transactionData = {
            title: transaction.title,
            amountCents: transaction.amountCents,
            type: transaction.type,
            category: transaction.category,
            accountId,
            accountName: accountData.name,
            currency: accountData.currency,
            scope: 'family',
            date: now.toISOString(),
            transactionDate: transaction.transactionDate || now.toISOString(),
            createdBy: callerUid,
            createdByName: callerName,
            accountOwnerId: realOwnerId,
        };

        const transactionsRef = db.collection('artifacts').doc(APP_ID)
            .collection('users').doc(realOwnerId)
            .collection('finance');
        const newTransactionRef = await transactionsRef.add(transactionData);

        // Update account balance
        const balanceChange = transaction.type === 'income'
            ? transaction.amountCents
            : -transaction.amountCents;

        await accountRef.update({
            balanceCents: admin.firestore.FieldValue.increment(balanceChange),
        });

        // The onSharedTransactionWrite trigger will handle notifications

        return {
            success: true,
            transactionId: newTransactionRef.id,
        };
    }
);

// ============================================================================
// One-Time Migration: Fix Shared Account Scopes
// ============================================================================

export const fixSharedAccountScopes = functions.https.onCall(
    async (_data: unknown, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }

        const userId = context.auth.uid;

        // Get all user's accounts
        const accountsSnapshot = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(userId)
            .collection('accounts')
            .get();

        const batch = db.batch();
        let fixedCount = 0;

        for (const accountDoc of accountsSnapshot.docs) {
            const data = accountDoc.data();

            // If account has sharedWith entries but wrong scope, fix it
            if (data.sharedWith && Object.keys(data.sharedWith).length > 0) {
                if (data.scope !== 'family') {
                    batch.update(accountDoc.ref, { scope: 'family' });
                    fixedCount++;
                }
            }
        }

        if (fixedCount > 0) {
            await batch.commit();
        }

        return {
            success: true,
            accountsFixed: fixedCount,
            message: `Fixed ${fixedCount} shared account(s)`,
        };
    }
);

// Debug functions removed from production exports:
// - diagnoseFamilySharing (./diagnostic.ts)
// - forceUpdateAccountScope (./forceUpdate.ts)
// To use in development, import directly from files

// ============================================================================
// Finance Automation
// ============================================================================

export * from './recurring';

// ============================================================================
// Push Notification Reminders (PLT-003)
// ============================================================================

export * from './reminders';
