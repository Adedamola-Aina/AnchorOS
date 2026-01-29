/**
 * useAccountActivity Hook
 * 
 * Fetches and manages activity feed data for shared accounts.
 * Provides real-time updates via Firestore subscriptions.
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
import { useState, useEffect, useCallback } from 'react';
import { db, APP_ID } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore';
import type { AccountActivity, ActivityAction } from '../types/activity';
import { createActivityEntry } from '../types/activity';
interface UseAccountActivityOptions {
  accountId: string;
  accountOwnerId: string;
  enabled?: boolean;
  maxItems?: number;
}
interface UseAccountActivityReturn {
  activities: AccountActivity[];
  loading: boolean;
  error: string | null;
  logActivity: (action: ActivityAction, actorId: string, actorName: string, details: AccountActivity['details']) => Promise<void>;
}
export const useAccountActivity = ({
  accountId,
  accountOwnerId,
  enabled = stryMutAct_9fa48("6744") ? false : (stryCov_9fa48("6744"), true),
  maxItems = 20
}: UseAccountActivityOptions): UseAccountActivityReturn => {
  if (stryMutAct_9fa48("6745")) {
    {}
  } else {
    stryCov_9fa48("6745");
    const [activities, setActivities] = useState<AccountActivity[]>(stryMutAct_9fa48("6746") ? ["Stryker was here"] : (stryCov_9fa48("6746"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("6747") ? false : (stryCov_9fa48("6747"), true));
    const [error, setError] = useState<string | null>(null);

    // Subscribe to activity feed
    useEffect(() => {
      if (stryMutAct_9fa48("6748")) {
        {}
      } else {
        stryCov_9fa48("6748");
        if (stryMutAct_9fa48("6751") ? (!enabled || !accountId) && !accountOwnerId : stryMutAct_9fa48("6750") ? false : stryMutAct_9fa48("6749") ? true : (stryCov_9fa48("6749", "6750", "6751"), (stryMutAct_9fa48("6753") ? !enabled && !accountId : stryMutAct_9fa48("6752") ? false : (stryCov_9fa48("6752", "6753"), (stryMutAct_9fa48("6754") ? enabled : (stryCov_9fa48("6754"), !enabled)) || (stryMutAct_9fa48("6755") ? accountId : (stryCov_9fa48("6755"), !accountId)))) || (stryMutAct_9fa48("6756") ? accountOwnerId : (stryCov_9fa48("6756"), !accountOwnerId)))) {
          if (stryMutAct_9fa48("6757")) {
            {}
          } else {
            stryCov_9fa48("6757");
            // Reset state for disabled/missing parameters - intentional early exit pattern
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActivities(stryMutAct_9fa48("6758") ? ["Stryker was here"] : (stryCov_9fa48("6758"), []));
            setLoading(stryMutAct_9fa48("6759") ? true : (stryCov_9fa48("6759"), false));
            return;
          }
        }
        setLoading(stryMutAct_9fa48("6760") ? false : (stryCov_9fa48("6760"), true));
        const activitiesRef = collection(db, stryMutAct_9fa48("6761") ? "" : (stryCov_9fa48("6761"), 'artifacts'), APP_ID, stryMutAct_9fa48("6762") ? "" : (stryCov_9fa48("6762"), 'users'), accountOwnerId, stryMutAct_9fa48("6763") ? "" : (stryCov_9fa48("6763"), 'accounts'), accountId, stryMutAct_9fa48("6764") ? "" : (stryCov_9fa48("6764"), 'activity'));
        const q = query(activitiesRef, orderBy(stryMutAct_9fa48("6765") ? "" : (stryCov_9fa48("6765"), 'timestamp'), stryMutAct_9fa48("6766") ? "" : (stryCov_9fa48("6766"), 'desc')), limit(maxItems));
        const unsubscribe = onSnapshot(q, snapshot => {
          if (stryMutAct_9fa48("6767")) {
            {}
          } else {
            stryCov_9fa48("6767");
            const activityList: AccountActivity[] = snapshot.docs.map(stryMutAct_9fa48("6768") ? () => undefined : (stryCov_9fa48("6768"), doc => ({
              id: doc.id,
              ...doc.data()
            }) as AccountActivity));
            setActivities(activityList);
            setLoading(stryMutAct_9fa48("6769") ? true : (stryCov_9fa48("6769"), false));
            setError(null);
          }
        }, err => {
          if (stryMutAct_9fa48("6770")) {
            {}
          } else {
            stryCov_9fa48("6770");
            console.error(stryMutAct_9fa48("6771") ? "" : (stryCov_9fa48("6771"), 'Activity subscription error:'), err);
            setError(stryMutAct_9fa48("6772") ? "" : (stryCov_9fa48("6772"), 'Unable to load activity'));
            setLoading(stryMutAct_9fa48("6773") ? true : (stryCov_9fa48("6773"), false));
          }
        });
        return stryMutAct_9fa48("6774") ? () => undefined : (stryCov_9fa48("6774"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("6775") ? [] : (stryCov_9fa48("6775"), [accountId, accountOwnerId, enabled, maxItems]));

    // Log a new activity
    const logActivity = useCallback(async (action: ActivityAction, actorId: string, actorName: string, details: AccountActivity['details']) => {
      if (stryMutAct_9fa48("6776")) {
        {}
      } else {
        stryCov_9fa48("6776");
        if (stryMutAct_9fa48("6779") ? !accountId && !accountOwnerId : stryMutAct_9fa48("6778") ? false : stryMutAct_9fa48("6777") ? true : (stryCov_9fa48("6777", "6778", "6779"), (stryMutAct_9fa48("6780") ? accountId : (stryCov_9fa48("6780"), !accountId)) || (stryMutAct_9fa48("6781") ? accountOwnerId : (stryCov_9fa48("6781"), !accountOwnerId)))) return;
        try {
          if (stryMutAct_9fa48("6782")) {
            {}
          } else {
            stryCov_9fa48("6782");
            const activitiesRef = collection(db, stryMutAct_9fa48("6783") ? "" : (stryCov_9fa48("6783"), 'artifacts'), APP_ID, stryMutAct_9fa48("6784") ? "" : (stryCov_9fa48("6784"), 'users'), accountOwnerId, stryMutAct_9fa48("6785") ? "" : (stryCov_9fa48("6785"), 'accounts'), accountId, stryMutAct_9fa48("6786") ? "" : (stryCov_9fa48("6786"), 'activity'));
            const activityData = createActivityEntry(action, accountId, accountOwnerId, actorId, actorName, details);
            await addDoc(activitiesRef, activityData);
          }
        } catch (err) {
          if (stryMutAct_9fa48("6787")) {
            {}
          } else {
            stryCov_9fa48("6787");
            console.error(stryMutAct_9fa48("6788") ? "" : (stryCov_9fa48("6788"), 'Failed to log activity:'), err);
            // Don't throw - activity logging should be non-blocking
          }
        }
      }
    }, stryMutAct_9fa48("6789") ? [] : (stryCov_9fa48("6789"), [accountId, accountOwnerId]));
    return stryMutAct_9fa48("6790") ? {} : (stryCov_9fa48("6790"), {
      activities,
      loading,
      error,
      logActivity
    });
  }
};