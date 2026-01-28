/**
 * Unit tests for FinanceService
 * 
 * Tests the facade pattern - verifies proper delegation to underlying services.
 * Follows TESTING_STRATEGY.md patterns (lines 104-174).
 * 
 * @see docs/TESTING_STRATEGY.md
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { FinanceService } from '../FinanceService';
import { AccountService } from '../AccountService';
import { TransactionService } from '../TransactionService';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from '../financeTypes';

describe('FinanceService', () => {
    let service: FinanceService;
    let mockAccountService: any;
    let mockTransactionService: any;

    beforeEach(() => {
        // Create mocked service methods
        mockAccountService = {
            addAccount: vi.fn(),
            deleteAccount: vi.fn(),
            renameAccount: vi.fn(),
        };

        mockTransactionService = {
            addTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            updateTransaction: vi.fn(),
        };

        // Spy on the constructors and make them return our mocks
        vi.spyOn(AccountService.prototype, 'addAccount').mockImplementation(mockAccountService.addAccount);
        vi.spyOn(AccountService.prototype, 'deleteAccount').mockImplementation(mockAccountService.deleteAccount);
        vi.spyOn(AccountService.prototype, 'renameAccount').mockImplementation(mockAccountService.renameAccount);

        vi.spyOn(TransactionService.prototype, 'addTransaction').mockImplementation(mockTransactionService.addTransaction);
        vi.spyOn(TransactionService.prototype, 'deleteTransaction').mockImplementation(mockTransactionService.deleteTransaction);
        vi.spyOn(TransactionService.prototype, 'updateTransaction').mockImplementation(mockTransactionService.updateTransaction);

        // Create service instance
        service = new FinanceService();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ========================================================================
    // Account Operations Tests
    // ========================================================================

    describe('Account Operations', () => {
        describe('addAccount', () => {
            it('delegates to AccountService.addAccount with correct arguments', async () => {
                // Arrange
                const userId = 'user-123';
                const payload: CreateAccountPayload = {
                    name: 'Savings Account',
                    type: 'savings',
                    balanceCents: 100000,
                    currency: 'USD',
                    color: '#00FF00',
                    scope: 'personal',
                };
                const expectedDocId = 'new-account-id';
                mockAccountService.addAccount.mockResolvedValue(expectedDocId);

                // Act
                const result = await service.addAccount(userId, payload);

                // Assert
                expect(mockAccountService.addAccount).toHaveBeenCalledWith(userId, payload);
                expect(mockAccountService.addAccount).toHaveBeenCalledTimes(1);
                expect(result).toBe(expectedDocId);
            });

            it('propagates errors from AccountService', async () => {
                // Arrange
                const userId = 'user-error';
                const payload: CreateAccountPayload = {
                    name: 'Test',
                    type: 'checking',
                    balanceCents: 0,
                    currency: 'USD',
                    color: '#000000',
                    scope: 'personal',
                };
                const error = new Error('Database connection failed');
                mockAccountService.addAccount.mockRejectedValue(error);

                // Act & Assert
                await expect(service.addAccount(userId, payload)).rejects.toThrow('Database connection failed');
                expect(mockAccountService.addAccount).toHaveBeenCalledWith(userId, payload);
            });
        });

        describe('deleteAccount', () => {
            it('delegates to AccountService.deleteAccount with correct arguments', async () => {
                // Arrange
                const userId = 'user-456';
                const userName = 'John Doe';
                const account: AnchorAccount = {
                    id: 'acc-1',
                    name: 'Old Account',
                    balanceCents: 50000,
                    type: 'checking',
                    currency: 'USD',
                    color: '#FF0000',
                    scope: 'personal',
                    ownerId: userId,
                };
                mockAccountService.deleteAccount.mockResolvedValue(undefined);

                // Act
                await service.deleteAccount(userId, userName, account);

                // Assert
                expect(mockAccountService.deleteAccount).toHaveBeenCalledWith(userId, userName, account);
                expect(mockAccountService.deleteAccount).toHaveBeenCalledTimes(1);
            });

            it('propagates errors from AccountService', async () => {
                // Arrange
                const userId = 'user-789';
                const userName = 'Jane Smith';
                const account: AnchorAccount = {
                    id: 'acc-protected',
                    name: 'Protected',
                    balanceCents: 100000,
                    type: 'savings',
                    currency: 'USD',
                    color: '#0000FF',
                    scope: 'personal',
                    ownerId: 'other-user',
                };
                const error = new Error('Permission denied');
                mockAccountService.deleteAccount.mockRejectedValue(error);

                // Act & Assert
                await expect(service.deleteAccount(userId, userName, account)).rejects.toThrow('Permission denied');
                expect(mockAccountService.deleteAccount).toHaveBeenCalledWith(userId, userName, account);
            });
        });

        describe('renameAccount', () => {
            it('delegates to AccountService.renameAccount with correct arguments', async () => {
                // Arrange
                const userId = 'user-rename';
                const userName = 'Alice Cooper';
                const account: AnchorAccount = {
                    id: 'acc-rename',
                    name: 'Old Name',
                    balanceCents: 75000,
                    type: 'checking',
                    currency: 'NGN',
                    color: '#FFAA00',
                    scope: 'personal',
                    ownerId: userId,
                };
                const newName = 'New Awesome Name';
                mockAccountService.renameAccount.mockResolvedValue(undefined);

                // Act
                await service.renameAccount(userId, userName, account, newName);

                // Assert
                expect(mockAccountService.renameAccount).toHaveBeenCalledWith(userId, userName, account, newName);
                expect(mockAccountService.renameAccount).toHaveBeenCalledTimes(1);
            });

            it('propagates errors from AccountService', async () => {
                // Arrange
                const userId = 'user-error';
                const userName = 'Bob Builder';
                const account: AnchorAccount = {
                    id: 'acc-1',
                    name: 'Current Name',
                    balanceCents: 0,
                    type: 'checking',
                    currency: 'USD',
                    color: '#000000',
                    scope: 'personal',
                    ownerId: userId,
                };
                const newName = '';
                const error = new Error('Account name cannot be empty');
                mockAccountService.renameAccount.mockRejectedValue(error);

                // Act & Assert
                await expect(service.renameAccount(userId, userName, account, newName)).rejects.toThrow('Account name cannot be empty');
                expect(mockAccountService.renameAccount).toHaveBeenCalledWith(userId, userName, account, newName);
            });
        });
    });

    // ========================================================================
    // Transaction Operations Tests
    // ========================================================================

    describe('Transaction Operations', () => {
        describe('addTransaction', () => {
            it('delegates to TransactionService.addTransaction with correct arguments', async () => {
                // Arrange
                const userId = 'user-tx-add';
                const payload: CreateTransactionPayload = {
                    accountId: 'acc-1',
                    amountCents: 5000,
                    type: 'expense',
                    category: 'food',
                    title: 'Lunch',
                    currency: 'USD',
                    scope: 'personal',
                };
                const accounts: AnchorAccount[] = [{
                    id: 'acc-1',
                    name: 'Checking',
                    balanceCents: 100000,
                    type: 'checking',
                    currency: 'USD',
                    color: '#000000',
                    scope: 'personal',
                    ownerId: userId,
                }];
                mockTransactionService.addTransaction.mockResolvedValue(undefined);

                // Act
                await service.addTransaction(userId, payload, accounts);

                // Assert
                expect(mockTransactionService.addTransaction).toHaveBeenCalledWith(userId, payload, accounts);
                expect(mockTransactionService.addTransaction).toHaveBeenCalledTimes(1);
            });

            it('propagates errors from TransactionService', async () => {
                // Arrange
                const userId = 'user-error';
                const payload: CreateTransactionPayload = {
                    accountId: 'non-existent',
                    amountCents: 1000,
                    type: 'expense',
                    category: 'misc',
                    title: 'Test',
                    currency: 'USD',
                    scope: 'personal',
                };
                const accounts: AnchorAccount[] = [];
                const error = new Error('Source account not found');
                mockTransactionService.addTransaction.mockRejectedValue(error);

                // Act & Assert
                await expect(service.addTransaction(userId, payload, accounts)).rejects.toThrow('Source account not found');
                expect(mockTransactionService.addTransaction).toHaveBeenCalledWith(userId, payload, accounts);
            });
        });

        describe('deleteTransaction', () => {
            it('delegates to TransactionService.deleteTransaction with correct arguments', async () => {
                // Arrange
                const userId = 'user-tx-delete';
                const transactionId = 'tx-123';
                const accountId = 'acc-1';
                const accounts: AnchorAccount[] = [{
                    id: 'acc-1',
                    name: 'Checking',
                    balanceCents: 95000,
                    type: 'checking',
                    currency: 'USD',
                    color: '#FF0000',
                    scope: 'personal',
                    ownerId: userId,
                }];
                const transactions: AnchorTransaction[] = [{
                    id: 'tx-123',
                    title: 'Old Transaction',
                    amountCents: 5000,
                    type: 'expense',
                    category: 'food',
                    date: '2026-01-20T00:00:00Z',
                    accountId: 'acc-1',
                    accountName: 'Checking',
                    currency: 'USD',
                    createdAt: '2026-01-20T00:00:00Z',
                    createdBy: userId,
                    isSoftDeleted: false,
                    accountOwnerId: userId,
                }];
                mockTransactionService.deleteTransaction.mockResolvedValue(undefined);

                // Act
                await service.deleteTransaction(userId, transactionId, accountId, accounts, transactions);

                // Assert
                expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith(
                    userId, transactionId, accountId, accounts, transactions
                );
                expect(mockTransactionService.deleteTransaction).toHaveBeenCalledTimes(1);
            });

            it('propagates errors from TransactionService', async () => {
                // Arrange
                const userId = 'user-error';
                const transactionId = 'tx-nonexistent';
                const accountId = 'acc-1';
                const accounts: AnchorAccount[] = [{
                    id: 'acc-1',
                    name: 'Account',
                    balanceCents: 100000,
                    type: 'checking',
                    currency: 'USD',
                    color: '#000000',
                    scope: 'personal',
                    ownerId: userId,
                }];
                const transactions: AnchorTransaction[] = [];
                const error = new Error('Transaction not found');
                mockTransactionService.deleteTransaction.mockRejectedValue(error);

                // Act & Assert
                await expect(
                    service.deleteTransaction(userId, transactionId, accountId, accounts, transactions)
                ).rejects.toThrow('Transaction not found');
                expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith(
                    userId, transactionId, accountId, accounts, transactions
                );
            });
        });

        describe('updateTransaction', () => {
            it('delegates to TransactionService.updateTransaction with correct arguments', async () => {
                // Arrange
                const userId = 'user-tx-update';
                const transactionId = 'tx-456';
                const accountId = 'acc-1';
                const updates: UpdateTransactionPayload = {
                    title: 'Updated Title',
                    category: 'entertainment',
                    amountCents: 8000,
                };
                const accounts: AnchorAccount[] = [{
                    id: 'acc-1',
                    name: 'Savings',
                    balanceCents: 200000,
                    type: 'savings',
                    currency: 'USD',
                    color: '#00FF00',
                    scope: 'personal',
                    ownerId: userId,
                }];
                mockTransactionService.updateTransaction.mockResolvedValue(undefined);

                // Act
                await service.updateTransaction(userId, transactionId, accountId, updates, accounts);

                // Assert
                expect(mockTransactionService.updateTransaction).toHaveBeenCalledWith(
                    userId, transactionId, accountId, updates, accounts
                );
                expect(mockTransactionService.updateTransaction).toHaveBeenCalledTimes(1);
            });

            it('propagates errors from TransactionService', async () => {
                // Arrange
                const userId = 'user-error';
                const transactionId = 'tx-999';
                const accountId = 'acc-protected';
                const updates: UpdateTransactionPayload = {
                    title: 'Hacked',
                };
                const accounts: AnchorAccount[] = [{
                    id: 'acc-protected',
                    name: 'Protected Account',
                    balanceCents: 100000,
                    type: 'checking',
                    currency: 'USD',
                    color: '#0000FF',
                    scope: 'personal',
                    ownerId: 'other-user',
                }];
                const error = new Error('Permission denied');
                mockTransactionService.updateTransaction.mockRejectedValue(error);

                // Act & Assert
                await expect(
                    service.updateTransaction(userId, transactionId, accountId, updates, accounts)
                ).rejects.toThrow('Permission denied');
                expect(mockTransactionService.updateTransaction).toHaveBeenCalledWith(
                    userId, transactionId, accountId, updates, accounts
                );
            });
        });
    });
});
