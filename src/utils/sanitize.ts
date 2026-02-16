/**
 * Sanitization Utilities
 * 
 * HTML entity encoding for defense-in-depth XSS protection.
 * React already escapes output, but this adds an extra layer of safety
 * for data that might be used in non-React contexts (emails, exports, etc).
 */
// @ts-nocheck


/**
 * Encode HTML special characters to prevent XSS.
 * Uses negative lookahead to avoid double-encoding already-encoded entities.
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
export const encodeHtml = (str: string): string => {
  if (stryMutAct_9fa48("1739")) {
    {}
  } else {
    stryCov_9fa48("1739");
    if (stryMutAct_9fa48("1742") ? typeof str === 'string' : stryMutAct_9fa48("1741") ? false : stryMutAct_9fa48("1740") ? true : (stryCov_9fa48("1740", "1741", "1742"), typeof str !== (stryMutAct_9fa48("1743") ? "" : (stryCov_9fa48("1743"), 'string')))) return str;
    return str.replace(stryMutAct_9fa48("1744") ? /&(?=amp;|lt;|gt;|quot;|#x27;)/g : (stryCov_9fa48("1744"), /&(?!amp;|lt;|gt;|quot;|#x27;)/g), stryMutAct_9fa48("1745") ? "" : (stryCov_9fa48("1745"), '&amp;')).replace(/</g, stryMutAct_9fa48("1746") ? "" : (stryCov_9fa48("1746"), '&lt;')).replace(/>/g, stryMutAct_9fa48("1747") ? "" : (stryCov_9fa48("1747"), '&gt;')).replace(/"/g, stryMutAct_9fa48("1748") ? "" : (stryCov_9fa48("1748"), '&quot;')).replace(/'/g, stryMutAct_9fa48("1749") ? "" : (stryCov_9fa48("1749"), '&#x27;'));
  }
};

/**
 * Decode HTML entities back to original characters.
 * Single-pass only — caller is responsible for not double-decoding.
 */
export const decodeHtml = (str: string): string => {
  if (stryMutAct_9fa48("1750")) {
    {}
  } else {
    stryCov_9fa48("1750");
    if (stryMutAct_9fa48("1753") ? typeof str === 'string' : stryMutAct_9fa48("1752") ? false : stryMutAct_9fa48("1751") ? true : (stryCov_9fa48("1751", "1752", "1753"), typeof str !== (stryMutAct_9fa48("1754") ? "" : (stryCov_9fa48("1754"), 'string')))) return str;
    // Use DOMParser when available for correct single-pass decoding
    if (stryMutAct_9fa48("1757") ? typeof DOMParser === 'undefined' : stryMutAct_9fa48("1756") ? false : stryMutAct_9fa48("1755") ? true : (stryCov_9fa48("1755", "1756", "1757"), typeof DOMParser !== (stryMutAct_9fa48("1758") ? "" : (stryCov_9fa48("1758"), 'undefined')))) {
      if (stryMutAct_9fa48("1759")) {
        {}
      } else {
        stryCov_9fa48("1759");
        const doc = new DOMParser().parseFromString(str, stryMutAct_9fa48("1760") ? "" : (stryCov_9fa48("1760"), 'text/html'));
        return stryMutAct_9fa48("1761") ? doc.documentElement.textContent && str : (stryCov_9fa48("1761"), doc.documentElement.textContent ?? str);
      }
    }
    // Fallback: manual single-pass replacement via callback
    return str.replace(/&(amp|lt|gt|quot|#x27);/g, (_match, entity) => {
      if (stryMutAct_9fa48("1762")) {
        {}
      } else {
        stryCov_9fa48("1762");
        const map: Record<string, string> = stryMutAct_9fa48("1763") ? {} : (stryCov_9fa48("1763"), {
          amp: stryMutAct_9fa48("1764") ? "" : (stryCov_9fa48("1764"), '&'),
          lt: stryMutAct_9fa48("1765") ? "" : (stryCov_9fa48("1765"), '<'),
          gt: stryMutAct_9fa48("1766") ? "" : (stryCov_9fa48("1766"), '>'),
          quot: stryMutAct_9fa48("1767") ? "" : (stryCov_9fa48("1767"), '"'),
          '#x27': stryMutAct_9fa48("1768") ? "" : (stryCov_9fa48("1768"), "'")
        });
        return stryMutAct_9fa48("1769") ? map[entity] && _match : (stryCov_9fa48("1769"), map[entity] ?? _match);
      }
    });
  }
};

/**
 * Recursively sanitize all string fields in an object
 */
export const sanitizeObject = <T extends object,>(obj: T): T => {
  if (stryMutAct_9fa48("1770")) {
    {}
  } else {
    stryCov_9fa48("1770");
    if (stryMutAct_9fa48("1773") ? obj === null && obj === undefined : stryMutAct_9fa48("1772") ? false : stryMutAct_9fa48("1771") ? true : (stryCov_9fa48("1771", "1772", "1773"), (stryMutAct_9fa48("1775") ? obj !== null : stryMutAct_9fa48("1774") ? false : (stryCov_9fa48("1774", "1775"), obj === null)) || (stryMutAct_9fa48("1777") ? obj !== undefined : stryMutAct_9fa48("1776") ? false : (stryCov_9fa48("1776", "1777"), obj === undefined)))) return obj;
    if (stryMutAct_9fa48("1779") ? false : stryMutAct_9fa48("1778") ? true : (stryCov_9fa48("1778", "1779"), Array.isArray(obj))) {
      if (stryMutAct_9fa48("1780")) {
        {}
      } else {
        stryCov_9fa48("1780");
        return obj.map(item => typeof item === 'object' ? sanitizeObject(item) : typeof item === 'string' ? encodeHtml(item) : item) as T;
      }
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (stryMutAct_9fa48("1781")) {
        {}
      } else {
        stryCov_9fa48("1781");
        if (stryMutAct_9fa48("1784") ? typeof value !== 'string' : stryMutAct_9fa48("1783") ? false : stryMutAct_9fa48("1782") ? true : (stryCov_9fa48("1782", "1783", "1784"), typeof value === (stryMutAct_9fa48("1785") ? "" : (stryCov_9fa48("1785"), 'string')))) {
          if (stryMutAct_9fa48("1786")) {
            {}
          } else {
            stryCov_9fa48("1786");
            result[key] = encodeHtml(value);
          }
        } else if (stryMutAct_9fa48("1789") ? typeof value === 'object' || value !== null : stryMutAct_9fa48("1788") ? false : stryMutAct_9fa48("1787") ? true : (stryCov_9fa48("1787", "1788", "1789"), (stryMutAct_9fa48("1791") ? typeof value !== 'object' : stryMutAct_9fa48("1790") ? true : (stryCov_9fa48("1790", "1791"), typeof value === (stryMutAct_9fa48("1792") ? "" : (stryCov_9fa48("1792"), 'object')))) && (stryMutAct_9fa48("1794") ? value === null : stryMutAct_9fa48("1793") ? true : (stryCov_9fa48("1793", "1794"), value !== null)))) {
          if (stryMutAct_9fa48("1795")) {
            {}
          } else {
            stryCov_9fa48("1795");
            result[key] = sanitizeObject(value as object);
          }
        } else {
          if (stryMutAct_9fa48("1796")) {
            {}
          } else {
            stryCov_9fa48("1796");
            result[key] = value;
          }
        }
      }
    }
    return result as T;
  }
};

/**
 * Strip all HTML tags from a string (multi-pass to prevent nested-tag reassembly)
 */
export const stripHtml = (str: string): string => {
  if (stryMutAct_9fa48("1797")) {
    {}
  } else {
    stryCov_9fa48("1797");
    if (stryMutAct_9fa48("1800") ? typeof str === 'string' : stryMutAct_9fa48("1799") ? false : stryMutAct_9fa48("1798") ? true : (stryCov_9fa48("1798", "1799", "1800"), typeof str !== (stryMutAct_9fa48("1801") ? "" : (stryCov_9fa48("1801"), 'string')))) return str;
    let prev = str;
    if (stryMutAct_9fa48("1802")) {
      for (; false;) {
        const next = prev.replace(/<[^>]*>/g, '');
        if (next === prev) return next;
        prev = next;
      }
    } else {
      stryCov_9fa48("1802");
      for (;;) {
        if (stryMutAct_9fa48("1803")) {
          {}
        } else {
          stryCov_9fa48("1803");
          const next = prev.replace(stryMutAct_9fa48("1805") ? /<[>]*>/g : stryMutAct_9fa48("1804") ? /<[^>]>/g : (stryCov_9fa48("1804", "1805"), /<[^>]*>/g), stryMutAct_9fa48("1806") ? "Stryker was here!" : (stryCov_9fa48("1806"), ''));
          if (stryMutAct_9fa48("1809") ? next !== prev : stryMutAct_9fa48("1808") ? false : stryMutAct_9fa48("1807") ? true : (stryCov_9fa48("1807", "1808", "1809"), next === prev)) return next;
          prev = next;
        }
      }
    }
  }
};

/**
 * Sanitize a URL to prevent javascript: protocol attacks
 */
export const sanitizeUrl = (url: string): string => {
  if (stryMutAct_9fa48("1810")) {
    {}
  } else {
    stryCov_9fa48("1810");
    if (stryMutAct_9fa48("1813") ? typeof url === 'string' : stryMutAct_9fa48("1812") ? false : stryMutAct_9fa48("1811") ? true : (stryCov_9fa48("1811", "1812", "1813"), typeof url !== (stryMutAct_9fa48("1814") ? "" : (stryCov_9fa48("1814"), 'string')))) return stryMutAct_9fa48("1815") ? "Stryker was here!" : (stryCov_9fa48("1815"), '');
    const trimmed = stryMutAct_9fa48("1817") ? url.toLowerCase() : stryMutAct_9fa48("1816") ? url.trim().toUpperCase() : (stryCov_9fa48("1816", "1817"), url.trim().toLowerCase());

    // Block dangerous protocols
    if (stryMutAct_9fa48("1820") ? (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) && trimmed.startsWith('vbscript:') : stryMutAct_9fa48("1819") ? false : stryMutAct_9fa48("1818") ? true : (stryCov_9fa48("1818", "1819", "1820"), (stryMutAct_9fa48("1822") ? trimmed.startsWith('javascript:') && trimmed.startsWith('data:') : stryMutAct_9fa48("1821") ? false : (stryCov_9fa48("1821", "1822"), (stryMutAct_9fa48("1823") ? trimmed.endsWith('javascript:') : (stryCov_9fa48("1823"), trimmed.startsWith(stryMutAct_9fa48("1824") ? "" : (stryCov_9fa48("1824"), 'javascript:')))) || (stryMutAct_9fa48("1825") ? trimmed.endsWith('data:') : (stryCov_9fa48("1825"), trimmed.startsWith(stryMutAct_9fa48("1826") ? "" : (stryCov_9fa48("1826"), 'data:')))))) || (stryMutAct_9fa48("1827") ? trimmed.endsWith('vbscript:') : (stryCov_9fa48("1827"), trimmed.startsWith(stryMutAct_9fa48("1828") ? "" : (stryCov_9fa48("1828"), 'vbscript:')))))) {
      if (stryMutAct_9fa48("1829")) {
        {}
      } else {
        stryCov_9fa48("1829");
        return stryMutAct_9fa48("1830") ? "Stryker was here!" : (stryCov_9fa48("1830"), '');
      }
    }
    return url;
  }
};