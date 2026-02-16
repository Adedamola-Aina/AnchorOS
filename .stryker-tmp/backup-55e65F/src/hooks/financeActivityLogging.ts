/**
 * Activity Logging Helpers for Finance Operations
 * 
 * Extracted from useFinanceOperations.ts to keep hooks under 200 lines.
 */

import type { User } from 'firebase/auth';
import type { AnchorAccount, AnchorTransaction } from '../types';
import { logAccountActivity } from '../utils/activityLogger';
import type { CreateTransactionPayload, UpdateTransactionPayload } from '../services/FinanceService';

/**
 * Log activity for a transaction that was added
 */
export function logTransactionAdded(
    user: User,
    userName: string,
    account: AnchorAccount,
    tx: CreateTransactionPayload
): void {
    if (account.sharedWith || account.ownerId !== user.uid) {
        logAccountActivity({
            action: 'transaction_added',
            accountId: tx.accountId,
            accountOwnerId: account.ownerId || user.uid,
            actorId: user.uid,
            actorName: userName,
            details: {
                transactionTitle: tx.title,
                amountCents: tx.amountCents,
                currency: tx.currency,
                type: tx.type
            },
        });
    }
}

/**
 * Log activity for a transaction that was deleted
 */
export function logTransactionDeleted(
    user: User,
    userName: string,
    account: AnchorAccount,
    txId: string,
    txToDelete?: AnchorTransaction
): void {
    if (account.sharedWith || account.ownerId !== user.uid) {
        logAccountActivity({
            action: 'transaction_deleted',
            accountId: account.id,
            accountOwnerId: account.ownerId || user.uid,
            actorId: user.uid,
            actorName: userName,
            details: {
                transactionId: txId,
                transactionTitle: txToDelete?.title || 'Unknown',
                amountCents: txToDelete?.amountCents,
                currency: txToDelete?.currency,
                type: txToDelete?.type
            },
        });
    }
}

/**
 * Log activity for a transaction that was edited
 */
export function logTransactionEdited(
    user: User,
    userName: string,
    account: AnchorAccount,
    txId: string,
    updates: UpdateTransactionPayload,
    originalTx?: AnchorTransaction
): void {
    if (account.sharedWith || account.ownerId !== user.uid) {
        logAccountActivity({
            action: 'transaction_edited',
            accountId: account.id,
            accountOwnerId: account.ownerId || user.uid,
            actorId: user.uid,
            actorName: userName,
            details: {
                transactionId: txId,
                transactionTitle: updates.title || originalTx?.title || 'Unknown',
                amountCents: updates.amountCents || originalTx?.amountCents,
                previousTitle: originalTx?.title,
                previousAmountCents: originalTx?.amountCents,
                currency: originalTx?.currency,
                type: originalTx?.type,
            },
        });
    }
}
