/**
 * AccountService
 * 
 * Handles all account-related operations including creation, deletion (archival),
 * and renaming with history tracking.
 * 
 * @module services/AccountService
 * 
 * NOTE: This file is ~175 lines after type extraction.
 */

import { collection, doc, addDoc, writeBatch, query, where, getDocs, type Firestore } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import type { AnchorAccount } from '../types';
import { canManageAccount } from '../features/finance/utils/permissions';
import type { CreateAccountPayload } from './financeTypes';

// Re-export types for backward compatibility
export type { CreateAccountPayload } from './financeTypes';

/**
 * AccountService providing account management operations
 */
export class AccountService {
    private firestore: Firestore;

    constructor(firestore: Firestore = db) {
        this.firestore = firestore;
    }

    /** Add a new account */
    async addAccount(userId: string, payload: CreateAccountPayload): Promise<string> {
        try {
            const docRef = await addDoc(
                collection(this.firestore, 'artifacts', APP_ID, 'users', userId, 'accounts'),
                { ...payload, ownerId: userId, isArchived: false, shares: {} }
            );
            return docRef.id;
        } catch (error) {
            throw new AnchorError('Failed to add account', 'DATABASE', error);
        }
    }

    /** Delete (archive) an account */
    async deleteAccount(userId: string, userName: string, account: AnchorAccount): Promise<void> {
        if (!canManageAccount(account, userId)) {
            throw new AnchorError('Permission denied: You cannot delete this account.', 'PERMISSION');
        }

        try {
            const batch = writeBatch(this.firestore);
            const timestamp = new Date().toISOString();

            const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', userId, 'accounts', account.id);
            batch.update(accRef, { isArchived: true });

            if (account.shares) {
                Object.keys(account.shares).forEach(uid => {
                    if (uid !== userId) {
                        const notifRef = doc(collection(this.firestore, 'artifacts', APP_ID, 'users', uid, 'notifications'));
                        batch.set(notifRef, {
                            type: 'system', date: timestamp, read: false,
                            message: `The account "${account.name}" has been deleted by the owner. You no longer have access.`,
                            title: 'Account Deleted', actorId: userId, actorName: userName
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
     * Rename an account and track history.
     * Handles large transaction sets by chunking batch writes (Firestore limit: 500 ops).
     */
    async renameAccount(userId: string, userName: string, account: AnchorAccount, newName: string): Promise<void> {
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

            const historyEntry = { date: timestamp, oldName: account.name, newName, actorId: userId, actorName: userName };
            const currentHistory = account.nameHistory || [];

            const txQuery = query(collection(this.firestore, 'artifacts', APP_ID, 'users', ownerId, 'finance'), where('accountId', '==', account.id));
            const txSnap = await getDocs(txQuery);
            const txDocs = txSnap.docs;

            const BATCH_CHUNK_SIZE = 400;
            const chunks: typeof txDocs[] = [];
            for (let i = 0; i < txDocs.length; i += BATCH_CHUNK_SIZE) {
                chunks.push(txDocs.slice(i, i + BATCH_CHUNK_SIZE));
            }

            const firstBatch = writeBatch(this.firestore);
            firstBatch.update(accRef, { name: newName, nameHistory: [...currentHistory, historyEntry] });
            if (chunks.length > 0) {
                chunks[0].forEach(d => firstBatch.update(d.ref, { accountName: newName }));
            }
            await firstBatch.commit();

            for (let i = 1; i < chunks.length; i++) {
                const batch = writeBatch(this.firestore);
                chunks[i].forEach(d => batch.update(d.ref, { accountName: newName }));
                await batch.commit();
            }

            // Sync shared account transactions
            if (account.shares) {
                for (const spouseId of Object.keys(account.shares)) {
                    const spouseTxQuery = query(collection(this.firestore, 'artifacts', APP_ID, 'users', spouseId, 'finance'), where('accountId', '==', account.id));
                    const spouseTxSnap = await getDocs(spouseTxQuery);
                    if (!spouseTxSnap.empty) {
                        const spouseTxDocs = spouseTxSnap.docs;
                        for (let i = 0; i < spouseTxDocs.length; i += BATCH_CHUNK_SIZE) {
                            const spouseBatch = writeBatch(this.firestore);
                            spouseTxDocs.slice(i, i + BATCH_CHUNK_SIZE).forEach(d => spouseBatch.update(d.ref, { accountName: newName }));
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

export const accountService = new AccountService();
