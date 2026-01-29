/**
 * useResponsive - Single source of truth for device detection
 * 
 * This hook provides reactive breakpoint detection for adaptive UI patterns.
 * Use this instead of CSS-only media queries when you need JS-driven layout decisions.
 * 
 * Breakpoints align with Tailwind defaults:
 * - mobile: < 768px (md breakpoint)
 * - tablet: 768px - 1023px
 * - desktop: >= 1024px (lg breakpoint)
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
import { useState, useEffect } from 'react';
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
interface ResponsiveState {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** True for both mobile and tablet (< 1024px) */
  isTouchDevice: boolean;
}
export function useResponsive(): ResponsiveState {
  if (stryMutAct_9fa48("7734")) {
    {}
  } else {
    stryCov_9fa48("7734");
    const [state, setState] = useState<ResponsiveState>(stryMutAct_9fa48("7735") ? () => undefined : (stryCov_9fa48("7735"), () => getResponsiveState()));
    useEffect(() => {
      if (stryMutAct_9fa48("7736")) {
        {}
      } else {
        stryCov_9fa48("7736");
        const handleResize = () => {
          if (stryMutAct_9fa48("7737")) {
            {}
          } else {
            stryCov_9fa48("7737");
            setState(getResponsiveState());
          }
        };

        // Use matchMedia for better performance than resize events
        const mobileQuery = window.matchMedia(stryMutAct_9fa48("7738") ? "" : (stryCov_9fa48("7738"), '(max-width: 767px)'));
        const tabletQuery = window.matchMedia(stryMutAct_9fa48("7739") ? "" : (stryCov_9fa48("7739"), '(min-width: 768px) and (max-width: 1023px)'));

        // Modern browsers support addEventListener on matchMedia
        mobileQuery.addEventListener(stryMutAct_9fa48("7740") ? "" : (stryCov_9fa48("7740"), 'change'), handleResize);
        tabletQuery.addEventListener(stryMutAct_9fa48("7741") ? "" : (stryCov_9fa48("7741"), 'change'), handleResize);
        return () => {
          if (stryMutAct_9fa48("7742")) {
            {}
          } else {
            stryCov_9fa48("7742");
            mobileQuery.removeEventListener(stryMutAct_9fa48("7743") ? "" : (stryCov_9fa48("7743"), 'change'), handleResize);
            tabletQuery.removeEventListener(stryMutAct_9fa48("7744") ? "" : (stryCov_9fa48("7744"), 'change'), handleResize);
          }
        };
      }
    }, stryMutAct_9fa48("7745") ? ["Stryker was here"] : (stryCov_9fa48("7745"), []));
    return state;
  }
}

/**
 * Calculates current responsive state based on window width.
 * SSR-safe: defaults to desktop when window is undefined.
 * 
 * @returns ResponsiveState object with breakpoint flags
 */
function getResponsiveState(): ResponsiveState {
  if (stryMutAct_9fa48("7746")) {
    {}
  } else {
    stryCov_9fa48("7746");
    // SSR safety - default to desktop
    if (stryMutAct_9fa48("7749") ? typeof window !== 'undefined' : stryMutAct_9fa48("7748") ? false : stryMutAct_9fa48("7747") ? true : (stryCov_9fa48("7747", "7748", "7749"), typeof window === (stryMutAct_9fa48("7750") ? "" : (stryCov_9fa48("7750"), 'undefined')))) {
      if (stryMutAct_9fa48("7751")) {
        {}
      } else {
        stryCov_9fa48("7751");
        return stryMutAct_9fa48("7752") ? {} : (stryCov_9fa48("7752"), {
          breakpoint: stryMutAct_9fa48("7753") ? "" : (stryCov_9fa48("7753"), 'desktop'),
          isMobile: stryMutAct_9fa48("7754") ? true : (stryCov_9fa48("7754"), false),
          isTablet: stryMutAct_9fa48("7755") ? true : (stryCov_9fa48("7755"), false),
          isDesktop: stryMutAct_9fa48("7756") ? false : (stryCov_9fa48("7756"), true),
          isTouchDevice: stryMutAct_9fa48("7757") ? true : (stryCov_9fa48("7757"), false)
        });
      }
    }
    const width = window.innerWidth;
    if (stryMutAct_9fa48("7761") ? width >= 768 : stryMutAct_9fa48("7760") ? width <= 768 : stryMutAct_9fa48("7759") ? false : stryMutAct_9fa48("7758") ? true : (stryCov_9fa48("7758", "7759", "7760", "7761"), width < 768)) {
      if (stryMutAct_9fa48("7762")) {
        {}
      } else {
        stryCov_9fa48("7762");
        return stryMutAct_9fa48("7763") ? {} : (stryCov_9fa48("7763"), {
          breakpoint: stryMutAct_9fa48("7764") ? "" : (stryCov_9fa48("7764"), 'mobile'),
          isMobile: stryMutAct_9fa48("7765") ? false : (stryCov_9fa48("7765"), true),
          isTablet: stryMutAct_9fa48("7766") ? true : (stryCov_9fa48("7766"), false),
          isDesktop: stryMutAct_9fa48("7767") ? true : (stryCov_9fa48("7767"), false),
          isTouchDevice: stryMutAct_9fa48("7768") ? false : (stryCov_9fa48("7768"), true)
        });
      }
    }
    if (stryMutAct_9fa48("7772") ? width >= 1024 : stryMutAct_9fa48("7771") ? width <= 1024 : stryMutAct_9fa48("7770") ? false : stryMutAct_9fa48("7769") ? true : (stryCov_9fa48("7769", "7770", "7771", "7772"), width < 1024)) {
      if (stryMutAct_9fa48("7773")) {
        {}
      } else {
        stryCov_9fa48("7773");
        return stryMutAct_9fa48("7774") ? {} : (stryCov_9fa48("7774"), {
          breakpoint: stryMutAct_9fa48("7775") ? "" : (stryCov_9fa48("7775"), 'tablet'),
          isMobile: stryMutAct_9fa48("7776") ? true : (stryCov_9fa48("7776"), false),
          isTablet: stryMutAct_9fa48("7777") ? false : (stryCov_9fa48("7777"), true),
          isDesktop: stryMutAct_9fa48("7778") ? true : (stryCov_9fa48("7778"), false),
          isTouchDevice: stryMutAct_9fa48("7779") ? false : (stryCov_9fa48("7779"), true)
        });
      }
    }
    return stryMutAct_9fa48("7780") ? {} : (stryCov_9fa48("7780"), {
      breakpoint: stryMutAct_9fa48("7781") ? "" : (stryCov_9fa48("7781"), 'desktop'),
      isMobile: stryMutAct_9fa48("7782") ? true : (stryCov_9fa48("7782"), false),
      isTablet: stryMutAct_9fa48("7783") ? true : (stryCov_9fa48("7783"), false),
      isDesktop: stryMutAct_9fa48("7784") ? false : (stryCov_9fa48("7784"), true),
      isTouchDevice: stryMutAct_9fa48("7785") ? true : (stryCov_9fa48("7785"), false)
    });
  }
}
export default useResponsive;