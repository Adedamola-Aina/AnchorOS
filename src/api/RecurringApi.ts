/**
 * Recurring Transactions API Client
 * 
 * Abstraction layer for Recurring Transaction Firestore operations.
 * 
 * @module api/RecurringApi
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    type Unsubscribe
} from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { RecurringTransaction } from '../types';

export class RecurringApi {
    private static instance: RecurringApi;

    public static getInstance(): RecurringApi {
        if (!RecurringApi.instance) {
            RecurringApi.instance = new RecurringApi();
        }
        return RecurringApi.instance;
    }

    /**
     * Subscribe to user's recurring transactions
     */
    subscribeToRecurring(
        userId: string,
        onData: (data: RecurringTransaction[]) => void,
        onError: (error: Error) => void
    ): Unsubscribe {
        const q = query(
            collection(db, 'artifacts', APP_ID, 'recurring_transactions'),
            where('userId', '==', userId),
            orderBy('nextRunAt', 'asc')
        );

        return onSnapshot(
            q,
            { includeMetadataChanges: true },
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as RecurringTransaction));
                onData(data);
            },
            (error) => onError(error)
        );
    }

    /**
     * Create a new recurring transaction rule
     */
    async createRecurring(data: Omit<RecurringTransaction, 'id'>): Promise<string> {
        const docRef = await addDoc(
            collection(db, 'artifacts', APP_ID, 'recurring_transactions'),
            {
                ...data,
                createdAt: new Date().toISOString()
            }
        );
        return docRef.id;
    }

    /**
     * Update an existing recurring rule
     */
    async updateRecurring(id: string, updates: Partial<RecurringTransaction>): Promise<void> {
        const docRef = doc(db, 'artifacts', APP_ID, 'recurring_transactions', id);
        await updateDoc(docRef, updates);
    }

    /**
     * Delete (or pause/archive) a recurring rule
     */
    async deleteRecurring(id: string): Promise<void> {
        const docRef = doc(db, 'artifacts', APP_ID, 'recurring_transactions', id);
        await deleteDoc(docRef);
    }
}

export const recurringApi = RecurringApi.getInstance();
