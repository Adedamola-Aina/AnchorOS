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
  if (stryMutAct_9fa48("1023")) {
    {}
  } else {
    stryCov_9fa48("1023");
    if (stryMutAct_9fa48("1026") ? !error && typeof error !== 'object' : stryMutAct_9fa48("1025") ? false : stryMutAct_9fa48("1024") ? true : (stryCov_9fa48("1024", "1025", "1026"), (stryMutAct_9fa48("1027") ? error : (stryCov_9fa48("1027"), !error)) || (stryMutAct_9fa48("1029") ? typeof error === 'object' : stryMutAct_9fa48("1028") ? false : (stryCov_9fa48("1028", "1029"), typeof error !== (stryMutAct_9fa48("1030") ? "" : (stryCov_9fa48("1030"), 'object')))))) return stryMutAct_9fa48("1031") ? "" : (stryCov_9fa48("1031"), 'An unknown error occurred.');
    const err = error as {
      code?: string;
      message?: string;
    };
    const code = stryMutAct_9fa48("1034") ? err.code && '' : stryMutAct_9fa48("1033") ? false : stryMutAct_9fa48("1032") ? true : (stryCov_9fa48("1032", "1033", "1034"), err.code || (stryMutAct_9fa48("1035") ? "Stryker was here!" : (stryCov_9fa48("1035"), '')));
    const msg = stryMutAct_9fa48("1038") ? err.message && '' : stryMutAct_9fa48("1037") ? false : stryMutAct_9fa48("1036") ? true : (stryCov_9fa48("1036", "1037", "1038"), err.message || (stryMutAct_9fa48("1039") ? "Stryker was here!" : (stryCov_9fa48("1039"), '')));
    switch (code) {
      case stryMutAct_9fa48("1041") ? "" : (stryCov_9fa48("1041"), 'auth/network-request-failed'):
        if (stryMutAct_9fa48("1040")) {} else {
          stryCov_9fa48("1040");
          return stryMutAct_9fa48("1042") ? "" : (stryCov_9fa48("1042"), 'Network error. Please check your internet connection.');
        }
      case stryMutAct_9fa48("1043") ? "" : (stryCov_9fa48("1043"), 'auth/user-not-found'):
      case stryMutAct_9fa48("1044") ? "" : (stryCov_9fa48("1044"), 'auth/wrong-password'):
      case stryMutAct_9fa48("1046") ? "" : (stryCov_9fa48("1046"), 'auth/invalid-credential'):
        if (stryMutAct_9fa48("1045")) {} else {
          stryCov_9fa48("1045");
          return stryMutAct_9fa48("1047") ? "" : (stryCov_9fa48("1047"), 'Incorrect email or password.');
        }
      case stryMutAct_9fa48("1049") ? "" : (stryCov_9fa48("1049"), 'auth/email-already-in-use'):
        if (stryMutAct_9fa48("1048")) {} else {
          stryCov_9fa48("1048");
          return stryMutAct_9fa48("1050") ? "" : (stryCov_9fa48("1050"), 'This email is already registered. Try logging in.');
        }
      case stryMutAct_9fa48("1052") ? "" : (stryCov_9fa48("1052"), 'auth/weak-password'):
        if (stryMutAct_9fa48("1051")) {} else {
          stryCov_9fa48("1051");
          return stryMutAct_9fa48("1053") ? "" : (stryCov_9fa48("1053"), 'Password should be at least 6 characters.');
        }
      case stryMutAct_9fa48("1055") ? "" : (stryCov_9fa48("1055"), 'auth/too-many-requests'):
        if (stryMutAct_9fa48("1054")) {} else {
          stryCov_9fa48("1054");
          return stryMutAct_9fa48("1056") ? "" : (stryCov_9fa48("1056"), 'Too many attempts. Please try again later.');
        }
      case stryMutAct_9fa48("1058") ? "" : (stryCov_9fa48("1058"), 'permission-denied'):
        if (stryMutAct_9fa48("1057")) {} else {
          stryCov_9fa48("1057");
          return stryMutAct_9fa48("1059") ? "" : (stryCov_9fa48("1059"), 'You do not have permission to perform this action.');
        }
      case stryMutAct_9fa48("1061") ? "" : (stryCov_9fa48("1061"), 'unavailable'):
        if (stryMutAct_9fa48("1060")) {} else {
          stryCov_9fa48("1060");
          return stryMutAct_9fa48("1062") ? "" : (stryCov_9fa48("1062"), 'Service temporarily unavailable. Please try again later.');
        }
      case stryMutAct_9fa48("1064") ? "" : (stryCov_9fa48("1064"), 'auth/operation-not-allowed'):
        if (stryMutAct_9fa48("1063")) {} else {
          stryCov_9fa48("1063");
          return stryMutAct_9fa48("1065") ? "" : (stryCov_9fa48("1065"), 'This sign-in method is not enabled. Please contact support.');
        }
      case stryMutAct_9fa48("1067") ? "" : (stryCov_9fa48("1067"), 'auth/quota-exceeded'):
        if (stryMutAct_9fa48("1066")) {} else {
          stryCov_9fa48("1066");
          return stryMutAct_9fa48("1068") ? "" : (stryCov_9fa48("1068"), 'Limit exceeded. Please check your usage or try again later.');
        }
      // Firestore operation errors (BUG-077: improved transfer diagnostics)
      case stryMutAct_9fa48("1070") ? "" : (stryCov_9fa48("1070"), 'not-found'):
        if (stryMutAct_9fa48("1069")) {} else {
          stryCov_9fa48("1069");
          return stryMutAct_9fa48("1071") ? "" : (stryCov_9fa48("1071"), 'The requested record was not found. It may have been deleted.');
        }
      case stryMutAct_9fa48("1073") ? "" : (stryCov_9fa48("1073"), 'already-exists'):
        if (stryMutAct_9fa48("1072")) {} else {
          stryCov_9fa48("1072");
          return stryMutAct_9fa48("1074") ? "" : (stryCov_9fa48("1074"), 'This record already exists. Please refresh and try again.');
        }
      case stryMutAct_9fa48("1076") ? "" : (stryCov_9fa48("1076"), 'deadline-exceeded'):
        if (stryMutAct_9fa48("1075")) {} else {
          stryCov_9fa48("1075");
          return stryMutAct_9fa48("1077") ? "" : (stryCov_9fa48("1077"), 'The operation timed out. Please check your connection and try again.');
        }
      case stryMutAct_9fa48("1079") ? "" : (stryCov_9fa48("1079"), 'aborted'):
        if (stryMutAct_9fa48("1078")) {} else {
          stryCov_9fa48("1078");
          return stryMutAct_9fa48("1080") ? "" : (stryCov_9fa48("1080"), 'The operation was interrupted. Please try again.');
        }
      case stryMutAct_9fa48("1082") ? "" : (stryCov_9fa48("1082"), 'failed-precondition'):
        if (stryMutAct_9fa48("1081")) {} else {
          stryCov_9fa48("1081");
          return stryMutAct_9fa48("1083") ? "" : (stryCov_9fa48("1083"), 'This action cannot be completed right now. Please refresh and try again.');
        }
      default:
        if (stryMutAct_9fa48("1084")) {} else {
          stryCov_9fa48("1084");
          // Strip "Firebase: " prefix if present
          return stryMutAct_9fa48("1087") ? msg.replace('Firebase: ', '') && 'Something went wrong. Please try again.' : stryMutAct_9fa48("1086") ? false : stryMutAct_9fa48("1085") ? true : (stryCov_9fa48("1085", "1086", "1087"), msg.replace(stryMutAct_9fa48("1088") ? "" : (stryCov_9fa48("1088"), 'Firebase: '), stryMutAct_9fa48("1089") ? "Stryker was here!" : (stryCov_9fa48("1089"), '')) || (stryMutAct_9fa48("1090") ? "" : (stryCov_9fa48("1090"), 'Something went wrong. Please try again.')));
        }
    }
  }
};