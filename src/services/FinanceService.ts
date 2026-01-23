import {
    collection,
    addDoc,
    doc,
    increment,
    writeBatch,
    query,

    where,
    getDocs,
    getDoc,
    runTransaction,

    type Firestore
} from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import type {
    AnchorTransaction,
    AnchorAccount,
    TransactionType,
    Currency
} from '../types';
import {
    canAddTransaction,
    canDeleteTransaction,
    canEditTransaction,
    canManageAccount
} from '../features/finance/utils/permissions';

/**
 * Payload for creating a new account
 */
export interface CreateAccountPayload {
    name: string;
    type: 'checking' | 'savings' | 'salary' | 'investment';
    currency: Currency;
    balanceCents: number;
    color: string;
    scope: 'personal' | 'family';
}

/**
 * Payload for creating a new transaction
 */
export interface CreateTransactionPayload {
    title: string;
    amountCents: number;
    type: TransactionType;
    category: string;
    accountId: string;
    accountName?: string;
    currency: string;
    scope: 'personal' | 'family';
    destinationAccountId?: string; // For transfers
    date?: string; // Optional backdated date (ISO string)
}

/**
 * Payload for updating a transaction
 */
export interface UpdateTransactionPayload {
    title?: string;
    amountCents?: number;
    type?: TransactionType;
    category?: string;
    scope?: 'personal' | 'family';
    date?: string;
    transactionDate?: string;
}

/**
 * Finance Service providing an abstraction layer over Firestore
 */
export class FinanceService {
    private firestore: Firestore;

    constructor(firestore: Firestore = db) {
        this.firestore = firestore;
    }

    /**
     * Add a new account
     */
    async addAccount(userId: string, payload: CreateAccountPayload): Promise<string> {
        try {
            const docRef = await addDoc(
                collection(this.firestore, 'artifacts', APP_ID, 'users', userId, 'accounts'),
                {
                    ...payload,
                    ownerId: userId,
                    isArchived: false,
                    shares: {}
                }
            );
            return docRef.id;
        } catch (error) {
            throw new AnchorError('Failed to add account', 'DATABASE', error);
        }
    }

    /**
     * Delete (archive) an account
     */
    async deleteAccount(userId: string, userName: string, account: AnchorAccount): Promise<void> {
        if (!canManageAccount(account, userId)) {
            throw new AnchorError('Permission denied: You cannot delete this account.', 'PERMISSION');
        }

        try {
            const batch = writeBatch(this.firestore);
            const timestamp = new Date().toISOString();

            // 1. Archive Account
            const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', userId, 'accounts', account.id);
            batch.update(accRef, { isArchived: true });

            // 2. Notify Sharers
            if (account.shares) {
                Object.keys(account.shares).forEach(uid => {
                    if (uid !== userId) {
                        const notifRef = doc(collection(this.firestore, 'artifacts', APP_ID, 'users', uid, 'notifications'));
                        batch.set(notifRef, {
                            type: 'system',
                            date: timestamp,
                            read: false,
                            message: `The account "${account.name}" has been deleted by the owner. You no longer have access.`,
                            title: 'Account Deleted',
                            actorId: userId,
                            actorName: userName
                        });
                    }
                });
            }

            await batch.commit();
        } catch (error) {
            throw new AnchorError('Failed to delete account', 'DATABASE', error);
        }
    }



    /**
     * Add a new transaction (handles transfers and standard transactions)
     */
    async addTransaction(
        userId: string,
        payload: CreateTransactionPayload,
        accounts: AnchorAccount[]
    ): Promise<void> {
        const sourceAccount = accounts.find(a => a.id === payload.accountId);
        if (!sourceAccount) throw new AnchorError('Source account not found', 'VALIDATION');

        if (!canAddTransaction(sourceAccount, userId)) {
            throw new AnchorError(`Permission denied: You cannot add transactions to ${sourceAccount.name}.`, 'PERMISSION');
        }

        try {
            const batch = writeBatch(this.firestore);
            const now = new Date();
            const createdAt = now.toISOString();
            // Use provided date for backdating, or current timestamp
            const transactionDate = payload.date || createdAt;
            // Check if this is a backdated transaction
            const isBackdated = payload.date ? new Date(payload.date).toDateString() !== now.toDateString() : false;
            const linkId = payload.type === 'transfer' ? Math.random().toString(36).substring(7) : undefined;

            // Success

            if (payload.type === 'transfer') {
                if (!payload.destinationAccountId) throw new AnchorError('Transfer missing destination account', 'VALIDATION');
                const destAccount = accounts.find(a => a.id === payload.destinationAccountId);
                if (!destAccount) throw new AnchorError('Destination account not found', 'VALIDATION');

                if (!canAddTransaction(destAccount, userId)) {
                    throw new AnchorError(`Permission denied: You cannot add transactions to ${destAccount.name}.`, 'PERMISSION');
                }

                const sourceTxRef = doc(collection(this.firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'finance'));
                const destTxRef = doc(collection(this.firestore, 'artifacts', APP_ID, 'users', destAccount.ownerId || userId, 'finance'));

                // Record 1: Source
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

                // Record 2: Destination
                batch.set(destTxRef, {
                    ...payload,
                    id: destTxRef.id,
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

                // Balances
                const sourceAccRef = doc(this.firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'accounts', sourceAccount.id);
                const destAccRef = doc(this.firestore, 'artifacts', APP_ID, 'users', destAccount.ownerId || userId, 'accounts', destAccount.id);
                batch.update(sourceAccRef, { balanceCents: increment(-payload.amountCents) });
                batch.update(destAccRef, { balanceCents: increment(payload.amountCents) });

            } else {
                // Standard Transaction - exclude destinationAccountId (only for transfers)
                // Firestore doesn't allow undefined values
                const { destinationAccountId: _, ...transactionData } = payload;
                const txRef = doc(collection(this.firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'finance'));
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

                const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', sourceAccount.ownerId || userId, 'accounts', sourceAccount.id);
                batch.update(accRef, {
                    balanceCents: increment(payload.type === 'income' ? payload.amountCents : -payload.amountCents)
                });
            }

            await batch.commit();
        } catch (error) {
            if (error instanceof AnchorError) throw error;
            throw new AnchorError('Failed to add transaction', 'DATABASE', error);
        }
    }

    /**
     * Delete a transaction
     */
    async deleteTransaction(
        userId: string,
        transactionId: string,
        accountId: string,
        accounts: AnchorAccount[],
        transactions: AnchorTransaction[]
    ): Promise<void> {
        const account = accounts.find(a => a.id === accountId);
        if (!account) throw new AnchorError('Account not found', 'VALIDATION');

        if (!canDeleteTransaction(account, userId)) {
            throw new AnchorError('Permission denied: You cannot delete transactions from this account.', 'PERMISSION');
        }

        const txToDelete = transactions.find(t => t.id === transactionId);
        if (!txToDelete) throw new AnchorError('Transaction not found', 'VALIDATION');

        try {
            const batch = writeBatch(this.firestore);
            const timestamp = new Date().toISOString();
            const targetUserId = account.ownerId || userId;

            // 1. Primary
            const txRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'finance', transactionId);
            batch.update(txRef, {
                isSoftDeleted: true,
                deletedBy: userId,
                deletedAt: timestamp
            });

            const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
            batch.update(accRef, {
                balanceCents: increment(txToDelete.type === 'income' ? -txToDelete.amountCents : txToDelete.amountCents)
            });

            // 2. Linked (if Transfer)
            if (txToDelete.linkedTransactionId && txToDelete.linkedUserId) {
                const linkedTxRef = doc(this.firestore, 'artifacts', APP_ID, 'users', txToDelete.linkedUserId, 'finance', txToDelete.linkedTransactionId);
                const linkedTxDoc = await getDoc(linkedTxRef);

                if (linkedTxDoc.exists()) {
                    const pairedTx = linkedTxDoc.data() as AnchorTransaction;
                    batch.update(linkedTxRef, {
                        isSoftDeleted: true,
                        deletedBy: userId,
                        deletedAt: timestamp
                    });
                    const linkedAccRef = doc(this.firestore, 'artifacts', APP_ID, 'users', txToDelete.linkedUserId, 'accounts', pairedTx.accountId);
                    batch.update(linkedAccRef, {
                        balanceCents: increment(pairedTx.type === 'income' ? -pairedTx.amountCents : pairedTx.amountCents)
                    });
                }
            }

            await batch.commit();
        } catch (error) {
            if (error instanceof AnchorError) throw error;
            throw new AnchorError('Failed to delete transaction', 'DATABASE', error);
        }
    }

    /**
     * Update a transaction with optimistic locking
     */
    async updateTransaction(
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
            await runTransaction(this.firestore, async (transaction) => {
                const targetUserId = account.ownerId || userId;
                const txRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'finance', transactionId);
                const txDoc = await transaction.get(txRef);

                if (!txDoc.exists()) throw new AnchorError('Transaction does not exist', 'VALIDATION');
                const currentData = txDoc.data() as AnchorTransaction;

                // Perform balance adjustment if amount changed
                if (updates.amountCents !== undefined && updates.amountCents !== currentData.amountCents) {
                    const diff = updates.amountCents - currentData.amountCents;
                    const correction = currentData.type === 'income' ? diff : -diff;
                    const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
                    transaction.update(accRef, { balanceCents: increment(correction) });
                }

                transaction.update(txRef, {
                    ...updates,
                    lastEditedBy: userId,
                    updatedAt: new Date().toISOString()
                });

                // Sync with linked transaction if it's a transfer
                if (currentData.linkedTransactionId && currentData.linkedUserId) {
                    const linkedTxRef = doc(this.firestore, 'artifacts', APP_ID, 'users', currentData.linkedUserId, 'finance', currentData.linkedTransactionId);
                    const linkedDoc = await transaction.get(linkedTxRef);

                    if (linkedDoc.exists()) {
                        const linkedData = linkedDoc.data() as AnchorTransaction;
                        const linkedUpdates: any = { ...updates };

                        // If amount changed, reflect it in linked transaction too
                        if (updates.amountCents !== undefined && updates.amountCents !== linkedData.amountCents) {
                            const diff = updates.amountCents - linkedData.amountCents;
                            const correction = linkedData.type === 'income' ? diff : -diff;
                            const linkedAccRef = doc(this.firestore, 'artifacts', APP_ID, 'users', currentData.linkedUserId, 'accounts', linkedData.accountId);
                            transaction.update(linkedAccRef, { balanceCents: increment(correction) });
                        }

                        transaction.update(linkedTxRef, linkedUpdates);
                    }
                }
            });
        } catch (error) {
            if (error instanceof AnchorError) throw error;
            throw new AnchorError('Failed to update transaction', 'DATABASE', error);
        }
    }

    /**
     * Rename an account and track history.
     * Handles large transaction sets by chunking batch writes (Firestore limit: 500 ops).
     */
    async renameAccount(
        userId: string,
        userName: string,
        account: AnchorAccount,
        newName: string
    ): Promise<void> {
        if (!canManageAccount(account, userId)) {
            throw new AnchorError('Permission denied: You cannot rename this account.', 'PERMISSION');
        }

        if (!newName.trim()) {
            throw new AnchorError('Account name cannot be empty.', 'VALIDATION');
        }

        try {
            const timestamp = new Date().toISOString();
            const ownerId = account.ownerId || userId;
            const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', ownerId, 'accounts', account.id);

            const historyEntry = {
                date: timestamp,
                oldName: account.name,
                newName: newName,
                actorId: userId,
                actorName: userName
            };

            const currentHistory = account.nameHistory || [];

            // Get all transactions that need updating
            const txQuery = query(
                collection(this.firestore, 'artifacts', APP_ID, 'users', ownerId, 'finance'),
                where('accountId', '==', account.id)
            );
            const txSnap = await getDocs(txQuery);
            const txDocs = txSnap.docs;

            // Chunk size: 400 to leave room for account update and stay under 500 limit
            const BATCH_CHUNK_SIZE = 400;
            const chunks: typeof txDocs[] = [];

            for (let i = 0; i < txDocs.length; i += BATCH_CHUNK_SIZE) {
                chunks.push(txDocs.slice(i, i + BATCH_CHUNK_SIZE));
            }

            // First batch: update account + first chunk of transactions
            const firstBatch = writeBatch(this.firestore);
            firstBatch.update(accRef, {
                name: newName,
                nameHistory: [...currentHistory, historyEntry]
            });

            if (chunks.length > 0) {
                chunks[0].forEach(d => {
                    firstBatch.update(d.ref, { accountName: newName });
                });
            }
            await firstBatch.commit();

            // Remaining chunks: process sequentially
            for (let i = 1; i < chunks.length; i++) {
                const batch = writeBatch(this.firestore);
                chunks[i].forEach(d => {
                    batch.update(d.ref, { accountName: newName });
                });
                await batch.commit();
            }

            // Sync shared account: Update spouse's view if account is shared
            if (account.shares) {
                const spouseIds = Object.keys(account.shares);
                for (const spouseId of spouseIds) {
                    // Check if spouse has any transactions referencing this account
                    // (e.g., transfer transactions stored in their collection)
                    const spouseTxQuery = query(
                        collection(this.firestore, 'artifacts', APP_ID, 'users', spouseId, 'finance'),
                        where('accountId', '==', account.id)
                    );
                    const spouseTxSnap = await getDocs(spouseTxQuery);

                    if (!spouseTxSnap.empty) {
                        const spouseTxDocs = spouseTxSnap.docs;
                        for (let i = 0; i < spouseTxDocs.length; i += BATCH_CHUNK_SIZE) {
                            const spouseBatch = writeBatch(this.firestore);
                            spouseTxDocs.slice(i, i + BATCH_CHUNK_SIZE).forEach(d => {
                                spouseBatch.update(d.ref, { accountName: newName });
                            });
                            await spouseBatch.commit();
                        }
                    }
                }
            }
        } catch (error) {
            if (error instanceof AnchorError) throw error;
            throw new AnchorError('Failed to rename account', 'DATABASE', error);
        }
    }
}

export const financeService = new FinanceService();
