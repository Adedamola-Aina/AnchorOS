/**
 * Unit tests for TransferOperations
 * 
 * Tests batch operation helpers for standard and transfer transactions.
 * Follows TESTING_STRATEGY.md patterns (lines 104-174).
 * 
 * @see docs/TESTING_STRATEGY.md
 */
// @ts-nocheck


import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processTransferTransaction, processStandardTransaction } from '../TransferOperations';
import { AnchorError } from '../../utils/error';
import type { AnchorAccount } from '../../types';
import type { CreateTransactionPayload } from '../financeTypes';
import * as firestore from 'firebase/firestore';

// Mock the permission utilities
vi.mock('../../features/finance/utils/permissions', () => ({
    canAddTransaction: vi.fn((account, userId) => account.ownerId === userId || account.shares?.[userId]),
}));

describe('TransferOperations', () => {
    let mockFirestore: any;
    let mockBatch: any;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Create mock Firestore and batch
        mockFirestore = {} as any;
        mockBatch = {
            set: vi.fn(),
            update: vi.fn(),
            commit: vi.fn(),
        };
    });

    // ========================================================================
    // processTransferTransaction() Tests
    // ========================================================================

    describe('processTransferTransaction', () => {
        const createMockAccount = (id: string, ownerId: string, name: string): AnchorAccount => ({
            id,
            name,
            balanceCents: 100000,
            type: 'checking',
            currency: 'USD',
            color: '#000000',
            scope: 'personal',
            ownerId,
        });

        it('creates two linked transactions (source expense, dest income)', () => {
            // Arrange
            const userId = 'user-123';
            const sourceAccount = createMockAccount('acc-source', userId, 'Checking');
            const destAccount = createMockAccount('acc-dest', userId, 'Savings');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 10000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            // Mock doc/collection to return refs with IDs
            vi.mocked(firestore.doc).mockReturnValue({ id: 'mock-tx-id', path: 'mock/path' } as any);

            // Act
            processTransferTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            // Should create 2 transactions (source + dest)
            expect(mockBatch.set).toHaveBeenCalledTimes(2);

            // First call should be source transaction (expense)
            expect(mockBatch.set).toHaveBeenNthCalledWith(
                1,
                expect.anything(),
                expect.objectContaining({
                    type: 'expense',
                    category: 'Transfer',
                    amountCents: 10000,
                })
            );

            // Second call should be dest transaction (income)
            expect(mockBatch.set).toHaveBeenNthCalledWith(
                2,
                expect.anything(),
                expect.objectContaining({
                    type: 'income',
                    category: 'Transfer',
                    amountCents: 10000,
                })
            );
        });

        it('decreases source account balance', () => {
            // Arrange
            const userId = 'user-456';
            const sourceAccount = createMockAccount('acc-source', userId, 'Checking');
            const destAccount = createMockAccount('acc-dest', userId, 'Savings');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 25000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-id', path: 'path' } as any);

            // Act
            processTransferTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            // Should update source account balance (decrease)
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(),
                { balanceCents: expect.objectContaining({ _increment: -25000 }) }
            );
        });

        it('increases destination account balance', () => {
            // Arrange
            const userId = 'user-789';
            const sourceAccount = createMockAccount('acc-source', userId, 'Checking');
            const destAccount = createMockAccount('acc-dest', userId, 'Savings');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 15000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-id', path: 'path' } as any);

            // Act
            processTransferTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            // Should update dest account balance (increase)
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(),
                { balanceCents: expect.objectContaining({ _increment: 15000 }) }
            );
        });

        it('sets matching linkId on both transactions', () => {
            // Arrange
            const userId = 'user-link';
            const sourceAccount = createMockAccount('acc-source', userId, 'Source');
            const destAccount = createMockAccount('acc-dest', userId, 'Dest');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 5000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-id', path: 'path' } as any);

            // Act
            processTransferTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            const sourceTxCall = mockBatch.set.mock.calls[0][1];
            const destTxCall = mockBatch.set.mock.calls[1][1];

            expect(sourceTxCall.linkId).toBeDefined();
            expect(destTxCall.linkId).toBeDefined();
            expect(sourceTxCall.linkId).toBe(destTxCall.linkId);
        });

        it('sets linkedTransactionId cross-references', () => {
            // Arrange
            const userId = 'user-cross-ref';
            const sourceAccount = createMockAccount('acc-source', userId, 'Source');
            const destAccount = createMockAccount('acc-dest', userId, 'Dest');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 8000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            let callCount = 0;
            vi.mocked(firestore.doc).mockImplementation(() => {
                callCount++;
                return { id: `tx-${callCount}`, path: 'path' } as any;
            });

            // Act
            processTransferTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            const sourceTxCall = mockBatch.set.mock.calls[0][1];
            const destTxCall = mockBatch.set.mock.calls[1][1];

            // Source should reference dest, dest should reference source
            expect(sourceTxCall.linkedTransactionId).toBe(destTxCall.id);
            expect(destTxCall.linkedTransactionId).toBe(sourceTxCall.id);
        });

        it('throws VALIDATION error if destination account missing', () => {
            // Arrange
            const userId = 'user-no-dest';
            const sourceAccount = createMockAccount('acc-source', userId, 'Source');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                // Missing destinationAccountId
                amountCents: 1000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            // Act & Assert
            expect(() => {
                processTransferTransaction(
                    mockFirestore,
                    mockBatch,
                    userId,
                    payload,
                    sourceAccount,
                    [sourceAccount],
                    '2026-01-27T00:00:00Z',
                    '2026-01-27T14:00:00Z',
                    false
                );
            }).toThrow(AnchorError);

            expect(() => {
                processTransferTransaction(
                    mockFirestore,
                    mockBatch,
                    userId,
                    payload,
                    sourceAccount,
                    [sourceAccount],
                    '2026-01-27T00:00:00Z',
                    '2026-01-27T14:00:00Z',
                    false
                );
            }).toThrow('Transfer missing destination account');
        });

        it('throws VALIDATION error if destination account not found', () => {
            // Arrange
            const userId = 'user-not-found';
            const sourceAccount = createMockAccount('acc-source', userId, 'Source');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'non-existent',
                amountCents: 1000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            // Act & Assert
            expect(() => {
                processTransferTransaction(
                    mockFirestore,
                    mockBatch,
                    userId,
                    payload,
                    sourceAccount,
                    [sourceAccount], // dest account not in array
                    '2026-01-27T00:00:00Z',
                    '2026-01-27T14:00:00Z',
                    false
                );
            }).toThrow(AnchorError);

            expect(() => {
                processTransferTransaction(
                    mockFirestore,
                    mockBatch,
                    userId,
                    payload,
                    sourceAccount,
                    [sourceAccount],
                    '2026-01-27T00:00:00Z',
                    '2026-01-27T14:00:00Z',
                    false
                );
            }).toThrow('Destination account not found');
        });

        it('throws PERMISSION error if user lacks rights to dest account', async () => {
            // Arrange
            const userId = 'user-no-perm';
            const otherUser = 'other-user-999';
            const sourceAccount = createMockAccount('acc-source', userId, 'Source');
            const destAccount = createMockAccount('acc-dest', otherUser, 'Other Account');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 1000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
                currency: 'NGN',
            };

            const { canAddTransaction } = await import('../../features/finance/utils/permissions');
            vi.mocked(canAddTransaction).mockReturnValueOnce(false);

            // Act & Assert
            expect(() => {
                processTransferTransaction(
                    mockFirestore,
                    mockBatch,
                    userId,
                    payload,
                    sourceAccount,
                    [sourceAccount, destAccount],
                    '2026-01-27T00:00:00Z',
                    '2026-01-27T14:00:00Z',
                    false
                );
            }).toThrow(AnchorError);

            expect(() => {
                processTransferTransaction(
                    mockFirestore,
                    mockBatch,
                    userId,
                    payload,
                    sourceAccount,
                    [sourceAccount, destAccount],
                    '2026-01-27T00:00:00Z',
                    '2026-01-27T14:00:00Z',
                    false
                );
            }).toThrow('Permission denied');
        });

        it('preserves account ownership in accountOwnerId field', () => {
            // Arrange
            const userId = 'user-preserve';
            const ownerId1 = 'owner-1';
            const ownerId2 = 'owner-2';
            const sourceAccount: AnchorAccount = {
                ...createMockAccount('acc-source', ownerId1, 'Source'),
                shares: { [userId]: 'manage' as const },
                currency: 'NGN',
            };
            const destAccount: AnchorAccount = {
                ...createMockAccount('acc-dest', ownerId2, 'Dest'),
                shares: { [userId]: 'manage' as const },
            };
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 5000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Transfer',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-id', path: 'path' } as any);

            // Act
            processTransferTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            const sourceTxCall = mockBatch.set.mock.calls[0][1];
            const destTxCall = mockBatch.set.mock.calls[1][1];

            expect(sourceTxCall.accountOwnerId).toBe(ownerId1);
            expect(destTxCall.accountOwnerId).toBe(ownerId2);
        });

        it('handles backdated transactions correctly', () => {
            // Arrange
            const userId = 'user-backdate';
            const sourceAccount = createMockAccount('acc-source', userId, 'Source');
            const destAccount = createMockAccount('acc-dest', userId, 'Dest');
            const payload: CreateTransactionPayload = {
                accountId: 'acc-source',
                destinationAccountId: 'acc-dest',
                amountCents: 3000,
                type: 'transfer',
                category: 'Transfer',
                title: 'Backdated Transfer',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-id', path: 'path' } as any);

            // Act
            processTransferTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                sourceAccount,
                [sourceAccount, destAccount],
                '2026-01-20T00:00:00Z', // Transaction date
                '2026-01-27T14:00:00Z', // Created at (later)
                true // isBackdated flag
            );

            // Assert
            const sourceTxCall = mockBatch.set.mock.calls[0][1];
            const destTxCall = mockBatch.set.mock.calls[1][1];

            expect(sourceTxCall.isBackdated).toBe(true);
            expect(destTxCall.isBackdated).toBe(true);
            expect(sourceTxCall.date).toBe('2026-01-20T00:00:00Z');
        });
    });

    // ========================================================================
    // processStandardTransaction() Tests
    // ========================================================================

    describe('processStandardTransaction', () => {
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

        it('creates single transaction successfully', () => {
            // Arrange
            const userId = 'user-standard';
            const account = createMockAccount('acc-1', userId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                amountCents: 5000,
                type: 'expense',
                category: 'food',
                title: 'Groceries',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-new', path: 'path' } as any);

            // Act
            processStandardTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                account,
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            expect(mockBatch.set).toHaveBeenCalledTimes(1);
            expect(mockBatch.set).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    amountCents: 5000,
                    type: 'expense',
                    category: 'food',
                    title: 'Groceries',
                })
            );
        });
            

        it('increases balance for income transactions', () => {
            // Arrange
            const userId = 'user-income';
            const account = createMockAccount('acc-1', userId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                amountCents: 100000,
                type: 'income',
                category: 'salary',
                title: 'Paycheck',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-income', path: 'path' } as any);

            // Act
            processStandardTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                account,
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    balanceCents: expect.objectContaining({ _increment: 100000 }),
                })
            );
        });
            

        it('decreases balance for expense transactions', () => {
            // Arrange
            const userId = 'user-expense';
            const account = createMockAccount('acc-1', userId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                amountCents: 15000,
                type: 'expense',
                category: 'shopping',
                title: 'New Shoes',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-expense', path: 'path' } as any);

            // Act
            processStandardTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                account,
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    balanceCents: expect.objectContaining({ _increment: -15000 }),
                })
            );
        });
            
        it('excludes destinationAccountId from transaction data', () => {
            // Arrange
            const userId = 'user-exclude';
            const account = createMockAccount('acc-1', userId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                destinationAccountId: 'should-be-excluded', // Should not appear in transaction
                amountCents: 2000,
                type: 'expense',
                category: 'misc',
                title: 'Test',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-clean', path: 'path' } as any);

            // Act
            processStandardTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                account,
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            const txData = mockBatch.set.mock.calls[0][1];
            expect(txData).not.toHaveProperty('destinationAccountId');
        });

        it('sets correct accountOwnerId and accountShares', () => {
            // Arrange
            const userId = 'user-ownership';
            const ownerId = 'owner-999';
            const account: AnchorAccount = {
                id: 'acc-shared',
                name: 'Shared Account',
                balanceCents: 50000,
                type: 'checking',
                color: '#FF0000',
                scope: 'family',
                currency: 'NGN',
                ownerId,
                shares: {
                    'spouse-1': 'read' as const,
                    'spouse-2': 'manage' as const,
                },
            };
            const payload: CreateTransactionPayload = {
                accountId: 'acc-shared',
                amountCents: 3000,
                type: 'expense',
                category: 'groceries',
                title: 'Family Groceries',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-shared', path: 'path' } as any);

            // Act
            processStandardTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                account,
                '2026-01-27T00:00:00Z',
                '2026-01-27T14:00:00Z',
                false
            );

            // Assert
            const txData = mockBatch.set.mock.calls[0][1];
            expect(txData.accountOwnerId).toBe(ownerId);
            expect(txData.accountShares).toEqual(account.shares);
        });
            

        it('handles backdated transactions correctly', () => {
            // Arrange
            const userId = 'user-backdate-std';
            const account = createMockAccount('acc-1', userId);
            const payload: CreateTransactionPayload = {
                accountId: 'acc-1',
                amountCents: 4500,
                type: 'income',
                category: 'bonus',
                title: 'Old Bonus',
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: 'tx-old', path: 'path' } as any);

            // Act
            processStandardTransaction(
                mockFirestore,
                mockBatch,
                userId,
                payload,
                account,
                '2026-01-15T00:00:00Z', // Transaction date (in the past)
                '2026-01-27T14:00:00Z', // Created at (now)
                true // isBackdated flag
            );

            // Assert
            const txData = mockBatch.set.mock.calls[0][1];
            expect(txData.isBackdated).toBe(true);
            expect(txData.date).toBe('2026-01-15T00:00:00Z');
            expect(txData.createdAt).toBe('2026-01-27T14:00:00Z');
        });
    });
});
