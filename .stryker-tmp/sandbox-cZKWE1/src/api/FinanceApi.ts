/**
 * Finance API Client
 * 
 * Abstraction layer for Finance-related Firestore operations.
 * Decouples direct Firestore keys/queries from React hooks.
 * 
 * @module api/FinanceApi
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
import { collection, onSnapshot, query, where, orderBy, limit, type Unsubscribe } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorTransaction, AnchorAccount } from '../types';
export class FinanceApi {
  private static instance: FinanceApi;

  // Singleton pattern
  public static getInstance(): FinanceApi {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      if (stryMutAct_9fa48("3") ? false : stryMutAct_9fa48("2") ? true : stryMutAct_9fa48("1") ? FinanceApi.instance : (stryCov_9fa48("1", "2", "3"), !FinanceApi.instance)) {
        if (stryMutAct_9fa48("4")) {
          {}
        } else {
          stryCov_9fa48("4");
          FinanceApi.instance = new FinanceApi();
        }
      }
      return FinanceApi.instance;
    }
  }

  /**
   * Subscribe to user's transactions within a date range
   */
  subscribeToTransactions(userId: string, start: string, end: string, onData: (data: AnchorTransaction[]) => void, onError: (error: Error) => void): Unsubscribe {
    if (stryMutAct_9fa48("5")) {
      {}
    } else {
      stryCov_9fa48("5");
      const q = query(collection(db, stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), 'artifacts'), APP_ID, stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), 'users'), userId, stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), 'finance')), where(stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'date'), stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), '>='), start), where(stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), 'date'), stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), '<='), end), orderBy(stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), 'date'), stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), 'desc')), limit(500));
      return onSnapshot(q, stryMutAct_9fa48("15") ? {} : (stryCov_9fa48("15"), {
        includeMetadataChanges: stryMutAct_9fa48("16") ? false : (stryCov_9fa48("16"), true)
      }), snapshot => {
        if (stryMutAct_9fa48("17")) {
          {}
        } else {
          stryCov_9fa48("17");
          const data = snapshot.docs.map(stryMutAct_9fa48("18") ? () => undefined : (stryCov_9fa48("18"), doc => ({
            id: doc.id,
            ...doc.data()
          }) as AnchorTransaction));
          onData(data);
        }
      }, stryMutAct_9fa48("19") ? () => undefined : (stryCov_9fa48("19"), error => onError(error)));
    }
  }

  /**
   * Subscribe to user's accounts
   */
  subscribeToAccounts(userId: string, onData: (data: AnchorAccount[]) => void, onError: (error: Error) => void): Unsubscribe {
    if (stryMutAct_9fa48("20")) {
      {}
    } else {
      stryCov_9fa48("20");
      const q = query(collection(db, stryMutAct_9fa48("21") ? "" : (stryCov_9fa48("21"), 'artifacts'), APP_ID, stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), 'users'), userId, stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), 'accounts')), limit(50));
      return onSnapshot(q, stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
        includeMetadataChanges: stryMutAct_9fa48("25") ? false : (stryCov_9fa48("25"), true)
      }), snapshot => {
        if (stryMutAct_9fa48("26")) {
          {}
        } else {
          stryCov_9fa48("26");
          const data = snapshot.docs.map(stryMutAct_9fa48("27") ? () => undefined : (stryCov_9fa48("27"), doc => ({
            id: doc.id,
            ...doc.data(),
            ownerId: doc.data().ownerId || userId
          }) as AnchorAccount));
          onData(data);
        }
      }, stryMutAct_9fa48("28") ? () => undefined : (stryCov_9fa48("28"), error => onError(error)));
    }
  }

  /**
   * Subscribe to recent transactions
   */
  subscribeToRecentTransactions(userId: string, limitCount: number, onData: (data: AnchorTransaction[]) => void, onError: (error: Error) => void): Unsubscribe {
    if (stryMutAct_9fa48("29")) {
      {}
    } else {
      stryCov_9fa48("29");
      const q = query(collection(db, stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), 'artifacts'), APP_ID, stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), 'users'), userId, stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), 'finance')), orderBy(stryMutAct_9fa48("33") ? "" : (stryCov_9fa48("33"), 'date'), stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), 'desc')), limit(limitCount));
      return onSnapshot(q, stryMutAct_9fa48("35") ? {} : (stryCov_9fa48("35"), {
        includeMetadataChanges: stryMutAct_9fa48("36") ? false : (stryCov_9fa48("36"), true)
      }), snapshot => {
        if (stryMutAct_9fa48("37")) {
          {}
        } else {
          stryCov_9fa48("37");
          const data = snapshot.docs.map(stryMutAct_9fa48("38") ? () => undefined : (stryCov_9fa48("38"), doc => ({
            id: doc.id,
            ...doc.data()
          }) as AnchorTransaction));
          onData(data);
        }
      }, stryMutAct_9fa48("39") ? () => undefined : (stryCov_9fa48("39"), error => onError(error)));
    }
  }
}
export const financeApi = FinanceApi.getInstance();