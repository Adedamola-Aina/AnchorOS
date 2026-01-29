/**
 * Money Utilities - Safe integer-based currency operations
 * 
 * All money is stored as integer CENTS (or kobo for NGN) to avoid
 * floating-point precision errors. Display functions convert back.
 */
// @ts-nocheck


/**
 * Convert a display amount (e.g., 10.50 or "10.50") to storage cents (1050)
 */function stryNS_9fa48() {
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
export const toCents = (displayAmount: number | string): number => {
  if (stryMutAct_9fa48("9174")) {
    {}
  } else {
    stryCov_9fa48("9174");
    if (stryMutAct_9fa48("9177") ? typeof displayAmount !== 'string' : stryMutAct_9fa48("9176") ? false : stryMutAct_9fa48("9175") ? true : (stryCov_9fa48("9175", "9176", "9177"), typeof displayAmount === (stryMutAct_9fa48("9178") ? "" : (stryCov_9fa48("9178"), 'string')))) {
      if (stryMutAct_9fa48("9179")) {
        {}
      } else {
        stryCov_9fa48("9179");
        let cleaned = displayAmount.replace(stryMutAct_9fa48("9181") ? /[$₦\S]/g : stryMutAct_9fa48("9180") ? /[^$₦\s]/g : (stryCov_9fa48("9180", "9181"), /[$₦\s]/g), stryMutAct_9fa48("9182") ? "Stryker was here!" : (stryCov_9fa48("9182"), '')); // Remove currency symbols and spaces

        // Handle European notation: if there's exactly one comma and no period, treat comma as decimal
        const commaCount = (stryMutAct_9fa48("9185") ? cleaned.match(/,/g) && [] : stryMutAct_9fa48("9184") ? false : stryMutAct_9fa48("9183") ? true : (stryCov_9fa48("9183", "9184", "9185"), cleaned.match(/,/g) || (stryMutAct_9fa48("9186") ? ["Stryker was here"] : (stryCov_9fa48("9186"), [])))).length;
        const periodCount = (stryMutAct_9fa48("9189") ? cleaned.match(/\./g) && [] : stryMutAct_9fa48("9188") ? false : stryMutAct_9fa48("9187") ? true : (stryCov_9fa48("9187", "9188", "9189"), cleaned.match(/\./g) || (stryMutAct_9fa48("9190") ? ["Stryker was here"] : (stryCov_9fa48("9190"), [])))).length;
        if (stryMutAct_9fa48("9193") ? commaCount === 1 || periodCount === 0 : stryMutAct_9fa48("9192") ? false : stryMutAct_9fa48("9191") ? true : (stryCov_9fa48("9191", "9192", "9193"), (stryMutAct_9fa48("9195") ? commaCount !== 1 : stryMutAct_9fa48("9194") ? true : (stryCov_9fa48("9194", "9195"), commaCount === 1)) && (stryMutAct_9fa48("9197") ? periodCount !== 0 : stryMutAct_9fa48("9196") ? true : (stryCov_9fa48("9196", "9197"), periodCount === 0)))) {
          if (stryMutAct_9fa48("9198")) {
            {}
          } else {
            stryCov_9fa48("9198");
            // European notation: "10,50" -> "10.50"
            cleaned = cleaned.replace(stryMutAct_9fa48("9199") ? "" : (stryCov_9fa48("9199"), ','), stryMutAct_9fa48("9200") ? "" : (stryCov_9fa48("9200"), '.'));
          }
        } else {
          if (stryMutAct_9fa48("9201")) {
            {}
          } else {
            stryCov_9fa48("9201");
            // US notation: "1,000.50" -> remove thousand separators
            cleaned = cleaned.replace(/,/g, stryMutAct_9fa48("9202") ? "Stryker was here!" : (stryCov_9fa48("9202"), ''));
          }
        }
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : Math.round(stryMutAct_9fa48("9203") ? parsed / 100 : (stryCov_9fa48("9203"), parsed * 100));
      }
    }
    return Math.round(stryMutAct_9fa48("9204") ? displayAmount / 100 : (stryCov_9fa48("9204"), displayAmount * 100));
  }
};

/**
 * Convert storage cents (1050) to display amount (10.50)
 */
export const fromCents = (cents: number): number => {
  if (stryMutAct_9fa48("9205")) {
    {}
  } else {
    stryCov_9fa48("9205");
    if (stryMutAct_9fa48("9208") ? false : stryMutAct_9fa48("9207") ? true : stryMutAct_9fa48("9206") ? cents : (stryCov_9fa48("9206", "9207", "9208"), !cents)) return 0;
    return stryMutAct_9fa48("9209") ? cents * 100 : (stryCov_9fa48("9209"), cents / 100);
  }
};

/**
 * Format cents as a currency string for display
 */
export const formatMoney = (cents: number, currency: 'USD' | 'NGN' = stryMutAct_9fa48("9210") ? "" : (stryCov_9fa48("9210"), 'USD')): string => {
  if (stryMutAct_9fa48("9211")) {
    {}
  } else {
    stryCov_9fa48("9211");
    const amount = fromCents(cents);
    const symbol = (stryMutAct_9fa48("9214") ? currency !== 'NGN' : stryMutAct_9fa48("9213") ? false : stryMutAct_9fa48("9212") ? true : (stryCov_9fa48("9212", "9213", "9214"), currency === (stryMutAct_9fa48("9215") ? "" : (stryCov_9fa48("9215"), 'NGN')))) ? stryMutAct_9fa48("9216") ? "" : (stryCov_9fa48("9216"), '₦') : stryMutAct_9fa48("9217") ? "" : (stryCov_9fa48("9217"), '$');
    return stryMutAct_9fa48("9218") ? `` : (stryCov_9fa48("9218"), `${symbol}${amount.toLocaleString(stryMutAct_9fa48("9219") ? "" : (stryCov_9fa48("9219"), 'en-US'), stryMutAct_9fa48("9220") ? {} : (stryCov_9fa48("9220"), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }))}`);
  }
};

/**
 * Safely add two money amounts (in cents)
 */
export const addMoney = (a: number, b: number): number => {
  if (stryMutAct_9fa48("9221")) {
    {}
  } else {
    stryCov_9fa48("9221");
    return stryMutAct_9fa48("9222") ? a - b : (stryCov_9fa48("9222"), a + b);
  }
};

/**
 * Safely subtract money amounts (in cents)
 */
export const subtractMoney = (a: number, b: number): number => {
  if (stryMutAct_9fa48("9223")) {
    {}
  } else {
    stryCov_9fa48("9223");
    return stryMutAct_9fa48("9224") ? a + b : (stryCov_9fa48("9224"), a - b);
  }
};

/**
 * Parse user input string to cents
 * Alias for toCents for semantic clarity in forms
 */
export const parseInputToCents = (input: string): number => {
  if (stryMutAct_9fa48("9225")) {
    {}
  } else {
    stryCov_9fa48("9225");
    return toCents(input);
  }
};