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

/**
 * Lazy-load wrapper that auto-reloads on chunk load failures.
 * After a deploy, browsers may cache stale chunk filenames. When the SPA
 * tries to load the old filename, Firebase returns index.html (rewrite),
 * which fails with a MIME type error. This detects that and reloads once.
 */
export function lazyWithRetry(factory: () => Promise<{
  default: React.ComponentType<object>;
}>) {
  if (stryMutAct_9fa48("1611")) {
    {}
  } else {
    stryCov_9fa48("1611");
    return React.lazy(stryMutAct_9fa48("1612") ? () => undefined : (stryCov_9fa48("1612"), () => factory().catch((error: Error) => {
      if (stryMutAct_9fa48("1613")) {
        {}
      } else {
        stryCov_9fa48("1613");
        const key = (stryMutAct_9fa48("1614") ? "" : (stryCov_9fa48("1614"), 'chunk_reload_')) + (stryMutAct_9fa48("1615") ? factory.toString() : (stryCov_9fa48("1615"), factory.toString().slice(0, 60)));
        if (stryMutAct_9fa48("1618") ? false : stryMutAct_9fa48("1617") ? true : stryMutAct_9fa48("1616") ? sessionStorage.getItem(key) : (stryCov_9fa48("1616", "1617", "1618"), !sessionStorage.getItem(key))) {
          if (stryMutAct_9fa48("1619")) {
            {}
          } else {
            stryCov_9fa48("1619");
            sessionStorage.setItem(key, stryMutAct_9fa48("1620") ? "" : (stryCov_9fa48("1620"), '1'));
            window.location.reload();
          }
        }
        throw error;
      }
    })));
  }
}