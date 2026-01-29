/**
 * Activity Feed Helpers
 * 
 * Extracted from ActivityFeed.tsx for cleaner component structure.
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
import React from 'react';
import { PlusCircle, Pencil, Trash2, Type, UserPlus, UserMinus, Activity } from 'lucide-react';
import type { AccountActivity } from '../../../types/activity';
export const formatRelativeTime = (timestamp: string): string => {
  if (stryMutAct_9fa48("4818")) {
    {}
  } else {
    stryCov_9fa48("4818");
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = stryMutAct_9fa48("4819") ? now.getTime() + activityTime.getTime() : (stryCov_9fa48("4819"), now.getTime() - activityTime.getTime());
    const diffMins = Math.floor(stryMutAct_9fa48("4820") ? diffMs * 60000 : (stryCov_9fa48("4820"), diffMs / 60000));
    const diffHours = Math.floor(stryMutAct_9fa48("4821") ? diffMs * 3600000 : (stryCov_9fa48("4821"), diffMs / 3600000));
    const diffDays = Math.floor(stryMutAct_9fa48("4822") ? diffMs * 86400000 : (stryCov_9fa48("4822"), diffMs / 86400000));
    if (stryMutAct_9fa48("4826") ? diffMins >= 1 : stryMutAct_9fa48("4825") ? diffMins <= 1 : stryMutAct_9fa48("4824") ? false : stryMutAct_9fa48("4823") ? true : (stryCov_9fa48("4823", "4824", "4825", "4826"), diffMins < 1)) return stryMutAct_9fa48("4827") ? "" : (stryCov_9fa48("4827"), 'Just now');
    if (stryMutAct_9fa48("4831") ? diffMins >= 60 : stryMutAct_9fa48("4830") ? diffMins <= 60 : stryMutAct_9fa48("4829") ? false : stryMutAct_9fa48("4828") ? true : (stryCov_9fa48("4828", "4829", "4830", "4831"), diffMins < 60)) return stryMutAct_9fa48("4832") ? `` : (stryCov_9fa48("4832"), `${diffMins}m ago`);
    if (stryMutAct_9fa48("4836") ? diffHours >= 24 : stryMutAct_9fa48("4835") ? diffHours <= 24 : stryMutAct_9fa48("4834") ? false : stryMutAct_9fa48("4833") ? true : (stryCov_9fa48("4833", "4834", "4835", "4836"), diffHours < 24)) return stryMutAct_9fa48("4837") ? `` : (stryCov_9fa48("4837"), `${diffHours}h ago`);
    if (stryMutAct_9fa48("4841") ? diffDays >= 7 : stryMutAct_9fa48("4840") ? diffDays <= 7 : stryMutAct_9fa48("4839") ? false : stryMutAct_9fa48("4838") ? true : (stryCov_9fa48("4838", "4839", "4840", "4841"), diffDays < 7)) return stryMutAct_9fa48("4842") ? `` : (stryCov_9fa48("4842"), `${diffDays}d ago`);
    return activityTime.toLocaleDateString(stryMutAct_9fa48("4843") ? "" : (stryCov_9fa48("4843"), 'en-US'), stryMutAct_9fa48("4844") ? {} : (stryCov_9fa48("4844"), {
      month: stryMutAct_9fa48("4845") ? "" : (stryCov_9fa48("4845"), 'short'),
      day: stryMutAct_9fa48("4846") ? "" : (stryCov_9fa48("4846"), 'numeric')
    }));
  }
};
export const getActivityIcon = (action: AccountActivity['action']): React.ReactElement => {
  if (stryMutAct_9fa48("4847")) {
    {}
  } else {
    stryCov_9fa48("4847");
    const iconClass = stryMutAct_9fa48("4848") ? "" : (stryCov_9fa48("4848"), "w-4 h-4");
    switch (action) {
      case stryMutAct_9fa48("4850") ? "" : (stryCov_9fa48("4850"), 'transaction_added'):
        if (stryMutAct_9fa48("4849")) {} else {
          stryCov_9fa48("4849");
          return React.createElement(PlusCircle, stryMutAct_9fa48("4851") ? {} : (stryCov_9fa48("4851"), {
            className: iconClass
          }));
        }
      case stryMutAct_9fa48("4853") ? "" : (stryCov_9fa48("4853"), 'transaction_edited'):
        if (stryMutAct_9fa48("4852")) {} else {
          stryCov_9fa48("4852");
          return React.createElement(Pencil, stryMutAct_9fa48("4854") ? {} : (stryCov_9fa48("4854"), {
            className: iconClass
          }));
        }
      case stryMutAct_9fa48("4856") ? "" : (stryCov_9fa48("4856"), 'transaction_deleted'):
        if (stryMutAct_9fa48("4855")) {} else {
          stryCov_9fa48("4855");
          return React.createElement(Trash2, stryMutAct_9fa48("4857") ? {} : (stryCov_9fa48("4857"), {
            className: iconClass
          }));
        }
      case stryMutAct_9fa48("4859") ? "" : (stryCov_9fa48("4859"), 'account_renamed'):
        if (stryMutAct_9fa48("4858")) {} else {
          stryCov_9fa48("4858");
          return React.createElement(Type, stryMutAct_9fa48("4860") ? {} : (stryCov_9fa48("4860"), {
            className: iconClass
          }));
        }
      case stryMutAct_9fa48("4862") ? "" : (stryCov_9fa48("4862"), 'account_shared'):
        if (stryMutAct_9fa48("4861")) {} else {
          stryCov_9fa48("4861");
          return React.createElement(UserPlus, stryMutAct_9fa48("4863") ? {} : (stryCov_9fa48("4863"), {
            className: iconClass
          }));
        }
      case stryMutAct_9fa48("4865") ? "" : (stryCov_9fa48("4865"), 'account_unshared'):
        if (stryMutAct_9fa48("4864")) {} else {
          stryCov_9fa48("4864");
          return React.createElement(UserMinus, stryMutAct_9fa48("4866") ? {} : (stryCov_9fa48("4866"), {
            className: iconClass
          }));
        }
      default:
        if (stryMutAct_9fa48("4867")) {} else {
          stryCov_9fa48("4867");
          return React.createElement(Activity, stryMutAct_9fa48("4868") ? {} : (stryCov_9fa48("4868"), {
            className: iconClass
          }));
        }
    }
  }
};