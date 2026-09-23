/**
 * Secure Database Core Utilities
 * Extracted from secureDb.ts
 */

import { doc, collection, type DocumentReference } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Log operation in development mode — no-op in production
 */
export const logOp = (_operation: string, _path: string, _data?: unknown) => {
    // Intentionally silent — console.log removed for privacy
};

/**
 * RA-06 (#152): a timeout does NOT cancel the underlying Firestore write, so the
 * operation may still succeed after this error is thrown. Callers must not treat
 * it as a definitive failure and blindly retry — that is how the same
 * balance-affecting write gets applied twice.
 */
export class OperationTimeoutError extends Error {
    public readonly operation: string;
    public readonly timeoutMs: number;

    constructor(operation: string, timeoutMs: number) {
        super(`Operation timed out: ${operation}`);
        this.name = 'OperationTimeoutError';
        this.operation = operation;
        this.timeoutMs = timeoutMs;
    }
}

/** RA-06 (#152): identify an uncertain (not definitively failed) write. */
export const isOperationTimeoutError = (error: unknown): error is OperationTimeoutError =>
    error instanceof OperationTimeoutError ||
    (error instanceof Error && error.name === 'OperationTimeoutError');

/**
 * Wrap a Firestore operation with timeout handling.
 *
 * NOTE: the wrapped promise is intentionally NOT cancelled — Firestore writes
 * are not cancellable. A late settlement after this timeout is ignored here, but
 * the write itself may still have been applied (see OperationTimeoutError).
 */
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS, operation: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new OperationTimeoutError(operation, timeoutMs)), timeoutMs);
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
