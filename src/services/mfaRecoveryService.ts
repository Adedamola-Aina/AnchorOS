/**
 * MFA Recovery Codes Service
 * 
 * FEAT-002: Generate and manage backup recovery codes for MFA.
 * Codes are displayed once at enrollment, stored as SHA-256 hashes.
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
const CODE_LENGTH = 8;
const CODE_COUNT = 8;
const CHARSET = stryMutAct_9fa48("815") ? "" : (stryCov_9fa48("815"), 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'); // No 0/O/1/I confusion

function generateCode(): string {
  if (stryMutAct_9fa48("816")) {
    {}
  } else {
    stryCov_9fa48("816");
    const array = new Uint8Array(CODE_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, stryMutAct_9fa48("817") ? () => undefined : (stryCov_9fa48("817"), b => CHARSET[stryMutAct_9fa48("818") ? b * CHARSET.length : (stryCov_9fa48("818"), b % CHARSET.length)])).join(stryMutAct_9fa48("819") ? "Stryker was here!" : (stryCov_9fa48("819"), ''));
  }
}
async function hashCode(code: string): Promise<string> {
  if (stryMutAct_9fa48("820")) {
    {}
  } else {
    stryCov_9fa48("820");
    const encoder = new TextEncoder();
    const data = encoder.encode(stryMutAct_9fa48("821") ? code.toLowerCase().replace(/\s/g, '') : (stryCov_9fa48("821"), code.toUpperCase().replace(stryMutAct_9fa48("822") ? /\S/g : (stryCov_9fa48("822"), /\s/g), stryMutAct_9fa48("823") ? "Stryker was here!" : (stryCov_9fa48("823"), ''))));
    const hashBuffer = await crypto.subtle.digest(stryMutAct_9fa48("824") ? "" : (stryCov_9fa48("824"), 'SHA-256'), data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(stryMutAct_9fa48("825") ? () => undefined : (stryCov_9fa48("825"), b => b.toString(16).padStart(2, stryMutAct_9fa48("826") ? "" : (stryCov_9fa48("826"), '0')))).join(stryMutAct_9fa48("827") ? "Stryker was here!" : (stryCov_9fa48("827"), ''));
  }
}
export interface RecoveryCodesResult {
  /** Plain-text codes to show to user ONCE */
  plainCodes: string[];
  /** SHA-256 hashed codes for Firestore storage */
  hashedCodes: string[];
}

/**
 * Generate a set of one-time recovery codes.
 * Plain codes must be shown to user immediately — they cannot be recovered.
 */
export async function generateRecoveryCodes(): Promise<RecoveryCodesResult> {
  if (stryMutAct_9fa48("828")) {
    {}
  } else {
    stryCov_9fa48("828");
    const plainCodes = Array.from(stryMutAct_9fa48("829") ? {} : (stryCov_9fa48("829"), {
      length: CODE_COUNT
    }), stryMutAct_9fa48("830") ? () => undefined : (stryCov_9fa48("830"), () => generateCode()));
    const hashedCodes = await Promise.all(plainCodes.map(hashCode));
    return stryMutAct_9fa48("831") ? {} : (stryCov_9fa48("831"), {
      plainCodes,
      hashedCodes
    });
  }
}

/**
 * Verify a recovery code against stored hashes.
 * Returns the index of the matched code, or -1 if not found.
 */
export async function verifyRecoveryCode(code: string, storedHashes: string[]): Promise<number> {
  if (stryMutAct_9fa48("832")) {
    {}
  } else {
    stryCov_9fa48("832");
    const hash = await hashCode(code);
    return storedHashes.indexOf(hash);
  }
}