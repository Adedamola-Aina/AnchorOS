/**
 * Recurring Transactions API Client
 *
 * Mutations (create/update/delete/toggle) go through Cloud Function callables
 * so they get server-side validation and audit logging.
 * Subscriptions use Firestore directly for real-time updates.
 *
 * @module api/RecurringApi
 */
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    type Unsubscribe
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, APP_ID } from '../config/firebase';
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
     * Subscribe to user's recurring transactions (real-time)
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
        const fn = httpsCallable<Omit<RecurringTransaction, 'id'>, { id: string }>(
            functions, 'createRecurringTransaction'
        );
        const result = await fn(data);
        return result.data.id;
    }

    /**
     * Update an existing recurring rule
     */
    async updateRecurring(id: string, updates: Partial<RecurringTransaction>): Promise<void> {
        const fn = httpsCallable<{ id: string } & Partial<RecurringTransaction>, { id: string }>(
            functions, 'updateRecurringTransaction'
        );
        await fn({ id, ...updates });
    }

    /**
     * Delete a recurring rule
     */
    async deleteRecurring(id: string): Promise<void> {
        const fn = httpsCallable<{ id: string }, { success: boolean }>(
            functions, 'deleteRecurringTransaction'
        );
        await fn({ id });
    }

    /**
     * Pause or resume a recurring rule
     */
    async toggleRecurring(id: string, status: 'active' | 'paused'): Promise<void> {
        const fn = httpsCallable<{ id: string; status: 'active' | 'paused' }, { id: string; status: string }>(
            functions, 'toggleRecurringTransaction'
        );
        await fn({ id, status });
    }
}

export const recurringApi = RecurringApi.getInstance();
