/**
 * TransferOperations
 * 
 * Helper module for handling transfer transactions between accounts.
 * Extracted from TransactionService to maintain the 200-line rule.
 * 
 * @module services/TransferOperations
 */

import { collection, doc, increment, type WriteBatch, type Firestore } from '../utils/secureDb';
import { APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import type { AnchorAccount } from '../types';
import { canAddTransaction } from './financePermissions';
import type { CreateTransactionPayload } from '../types';
import { FieldEncryption, ENCRYPTED_TRANSACTION_FIELDS } from '../utils/fieldEncryption';

function buildAccountShareIndex(account: AnchorAccount): Record<string, true> {
    const index: Record<string, true> = {};
    if (account.shares) {
        Object.keys(account.shares).forEach((uid) => {
            index[uid] = true;
        });
    }
    if (account.sharedWith) {
        Object.keys(account.sharedWith).forEach((uid) => {
            index[uid] = true;
        });
    }
    return index;
}

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
    // FI-06: the payload's idempotency key (when present) becomes the document id.
    const requestId = payload.requestId;
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
    // FI-06: when the write carries an idempotency key the twin documents get
    // deterministic ids, so a replay targets the same docs instead of minting
    // a fresh pair.
    const sourceCollection = collection(firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'finance');
    const destCollection = collection(firestore, 'artifacts', APP_ID, 'users', destAccount.ownerId || userId, 'finance');
    const sourceTxRef = requestId ? doc(sourceCollection, requestId) : doc(sourceCollection);
    const destTxRef = requestId ? doc(destCollection, `${requestId}-in`) : doc(destCollection);

    const destAmount = payload.destinationAmountCents ?? payload.amountCents;

    const sourceAccountShares = buildAccountShareIndex(sourceAccount);
    const destinationAccountShares = buildAccountShareIndex(destAccount);

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
        accountShares: sourceAccountShares,
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
        accountShares: destinationAccountShares,
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
export async function processStandardTransaction(
    firestore: Firestore,
    batch: WriteBatch,
    userId: string,
    payload: CreateTransactionPayload,
    sourceAccount: AnchorAccount,
    transactionDate: string,
    createdAt: string,
    isBackdated: boolean
): Promise<void> {
    // FI-06: the payload's idempotency key (when present) becomes the document id.
    const requestId = payload.requestId;
    // Exclude destinationAccountId (only for transfers) - explicitly omit with rest
    const { destinationAccountId: _ignored, ...transactionData } = payload;
    void _ignored; // Explicitly discard to satisfy linter

    // SEC-005: Encrypt sensitive fields before storage.
    // Keep raw payload for balance increment (increment() requires a number).
    const enc = FieldEncryption.fromEnv();
    const dataToStore = enc.isEnabled()
        ? await enc.encryptFields(transactionData, ENCRYPTED_TRANSACTION_FIELDS)
        : transactionData;

    // FI-06: a keyed write reuses the key as the document id so the replay
    // targets the document it already created.
    const txCollection = collection(firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'finance');
    const txRef = requestId ? doc(txCollection, requestId) : doc(txCollection);

    batch.set(txRef, {
        ...dataToStore,
        id: txRef.id,
        date: transactionDate,
        createdAt,
        isBackdated,
        accountName: sourceAccount.name,
        currency: sourceAccount.currency,
        createdBy: userId,
        isSoftDeleted: false,
        accountOwnerId: sourceAccount.ownerId || userId,
        accountShares: buildAccountShareIndex(sourceAccount),
    });

    const accRef = doc(firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'accounts', sourceAccount.id);
    batch.update(accRef, {
        balanceCents: increment(payload.type === 'income' ? payload.amountCents : -payload.amountCents)
    });
}
