"use strict";
/**
 * Audit Logging — client-side event ingestion
 *
 * Provides a whitelist-gated callable for the web client to log
 * structured audit events (auth, finance, settings, commitments).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditEvent = void 0;
const https_1 = require("firebase-functions/v2/https");
const helpers_1 = require("./helpers");
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
exports.logAuditEvent = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const { action, metadata = {} } = request.data;
    if (!ALLOWED_AUDIT_EVENTS.has(action)) {
        throw new https_1.HttpsError('invalid-argument', `Unknown or disallowed audit event: ${action}`);
    }
    const enrichedMetadata = {
        ...metadata,
        clientTimestamp: new Date().toISOString(),
        source: 'client',
    };
    await (0, helpers_1.createAuditLog)(action, request.auth.uid, enrichedMetadata);
    return { success: true };
});
//# sourceMappingURL=audit.js.map