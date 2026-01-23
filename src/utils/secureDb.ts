/**
 * Secure Database Utility Layer
 * 
 * Centralized Firestore wrapper with:
 * - Timeout handling (5s default)
 * - Error mapping to user-friendly messages
 * - Logging in development mode
 * - Type-safe operations
 */

import {
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    type DocumentReference,
    type QueryConstraint
} from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

// Configuration
const DEFAULT_TIMEOUT_MS = 5000;
const IS_DEV = import.meta.env.VITE_APP_ENV === 'development';

interface SecureDbOptions {
    timeoutMs?: number;
}

/**
 * Log operation in development mode
 */
const logOp = (operation: string, path: string, data?: unknown) => {
    if (IS_DEV) {
        console.log(`[SecureDb] ${operation}: ${path}`, data ? data : '');
    }
};

/**
 * Wrap a Firestore operation with timeout handling
 */
const withTimeout = <T>(
    promise: Promise<T>,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
    operation: string
): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Operation timed out: ${operation}`));
        }, timeoutMs);

        promise
            .then((result) => {
                clearTimeout(timer);
                resolve(result);
            })
            .catch((error) => {
                clearTimeout(timer);
                reject(error);
            });
    });
};

/**
 * Map errors to user-friendly messages
 */
export const mapSecureDbError = (error: unknown): string => {
    if (error instanceof Error) {
        if (error.message.includes('timed out')) {
            return 'Service temporarily unavailable. Please try again.';
        }
        if (error.message.includes('permission-denied')) {
            return 'Not found'; // Never reveal permission issues
        }
        if (error.message.includes('not-found')) {
            return 'Not found';
        }
    }
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Get a document reference for a user's data
 */
export const getUserDocRef = (userId: string, ...path: string[]): DocumentReference => {
    return doc(db, 'artifacts', APP_ID, 'users', userId, ...path);
};

/**
 * Get a collection reference for a user's data
 */
export const getUserCollectionPath = (userId: string, collectionName: string) => {
    return collection(db, 'artifacts', APP_ID, 'users', userId, collectionName);
};

/**
 * Secure Database Operations
 */
export const secureDb = {
    /**
     * Get a single document
     */
    async getDocument<T>(
        userId: string,
        path: string[],
        options: SecureDbOptions = {}
    ): Promise<T | null> {
        const docPath = path.join('/');
        logOp('GET', `users/${userId}/${docPath}`);

        try {
            const docRef = getUserDocRef(userId, ...path);
            const snapshot = await withTimeout(
                getDoc(docRef),
                options.timeoutMs,
                `getDocument(${docPath})`
            );

            if (!snapshot.exists()) {
                return null;
            }

            return { id: snapshot.id, ...snapshot.data() } as T;
        } catch (error) {
            console.error(`[SecureDb] Error getting document: ${docPath}`, error);
            throw error;
        }
    },

    /**
     * Query documents in a collection
     */
    async queryCollection<T>(
        userId: string,
        collectionName: string,
        constraints: QueryConstraint[] = [],
        options: SecureDbOptions = {}
    ): Promise<T[]> {
        logOp('QUERY', `users/${userId}/${collectionName}`);

        try {
            const collectionRef = getUserCollectionPath(userId, collectionName);
            const q = constraints.length > 0
                ? query(collectionRef, ...constraints)
                : query(collectionRef);

            const snapshot = await withTimeout(
                getDocs(q),
                options.timeoutMs,
                `queryCollection(${collectionName})`
            );

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        } catch (error) {
            console.error(`[SecureDb] Error querying collection: ${collectionName}`, error);
            throw error;
        }
    },

    /**
     * Create or update a document
     */
    async setDocument(
        userId: string,
        path: string[],
        data: Record<string, unknown>,
        options: SecureDbOptions = {}
    ): Promise<void> {
        const docPath = path.join('/');
        logOp('SET', `users/${userId}/${docPath}`, data);

        try {
            const docRef = getUserDocRef(userId, ...path);
            await withTimeout(
                setDoc(docRef, data),
                options.timeoutMs,
                `setDocument(${docPath})`
            );
        } catch (error) {
            console.error(`[SecureDb] Error setting document: ${docPath}`, error);
            throw error;
        }
    },

    /**
     * Update specific fields in a document
     */
    async updateDocument(
        userId: string,
        path: string[],
        data: Record<string, unknown>,
        options: SecureDbOptions = {}
    ): Promise<void> {
        const docPath = path.join('/');
        logOp('UPDATE', `users/${userId}/${docPath}`, data);

        try {
            const docRef = getUserDocRef(userId, ...path);
            await withTimeout(
                updateDoc(docRef, data),
                options.timeoutMs,
                `updateDocument(${docPath})`
            );
        } catch (error) {
            console.error(`[SecureDb] Error updating document: ${docPath}`, error);
            throw error;
        }
    },

    /**
     * Delete a document
     */
    async deleteDocument(
        userId: string,
        path: string[],
        options: SecureDbOptions = {}
    ): Promise<void> {
        const docPath = path.join('/');
        logOp('DELETE', `users/${userId}/${docPath}`);

        try {
            const docRef = getUserDocRef(userId, ...path);
            await withTimeout(
                deleteDoc(docRef),
                options.timeoutMs,
                `deleteDocument(${docPath})`
            );
        } catch (error) {
            console.error(`[SecureDb] Error deleting document: ${docPath}`, error);
            throw error;
        }
    }
};

// Re-export common Firestore query helpers
export { where, query };
