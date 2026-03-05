/**
 * Tests for AuditService.ts — logAuditEvent + convenience wrappers
 * Target: 90%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logAuditEvent, auditAuth, auditFinance, auditSettings, auditCommitments } from './AuditService';
import { httpsCallable } from 'firebase/functions';

describe('AuditService', () => {
    const mockCallable = vi.fn(async () => ({ data: { success: true } }));

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);
    });

    // ── logAuditEvent ───────────────────────────────────────────────
    describe('logAuditEvent', () => {
        it('calls logAuditEvent Cloud Function', async () => {
            await logAuditEvent('auth_login_success', { method: 'password' });
            expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'logAuditEvent');
            expect(mockCallable).toHaveBeenCalledWith({
                action: 'auth_login_success',
                metadata: { method: 'password' },
            });
        });

        it('silently handles errors without throwing', async () => {
            mockCallable.mockRejectedValueOnce(new Error('network'));
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // Should NOT throw
            await expect(logAuditEvent('auth_logout')).resolves.toBeUndefined();
            expect(warnSpy).toHaveBeenCalled();
        });

        it('passes empty metadata by default', async () => {
            await logAuditEvent('auth_logout');
            expect(mockCallable).toHaveBeenCalledWith({
                action: 'auth_logout',
                metadata: {},
            });
        });
    });

    // ── auditAuth ───────────────────────────────────────────────────
    describe('auditAuth', () => {
        it('loginSuccess sends correct event', async () => {
            await auditAuth.loginSuccess('password');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'auth_login_success', metadata: { method: 'password' } })
            );
        });

        it('loginFailed sends reason', async () => {
            await auditAuth.loginFailed('google', 'bad token');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'auth_login_failed', metadata: { method: 'google', reason: 'bad token' } })
            );
        });

        it('logout sends correct event', async () => {
            await auditAuth.logout();
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'auth_logout' })
            );
        });

        it('mfaStarted sends correct event', async () => {
            await auditAuth.mfaStarted();
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'auth_mfa_challenge_started' })
            );
        });

        it('mfaCompleted sends success flag', async () => {
            await auditAuth.mfaCompleted(true);
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'auth_mfa_challenge_completed', metadata: { success: true } })
            );
        });

        it('passwordChanged sends correct event', async () => {
            await auditAuth.passwordChanged();
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'auth_password_changed' })
            );
        });

        it('emailVerified sends correct event', async () => {
            await auditAuth.emailVerified();
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'auth_email_verified' })
            );
        });
    });

    // ── auditFinance ────────────────────────────────────────────────
    describe('auditFinance', () => {
        it('accountCreated sends metadata', async () => {
            await auditFinance.accountCreated('acc-1', 'Savings', 'savings');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'account_created',
                    metadata: { accountId: 'acc-1', accountName: 'Savings', type: 'savings' },
                })
            );
        });

        it('accountArchived sends metadata', async () => {
            await auditFinance.accountArchived('acc-1', 'Old');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'account_archived' })
            );
        });

        it('accountRenamed sends old and new names', async () => {
            await auditFinance.accountRenamed('acc-1', 'Old', 'New');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'account_renamed',
                    metadata: { accountId: 'acc-1', oldName: 'Old', newName: 'New' },
                })
            );
        });

        it('transactionCreated sends full metadata', async () => {
            await auditFinance.transactionCreated('tx-1', 'acc-1', 5000, 'expense');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'transaction_created',
                    metadata: { transactionId: 'tx-1', accountId: 'acc-1', amountCents: 5000, type: 'expense' },
                })
            );
        });

        it('transactionDeleted sends metadata', async () => {
            await auditFinance.transactionDeleted('tx-1', 'acc-1');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'transaction_deleted' })
            );
        });

        it('transactionUpdated sends changed fields', async () => {
            await auditFinance.transactionUpdated('tx-1', 'acc-1', ['title', 'amount']);
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'transaction_updated',
                    metadata: { transactionId: 'tx-1', accountId: 'acc-1', changedFields: ['title', 'amount'] },
                })
            );
        });

        it('operationFailed sends operation and reason', async () => {
            await auditFinance.operationFailed('transaction_delete', {
                accountId: 'acc-1',
                transactionId: 'tx-1',
                reason: 'permission-denied',
            });

            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'finance_operation_failed',
                    metadata: {
                        operation: 'transaction_delete',
                        accountId: 'acc-1',
                        transactionId: 'tx-1',
                        reason: 'permission-denied',
                    },
                })
            );
        });
    });

    // ── auditSettings ───────────────────────────────────────────────
    describe('auditSettings', () => {
        it('profileUpdated sends fields', async () => {
            await auditSettings.profileUpdated(['name', 'theme']);
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'settings_profile_updated',
                    metadata: { updatedFields: ['name', 'theme'] },
                })
            );
        });

        it('notificationsChanged sends enabled flag', async () => {
            await auditSettings.notificationsChanged(false);
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ metadata: { enabled: false } })
            );
        });

        it('themeChanged sends theme name', async () => {
            await auditSettings.themeChanged('dark');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ metadata: { theme: 'dark' } })
            );
        });
    });

    // ── auditCommitments ────────────────────────────────────────────
    describe('auditCommitments', () => {
        it('created sends title', async () => {
            await auditCommitments.created('c-1', 'Morning Run');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'commitment_created',
                    metadata: { commitmentId: 'c-1', title: 'Morning Run' },
                })
            );
        });

        it('completed sends id', async () => {
            await auditCommitments.completed('c-1');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'commitment_completed' })
            );
        });

        it('deleted sends id', async () => {
            await auditCommitments.deleted('c-1');
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({ action: 'commitment_deleted' })
            );
        });

        it('edited sends changed fields', async () => {
            await auditCommitments.edited('c-1', ['title']);
            expect(mockCallable).toHaveBeenCalledWith(
                expect.objectContaining({
                    action: 'commitment_edited',
                    metadata: { commitmentId: 'c-1', changedFields: ['title'] },
                })
            );
        });
    });
});
