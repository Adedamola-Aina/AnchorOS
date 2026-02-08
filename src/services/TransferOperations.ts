/**
 * TransferOperations
 * 
 * Helper module for handling transfer transactions between accounts.
 * Extracted from TransactionService to maintain the 200-line rule.
 * 
 * @module services/TransferOperations
 */

import { collection, doc, increment, type WriteBatch, type Firestore } from 'firebase/firestore';
import { APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import type { AnchorAccount } from '../types';
import { canAddTransaction } from '../features/finance/utils/permissions';
import type { CreateTransactionPayload } from './financeTypes';

/**
 * Handles transfer transaction creation between two accounts
 */
export function processTransferTransaction(
    firestore: Firestore,
    batch: WriteBatch,
    userId: string,
    payload: CreateTransactionPayload,
    sourceAccount: AnchorAccount,
    accounts: AnchorAccount[],
    transactionDate: string,
    createdAt: string,
    isBackdated: boolean
): void {
    if (!payload.destinationAccountId) {
        throw new AnchorError('Transfer missing destination account', 'VALIDATION');
    }

    const destAccount = accounts.find(a => a.id === payload.destinationAccountId);
    if (!destAccount) {
        throw new AnchorError('Destination account not found', 'VALIDATION');
    }

    if (!canAddTransaction(destAccount, userId)) {
        throw new AnchorError(
            `Permission denied: You cannot add transactions to ${destAccount.name}.`,
            'PERMISSION'
        );
    }

    const linkId = crypto.randomUUID().slice(0, 12);
    const sourceTxRef = doc(collection(firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'finance'));
    const destTxRef = doc(collection(firestore, 'artifacts', APP_ID, 'users', destAccount.ownerId || userId, 'finance'));

    const destAmount = payload.destinationAmountCents ?? payload.amountCents;

    // Record 1: Source (expense - money leaving)
    batch.set(sourceTxRef, {
        ...payload,
        id: sourceTxRef.id,
        date: transactionDate,
        createdAt,
        isBackdated,
        type: 'expense',
        category: 'Transfer',
        title: `Transfer to ${destAccount.name}`,
        accountName: sourceAccount.name,
        currency: sourceAccount.currency,
        createdBy: userId,
        isSoftDeleted: false,
        accountOwnerId: sourceAccount.ownerId || userId,
        accountShares: sourceAccount.shares || {},
        linkId,
        linkedTransactionId: destTxRef.id,
        linkedUserId: destAccount.ownerId || userId
    });

    // Record 2: Destination (income - money arriving)
    batch.set(destTxRef, {
        ...payload,
        id: destTxRef.id,
        amountCents: destAmount, // Use converted amount
        date: transactionDate,
        createdAt,
        isBackdated,
        type: 'income',
        category: 'Transfer',
        title: `Transfer from ${sourceAccount.name}`,
        accountId: destAccount.id,
        accountName: destAccount.name,
        currency: destAccount.currency,
        createdBy: userId,
        isSoftDeleted: false,
        accountOwnerId: destAccount.ownerId || userId,
        accountShares: destAccount.shares || {},
        linkId,
        linkedTransactionId: sourceTxRef.id,
        linkedUserId: sourceAccount.ownerId || userId
    });

    // Update balances
    const sourceAccRef = doc(firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'accounts', sourceAccount.id);
    const destAccRef = doc(firestore, 'artifacts', APP_ID, 'users', destAccount.ownerId || userId, 'accounts', destAccount.id);
    batch.update(sourceAccRef, { balanceCents: increment(-payload.amountCents) });
    batch.update(destAccRef, { balanceCents: increment(destAmount) });
}

/**
 * Handles standard (non-transfer) transaction creation
 */
export function processStandardTransaction(
    firestore: Firestore,
    batch: WriteBatch,
    userId: string,
    payload: CreateTransactionPayload,
    sourceAccount: AnchorAccount,
    transactionDate: string,
    createdAt: string,
    isBackdated: boolean
): void {
    // Exclude destinationAccountId (only for transfers) - explicitly omit with rest
    const { destinationAccountId: _ignored, ...transactionData } = payload;
    void _ignored; // Explicitly discard to satisfy linter
    const txRef = doc(collection(firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'finance'));

    batch.set(txRef, {
        ...transactionData,
        id: txRef.id,
        date: transactionDate,
        createdAt,
        isBackdated,
        accountName: sourceAccount.name,
        currency: sourceAccount.currency,
        createdBy: userId,
        isSoftDeleted: false,
        accountOwnerId: sourceAccount.ownerId || userId,
        accountShares: sourceAccount.shares || {},
    });

    const accRef = doc(firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'accounts', sourceAccount.id);
    batch.update(accRef, {
        balanceCents: increment(payload.type === 'income' ? payload.amountCents : -payload.amountCents)
    });
}
