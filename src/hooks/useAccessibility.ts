/**
 * useAccessibility - Applies accessibility preferences to the document root.
 * Sets CSS classes for font-size scaling, high-contrast, and reduced-motion.
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
import { useEffect } from 'react';
import type { AccessibilityPreferences } from '../features/settings/components/AccessibilityControls';
const FONT_SIZE_MAP: Record<AccessibilityPreferences['fontSize'], string> = stryMutAct_9fa48("0") ? {} : (stryCov_9fa48("0"), {
  default: stryMutAct_9fa48("1") ? "Stryker was here!" : (stryCov_9fa48("1"), ''),
  large: stryMutAct_9fa48("2") ? "" : (stryCov_9fa48("2"), 'a11y-font-large'),
  xl: stryMutAct_9fa48("3") ? "" : (stryCov_9fa48("3"), 'a11y-font-xl')
});
export function useAccessibility(prefs?: AccessibilityPreferences): void {
  if (stryMutAct_9fa48("4")) {
    {}
  } else {
    stryCov_9fa48("4");
    useEffect(() => {
      if (stryMutAct_9fa48("5")) {
        {}
      } else {
        stryCov_9fa48("5");
        const root = document.documentElement;

        // Font size
        stryMutAct_9fa48("6") ? Object.values(FONT_SIZE_MAP).forEach(c => root.classList.remove(c)) : (stryCov_9fa48("6"), Object.values(FONT_SIZE_MAP).filter(Boolean).forEach(stryMutAct_9fa48("7") ? () => undefined : (stryCov_9fa48("7"), c => root.classList.remove(c))));
        const fontClass = FONT_SIZE_MAP[stryMutAct_9fa48("10") ? prefs?.fontSize && 'default' : stryMutAct_9fa48("9") ? false : stryMutAct_9fa48("8") ? true : (stryCov_9fa48("8", "9", "10"), (stryMutAct_9fa48("11") ? prefs.fontSize : (stryCov_9fa48("11"), prefs?.fontSize)) || (stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), 'default')))];
        if (stryMutAct_9fa48("14") ? false : stryMutAct_9fa48("13") ? true : (stryCov_9fa48("13", "14"), fontClass)) root.classList.add(fontClass);

        // High contrast
        root.classList.toggle(stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), 'a11y-high-contrast'), stryMutAct_9fa48("16") ? !prefs?.highContrast : (stryCov_9fa48("16"), !(stryMutAct_9fa48("17") ? prefs?.highContrast : (stryCov_9fa48("17"), !(stryMutAct_9fa48("18") ? prefs.highContrast : (stryCov_9fa48("18"), prefs?.highContrast))))));

        // Reduced motion
        root.classList.toggle(stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), 'a11y-reduced-motion'), stryMutAct_9fa48("20") ? !prefs?.reducedMotion : (stryCov_9fa48("20"), !(stryMutAct_9fa48("21") ? prefs?.reducedMotion : (stryCov_9fa48("21"), !(stryMutAct_9fa48("22") ? prefs.reducedMotion : (stryCov_9fa48("22"), prefs?.reducedMotion))))));
        return () => {
          if (stryMutAct_9fa48("23")) {
            {}
          } else {
            stryCov_9fa48("23");
            stryMutAct_9fa48("24") ? Object.values(FONT_SIZE_MAP).forEach(c => root.classList.remove(c)) : (stryCov_9fa48("24"), Object.values(FONT_SIZE_MAP).filter(Boolean).forEach(stryMutAct_9fa48("25") ? () => undefined : (stryCov_9fa48("25"), c => root.classList.remove(c))));
            root.classList.remove(stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), 'a11y-high-contrast'), stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), 'a11y-reduced-motion'));
          }
        };
      }
    }, stryMutAct_9fa48("28") ? [] : (stryCov_9fa48("28"), [stryMutAct_9fa48("29") ? prefs.fontSize : (stryCov_9fa48("29"), prefs?.fontSize), stryMutAct_9fa48("30") ? prefs.highContrast : (stryCov_9fa48("30"), prefs?.highContrast), stryMutAct_9fa48("31") ? prefs.reducedMotion : (stryCov_9fa48("31"), prefs?.reducedMotion)]));
  }
}