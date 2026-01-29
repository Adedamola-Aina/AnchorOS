/**
 * Rate Limiting Utility
 * 
 * Provides client-side rate limiting for sensitive operations like
 * authentication, email sending, and MFA attempts.
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
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
  if (stryMutAct_9fa48("9226")) {
    {}
  } else {
    stryCov_9fa48("9226");
    const now = Date.now();
    const state = rateLimitStates.get(key);

    // First attempt
    if (stryMutAct_9fa48("9229") ? false : stryMutAct_9fa48("9228") ? true : stryMutAct_9fa48("9227") ? state : (stryCov_9fa48("9227", "9228", "9229"), !state)) {
      if (stryMutAct_9fa48("9230")) {
        {}
      } else {
        stryCov_9fa48("9230");
        rateLimitStates.set(key, stryMutAct_9fa48("9231") ? {} : (stryCov_9fa48("9231"), {
          attempts: 1,
          firstAttemptTime: now,
          lockedUntil: null
        }));
        return stryMutAct_9fa48("9232") ? {} : (stryCov_9fa48("9232"), {
          isLimited: stryMutAct_9fa48("9233") ? true : (stryCov_9fa48("9233"), false),
          attemptsRemaining: stryMutAct_9fa48("9234") ? config.maxAttempts + 1 : (stryCov_9fa48("9234"), config.maxAttempts - 1)
        });
      }
    }

    // Check if locked out
    if (stryMutAct_9fa48("9237") ? state.lockedUntil || now < state.lockedUntil : stryMutAct_9fa48("9236") ? false : stryMutAct_9fa48("9235") ? true : (stryCov_9fa48("9235", "9236", "9237"), state.lockedUntil && (stryMutAct_9fa48("9240") ? now >= state.lockedUntil : stryMutAct_9fa48("9239") ? now <= state.lockedUntil : stryMutAct_9fa48("9238") ? true : (stryCov_9fa48("9238", "9239", "9240"), now < state.lockedUntil)))) {
      if (stryMutAct_9fa48("9241")) {
        {}
      } else {
        stryCov_9fa48("9241");
        return stryMutAct_9fa48("9242") ? {} : (stryCov_9fa48("9242"), {
          isLimited: stryMutAct_9fa48("9243") ? false : (stryCov_9fa48("9243"), true),
          retryAfterMs: stryMutAct_9fa48("9244") ? state.lockedUntil + now : (stryCov_9fa48("9244"), state.lockedUntil - now)
        });
      }
    }

    // Check if window has expired
    if (stryMutAct_9fa48("9248") ? now - state.firstAttemptTime <= config.windowMs : stryMutAct_9fa48("9247") ? now - state.firstAttemptTime >= config.windowMs : stryMutAct_9fa48("9246") ? false : stryMutAct_9fa48("9245") ? true : (stryCov_9fa48("9245", "9246", "9247", "9248"), (stryMutAct_9fa48("9249") ? now + state.firstAttemptTime : (stryCov_9fa48("9249"), now - state.firstAttemptTime)) > config.windowMs)) {
      if (stryMutAct_9fa48("9250")) {
        {}
      } else {
        stryCov_9fa48("9250");
        // Reset the window
        rateLimitStates.set(key, stryMutAct_9fa48("9251") ? {} : (stryCov_9fa48("9251"), {
          attempts: 1,
          firstAttemptTime: now,
          lockedUntil: null
        }));
        return stryMutAct_9fa48("9252") ? {} : (stryCov_9fa48("9252"), {
          isLimited: stryMutAct_9fa48("9253") ? true : (stryCov_9fa48("9253"), false),
          attemptsRemaining: stryMutAct_9fa48("9254") ? config.maxAttempts + 1 : (stryCov_9fa48("9254"), config.maxAttempts - 1)
        });
      }
    }

    // Check if max attempts exceeded
    if (stryMutAct_9fa48("9258") ? state.attempts < config.maxAttempts : stryMutAct_9fa48("9257") ? state.attempts > config.maxAttempts : stryMutAct_9fa48("9256") ? false : stryMutAct_9fa48("9255") ? true : (stryCov_9fa48("9255", "9256", "9257", "9258"), state.attempts >= config.maxAttempts)) {
      if (stryMutAct_9fa48("9259")) {
        {}
      } else {
        stryCov_9fa48("9259");
        const lockoutMs = stryMutAct_9fa48("9262") ? config.lockoutMs && config.windowMs : stryMutAct_9fa48("9261") ? false : stryMutAct_9fa48("9260") ? true : (stryCov_9fa48("9260", "9261", "9262"), config.lockoutMs || config.windowMs);
        const lockedUntil = stryMutAct_9fa48("9263") ? now - lockoutMs : (stryCov_9fa48("9263"), now + lockoutMs);
        rateLimitStates.set(key, stryMutAct_9fa48("9264") ? {} : (stryCov_9fa48("9264"), {
          ...state,
          lockedUntil
        }));
        return stryMutAct_9fa48("9265") ? {} : (stryCov_9fa48("9265"), {
          isLimited: stryMutAct_9fa48("9266") ? false : (stryCov_9fa48("9266"), true),
          retryAfterMs: lockoutMs
        });
      }
    }

    // Increment attempts
    stryMutAct_9fa48("9267") ? state.attempts-- : (stryCov_9fa48("9267"), state.attempts++);
    return stryMutAct_9fa48("9268") ? {} : (stryCov_9fa48("9268"), {
      isLimited: stryMutAct_9fa48("9269") ? true : (stryCov_9fa48("9269"), false),
      attemptsRemaining: stryMutAct_9fa48("9270") ? config.maxAttempts + state.attempts : (stryCov_9fa48("9270"), config.maxAttempts - state.attempts)
    });
  }
}

/**
 * Reset rate limit for a key (call on successful operation)
 */
export function resetRateLimit(key: string): void {
  if (stryMutAct_9fa48("9271")) {
    {}
  } else {
    stryCov_9fa48("9271");
    rateLimitStates.delete(key);
  }
}

/**
 * Format retry time for user display
 */
export function formatRetryTime(ms: number): string {
  if (stryMutAct_9fa48("9272")) {
    {}
  } else {
    stryCov_9fa48("9272");
    const seconds = Math.ceil(stryMutAct_9fa48("9273") ? ms * 1000 : (stryCov_9fa48("9273"), ms / 1000));
    if (stryMutAct_9fa48("9277") ? seconds >= 60 : stryMutAct_9fa48("9276") ? seconds <= 60 : stryMutAct_9fa48("9275") ? false : stryMutAct_9fa48("9274") ? true : (stryCov_9fa48("9274", "9275", "9276", "9277"), seconds < 60)) {
      if (stryMutAct_9fa48("9278")) {
        {}
      } else {
        stryCov_9fa48("9278");
        return stryMutAct_9fa48("9279") ? `` : (stryCov_9fa48("9279"), `${seconds} second${(stryMutAct_9fa48("9282") ? seconds === 1 : stryMutAct_9fa48("9281") ? false : stryMutAct_9fa48("9280") ? true : (stryCov_9fa48("9280", "9281", "9282"), seconds !== 1)) ? stryMutAct_9fa48("9283") ? "" : (stryCov_9fa48("9283"), 's') : stryMutAct_9fa48("9284") ? "Stryker was here!" : (stryCov_9fa48("9284"), '')}`);
      }
    }
    const minutes = Math.ceil(stryMutAct_9fa48("9285") ? seconds * 60 : (stryCov_9fa48("9285"), seconds / 60));
    return stryMutAct_9fa48("9286") ? `` : (stryCov_9fa48("9286"), `${minutes} minute${(stryMutAct_9fa48("9289") ? minutes === 1 : stryMutAct_9fa48("9288") ? false : stryMutAct_9fa48("9287") ? true : (stryCov_9fa48("9287", "9288", "9289"), minutes !== 1)) ? stryMutAct_9fa48("9290") ? "" : (stryCov_9fa48("9290"), 's') : stryMutAct_9fa48("9291") ? "Stryker was here!" : (stryCov_9fa48("9291"), '')}`);
  }
}

// Preset configurations for common operations
export const RATE_LIMIT_CONFIGS = {
  signIn: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    // 15 minutes
    lockoutMs: 5 * 60 * 1000 // 5 minute lockout
  },
  signUp: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    // 1 hour
    lockoutMs: 30 * 60 * 1000 // 30 minute lockout
  },
  mfaAttempt: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    // 15 minutes
    lockoutMs: 15 * 60 * 1000 // 15 minute lockout
  },
  sendEmail: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    // 1 hour
    lockoutMs: 60 * 60 * 1000 // 1 hour lockout
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    // 1 hour
    lockoutMs: 60 * 60 * 1000 // 1 hour lockout
  }
} as const;