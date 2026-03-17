/**
 * Cloud Functions for Anchor OS — barrel re-exports
 *
 * All implementation lives in dedicated modules. This file
 * re-exports every Cloud Function so Firebase can discover them.
 */


// Rate limiting
export { checkRateLimit, resetRateLimit } from './rateLimitCallables';

// Audit logging
export { logAuditEvent } from './audit';

// Family Mode — invitations
export { createFamilyInvitation, revokeInvitation, validateInvitationToken } from './familyInvitations';

// Family Mode — connection lifecycle
export { acceptInvitation } from './familyConnection';
export { confirmConnection } from './familyConnectionConfirm';

// Family Mode — sharing, notifications & disconnect
export { shareAccount, getSharedAccountsWithMe } from './familySharing';
export { disconnectFamily } from './familyDisconnect';

// Notifications
export { getNotifications, dismissNotification } from './notifications';

// Family Mode — triggers & maintenance
export { onSharedTransactionWrite, cleanupExpiredInvitations } from './familyTriggers';

// Family Mode — migration
export { migrateFamilyConnectionsV2 } from './familyMigration';

// Email
export { sendTemplatedEmail } from './email';

// Feedback
export { submitFeedback } from './feedback';

// Shared transactions
export { addTransactionToSharedAccount, fixSharedAccountScopes } from './sharedTransactions';

// Finance automation
export * from './recurring';
export { createRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction, toggleRecurringTransaction } from './recurringApi';

// Push notification reminders
export * from './reminders';

// Bill reminders (PRD-003)
export { processBillReminders } from './billReminderScheduler';

// Account deletion
export { deleteMyAccount } from './deleteAccount';

// MFA recovery
export { recoverMfaWithCode } from './mfaRecovery';

// Bank integration (Mono)
export { linkBankAccount } from './bankLink';
export { unlinkBankAccount } from './bankUnlink';
export { syncBankTransactions, syncBankAccountNow } from './bankSync';
export { monoWebhook } from './bankWebhook';

// Weekly Fabric report
export { generateWeeklyReport } from './weeklyReport';

// Fabric nudges
export { fabricStreakNudge, fabricBudgetNudge, fabricSurplusNudge } from './fabricNudges';
