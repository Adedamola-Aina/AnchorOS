/**
 * Tests for rateLimit.ts — checkRateLimit, resetRateLimit, formatRetryTime
 * Target: 95%+ coverage
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { checkRateLimit, resetRateLimit, formatRetryTime, RATE_LIMIT_CONFIGS } from './rateLimit';

describe('rateLimit', () => {
    beforeEach(() => {
        // Reset all rate limit state between tests
        resetRateLimit('test-key');
        resetRateLimit('lock-key');
        resetRateLimit('window-key');
    });

    // ── checkRateLimit ──────────────────────────────────────────────
    describe('checkRateLimit', () => {
        const config = { maxAttempts: 3, windowMs: 60000, lockoutMs: 30000 };

        it('allows first attempt and tracks remaining', () => {
            const result = checkRateLimit('test-key', config);
            expect(result.isLimited).toBe(false);
            expect(result.attemptsRemaining).toBe(2);
        });

        it('decrements remaining attempts on subsequent calls', () => {
            checkRateLimit('test-key', config); // attempt 1
            const result = checkRateLimit('test-key', config); // attempt 2
            expect(result.isLimited).toBe(false);
            expect(result.attemptsRemaining).toBe(1);
        });

        it('triggers lockout after max attempts', () => {
            checkRateLimit('lock-key', config); // 1
            checkRateLimit('lock-key', config); // 2
            checkRateLimit('lock-key', config); // 3 — reaches max
            const result = checkRateLimit('lock-key', config); // should lock
            expect(result.isLimited).toBe(true);
            expect(result.retryAfterMs).toBeGreaterThan(0);
        });

        it('stays locked during lockout period', () => {
            const shortConfig = { maxAttempts: 1, windowMs: 60000, lockoutMs: 60000 };
            checkRateLimit('lock-key', shortConfig); // 1 — reaches max
            checkRateLimit('lock-key', shortConfig); // triggers lock
            const result = checkRateLimit('lock-key', shortConfig);
            expect(result.isLimited).toBe(true);
        });

        it('resets after window expires', () => {
            const now = Date.now();
            vi.spyOn(Date, 'now')
                .mockReturnValueOnce(now)     // first call — sets firstAttemptTime
                .mockReturnValueOnce(now + 70000); // second call — window expired

            checkRateLimit('window-key', config);
            const result = checkRateLimit('window-key', config);
            expect(result.isLimited).toBe(false);
            expect(result.attemptsRemaining).toBe(2); // reset to fresh

            vi.restoreAllMocks();
        });

        it('uses windowMs as default lockoutMs when lockoutMs not provided', () => {
            const noLockoutConfig = { maxAttempts: 1, windowMs: 45000 };
            checkRateLimit('lock-key', noLockoutConfig); // reaches max
            const result = checkRateLimit('lock-key', noLockoutConfig); // locks
            expect(result.isLimited).toBe(true);
            expect(result.retryAfterMs).toBe(45000);
        });
    });

    // ── resetRateLimit ──────────────────────────────────────────────
    describe('resetRateLimit', () => {
        it('clears rate limit state so next call is fresh', () => {
            const config = { maxAttempts: 2, windowMs: 60000 };
            checkRateLimit('test-key', config); // attempt 1
            checkRateLimit('test-key', config); // attempt 2 — at max
            resetRateLimit('test-key');
            const result = checkRateLimit('test-key', config);
            expect(result.isLimited).toBe(false);
            expect(result.attemptsRemaining).toBe(1);
        });

        it('is safe to call on non-existent keys', () => {
            expect(() => resetRateLimit('nonexistent')).not.toThrow();
        });
    });

    // ── formatRetryTime ─────────────────────────────────────────────
    describe('formatRetryTime', () => {
        it('formats seconds (singular)', () => {
            expect(formatRetryTime(1000)).toBe('1 second');
        });

        it('formats seconds (plural)', () => {
            expect(formatRetryTime(5000)).toBe('5 seconds');
        });

        it('rounds up milliseconds to next second', () => {
            expect(formatRetryTime(1500)).toBe('2 seconds');
        });

        it('formats minutes (singular)', () => {
            expect(formatRetryTime(60000)).toBe('1 minute');
        });

        it('formats minutes (plural)', () => {
            expect(formatRetryTime(120000)).toBe('2 minutes');
        });

        it('rounds up to next minute', () => {
            expect(formatRetryTime(61000)).toBe('2 minutes');
        });

        it('formats large values', () => {
            expect(formatRetryTime(900000)).toBe('15 minutes');
        });
    });

    // ── RATE_LIMIT_CONFIGS ──────────────────────────────────────────
    describe('RATE_LIMIT_CONFIGS', () => {
        it('has signIn config', () => {
            expect(RATE_LIMIT_CONFIGS.signIn.maxAttempts).toBe(5);
            expect(RATE_LIMIT_CONFIGS.signIn.windowMs).toBeGreaterThan(0);
        });

        it('has signUp config', () => {
            expect(RATE_LIMIT_CONFIGS.signUp.maxAttempts).toBe(3);
        });

        it('has mfaAttempt config', () => {
            expect(RATE_LIMIT_CONFIGS.mfaAttempt.maxAttempts).toBe(5);
        });

        it('has all expected keys', () => {
            const keys = Object.keys(RATE_LIMIT_CONFIGS);
            expect(keys).toContain('signIn');
            expect(keys).toContain('signUp');
            expect(keys).toContain('mfaAttempt');
            expect(keys).toContain('sendEmail');
            expect(keys).toContain('passwordReset');
            expect(keys).toContain('commitmentCreate');
            expect(keys).toContain('transactionCreate');
        });
    });
});
