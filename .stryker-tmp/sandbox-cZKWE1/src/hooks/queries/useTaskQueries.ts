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
import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, APP_ID } from '../../config/firebase';
import type { AnchorTask } from '../../types';
export const TASK_KEYS = stryMutAct_9fa48("6669") ? {} : (stryCov_9fa48("6669"), {
  all: ['tasks'] as const,
  list: stryMutAct_9fa48("6670") ? () => undefined : (stryCov_9fa48("6670"), (userId: string) => [...TASK_KEYS.all, 'list', userId] as const)
});
export const useTasksQuery = (userId: string | undefined) => {
  if (stryMutAct_9fa48("6671")) {
    {}
  } else {
    stryCov_9fa48("6671");
    const queryClient = useQueryClient();
    const queryKey = TASK_KEYS.list(stryMutAct_9fa48("6674") ? userId && '' : stryMutAct_9fa48("6673") ? false : stryMutAct_9fa48("6672") ? true : (stryCov_9fa48("6672", "6673", "6674"), userId || (stryMutAct_9fa48("6675") ? "Stryker was here!" : (stryCov_9fa48("6675"), ''))));
    const hasInitializedRef = useRef(stryMutAct_9fa48("6676") ? true : (stryCov_9fa48("6676"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("6677")) {
        {}
      } else {
        stryCov_9fa48("6677");
        if (stryMutAct_9fa48("6680") ? false : stryMutAct_9fa48("6679") ? true : stryMutAct_9fa48("6678") ? userId : (stryCov_9fa48("6678", "6679", "6680"), !userId)) return;
        const q = query(collection(db, stryMutAct_9fa48("6681") ? "" : (stryCov_9fa48("6681"), 'artifacts'), APP_ID, stryMutAct_9fa48("6682") ? "" : (stryCov_9fa48("6682"), 'users'), userId, stryMutAct_9fa48("6683") ? "" : (stryCov_9fa48("6683"), 'commitments')), orderBy(stryMutAct_9fa48("6684") ? "" : (stryCov_9fa48("6684"), 'createdAt'), stryMutAct_9fa48("6685") ? "" : (stryCov_9fa48("6685"), 'desc')), limit(100));

        // onSnapshot fires immediately with current Firestore data
        // This automatically syncs across devices in real-time
        const unsubscribe = onSnapshot(q, snapshot => {
          if (stryMutAct_9fa48("6686")) {
            {}
          } else {
            stryCov_9fa48("6686");
            const data = snapshot.docs.map(stryMutAct_9fa48("6687") ? () => undefined : (stryCov_9fa48("6687"), doc => ({
              id: doc.id,
              ...doc.data()
            }) as AnchorTask));
            queryClient.setQueryData(queryKey, data);
            hasInitializedRef.current = stryMutAct_9fa48("6688") ? false : (stryCov_9fa48("6688"), true);
          }
        });
        return stryMutAct_9fa48("6689") ? () => undefined : (stryCov_9fa48("6689"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("6690") ? [] : (stryCov_9fa48("6690"), [userId, queryClient, queryKey]));
    return useQuery<AnchorTask[]>(stryMutAct_9fa48("6691") ? {} : (stryCov_9fa48("6691"), {
      queryKey,
      queryFn: stryMutAct_9fa48("6692") ? () => undefined : (stryCov_9fa48("6692"), () => stryMutAct_9fa48("6693") ? ["Stryker was here"] : (stryCov_9fa48("6693"), [])),
      enabled: stryMutAct_9fa48("6694") ? !userId : (stryCov_9fa48("6694"), !(stryMutAct_9fa48("6695") ? userId : (stryCov_9fa48("6695"), !userId))),
      // Keep staleTime high - onSnapshot handles real-time updates via setQueryData
      staleTime: Infinity,
      // Don't refetch on mount - onSnapshot provides fresh data immediately
      refetchOnMount: stryMutAct_9fa48("6696") ? true : (stryCov_9fa48("6696"), false),
      refetchOnWindowFocus: stryMutAct_9fa48("6697") ? true : (stryCov_9fa48("6697"), false)
    }));
  }
};