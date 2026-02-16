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
  if (stryMutAct_9fa48("1673")) {
    {}
  } else {
    stryCov_9fa48("1673");
    const now = Date.now();
    const state = rateLimitStates.get(key);

    // First attempt
    if (stryMutAct_9fa48("1676") ? false : stryMutAct_9fa48("1675") ? true : stryMutAct_9fa48("1674") ? state : (stryCov_9fa48("1674", "1675", "1676"), !state)) {
      if (stryMutAct_9fa48("1677")) {
        {}
      } else {
        stryCov_9fa48("1677");
        rateLimitStates.set(key, stryMutAct_9fa48("1678") ? {} : (stryCov_9fa48("1678"), {
          attempts: 1,
          firstAttemptTime: now,
          lockedUntil: null
        }));
        return stryMutAct_9fa48("1679") ? {} : (stryCov_9fa48("1679"), {
          isLimited: stryMutAct_9fa48("1680") ? true : (stryCov_9fa48("1680"), false),
          attemptsRemaining: stryMutAct_9fa48("1681") ? config.maxAttempts + 1 : (stryCov_9fa48("1681"), config.maxAttempts - 1)
        });
      }
    }

    // Check if locked out
    if (stryMutAct_9fa48("1684") ? state.lockedUntil || now < state.lockedUntil : stryMutAct_9fa48("1683") ? false : stryMutAct_9fa48("1682") ? true : (stryCov_9fa48("1682", "1683", "1684"), state.lockedUntil && (stryMutAct_9fa48("1687") ? now >= state.lockedUntil : stryMutAct_9fa48("1686") ? now <= state.lockedUntil : stryMutAct_9fa48("1685") ? true : (stryCov_9fa48("1685", "1686", "1687"), now < state.lockedUntil)))) {
      if (stryMutAct_9fa48("1688")) {
        {}
      } else {
        stryCov_9fa48("1688");
        return stryMutAct_9fa48("1689") ? {} : (stryCov_9fa48("1689"), {
          isLimited: stryMutAct_9fa48("1690") ? false : (stryCov_9fa48("1690"), true),
          retryAfterMs: stryMutAct_9fa48("1691") ? state.lockedUntil + now : (stryCov_9fa48("1691"), state.lockedUntil - now)
        });
      }
    }

    // Check if window has expired
    if (stryMutAct_9fa48("1695") ? now - state.firstAttemptTime <= config.windowMs : stryMutAct_9fa48("1694") ? now - state.firstAttemptTime >= config.windowMs : stryMutAct_9fa48("1693") ? false : stryMutAct_9fa48("1692") ? true : (stryCov_9fa48("1692", "1693", "1694", "1695"), (stryMutAct_9fa48("1696") ? now + state.firstAttemptTime : (stryCov_9fa48("1696"), now - state.firstAttemptTime)) > config.windowMs)) {
      if (stryMutAct_9fa48("1697")) {
        {}
      } else {
        stryCov_9fa48("1697");
        // Reset the window
        rateLimitStates.set(key, stryMutAct_9fa48("1698") ? {} : (stryCov_9fa48("1698"), {
          attempts: 1,
          firstAttemptTime: now,
          lockedUntil: null
        }));
        return stryMutAct_9fa48("1699") ? {} : (stryCov_9fa48("1699"), {
          isLimited: stryMutAct_9fa48("1700") ? true : (stryCov_9fa48("1700"), false),
          attemptsRemaining: stryMutAct_9fa48("1701") ? config.maxAttempts + 1 : (stryCov_9fa48("1701"), config.maxAttempts - 1)
        });
      }
    }

    // Check if max attempts exceeded
    if (stryMutAct_9fa48("1705") ? state.attempts < config.maxAttempts : stryMutAct_9fa48("1704") ? state.attempts > config.maxAttempts : stryMutAct_9fa48("1703") ? false : stryMutAct_9fa48("1702") ? true : (stryCov_9fa48("1702", "1703", "1704", "1705"), state.attempts >= config.maxAttempts)) {
      if (stryMutAct_9fa48("1706")) {
        {}
      } else {
        stryCov_9fa48("1706");
        const lockoutMs = stryMutAct_9fa48("1709") ? config.lockoutMs && config.windowMs : stryMutAct_9fa48("1708") ? false : stryMutAct_9fa48("1707") ? true : (stryCov_9fa48("1707", "1708", "1709"), config.lockoutMs || config.windowMs);
        const lockedUntil = stryMutAct_9fa48("1710") ? now - lockoutMs : (stryCov_9fa48("1710"), now + lockoutMs);
        rateLimitStates.set(key, stryMutAct_9fa48("1711") ? {} : (stryCov_9fa48("1711"), {
          ...state,
          lockedUntil
        }));
        return stryMutAct_9fa48("1712") ? {} : (stryCov_9fa48("1712"), {
          isLimited: stryMutAct_9fa48("1713") ? false : (stryCov_9fa48("1713"), true),
          retryAfterMs: lockoutMs
        });
      }
    }

    // Increment attempts
    stryMutAct_9fa48("1714") ? state.attempts-- : (stryCov_9fa48("1714"), state.attempts++);
    return stryMutAct_9fa48("1715") ? {} : (stryCov_9fa48("1715"), {
      isLimited: stryMutAct_9fa48("1716") ? true : (stryCov_9fa48("1716"), false),
      attemptsRemaining: stryMutAct_9fa48("1717") ? config.maxAttempts + state.attempts : (stryCov_9fa48("1717"), config.maxAttempts - state.attempts)
    });
  }
}

/**
 * Reset rate limit for a key (call on successful operation)
 */
export function resetRateLimit(key: string): void {
  if (stryMutAct_9fa48("1718")) {
    {}
  } else {
    stryCov_9fa48("1718");
    rateLimitStates.delete(key);
  }
}

/**
 * Format retry time for user display
 */
export function formatRetryTime(ms: number): string {
  if (stryMutAct_9fa48("1719")) {
    {}
  } else {
    stryCov_9fa48("1719");
    const seconds = Math.ceil(stryMutAct_9fa48("1720") ? ms * 1000 : (stryCov_9fa48("1720"), ms / 1000));
    if (stryMutAct_9fa48("1724") ? seconds >= 60 : stryMutAct_9fa48("1723") ? seconds <= 60 : stryMutAct_9fa48("1722") ? false : stryMutAct_9fa48("1721") ? true : (stryCov_9fa48("1721", "1722", "1723", "1724"), seconds < 60)) {
      if (stryMutAct_9fa48("1725")) {
        {}
      } else {
        stryCov_9fa48("1725");
        return stryMutAct_9fa48("1726") ? `` : (stryCov_9fa48("1726"), `${seconds} second${(stryMutAct_9fa48("1729") ? seconds === 1 : stryMutAct_9fa48("1728") ? false : stryMutAct_9fa48("1727") ? true : (stryCov_9fa48("1727", "1728", "1729"), seconds !== 1)) ? stryMutAct_9fa48("1730") ? "" : (stryCov_9fa48("1730"), 's') : stryMutAct_9fa48("1731") ? "Stryker was here!" : (stryCov_9fa48("1731"), '')}`);
      }
    }
    const minutes = Math.ceil(stryMutAct_9fa48("1732") ? seconds * 60 : (stryCov_9fa48("1732"), seconds / 60));
    return stryMutAct_9fa48("1733") ? `` : (stryCov_9fa48("1733"), `${minutes} minute${(stryMutAct_9fa48("1736") ? minutes === 1 : stryMutAct_9fa48("1735") ? false : stryMutAct_9fa48("1734") ? true : (stryCov_9fa48("1734", "1735", "1736"), minutes !== 1)) ? stryMutAct_9fa48("1737") ? "" : (stryCov_9fa48("1737"), 's') : stryMutAct_9fa48("1738") ? "Stryker was here!" : (stryCov_9fa48("1738"), '')}`);
  }
}

// Preset configurations for common operations
export const RATE_LIMIT_CONFIGS = {
  // Authentication (Firebase handles but we track client-side)
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
  },
  // Commitments - 20 creates per hour
  commitmentCreate: {
    maxAttempts: 20,
    windowMs: 60 * 60 * 1000,
    // 1 hour
    lockoutMs: 15 * 60 * 1000 // 15 minute lockout
  },
  // Transactions - 100 creates per hour (generous for bulk entry)
  transactionCreate: {
    maxAttempts: 100,
    windowMs: 60 * 60 * 1000,
    // 1 hour
    lockoutMs: 15 * 60 * 1000 // 15 minute lockout
  },
  // Accounts - 10 creates per day (rarely need more)
  accountCreate: {
    maxAttempts: 10,
    windowMs: 24 * 60 * 60 * 1000,
    // 24 hours
    lockoutMs: 60 * 60 * 1000 // 1 hour lockout
  },
  // Feedback - 3 per hour (spam protection)
  feedbackSubmit: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    // 1 hour
    lockoutMs: 24 * 60 * 60 * 1000 // 24 hour lockout
  }
} as const;