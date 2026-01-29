/**
 * Notification Styling Helpers
 * 
 * Extracted from FamilyNotificationBanner.tsx
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
import { Users, Bell } from 'lucide-react';
export type NotificationType = 'family_connected' | 'invitation_accepted' | 'account_shared' | string;
export const getNotificationIcon = (type: NotificationType) => {
  if (stryMutAct_9fa48("777")) {
    {}
  } else {
    stryCov_9fa48("777");
    switch (type) {
      case stryMutAct_9fa48("778") ? "" : (stryCov_9fa48("778"), 'family_connected'):
      case stryMutAct_9fa48("779") ? "" : (stryCov_9fa48("779"), 'invitation_accepted'):
      case stryMutAct_9fa48("781") ? "" : (stryCov_9fa48("781"), 'account_shared'):
        if (stryMutAct_9fa48("780")) {} else {
          stryCov_9fa48("780");
          return Users;
        }
      default:
        if (stryMutAct_9fa48("782")) {} else {
          stryCov_9fa48("782");
          return Bell;
        }
    }
  }
};
export const getNotificationBgColor = (type: NotificationType): string => {
  if (stryMutAct_9fa48("783")) {
    {}
  } else {
    stryCov_9fa48("783");
    switch (type) {
      case stryMutAct_9fa48("785") ? "" : (stryCov_9fa48("785"), 'family_connected'):
        if (stryMutAct_9fa48("784")) {} else {
          stryCov_9fa48("784");
          return stryMutAct_9fa48("786") ? "" : (stryCov_9fa48("786"), 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800');
        }
      case stryMutAct_9fa48("788") ? "" : (stryCov_9fa48("788"), 'account_shared'):
        if (stryMutAct_9fa48("787")) {} else {
          stryCov_9fa48("787");
          return stryMutAct_9fa48("789") ? "" : (stryCov_9fa48("789"), 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800');
        }
      case stryMutAct_9fa48("791") ? "" : (stryCov_9fa48("791"), 'invitation_accepted'):
        if (stryMutAct_9fa48("790")) {} else {
          stryCov_9fa48("790");
          return stryMutAct_9fa48("792") ? "" : (stryCov_9fa48("792"), 'bg-family-50 dark:bg-family-900/20 border-family-200 dark:border-family-800');
        }
      default:
        if (stryMutAct_9fa48("793")) {} else {
          stryCov_9fa48("793");
          return stryMutAct_9fa48("794") ? "" : (stryCov_9fa48("794"), 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700');
        }
    }
  }
};
export const getNotificationIconColor = (type: NotificationType): string => {
  if (stryMutAct_9fa48("795")) {
    {}
  } else {
    stryCov_9fa48("795");
    switch (type) {
      case stryMutAct_9fa48("797") ? "" : (stryCov_9fa48("797"), 'family_connected'):
        if (stryMutAct_9fa48("796")) {} else {
          stryCov_9fa48("796");
          return stryMutAct_9fa48("798") ? "" : (stryCov_9fa48("798"), 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30');
        }
      case stryMutAct_9fa48("800") ? "" : (stryCov_9fa48("800"), 'account_shared'):
        if (stryMutAct_9fa48("799")) {} else {
          stryCov_9fa48("799");
          return stryMutAct_9fa48("801") ? "" : (stryCov_9fa48("801"), 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30');
        }
      case stryMutAct_9fa48("803") ? "" : (stryCov_9fa48("803"), 'invitation_accepted'):
        if (stryMutAct_9fa48("802")) {} else {
          stryCov_9fa48("802");
          return stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), 'text-family-600 dark:text-family-400 bg-family-100 dark:bg-family-900/30');
        }
      default:
        if (stryMutAct_9fa48("805")) {} else {
          stryCov_9fa48("805");
          return stryMutAct_9fa48("806") ? "" : (stryCov_9fa48("806"), 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800');
        }
    }
  }
};