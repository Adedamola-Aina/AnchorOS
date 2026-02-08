/**
 * Tests for error.ts — AnchorError, handleError, captureError
 * Target: 95%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnchorError, handleError, captureError } from './error';
import type { ErrorCategory } from './error';

// Mock Sentry
vi.mock('@sentry/react', () => ({
    captureException: vi.fn(),
}));

import * as Sentry from '@sentry/react';

describe('AnchorError', () => {
    it('creates with message and default category', () => {
        const err = new AnchorError('something broke');
        expect(err.message).toBe('something broke');
        expect(err.category).toBe('UNKNOWN');
        expect(err.userMessage).toBe('something broke');
        expect(err.name).toBe('AnchorError');
    });

    it('creates with explicit category', () => {
        const err = new AnchorError('forbidden', 'PERMISSION');
        expect(err.category).toBe('PERMISSION');
    });

    it('stores original error', () => {
        const original = new Error('original');
        const err = new AnchorError('wrapped', 'DATABASE', original);
        expect(err.originalError).toBe(original);
    });

    it('is instanceof Error', () => {
        const err = new AnchorError('test');
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(AnchorError);
    });

    describe('isAnchorError', () => {
        it('returns true for AnchorError instances', () => {
            expect(AnchorError.isAnchorError(new AnchorError('test'))).toBe(true);
        });

        it('returns false for plain Error', () => {
            expect(AnchorError.isAnchorError(new Error('test'))).toBe(false);
        });

        it('returns false for non-error values', () => {
            expect(AnchorError.isAnchorError(null)).toBe(false);
            expect(AnchorError.isAnchorError('string')).toBe(false);
            expect(AnchorError.isAnchorError(42)).toBe(false);
        });
    });
});

describe('handleError', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('returns the same AnchorError if already wrapped', () => {
        const original = new AnchorError('auth failed', 'AUTH');
        const result = handleError(original);
        expect(result).toBe(original);
    });

    it('reports AnchorError to Sentry with correct level', () => {
        const err = new AnchorError('validation issue', 'VALIDATION');
        handleError(err);
        expect(Sentry.captureException).toHaveBeenCalledWith(
            err,
            expect.objectContaining({
                level: 'warning',
                tags: { category: 'VALIDATION' },
            })
        );
    });

    it('reports PERMISSION errors with error level', () => {
        const err = new AnchorError('no access', 'PERMISSION', new Error('denied'));
        handleError(err);
        expect(Sentry.captureException).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ level: 'error' })
        );
    });

    it('wraps plain Error with UNKNOWN category', () => {
        const plain = new Error('plain error');
        const result = handleError(plain);
        expect(result).toBeInstanceOf(AnchorError);
        expect(result.category).toBe('UNKNOWN');
        expect(result.originalError).toBe(plain);
    });

    it('uses fallbackMessage for plain errors', () => {
        const result = handleError(new Error('bad'), 'Custom fallback');
        expect(result.userMessage).toBe('Custom fallback');
    });

    it('uses default fallback when none provided', () => {
        const result = handleError('string error');
        expect(result.userMessage).toBe('An unexpected error occurred');
    });

    it('reports plain errors to Sentry as UNKNOWN', () => {
        handleError(new Error('test'));
        expect(Sentry.captureException).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                level: 'error',
                tags: { category: 'UNKNOWN' },
            })
        );
    });

    it('handles all error categories with correct Sentry levels', () => {
        const expectations: [ErrorCategory, 'warning' | 'error'][] = [
            ['VALIDATION', 'warning'],
            ['RATE_LIMIT', 'warning'],
            ['PERMISSION', 'error'],
            ['NETWORK', 'error'],
            ['AUTH', 'error'],
            ['DATABASE', 'error'],
            ['UNKNOWN', 'error'],
        ];

        expectations.forEach(([category, level]) => {
            vi.clearAllMocks();
            handleError(new AnchorError('test', category));
            expect(Sentry.captureException).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ level })
            );
        });
    });
});

describe('captureError', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sends Error to Sentry with context tag', () => {
        const err = new Error('fetch failed');
        captureError(err, 'TransactionForm.submit');
        expect(Sentry.captureException).toHaveBeenCalledWith(
            err,
            expect.objectContaining({
                tags: expect.objectContaining({ context: 'TransactionForm.submit' }),
            })
        );
    });

    it('wraps non-Error values in Error', () => {
        captureError('string error', 'test-context');
        expect(Sentry.captureException).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'string error' }),
            expect.anything()
        );
    });

    it('passes extra data through', () => {
        captureError(new Error('e'), 'ctx', { accountId: 'abc' });
        expect(Sentry.captureException).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                extra: expect.objectContaining({ accountId: 'abc' }),
            })
        );
    });

    it('uses warning level for AnchorError with VALIDATION category', () => {
        const err = new AnchorError('bad input', 'VALIDATION');
        captureError(err, 'form');
        expect(Sentry.captureException).toHaveBeenCalledWith(
            err,
            expect.objectContaining({ level: 'warning' })
        );
    });

    it('uses error level for regular Error', () => {
        captureError(new Error('x'), 'ctx');
        expect(Sentry.captureException).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({ level: 'error' })
        );
    });

    it('tags AnchorError category', () => {
        const err = new AnchorError('net', 'NETWORK');
        captureError(err, 'api');
        expect(Sentry.captureException).toHaveBeenCalledWith(
            err,
            expect.objectContaining({
                tags: expect.objectContaining({ category: 'NETWORK' }),
            })
        );
    });
});
