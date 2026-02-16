/**
 * Tests for useFinanceOperations — all 8 finance CRUD operations
 * Target: 85%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFinanceOperations } from './useFinanceOperations';
import { buildAccount, buildTransaction, buildAuthUser } from '../test/factories';
import type { User } from 'firebase/auth';

// Mock telemetry
vi.mock('../services/telemetry', () => ({
    createTracer: () => ({
        trace: vi.fn(async (_name: string, fn: () => any, _opts?: any) => fn()),
        logEvent: vi.fn(),
    }),
}));

// Mock FinanceService
const mockFinanceService = {
    addAccount: vi.fn(async () => 'new-acc'),
    deleteAccount: vi.fn(async () => {}),
    renameAccount: vi.fn(async () => {}),
    addTransaction: vi.fn(async () => 'new-tx'),
    deleteTransaction: vi.fn(async () => {}),
    updateTransaction: vi.fn(async () => {}),
};
vi.mock('../services/FinanceService', () => ({
    financeService: {
        addAccount: (...args: any[]) => mockFinanceService.addAccount(...args),
        deleteAccount: (...args: any[]) => mockFinanceService.deleteAccount(...args),
        renameAccount: (...args: any[]) => mockFinanceService.renameAccount(...args),
        addTransaction: (...args: any[]) => mockFinanceService.addTransaction(...args),
        deleteTransaction: (...args: any[]) => mockFinanceService.deleteTransaction(...args),
        updateTransaction: (...args: any[]) => mockFinanceService.updateTransaction(...args),
    },
}));

// Mock permissions
vi.mock('../features/finance/utils/permissions', () => ({
    canDeleteTransaction: vi.fn(() => true),
}));

// Mock activity logging
vi.mock('./financeActivityLogging', () => ({
    logTransactionAdded: vi.fn(),
    logTransactionDeleted: vi.fn(),
    logTransactionEdited: vi.fn(),
}));

// Mock secureDb
vi.mock('../utils/secureDb', () => ({
    withTimeout: vi.fn((promise: Promise<any>) => promise),
}));

// Mock error
vi.mock('../utils/error', () => ({
    handleError: vi.fn((err: any) => err),
}));

const mockRestoreSoftDeletedTransaction = vi.fn(async () => {});
const mockConvertCurrencyAcrossAccounts = vi.fn(async () => {});
vi.mock('../api/FinanceOperationsApi', () => ({
    restoreSoftDeletedTransaction: (...args: any[]) => mockRestoreSoftDeletedTransaction(...args),
    convertCurrencyAcrossAccounts: (...args: any[]) => mockConvertCurrencyAcrossAccounts(...args),
}));

describe('useFinanceOperations', () => {
    const user = buildAuthUser() as unknown as User;
    const userName = 'Test User';
    const accounts = [
        buildAccount({ id: 'acc-1', ownerId: 'user-1', currency: 'NGN' }),
        buildAccount({ id: 'acc-2', ownerId: 'user-1', currency: 'USD' }),
    ];
    const transactions = [
        buildTransaction({ id: 'tx-1', accountId: 'acc-1', type: 'expense', amountCents: 5000 }),
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockRestoreSoftDeletedTransaction.mockResolvedValue(undefined);
        mockConvertCurrencyAcrossAccounts.mockResolvedValue(undefined);
    });

    function getHook() {
        return renderHook(() => useFinanceOperations(user, userName, accounts, transactions));
    }

    // ── addAccount ──────────────────────────────────────────────────
    describe('addAccount', () => {
        it('creates account via financeService', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.addAccount({
                    name: 'New Acc',
                    type: 'savings',
                    currency: 'NGN',
                    balanceCents: 0,
                    color: '#000',
                    scope: 'personal',
                });
            });
            expect(mockFinanceService.addAccount).toHaveBeenCalled();
        });

        it('does nothing when user is null', async () => {
            const { result } = renderHook(() =>
                useFinanceOperations(null, userName, accounts, transactions)
            );
            await act(async () => {
                await result.current.addAccount({
                    name: 'X', type: 'checking', currency: 'NGN',
                    balanceCents: 0, color: '#000', scope: 'personal',
                });
            });
            expect(mockFinanceService.addAccount).not.toHaveBeenCalled();
        });
    });

    // ── deleteAccount ───────────────────────────────────────────────
    describe('deleteAccount', () => {
        it('deletes account via financeService', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.deleteAccount('acc-1');
            });
            expect(mockFinanceService.deleteAccount).toHaveBeenCalled();
        });

        it('throws when non-owner tries to delete', async () => {
            const otherAccounts = [buildAccount({ id: 'acc-x', ownerId: 'other-user' })];
            const { result } = renderHook(() =>
                useFinanceOperations(user, userName, otherAccounts, transactions)
            );

            await expect(
                act(async () => { await result.current.deleteAccount('acc-x'); })
            ).rejects.toThrow('Only the account owner can delete this account');
        });

        it('does nothing for non-existent account', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.deleteAccount('nonexistent');
            });
            expect(mockFinanceService.deleteAccount).not.toHaveBeenCalled();
        });
    });

    // ── renameAccount ───────────────────────────────────────────────
    describe('renameAccount', () => {
        it('renames account via financeService', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.renameAccount('acc-1', 'New Name');
            });
            expect(mockFinanceService.renameAccount).toHaveBeenCalled();
        });

        it('throws when non-owner tries to rename', async () => {
            const otherAccounts = [buildAccount({ id: 'acc-x', ownerId: 'other-user' })];
            const { result } = renderHook(() =>
                useFinanceOperations(user, userName, otherAccounts, transactions)
            );

            await expect(
                act(async () => { await result.current.renameAccount('acc-x', 'New'); })
            ).rejects.toThrow('Only the account owner can rename this account');
        });
    });

    // ── addTransaction ──────────────────────────────────────────────
    describe('addTransaction', () => {
        it('adds transaction and logs activity', async () => {
            const { result } = getHook();
            const { logTransactionAdded } = await import('./financeActivityLogging');

            await act(async () => {
                await result.current.addTransaction({
                    title: 'Lunch',
                    amountCents: 1500,
                    type: 'expense',
                    category: 'Food',
                    accountId: 'acc-1',
                    currency: 'NGN',
                    scope: 'personal',
                    date: new Date().toISOString(),
                });
            });

            expect(mockFinanceService.addTransaction).toHaveBeenCalled();
            expect(logTransactionAdded).toHaveBeenCalled();
        });
    });

    // ── deleteTransaction ───────────────────────────────────────────
    describe('deleteTransaction', () => {
        it('deletes transaction with permission check', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.deleteTransaction('tx-1', 'acc-1');
            });
            expect(mockFinanceService.deleteTransaction).toHaveBeenCalled();
        });

        it('throws when user lacks delete permission', async () => {
            const { canDeleteTransaction } = await import('../features/finance/utils/permissions');
            vi.mocked(canDeleteTransaction).mockReturnValueOnce(false);

            const { result } = getHook();

            await expect(
                act(async () => { await result.current.deleteTransaction('tx-1', 'acc-1'); })
            ).rejects.toThrow('You do not have permission');
        });
    });

    // ── updateTransaction ───────────────────────────────────────────
    describe('updateTransaction', () => {
        it('updates transaction via financeService', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.updateTransaction('tx-1', 'acc-1', { title: 'Updated' });
            });
            expect(mockFinanceService.updateTransaction).toHaveBeenCalled();
        });
    });

    // ── restoreTransaction ──────────────────────────────────────────
    describe('restoreTransaction', () => {
        it('restores transaction with balance increment for expense', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.restoreTransaction('tx-1', 'acc-1', 5000, 'expense');
            });

            expect(mockRestoreSoftDeletedTransaction).toHaveBeenCalledWith('user-1', 'tx-1', 'acc-1', 5000, 'expense');
        });

        it('does nothing when user is null', async () => {
            const { result } = renderHook(() =>
                useFinanceOperations(null, userName, accounts, transactions)
            );
            await act(async () => {
                await result.current.restoreTransaction('tx-1', 'acc-1', 5000, 'expense');
            });
            expect(mockRestoreSoftDeletedTransaction).not.toHaveBeenCalled();
        });
    });

    // ── convertCurrency ─────────────────────────────────────────────
    describe('convertCurrency', () => {
        it('creates batch write with linked transactions', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.convertCurrency('acc-1', 'acc-2', 10000, 0.0007);
            });

            expect(mockConvertCurrencyAcrossAccounts).toHaveBeenCalledWith(
                'user-1',
                expect.objectContaining({ id: 'acc-1' }),
                expect.objectContaining({ id: 'acc-2' }),
                10000,
                0.0007
            );
        });

        it('does nothing for non-existent accounts', async () => {
            const { result } = getHook();
            await act(async () => {
                await result.current.convertCurrency('nonexistent', 'acc-2', 10000, 1);
            });
            expect(mockConvertCurrencyAcrossAccounts).not.toHaveBeenCalled();
        });
    });
});
