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
import type { Currency } from '../types';
export const formatCurrency = (amount: number, currency: Currency) => {
  if (stryMutAct_9fa48("1534")) {
    {}
  } else {
    stryCov_9fa48("1534");
    const locale = (stryMutAct_9fa48("1537") ? currency !== 'NGN' : stryMutAct_9fa48("1536") ? false : stryMutAct_9fa48("1535") ? true : (stryCov_9fa48("1535", "1536", "1537"), currency === (stryMutAct_9fa48("1538") ? "" : (stryCov_9fa48("1538"), 'NGN')))) ? stryMutAct_9fa48("1539") ? "" : (stryCov_9fa48("1539"), 'en-NG') : stryMutAct_9fa48("1540") ? "" : (stryCov_9fa48("1540"), 'en-US');
    return new Intl.NumberFormat(locale, stryMutAct_9fa48("1541") ? {} : (stryCov_9fa48("1541"), {
      style: stryMutAct_9fa48("1542") ? "" : (stryCov_9fa48("1542"), 'currency'),
      currency: currency,
      minimumFractionDigits: 2
    })).format(amount);
  }
};

/**
 * Format currency with smart abbreviations for large numbers.
 * 
 * UX-019 FIX: Prevents UI overflow with large financial amounts.
 * - Numbers < 10K: Full format (₦9,999.00)
 * - Numbers >= 10K: Abbreviated (₦12.5K, ₦1.2M, ₦3.4B)
 * - Preserves precision with decimal for abbreviated numbers
 * 
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param options - Formatting options
 * @returns Formatted currency string with abbreviation if needed
 */
export const formatCurrencyCompact = (amount: number, currency: Currency, options?: {
  /** Force abbreviation even for small numbers */
  forceCompact?: boolean;
  /** Threshold for abbreviation (default: 10000) */
  compactThreshold?: number;
  /** Maximum decimal places for abbreviated numbers (default: 1) */
  maxDecimals?: number;
}) => {
  if (stryMutAct_9fa48("1543")) {
    {}
  } else {
    stryCov_9fa48("1543");
    const threshold = stryMutAct_9fa48("1544") ? options?.compactThreshold && 10000 : (stryCov_9fa48("1544"), (stryMutAct_9fa48("1545") ? options.compactThreshold : (stryCov_9fa48("1545"), options?.compactThreshold)) ?? 10000);
    const maxDecimals = stryMutAct_9fa48("1546") ? options?.maxDecimals && 1 : (stryCov_9fa48("1546"), (stryMutAct_9fa48("1547") ? options.maxDecimals : (stryCov_9fa48("1547"), options?.maxDecimals)) ?? 1);
    const absAmount = Math.abs(amount);

    // Use full format for small numbers (unless forced)
    if (stryMutAct_9fa48("1550") ? !options?.forceCompact || absAmount < threshold : stryMutAct_9fa48("1549") ? false : stryMutAct_9fa48("1548") ? true : (stryCov_9fa48("1548", "1549", "1550"), (stryMutAct_9fa48("1551") ? options?.forceCompact : (stryCov_9fa48("1551"), !(stryMutAct_9fa48("1552") ? options.forceCompact : (stryCov_9fa48("1552"), options?.forceCompact)))) && (stryMutAct_9fa48("1555") ? absAmount >= threshold : stryMutAct_9fa48("1554") ? absAmount <= threshold : stryMutAct_9fa48("1553") ? true : (stryCov_9fa48("1553", "1554", "1555"), absAmount < threshold)))) {
      if (stryMutAct_9fa48("1556")) {
        {}
      } else {
        stryCov_9fa48("1556");
        return formatCurrency(amount, currency);
      }
    }

    // Determine abbreviation
    let abbreviated: string;
    let suffix: string;
    if (stryMutAct_9fa48("1560") ? absAmount < 1_000_000_000 : stryMutAct_9fa48("1559") ? absAmount > 1_000_000_000 : stryMutAct_9fa48("1558") ? false : stryMutAct_9fa48("1557") ? true : (stryCov_9fa48("1557", "1558", "1559", "1560"), absAmount >= 1_000_000_000)) {
      if (stryMutAct_9fa48("1561")) {
        {}
      } else {
        stryCov_9fa48("1561");
        // Billions
        abbreviated = (stryMutAct_9fa48("1562") ? amount * 1_000_000_000 : (stryCov_9fa48("1562"), amount / 1_000_000_000)).toFixed(maxDecimals);
        suffix = stryMutAct_9fa48("1563") ? "" : (stryCov_9fa48("1563"), 'B');
      }
    } else if (stryMutAct_9fa48("1567") ? absAmount < 1_000_000 : stryMutAct_9fa48("1566") ? absAmount > 1_000_000 : stryMutAct_9fa48("1565") ? false : stryMutAct_9fa48("1564") ? true : (stryCov_9fa48("1564", "1565", "1566", "1567"), absAmount >= 1_000_000)) {
      if (stryMutAct_9fa48("1568")) {
        {}
      } else {
        stryCov_9fa48("1568");
        // Millions
        abbreviated = (stryMutAct_9fa48("1569") ? amount * 1_000_000 : (stryCov_9fa48("1569"), amount / 1_000_000)).toFixed(maxDecimals);
        suffix = stryMutAct_9fa48("1570") ? "" : (stryCov_9fa48("1570"), 'M');
      }
    } else {
      if (stryMutAct_9fa48("1571")) {
        {}
      } else {
        stryCov_9fa48("1571");
        // Thousands (or forced compact for small numbers)
        abbreviated = (stryMutAct_9fa48("1572") ? amount * 1_000 : (stryCov_9fa48("1572"), amount / 1_000)).toFixed(maxDecimals);
        suffix = stryMutAct_9fa48("1573") ? "" : (stryCov_9fa48("1573"), 'K');
      }
    }

    // Remove trailing zeros after decimal
    abbreviated = abbreviated.replace(stryMutAct_9fa48("1575") ? /\.0$/ : stryMutAct_9fa48("1574") ? /\.0+/ : (stryCov_9fa48("1574", "1575"), /\.0+$/), stryMutAct_9fa48("1576") ? "Stryker was here!" : (stryCov_9fa48("1576"), ''));

    // Get currency symbol
    const locale = (stryMutAct_9fa48("1579") ? currency !== 'NGN' : stryMutAct_9fa48("1578") ? false : stryMutAct_9fa48("1577") ? true : (stryCov_9fa48("1577", "1578", "1579"), currency === (stryMutAct_9fa48("1580") ? "" : (stryCov_9fa48("1580"), 'NGN')))) ? stryMutAct_9fa48("1581") ? "" : (stryCov_9fa48("1581"), 'en-NG') : stryMutAct_9fa48("1582") ? "" : (stryCov_9fa48("1582"), 'en-US');
    const formatter = new Intl.NumberFormat(locale, stryMutAct_9fa48("1583") ? {} : (stryCov_9fa48("1583"), {
      style: stryMutAct_9fa48("1584") ? "" : (stryCov_9fa48("1584"), 'currency'),
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }));

    // Extract symbol (e.g., "₦" or "$")
    const parts = formatter.formatToParts(0);
    const symbol = stryMutAct_9fa48("1587") ? parts.find(p => p.type === 'currency')?.value && '' : stryMutAct_9fa48("1586") ? false : stryMutAct_9fa48("1585") ? true : (stryCov_9fa48("1585", "1586", "1587"), (stryMutAct_9fa48("1588") ? parts.find(p => p.type === 'currency').value : (stryCov_9fa48("1588"), parts.find(stryMutAct_9fa48("1589") ? () => undefined : (stryCov_9fa48("1589"), p => stryMutAct_9fa48("1592") ? p.type !== 'currency' : stryMutAct_9fa48("1591") ? false : stryMutAct_9fa48("1590") ? true : (stryCov_9fa48("1590", "1591", "1592"), p.type === (stryMutAct_9fa48("1593") ? "" : (stryCov_9fa48("1593"), 'currency')))))?.value)) || (stryMutAct_9fa48("1594") ? "Stryker was here!" : (stryCov_9fa48("1594"), '')));
    return stryMutAct_9fa48("1595") ? `` : (stryCov_9fa48("1595"), `${symbol}${abbreviated}${suffix}`);
  }
};

/**
 * Get appropriate font size class based on number magnitude.
 * 
 * UX-019 FIX: Dynamic font sizing prevents overflow.
 * - Small numbers (< 100K): text-lg
 * - Medium numbers (100K - 1M): text-base
 * - Large numbers (> 1M): text-sm
 * 
 * @param amount - The amount to check
 * @returns Tailwind font size class
 */
export const getDynamicFontSize = (amount: number): string => {
  if (stryMutAct_9fa48("1596")) {
    {}
  } else {
    stryCov_9fa48("1596");
    const absAmount = Math.abs(amount);
    if (stryMutAct_9fa48("1600") ? absAmount < 1_000_000 : stryMutAct_9fa48("1599") ? absAmount > 1_000_000 : stryMutAct_9fa48("1598") ? false : stryMutAct_9fa48("1597") ? true : (stryCov_9fa48("1597", "1598", "1599", "1600"), absAmount >= 1_000_000)) {
      if (stryMutAct_9fa48("1601")) {
        {}
      } else {
        stryCov_9fa48("1601");
        return stryMutAct_9fa48("1602") ? "" : (stryCov_9fa48("1602"), 'text-sm'); // Large numbers
      }
    } else if (stryMutAct_9fa48("1606") ? absAmount < 100_000 : stryMutAct_9fa48("1605") ? absAmount > 100_000 : stryMutAct_9fa48("1604") ? false : stryMutAct_9fa48("1603") ? true : (stryCov_9fa48("1603", "1604", "1605", "1606"), absAmount >= 100_000)) {
      if (stryMutAct_9fa48("1607")) {
        {}
      } else {
        stryCov_9fa48("1607");
        return stryMutAct_9fa48("1608") ? "" : (stryCov_9fa48("1608"), 'text-base'); // Medium numbers
      }
    } else {
      if (stryMutAct_9fa48("1609")) {
        {}
      } else {
        stryCov_9fa48("1609");
        return stryMutAct_9fa48("1610") ? "" : (stryCov_9fa48("1610"), 'text-lg'); // Small numbers (default)
      }
    }
  }
};