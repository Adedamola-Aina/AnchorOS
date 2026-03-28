/**
 * Transaction update and linked-transaction sync operations.
 *
 * Extracted from TransactionService to keep modules under 200 lines.
 */

import { doc, increment, runTransaction, type Firestore } from '../utils/secureDb';
import { APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import { auditFinance } from './AuditService';
import { canEditTransaction } from '../features/finance/utils/permissions';
import type { AnchorTransaction, AnchorAccount } from '../types';
import type { UpdateTransactionPayload } from './financeTypes';
import { FieldEncryption, ENCRYPTED_TRANSACTION_FIELDS } from './FieldEncryption';

export async function updateTransaction(
    firestore: Firestore,
    userId: string,
    transactionId: string,
    accountId: string,
    updates: UpdateTransactionPayload,
    accounts: AnchorAccount[]
): Promise<void> {
    const account = accounts.find(a => a.id === accountId);
    if (!account) throw new AnchorError('Account not found', 'VALIDATION');
    if (!canEditTransaction(account, userId)) {
        throw new AnchorError('Permission denied: You cannot edit transactions in this account.', 'PERMISSION');
    }

    try {
        await runTransaction(firestore, async (transaction) => {
            const targetUserId = account.ownerId || userId;
            const txRef = doc(firestore, 'artifacts', APP_ID, 'users', targetUserId, 'finance', transactionId);
            const txDoc = await transaction.get(txRef);
            if (!txDoc.exists()) throw new AnchorError('Transaction does not exist', 'VALIDATION');
            const currentData = txDoc.data() as AnchorTransaction;

            // SEC-005: Decrypt fields that may have been encrypted at write time
            const enc = FieldEncryption.fromEnv();
            const decrypted = enc.isEnabled()
                ? await enc.decryptFields(currentData as unknown as Record<string, unknown>, ENCRYPTED_TRANSACTION_FIELDS) as unknown as AnchorTransaction
                : currentData;

            // BUG-036 Fix: Handle type change, amount change, or both
            const oldType = decrypted.type;
            const newType = updates.type ?? oldType;
            const oldAmount = decrypted.amountCents;
            const newAmount = updates.amountCents ?? oldAmount;

            if (newType !== oldType || newAmount !== oldAmount) {
                const oldContribution = oldType === 'income' ? oldAmount : -oldAmount;
                const newContribution = newType === 'income' ? newAmount : -newAmount;
                const correction = newContribution - oldContribution;
                if (correction !== 0) {
                    const accRef = doc(firestore, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
                    transaction.update(accRef, { balanceCents: increment(correction) });
                }
            }
            transaction.update(txRef, { ...updates, lastEditedBy: userId, updatedAt: new Date().toISOString() });

            if (currentData.linkedTransactionId && currentData.linkedUserId) {
                await syncLinkedTransaction(firestore, transaction, currentData, updates);
            }
        });

        const changedFields = Object.keys(updates);
        auditFinance.transactionUpdated(transactionId, accountId, changedFields);
    } catch (error) {
        void auditFinance.operationFailed('transaction_update', {
            transactionId,
            accountId,
            reason: error instanceof Error ? error.message : String(error),
        });
        if (error instanceof AnchorError) throw error;
        throw new AnchorError('Failed to update transaction', 'DATABASE', error);
    }
}

async function syncLinkedTransaction(
    firestore: Firestore,
    transaction: Parameters<Parameters<typeof runTransaction>[1]>[0],
    currentData: AnchorTransaction,
    updates: UpdateTransactionPayload
): Promise<void> {
    const linkedTxRef = doc(firestore, 'artifacts', APP_ID, 'users', currentData.linkedUserId!, 'finance', currentData.linkedTransactionId!);
    const linkedDoc = await transaction.get(linkedTxRef);
    if (linkedDoc.exists()) {
        const linkedData = linkedDoc.data() as AnchorTransaction;

        // BUG-034: For cross-currency transfers, use destinationAmountCents
        const linkedAmountUpdate = updates.destinationAmountCents ?? updates.amountCents;

        if (linkedAmountUpdate !== undefined && linkedAmountUpdate !== linkedData.amountCents) {
            const diff = linkedAmountUpdate - linkedData.amountCents;
            const correction = linkedData.type === 'income' ? diff : -diff;
            const linkedAccRef = doc(firestore, 'artifacts', APP_ID, 'users', currentData.linkedUserId!, 'accounts', linkedData.accountId);
            transaction.update(linkedAccRef, { balanceCents: increment(correction) });
        }

        const linkedUpdates = { ...updates };
        if (updates.destinationAmountCents !== undefined) {
            linkedUpdates.amountCents = updates.destinationAmountCents;
            delete linkedUpdates.destinationAmountCents;
        }
        transaction.update(linkedTxRef, linkedUpdates);
    }
}
