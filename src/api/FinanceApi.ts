/**
 * Finance API Client
 * 
 * Abstraction layer for Finance-related Firestore operations.
 * Decouples direct Firestore keys/queries from React hooks.
 * 
 * @module api/FinanceApi
 */
// @ts-nocheck


import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    limit,
    type Unsubscribe
} from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorTransaction, AnchorAccount } from '../types';
import { FieldEncryption, ENCRYPTED_TRANSACTION_FIELDS, ENCRYPTED_ACCOUNT_FIELDS } from '../services/FieldEncryption';

const enc = FieldEncryption.fromEnv();

async function decryptTransactions(raw: AnchorTransaction[]): Promise<AnchorTransaction[]> {
    if (!enc.isEnabled()) return raw;
    return Promise.all(raw.map(t => enc.decryptFields(t, ENCRYPTED_TRANSACTION_FIELDS)));
}

async function decryptAccounts(raw: AnchorAccount[]): Promise<AnchorAccount[]> {
    if (!enc.isEnabled()) return raw;
    return Promise.all(raw.map(a => enc.decryptFields(a, ENCRYPTED_ACCOUNT_FIELDS)));
}

export class FinanceApi {
    private static instance: FinanceApi;

    // Singleton pattern
    public static getInstance(): FinanceApi {
        if (!FinanceApi.instance) {
            FinanceApi.instance = new FinanceApi();
        }
        return FinanceApi.instance;
    }

    /**
     * Subscribe to user's transactions within a date range
     */
    subscribeToTransactions(
        userId: string,
        start: string,
        end: string,
        onData: (data: AnchorTransaction[]) => void,
        onError: (error: Error) => void
    ): Unsubscribe {
        const q = query(
            collection(db, 'artifacts', APP_ID, 'users', userId, 'finance'),
            where('date', '>=', start),
            where('date', '<=', end),
            orderBy('date', 'desc'),
            limit(500)
        );

        return onSnapshot(
            q,
            { includeMetadataChanges: true },
            (snapshot) => {
                const raw = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as AnchorTransaction));
                // SEC-005: Decrypt sensitive fields
                void decryptTransactions(raw).then(onData);
            },
            (error) => onError(error)
        );
    }

    subscribeToAccounts(
        userId: string,
        onData: (data: AnchorAccount[]) => void,
        onError: (error: Error) => void
    ): Unsubscribe {
        const q = query(
            collection(db, 'artifacts', APP_ID, 'users', userId, 'accounts'),
            limit(50)
        );

        return onSnapshot(
            q,
            { includeMetadataChanges: true },
            (snapshot) => {
                const raw = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    ownerId: doc.data().ownerId || userId
                } as AnchorAccount));
                // SEC-005: Decrypt sensitive fields
                void decryptAccounts(raw).then(onData);
            },
            (error) => onError(error)
        );
    }

    /**
     * Subscribe to recent transactions
     */
    subscribeToRecentTransactions(
        userId: string,
        limitCount: number,
        onData: (data: AnchorTransaction[]) => void,
        onError: (error: Error) => void
    ): Unsubscribe {
        const q = query(
            collection(db, 'artifacts', APP_ID, 'users', userId, 'finance'),
            orderBy('date', 'desc'),
            limit(limitCount)
        );

        return onSnapshot(
            q,
            { includeMetadataChanges: true },
            (snapshot) => {
                const raw = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as AnchorTransaction));
                // SEC-005: Decrypt sensitive fields
                void decryptTransactions(raw).then(onData);
            },
            (error) => onError(error)
        );
    }
    /**
     * Advanced transaction search utilizing server-side filtering
     * Requires composite indexes defined in firestore.indexes.json
     */
    searchTransactions(
        userId: string,
        filters: {
            category?: string;
            type?: 'income' | 'expense' | 'transfer';
            minAmount?: number;
            maxAmount?: number;
            limit?: number;
        },
        onData: (data: AnchorTransaction[]) => void,
        onError: (error: Error) => void
    ): Unsubscribe {
        let q = query(
            collection(db, 'artifacts', APP_ID, 'users', userId, 'finance'),
            orderBy('date', 'desc')
        );

        if (filters.category) {
            q = query(q, where('category', '==', filters.category));
        }

        if (filters.type) {
            q = query(q, where('type', '==', filters.type));
        }

        if (filters.minAmount !== undefined) {
            q = query(q, where('amountCents', '>=', filters.minAmount));
        }

        if (filters.maxAmount !== undefined) {
            q = query(q, where('amountCents', '<=', filters.maxAmount));
        }

        q = query(q, limit(filters.limit || 50));

        return onSnapshot(
            q,
            { includeMetadataChanges: true },
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as AnchorTransaction));
                onData(data);
            },
            (error) => onError(error)
        );
    }
}

export const financeApi = FinanceApi.getInstance();
