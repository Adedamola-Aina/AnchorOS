/**
 * Callable API Registry — ARCH-025
 *
 * Centralized catalog of all Cloud Function callable APIs with
 * version metadata, type contracts, and deprecation tracking.
 *
 * Every callable exported from index.ts MUST have an entry here.
 * The registry test enforces completeness.
 */

/** Trigger type for a Cloud Function */
export type FunctionTrigger = 'callable' | 'scheduled' | 'trigger' | 'webhook';

/** Auth requirement for a callable */
export type AuthRequirement = 'required' | 'none';

/** API lifecycle status */
export type ApiStatus = 'stable' | 'beta' | 'deprecated' | 'internal';

/** Registry entry for a single callable */
export interface CallableRegistryEntry {
    /** Function name as exported from index.ts */
    readonly name: string;
    /** Current API version */
    readonly version: number;
    /** Human-readable description */
    readonly description: string;
    /** Function trigger type */
    readonly trigger: FunctionTrigger;
    /** Authentication requirement */
    readonly auth: AuthRequirement;
    /** Rate limit bucket (from rateLimit.ts) or null */
    readonly rateLimit: string | null;
    /** API lifecycle status */
    readonly status: ApiStatus;
    /** Domain grouping */
    readonly domain: string;
    /** Deprecation notice (if status is 'deprecated') */
    readonly deprecationNotice?: string;
    /** Version that replaces this one (if deprecated) */
    readonly replacedBy?: string;
}

/**
 * Complete callable registry — source of truth for all Cloud Functions.
 *
 * Sorted by domain, then alphabetically within domain.
 */
export const CALLABLE_REGISTRY: ReadonlyArray<CallableRegistryEntry> = [
    // ── Auth Events ──────────────────────────────
    {
        name: 'dismissAuthEvent',
        version: 1,
        description: 'Dismiss an auth event from the security log',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'auth',
    },
    {
        name: 'recordAuthEvent',
        version: 1,
        description: 'Record a sign-in or security event for audit history',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'auth',
    },
    {
        name: 'reportUnrecognisedSignIn',
        version: 1,
        description: 'Flag a sign-in event as unrecognised by the user',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'auth',
    },

    // ── Bank Integration ─────────────────────────
    {
        name: 'linkBankAccount',
        version: 1,
        description: 'Link a bank account via Mono',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'bank',
    },
    {
        name: 'monoWebhook',
        version: 1,
        description: 'Mono bank webhook receiver',
        trigger: 'webhook',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'bank',
    },
    {
        name: 'syncBankAccountNow',
        version: 1,
        description: 'Manually trigger bank account sync',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'bank',
    },
    {
        name: 'syncBankTransactions',
        version: 1,
        description: 'Scheduled bank transaction sync',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'bank',
    },
    {
        name: 'unlinkBankAccount',
        version: 1,
        description: 'Unlink a bank account',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'bank',
    },

    // ── Fabric AI ────────────────────────────────
    {
        name: 'fabricBudgetNudge',
        version: 1,
        description: 'Scheduled nudge for budget threshold alerts',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },
    {
        name: 'fabricStreakNudge',
        version: 1,
        description: 'Scheduled nudge for savings streak encouragement',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },
    {
        name: 'fabricSurplusNudge',
        version: 1,
        description: 'Scheduled nudge for surplus allocation suggestions',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },
    {
        name: 'generateWeeklyReport',
        version: 1,
        description: 'Generate weekly Fabric insight report',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },

    // ── Family Mode ──────────────────────────────
    {
        name: 'acceptInvitation',
        version: 1,
        description: 'Accept a family connection invitation',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'invite',
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'cleanupExpiredInvitations',
        version: 1,
        description: 'Scheduled cleanup of expired family invitations',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'confirmConnection',
        version: 1,
        description: 'Confirm a pending family connection',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'createFamilyInvitation',
        version: 1,
        description: 'Create a family connection invitation via email',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'createInvitation',
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'disconnectFamily',
        version: 1,
        description: 'Remove or leave a family connection',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'disconnectFamily',
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'getSharedAccountsWithMe',
        version: 1,
        description: 'List accounts shared with the current user',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'getSharedAccounts',
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'migrateFamilyConnectionsV2',
        version: 1,
        description: 'One-time V1→V2 family connection migration',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'familyMigration',
        status: 'deprecated',
        domain: 'family',
        deprecationNotice: 'Use runMigration with id "001" instead',
        replacedBy: 'runMigration',
    },
    {
        name: 'onSharedTransactionWrite',
        version: 1,
        description: 'Trigger: sync notifications on shared transaction write',
        trigger: 'trigger',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'revokeInvitation',
        version: 1,
        description: 'Revoke a pending family invitation',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'revokeInvitation',
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'shareAccount',
        version: 1,
        description: 'Share or unshare a financial account with family',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'shareAccount',
        status: 'stable',
        domain: 'family',
    },
    {
        name: 'validateInvitationToken',
        version: 1,
        description: 'Validate a family invitation token',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'tokenValidation',
        status: 'stable',
        domain: 'family',
    },

    // ── Finance ──────────────────────────────────
    {
        name: 'addTransactionToSharedAccount',
        version: 1,
        description: 'Add a transaction to a shared account',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'transactionCreate',
        status: 'stable',
        domain: 'finance',
    },
    {
        name: 'createRecurringTransaction',
        version: 1,
        description: 'Create a recurring transaction rule',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'transactionCreate',
        status: 'stable',
        domain: 'finance',
    },
    {
        name: 'deleteRecurringTransaction',
        version: 1,
        description: 'Delete a recurring transaction rule',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'finance',
    },
    {
        name: 'fixSharedAccountScopes',
        version: 1,
        description: 'Fix scope field on shared account transactions',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'internal',
        domain: 'finance',
    },
    {
        name: 'processRecurringTransactions',
        version: 1,
        description: 'Scheduled processing of due recurring transactions',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'finance',
    },
    {
        name: 'toggleRecurringTransaction',
        version: 1,
        description: 'Enable or disable a recurring transaction rule',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'finance',
    },
    {
        name: 'updateRecurringTransaction',
        version: 1,
        description: 'Update a recurring transaction rule',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'finance',
    },

    // ── Infrastructure ───────────────────────────
    {
        name: 'checkRateLimit',
        version: 1,
        description: 'Check rate limit status for a bucket',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'internal',
        domain: 'infra',
    },
    {
        name: 'health',
        version: 1,
        description: 'Health check endpoint',
        trigger: 'callable',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'infra',
    },
    {
        name: 'logAuditEvent',
        version: 1,
        description: 'Log a security/audit event',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'infra',
    },
    {
        name: 'resetRateLimit',
        version: 1,
        description: 'Reset a rate limit bucket (admin)',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'internal',
        domain: 'infra',
    },

    // ── Migration Framework ──────────────────────
    {
        name: 'getMigrationStatus',
        version: 1,
        description: 'Get status of a specific migration',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'migration',
    },
    {
        name: 'listMigrations',
        version: 1,
        description: 'List all registered migrations with metadata',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'migration',
    },
    {
        name: 'rollbackMigration',
        version: 1,
        description: 'Rollback a previously completed migration',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'familyMigration',
        status: 'stable',
        domain: 'migration',
    },
    {
        name: 'runMigration',
        version: 1,
        description: 'Run a migration (with optional dry-run)',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'familyMigration',
        status: 'stable',
        domain: 'migration',
    },

    // ── MFA ──────────────────────────────────────
    {
        name: 'recoverMfaWithCode',
        version: 1,
        description: 'MFA recovery using backup code',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'mfaRecovery',
        status: 'stable',
        domain: 'mfa',
    },

    // ── Notifications ────────────────────────────
    {
        name: 'dismissNotification',
        version: 1,
        description: 'Dismiss a notification',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'dismissNotification',
        status: 'stable',
        domain: 'notifications',
    },
    {
        name: 'getNotifications',
        version: 1,
        description: 'Fetch notifications with optional filters',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'getNotifications',
        status: 'stable',
        domain: 'notifications',
    },
    {
        name: 'processBillReminders',
        version: 1,
        description: 'Scheduled processing of bill reminder notifications',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'notifications',
    },
    {
        name: 'processReminders',
        version: 1,
        description: 'Scheduled processing of push notification reminders',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'notifications',
    },
    {
        name: 'sendTemplatedEmail',
        version: 1,
        description: 'Send a templated email notification',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'emailSend',
        status: 'internal',
        domain: 'notifications',
    },

    // ── Passkey (WebAuthn) ───────────────────────
    {
        name: 'completePasskeyRegistration',
        version: 1,
        description: 'Complete passkey registration with attestation verification',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },
    {
        name: 'deletePasskey',
        version: 1,
        description: 'Delete a registered passkey',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },
    {
        name: 'issuePasskeyChallenge',
        version: 1,
        description: 'Issue a WebAuthn challenge for passkey sign-in',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },
    {
        name: 'verifyPasskeyAssertion',
        version: 1,
        description: 'Verify a WebAuthn assertion for passkey sign-in',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'passkey',
    },

    // ── User Account ─────────────────────────────
    {
        name: 'deleteMyAccount',
        version: 1,
        description: 'Permanently delete user account and all associated data',
        trigger: 'callable',
        auth: 'required',
        rateLimit: 'deleteAccount',
        status: 'stable',
        domain: 'user',
    },
    {
        name: 'submitFeedback',
        version: 1,
        description: 'Submit user feedback or bug report',
        trigger: 'callable',
        auth: 'required',
        rateLimit: null,
        status: 'stable',
        domain: 'user',
    },
];

/** Get a registry entry by function name. */
export function getCallableEntry(name: string): CallableRegistryEntry | undefined {
    return CALLABLE_REGISTRY.find((e) => e.name === name);
}

/** Get all entries for a domain. */
export function getCallablesByDomain(domain: string): ReadonlyArray<CallableRegistryEntry> {
    return CALLABLE_REGISTRY.filter((e) => e.domain === domain);
}

/** Get all unique domain names. */
export function getCallableDomains(): string[] {
    return [...new Set(CALLABLE_REGISTRY.map((e) => e.domain))].sort();
}
