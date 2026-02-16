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
const IS_DEV = stryMutAct_9fa48("1882") ? import.meta.env.VITE_APP_ENV !== 'development' : stryMutAct_9fa48("1881") ? false : stryMutAct_9fa48("1880") ? true : (stryCov_9fa48("1880", "1881", "1882"), import.meta.env.VITE_APP_ENV === (stryMutAct_9fa48("1883") ? "" : (stryCov_9fa48("1883"), 'development')));

/**
 * Log operation in development mode
 */
export const logOp = (operation: string, path: string, data?: unknown) => {
  if (stryMutAct_9fa48("1884")) {
    {}
  } else {
    stryCov_9fa48("1884");
    if (stryMutAct_9fa48("1886") ? false : stryMutAct_9fa48("1885") ? true : (stryCov_9fa48("1885", "1886"), IS_DEV)) console.log(stryMutAct_9fa48("1887") ? `` : (stryCov_9fa48("1887"), `[SecureDb] ${operation}: ${path}`), data ? data : stryMutAct_9fa48("1888") ? "Stryker was here!" : (stryCov_9fa48("1888"), ''));
  }
};

/**
 * Wrap a Firestore operation with timeout handling
 */
export const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS, operation: string): Promise<T> => {
  if (stryMutAct_9fa48("1889")) {
    {}
  } else {
    stryCov_9fa48("1889");
    return new Promise((resolve, reject) => {
      if (stryMutAct_9fa48("1890")) {
        {}
      } else {
        stryCov_9fa48("1890");
        const timer = setTimeout(stryMutAct_9fa48("1891") ? () => undefined : (stryCov_9fa48("1891"), () => reject(new Error(stryMutAct_9fa48("1892") ? `` : (stryCov_9fa48("1892"), `Operation timed out: ${operation}`)))), timeoutMs);
        promise.then(result => {
          if (stryMutAct_9fa48("1893")) {
            {}
          } else {
            stryCov_9fa48("1893");
            clearTimeout(timer);
            resolve(result);
          }
        }).catch(error => {
          if (stryMutAct_9fa48("1894")) {
            {}
          } else {
            stryCov_9fa48("1894");
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
  if (stryMutAct_9fa48("1895")) {
    {}
  } else {
    stryCov_9fa48("1895");
    if (stryMutAct_9fa48("1897") ? false : stryMutAct_9fa48("1896") ? true : (stryCov_9fa48("1896", "1897"), error instanceof Error)) {
      if (stryMutAct_9fa48("1898")) {
        {}
      } else {
        stryCov_9fa48("1898");
        if (stryMutAct_9fa48("1900") ? false : stryMutAct_9fa48("1899") ? true : (stryCov_9fa48("1899", "1900"), error.message.includes(stryMutAct_9fa48("1901") ? "" : (stryCov_9fa48("1901"), 'timed out')))) return stryMutAct_9fa48("1902") ? "" : (stryCov_9fa48("1902"), 'Service temporarily unavailable. Please try again.');
        if (stryMutAct_9fa48("1904") ? false : stryMutAct_9fa48("1903") ? true : (stryCov_9fa48("1903", "1904"), error.message.includes(stryMutAct_9fa48("1905") ? "" : (stryCov_9fa48("1905"), 'permission-denied')))) return stryMutAct_9fa48("1906") ? "" : (stryCov_9fa48("1906"), 'Not found');
        if (stryMutAct_9fa48("1908") ? false : stryMutAct_9fa48("1907") ? true : (stryCov_9fa48("1907", "1908"), error.message.includes(stryMutAct_9fa48("1909") ? "" : (stryCov_9fa48("1909"), 'not-found')))) return stryMutAct_9fa48("1910") ? "" : (stryCov_9fa48("1910"), 'Not found');
      }
    }
    return stryMutAct_9fa48("1911") ? "" : (stryCov_9fa48("1911"), 'An unexpected error occurred. Please try again.');
  }
};

/**
 * Get a document reference for a user's data
 */
export const getUserDocRef = (userId: string, ...path: string[]): DocumentReference => {
  if (stryMutAct_9fa48("1912")) {
    {}
  } else {
    stryCov_9fa48("1912");
    return doc(db, stryMutAct_9fa48("1913") ? "" : (stryCov_9fa48("1913"), 'artifacts'), APP_ID, stryMutAct_9fa48("1914") ? "" : (stryCov_9fa48("1914"), 'users'), userId, ...path);
  }
};

/**
 * Get a collection reference for a user's data
 */
export const getUserCollectionPath = (userId: string, collectionName: string) => {
  if (stryMutAct_9fa48("1915")) {
    {}
  } else {
    stryCov_9fa48("1915");
    return collection(db, stryMutAct_9fa48("1916") ? "" : (stryCov_9fa48("1916"), 'artifacts'), APP_ID, stryMutAct_9fa48("1917") ? "" : (stryCov_9fa48("1917"), 'users'), userId, collectionName);
  }
};