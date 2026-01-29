/**
 * Secure Database Core Utilities
 * Extracted from secureDb.ts per CLAUDE.md §3.2
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
import { doc, collection, type DocumentReference } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
const DEFAULT_TIMEOUT_MS = 5000;
const IS_DEV = stryMutAct_9fa48("9419") ? import.meta.env.VITE_APP_ENV !== 'development' : stryMutAct_9fa48("9418") ? false : stryMutAct_9fa48("9417") ? true : (stryCov_9fa48("9417", "9418", "9419"), import.meta.env.VITE_APP_ENV === (stryMutAct_9fa48("9420") ? "" : (stryCov_9fa48("9420"), 'development')));

/**
 * Log operation in development mode
 */
export const logOp = (operation: string, path: string, data?: unknown) => {
  if (stryMutAct_9fa48("9421")) {
    {}
  } else {
    stryCov_9fa48("9421");
    if (stryMutAct_9fa48("9423") ? false : stryMutAct_9fa48("9422") ? true : (stryCov_9fa48("9422", "9423"), IS_DEV)) console.log(stryMutAct_9fa48("9424") ? `` : (stryCov_9fa48("9424"), `[SecureDb] ${operation}: ${path}`), data ? data : stryMutAct_9fa48("9425") ? "Stryker was here!" : (stryCov_9fa48("9425"), ''));
  }
};

/**
 * Wrap a Firestore operation with timeout handling
 */
export const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS, operation: string): Promise<T> => {
  if (stryMutAct_9fa48("9426")) {
    {}
  } else {
    stryCov_9fa48("9426");
    return new Promise((resolve, reject) => {
      if (stryMutAct_9fa48("9427")) {
        {}
      } else {
        stryCov_9fa48("9427");
        const timer = setTimeout(stryMutAct_9fa48("9428") ? () => undefined : (stryCov_9fa48("9428"), () => reject(new Error(stryMutAct_9fa48("9429") ? `` : (stryCov_9fa48("9429"), `Operation timed out: ${operation}`)))), timeoutMs);
        promise.then(result => {
          if (stryMutAct_9fa48("9430")) {
            {}
          } else {
            stryCov_9fa48("9430");
            clearTimeout(timer);
            resolve(result);
          }
        }).catch(error => {
          if (stryMutAct_9fa48("9431")) {
            {}
          } else {
            stryCov_9fa48("9431");
            clearTimeout(timer);
            reject(error);
          }
        });
      }
    });
  }
};

/**
 * Map errors to user-friendly messages
 */
export const mapSecureDbError = (error: unknown): string => {
  if (stryMutAct_9fa48("9432")) {
    {}
  } else {
    stryCov_9fa48("9432");
    if (stryMutAct_9fa48("9434") ? false : stryMutAct_9fa48("9433") ? true : (stryCov_9fa48("9433", "9434"), error instanceof Error)) {
      if (stryMutAct_9fa48("9435")) {
        {}
      } else {
        stryCov_9fa48("9435");
        if (stryMutAct_9fa48("9437") ? false : stryMutAct_9fa48("9436") ? true : (stryCov_9fa48("9436", "9437"), error.message.includes(stryMutAct_9fa48("9438") ? "" : (stryCov_9fa48("9438"), 'timed out')))) return stryMutAct_9fa48("9439") ? "" : (stryCov_9fa48("9439"), 'Service temporarily unavailable. Please try again.');
        if (stryMutAct_9fa48("9441") ? false : stryMutAct_9fa48("9440") ? true : (stryCov_9fa48("9440", "9441"), error.message.includes(stryMutAct_9fa48("9442") ? "" : (stryCov_9fa48("9442"), 'permission-denied')))) return stryMutAct_9fa48("9443") ? "" : (stryCov_9fa48("9443"), 'Not found');
        if (stryMutAct_9fa48("9445") ? false : stryMutAct_9fa48("9444") ? true : (stryCov_9fa48("9444", "9445"), error.message.includes(stryMutAct_9fa48("9446") ? "" : (stryCov_9fa48("9446"), 'not-found')))) return stryMutAct_9fa48("9447") ? "" : (stryCov_9fa48("9447"), 'Not found');
      }
    }
    return stryMutAct_9fa48("9448") ? "" : (stryCov_9fa48("9448"), 'An unexpected error occurred. Please try again.');
  }
};

/**
 * Get a document reference for a user's data
 */
export const getUserDocRef = (userId: string, ...path: string[]): DocumentReference => {
  if (stryMutAct_9fa48("9449")) {
    {}
  } else {
    stryCov_9fa48("9449");
    return doc(db, stryMutAct_9fa48("9450") ? "" : (stryCov_9fa48("9450"), 'artifacts'), APP_ID, stryMutAct_9fa48("9451") ? "" : (stryCov_9fa48("9451"), 'users'), userId, ...path);
  }
};

/**
 * Get a collection reference for a user's data
 */
export const getUserCollectionPath = (userId: string, collectionName: string) => {
  if (stryMutAct_9fa48("9452")) {
    {}
  } else {
    stryCov_9fa48("9452");
    return collection(db, stryMutAct_9fa48("9453") ? "" : (stryCov_9fa48("9453"), 'artifacts'), APP_ID, stryMutAct_9fa48("9454") ? "" : (stryCov_9fa48("9454"), 'users'), userId, collectionName);
  }
};