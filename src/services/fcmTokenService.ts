/**
 * FCM Token Service - Handles push notification token retrieval with retry
 * 
 * ARCH-003: Extracted from NotificationContext to separate concerns.
 * Handles IDB timing issues that occur during PWA navigation.
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
import { getToken, type Messaging } from 'firebase/messaging';
interface FcmTokenOptions {
  messaging: Messaging;
  vapidKey: string;
  maxRetries?: number;
  initialDelay?: number;
}

/**
 * Get FCM token with exponential backoff retry for IDB timing issues.
 * Safari and some mobile browsers close IndexedDB connections during
 * PWA navigation, causing transient failures.
 */
export async function getFcmTokenWithRetry({
  messaging,
  vapidKey,
  maxRetries = 3,
  initialDelay = 500
}: FcmTokenOptions): Promise<string | null> {
  if (stryMutAct_9fa48("789")) {
    {}
  } else {
    stryCov_9fa48("789");
    const attempt = async (retries: number, delay: number): Promise<string | null> => {
      if (stryMutAct_9fa48("790")) {
        {}
      } else {
        stryCov_9fa48("790");
        try {
          if (stryMutAct_9fa48("791")) {
            {}
          } else {
            stryCov_9fa48("791");
            const registration = await navigator.serviceWorker.ready;
            const token = await getToken(messaging, stryMutAct_9fa48("792") ? {} : (stryCov_9fa48("792"), {
              vapidKey,
              serviceWorkerRegistration: registration
            }));
            return token;
          }
        } catch (err: unknown) {
          if (stryMutAct_9fa48("793")) {
            {}
          } else {
            stryCov_9fa48("793");
            const e = err instanceof Error ? err : new Error(String(err));
            const isRetryable = stryMutAct_9fa48("796") ? retries > 0 || e.message.includes('closing') || e.name === 'InvalidStateError' : stryMutAct_9fa48("795") ? false : stryMutAct_9fa48("794") ? true : (stryCov_9fa48("794", "795", "796"), (stryMutAct_9fa48("799") ? retries <= 0 : stryMutAct_9fa48("798") ? retries >= 0 : stryMutAct_9fa48("797") ? true : (stryCov_9fa48("797", "798", "799"), retries > 0)) && (stryMutAct_9fa48("801") ? e.message.includes('closing') && e.name === 'InvalidStateError' : stryMutAct_9fa48("800") ? true : (stryCov_9fa48("800", "801"), e.message.includes(stryMutAct_9fa48("802") ? "" : (stryCov_9fa48("802"), 'closing')) || (stryMutAct_9fa48("804") ? e.name !== 'InvalidStateError' : stryMutAct_9fa48("803") ? false : (stryCov_9fa48("803", "804"), e.name === (stryMutAct_9fa48("805") ? "" : (stryCov_9fa48("805"), 'InvalidStateError')))))));
            if (stryMutAct_9fa48("807") ? false : stryMutAct_9fa48("806") ? true : (stryCov_9fa48("806", "807"), isRetryable)) {
              if (stryMutAct_9fa48("808")) {
                {}
              } else {
                stryCov_9fa48("808");
                if (stryMutAct_9fa48("810") ? false : stryMutAct_9fa48("809") ? true : (stryCov_9fa48("809", "810"), import.meta.env.DEV)) console.warn(stryMutAct_9fa48("811") ? `` : (stryCov_9fa48("811"), `[Push] IDB timing error, retrying in ${delay}ms... (${retries} left)`));
                await new Promise(stryMutAct_9fa48("812") ? () => undefined : (stryCov_9fa48("812"), r => setTimeout(r, delay)));
                return attempt(stryMutAct_9fa48("813") ? retries + 1 : (stryCov_9fa48("813"), retries - 1), stryMutAct_9fa48("814") ? delay / 2 : (stryCov_9fa48("814"), delay * 2));
              }
            }
            throw e;
          }
        }
      }
    };
    return attempt(maxRetries, initialDelay);
  }
}