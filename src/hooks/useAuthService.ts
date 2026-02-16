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
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';
export const useAuthService = () => {
  if (stryMutAct_9fa48("32")) {
    {}
  } else {
    stryCov_9fa48("32");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("33") ? false : (stryCov_9fa48("33"), true));
    useEffect(() => {
      if (stryMutAct_9fa48("34")) {
        {}
      } else {
        stryCov_9fa48("34");
        const unsubscribe = onAuthStateChanged(auth, async u => {
          if (stryMutAct_9fa48("35")) {
            {}
          } else {
            stryCov_9fa48("35");
            setUser(u);
            setLoading(stryMutAct_9fa48("36") ? true : (stryCov_9fa48("36"), false));
          }
        }, error => {
          if (stryMutAct_9fa48("37")) {
            {}
          } else {
            stryCov_9fa48("37");
            console.error(stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), '[Auth] Auth state observer error:'), error);
            setLoading(stryMutAct_9fa48("39") ? true : (stryCov_9fa48("39"), false));
          }
        });
        return unsubscribe;
      }
    }, stryMutAct_9fa48("40") ? ["Stryker was here"] : (stryCov_9fa48("40"), []));
    return stryMutAct_9fa48("41") ? {} : (stryCov_9fa48("41"), {
      user,
      loading
    });
  }
};