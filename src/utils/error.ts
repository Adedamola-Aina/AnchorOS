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
import * as Sentry from '@sentry/react';

/**
 * Custom error class for Anchor OS application
 */
export type ErrorCategory = 'VALIDATION' | 'PERMISSION' | 'NETWORK' | 'AUTH' | 'DATABASE' | 'RATE_LIMIT' | 'UNKNOWN';
export class AnchorError extends Error {
  public category: ErrorCategory;
  public userMessage: string;
  public originalError?: unknown;
  constructor(message: string, category: ErrorCategory = stryMutAct_9fa48("978") ? "" : (stryCov_9fa48("978"), 'UNKNOWN'), originalError?: unknown) {
    if (stryMutAct_9fa48("979")) {
      {}
    } else {
      stryCov_9fa48("979");
      super(message);
      this.name = stryMutAct_9fa48("980") ? "" : (stryCov_9fa48("980"), 'AnchorError');
      this.category = category;
      this.userMessage = message;
      this.originalError = originalError;

      // Ensure stack trace is captured correctly (V8-specific API)
      if (stryMutAct_9fa48("983") ? 'captureStackTrace' in Error || typeof Error.captureStackTrace === 'function' : stryMutAct_9fa48("982") ? false : stryMutAct_9fa48("981") ? true : (stryCov_9fa48("981", "982", "983"), (stryMutAct_9fa48("984") ? "" : (stryCov_9fa48("984"), 'captureStackTrace')) in Error && (stryMutAct_9fa48("986") ? typeof Error.captureStackTrace !== 'function' : stryMutAct_9fa48("985") ? true : (stryCov_9fa48("985", "986"), typeof Error.captureStackTrace === (stryMutAct_9fa48("987") ? "" : (stryCov_9fa48("987"), 'function')))))) {
        if (stryMutAct_9fa48("988")) {
          {}
        } else {
          stryCov_9fa48("988");
          Error.captureStackTrace(this, AnchorError);
        }
      }
    }
  }
  static isAnchorError(error: unknown): error is AnchorError {
    if (stryMutAct_9fa48("989")) {
      {}
    } else {
      stryCov_9fa48("989");
      return error instanceof AnchorError;
    }
  }
}

/** Severity mapping: VALIDATION/RATE_LIMIT are warnings, rest are errors */
const SENTRY_LEVEL: Record<ErrorCategory, 'warning' | 'error' | 'fatal'> = stryMutAct_9fa48("990") ? {} : (stryCov_9fa48("990"), {
  VALIDATION: stryMutAct_9fa48("991") ? "" : (stryCov_9fa48("991"), 'warning'),
  RATE_LIMIT: stryMutAct_9fa48("992") ? "" : (stryCov_9fa48("992"), 'warning'),
  PERMISSION: stryMutAct_9fa48("993") ? "" : (stryCov_9fa48("993"), 'error'),
  NETWORK: stryMutAct_9fa48("994") ? "" : (stryCov_9fa48("994"), 'error'),
  AUTH: stryMutAct_9fa48("995") ? "" : (stryCov_9fa48("995"), 'error'),
  DATABASE: stryMutAct_9fa48("996") ? "" : (stryCov_9fa48("996"), 'error'),
  UNKNOWN: stryMutAct_9fa48("997") ? "" : (stryCov_9fa48("997"), 'error')
});

/**
 * Global error handler utility
 * Logs to console AND reports to Sentry with full context
 */
export const handleError = (error: unknown, fallbackMessage: string = stryMutAct_9fa48("998") ? "" : (stryCov_9fa48("998"), 'An unexpected error occurred')): AnchorError => {
  if (stryMutAct_9fa48("999")) {
    {}
  } else {
    stryCov_9fa48("999");
    if (stryMutAct_9fa48("1001") ? false : stryMutAct_9fa48("1000") ? true : (stryCov_9fa48("1000", "1001"), AnchorError.isAnchorError(error))) {
      if (stryMutAct_9fa48("1002")) {
        {}
      } else {
        stryCov_9fa48("1002");
        console.error(stryMutAct_9fa48("1003") ? `` : (stryCov_9fa48("1003"), `[${error.category}] ${error.message}`), error.originalError);
        Sentry.captureException(stryMutAct_9fa48("1006") ? error.originalError && error : stryMutAct_9fa48("1005") ? false : stryMutAct_9fa48("1004") ? true : (stryCov_9fa48("1004", "1005", "1006"), error.originalError || error), stryMutAct_9fa48("1007") ? {} : (stryCov_9fa48("1007"), {
          level: SENTRY_LEVEL[error.category],
          tags: stryMutAct_9fa48("1008") ? {} : (stryCov_9fa48("1008"), {
            category: error.category
          }),
          extra: stryMutAct_9fa48("1009") ? {} : (stryCov_9fa48("1009"), {
            userMessage: error.userMessage,
            originalError: error.originalError instanceof Error ? error.originalError.message : error.originalError
          })
        }));
        return error;
      }
    }
    console.error(stryMutAct_9fa48("1010") ? "" : (stryCov_9fa48("1010"), '[UNKNOWN]'), error);
    const wrapped = new AnchorError(fallbackMessage, stryMutAct_9fa48("1011") ? "" : (stryCov_9fa48("1011"), 'UNKNOWN'), error);
    Sentry.captureException(error, stryMutAct_9fa48("1012") ? {} : (stryCov_9fa48("1012"), {
      level: stryMutAct_9fa48("1013") ? "" : (stryCov_9fa48("1013"), 'error'),
      tags: stryMutAct_9fa48("1014") ? {} : (stryCov_9fa48("1014"), {
        category: stryMutAct_9fa48("1015") ? "" : (stryCov_9fa48("1015"), 'UNKNOWN')
      }),
      extra: stryMutAct_9fa48("1016") ? {} : (stryCov_9fa48("1016"), {
        fallbackMessage
      })
    }));
    return wrapped;
  }
};

/**
 * Lightweight error reporter — sends to Sentry WITHOUT wrapping or re-throwing.
 * Use in catch blocks that already handle the error (toast, state, etc.)
 * to get visibility in Sentry without changing existing behavior.
 *
 * @example
 * catch (err) {
 *   captureError(err, 'TransactionForm.submit');
 *   showToast('Failed to save', 'error');
 * }
 */
export const captureError = (error: unknown, context: string, extra?: Record<string, unknown>): void => {
  if (stryMutAct_9fa48("1017")) {
    {}
  } else {
    stryCov_9fa48("1017");
    const err = error instanceof Error ? error : new Error(String(error));
    Sentry.captureException(err, stryMutAct_9fa48("1018") ? {} : (stryCov_9fa48("1018"), {
      level: AnchorError.isAnchorError(error) ? SENTRY_LEVEL[error.category] : stryMutAct_9fa48("1019") ? "" : (stryCov_9fa48("1019"), 'error'),
      tags: stryMutAct_9fa48("1020") ? {} : (stryCov_9fa48("1020"), {
        context,
        category: AnchorError.isAnchorError(error) ? error.category : stryMutAct_9fa48("1021") ? "" : (stryCov_9fa48("1021"), 'UNKNOWN')
      }),
      extra: stryMutAct_9fa48("1022") ? {} : (stryCov_9fa48("1022"), {
        ...extra,
        originalMessage: err.message
      })
    }));
  }
};