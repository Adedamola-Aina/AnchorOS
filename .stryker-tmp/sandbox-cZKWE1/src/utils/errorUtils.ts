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
export const mapFirebaseError = (error: unknown): string => {
  if (stryMutAct_9fa48("8694")) {
    {}
  } else {
    stryCov_9fa48("8694");
    if (stryMutAct_9fa48("8697") ? !error && typeof error !== 'object' : stryMutAct_9fa48("8696") ? false : stryMutAct_9fa48("8695") ? true : (stryCov_9fa48("8695", "8696", "8697"), (stryMutAct_9fa48("8698") ? error : (stryCov_9fa48("8698"), !error)) || (stryMutAct_9fa48("8700") ? typeof error === 'object' : stryMutAct_9fa48("8699") ? false : (stryCov_9fa48("8699", "8700"), typeof error !== (stryMutAct_9fa48("8701") ? "" : (stryCov_9fa48("8701"), 'object')))))) return stryMutAct_9fa48("8702") ? "" : (stryCov_9fa48("8702"), 'An unknown error occurred.');
    const err = error as {
      code?: string;
      message?: string;
    };
    const code = stryMutAct_9fa48("8705") ? err.code && '' : stryMutAct_9fa48("8704") ? false : stryMutAct_9fa48("8703") ? true : (stryCov_9fa48("8703", "8704", "8705"), err.code || (stryMutAct_9fa48("8706") ? "Stryker was here!" : (stryCov_9fa48("8706"), '')));
    const msg = stryMutAct_9fa48("8709") ? err.message && '' : stryMutAct_9fa48("8708") ? false : stryMutAct_9fa48("8707") ? true : (stryCov_9fa48("8707", "8708", "8709"), err.message || (stryMutAct_9fa48("8710") ? "Stryker was here!" : (stryCov_9fa48("8710"), '')));
    switch (code) {
      case stryMutAct_9fa48("8712") ? "" : (stryCov_9fa48("8712"), 'auth/network-request-failed'):
        if (stryMutAct_9fa48("8711")) {} else {
          stryCov_9fa48("8711");
          return stryMutAct_9fa48("8713") ? "" : (stryCov_9fa48("8713"), 'Network error. Please check your internet connection.');
        }
      case stryMutAct_9fa48("8714") ? "" : (stryCov_9fa48("8714"), 'auth/user-not-found'):
      case stryMutAct_9fa48("8715") ? "" : (stryCov_9fa48("8715"), 'auth/wrong-password'):
      case stryMutAct_9fa48("8717") ? "" : (stryCov_9fa48("8717"), 'auth/invalid-credential'):
        if (stryMutAct_9fa48("8716")) {} else {
          stryCov_9fa48("8716");
          return stryMutAct_9fa48("8718") ? "" : (stryCov_9fa48("8718"), 'Incorrect email or password.');
        }
      case stryMutAct_9fa48("8720") ? "" : (stryCov_9fa48("8720"), 'auth/email-already-in-use'):
        if (stryMutAct_9fa48("8719")) {} else {
          stryCov_9fa48("8719");
          return stryMutAct_9fa48("8721") ? "" : (stryCov_9fa48("8721"), 'This email is already registered. Try logging in.');
        }
      case stryMutAct_9fa48("8723") ? "" : (stryCov_9fa48("8723"), 'auth/weak-password'):
        if (stryMutAct_9fa48("8722")) {} else {
          stryCov_9fa48("8722");
          return stryMutAct_9fa48("8724") ? "" : (stryCov_9fa48("8724"), 'Password should be at least 6 characters.');
        }
      case stryMutAct_9fa48("8726") ? "" : (stryCov_9fa48("8726"), 'auth/too-many-requests'):
        if (stryMutAct_9fa48("8725")) {} else {
          stryCov_9fa48("8725");
          return stryMutAct_9fa48("8727") ? "" : (stryCov_9fa48("8727"), 'Too many attempts. Please try again later.');
        }
      case stryMutAct_9fa48("8729") ? "" : (stryCov_9fa48("8729"), 'permission-denied'):
        if (stryMutAct_9fa48("8728")) {} else {
          stryCov_9fa48("8728");
          return stryMutAct_9fa48("8730") ? "" : (stryCov_9fa48("8730"), 'You do not have permission to perform this action.');
        }
      case stryMutAct_9fa48("8732") ? "" : (stryCov_9fa48("8732"), 'unavailable'):
        if (stryMutAct_9fa48("8731")) {} else {
          stryCov_9fa48("8731");
          return stryMutAct_9fa48("8733") ? "" : (stryCov_9fa48("8733"), 'Service temporarily unavailable. Please try again later.');
        }
      case stryMutAct_9fa48("8735") ? "" : (stryCov_9fa48("8735"), 'auth/operation-not-allowed'):
        if (stryMutAct_9fa48("8734")) {} else {
          stryCov_9fa48("8734");
          return stryMutAct_9fa48("8736") ? "" : (stryCov_9fa48("8736"), 'This sign-in method is not enabled. Please contact support.');
        }
      case stryMutAct_9fa48("8738") ? "" : (stryCov_9fa48("8738"), 'auth/quota-exceeded'):
        if (stryMutAct_9fa48("8737")) {} else {
          stryCov_9fa48("8737");
          return stryMutAct_9fa48("8739") ? "" : (stryCov_9fa48("8739"), 'Limit exceeded. Please check your usage or try again later.');
        }
      default:
        if (stryMutAct_9fa48("8740")) {} else {
          stryCov_9fa48("8740");
          // Strip "Firebase: " prefix if present
          return msg.replace(stryMutAct_9fa48("8741") ? "" : (stryCov_9fa48("8741"), 'Firebase: '), stryMutAct_9fa48("8742") ? "Stryker was here!" : (stryCov_9fa48("8742"), ''));
        }
    }
  }
};