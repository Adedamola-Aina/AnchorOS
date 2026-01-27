/**
 * Unit tests for AccountService
 * 
 * Tests ALL account management operations with proper Firebase mocking.
 * Follows TESTING_STRATEGY.md patterns (lines 104-174).
 * 
 * @see docs/TESTING_STRATEGY.md
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountService } from '../AccountService';
import { AnchorError } from '../../utils/error';
import type { AnchorAccount } from '../../types';
import type { CreateAccountPayload } from '../financeTypes';

// Import Firebase functions to mock
import * as firestore from 'firebase/firestore';

// Mock the permission utility
vi.mock('../../features/finance/utils/permissions', () => ({
    canManageAccount: vi.fn((account, userId) => account.ownerId === userId),
}));

describe('AccountService', () => {
    let service: AccountService;
    let mockFirestore: any;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Create mock Firestore instance
        mockFirestore = {} as any;
        service = new AccountService(mockFirestore);
    });

    // ========================================================================
    // addAccount() Tests
    // ========================================================================

    describe('addAccount', () => {
        it('successfully creates account with valid payload', async () => {
            // Arrange
            const userId = 'user-123';
            const payload: CreateAccountPayload = {
                name: 'Test Checking',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#3B82F6',
                scope: 'personal',
            };

            const mockDocRef = { id: 'acc-new-123' };
            vi.mocked(firestore.addDoc).mockResolvedValueOnce(mockDocRef as any);

            // Act
            const accountId = await service.addAccount(userId, payload);

            // Assert
            expect(accountId).toBe('acc-new-123');
            expect(firestore.addDoc).toHaveBeenCalledWith(
                expect.anything(), // collection ref
                {
                    ...payload,
                    ownerId: userId,
                    isArchived: false,
                    shares: {},
                }
            );
        });

        it('sets ownerId to current user', async () => {
            // Arrange
            const userId = 'owner-456';
            const payload: CreateAccountPayload = {
                name: 'Savings',
                balanceCents: 500000,
                type: 'savings',
                currency: 'NGN',
                color: '#10B981',
                scope: 'personal',
            };

            vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: 'acc-789' } as any);

            // Act
            await service.addAccount(userId, payload);

            // Assert
            expect(firestore.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ ownerId: userId })
            );
        });

        it('initializes isArchived to false', async () => {
            // Arrange
            const payload: CreateAccountPayload = {
                name: 'New Account',
                balanceCents: 0,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
            };

            vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: 'acc-001' } as any);

            // Act
            await service.addAccount('user-1', payload);

            // Assert
            expect(firestore.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ isArchived: false })
            );
        });

        it('initializes shares to empty object', async () => {
            // Arrange
            const payload: CreateAccountPayload = {
                name: 'Personal Account',
                balanceCents: 100,
                type: 'checking',
                currency: 'USD',
                color: '#FF0000',
                scope: 'personal',
            };

            vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: 'acc-002' } as any);

            // Act
            await service.addAccount('user-2', payload);

            // Assert
            expect(firestore.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ shares: {} })
            );
        });

        it('throws AnchorError when Firestore operation fails', async () => {
            // Arrange
            const payload: CreateAccountPayload = {
                name: 'Will Fail',
                balanceCents: 0,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
            };

            // Mock failure for this specific test
            vi.mocked(firestore.addDoc).mockRejectedValueOnce(new Error('Network error'));

            // Act & Assert - only call once since mock is single-use
            await expect(service.addAccount('user-3', payload)).rejects.toThrow(AnchorError);
        });

        it('returns generated document ID', async () => {
            // Arrange
            const expectedId = 'generated-id-xyz';
            vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: expectedId } as any);

            const payload: CreateAccountPayload = {
                name: 'ID Test',
                balanceCents: 1000,
                type: 'checking',
                currency: 'USD',
                color: '#FFFFFF',
                scope: 'personal',
            };

            // Act
            const result = await service.addAccount('user-test', payload);

            // Assert
            expect(result).toBe(expectedId);
        });
    });

    // ========================================================================
    // deleteAccount() Tests
    // ========================================================================

    describe('deleteAccount', () => {
        it('archives account by setting isArchived to true', async () => {
            // Arrange
            const userId = 'owner-123';
            const account: AnchorAccount = {
                id: 'acc-delete-1',
                name: 'To Delete',
                balanceCents: 50000,
                type: 'checking',
                currency: 'USD',
                color: '#FF0000',
                scope: 'personal',
                ownerId: userId,
            };

            const mockBatch = {
                update: vi.fn(),
                set: vi.fn(),
                commit: vi.fn().mockResolvedValueOnce(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValueOnce(mockBatch as any);

            // Act
            await service.deleteAccount(userId, 'Test User', account);

            // Assert
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(), // doc ref
                { isArchived: true }
            );
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('sends notifications to all shared users except owner', async () => {
            // Arrange
            const ownerId = 'owner-123';
            const spouseId1 = 'spouse-456';
            const spouseId2 = 'spouse-789';

            const account: AnchorAccount = {
                id: 'acc-shared',
                name: 'Shared Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#00FF00',
                scope: 'family',
                ownerId,
                shares: {
                    [spouseId1]: 'read' as const,
                    [spouseId2]: 'manage' as const,
                },
            };

            const mockBatch = {
                update: vi.fn(),
                set: vi.fn(),
                commit: vi.fn().mockResolvedValueOnce(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValueOnce(mockBatch as any);

            // Act
            await service.deleteAccount(ownerId, 'Owner Name', account);

            // Assert
            // Should create 2 notifications (one for each spouse)
            expect(mockBatch.set).toHaveBeenCalledTimes(2);
            expect(mockBatch.set).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    type: 'system',
                    title: 'Account Deleted',
                })
            );
        });

        it('excludes account owner from receiving notification', async () => {
            // Arrange
            const ownerId = 'owner-123';
            const account: AnchorAccount = {
                id: 'acc-self-only',
                name: 'Owner Only Account',
                balanceCents: 10000,
                type: 'checking',
                currency: 'USD',
                color: '#0000FF',
                scope: 'personal',
                ownerId,
                shares: {
                    [ownerId]: 'manage' as const, // Owner in shares (edge case)
                },
            };

            const mockBatch = {
                update: vi.fn(),
                set: vi.fn(),
                commit: vi.fn().mockResolvedValueOnce(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValueOnce(mockBatch as any);

            // Act
            await service.deleteAccount(ownerId, 'Owner', account);

            // Assert
            // Should NOT create any notifications (owner excluded)
            expect(mockBatch.set).not.toHaveBeenCalled();
        });

        it('throws PERMISSION error if user lacks manage rights', async () => {
            // Arrange
            const ownerId = 'owner-123';
            const nonOwner = 'non-owner-456';
            const account: AnchorAccount = {
                id: 'acc-no-perm',
                name: 'Protected Account',
                balanceCents: 100000,
                type: 'checking',
                currency: 'USD',
                color: '#FFFF00',
                scope: 'personal',
                ownerId,
            };

            // Mock permission check to deny access
            const { canManageAccount } = await import('../../features/finance/utils/permissions');
            vi.mocked(canManageAccount).mockReturnValueOnce(false);

            // Act & Assert
            await expect(service.deleteAccount(nonOwner, 'Non Owner', account)).rejects.toThrow(AnchorError);
            await expect(service.deleteAccount(nonOwner, 'Non Owner', account)).rejects.toThrow('Permission denied');
        });

        it('throws AnchorError when batch commit fails', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-fail',
                name: 'Will Fail',
                balanceCents: 1000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: 'owner-123',
            };

            const mockBatch = {
                update: vi.fn(),
                set: vi.fn(),
                commit: vi.fn().mockRejectedValue(new Error('Firestore error')),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act & Assert - only call once
            await expect(service.deleteAccount('owner-123', 'Owner', account)).rejects.toThrow(AnchorError);
        });
    });

    // ========================================================================
    // renameAccount() Tests
    // ========================================================================

    describe('renameAccount', () => {
        it('updates account name successfully', async () => {
            // Arrange
            const userId = 'owner-123';
            const account: AnchorAccount = {
                id: 'acc-rename-1',
                name: 'Old Name',
                balanceCents: 50000,
                type: 'checking',
                currency: 'USD',
                color: '#FF0000',
                scope: 'personal',
                ownerId: userId,
            };
            const newName = 'New Name';

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValueOnce(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);
            vi.mocked(firestore.getDocs).mockResolvedValueOnce({ docs: [] } as any);

            // Act
            await service.renameAccount(userId, 'Test User', account, newName);

            // Assert
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ name: newName })
            );
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('records history entry with old and new name', async () => {
            // Arrange
            const userId = 'owner-456';
            const account: AnchorAccount = {
                id: 'acc-history',
                name: 'Previous Name',
                balanceCents: 100000,
                type: 'savings',
                currency: 'NGN',
                color: '#00FF00',
                scope: 'personal',
                ownerId: userId,
                nameHistory: [
                    { date: '2026-01-01T00:00:00Z', oldName: 'Very Old', newName: 'Previous Name', actorId: userId, actorName: 'User' },
                ],
            };

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValueOnce(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);
            vi.mocked(firestore.getDocs).mockResolvedValueOnce({ docs: [] } as any);

            // Act
            await service.renameAccount(userId, 'Actor Name', account, 'Current Name');

            // Assert
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    nameHistory: expect.arrayContaining([
                        expect.objectContaining({
                            oldName: 'Previous Name',
                            newName: 'Current Name',
                            actorId: userId,
                            actorName: 'Actor Name',
                        }),
                    ]),
                })
            );
        });

        it('updates all related transactions accountName field', async () => {
            // Arrange
            const userId = 'owner-789';
            const account: AnchorAccount = {
                id: 'acc-with-txs',
                name: 'Account With Transactions',
                balanceCents: 200000,
                type: 'checking',
                currency: 'USD',
                color: '#0000FF',
                scope: 'personal',
                ownerId: userId,
            };

            // Mock 5 transactions
            const mockTxDocs = Array.from({ length: 5 }, (_, i) => ({
                ref: { id: `tx-${i}` },
                data: () => ({ accountName: account.name }),
            }));
            vi.mocked(firestore.getDocs).mockResolvedValueOnce({ docs: mockTxDocs } as any);

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValueOnce(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.renameAccount(userId, 'User', account, 'Renamed Account');

            // Assert
            // Should update account (1) + all transactions (5) = 6 updates in first batch
            expect(mockBatch.update).toHaveBeenCalledTimes(6);
            mockTxDocs.forEach(tx => {
                expect(mockBatch.update).toHaveBeenCalledWith(
                    tx.ref,
                    { accountName: 'Renamed Account' }
                );
            });
        });

        it('handles large transaction sets with chunked batches (400+ transactions)', async () => {
            // Arrange
            const userId = 'owner-big';
            const account: AnchorAccount = {
                id: 'acc-big-data',
                name: 'Account  With Many Txs',
                balanceCents: 1000000,
                type: 'checking',
                currency: 'USD',
                color: '#FFFF00',
                scope: 'personal',
                ownerId: userId,
            };

            // Mock 850 transactions (should create 3 batches: 400, 400, 50)
            const mockTxDocs = Array.from({ length: 850 }, (_, i) => ({
                ref: { id: `tx-${i}` },
                data: () => ({ accountName: account.name }),
            }));
            vi.mocked(firestore.getDocs).mockResolvedValueOnce({ docs: mockTxDocs } as any);

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.renameAccount(userId, 'User', account, 'New Big Account');

            // Assert
            // Should commit 3 batches total (first batch has account + 400 txs, then 2 more batches)
            expect(mockBatch.commit).toHaveBeenCalledTimes(3);
        });

        it('syncs shared account transactions across spouse users', async () => {
            // Arrange
            const ownerId = 'owner-shared';
            const spouseId = 'spouse-123';
            const account: AnchorAccount = {
                id: 'acc-shared-rename',
                name: 'Shared to Rename',
                balanceCents: 150000,
                type: 'checking',
                currency: 'USD',
                color: '#FF00FF',
                scope: 'family',
                ownerId,
                shares: {
                    [spouseId]: 'manage' as const,
                },
            };

            // Mock owner transactions (empty for simplicity)
            vi.mocked(firestore.getDocs).mockResolvedValueOnce({ docs: [] } as any);

            // Mock spouse transactions (2 transactions)
            const spouseTxDocs = [
                { ref: { id: 'spouse-tx-1' }, data: () => ({}) },
                { ref: { id: 'spouse-tx-2' }, data: () => ({}) },
            ];
            vi.mocked(firestore.getDocs).mockResolvedValueOnce({ docs: spouseTxDocs, empty: false } as any);

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            // Act
            await service.renameAccount(ownerId, 'Owner', account, 'Renamed Shared Account');

            // Assert
            // Should create separate batch for spouse transactions
            expect(mockBatch.commit).toHaveBeenCalledTimes(2); // Owner batch + spouse batch
            spouseTxDocs.forEach(tx => {
                expect(mockBatch.update).toHaveBeenCalledWith(
                    tx.ref,
                    { accountName: 'Renamed Shared Account' }
                );
            });
        });

        it('throws VALIDATION error for empty name', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-empty-name',
                name: 'Current Name',
                balanceCents: 10000,
                type: 'checking',
                currency: 'USD',
                color: '#000000',
                scope: 'personal',
                ownerId: 'owner-123',
            };

            // Act & Assert
            await expect(service.renameAccount('owner-123', 'User', account, '')).rejects.toThrow(AnchorError);
            await expect(service.renameAccount('owner-123', 'User', account, '')).rejects.toThrow('Account name cannot be empty');
        });

        it('throws VALIDATION error for whitespace-only name', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-whitespace',
                name: 'Valid Name',
                balanceCents: 5000,
                type: 'savings',
                currency: 'NGN',
                color: '#AAAAAA',
                scope: 'personal',
                ownerId: 'owner-456',
            };

            // Act & Assert
            await expect(service.renameAccount('owner-456', 'User', account, '   ')).rejects.toThrow(AnchorError);
            await expect(service.renameAccount('owner-456', 'User', account, '  \t  ')).rejects.toThrow('Account name cannot be empty');
        });

        it('throws PERMISSION error if user lacks manage rights', async () => {
            // Arrange
            const ownerId = 'owner-789';
            const nonOwner = 'non-owner-999';
            const account: AnchorAccount = {
                id: 'acc-no-rename-perm',
                name: 'Cannot Rename',
                balanceCents: 50000,
                type: 'checking',
                currency: 'USD',
                color: '#CCCCCC',
                scope: 'personal',
                ownerId,
            };

            const { canManageAccount } = await import('../../features/finance/utils/permissions');
            vi.mocked(canManageAccount).mockReturnValueOnce(false);

            // Act & Assert
            await expect(service.renameAccount(nonOwner, 'Non Owner', account, 'New Name')).rejects.toThrow(AnchorError);
            await expect(service.renameAccount(nonOwner, 'Non Owner', account, 'New Name')).rejects.toThrow('Permission denied');
        });

        it('preserves existing nameHistory when adding new entry', async () => {
            // Arrange
            const account: AnchorAccount = {
                id: 'acc-preserve-history',
                name: 'Third Name',
                balanceCents: 75000,
                type: 'checking',
                currency: 'USD',
                color: '#123456',
                scope: 'personal',
                ownerId: 'owner-preserve',
                nameHistory: [
                    { date: '2026-01-01T00:00:00Z', oldName: 'First', newName: 'Second', actorId: 'user-1', actorName: 'User 1' },
                    { date: '2026-01-15T00:00:00Z', oldName: 'Second', newName: 'Third Name', actorId: 'user-2', actorName: 'User 2' },
                ],
            };

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn().mockResolvedValueOnce(undefined),
            };
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);
            vi.mocked(firestore.getDocs).mockResolvedValueOnce({ docs: [] } as any);

            // Act
            await service.renameAccount('owner-preserve', 'User 3', account, 'Fourth Name');

            // Assert
            expect(mockBatch.update).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    nameHistory: expect.arrayContaining([
                        account.nameHistory![0],
                        account.nameHistory![1],
                        expect.objectContaining({
                            oldName: 'Third Name',
                            newName: 'Fourth Name',
                        }),
                    ]),
                })
            );
        });
    });
});
