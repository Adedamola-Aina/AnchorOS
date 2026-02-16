/**
 * System Theme Detection Utility (PWA-006)
 * 
 * Detects and monitors system color scheme preference on iOS/Android/Desktop.
 * Uses prefers-color-scheme media query for cross-platform support.
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
export type Theme = 'light' | 'dark';

/**
 * Get the current system theme preference
 * Works on iOS, Android, macOS, Windows
 */
export function getSystemTheme(): Theme {
  if (stryMutAct_9fa48("2016")) {
    {}
  } else {
    stryCov_9fa48("2016");
    if (stryMutAct_9fa48("2019") ? typeof window !== 'undefined' : stryMutAct_9fa48("2018") ? false : stryMutAct_9fa48("2017") ? true : (stryCov_9fa48("2017", "2018", "2019"), typeof window === (stryMutAct_9fa48("2020") ? "" : (stryCov_9fa48("2020"), 'undefined')))) return stryMutAct_9fa48("2021") ? "" : (stryCov_9fa48("2021"), 'light');
    const mediaQuery = window.matchMedia(stryMutAct_9fa48("2022") ? "" : (stryCov_9fa48("2022"), '(prefers-color-scheme: dark)'));
    return mediaQuery.matches ? stryMutAct_9fa48("2023") ? "" : (stryCov_9fa48("2023"), 'dark') : stryMutAct_9fa48("2024") ? "" : (stryCov_9fa48("2024"), 'light');
  }
}

/**
 * Get the effective theme to use
 * Priority: localStorage > system preference > 'light' fallback
 */
export function getEffectiveTheme(): Theme {
  if (stryMutAct_9fa48("2025")) {
    {}
  } else {
    stryCov_9fa48("2025");
    if (stryMutAct_9fa48("2028") ? typeof window !== 'undefined' : stryMutAct_9fa48("2027") ? false : stryMutAct_9fa48("2026") ? true : (stryCov_9fa48("2026", "2027", "2028"), typeof window === (stryMutAct_9fa48("2029") ? "" : (stryCov_9fa48("2029"), 'undefined')))) return stryMutAct_9fa48("2030") ? "" : (stryCov_9fa48("2030"), 'light');
    const savedTheme = localStorage.getItem('anchor_theme') as Theme | null;
    if (stryMutAct_9fa48("2033") ? savedTheme === 'light' && savedTheme === 'dark' : stryMutAct_9fa48("2032") ? false : stryMutAct_9fa48("2031") ? true : (stryCov_9fa48("2031", "2032", "2033"), (stryMutAct_9fa48("2035") ? savedTheme !== 'light' : stryMutAct_9fa48("2034") ? false : (stryCov_9fa48("2034", "2035"), savedTheme === (stryMutAct_9fa48("2036") ? "" : (stryCov_9fa48("2036"), 'light')))) || (stryMutAct_9fa48("2038") ? savedTheme !== 'dark' : stryMutAct_9fa48("2037") ? false : (stryCov_9fa48("2037", "2038"), savedTheme === (stryMutAct_9fa48("2039") ? "" : (stryCov_9fa48("2039"), 'dark')))))) {
      if (stryMutAct_9fa48("2040")) {
        {}
      } else {
        stryCov_9fa48("2040");
        return savedTheme;
      }
    }

    // No saved preference - use system theme
    return getSystemTheme();
  }
}

/**
 * Subscribe to system theme changes
 * Useful for updating UI when user changes device settings
 * 
 * @param callback Function called when system theme changes
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToSystemTheme(callback: (theme: Theme) => void): () => void {
  if (stryMutAct_9fa48("2041")) {
    {}
  } else {
    stryCov_9fa48("2041");
    if (stryMutAct_9fa48("2044") ? typeof window !== 'undefined' : stryMutAct_9fa48("2043") ? false : stryMutAct_9fa48("2042") ? true : (stryCov_9fa48("2042", "2043", "2044"), typeof window === (stryMutAct_9fa48("2045") ? "" : (stryCov_9fa48("2045"), 'undefined')))) return () => {};
    const mediaQuery = window.matchMedia(stryMutAct_9fa48("2046") ? "" : (stryCov_9fa48("2046"), '(prefers-color-scheme: dark)'));
    const handler = (e: MediaQueryListEvent) => {
      if (stryMutAct_9fa48("2047")) {
        {}
      } else {
        stryCov_9fa48("2047");
        callback(e.matches ? stryMutAct_9fa48("2048") ? "" : (stryCov_9fa48("2048"), 'dark') : stryMutAct_9fa48("2049") ? "" : (stryCov_9fa48("2049"), 'light'));
      }
    };

    // Modern browsers
    if (stryMutAct_9fa48("2051") ? false : stryMutAct_9fa48("2050") ? true : (stryCov_9fa48("2050", "2051"), mediaQuery.addEventListener)) {
      if (stryMutAct_9fa48("2052")) {
        {}
      } else {
        stryCov_9fa48("2052");
        mediaQuery.addEventListener(stryMutAct_9fa48("2053") ? "" : (stryCov_9fa48("2053"), 'change'), handler);
        return stryMutAct_9fa48("2054") ? () => undefined : (stryCov_9fa48("2054"), () => mediaQuery.removeEventListener(stryMutAct_9fa48("2055") ? "" : (stryCov_9fa48("2055"), 'change'), handler));
      }
    }

    // Legacy Safari (iOS 13 and earlier)
    mediaQuery.addListener(handler);
    return stryMutAct_9fa48("2056") ? () => undefined : (stryCov_9fa48("2056"), () => mediaQuery.removeListener(handler));
  }
}

/**
 * Check if user has explicitly set a theme preference
 */
export function hasUserThemePreference(): boolean {
  if (stryMutAct_9fa48("2057")) {
    {}
  } else {
    stryCov_9fa48("2057");
    if (stryMutAct_9fa48("2060") ? typeof window !== 'undefined' : stryMutAct_9fa48("2059") ? false : stryMutAct_9fa48("2058") ? true : (stryCov_9fa48("2058", "2059", "2060"), typeof window === (stryMutAct_9fa48("2061") ? "" : (stryCov_9fa48("2061"), 'undefined')))) return stryMutAct_9fa48("2062") ? true : (stryCov_9fa48("2062"), false);
    const saved = localStorage.getItem(stryMutAct_9fa48("2063") ? "" : (stryCov_9fa48("2063"), 'anchor_theme'));
    return stryMutAct_9fa48("2066") ? saved === 'light' && saved === 'dark' : stryMutAct_9fa48("2065") ? false : stryMutAct_9fa48("2064") ? true : (stryCov_9fa48("2064", "2065", "2066"), (stryMutAct_9fa48("2068") ? saved !== 'light' : stryMutAct_9fa48("2067") ? false : (stryCov_9fa48("2067", "2068"), saved === (stryMutAct_9fa48("2069") ? "" : (stryCov_9fa48("2069"), 'light')))) || (stryMutAct_9fa48("2071") ? saved !== 'dark' : stryMutAct_9fa48("2070") ? false : (stryCov_9fa48("2070", "2071"), saved === (stryMutAct_9fa48("2072") ? "" : (stryCov_9fa48("2072"), 'dark')))));
  }
}

/**
 * Clear user's theme preference (revert to system theme)
 */
export function clearThemePreference(): void {
  if (stryMutAct_9fa48("2073")) {
    {}
  } else {
    stryCov_9fa48("2073");
    if (stryMutAct_9fa48("2076") ? typeof window === 'undefined' : stryMutAct_9fa48("2075") ? false : stryMutAct_9fa48("2074") ? true : (stryCov_9fa48("2074", "2075", "2076"), typeof window !== (stryMutAct_9fa48("2077") ? "" : (stryCov_9fa48("2077"), 'undefined')))) {
      if (stryMutAct_9fa48("2078")) {
        {}
      } else {
        stryCov_9fa48("2078");
        localStorage.removeItem(stryMutAct_9fa48("2079") ? "" : (stryCov_9fa48("2079"), 'anchor_theme'));
      }
    }
  }
}