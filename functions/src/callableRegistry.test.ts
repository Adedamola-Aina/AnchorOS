/**
 * Callable Registry Tests — ARCH-025
 *
 * Enforces that every Cloud Function export has a registry entry,
 * and every registry entry points to a real export.
 */

import { describe, it, expect } from 'vitest';
import { CALLABLE_REGISTRY, getCallableEntry, getCallablesByDomain, getCallableDomains } from './callableRegistry';

// All named exports from index.ts + wildcard exports
const ALL_EXPORTS: string[] = [
    // Rate limiting
    'checkRateLimit', 'resetRateLimit',
    // Audit
    'logAuditEvent',
    // Family — invitations
    'createFamilyInvitation', 'revokeInvitation', 'validateInvitationToken',
    // Family — connections
    'acceptInvitation', 'confirmConnection',
    // Family — sharing
    'shareAccount', 'getSharedAccountsWithMe', 'disconnectFamily',
    // Notifications
    'getNotifications', 'dismissNotification',
    // Family — triggers
    'onSharedTransactionWrite', 'cleanupExpiredInvitations',
    // Family — migration
    'migrateFamilyConnectionsV2',
    // Migration framework
    'listMigrations', 'getMigrationStatus', 'runMigration', 'rollbackMigration',
    // Email
    'sendTemplatedEmail',
    // Feedback
    'submitFeedback',
    // Shared transactions
    'addTransactionToSharedAccount', 'fixSharedAccountScopes',
    // Recurring
    'createRecurringTransaction', 'updateRecurringTransaction',
    'deleteRecurringTransaction', 'toggleRecurringTransaction',
    'processRecurringTransactions',
    // Reminders
    'processReminders',
    // Bill reminders
    'processBillReminders',
    // Account deletion
    'deleteMyAccount',
    // MFA
    'recoverMfaWithCode',
    // Bank
    'linkBankAccount', 'unlinkBankAccount', 'syncBankTransactions',
    'syncBankAccountNow', 'monoWebhook',
    // Auth events
    'recordAuthEvent', 'reportUnrecognisedSignIn', 'dismissAuthEvent',
    // Passkey
    'issuePasskeyChallenge', 'verifyPasskeyAssertion',
    'completePasskeyRegistration', 'deletePasskey',
    // Health
    'health',
    // Weekly report
    'generateWeeklyReport',
    // Fabric nudges
    'fabricStreakNudge', 'fabricBudgetNudge', 'fabricSurplusNudge',
];

describe('CallableRegistry', () => {
    it('has an entry for every exported function', () => {
        const registeredNames = new Set(CALLABLE_REGISTRY.map((e) => e.name));
        const missing = ALL_EXPORTS.filter((name) => !registeredNames.has(name));
        expect(missing, `Missing registry entries for: ${missing.join(', ')}`).toEqual([]);
    });

    it('every registry entry corresponds to a real export', () => {
        const exportSet = new Set(ALL_EXPORTS);
        const orphaned = CALLABLE_REGISTRY.filter((e) => !exportSet.has(e.name));
        expect(
            orphaned.map((e) => e.name),
            'Registry entries without matching exports'
        ).toEqual([]);
    });

    it('all entries have required fields', () => {
        for (const entry of CALLABLE_REGISTRY) {
            expect(entry.name).toBeTruthy();
            expect(entry.version).toBeGreaterThanOrEqual(1);
            expect(entry.description).toBeTruthy();
            expect(['callable', 'scheduled', 'trigger', 'webhook']).toContain(entry.trigger);
            expect(['required', 'none']).toContain(entry.auth);
            expect(['stable', 'beta', 'deprecated', 'internal']).toContain(entry.status);
            expect(entry.domain).toBeTruthy();
        }
    });

    it('deprecated entries have deprecation notice', () => {
        const deprecated = CALLABLE_REGISTRY.filter((e) => e.status === 'deprecated');
        for (const entry of deprecated) {
            expect(entry.deprecationNotice, `${entry.name} missing deprecationNotice`).toBeTruthy();
        }
    });

    it('no duplicate names in registry', () => {
        const names = CALLABLE_REGISTRY.map((e) => e.name);
        const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
        expect(duplicates, 'Duplicate registry entries').toEqual([]);
    });

    describe('getCallableEntry', () => {
        it('returns entry for known callable', () => {
            const entry = getCallableEntry('health');
            expect(entry).toBeDefined();
            expect(entry?.domain).toBe('infra');
        });

        it('returns undefined for unknown callable', () => {
            expect(getCallableEntry('nonexistent')).toBeUndefined();
        });
    });

    describe('getCallablesByDomain', () => {
        it('returns entries for a domain', () => {
            const family = getCallablesByDomain('family');
            expect(family.length).toBeGreaterThan(0);
            expect(family.every((e) => e.domain === 'family')).toBe(true);
        });
    });

    describe('getCallableDomains', () => {
        it('returns sorted unique domains', () => {
            const domains = getCallableDomains();
            expect(domains.length).toBeGreaterThan(0);
            expect(domains).toEqual([...domains].sort());
        });
    });
});
