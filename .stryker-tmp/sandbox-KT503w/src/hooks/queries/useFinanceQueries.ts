/**
 * Finance Queries - Handles data fetching for own accounts/transactions only
 * 
 * Family member shared data is handled by useSharedAccounts hook separately
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { financeApi } from '../../api/FinanceApi';
import type { AnchorTransaction, AnchorAccount } from '../../types';
export const FINANCE_KEYS = stryMutAct_9fa48("6596") ? {} : (stryCov_9fa48("6596"), {
  all: ['finance'] as const,
  transactions: stryMutAct_9fa48("6597") ? () => undefined : (stryCov_9fa48("6597"), (userId: string, start: string, end: string) => [...FINANCE_KEYS.all, 'transactions', userId, {
    start,
    end
  }] as const),
  recentTransactions: stryMutAct_9fa48("6598") ? () => undefined : (stryCov_9fa48("6598"), (userId: string, limitCount: number) => [...FINANCE_KEYS.all, 'recentTransactions', userId, limitCount] as const),
  accounts: stryMutAct_9fa48("6599") ? () => undefined : (stryCov_9fa48("6599"), (userId: string) => [...FINANCE_KEYS.all, 'accounts', userId] as const)
});

/**
 * Query own transactions for a date range
 */
export const useTransactionsQuery = (userId: string | undefined, start: string, end: string) => {
  if (stryMutAct_9fa48("6600")) {
    {}
  } else {
    stryCov_9fa48("6600");
    const queryClient = useQueryClient();
    const queryKey = useMemo(stryMutAct_9fa48("6601") ? () => undefined : (stryCov_9fa48("6601"), () => FINANCE_KEYS.transactions(stryMutAct_9fa48("6604") ? userId && '' : stryMutAct_9fa48("6603") ? false : stryMutAct_9fa48("6602") ? true : (stryCov_9fa48("6602", "6603", "6604"), userId || (stryMutAct_9fa48("6605") ? "Stryker was here!" : (stryCov_9fa48("6605"), ''))), start, end)), stryMutAct_9fa48("6606") ? [] : (stryCov_9fa48("6606"), [userId, start, end]));
    useEffect(() => {
      if (stryMutAct_9fa48("6607")) {
        {}
      } else {
        stryCov_9fa48("6607");
        if (stryMutAct_9fa48("6610") ? false : stryMutAct_9fa48("6609") ? true : stryMutAct_9fa48("6608") ? userId : (stryCov_9fa48("6608", "6609", "6610"), !userId)) return;
        const unsubscribe = financeApi.subscribeToTransactions(userId, start, end, stryMutAct_9fa48("6611") ? () => undefined : (stryCov_9fa48("6611"), data => queryClient.setQueryData(queryKey, data)), stryMutAct_9fa48("6612") ? () => undefined : (stryCov_9fa48("6612"), error => console.error(stryMutAct_9fa48("6613") ? "" : (stryCov_9fa48("6613"), "Transactions Query Error:"), error)));
        return stryMutAct_9fa48("6614") ? () => undefined : (stryCov_9fa48("6614"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("6615") ? [] : (stryCov_9fa48("6615"), [userId, start, end, queryClient, queryKey]));
    return useQuery<AnchorTransaction[]>(stryMutAct_9fa48("6616") ? {} : (stryCov_9fa48("6616"), {
      queryKey,
      queryFn: stryMutAct_9fa48("6617") ? () => undefined : (stryCov_9fa48("6617"), () => Promise.resolve(stryMutAct_9fa48("6618") ? ["Stryker was here"] : (stryCov_9fa48("6618"), []))),
      enabled: stryMutAct_9fa48("6619") ? !userId : (stryCov_9fa48("6619"), !(stryMutAct_9fa48("6620") ? userId : (stryCov_9fa48("6620"), !userId))),
      staleTime: Infinity,
      refetchOnMount: stryMutAct_9fa48("6621") ? true : (stryCov_9fa48("6621"), false),
      refetchOnWindowFocus: stryMutAct_9fa48("6622") ? true : (stryCov_9fa48("6622"), false)
    }));
  }
};

/**
 * Query own accounts
 */
export const useAccountsQuery = (userId: string | undefined) => {
  if (stryMutAct_9fa48("6623")) {
    {}
  } else {
    stryCov_9fa48("6623");
    const queryClient = useQueryClient();
    const queryKey = useMemo(stryMutAct_9fa48("6624") ? () => undefined : (stryCov_9fa48("6624"), () => FINANCE_KEYS.accounts(stryMutAct_9fa48("6627") ? userId && '' : stryMutAct_9fa48("6626") ? false : stryMutAct_9fa48("6625") ? true : (stryCov_9fa48("6625", "6626", "6627"), userId || (stryMutAct_9fa48("6628") ? "Stryker was here!" : (stryCov_9fa48("6628"), ''))))), stryMutAct_9fa48("6629") ? [] : (stryCov_9fa48("6629"), [userId]));
    useEffect(() => {
      if (stryMutAct_9fa48("6630")) {
        {}
      } else {
        stryCov_9fa48("6630");
        if (stryMutAct_9fa48("6633") ? false : stryMutAct_9fa48("6632") ? true : stryMutAct_9fa48("6631") ? userId : (stryCov_9fa48("6631", "6632", "6633"), !userId)) return;
        const unsubscribe = financeApi.subscribeToAccounts(userId, stryMutAct_9fa48("6634") ? () => undefined : (stryCov_9fa48("6634"), data => queryClient.setQueryData(queryKey, data)), stryMutAct_9fa48("6635") ? () => undefined : (stryCov_9fa48("6635"), error => console.error(stryMutAct_9fa48("6636") ? "" : (stryCov_9fa48("6636"), "Accounts Query Error:"), error)));
        return stryMutAct_9fa48("6637") ? () => undefined : (stryCov_9fa48("6637"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("6638") ? [] : (stryCov_9fa48("6638"), [userId, queryClient, queryKey]));
    return useQuery<AnchorAccount[]>(stryMutAct_9fa48("6639") ? {} : (stryCov_9fa48("6639"), {
      queryKey,
      queryFn: stryMutAct_9fa48("6640") ? () => undefined : (stryCov_9fa48("6640"), () => Promise.resolve(stryMutAct_9fa48("6641") ? ["Stryker was here"] : (stryCov_9fa48("6641"), []))),
      enabled: stryMutAct_9fa48("6642") ? !userId : (stryCov_9fa48("6642"), !(stryMutAct_9fa48("6643") ? userId : (stryCov_9fa48("6643"), !userId))),
      staleTime: Infinity,
      refetchOnMount: stryMutAct_9fa48("6644") ? true : (stryCov_9fa48("6644"), false),
      refetchOnWindowFocus: stryMutAct_9fa48("6645") ? true : (stryCov_9fa48("6645"), false)
    }));
  }
};

/**
 * Query recent transactions (for dashboard)
 */
export const useRecentTransactionsQuery = (userId: string | undefined, limitCount: number = 5) => {
  if (stryMutAct_9fa48("6646")) {
    {}
  } else {
    stryCov_9fa48("6646");
    const queryClient = useQueryClient();
    const queryKey = useMemo(stryMutAct_9fa48("6647") ? () => undefined : (stryCov_9fa48("6647"), () => FINANCE_KEYS.recentTransactions(stryMutAct_9fa48("6650") ? userId && '' : stryMutAct_9fa48("6649") ? false : stryMutAct_9fa48("6648") ? true : (stryCov_9fa48("6648", "6649", "6650"), userId || (stryMutAct_9fa48("6651") ? "Stryker was here!" : (stryCov_9fa48("6651"), ''))), limitCount)), stryMutAct_9fa48("6652") ? [] : (stryCov_9fa48("6652"), [userId, limitCount]));
    useEffect(() => {
      if (stryMutAct_9fa48("6653")) {
        {}
      } else {
        stryCov_9fa48("6653");
        if (stryMutAct_9fa48("6656") ? false : stryMutAct_9fa48("6655") ? true : stryMutAct_9fa48("6654") ? userId : (stryCov_9fa48("6654", "6655", "6656"), !userId)) return;
        const unsubscribe = financeApi.subscribeToRecentTransactions(userId, limitCount, stryMutAct_9fa48("6657") ? () => undefined : (stryCov_9fa48("6657"), data => queryClient.setQueryData(queryKey, data)), stryMutAct_9fa48("6658") ? () => undefined : (stryCov_9fa48("6658"), error => console.error(stryMutAct_9fa48("6659") ? "" : (stryCov_9fa48("6659"), "Recent Transactions Query Error:"), error)));
        return stryMutAct_9fa48("6660") ? () => undefined : (stryCov_9fa48("6660"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("6661") ? [] : (stryCov_9fa48("6661"), [userId, limitCount, queryClient, queryKey]));
    return useQuery<AnchorTransaction[]>(stryMutAct_9fa48("6662") ? {} : (stryCov_9fa48("6662"), {
      queryKey,
      queryFn: stryMutAct_9fa48("6663") ? () => undefined : (stryCov_9fa48("6663"), () => Promise.resolve(stryMutAct_9fa48("6664") ? ["Stryker was here"] : (stryCov_9fa48("6664"), []))),
      enabled: stryMutAct_9fa48("6665") ? !userId : (stryCov_9fa48("6665"), !(stryMutAct_9fa48("6666") ? userId : (stryCov_9fa48("6666"), !userId))),
      staleTime: Infinity,
      refetchOnMount: stryMutAct_9fa48("6667") ? true : (stryCov_9fa48("6667"), false),
      refetchOnWindowFocus: stryMutAct_9fa48("6668") ? true : (stryCov_9fa48("6668"), false)
    }));
  }
};

// REMOVED: useFamilyTransactionsQuery - use useSharedAccounts instead
// REMOVED: useFamilyAccountsQuery - use useSharedAccounts instead
// REMOVED: useRecentFamilyTransactionsQuery - use useSharedAccounts instead