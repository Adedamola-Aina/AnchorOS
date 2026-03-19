/**
 * useAuthRateLimit tests — SEC-004
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthRateLimit } from './useAuthRateLimit';

describe('useAuthRateLimit', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('allows up to 5 failures without locking', () => {
        const { result } = renderHook(() => useAuthRateLimit());

        act(() => {
            for (let i = 0; i < 5; i++) {
                result.current.recordFailure();
            }
        });

        expect(result.current.isLocked).toBe(false);
        expect(result.current.lockoutMessage).toBeNull();
        expect(result.current.failures).toBe(5);
    });

    it('locks after 6th failure with 2s backoff', () => {
        const { result } = renderHook(() => useAuthRateLimit());

        act(() => {
            for (let i = 0; i < 6; i++) {
                result.current.recordFailure();
            }
        });

        expect(result.current.isLocked).toBe(true);
        expect(result.current.remainingSeconds).toBe(2);
        expect(result.current.lockoutMessage).toBeTruthy();
    });

    it('doubles backoff on 7th failure (4s)', () => {
        const { result } = renderHook(() => useAuthRateLimit());

        act(() => {
            for (let i = 0; i < 5; i++) {
                result.current.recordFailure();
            }
        });

        // Advance past first lockout
        act(() => {
            result.current.recordFailure(); // 6th
        });
        act(() => {
            vi.advanceTimersByTime(3000); // unlock
        });
        act(() => {
            result.current.recordFailure(); // 7th
        });

        expect(result.current.isLocked).toBe(true);
        expect(result.current.remainingSeconds).toBe(4);
    });

    it('caps lockout at 5 minutes', () => {
        const { result } = renderHook(() => useAuthRateLimit());

        act(() => {
            // 20 failures — would be 2^15 * 2000 = 65536s without cap
            for (let i = 0; i < 20; i++) {
                result.current.recordFailure();
            }
        });

        expect(result.current.remainingSeconds).toBeLessThanOrEqual(300);
    });

    it('unlocks after timer expires', () => {
        const { result } = renderHook(() => useAuthRateLimit());

        act(() => {
            for (let i = 0; i < 6; i++) {
                result.current.recordFailure();
            }
        });

        expect(result.current.isLocked).toBe(true);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(result.current.isLocked).toBe(false);
    });

    it('recordSuccess resets all state', () => {
        const { result } = renderHook(() => useAuthRateLimit());

        act(() => {
            for (let i = 0; i < 6; i++) {
                result.current.recordFailure();
            }
        });

        act(() => {
            result.current.recordSuccess();
        });

        expect(result.current.isLocked).toBe(false);
        expect(result.current.failures).toBe(0);
        expect(result.current.lockoutMessage).toBeNull();
    });
});
