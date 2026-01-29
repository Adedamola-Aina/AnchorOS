/**
 * Hook for fetching accounts shared with the current user
 * Used by family members (non-owners) to see shared accounts
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
import { useState, useEffect, useCallback, useRef } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { AnchorAccount, AnchorTransaction } from '../types';
import { subscribeToTransactions, subscribeToAccountDetails } from './sharedAccountSubscriptions';
interface SharedAccountFromServer {
  id: string;
  ownerUid: string;
  name: string;
  type: string;
  balanceCents: number;
  currency: 'NGN' | 'USD';
  color?: string;
  scope: 'personal' | 'family';
  sharedAt: string;
  permission?: 'read' | 'transact' | 'manage';
}
interface UseSharedAccountsResult {
  sharedAccounts: AnchorAccount[];
  sharedTransactions: AnchorTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
export function useSharedAccounts(currentUserId: string | undefined, enabled: boolean = stryMutAct_9fa48("7786") ? false : (stryCov_9fa48("7786"), true)): UseSharedAccountsResult {
  if (stryMutAct_9fa48("7787")) {
    {}
  } else {
    stryCov_9fa48("7787");
    const [sharedAccounts, setSharedAccounts] = useState<AnchorAccount[]>(stryMutAct_9fa48("7788") ? ["Stryker was here"] : (stryCov_9fa48("7788"), []));
    const [sharedTransactions, setSharedTransactions] = useState<AnchorTransaction[]>(stryMutAct_9fa48("7789") ? ["Stryker was here"] : (stryCov_9fa48("7789"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("7790") ? true : (stryCov_9fa48("7790"), false));
    const [error, setError] = useState<string | null>(null);

    // Track which owner/account combinations we're subscribed to
    const subscriptionsRef = useRef<Map<string, () => void>>(new Map());
    const fetchSharedAccounts = useCallback(async () => {
      if (stryMutAct_9fa48("7791")) {
        {}
      } else {
        stryCov_9fa48("7791");
        if (stryMutAct_9fa48("7794") ? !currentUserId && !enabled : stryMutAct_9fa48("7793") ? false : stryMutAct_9fa48("7792") ? true : (stryCov_9fa48("7792", "7793", "7794"), (stryMutAct_9fa48("7795") ? currentUserId : (stryCov_9fa48("7795"), !currentUserId)) || (stryMutAct_9fa48("7796") ? enabled : (stryCov_9fa48("7796"), !enabled)))) {
          if (stryMutAct_9fa48("7797")) {
            {}
          } else {
            stryCov_9fa48("7797");
            setSharedAccounts(stryMutAct_9fa48("7798") ? ["Stryker was here"] : (stryCov_9fa48("7798"), []));
            setSharedTransactions(stryMutAct_9fa48("7799") ? ["Stryker was here"] : (stryCov_9fa48("7799"), []));
            setLoading(stryMutAct_9fa48("7800") ? true : (stryCov_9fa48("7800"), false));
            return;
          }
        }
        try {
          if (stryMutAct_9fa48("7801")) {
            {}
          } else {
            stryCov_9fa48("7801");
            setLoading(stryMutAct_9fa48("7802") ? false : (stryCov_9fa48("7802"), true));
            setError(null);
            const functions = getFunctions();
            const getSharedAccounts = httpsCallable<unknown, {
              accounts: SharedAccountFromServer[];
            }>(functions, stryMutAct_9fa48("7803") ? "" : (stryCov_9fa48("7803"), 'getSharedAccountsWithMe'));
            const result = await getSharedAccounts({});
            const accounts = result.data.accounts;

            // Transform to AnchorAccount format
            const transformedAccounts: AnchorAccount[] = accounts.map(stryMutAct_9fa48("7804") ? () => undefined : (stryCov_9fa48("7804"), acc => stryMutAct_9fa48("7805") ? {} : (stryCov_9fa48("7805"), {
              id: acc.id,
              name: acc.name,
              type: acc.type as AnchorAccount['type'],
              currency: acc.currency,
              balanceCents: acc.balanceCents,
              color: stryMutAct_9fa48("7808") ? acc.color && '#6366f1' : stryMutAct_9fa48("7807") ? false : stryMutAct_9fa48("7806") ? true : (stryCov_9fa48("7806", "7807", "7808"), acc.color || (stryMutAct_9fa48("7809") ? "" : (stryCov_9fa48("7809"), '#6366f1'))),
              scope: stryMutAct_9fa48("7810") ? "" : (stryCov_9fa48("7810"), 'family'),
              ownerId: acc.ownerUid,
              sharedWith: stryMutAct_9fa48("7811") ? {} : (stryCov_9fa48("7811"), {
                [currentUserId]: stryMutAct_9fa48("7812") ? {} : (stryCov_9fa48("7812"), {
                  grantedAt: acc.sharedAt,
                  grantedBy: acc.ownerUid,
                  permission: acc.permission
                })
              })
            })));
            setSharedAccounts(transformedAccounts);

            // Clean up old subscriptions
            subscriptionsRef.current.forEach(stryMutAct_9fa48("7813") ? () => undefined : (stryCov_9fa48("7813"), unsub => unsub()));
            subscriptionsRef.current.clear();

            // Subscribe to transactions AND account details for real-time updates
            const allTransactions: Map<string, AnchorTransaction[]> = new Map();
            accounts.forEach(acc => {
              if (stryMutAct_9fa48("7814")) {
                {}
              } else {
                stryCov_9fa48("7814");
                const key = stryMutAct_9fa48("7815") ? `` : (stryCov_9fa48("7815"), `${acc.ownerUid}:${acc.id}`);
                const accountInfo = stryMutAct_9fa48("7816") ? {} : (stryCov_9fa48("7816"), {
                  id: acc.id,
                  ownerUid: acc.ownerUid
                });

                // Transaction Subscription
                const txUnsubscribe = subscribeToTransactions(accountInfo, allTransactions, setSharedTransactions);
                subscriptionsRef.current.set(key + (stryMutAct_9fa48("7817") ? "" : (stryCov_9fa48("7817"), ':tx')), txUnsubscribe);

                // Account Details Subscription (Real-time Balance)
                const accUnsubscribe = subscribeToAccountDetails(accountInfo, setSharedAccounts);
                subscriptionsRef.current.set(key + (stryMutAct_9fa48("7818") ? "" : (stryCov_9fa48("7818"), ':acc')), accUnsubscribe);
              }
            });
            setLoading(stryMutAct_9fa48("7819") ? true : (stryCov_9fa48("7819"), false));
          }
        } catch (err) {
          if (stryMutAct_9fa48("7820")) {
            {}
          } else {
            stryCov_9fa48("7820");
            console.error(stryMutAct_9fa48("7821") ? "" : (stryCov_9fa48("7821"), 'Failed to fetch shared accounts:'), err);
            setError(stryMutAct_9fa48("7822") ? "" : (stryCov_9fa48("7822"), 'Unable to load shared accounts'));
            setLoading(stryMutAct_9fa48("7823") ? true : (stryCov_9fa48("7823"), false));
          }
        }
      }
    }, stryMutAct_9fa48("7824") ? [] : (stryCov_9fa48("7824"), [currentUserId, enabled]));

    // Fetch on mount and when dependencies change
    useEffect(() => {
      if (stryMutAct_9fa48("7825")) {
        {}
      } else {
        stryCov_9fa48("7825");
        // Copy ref to local variable for cleanup function
        const subscriptions = subscriptionsRef.current;

        // Use an IIFE to handle the async fetch
        const controller = new AbortController();

        // Trigger fetch - data fetching is an exception to the set-state-in-effect rule
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchSharedAccounts();
        return () => {
          if (stryMutAct_9fa48("7826")) {
            {}
          } else {
            stryCov_9fa48("7826");
            controller.abort();
            // Cleanup subscriptions using the captured variable
            subscriptions.forEach(stryMutAct_9fa48("7827") ? () => undefined : (stryCov_9fa48("7827"), unsub => unsub()));
            subscriptions.clear();
          }
        };
      }
    }, stryMutAct_9fa48("7828") ? [] : (stryCov_9fa48("7828"), [fetchSharedAccounts]));
    return stryMutAct_9fa48("7829") ? {} : (stryCov_9fa48("7829"), {
      sharedAccounts,
      sharedTransactions,
      loading,
      error,
      refetch: fetchSharedAccounts
    });
  }
}