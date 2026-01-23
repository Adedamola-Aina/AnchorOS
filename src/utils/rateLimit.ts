/**
 * Rate Limiting Utility
 * 
 * Provides client-side rate limiting for sensitive operations like
 * authentication, email sending, and MFA attempts.
 */

interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;  // Time window in milliseconds
    lockoutMs?: number; // Lockout period after max attempts (default: windowMs)
}

interface RateLimitState {
    attempts: number;
    firstAttemptTime: number;
    lockedUntil: number | null;
}

const rateLimitStates: Map<string, RateLimitState> = new Map();

/**
 * Check if an operation is rate limited
 * @param key - Unique identifier for the operation (e.g., 'signIn:user@email.com')
 * @param config - Rate limiting configuration
 * @returns Object with isLimited flag and optional retryAfterMs
 */
export function checkRateLimit(key: string, config: RateLimitConfig): {
    isLimited: boolean;
    retryAfterMs?: number;
    attemptsRemaining?: number;
} {
    const now = Date.now();
    const state = rateLimitStates.get(key);

    // First attempt
    if (!state) {
        rateLimitStates.set(key, {
            attempts: 1,
            firstAttemptTime: now,
            lockedUntil: null
        });
        return { isLimited: false, attemptsRemaining: config.maxAttempts - 1 };
    }

    // Check if locked out
    if (state.lockedUntil && now < state.lockedUntil) {
        return {
            isLimited: true,
            retryAfterMs: state.lockedUntil - now
        };
    }

    // Check if window has expired
    if (now - state.firstAttemptTime > config.windowMs) {
        // Reset the window
        rateLimitStates.set(key, {
            attempts: 1,
            firstAttemptTime: now,
            lockedUntil: null
        });
        return { isLimited: false, attemptsRemaining: config.maxAttempts - 1 };
    }

    // Check if max attempts exceeded
    if (state.attempts >= config.maxAttempts) {
        const lockoutMs = config.lockoutMs || config.windowMs;
        const lockedUntil = now + lockoutMs;
        rateLimitStates.set(key, { ...state, lockedUntil });
        return {
            isLimited: true,
            retryAfterMs: lockoutMs
        };
    }

    // Increment attempts
    state.attempts++;
    return {
        isLimited: false,
        attemptsRemaining: config.maxAttempts - state.attempts
    };
}

/**
 * Reset rate limit for a key (call on successful operation)
 */
export function resetRateLimit(key: string): void {
    rateLimitStates.delete(key);
}

/**
 * Format retry time for user display
 */
export function formatRetryTime(ms: number): string {
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

// Preset configurations for common operations
export const RATE_LIMIT_CONFIGS = {
    signIn: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000,  // 15 minutes
        lockoutMs: 5 * 60 * 1000   // 5 minute lockout
    },
    signUp: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000,  // 1 hour
        lockoutMs: 30 * 60 * 1000  // 30 minute lockout
    },
    mfaAttempt: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000,  // 15 minutes
        lockoutMs: 15 * 60 * 1000  // 15 minute lockout
    },
    sendEmail: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000,  // 1 hour
        lockoutMs: 60 * 60 * 1000  // 1 hour lockout
    },
    passwordReset: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000,  // 1 hour
        lockoutMs: 60 * 60 * 1000  // 1 hour lockout
    }
} as const;
