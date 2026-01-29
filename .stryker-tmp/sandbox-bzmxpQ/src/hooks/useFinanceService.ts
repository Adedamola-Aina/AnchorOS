/**
 * useFinanceService Hook
 * 
 * Unified facade combining data retrieval (useFinanceData) and
 * mutation operations (useFinanceOperations) for backward compatibility.
 * 
 * @module hooks/useFinanceService
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
import type { User } from 'firebase/auth';
import type { AnchorTransaction } from '../types';
import { useFinanceData } from './useFinanceData';
import { useFinanceOperations } from './useFinanceOperations';

/**
 * Extended transaction type with audit fields
 */
export interface ExtendedTransaction extends AnchorTransaction {
  createdBy?: string;
  lastEditedBy?: string;
  isSoftDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
  linkId?: string;
  accountOwnerId?: string;
}

/**
 * Combined finance service hook providing both data and operations
 * 
 * @param user - Firebase user object
 * @param _familyMemberId - Deprecated parameter, kept for compatibility
 * @param userName - Display name for activity logging
 */
export const useFinanceService = (user: User | null, _familyMemberId?: string | null, userName: string = stryMutAct_9fa48("7668") ? "" : (stryCov_9fa48("7668"), 'User')) => {
  if (stryMutAct_9fa48("7669")) {
    {}
  } else {
    stryCov_9fa48("7669");
    // Data layer
    const {
      transactions,
      accounts,
      loadingFinance,
      currentMonth,
      nextMonth,
      prevMonth,
      jumpToMonth,
      netWorth,
      recentActivity,
      cashFlow,
      refetch
    } = useFinanceData(user);

    // Operations layer
    const {
      addAccount,
      deleteAccount,
      renameAccount,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      restoreTransaction,
      convertCurrency
    } = useFinanceOperations(user, userName, accounts, transactions);
    return stryMutAct_9fa48("7670") ? {} : (stryCov_9fa48("7670"), {
      // Data
      transactions,
      accounts,
      loadingFinance,
      currentMonth,
      netWorth,
      recentActivity,
      cashFlow,
      refetch,
      // Navigation
      nextMonth,
      prevMonth,
      jumpToMonth,
      // Account operations
      addAccount,
      deleteAccount,
      renameAccount,
      // Transaction operations
      addTransaction,
      deleteTransaction,
      updateTransaction,
      restoreTransaction,
      convertCurrency
    });
  }
};