/**
 * Unit tests for TransactionService
 * 
 * Tests ALL transaction operations with proper Firebase mocking.
 * Follows TESTING_STRATEGY.md patterns (lines 104-174).
 * 
 * @see docs/TESTING_STRATEGY.md
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransactionService } from '../TransactionService';
import { AnchorError } from '../../utils/error';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import type { CreateTransactionPayload, UpdateTransactionPayload } from '../financeTypes';

// Import Firebase functions to mock
import * as firestore from 'firebase/firestore';
import * as transferOps from '../TransferOperations';

// Mock the permission utilities
vi.mock('../../features/finance/utils/permissions', () => ({
    canAddTransaction: vi.fn((account, userId) => account.ownerId === userId || account.shares?.[userId]),
    canDeleteTransaction: vi.fn((account, userId) => account.ownerId === userId || account.shares?.[userId] === 'manage'),
    canEditTransaction: vi.fn((account, userId) => account.ownerId === userId || account.shares?.[userId] === 'manage'),
}));

// Mock TransferOperations module
vi.mock('../TransferOperations', () => ({
    processTransferTransaction: vi.fn(),
    processStandardTransaction: vi.fn(),
}));

describe('TransactionService', () => {
    let service: TransactionService;
    let mockFirestore: any;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Create mock Firestore instance
        mockFirestore = {} as any;
        service = new TransactionService(mockFirestore);
    });

    // ========================================================================
    // addTransaction() Tests
    // ========================================================================

    describe('addTransaction', () => {
        const createMockAccount = (id: string, ownerId: string): AnchorAccount => ({
            id,
            name: `Account ${id}`,
            balanceCents: 100000,
            type: 'checking',
            currency: 'USD',
            color: '#000000',
            scope: 'personal',
            ownerId,
        });

        it('creates standard transaction successfully', async () => {
            // Arrange
            const userId = 'user-123';
            const account = createMockAccount('acc-1', userId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                amountCents: 5000,
                type: 'expense',
                category: 'food',
                title: 'Groceries',
            };

            const mockBatch = {
                set: vi.fn(),
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.addTransaction(userId, payload, [account]);

            // Assert
            expect(transferOps.processStandardTransaction).toHaveBeenCalledWith(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                account,
                expect.any(String), // transactionDate
                expect.any(String), // createdAt
                expect.any(Boolean) // isBackdated
            );
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('delegates to processTransferTransaction for transfers', async () => {
            // Arrange
            const userId = 'user-456';
            const sourceAccount = createMockAccount('acc-source', userId);
            const destAccount = createMockAccount('acc-dest', userId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 10000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
            };

            const mockBatch = {
                set: vi.fn(),
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.addTransaction(userId, payload, [sourceAccount, destAccount]);

            // Assert
            expect(transferOps.processTransferTransaction).toHaveBeenCalledWith(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                expect.any(String), // transactionDate
                expect.any(String), // createdAt
                expect.any(Boolean) // isBackdated
            );
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('throws VALIDATION error if account not found', async () => {
            // Arrange
            const payload: CreateTransactionPayload = {
                accountId: 'non-existent',
                amountCents: 1000,
                type: 'expense',
                category: 'misc',
                title: 'Test',
            };

            // Act & Assert
            await expect(service.addTransaction('user-1', payload, [])).rejects.toThrow(AnchorError);
            await expect(service.addTransaction('user-1', payload, [])).rejects.toThrow('Source account not found');
        });

        it('throws PERMISSION error if user lacks transaction rights', async () => {
            // Arrange
            const ownerId = 'owner-123';
            const nonOwner = 'non-owner-456';
            const account = createMockAccount('acc-1', ownerId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                amountCents: 5000,
                type: 'expense',
                category: 'food',
                title: 'Unauthorized',
            };

            // Mock permission check to deny
            const { canAddTransaction } = await import('../../features/finance/utils/permissions');
            vi.mocked(canAddTransaction).mockReturnValueOnce(false);

            // Act & Assert
            await expect(service.addTransaction(nonOwner, payload, [account])).rejects.toThrow(AnchorError);
            await expect(service.addTransaction(nonOwner, payload, [account])).rejects.toThrow('Permission denied');
        });

        it('wraps Firebase errors in AnchorError', async () => {
            // Arrange
            const account = createMockAccount('acc-1', 'user-1');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                amountCents: 1000,
                type: 'income',
                category: 'salary',
                title: 'Paycheck',
            };

            const mockBatch = {
                set: vi.fn(),
                update: vi.fn(),
                commit: vi.fn().mockRejectedValue(new Error('Firestore error')),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act & Assert
            await expect(service.addTransaction('user-1', payload, [account])).rejects.toThrow(AnchorError);
            await expect(service.addTransaction('user-1', payload, [account])).rejects.toThrow('Failed to add transaction');
        });
    });

    // ========================================================================
    // deleteTransaction() Tests
    // ========================================================================

    describe('deleteTransaction', () => {
        const createMockTransaction = (id: string, type: 'income' | 'expense', amountCents: number): AnchorTransaction => ({
            id,
            title: `Transaction ${id}`,
            amountCents,
            type,
            category: 'test',
            date: '2026-01-27T00:00:00Z',
            accountId: 'acc-1',
            accountName: 'Test Account',
            currency: 'USD',
            createdAt: '2026-01-27T00:00:00Z',
            createdBy: 'user-1',
            isSoftDeleted: false,
            accountOwnerId: 'user-1',
            accountShares: {},
        });

        it('soft-deletes transaction successfully', async () => {
            // Arrange
            const userId = 'user-123';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Test Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: userId,
            };
            const transaction = createMockTransaction('tx-1', 'expense', 5000);

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.deleteTransaction(userId, 'tx-1', 'acc-1', [account], [transaction]);

            // Assert
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(), // tx ref
                expect.objectContaining({
                    isSoftDeleted: true,
                    deletedBy: userId,
                })
            );
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('reverses balance for expense transaction', async () => {
            // Arrange
            const userId = 'user-456';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Checking',
                balanceCents: 95000,
                type: 'checking',
                currency: 'USD',
                color: '#FF0000',
                scope: 'personal',
                ownerId: userId,
            };
            const expenseTx = createMockTransaction('tx-expense', 'expense', 5000);

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.deleteTransaction(userId, 'tx-expense', 'acc-1', [account], [expenseTx]);

            // Assert
            // For expense deletion, balance should increase (reversal)
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(), // account ref
                { balanceCents: expect.objectContaining({ _increment: 5000 }) }
            );
        });

        it('reverses balance for income transaction', async () => {
            // Arrange
            const userId = 'user-789';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Savings',
                balanceCents: 105000,
                type: 'savings',
                currency: 'NGN',
                color: '#00FF00',
                scope: 'personal',
                ownerId: userId,
            };
            const incomeTx = createMockTransaction('tx-income', 'income', 10000);

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.deleteTransaction(userId, 'tx-income', 'acc-1', [account], [incomeTx]);

            // Assert
            // For income deletion, balance should decrease (reversal)
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(), // account ref
                { balanceCents: expect.objectContaining({ _increment: -10000 }) }
            );
        });

        it('deletes linked transfer transaction when present', async () => {
            // Arrange
            const userId = 'user-linked';
            const account: AnchorAccount = {
                id: 'acc-source',
                name: 'Source',
                balanceCents: 90000,
                type: 'checking',
                currency: 'USD',
                color: '#0000FF',
                scope: 'personal',
                ownerId: userId,
            };
            const linkedTx: AnchorTransaction = {
                ...createMockTransaction('tx-transfer', 'expense', 10000),
                linkedTransactionId: 'tx-paired',
                linkedUserId: userId,
                linkId: 'link-123',
            };

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Mock getDoc to return linked transaction
            vi.mocked(firestore.getDoc).mockResolvedValueOnce({
                exists: () => true,
                data: () => createMockTransaction('tx-paired', 'income', 10000),
            } as any);

            // Act
            await service.deleteTransaction(userId, 'tx-transfer', 'acc-source', [account], [linkedTx]);

            // Assert
            expect(firestore.getDoc).toHaveBeenCalled();
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('handles missing linked transaction gracefully', async () => {
            // Arrange
            const userId = 'user-orphan';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: userId,
            };
            const orphanedTx: AnchorTransaction = {
                ...createMockTransaction('tx-orphaned', 'expense', 5000),
                linkedTransactionId: 'tx-missing',
                linkedUserId: userId,
            };

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Mock getDoc to return non-existent
            vi.mocked(firestore.getDoc).mockResolvedValueOnce({
                exists: () => false,
            } as any);

            // Act & Assert - should not throw
            await expect(service.deleteTransaction(userId, 'tx-orphaned', 'acc-1', [account], [orphanedTx])).resolves.toBeUndefined();
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('throws VALIDATION error if account not found', async () => {
            // Arrange
            const tx = createMockTransaction('tx-1', 'expense', 1000);

            // Act & Assert
            await expect(service.deleteTransaction('user-1', 'tx-1', 'non-existent', [], [tx])).rejects.toThrow(AnchorError);
            await expect(service.deleteTransaction('user-1', 'tx-1', 'non-existent', [], [tx])).rejects.toThrow('Account not found');
        });

        it('throws VALIDATION error if transaction not found', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: 'user-1',
            };

            // Act & Assert
            await expect(service.deleteTransaction('user-1', 'non-existent-tx', 'acc-1', [account], [])).rejects.toThrow(AnchorError);
            await expect(service.deleteTransaction('user-1', 'non-existent-tx', 'acc-1', [account], [])).rejects.toThrow('Transaction not found');
        });

        it('throws PERMISSION error if user lacks delete rights', async () => {
            // Arrange
            const ownerId = 'owner-123';
            const nonOwner = 'non-owner-456';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Protected',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#FFFFFF',
                scope: 'personal',
                ownerId,
            };
            const tx = createMockTransaction('tx-1', 'expense', 1000);

            const { canDeleteTransaction } = await import('../../features/finance/utils/permissions');
            vi.mocked(canDeleteTransaction).mockReturnValueOnce(false);

            // Act & Assert
            await expect(service.deleteTransaction(nonOwner, 'tx-1', 'acc-1', [account], [tx])).rejects.toThrow(AnchorError);
            await expect(service.deleteTransaction(nonOwner, 'tx-1', 'acc-1', [account], [tx])).rejects.toThrow('Permission denied');
        });

        it('wraps Firebase errors in AnchorError', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: 'user-1',
            };
            const tx = createMockTransaction('tx-1', 'expense', 1000);

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockRejectedValue(new Error('Firestore error')),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act & Assert
            await expect(service.deleteTransaction('user-1', 'tx-1', 'acc-1', [account], [tx])).rejects.toThrow(AnchorError);
            await expect(service.deleteTransaction('user-1', 'tx-1', 'acc-1', [account], [tx])).rejects.toThrow('Failed to delete transaction');
        });
    });

    // ========================================================================
    // updateTransaction() Tests
    // ========================================================================

    describe('updateTransaction', () => {
        it('updates transaction fields successfully', async () => {
            // Arrange
            const userId = 'user-update';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: userId,
            };
            const updates: UpdateTransactionPayload = {
                title: 'Updated Title',
                category: 'entertainment',
            };

            // Mock runTransaction
            vi.mocked(firestore.runTransaction).mockImplementation(async (_db, callback) => {
                const mockTx = {
                    get: vi.fn().mockResolvedValue({
                        exists: () => true,
                        data: () => ({
                            id: 'tx-1',
                            amountCents: 5000,
                            type: 'expense',
                        }),
                    }),
                    update: vi.fn(),
                };
                return callback(mockTx as any);
            });

            // Act
            await service.updateTransaction(userId, 'tx-1', 'acc-1', updates, [account]);

            // Assert
            expect(firestore.runTransaction).toHaveBeenCalled();
        });

        it('recalculates account balance when amount changes', async () => {
            // Arrange
            const userId = 'user-balance';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Account',
                balanceCents: 95000, // After 5000 expense
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: userId,
            };
            const updates: UpdateTransactionPayload = {
                amountCents: 8000, // Changed from 5000 to 8000
            };

            const mockTxUpdate = vi.fn();
            const mockAccUpdate = vi.fn();

            vi.mocked(firestore.runTransaction).mockImplementation(async (_db, callback) => {
                const mockTx = {
                    get: vi.fn().mockResolvedValue({
                        exists: () => true,
                        data: () => ({
                            id: 'tx-1',
                            amountCents: 5000,
                            type: 'expense',
                            accountId: 'acc-1',
                        }),
                    }),
                    update: (...args: any[]) => {
                        if (args[0].path?.includes('accounts')) {
                            mockAccUpdate(...args);
                        } else {
                            mockTxUpdate(...args);
                        }
                    },
                };
                return callback(mockTx as any);
            });

            // Act
            await service.updateTransaction(userId, 'tx-1', 'acc-1', updates, [account]);

            // Assert
            // Difference: 8000 - 5000 = 3000
            // For expense: balance should decrease by 3000
            expect(mockAccUpdate).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    balanceCents: expect.objectContaining({ _increment: -3000 }),
                })
            );
        });

        it('syncs linked transfer transaction when applicable', async () => {
            // Arrange
            const userId = 'user-linked';
            const account: AnchorAccount = {
                id: 'acc-source',
                name: 'Source',
                balanceCents: 90000,
                type: 'checking',
                currency: 'USD',
                color: '#0000FF',
                scope: 'personal',
                ownerId: userId,
            };
            const updates: UpdateTransactionPayload = {
                title: 'Updated Transfer',
            };

            vi.mocked(firestore.runTransaction).mockImplementation(async (_db, callback) => {
                const mockTx = {
                    get: vi.fn()
                        .mockResolvedValueOnce({
                            exists: () => true,
                            data: () => ({
                                id: 'tx-source',
                                amountCents: 10000,
                                type: 'expense',
                                linkedTransactionId: 'tx-dest',
                                linkedUserId: userId,
                            }),
                        })
                        .mockResolvedValueOnce({
                            exists: () => true,
                            data: () => ({
                                id: 'tx-dest',
                                amountCents: 10000,
                                type: 'income',
                                accountId: 'acc-dest',
                            }),
                        }),
                    update: vi.fn(),
                };
                return callback(mockTx as any);
            });

            // Act
            await service.updateTransaction(userId, 'tx-source', 'acc-source', updates, [account]);

            // Assert
            expect(firestore.runTransaction).toHaveBeenCalled();
        });

        it('throws VALIDATION error if account not found', async () => {
            // Arrange
            const updates: UpdateTransactionPayload = { title: 'New Title' };

            // Act & Assert
            await expect(service.updateTransaction('user-1', 'tx-1', 'non-existent', updates, [])).rejects.toThrow(AnchorError);
            await expect(service.updateTransaction('user-1', 'tx-1', 'non-existent', updates, [])).rejects.toThrow('Account not found');
        });

        it('throws VALIDATION error if transaction does not exist', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: 'user-1',
            };
            const updates: UpdateTransactionPayload = { title: 'Updated' };

            vi.mocked(firestore.runTransaction).mockImplementation(async (_db, callback) => {
                const mockTx = {
                    get: vi.fn().mockResolvedValue({
                        exists: () => false,
                    }),
                    update: vi.fn(),
                };
                return callback(mockTx as any);
            });

            // Act & Assert
            await expect(service.updateTransaction('user-1', 'non-existent-tx', 'acc-1', updates, [account])).rejects.toThrow(AnchorError);
            await expect(service.updateTransaction('user-1', 'non-existent-tx', 'acc-1', updates, [account])).rejects.toThrow('Transaction does not exist');
        });

        it('throws PERMISSION error if user lacks edit rights', async () => {
            // Arrange
            const ownerId = 'owner-789';
            const nonOwner = 'non-owner-999';
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Protected',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#AAAAAA',
                scope: 'personal',
                ownerId,
            };
            const updates: UpdateTransactionPayload = { title: 'Hacked' };

            const { canEditTransaction } = await import('../../features/finance/utils/permissions');
            vi.mocked(canEditTransaction).mockReturnValueOnce(false);

            // Act & Assert
            await expect(service.updateTransaction(nonOwner, 'tx-1', 'acc-1', updates, [account])).rejects.toThrow(AnchorError);
            await expect(service.updateTransaction(nonOwner, 'tx-1', 'acc-1', updates, [account])).rejects.toThrow('Permission denied');
        });

        it('wraps Firebase errors in AnchorError', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-1',
                name: 'Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: 'user-1',
            };
            const updates: UpdateTransactionPayload = { title: 'Fail' };

            vi.mocked(firestore.runTransaction).mockRejectedValue(new Error('Firestore error'));

            // Act & Assert
            await expect(service.updateTransaction('user-1', 'tx-1', 'acc-1', updates, [account])).rejects.toThrow(AnchorError);
            await expect(service.updateTransaction('user-1', 'tx-1', 'acc-1', updates, [account])).rejects.toThrow('Failed to update transaction');
        });
    });
});
