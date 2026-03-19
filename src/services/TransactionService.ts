/**
 * TransactionService
 * 
 * Handles all transaction-related operations including creation, deletion,
 * and updates with optimistic locking and transfer support.
 * 
 * @module services/TransactionService
 */

import { doc, increment, writeBatch, runTransaction, type Firestore } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import { checkRateLimit, formatRetryTime, RATE_LIMIT_CONFIGS } from '../utils/rateLimit';
import { auditFinance } from './AuditService';
import { LedgerService } from './LedgerService';
import type { AnchorTransaction, AnchorAccount } from '../types';
import { canAddTransaction, canDeleteTransaction } from '../features/finance/utils/permissions';
import { processTransferTransaction, processStandardTransaction } from './TransferOperations';
import { updateTransaction as updateTransactionOp } from './TransactionUpdateOps';
import type { CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

// Re-export types for backward compatibility
export type { CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

/**
 * TransactionService providing transaction management operations
 */
export class TransactionService {
    private firestore: Firestore;

    constructor(firestore: Firestore = db) {
        this.firestore = firestore;
    }

    /** Add a new transaction (handles transfers and standard transactions) */
    async addTransaction(userId: string, payload: CreateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
        // Rate limit: 100 transactions per hour
        const rateCheck = checkRateLimit(`transactionCreate:${userId}`, RATE_LIMIT_CONFIGS.transactionCreate);
        if (rateCheck.isLimited) {
            throw new AnchorError(
                `Too many transactions created. Please try again in ${formatRetryTime(rateCheck.retryAfterMs || 0)}.`,
                'RATE_LIMIT'
            );
        }

        const sourceAccount = accounts.find(a => a.id === payload.accountId);
        if (!sourceAccount) throw new AnchorError('Source account not found', 'VALIDATION');
        if (!canAddTransaction(sourceAccount, userId)) {
            throw new AnchorError(`Permission denied: You cannot add transactions to ${sourceAccount.name}.`, 'PERMISSION');
        }

        try {
            const batch = writeBatch(this.firestore);
            const now = new Date();
            const createdAt = now.toISOString();
            const transactionDate = payload.date || createdAt;
            const isBackdated = payload.date ? new Date(payload.date).toDateString() !== now.toDateString() : false;

            if (payload.type === 'transfer') {
                processTransferTransaction(this.firestore, batch, userId, payload, sourceAccount, accounts, transactionDate, createdAt, isBackdated);
            } else {
                await processStandardTransaction(this.firestore, batch, userId, payload, sourceAccount, transactionDate, createdAt, isBackdated);
            }
            await batch.commit();

            // AUDIT: Log transaction creation
            auditFinance.transactionCreated(
                'batch', // Batch operation doesn't return single ID
                payload.accountId,
                payload.amountCents,
                payload.type
            );
            // ARCH-022: Immutable ledger entry
            void LedgerService.record(userId, {
                action: 'transaction_created',
                entityId: payload.accountId,
                entityType: 'transaction',
                amountCentsDelta: payload.type === 'income' ? payload.amountCents : -payload.amountCents,
                snapshotAfter: { accountId: payload.accountId, amountCents: payload.amountCents, type: payload.type },
            });
        } catch (error) {
            void auditFinance.operationFailed('transaction_create', {
                accountId: payload.accountId,
                amountCents: payload.amountCents,
                type: payload.type,
                reason: error instanceof Error ? error.message : String(error),
            });
            if (error instanceof AnchorError) throw error;
            throw new AnchorError('Failed to add transaction', 'DATABASE', error);
        }
    }

    /** Delete a transaction (soft delete with balance reversal) */
    async deleteTransaction(
        userId: string, transactionId: string, accountId: string,
        accounts: AnchorAccount[], transactions: AnchorTransaction[]
    ): Promise<void> {
        const account = accounts.find(a => a.id === accountId);
        if (!account) throw new AnchorError('Account not found', 'VALIDATION');
        if (!canDeleteTransaction(account, userId)) {
            throw new AnchorError('Permission denied: You cannot delete transactions from this account.', 'PERMISSION');
        }

        const txToDelete = transactions.find(t => t.id === transactionId);
        if (!txToDelete) throw new AnchorError('Transaction not found', 'VALIDATION');

        try {
            const timestamp = new Date().toISOString();
            const targetUserId = account.ownerId || userId;

            // BUG-035 Fix: Use runTransaction for linked deletions to prevent race conditions
            if (txToDelete.linkedTransactionId && txToDelete.linkedUserId) {
                await runTransaction(this.firestore, async (transaction) => {
                    const txRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'finance', transactionId);
                    transaction.update(txRef, { isSoftDeleted: true, deletedBy: userId, deletedAt: timestamp });

                    const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
                    const balanceAdj = txToDelete.type === 'income' ? -txToDelete.amountCents : txToDelete.amountCents;
                    transaction.update(accRef, { balanceCents: increment(balanceAdj) });

                    await this.deleteLinkedTransaction(transaction, txToDelete, userId, timestamp);
                });
            } else {
                // Simple delete uses writeBatch (still atomic, but faster for single ops)
                const batch = writeBatch(this.firestore);
                const txRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'finance', transactionId);
                batch.update(txRef, { isSoftDeleted: true, deletedBy: userId, deletedAt: timestamp });

                const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
                const balanceAdj = txToDelete.type === 'income' ? -txToDelete.amountCents : txToDelete.amountCents;
                batch.update(accRef, { balanceCents: increment(balanceAdj) });

                await batch.commit();
            }

            // AUDIT: Log transaction deletion
            auditFinance.transactionDeleted(transactionId, accountId);
            // ARCH-022: Immutable ledger entry
            void LedgerService.record(userId, {
                action: 'transaction_deleted',
                entityId: transactionId,
                entityType: 'transaction',
                amountCentsDelta: txToDelete.type === 'income' ? -txToDelete.amountCents : txToDelete.amountCents,
                snapshotBefore: { id: transactionId, accountId, amountCents: txToDelete.amountCents, type: txToDelete.type },
                snapshotAfter: null,
            });
        } catch (error) {
            void auditFinance.operationFailed('transaction_delete', {
                transactionId,
                accountId,
                reason: error instanceof Error ? error.message : String(error),
            });
            if (error instanceof AnchorError) throw error;
            throw new AnchorError('Failed to delete transaction', 'DATABASE', error);
        }
    }

    private async deleteLinkedTransaction(
        transaction: Parameters<Parameters<typeof runTransaction>[1]>[0],
        txToDelete: AnchorTransaction, userId: string, timestamp: string
    ): Promise<void> {
        const linkedTxRef = doc(this.firestore, 'artifacts', APP_ID, 'users', txToDelete.linkedUserId!, 'finance', txToDelete.linkedTransactionId!);
        // BUG-035 Fix: Use transaction.get() instead of getDoc() for atomicity
        const linkedTxDoc = await transaction.get(linkedTxRef);
        if (linkedTxDoc.exists()) {
            const pairedTx = linkedTxDoc.data() as AnchorTransaction;
            transaction.update(linkedTxRef, { isSoftDeleted: true, deletedBy: userId, deletedAt: timestamp });
            const linkedAccRef = doc(this.firestore, 'artifacts', APP_ID, 'users', txToDelete.linkedUserId!, 'accounts', pairedTx.accountId);
            transaction.update(linkedAccRef, { balanceCents: increment(pairedTx.type === 'income' ? -pairedTx.amountCents : pairedTx.amountCents) });
        }
    }

    /** Update a transaction with optimistic locking */
    async updateTransaction(
        userId: string, transactionId: string, accountId: string,
        updates: UpdateTransactionPayload, accounts: AnchorAccount[]
    ): Promise<void> {
        return updateTransactionOp(this.firestore, userId, transactionId, accountId, updates, accounts);
    }
}

export const transactionService = new TransactionService();
