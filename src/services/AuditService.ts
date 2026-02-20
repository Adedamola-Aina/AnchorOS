/**
 * AuditService
 * 
 * Client-side service for logging audit events to the server.
 * All security-sensitive operations should call this service.
 * 
 * Events are validated against a server-side whitelist and stored
 * in Firestore's audit_log collection.
 * 
 * @module services/AuditService
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export type AuditEventType =
    // Auth events
    | 'auth_login_success'
    | 'auth_login_failed'
    | 'auth_logout'
    | 'auth_mfa_challenge_started'
    | 'auth_mfa_challenge_completed'
    | 'auth_password_changed'
    | 'auth_email_verified'
    // Finance events
    | 'account_created'
    | 'account_archived'
    | 'account_renamed'
    | 'transaction_created'
    | 'transaction_deleted'
    | 'transaction_updated'
    // Settings events
    | 'settings_profile_updated'
    | 'settings_notifications_changed'
    | 'settings_theme_changed'
    // Commitment events
    | 'commitment_created'
    | 'commitment_completed'
    | 'commitment_deleted'
    | 'commitment_edited';

interface AuditMetadata {
    [key: string]: unknown;
}

/**
 * Log an audit event to the server.
 * Silently fails to avoid disrupting user experience.
 * 
 * @param action - The audit event type
 * @param metadata - Additional context about the event
 */
export async function logAuditEvent(
    action: AuditEventType,
    metadata: AuditMetadata = {}
): Promise<void> {
    try {
        const logAudit = httpsCallable(functions, 'logAuditEvent');
        await logAudit({ action, metadata });
    } catch (error) {
        // Silently log - audit failures should never block user operations
        console.warn('[AuditService] Failed to log event:', action, error);
    }
}

// Convenience functions for common operations

export const auditAuth = {
    loginSuccess: (method: 'password' | 'google' | 'mfa') =>
        logAuditEvent('auth_login_success', { method }),
    loginFailed: (method: 'password' | 'google', reason: string) =>
        logAuditEvent('auth_login_failed', { method, reason }),
    logout: () =>
        logAuditEvent('auth_logout', {}),
    mfaStarted: () =>
        logAuditEvent('auth_mfa_challenge_started', {}),
    mfaCompleted: (success: boolean) =>
        logAuditEvent('auth_mfa_challenge_completed', { success }),
    passwordChanged: () =>
        logAuditEvent('auth_password_changed', {}),
    emailVerified: () =>
        logAuditEvent('auth_email_verified', {}),
};

export const auditFinance = {
    accountCreated: (accountId: string, accountName: string, type: string) =>
        logAuditEvent('account_created', { accountId, accountName, type }),
    accountArchived: (accountId: string, accountName: string) =>
        logAuditEvent('account_archived', { accountId, accountName }),
    accountRenamed: (accountId: string, oldName: string, newName: string) =>
        logAuditEvent('account_renamed', { accountId, oldName, newName }),
    transactionCreated: (transactionId: string, accountId: string, amountCents: number, type: string) =>
        logAuditEvent('transaction_created', { transactionId, accountId, amountCents, type }),
    transactionDeleted: (transactionId: string, accountId: string) =>
        logAuditEvent('transaction_deleted', { transactionId, accountId }),
    transactionUpdated: (transactionId: string, accountId: string, changes: string[]) =>
        logAuditEvent('transaction_updated', { transactionId, accountId, changedFields: changes }),
};

export const auditSettings = {
    profileUpdated: (fields: string[]) =>
        logAuditEvent('settings_profile_updated', { updatedFields: fields }),
    notificationsChanged: (enabled: boolean) =>
        logAuditEvent('settings_notifications_changed', { enabled }),
    themeChanged: (theme: string) =>
        logAuditEvent('settings_theme_changed', { theme }),
};

export const auditCommitments = {
    created: (commitmentId: string, title: string) =>
        logAuditEvent('commitment_created', { commitmentId, title }),
    completed: (commitmentId: string) =>
        logAuditEvent('commitment_completed', { commitmentId }),
    deleted: (commitmentId: string) =>
        logAuditEvent('commitment_deleted', { commitmentId }),
    edited: (commitmentId: string, changes: string[]) =>
        logAuditEvent('commitment_edited', { commitmentId, changedFields: changes }),
};
