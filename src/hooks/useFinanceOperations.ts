/**
 * useFinanceOperations Hook
 * 
 * Handles all finance CRUD operations (accounts and transactions)
 * with activity logging for shared accounts.
 * 
 * @module hooks/useFinanceOperations
 */
// @ts-nocheck


import { useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';
import type { AnchorTransaction, AnchorAccount, TransactionType } from '../types';
import { financeService } from '../services/FinanceService';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from '../services/FinanceService';
import { handleError } from '../utils/error';
import { withTimeout } from '../utils/secureDb';
import { canDeleteTransaction } from '../features/finance/utils/permissions';
import { logTransactionAdded, logTransactionDeleted, logTransactionEdited } from './financeActivityLogging';
import { createTracer } from '../services/telemetry';
import { convertCurrencyAcrossAccounts, restoreSoftDeletedTransaction } from '../api/FinanceOperationsApi';

const OPERATION_TIMEOUT = 10000;
const financeTracer = createTracer('Finance');

export const useFinanceOperations = (
    user: User | null,
    userName: string,
    accounts: AnchorAccount[],
    transactions: AnchorTransaction[]
) => {
    // Account operations
    const addAccount = useCallback(async (acc: CreateAccountPayload) => {
        if (!user) return;
        return financeTracer.trace('addAccount', async () => {
            try {
                await withTimeout(financeService.addAccount(user.uid, acc), OPERATION_TIMEOUT, 'addAccount');
            } catch (err) {
                throw handleError(err);
            }
        }, { attributes: { currency: acc.currency } });
    }, [user]);

    const deleteAccount = useCallback(async (id: string) => {
        if (!user) return;
        const account = accounts.find(a => a.id === id);
        if (!account) return;
        if (account.ownerId && account.ownerId !== user.uid) {
            throw new Error('Only the account owner can delete this account');
        }
        try {
            await withTimeout(financeService.deleteAccount(user.uid, userName, account), OPERATION_TIMEOUT, 'deleteAccount');
        } catch (err) {
            throw handleError(err);
        }
    }, [user, userName, accounts]);

    const renameAccount = useCallback(async (id: string, newName: string) => {
        if (!user) return;
        const account = accounts.find(a => a.id === id);
        if (!account) return;
        if (account.ownerId && account.ownerId !== user.uid) {
            throw new Error('Only the account owner can rename this account');
        }
        try {
            await withTimeout(financeService.renameAccount(user.uid, userName, account, newName), OPERATION_TIMEOUT, 'renameAccount');
        } catch (err) {
            throw handleError(err);
        }
    }, [user, userName, accounts]);

    // Transaction operations
    const addTransaction = useCallback(async (tx: CreateTransactionPayload) => {
        if (!user) return;
        return financeTracer.trace('addTransaction', async () => {
            try {
                await withTimeout(financeService.addTransaction(user.uid, tx, accounts), OPERATION_TIMEOUT, 'addTransaction');
                const account = accounts.find(a => a.id === tx.accountId);
                if (account) {
                    logTransactionAdded(user, userName, account, tx);
                }
            } catch (err) {
                throw handleError(err);
            }
        }, { attributes: { type: tx.type, category: tx.category } });
    }, [user, userName, accounts]);

    const deleteTransaction = useCallback(async (id: string, accountId: string) => {
        if (!user) return;
        const account = accounts.find(a => a.id === accountId);
        if (!account) return;
        if (!canDeleteTransaction(account, user.uid)) {
            throw new Error('You do not have permission to delete transactions from this account');
        }
        const txToDelete = transactions.find(t => t.id === id);
        try {
            await withTimeout(financeService.deleteTransaction(user.uid, id, accountId, accounts, transactions), OPERATION_TIMEOUT, 'deleteTransaction');
            logTransactionDeleted(user, userName, account, id, txToDelete);
        } catch (err) {
            throw handleError(err);
        }
    }, [user, userName, accounts, transactions]);

    const updateTransaction = useCallback(async (id: string, accountId: string, updates: UpdateTransactionPayload) => {
        if (!user) return;
        const originalTx = transactions.find(t => t.id === id);
        const account = accounts.find(a => a.id === accountId);
        try {
            await withTimeout(financeService.updateTransaction(user.uid, id, accountId, updates, accounts), OPERATION_TIMEOUT, 'updateTransaction');
            if (account) {
                logTransactionEdited(user, userName, account, id, updates, originalTx);
            }
        } catch (err) {
            throw handleError(err);
        }
    }, [user, userName, accounts, transactions]);

    const restoreTransaction = useCallback(async (id: string, accountId: string, amountCents: number, type: TransactionType) => {
        if (!user) return;
        try {
            const account = accounts.find(a => a.id === accountId);
            if (!account) return;
            const targetUserId = account.ownerId || user.uid;
            await restoreSoftDeletedTransaction(targetUserId, id, accountId, amountCents, type);
        } catch (err) {
            throw handleError(err);
        }
    }, [user, accounts]);

    const convertCurrency = useCallback(async (fromAccountId: string, toAccountId: string, amountCents: number, rate: number) => {
        if (!user) return;
        try {
            const fromAcc = accounts.find(a => a.id === fromAccountId);
            const toAcc = accounts.find(a => a.id === toAccountId);
            if (!fromAcc || !toAcc) return;

            await convertCurrencyAcrossAccounts(user.uid, fromAcc, toAcc, amountCents, rate);
        } catch (err) {
            throw handleError(err);
        }
    }, [user, accounts]);

    return useMemo(() => ({
        addAccount, deleteAccount, renameAccount,
        addTransaction, deleteTransaction, updateTransaction, restoreTransaction, convertCurrency
    }), [
        addAccount, deleteAccount, renameAccount,
        addTransaction, deleteTransaction, updateTransaction, restoreTransaction, convertCurrency
    ]);
};
