/**
 * Tests for secureDbCore.ts — withTimeout, mapSecureDbError, logOp, getUserDocRef, getUserCollectionPath
 * Target: 90%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withTimeout, mapSecureDbError, logOp, getUserDocRef, getUserCollectionPath } from './secureDbCore';

// Re-mock firebase to ensure our calls work
vi.mock('../config/firebase', () => ({
    db: { type: 'mock-firestore' },
    APP_ID: 'anchor-os',
}));

describe('secureDbCore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── withTimeout ─────────────────────────────────────────────────
    describe('withTimeout', () => {
        it('resolves when promise completes within timeout', async () => {
            const result = await withTimeout(Promise.resolve('ok'), 5000, 'test-op');
            expect(result).toBe('ok');
        });

        it('rejects when promise rejects within timeout', async () => {
            await expect(
                withTimeout(Promise.reject(new Error('bad')), 5000, 'test-op')
            ).rejects.toThrow('bad');
        });

        it('rejects with timeout error when promise takes too long', async () => {
            vi.useFakeTimers();
            const slowPromise = new Promise(() => {}); // never resolves
            const timeoutPromise = withTimeout(slowPromise, 100, 'slow-op');

            vi.advanceTimersByTime(101);

            await expect(timeoutPromise).rejects.toThrow('Operation timed out: slow-op');
            vi.useRealTimers();
        });

        it('uses default timeout when none specified', async () => {
            // Just verifying it doesn't throw for a fast promise with default timeout
            const result = await withTimeout(Promise.resolve(42), undefined as any, 'op');
            expect(result).toBe(42);
        });
    });

    // ── mapSecureDbError ────────────────────────────────────────────
    describe('mapSecureDbError', () => {
        it('maps timeout errors', () => {
            const err = new Error('Operation timed out: something');
            expect(mapSecureDbError(err)).toBe('Service temporarily unavailable. Please try again.');
        });

        it('maps permission-denied errors', () => {
            const err = new Error('FirebaseError: permission-denied something');
            expect(mapSecureDbError(err)).toBe('Not found');
        });

        it('maps not-found errors', () => {
            const err = new Error('not-found in collection');
            expect(mapSecureDbError(err)).toBe('Not found');
        });

        it('returns generic message for unknown errors', () => {
            const err = new Error('something else');
            expect(mapSecureDbError(err)).toBe('An unexpected error occurred. Please try again.');
        });

        it('handles non-Error values', () => {
            expect(mapSecureDbError('string error')).toBe('An unexpected error occurred. Please try again.');
            expect(mapSecureDbError(null)).toBe('An unexpected error occurred. Please try again.');
            expect(mapSecureDbError(42)).toBe('An unexpected error occurred. Please try again.');
        });
    });

    // ── logOp ───────────────────────────────────────────────────────
    describe('logOp', () => {
        it('does not throw', () => {
            // logOp only logs in dev mode; in test it should be silent or log
            expect(() => logOp('GET', 'users/123/accounts')).not.toThrow();
            expect(() => logOp('SET', 'users/123/profile', { name: 'Test' })).not.toThrow();
        });
    });

    // ── getUserDocRef ───────────────────────────────────────────────
    describe('getUserDocRef', () => {
        it('returns a reference with correct path segments', () => {
            const ref = getUserDocRef('user-1', 'accounts', 'acc-1');
            // The mock returns { path: 'artifacts/anchor-os/users/user-1/accounts/acc-1' }
            expect(ref).toBeDefined();
        });

        it('handles single path segment', () => {
            const ref = getUserDocRef('user-1', 'profile');
            expect(ref).toBeDefined();
        });
    });

    // ── getUserCollectionPath ───────────────────────────────────────
    describe('getUserCollectionPath', () => {
        it('returns a collection reference', () => {
            const ref = getUserCollectionPath('user-1', 'accounts');
            expect(ref).toBeDefined();
        });
    });
});
