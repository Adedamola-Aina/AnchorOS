/**
 * useAuthRateLimit — SEC-004
 * 
 * Exponential back-off rate limiter for auth forms.
 * Tracks consecutive failures and computes lockout durations:
 *   Attempt 1-5: allowed immediately
 *   Attempt 6: 2s lockout
 *   Attempt 7: 4s lockout
 *   Attempt 8: 8s lockout
 *   ...doubling up to 5 minutes max.
 * 
 * Reset triggers: successful auth, window expires (1h), manual reset.
 */
import { useState, useRef, useCallback, useEffect } from 'react';

const MAX_FREE_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 2000;
const MAX_LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes
const ATTEMPT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitState {
    isLocked: boolean;
    lockoutEndsAt: number | null;
    remainingSeconds: number;
    failures: number;
}

interface AuthRateLimitResult {
    isLocked: boolean;
    remainingSeconds: number;
    failures: number;
    /** Call on each auth submission — returns false if rate-limited (caller should NOT proceed) */
    recordFailure: () => boolean;
    /** Call on successful auth */
    recordSuccess: () => void;
    /** Error message to display, null if not locked */
    lockoutMessage: string | null;
}

export function useAuthRateLimit(): AuthRateLimitResult {
    const failuresRef = useRef(0);
    const firstFailureRef = useRef<number>(0);
    const [state, setState] = useState<RateLimitState>({
        isLocked: false,
        lockoutEndsAt: null,
        remainingSeconds: 0,
        failures: 0,
    });

    // Countdown timer
    useEffect(() => {
        if (!state.isLocked || !state.lockoutEndsAt) return;
        const tick = () => {
            const remaining = Math.ceil((state.lockoutEndsAt! - Date.now()) / 1000);
            if (remaining <= 0) {
                setState(s => ({ ...s, isLocked: false, lockoutEndsAt: null, remainingSeconds: 0 }));
            } else {
                setState(s => ({ ...s, remainingSeconds: remaining }));
            }
        };
        tick();
        const interval = setInterval(tick, 500);
        return () => clearInterval(interval);
    }, [state.isLocked, state.lockoutEndsAt]);

    const recordFailure = useCallback((): boolean => {
        const now = Date.now();
        // Reset window if first failure was too long ago
        if (failuresRef.current > 0 && now - firstFailureRef.current > ATTEMPT_WINDOW_MS) {
            failuresRef.current = 0;
        }
        if (failuresRef.current === 0) {
            firstFailureRef.current = now;
        }
        failuresRef.current += 1;

        const excess = failuresRef.current - MAX_FREE_ATTEMPTS;
        if (excess <= 0) {
            setState(s => ({ ...s, failures: failuresRef.current }));
            return true; // attempt allowed
        }

        // Exponential backoff: 2^(excess-1) * BASE_BACKOFF_MS, capped at MAX_LOCKOUT_MS
        const lockoutMs = Math.min(Math.pow(2, excess - 1) * BASE_BACKOFF_MS, MAX_LOCKOUT_MS);
        const lockoutEndsAt = now + lockoutMs;
        setState({
            isLocked: true,
            lockoutEndsAt,
            remainingSeconds: Math.ceil(lockoutMs / 1000),
            failures: failuresRef.current,
        });
        return false; // attempt blocked
    }, []);

    const recordSuccess = useCallback(() => {
        failuresRef.current = 0;
        firstFailureRef.current = 0;
        setState({ isLocked: false, lockoutEndsAt: null, remainingSeconds: 0, failures: 0 });
    }, []);

    const lockoutMessage = state.isLocked
        ? `Too many failed attempts. Please wait ${state.remainingSeconds}s before trying again.`
        : null;

    return {
        isLocked: state.isLocked,
        remainingSeconds: state.remainingSeconds,
        failures: state.failures,
        recordFailure,
        recordSuccess,
        lockoutMessage,
    };
}
