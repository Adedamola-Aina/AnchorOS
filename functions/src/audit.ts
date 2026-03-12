/**
 * Audit Logging — client-side event ingestion
 *
 * Provides a whitelist-gated callable for the web client to log
 * structured audit events (auth, finance, settings, commitments).
 */


import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { createAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';

// ============================================================================
// Allowed client-side audit event types
// ============================================================================

const ALLOWED_AUDIT_EVENTS = new Set([
    // Auth events
    'auth_login_success',
    'auth_login_failed',
    'auth_logout',
    'auth_mfa_challenge_started',
    'auth_mfa_challenge_completed',
    'auth_password_changed',
    'auth_email_verified',
    // Finance events
    'account_created',
    'account_archived',
    'account_renamed',
    'transaction_created',
    'transaction_deleted',
    'transaction_updated',
    'finance_operation_failed',
    // Settings events
    'settings_profile_updated',
    'settings_notifications_changed',
    'settings_theme_changed',
    // Commitment events
    'commitment_created',
    'commitment_completed',
    'commitment_deleted',
    'commitment_edited',
]);

// ============================================================================
// Public API
// ============================================================================

export const logAuditEvent = secureOnCall(
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required');
        }

        await enforceRateLimit('auditLog', request.auth.uid);

        const { action, metadata = {} } = request.data as { action: string; metadata?: Record<string, unknown> };

        if (!ALLOWED_AUDIT_EVENTS.has(action)) {
            throw new HttpsError(
                'invalid-argument',
                `Unknown or disallowed audit event: ${action}`
            );
        }

        const enrichedMetadata = {
            ...metadata,
            clientTimestamp: new Date().toISOString(),
            source: 'client',
        };

        await createAuditLog(action, request.auth.uid, enrichedMetadata);

        return { success: true };
    }
);
