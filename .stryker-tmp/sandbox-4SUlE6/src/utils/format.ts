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
import type { Currency } from '../types';
export const formatCurrency = (amount: number, currency: Currency) => {
  if (stryMutAct_9fa48("9165")) {
    {}
  } else {
    stryCov_9fa48("9165");
    const locale = (stryMutAct_9fa48("9168") ? currency !== 'NGN' : stryMutAct_9fa48("9167") ? false : stryMutAct_9fa48("9166") ? true : (stryCov_9fa48("9166", "9167", "9168"), currency === (stryMutAct_9fa48("9169") ? "" : (stryCov_9fa48("9169"), 'NGN')))) ? stryMutAct_9fa48("9170") ? "" : (stryCov_9fa48("9170"), 'en-NG') : stryMutAct_9fa48("9171") ? "" : (stryCov_9fa48("9171"), 'en-US');
    return new Intl.NumberFormat(locale, stryMutAct_9fa48("9172") ? {} : (stryCov_9fa48("9172"), {
      style: stryMutAct_9fa48("9173") ? "" : (stryCov_9fa48("9173"), 'currency'),
      currency: currency,
      minimumFractionDigits: 2
    })).format(amount);
  }
};