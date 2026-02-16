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
  if (stryMutAct_9fa48("1621")) {
    {}
  } else {
    stryCov_9fa48("1621");
    if (stryMutAct_9fa48("1624") ? typeof displayAmount !== 'string' : stryMutAct_9fa48("1623") ? false : stryMutAct_9fa48("1622") ? true : (stryCov_9fa48("1622", "1623", "1624"), typeof displayAmount === (stryMutAct_9fa48("1625") ? "" : (stryCov_9fa48("1625"), 'string')))) {
      if (stryMutAct_9fa48("1626")) {
        {}
      } else {
        stryCov_9fa48("1626");
        let cleaned = displayAmount.replace(stryMutAct_9fa48("1628") ? /[$₦\S]/g : stryMutAct_9fa48("1627") ? /[^$₦\s]/g : (stryCov_9fa48("1627", "1628"), /[$₦\s]/g), stryMutAct_9fa48("1629") ? "Stryker was here!" : (stryCov_9fa48("1629"), '')); // Remove currency symbols and spaces

        // Handle European notation: if there's exactly one comma and no period, treat comma as decimal
        const commaCount = (stryMutAct_9fa48("1632") ? cleaned.match(/,/g) && [] : stryMutAct_9fa48("1631") ? false : stryMutAct_9fa48("1630") ? true : (stryCov_9fa48("1630", "1631", "1632"), cleaned.match(/,/g) || (stryMutAct_9fa48("1633") ? ["Stryker was here"] : (stryCov_9fa48("1633"), [])))).length;
        const periodCount = (stryMutAct_9fa48("1636") ? cleaned.match(/\./g) && [] : stryMutAct_9fa48("1635") ? false : stryMutAct_9fa48("1634") ? true : (stryCov_9fa48("1634", "1635", "1636"), cleaned.match(/\./g) || (stryMutAct_9fa48("1637") ? ["Stryker was here"] : (stryCov_9fa48("1637"), [])))).length;
        if (stryMutAct_9fa48("1640") ? commaCount === 1 || periodCount === 0 : stryMutAct_9fa48("1639") ? false : stryMutAct_9fa48("1638") ? true : (stryCov_9fa48("1638", "1639", "1640"), (stryMutAct_9fa48("1642") ? commaCount !== 1 : stryMutAct_9fa48("1641") ? true : (stryCov_9fa48("1641", "1642"), commaCount === 1)) && (stryMutAct_9fa48("1644") ? periodCount !== 0 : stryMutAct_9fa48("1643") ? true : (stryCov_9fa48("1643", "1644"), periodCount === 0)))) {
          if (stryMutAct_9fa48("1645")) {
            {}
          } else {
            stryCov_9fa48("1645");
            // European notation: "10,50" -> "10.50"
            cleaned = cleaned.replace(stryMutAct_9fa48("1646") ? "" : (stryCov_9fa48("1646"), ','), stryMutAct_9fa48("1647") ? "" : (stryCov_9fa48("1647"), '.'));
          }
        } else {
          if (stryMutAct_9fa48("1648")) {
            {}
          } else {
            stryCov_9fa48("1648");
            // US notation: "1,000.50" -> remove thousand separators
            cleaned = cleaned.replace(/,/g, stryMutAct_9fa48("1649") ? "Stryker was here!" : (stryCov_9fa48("1649"), ''));
          }
        }
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : Math.round(stryMutAct_9fa48("1650") ? parsed / 100 : (stryCov_9fa48("1650"), parsed * 100));
      }
    }
    return Math.round(stryMutAct_9fa48("1651") ? displayAmount / 100 : (stryCov_9fa48("1651"), displayAmount * 100));
  }
};

/**
 * Convert storage cents (1050) to display amount (10.50)
 */
export const fromCents = (cents: number): number => {
  if (stryMutAct_9fa48("1652")) {
    {}
  } else {
    stryCov_9fa48("1652");
    if (stryMutAct_9fa48("1655") ? false : stryMutAct_9fa48("1654") ? true : stryMutAct_9fa48("1653") ? cents : (stryCov_9fa48("1653", "1654", "1655"), !cents)) return 0;
    return stryMutAct_9fa48("1656") ? cents * 100 : (stryCov_9fa48("1656"), cents / 100);
  }
};

/**
 * Format cents as a currency string for display
 */
export const formatMoney = (cents: number, currency: 'USD' | 'NGN' = stryMutAct_9fa48("1657") ? "" : (stryCov_9fa48("1657"), 'USD')): string => {
  if (stryMutAct_9fa48("1658")) {
    {}
  } else {
    stryCov_9fa48("1658");
    const amount = fromCents(cents);
    const symbol = (stryMutAct_9fa48("1661") ? currency !== 'NGN' : stryMutAct_9fa48("1660") ? false : stryMutAct_9fa48("1659") ? true : (stryCov_9fa48("1659", "1660", "1661"), currency === (stryMutAct_9fa48("1662") ? "" : (stryCov_9fa48("1662"), 'NGN')))) ? stryMutAct_9fa48("1663") ? "" : (stryCov_9fa48("1663"), '₦') : stryMutAct_9fa48("1664") ? "" : (stryCov_9fa48("1664"), '$');
    return stryMutAct_9fa48("1665") ? `` : (stryCov_9fa48("1665"), `${symbol}${amount.toLocaleString(stryMutAct_9fa48("1666") ? "" : (stryCov_9fa48("1666"), 'en-US'), stryMutAct_9fa48("1667") ? {} : (stryCov_9fa48("1667"), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }))}`);
  }
};

/**
 * Safely add two money amounts (in cents)
 */
export const addMoney = (a: number, b: number): number => {
  if (stryMutAct_9fa48("1668")) {
    {}
  } else {
    stryCov_9fa48("1668");
    return stryMutAct_9fa48("1669") ? a - b : (stryCov_9fa48("1669"), a + b);
  }
};

/**
 * Safely subtract money amounts (in cents)
 */
export const subtractMoney = (a: number, b: number): number => {
  if (stryMutAct_9fa48("1670")) {
    {}
  } else {
    stryCov_9fa48("1670");
    return stryMutAct_9fa48("1671") ? a + b : (stryCov_9fa48("1671"), a - b);
  }
};

/**
 * Parse user input string to cents
 * Alias for toCents for semantic clarity in forms
 */
export const parseInputToCents = (input: string): number => {
  if (stryMutAct_9fa48("1672")) {
    {}
  } else {
    stryCov_9fa48("1672");
    return toCents(input);
  }
};