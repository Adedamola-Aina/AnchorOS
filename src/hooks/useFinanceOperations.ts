/**
 * useFinanceOperations Hook
 * 
 * Handles all finance CRUD operations (accounts and transactions)
 * with activity logging for shared accounts.
 * 
 * @module hooks/useFinanceOperations
 */

import type { User } from 'firebase/auth';
import { db, APP_ID } from '../config/firebase';
import { doc, collection, writeBatch, increment } from 'firebase/firestore';
import type { AnchorTransaction, AnchorAccount, TransactionType } from '../types';
import { financeService } from '../services/FinanceService';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from '../services/FinanceService';
import { handleError } from '../utils/error';
import { withTimeout } from '../utils/secureDb';
import { canDeleteTransaction } from '../features/finance/utils/permissions';
import { logAccountActivity } from '../utils/activityLogger';

const OPERATION_TIMEOUT = 10000;

export const useFinanceOperations = (
    user: User | null,
    userName: string,
    accounts: AnchorAccount[],
    transactions: AnchorTransaction[]
) => {
    // Account operations
    const addAccount = async (acc: CreateAccountPayload) => {
        if (!user) return;
        try {
            await withTimeout(financeService.addAccount(user.uid, acc), OPERATION_TIMEOUT, 'addAccount');
        } catch (err) {
            throw handleError(err);
        }
    };

    const deleteAccount = async (id: string) => {
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
    };

    const renameAccount = async (id: string, newName: string) => {
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
    };

    // Transaction operations
    const addTransaction = async (tx: CreateTransactionPayload) => {
        if (!user) return;
        try {
            await withTimeout(financeService.addTransaction(user.uid, tx, accounts), OPERATION_TIMEOUT, 'addTransaction');
            const account = accounts.find(a => a.id === tx.accountId);
            if (account && (account.sharedWith || account.ownerId !== user.uid)) {
                logAccountActivity({
                    action: 'transaction_added', accountId: tx.accountId, accountOwnerId: account.ownerId || user.uid,
                    actorId: user.uid, actorName: userName,
                    details: { transactionTitle: tx.title, amountCents: tx.amountCents, currency: tx.currency, type: tx.type },
                });
            }
        } catch (err) {
            throw handleError(err);
        }
    };

    const deleteTransaction = async (id: string, accountId: string) => {
        if (!user) return;
        const account = accounts.find(a => a.id === accountId);
        if (!account) return;
        if (!canDeleteTransaction(account, user.uid)) {
            throw new Error('You do not have permission to delete transactions from this account');
        }
        const txToDelete = transactions.find(t => t.id === id);
        try {
            await withTimeout(financeService.deleteTransaction(user.uid, id, accountId, accounts, transactions), OPERATION_TIMEOUT, 'deleteTransaction');
            if (account.sharedWith || account.ownerId !== user.uid) {
                logAccountActivity({
                    action: 'transaction_deleted', accountId, accountOwnerId: account.ownerId || user.uid,
                    actorId: user.uid, actorName: userName,
                    details: { transactionId: id, transactionTitle: txToDelete?.title || 'Unknown', amountCents: txToDelete?.amountCents, currency: txToDelete?.currency, type: txToDelete?.type },
                });
            }
        } catch (err) {
            throw handleError(err);
        }
    };

    const updateTransaction = async (id: string, accountId: string, updates: UpdateTransactionPayload) => {
        if (!user) return;
        const originalTx = transactions.find(t => t.id === id);
        const account = accounts.find(a => a.id === accountId);
        try {
            await withTimeout(financeService.updateTransaction(user.uid, id, accountId, updates, accounts), OPERATION_TIMEOUT, 'updateTransaction');
            if (account && (account.sharedWith || account.ownerId !== user.uid)) {
                logAccountActivity({
                    action: 'transaction_edited', accountId, accountOwnerId: account.ownerId || user.uid,
                    actorId: user.uid, actorName: userName,
                    details: {
                        transactionId: id, transactionTitle: updates.title || originalTx?.title || 'Unknown',
                        amountCents: updates.amountCents || originalTx?.amountCents, previousTitle: originalTx?.title,
                        previousAmountCents: originalTx?.amountCents, currency: originalTx?.currency, type: originalTx?.type,
                    },
                });
            }
        } catch (err) {
            throw handleError(err);
        }
    };

    const restoreTransaction = async (id: string, accountId: string, amountCents: number, type: TransactionType) => {
        if (!user) return;
        try {
            const account = accounts.find(a => a.id === accountId);
            if (!account) return;
            const batch = writeBatch(db);
            const targetUserId = account.ownerId || user.uid;
            const txRef = doc(db, 'artifacts', APP_ID, 'users', targetUserId, 'finance', id);
            batch.update(txRef, { isSoftDeleted: false, deletedBy: null, deletedAt: null });
            const accRef = doc(db, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
            batch.update(accRef, { balanceCents: increment(type === 'income' ? amountCents : -amountCents) });
            await batch.commit();
        } catch (err) {
            throw handleError(err);
        }
    };

    const convertCurrency = async (fromAccountId: string, toAccountId: string, amountCents: number, rate: number) => {
        if (!user) return;
        try {
            const fromAcc = accounts.find(a => a.id === fromAccountId);
            const toAcc = accounts.find(a => a.id === toAccountId);
            if (!fromAcc || !toAcc) return;

            const batch = writeBatch(db);
            const linkId = crypto.randomUUID();
            const now = new Date().toISOString();

            const fromOwnerId = fromAcc.ownerId || user.uid;
            const outRef = doc(collection(db, 'artifacts', APP_ID, 'users', fromOwnerId, 'finance'));
            batch.set(outRef, {
                title: `Conversion to ${toAcc.currency}`, amountCents, type: 'expense', category: 'Conversion',
                accountId: fromAccountId, accountName: fromAcc.name, currency: fromAcc.currency,
                scope: 'family', date: now, createdBy: user.uid, linkId, conversionRate: rate
            });
            batch.update(doc(db, 'artifacts', APP_ID, 'users', fromOwnerId, 'accounts', fromAccountId), { balanceCents: increment(-amountCents) });

            const toOwnerId = toAcc.ownerId || user.uid;
            const convertedAmountCents = Math.round(amountCents * rate);
            const inRef = doc(collection(db, 'artifacts', APP_ID, 'users', toOwnerId, 'finance'));
            batch.set(inRef, {
                title: `Conversion from ${fromAcc.currency}`, amountCents: convertedAmountCents, type: 'income', category: 'Conversion',
                accountId: toAccountId, accountName: toAcc.name, currency: toAcc.currency,
                scope: 'family', date: now, createdBy: user.uid, linkId, conversionRate: rate
            });
            batch.update(doc(db, 'artifacts', APP_ID, 'users', toOwnerId, 'accounts', toAccountId), { balanceCents: increment(convertedAmountCents) });

            await batch.commit();
        } catch (err) {
            throw handleError(err);
        }
    };

    return { addAccount, deleteAccount, renameAccount, addTransaction, deleteTransaction, updateTransaction, restoreTransaction, convertCurrency };
};
