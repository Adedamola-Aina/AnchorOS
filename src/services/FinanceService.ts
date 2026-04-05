/**
 * FinanceService
 * 
 * Unified facade for all finance-related operations.
 * Re-exports from AccountService and TransactionService for backward compatibility.
 * 
 * @module services/FinanceService
 */

import type { Firestore } from 'firebase/firestore';
import { db } from '../utils/secureDb';
import { AccountService } from './AccountService';
import { TransactionService } from './TransactionService';
import type { AnchorAccount, AnchorTransaction } from '../types';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

// Re-export types for backward compatibility
export type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

/**
 * FinanceService - Unified facade combining account and transaction operations
 */
export class FinanceService {
    private accountService: AccountService;
    private transactionService: TransactionService;

    constructor(firestore: Firestore = db) {
        this.accountService = new AccountService(firestore);
        this.transactionService = new TransactionService(firestore);
    }

    // Account Operations
    async addAccount(userId: string, payload: CreateAccountPayload): Promise<string> {
        return this.accountService.addAccount(userId, payload);
    }

    async deleteAccount(userId: string, userName: string, account: AnchorAccount): Promise<void> {
        return this.accountService.deleteAccount(userId, userName, account);
    }

    async renameAccount(userId: string, userName: string, account: AnchorAccount, newName: string): Promise<void> {
        return this.accountService.renameAccount(userId, userName, account, newName);
    }

    async updateAccountPersonalization(
        userId: string,
        account: AnchorAccount,
        updates: { cardColor?: string; cardArtwork?: string; cardArtworkPath?: string; cardArtworkPreset?: string },
    ): Promise<void> {
        return this.accountService.updateAccountPersonalization(userId, account, updates);
    }

    // Transaction Operations
    async addTransaction(userId: string, payload: CreateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
        return this.transactionService.addTransaction(userId, payload, accounts);
    }

    async deleteTransaction(
        userId: string, transactionId: string, accountId: string,
        accounts: AnchorAccount[], transactions: AnchorTransaction[]
    ): Promise<void> {
        return this.transactionService.deleteTransaction(userId, transactionId, accountId, accounts, transactions);
    }

    async updateTransaction(
        userId: string, transactionId: string, accountId: string,
        updates: UpdateTransactionPayload, accounts: AnchorAccount[]
    ): Promise<void> {
        return this.transactionService.updateTransaction(userId, transactionId, accountId, updates, accounts);
    }
}

export const financeService = new FinanceService();
