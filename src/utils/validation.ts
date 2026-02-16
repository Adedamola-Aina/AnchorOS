/**
 * Input Validation Utilities
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Entity validation schemas moved to entityValidation.ts
 * 
 * Philosophy:
 * - Validate at write time, reject with 400 if invalid
 * - Store original input as-is (no encoding)
 * - Trust React's default escaping at render time
 */
// @ts-nocheck


// Dangerous patterns that should never appear in user input
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
const DANGEROUS_PATTERNS = stryMutAct_9fa48("2155") ? [] : (stryCov_9fa48("2155"), [stryMutAct_9fa48("2157") ? /<script\b[>]*>/i : stryMutAct_9fa48("2156") ? /<script\b[^>]>/i : (stryCov_9fa48("2156", "2157"), /<script\b[^>]*>/i),
// Script tags
/<\/script>/i,
// Closing script tags
/javascript:/i, // JavaScript protocol
stryMutAct_9fa48("2161") ? /on\w+\S*=/i : stryMutAct_9fa48("2160") ? /on\w+\s=/i : stryMutAct_9fa48("2159") ? /on\W+\s*=/i : stryMutAct_9fa48("2158") ? /on\w\s*=/i : (stryCov_9fa48("2158", "2159", "2160", "2161"), /on\w+\s*=/i),
// Event handlers (onclick=, onerror=, etc.)
/<iframe\b/i,
// iframes
/<embed\b/i,
// embed tags
/<object\b/i,
// object tags
/data:text\/html/i, // Data URLs with HTML
stryMutAct_9fa48("2165") ? /<svg\b[^>]*\bon\W+=/i : stryMutAct_9fa48("2164") ? /<svg\b[^>]*\bon\w=/i : stryMutAct_9fa48("2163") ? /<svg\b[>]*\bon\w+=/i : stryMutAct_9fa48("2162") ? /<svg\b[^>]\bon\w+=/i : (stryCov_9fa48("2162", "2163", "2164", "2165"), /<svg\b[^>]*\bon\w+=/i),
// SVG with event handlers
/<math\b/i, // Math tags (can be XSS vectors)
stryMutAct_9fa48("2167") ? /expression\S*\(/i : stryMutAct_9fa48("2166") ? /expression\s\(/i : (stryCov_9fa48("2166", "2167"), /expression\s*\(/i),
// CSS expression() 
/vbscript:/i,
// VBScript protocol
/<base\b/i, // Base tag manipulation
stryMutAct_9fa48("2169") ? /<form\b[>]*action=/i : stryMutAct_9fa48("2168") ? /<form\b[^>]action=/i : (stryCov_9fa48("2168", "2169"), /<form\b[^>]*action=/i) // Form injection
]);
export interface ValidationError {
  field: string;
  message: string;
}
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Check if a string contains dangerous patterns
 */
export function containsDangerousPatterns(value: string): boolean {
  if (stryMutAct_9fa48("2170")) {
    {}
  } else {
    stryCov_9fa48("2170");
    return stryMutAct_9fa48("2171") ? DANGEROUS_PATTERNS.every(pattern => pattern.test(value)) : (stryCov_9fa48("2171"), DANGEROUS_PATTERNS.some(stryMutAct_9fa48("2172") ? () => undefined : (stryCov_9fa48("2172"), pattern => pattern.test(value))));
  }
}

/**
 * Validate a string field
 */
export function validateString(value: unknown, field: string, options: {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  rejectDangerous?: boolean;
} = {}): ValidationError | null {
  if (stryMutAct_9fa48("2173")) {
    {}
  } else {
    stryCov_9fa48("2173");
    const {
      minLength = 0,
      maxLength = Infinity,
      required = stryMutAct_9fa48("2174") ? false : (stryCov_9fa48("2174"), true),
      rejectDangerous = stryMutAct_9fa48("2175") ? false : (stryCov_9fa48("2175"), true)
    } = options;
    if (stryMutAct_9fa48("2178") ? (value === undefined || value === null) && value === '' : stryMutAct_9fa48("2177") ? false : stryMutAct_9fa48("2176") ? true : (stryCov_9fa48("2176", "2177", "2178"), (stryMutAct_9fa48("2180") ? value === undefined && value === null : stryMutAct_9fa48("2179") ? false : (stryCov_9fa48("2179", "2180"), (stryMutAct_9fa48("2182") ? value !== undefined : stryMutAct_9fa48("2181") ? false : (stryCov_9fa48("2181", "2182"), value === undefined)) || (stryMutAct_9fa48("2184") ? value !== null : stryMutAct_9fa48("2183") ? false : (stryCov_9fa48("2183", "2184"), value === null)))) || (stryMutAct_9fa48("2186") ? value !== '' : stryMutAct_9fa48("2185") ? false : (stryCov_9fa48("2185", "2186"), value === (stryMutAct_9fa48("2187") ? "Stryker was here!" : (stryCov_9fa48("2187"), '')))))) {
      if (stryMutAct_9fa48("2188")) {
        {}
      } else {
        stryCov_9fa48("2188");
        if (stryMutAct_9fa48("2190") ? false : stryMutAct_9fa48("2189") ? true : (stryCov_9fa48("2189", "2190"), required)) return stryMutAct_9fa48("2191") ? {} : (stryCov_9fa48("2191"), {
          field,
          message: stryMutAct_9fa48("2192") ? `` : (stryCov_9fa48("2192"), `${field} is required`)
        });
        return null;
      }
    }
    if (stryMutAct_9fa48("2195") ? typeof value === 'string' : stryMutAct_9fa48("2194") ? false : stryMutAct_9fa48("2193") ? true : (stryCov_9fa48("2193", "2194", "2195"), typeof value !== (stryMutAct_9fa48("2196") ? "" : (stryCov_9fa48("2196"), 'string')))) return stryMutAct_9fa48("2197") ? {} : (stryCov_9fa48("2197"), {
      field,
      message: stryMutAct_9fa48("2198") ? `` : (stryCov_9fa48("2198"), `${field} must be a string`)
    });
    if (stryMutAct_9fa48("2202") ? value.length >= minLength : stryMutAct_9fa48("2201") ? value.length <= minLength : stryMutAct_9fa48("2200") ? false : stryMutAct_9fa48("2199") ? true : (stryCov_9fa48("2199", "2200", "2201", "2202"), value.length < minLength)) return stryMutAct_9fa48("2203") ? {} : (stryCov_9fa48("2203"), {
      field,
      message: stryMutAct_9fa48("2204") ? `` : (stryCov_9fa48("2204"), `${field} must be at least ${minLength} characters`)
    });
    if (stryMutAct_9fa48("2208") ? value.length <= maxLength : stryMutAct_9fa48("2207") ? value.length >= maxLength : stryMutAct_9fa48("2206") ? false : stryMutAct_9fa48("2205") ? true : (stryCov_9fa48("2205", "2206", "2207", "2208"), value.length > maxLength)) return stryMutAct_9fa48("2209") ? {} : (stryCov_9fa48("2209"), {
      field,
      message: stryMutAct_9fa48("2210") ? `` : (stryCov_9fa48("2210"), `${field} must be ${maxLength} characters or fewer`)
    });
    if (stryMutAct_9fa48("2213") ? rejectDangerous || containsDangerousPatterns(value) : stryMutAct_9fa48("2212") ? false : stryMutAct_9fa48("2211") ? true : (stryCov_9fa48("2211", "2212", "2213"), rejectDangerous && containsDangerousPatterns(value))) return stryMutAct_9fa48("2214") ? {} : (stryCov_9fa48("2214"), {
      field,
      message: stryMutAct_9fa48("2215") ? `` : (stryCov_9fa48("2215"), `${field} contains invalid content`)
    });
    return null;
  }
}

/**
 * Validate a number field
 */
export function validateNumber(value: unknown, field: string, options: {
  min?: number;
  max?: number;
  required?: boolean;
  integer?: boolean;
} = {}): ValidationError | null {
  if (stryMutAct_9fa48("2216")) {
    {}
  } else {
    stryCov_9fa48("2216");
    const {
      min = stryMutAct_9fa48("2217") ? +Infinity : (stryCov_9fa48("2217"), -Infinity),
      max = Infinity,
      required = stryMutAct_9fa48("2218") ? false : (stryCov_9fa48("2218"), true),
      integer = stryMutAct_9fa48("2219") ? true : (stryCov_9fa48("2219"), false)
    } = options;
    if (stryMutAct_9fa48("2222") ? value === undefined && value === null : stryMutAct_9fa48("2221") ? false : stryMutAct_9fa48("2220") ? true : (stryCov_9fa48("2220", "2221", "2222"), (stryMutAct_9fa48("2224") ? value !== undefined : stryMutAct_9fa48("2223") ? false : (stryCov_9fa48("2223", "2224"), value === undefined)) || (stryMutAct_9fa48("2226") ? value !== null : stryMutAct_9fa48("2225") ? false : (stryCov_9fa48("2225", "2226"), value === null)))) {
      if (stryMutAct_9fa48("2227")) {
        {}
      } else {
        stryCov_9fa48("2227");
        if (stryMutAct_9fa48("2229") ? false : stryMutAct_9fa48("2228") ? true : (stryCov_9fa48("2228", "2229"), required)) return stryMutAct_9fa48("2230") ? {} : (stryCov_9fa48("2230"), {
          field,
          message: stryMutAct_9fa48("2231") ? `` : (stryCov_9fa48("2231"), `${field} is required`)
        });
        return null;
      }
    }
    if (stryMutAct_9fa48("2234") ? typeof value !== 'number' && isNaN(value) : stryMutAct_9fa48("2233") ? false : stryMutAct_9fa48("2232") ? true : (stryCov_9fa48("2232", "2233", "2234"), (stryMutAct_9fa48("2236") ? typeof value === 'number' : stryMutAct_9fa48("2235") ? false : (stryCov_9fa48("2235", "2236"), typeof value !== (stryMutAct_9fa48("2237") ? "" : (stryCov_9fa48("2237"), 'number')))) || isNaN(value))) return stryMutAct_9fa48("2238") ? {} : (stryCov_9fa48("2238"), {
      field,
      message: stryMutAct_9fa48("2239") ? `` : (stryCov_9fa48("2239"), `${field} must be a valid number`)
    });
    if (stryMutAct_9fa48("2242") ? integer || !Number.isInteger(value) : stryMutAct_9fa48("2241") ? false : stryMutAct_9fa48("2240") ? true : (stryCov_9fa48("2240", "2241", "2242"), integer && (stryMutAct_9fa48("2243") ? Number.isInteger(value) : (stryCov_9fa48("2243"), !Number.isInteger(value))))) return stryMutAct_9fa48("2244") ? {} : (stryCov_9fa48("2244"), {
      field,
      message: stryMutAct_9fa48("2245") ? `` : (stryCov_9fa48("2245"), `${field} must be a whole number`)
    });
    if (stryMutAct_9fa48("2249") ? value >= min : stryMutAct_9fa48("2248") ? value <= min : stryMutAct_9fa48("2247") ? false : stryMutAct_9fa48("2246") ? true : (stryCov_9fa48("2246", "2247", "2248", "2249"), value < min)) return stryMutAct_9fa48("2250") ? {} : (stryCov_9fa48("2250"), {
      field,
      message: stryMutAct_9fa48("2251") ? `` : (stryCov_9fa48("2251"), `${field} must be at least ${min}`)
    });
    if (stryMutAct_9fa48("2255") ? value <= max : stryMutAct_9fa48("2254") ? value >= max : stryMutAct_9fa48("2253") ? false : stryMutAct_9fa48("2252") ? true : (stryCov_9fa48("2252", "2253", "2254", "2255"), value > max)) return stryMutAct_9fa48("2256") ? {} : (stryCov_9fa48("2256"), {
      field,
      message: stryMutAct_9fa48("2257") ? `` : (stryCov_9fa48("2257"), `${field} must be at most ${max}`)
    });
    return null;
  }
}

/**
 * Validate a date string
 */
export function validateDate(value: unknown, field: string, options: {
  required?: boolean;
} = {}): ValidationError | null {
  if (stryMutAct_9fa48("2258")) {
    {}
  } else {
    stryCov_9fa48("2258");
    const {
      required = stryMutAct_9fa48("2259") ? false : (stryCov_9fa48("2259"), true)
    } = options;
    if (stryMutAct_9fa48("2262") ? (value === undefined || value === null) && value === '' : stryMutAct_9fa48("2261") ? false : stryMutAct_9fa48("2260") ? true : (stryCov_9fa48("2260", "2261", "2262"), (stryMutAct_9fa48("2264") ? value === undefined && value === null : stryMutAct_9fa48("2263") ? false : (stryCov_9fa48("2263", "2264"), (stryMutAct_9fa48("2266") ? value !== undefined : stryMutAct_9fa48("2265") ? false : (stryCov_9fa48("2265", "2266"), value === undefined)) || (stryMutAct_9fa48("2268") ? value !== null : stryMutAct_9fa48("2267") ? false : (stryCov_9fa48("2267", "2268"), value === null)))) || (stryMutAct_9fa48("2270") ? value !== '' : stryMutAct_9fa48("2269") ? false : (stryCov_9fa48("2269", "2270"), value === (stryMutAct_9fa48("2271") ? "Stryker was here!" : (stryCov_9fa48("2271"), '')))))) {
      if (stryMutAct_9fa48("2272")) {
        {}
      } else {
        stryCov_9fa48("2272");
        if (stryMutAct_9fa48("2274") ? false : stryMutAct_9fa48("2273") ? true : (stryCov_9fa48("2273", "2274"), required)) return stryMutAct_9fa48("2275") ? {} : (stryCov_9fa48("2275"), {
          field,
          message: stryMutAct_9fa48("2276") ? `` : (stryCov_9fa48("2276"), `${field} is required`)
        });
        return null;
      }
    }
    if (stryMutAct_9fa48("2279") ? typeof value === 'string' : stryMutAct_9fa48("2278") ? false : stryMutAct_9fa48("2277") ? true : (stryCov_9fa48("2277", "2278", "2279"), typeof value !== (stryMutAct_9fa48("2280") ? "" : (stryCov_9fa48("2280"), 'string')))) return stryMutAct_9fa48("2281") ? {} : (stryCov_9fa48("2281"), {
      field,
      message: stryMutAct_9fa48("2282") ? `` : (stryCov_9fa48("2282"), `${field} must be a date string`)
    });
    const date = new Date(value);
    if (stryMutAct_9fa48("2284") ? false : stryMutAct_9fa48("2283") ? true : (stryCov_9fa48("2283", "2284"), isNaN(date.getTime()))) return stryMutAct_9fa48("2285") ? {} : (stryCov_9fa48("2285"), {
      field,
      message: stryMutAct_9fa48("2286") ? `` : (stryCov_9fa48("2286"), `${field} is not a valid date`)
    });
    return null;
  }
}

// Re-export entity schemas for backward compatibility
export { validateAccount, validateTransaction, validateProfileUpdate, formatValidationErrors } from './entityValidation';