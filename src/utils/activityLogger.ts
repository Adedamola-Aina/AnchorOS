/**
 * Activity Logger Utility
 * 
 * Standalone function to log activities for shared accounts.
 * Can be used in services and hooks without the React hook overhead.
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
import { db, APP_ID } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { ActivityAction, AccountActivity } from '../types/activity';
import { createActivityEntry } from '../types/activity';
interface LogActivityParams {
  action: ActivityAction;
  accountId: string;
  accountOwnerId: string;
  actorId: string;
  actorName: string;
  details: AccountActivity['details'];
}

/**
 * Log an activity to an account's activity feed.
 * Non-blocking - errors are logged but don't throw.
 */
export const logAccountActivity = async ({
  action,
  accountId,
  accountOwnerId,
  actorId,
  actorName,
  details
}: LogActivityParams): Promise<void> => {
  if (stryMutAct_9fa48("833")) {
    {}
  } else {
    stryCov_9fa48("833");
    if (stryMutAct_9fa48("836") ? !accountId && !accountOwnerId : stryMutAct_9fa48("835") ? false : stryMutAct_9fa48("834") ? true : (stryCov_9fa48("834", "835", "836"), (stryMutAct_9fa48("837") ? accountId : (stryCov_9fa48("837"), !accountId)) || (stryMutAct_9fa48("838") ? accountOwnerId : (stryCov_9fa48("838"), !accountOwnerId)))) return;
    try {
      if (stryMutAct_9fa48("839")) {
        {}
      } else {
        stryCov_9fa48("839");
        const activitiesRef = collection(db, stryMutAct_9fa48("840") ? "" : (stryCov_9fa48("840"), 'artifacts'), APP_ID, stryMutAct_9fa48("841") ? "" : (stryCov_9fa48("841"), 'users'), accountOwnerId, stryMutAct_9fa48("842") ? "" : (stryCov_9fa48("842"), 'accounts'), accountId, stryMutAct_9fa48("843") ? "" : (stryCov_9fa48("843"), 'activity'));
        const activityData = createActivityEntry(action, accountId, accountOwnerId, actorId, actorName, details);
        await addDoc(activitiesRef, activityData);
      }
    } catch (err) {
      if (stryMutAct_9fa48("844")) {
        {}
      } else {
        stryCov_9fa48("844");
        console.error(stryMutAct_9fa48("845") ? "" : (stryCov_9fa48("845"), 'Failed to log activity:'), err);
        // Non-blocking - don't throw
      }
    }
  }
};