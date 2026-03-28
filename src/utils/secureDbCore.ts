/**
 * Secure Database Core Utilities
 * Extracted from secureDb.ts per CLAUDE.md §3.2
 */

import { doc, collection, type DocumentReference } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Log operation in development mode — no-op in production
 */
export const logOp = (_operation: string, _path: string, _data?: unknown) => {
    // Intentionally silent — console.log removed per CLAUDE.md privacy rule
};

/**
 * Wrap a Firestore operation with timeout handling
 */
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS, operation: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Operation timed out: ${operation}`)), timeoutMs);
        promise
            .then((result) => { clearTimeout(timer); resolve(result); })
            .catch((error) => { clearTimeout(timer); reject(error); });
    });
};

/**
 * Map errors to user-friendly messages
 */
export const mapSecureDbError = (error: unknown): string => {
    if (error instanceof Error) {
        if (error.message.includes('timed out')) return 'Service temporarily unavailable. Please try again.';
        if (error.message.includes('permission-denied')) return 'Not found';
        if (error.message.includes('not-found')) return 'Not found';
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
