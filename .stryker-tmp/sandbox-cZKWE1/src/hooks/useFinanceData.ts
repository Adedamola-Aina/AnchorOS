/**
 * useFinanceData Hook
 * 
 * Handles finance data fetching, combination of own and shared data,
 * and memoized calculations for net worth and cash flow.
 * 
 * @module hooks/useFinanceData
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
import { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import type { AnchorTransaction, AnchorAccount } from '../types';
import { calculateNetWorth } from '../utils/finance';
import { getCashFlowAnalysis } from '../utils/financeInsights';
import { useTransactionsQuery, useAccountsQuery, useRecentTransactionsQuery } from './queries/useFinanceQueries';
import { useSharedAccounts } from './useSharedAccounts';
import { useFamilySharing } from './useFamilySharing';

/** 
 * Get the effective date for sorting/display
 * Uses transactionDate (actual date of transaction) if available,
 * otherwise falls back to date (entry creation date)
 */
const getEffectiveDate = (tx: {
  transactionDate?: string | Date;
  date?: string | Date;
}): number => {
  if (stryMutAct_9fa48("7362")) {
    {}
  } else {
    stryCov_9fa48("7362");
    const d = stryMutAct_9fa48("7365") ? tx.transactionDate && tx.date : stryMutAct_9fa48("7364") ? false : stryMutAct_9fa48("7363") ? true : (stryCov_9fa48("7363", "7364", "7365"), tx.transactionDate || tx.date);
    if (stryMutAct_9fa48("7368") ? false : stryMutAct_9fa48("7367") ? true : stryMutAct_9fa48("7366") ? d : (stryCov_9fa48("7366", "7367", "7368"), !d)) return 0;
    if (stryMutAct_9fa48("7370") ? false : stryMutAct_9fa48("7369") ? true : (stryCov_9fa48("7369", "7370"), d instanceof Date)) return d.getTime();
    return new Date(d).getTime();
  }
};
export const useFinanceData = (user: User | null) => {
  if (stryMutAct_9fa48("7371")) {
    {}
  } else {
    stryCov_9fa48("7371");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const queryClient = useQueryClient();
    const start = useMemo(stryMutAct_9fa48("7372") ? () => undefined : (stryCov_9fa48("7372"), () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString()), stryMutAct_9fa48("7373") ? [] : (stryCov_9fa48("7373"), [currentMonth]));
    const end = useMemo(stryMutAct_9fa48("7374") ? () => undefined : (stryCov_9fa48("7374"), () => new Date(currentMonth.getFullYear(), stryMutAct_9fa48("7375") ? currentMonth.getMonth() - 1 : (stryCov_9fa48("7375"), currentMonth.getMonth() + 1), 0, 23, 59, 59, 999).toISOString()), stryMutAct_9fa48("7376") ? [] : (stryCov_9fa48("7376"), [currentMonth]));

    // Get family connection status
    const {
      isOwner,
      connection
    } = useFamilySharing(stryMutAct_9fa48("7377") ? user.uid : (stryCov_9fa48("7377"), user?.uid));
    const hasConnection = stryMutAct_9fa48("7378") ? !connection : (stryCov_9fa48("7378"), !(stryMutAct_9fa48("7379") ? connection : (stryCov_9fa48("7379"), !connection)));

    // Own data
    const {
      data: ownTransactions = stryMutAct_9fa48("7380") ? ["Stryker was here"] : (stryCov_9fa48("7380"), []),
      isLoading: loadingOwnTx
    } = useTransactionsQuery(stryMutAct_9fa48("7381") ? user.uid : (stryCov_9fa48("7381"), user?.uid), start, end);
    const {
      data: ownAccounts = stryMutAct_9fa48("7382") ? ["Stryker was here"] : (stryCov_9fa48("7382"), []),
      isLoading: loadingOwnAcc
    } = useAccountsQuery(stryMutAct_9fa48("7383") ? user.uid : (stryCov_9fa48("7383"), user?.uid));
    const {
      data: recentOwn = stryMutAct_9fa48("7384") ? ["Stryker was here"] : (stryCov_9fa48("7384"), [])
    } = useRecentTransactionsQuery(stryMutAct_9fa48("7385") ? user.uid : (stryCov_9fa48("7385"), user?.uid), 20);

    // Shared accounts (only for non-owners with active connection)
    const shouldLoadShared = stryMutAct_9fa48("7388") ? hasConnection || !isOwner : stryMutAct_9fa48("7387") ? false : stryMutAct_9fa48("7386") ? true : (stryCov_9fa48("7386", "7387", "7388"), hasConnection && (stryMutAct_9fa48("7389") ? isOwner : (stryCov_9fa48("7389"), !isOwner)));
    const {
      sharedAccounts,
      sharedTransactions: allSharedTransactions,
      loading: loadingShared
    } = useSharedAccounts(stryMutAct_9fa48("7390") ? user.uid : (stryCov_9fa48("7390"), user?.uid), shouldLoadShared);

    // Filter shared transactions by current month
    const sharedTransactions = useMemo(() => {
      if (stryMutAct_9fa48("7391")) {
        {}
      } else {
        stryCov_9fa48("7391");
        if (stryMutAct_9fa48("7394") ? !shouldLoadShared && !Array.isArray(allSharedTransactions) : stryMutAct_9fa48("7393") ? false : stryMutAct_9fa48("7392") ? true : (stryCov_9fa48("7392", "7393", "7394"), (stryMutAct_9fa48("7395") ? shouldLoadShared : (stryCov_9fa48("7395"), !shouldLoadShared)) || (stryMutAct_9fa48("7396") ? Array.isArray(allSharedTransactions) : (stryCov_9fa48("7396"), !Array.isArray(allSharedTransactions))))) return stryMutAct_9fa48("7397") ? ["Stryker was here"] : (stryCov_9fa48("7397"), []);
        return stryMutAct_9fa48("7398") ? allSharedTransactions : (stryCov_9fa48("7398"), allSharedTransactions.filter(tx => {
          if (stryMutAct_9fa48("7399")) {
            {}
          } else {
            stryCov_9fa48("7399");
            const txDate = new Date(tx.date);
            const startDate = new Date(start);
            const endDate = new Date(end);
            return stryMutAct_9fa48("7402") ? txDate >= startDate || txDate <= endDate : stryMutAct_9fa48("7401") ? false : stryMutAct_9fa48("7400") ? true : (stryCov_9fa48("7400", "7401", "7402"), (stryMutAct_9fa48("7405") ? txDate < startDate : stryMutAct_9fa48("7404") ? txDate > startDate : stryMutAct_9fa48("7403") ? true : (stryCov_9fa48("7403", "7404", "7405"), txDate >= startDate)) && (stryMutAct_9fa48("7408") ? txDate > endDate : stryMutAct_9fa48("7407") ? txDate < endDate : stryMutAct_9fa48("7406") ? true : (stryCov_9fa48("7406", "7407", "7408"), txDate <= endDate)));
          }
        }));
      }
    }, stryMutAct_9fa48("7409") ? [] : (stryCov_9fa48("7409"), [allSharedTransactions, start, end, shouldLoadShared]));

    // Combine own and shared data with O(n) deduplication
    const transactions = useMemo(() => {
      if (stryMutAct_9fa48("7410")) {
        {}
      } else {
        stryCov_9fa48("7410");
        const all = stryMutAct_9fa48("7411") ? [...ownTransactions, ...sharedTransactions] : (stryCov_9fa48("7411"), (stryMutAct_9fa48("7412") ? [] : (stryCov_9fa48("7412"), [...ownTransactions, ...sharedTransactions])).filter(stryMutAct_9fa48("7413") ? () => undefined : (stryCov_9fa48("7413"), t => stryMutAct_9fa48("7414") ? t.isSoftDeleted : (stryCov_9fa48("7414"), !t.isSoftDeleted))));
        const uniqueMap = new Map<string, AnchorTransaction>();
        for (const tx of all) {
          if (stryMutAct_9fa48("7415")) {
            {}
          } else {
            stryCov_9fa48("7415");
            if (stryMutAct_9fa48("7418") ? false : stryMutAct_9fa48("7417") ? true : stryMutAct_9fa48("7416") ? uniqueMap.has(tx.id) : (stryCov_9fa48("7416", "7417", "7418"), !uniqueMap.has(tx.id))) uniqueMap.set(tx.id, tx);
          }
        }
        // Sort by effective date (transactionDate if available, else entry date)
        return stryMutAct_9fa48("7419") ? Array.from(uniqueMap.values()) : (stryCov_9fa48("7419"), Array.from(uniqueMap.values()).sort(stryMutAct_9fa48("7420") ? () => undefined : (stryCov_9fa48("7420"), (a, b) => stryMutAct_9fa48("7421") ? getEffectiveDate(b) + getEffectiveDate(a) : (stryCov_9fa48("7421"), getEffectiveDate(b) - getEffectiveDate(a)))));
      }
    }, stryMutAct_9fa48("7422") ? [] : (stryCov_9fa48("7422"), [ownTransactions, sharedTransactions]));
    const accounts = useMemo(() => {
      if (stryMutAct_9fa48("7423")) {
        {}
      } else {
        stryCov_9fa48("7423");
        const all = stryMutAct_9fa48("7424") ? [] : (stryCov_9fa48("7424"), [...ownAccounts, ...sharedAccounts]);
        const uniqueMap = new Map<string, AnchorAccount>();
        for (const acc of all) {
          if (stryMutAct_9fa48("7425")) {
            {}
          } else {
            stryCov_9fa48("7425");
            if (stryMutAct_9fa48("7428") ? false : stryMutAct_9fa48("7427") ? true : stryMutAct_9fa48("7426") ? uniqueMap.has(acc.id) : (stryCov_9fa48("7426", "7427", "7428"), !uniqueMap.has(acc.id))) uniqueMap.set(acc.id, acc);
          }
        }
        return Array.from(uniqueMap.values());
      }
    }, stryMutAct_9fa48("7429") ? [] : (stryCov_9fa48("7429"), [ownAccounts, sharedAccounts]));
    const loadingFinance = stryMutAct_9fa48("7432") ? (loadingOwnTx || loadingOwnAcc) && shouldLoadShared && loadingShared : stryMutAct_9fa48("7431") ? false : stryMutAct_9fa48("7430") ? true : (stryCov_9fa48("7430", "7431", "7432"), (stryMutAct_9fa48("7434") ? loadingOwnTx && loadingOwnAcc : stryMutAct_9fa48("7433") ? false : (stryCov_9fa48("7433", "7434"), loadingOwnTx || loadingOwnAcc)) || (stryMutAct_9fa48("7436") ? shouldLoadShared || loadingShared : stryMutAct_9fa48("7435") ? false : (stryCov_9fa48("7435", "7436"), shouldLoadShared && loadingShared)));
    const recentActivity = useMemo(() => {
      if (stryMutAct_9fa48("7437")) {
        {}
      } else {
        stryCov_9fa48("7437");
        const sharedTx = Array.isArray(allSharedTransactions) ? allSharedTransactions : stryMutAct_9fa48("7438") ? ["Stryker was here"] : (stryCov_9fa48("7438"), []);
        const ownTx = Array.isArray(recentOwn) ? recentOwn : stryMutAct_9fa48("7439") ? ["Stryker was here"] : (stryCov_9fa48("7439"), []);
        const combined = stryMutAct_9fa48("7441") ? [...ownTx, ...sharedTx.slice(0, 20)].sort((a, b) => getEffectiveDate(b) - getEffectiveDate(a)) : stryMutAct_9fa48("7440") ? [...ownTx, ...sharedTx.slice(0, 20)].filter(t => t && !t.isSoftDeleted) : (stryCov_9fa48("7440", "7441"), (stryMutAct_9fa48("7442") ? [] : (stryCov_9fa48("7442"), [...ownTx, ...(stryMutAct_9fa48("7443") ? sharedTx : (stryCov_9fa48("7443"), sharedTx.slice(0, 20)))])).filter(stryMutAct_9fa48("7444") ? () => undefined : (stryCov_9fa48("7444"), t => stryMutAct_9fa48("7447") ? t || !t.isSoftDeleted : stryMutAct_9fa48("7446") ? false : stryMutAct_9fa48("7445") ? true : (stryCov_9fa48("7445", "7446", "7447"), t && (stryMutAct_9fa48("7448") ? t.isSoftDeleted : (stryCov_9fa48("7448"), !t.isSoftDeleted))))).sort(stryMutAct_9fa48("7449") ? () => undefined : (stryCov_9fa48("7449"), (a, b) => stryMutAct_9fa48("7450") ? getEffectiveDate(b) + getEffectiveDate(a) : (stryCov_9fa48("7450"), getEffectiveDate(b) - getEffectiveDate(a)))));
        const seen = new Set<string>();
        const unique: AnchorTransaction[] = stryMutAct_9fa48("7451") ? ["Stryker was here"] : (stryCov_9fa48("7451"), []);
        for (const tx of combined) {
          if (stryMutAct_9fa48("7452")) {
            {}
          } else {
            stryCov_9fa48("7452");
            if (stryMutAct_9fa48("7455") ? false : stryMutAct_9fa48("7454") ? true : stryMutAct_9fa48("7453") ? seen.has(tx.id) : (stryCov_9fa48("7453", "7454", "7455"), !seen.has(tx.id))) {
              if (stryMutAct_9fa48("7456")) {
                {}
              } else {
                stryCov_9fa48("7456");
                seen.add(tx.id);
                unique.push(tx);
              }
            }
          }
        }
        return stryMutAct_9fa48("7457") ? unique : (stryCov_9fa48("7457"), unique.slice(0, 5));
      }
    }, stryMutAct_9fa48("7458") ? [] : (stryCov_9fa48("7458"), [recentOwn, allSharedTransactions]));
    const netWorth = useMemo(() => {
      if (stryMutAct_9fa48("7459")) {
        {}
      } else {
        stryCov_9fa48("7459");
        const activeAccounts = stryMutAct_9fa48("7460") ? accounts : (stryCov_9fa48("7460"), accounts.filter(stryMutAct_9fa48("7461") ? () => undefined : (stryCov_9fa48("7461"), a => stryMutAct_9fa48("7462") ? a.isArchived : (stryCov_9fa48("7462"), !a.isArchived))));
        return calculateNetWorth(activeAccounts);
      }
    }, stryMutAct_9fa48("7463") ? [] : (stryCov_9fa48("7463"), [accounts]));
    const cashFlow = useMemo(stryMutAct_9fa48("7464") ? () => undefined : (stryCov_9fa48("7464"), () => getCashFlowAnalysis(transactions)), stryMutAct_9fa48("7465") ? [] : (stryCov_9fa48("7465"), [transactions]));

    // Navigation helpers
    const nextMonth = stryMutAct_9fa48("7466") ? () => undefined : (stryCov_9fa48("7466"), (() => {
      const nextMonth = () => setCurrentMonth(prev => {
        if (stryMutAct_9fa48("7467")) {
          {}
        } else {
          stryCov_9fa48("7467");
          const d = new Date(prev);
          stryMutAct_9fa48("7468") ? d.setFullYear(d.getMonth() + 1) : (stryCov_9fa48("7468"), d.setMonth(stryMutAct_9fa48("7469") ? d.getMonth() - 1 : (stryCov_9fa48("7469"), d.getMonth() + 1)));
          return d;
        }
      });
      return nextMonth;
    })());
    const prevMonth = stryMutAct_9fa48("7470") ? () => undefined : (stryCov_9fa48("7470"), (() => {
      const prevMonth = () => setCurrentMonth(prev => {
        if (stryMutAct_9fa48("7471")) {
          {}
        } else {
          stryCov_9fa48("7471");
          const d = new Date(prev);
          stryMutAct_9fa48("7472") ? d.setFullYear(d.getMonth() - 1) : (stryCov_9fa48("7472"), d.setMonth(stryMutAct_9fa48("7473") ? d.getMonth() + 1 : (stryCov_9fa48("7473"), d.getMonth() - 1)));
          return d;
        }
      });
      return prevMonth;
    })());
    const jumpToMonth = stryMutAct_9fa48("7474") ? () => undefined : (stryCov_9fa48("7474"), (() => {
      const jumpToMonth = (date: Date) => setCurrentMonth(date);
      return jumpToMonth;
    })());

    // Refetch all finance data (for pull-to-refresh)
    const refetch = useCallback(async () => {
      if (stryMutAct_9fa48("7475")) {
        {}
      } else {
        stryCov_9fa48("7475");
        await queryClient.invalidateQueries(stryMutAct_9fa48("7476") ? {} : (stryCov_9fa48("7476"), {
          queryKey: stryMutAct_9fa48("7477") ? [] : (stryCov_9fa48("7477"), [stryMutAct_9fa48("7478") ? "" : (stryCov_9fa48("7478"), 'finance')])
        }));
      }
    }, stryMutAct_9fa48("7479") ? [] : (stryCov_9fa48("7479"), [queryClient]));
    return stryMutAct_9fa48("7480") ? {} : (stryCov_9fa48("7480"), {
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
    });
  }
};