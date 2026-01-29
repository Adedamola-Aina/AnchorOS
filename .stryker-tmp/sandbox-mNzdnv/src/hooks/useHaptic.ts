/**
 * useHaptic - Centralized haptic feedback hook
 * 
 * Provides consistent haptic patterns across the app for key interactions.
 * Uses the Navigator Vibration API with graceful fallback.
 * 
 * Patterns are designed following Calm Computing philosophy:
 * - Light: subtle confirmation (e.g., button press)
 * - Medium: standard feedback (e.g., selection change)
 * - Heavy: important action (e.g., destructive action)
 * - Error: failure notification
 * - Success: completion confirmation
 * 
 * @module hooks/useHaptic
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
import { useCallback, useMemo } from 'react';
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'error' | 'success';
interface HapticOptions {
  /** Whether haptic feedback is enabled. Default: true */
  enabled?: boolean;
}
interface HapticResult {
  /** Trigger a haptic pattern */
  trigger: (pattern: HapticPattern) => void;
  /** Whether haptic is enabled */
  isEnabled: boolean;
  /** Whether the device supports vibration */
  isSupported: boolean;
}

// Pattern definitions (in milliseconds)
const PATTERNS: Record<HapticPattern, number | number[]> = stryMutAct_9fa48("7671") ? {} : (stryCov_9fa48("7671"), {
  light: 10,
  medium: 25,
  heavy: 50,
  error: stryMutAct_9fa48("7672") ? [] : (stryCov_9fa48("7672"), [50, 50, 50, 50, 50]),
  // Triple pulse for error
  success: stryMutAct_9fa48("7673") ? [] : (stryCov_9fa48("7673"), [15, 50, 15]) // Double tap for success
});
export function useHaptic(options: HapticOptions = {}): HapticResult {
  if (stryMutAct_9fa48("7674")) {
    {}
  } else {
    stryCov_9fa48("7674");
    const {
      enabled = stryMutAct_9fa48("7675") ? false : (stryCov_9fa48("7675"), true)
    } = options;
    const isSupported = useMemo(() => {
      if (stryMutAct_9fa48("7676")) {
        {}
      } else {
        stryCov_9fa48("7676");
        return stryMutAct_9fa48("7679") ? typeof navigator !== 'undefined' || typeof navigator.vibrate === 'function' : stryMutAct_9fa48("7678") ? false : stryMutAct_9fa48("7677") ? true : (stryCov_9fa48("7677", "7678", "7679"), (stryMutAct_9fa48("7681") ? typeof navigator === 'undefined' : stryMutAct_9fa48("7680") ? true : (stryCov_9fa48("7680", "7681"), typeof navigator !== (stryMutAct_9fa48("7682") ? "" : (stryCov_9fa48("7682"), 'undefined')))) && (stryMutAct_9fa48("7684") ? typeof navigator.vibrate !== 'function' : stryMutAct_9fa48("7683") ? true : (stryCov_9fa48("7683", "7684"), typeof navigator.vibrate === (stryMutAct_9fa48("7685") ? "" : (stryCov_9fa48("7685"), 'function')))));
      }
    }, stryMutAct_9fa48("7686") ? ["Stryker was here"] : (stryCov_9fa48("7686"), []));
    const trigger = useCallback((pattern: HapticPattern) => {
      if (stryMutAct_9fa48("7687")) {
        {}
      } else {
        stryCov_9fa48("7687");
        if (stryMutAct_9fa48("7690") ? !enabled && !isSupported : stryMutAct_9fa48("7689") ? false : stryMutAct_9fa48("7688") ? true : (stryCov_9fa48("7688", "7689", "7690"), (stryMutAct_9fa48("7691") ? enabled : (stryCov_9fa48("7691"), !enabled)) || (stryMutAct_9fa48("7692") ? isSupported : (stryCov_9fa48("7692"), !isSupported)))) return;
        try {
          if (stryMutAct_9fa48("7693")) {
            {}
          } else {
            stryCov_9fa48("7693");
            navigator.vibrate(PATTERNS[pattern]);
          }
        } catch {
          // Silently fail if vibration fails
          // This can happen on some browsers/devices
        }
      }
    }, stryMutAct_9fa48("7694") ? [] : (stryCov_9fa48("7694"), [enabled, isSupported]));
    return stryMutAct_9fa48("7695") ? {} : (stryCov_9fa48("7695"), {
      trigger,
      isEnabled: enabled,
      isSupported
    });
  }
}