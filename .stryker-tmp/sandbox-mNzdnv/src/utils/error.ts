/**
 * Custom error class for Anchor OS application
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
export type ErrorCategory = 'VALIDATION' | 'PERMISSION' | 'NETWORK' | 'AUTH' | 'DATABASE' | 'UNKNOWN';
export class AnchorError extends Error {
  public category: ErrorCategory;
  public userMessage: string;
  public originalError?: any;
  constructor(message: string, category: ErrorCategory = stryMutAct_9fa48("8679") ? "" : (stryCov_9fa48("8679"), 'UNKNOWN'), originalError?: any) {
    if (stryMutAct_9fa48("8680")) {
      {}
    } else {
      stryCov_9fa48("8680");
      super(message);
      this.name = stryMutAct_9fa48("8681") ? "" : (stryCov_9fa48("8681"), 'AnchorError');
      this.category = category;
      this.userMessage = message;
      this.originalError = originalError;

      // Ensure stack trace is captured correctly
      if (stryMutAct_9fa48("8683") ? false : stryMutAct_9fa48("8682") ? true : (stryCov_9fa48("8682", "8683"), (Error as any).captureStackTrace)) {
        if (stryMutAct_9fa48("8684")) {
          {}
        } else {
          stryCov_9fa48("8684");
          (Error as any).captureStackTrace(this, AnchorError);
        }
      }
    }
  }
  static isAnchorError(error: any): error is AnchorError {
    if (stryMutAct_9fa48("8685")) {
      {}
    } else {
      stryCov_9fa48("8685");
      return error instanceof AnchorError;
    }
  }
}

/**
 * Global error handler utility
 */
export const handleError = (error: any, fallbackMessage: string = stryMutAct_9fa48("8686") ? "" : (stryCov_9fa48("8686"), 'An unexpected error occurred')): AnchorError => {
  if (stryMutAct_9fa48("8687")) {
    {}
  } else {
    stryCov_9fa48("8687");
    if (stryMutAct_9fa48("8689") ? false : stryMutAct_9fa48("8688") ? true : (stryCov_9fa48("8688", "8689"), AnchorError.isAnchorError(error))) {
      if (stryMutAct_9fa48("8690")) {
        {}
      } else {
        stryCov_9fa48("8690");
        console.error(stryMutAct_9fa48("8691") ? `` : (stryCov_9fa48("8691"), `[${error.category}] ${error.message}`), error.originalError);
        return error;
      }
    }
    console.error(stryMutAct_9fa48("8692") ? "" : (stryCov_9fa48("8692"), '[UNKNOWN]'), error);
    return new AnchorError(fallbackMessage, stryMutAct_9fa48("8693") ? "" : (stryCov_9fa48("8693"), 'UNKNOWN'), error);
  }
};