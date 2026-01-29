/**
 * Sanitization Utilities
 * 
 * HTML entity encoding for defense-in-depth XSS protection.
 * React already escapes output, but this adds an extra layer of safety
 * for data that might be used in non-React contexts (emails, exports, etc).
 */
// @ts-nocheck


/**
 * Encode HTML special characters to prevent XSS
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
  if (stryMutAct_9fa48("9292")) {
    {}
  } else {
    stryCov_9fa48("9292");
    if (stryMutAct_9fa48("9295") ? typeof str === 'string' : stryMutAct_9fa48("9294") ? false : stryMutAct_9fa48("9293") ? true : (stryCov_9fa48("9293", "9294", "9295"), typeof str !== (stryMutAct_9fa48("9296") ? "" : (stryCov_9fa48("9296"), 'string')))) return str;
    return str.replace(/&/g, stryMutAct_9fa48("9297") ? "" : (stryCov_9fa48("9297"), '&amp;')).replace(/</g, stryMutAct_9fa48("9298") ? "" : (stryCov_9fa48("9298"), '&lt;')).replace(/>/g, stryMutAct_9fa48("9299") ? "" : (stryCov_9fa48("9299"), '&gt;')).replace(/"/g, stryMutAct_9fa48("9300") ? "" : (stryCov_9fa48("9300"), '&quot;')).replace(/'/g, stryMutAct_9fa48("9301") ? "" : (stryCov_9fa48("9301"), '&#x27;'));
  }
};

/**
 * Decode HTML entities back to original characters
 */
export const decodeHtml = (str: string): string => {
  if (stryMutAct_9fa48("9302")) {
    {}
  } else {
    stryCov_9fa48("9302");
    if (stryMutAct_9fa48("9305") ? typeof str === 'string' : stryMutAct_9fa48("9304") ? false : stryMutAct_9fa48("9303") ? true : (stryCov_9fa48("9303", "9304", "9305"), typeof str !== (stryMutAct_9fa48("9306") ? "" : (stryCov_9fa48("9306"), 'string')))) return str;
    return str.replace(/&amp;/g, stryMutAct_9fa48("9307") ? "" : (stryCov_9fa48("9307"), '&')).replace(/&lt;/g, stryMutAct_9fa48("9308") ? "" : (stryCov_9fa48("9308"), '<')).replace(/&gt;/g, stryMutAct_9fa48("9309") ? "" : (stryCov_9fa48("9309"), '>')).replace(/&quot;/g, stryMutAct_9fa48("9310") ? "" : (stryCov_9fa48("9310"), '"')).replace(/&#x27;/g, stryMutAct_9fa48("9311") ? "" : (stryCov_9fa48("9311"), "'"));
  }
};

/**
 * Recursively sanitize all string fields in an object
 */
export const sanitizeObject = <T extends object,>(obj: T): T => {
  if (stryMutAct_9fa48("9312")) {
    {}
  } else {
    stryCov_9fa48("9312");
    if (stryMutAct_9fa48("9315") ? obj === null && obj === undefined : stryMutAct_9fa48("9314") ? false : stryMutAct_9fa48("9313") ? true : (stryCov_9fa48("9313", "9314", "9315"), (stryMutAct_9fa48("9317") ? obj !== null : stryMutAct_9fa48("9316") ? false : (stryCov_9fa48("9316", "9317"), obj === null)) || (stryMutAct_9fa48("9319") ? obj !== undefined : stryMutAct_9fa48("9318") ? false : (stryCov_9fa48("9318", "9319"), obj === undefined)))) return obj;
    if (stryMutAct_9fa48("9321") ? false : stryMutAct_9fa48("9320") ? true : (stryCov_9fa48("9320", "9321"), Array.isArray(obj))) {
      if (stryMutAct_9fa48("9322")) {
        {}
      } else {
        stryCov_9fa48("9322");
        return obj.map(item => typeof item === 'object' ? sanitizeObject(item) : typeof item === 'string' ? encodeHtml(item) : item) as T;
      }
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (stryMutAct_9fa48("9323")) {
        {}
      } else {
        stryCov_9fa48("9323");
        if (stryMutAct_9fa48("9326") ? typeof value !== 'string' : stryMutAct_9fa48("9325") ? false : stryMutAct_9fa48("9324") ? true : (stryCov_9fa48("9324", "9325", "9326"), typeof value === (stryMutAct_9fa48("9327") ? "" : (stryCov_9fa48("9327"), 'string')))) {
          if (stryMutAct_9fa48("9328")) {
            {}
          } else {
            stryCov_9fa48("9328");
            result[key] = encodeHtml(value);
          }
        } else if (stryMutAct_9fa48("9331") ? typeof value === 'object' || value !== null : stryMutAct_9fa48("9330") ? false : stryMutAct_9fa48("9329") ? true : (stryCov_9fa48("9329", "9330", "9331"), (stryMutAct_9fa48("9333") ? typeof value !== 'object' : stryMutAct_9fa48("9332") ? true : (stryCov_9fa48("9332", "9333"), typeof value === (stryMutAct_9fa48("9334") ? "" : (stryCov_9fa48("9334"), 'object')))) && (stryMutAct_9fa48("9336") ? value === null : stryMutAct_9fa48("9335") ? true : (stryCov_9fa48("9335", "9336"), value !== null)))) {
          if (stryMutAct_9fa48("9337")) {
            {}
          } else {
            stryCov_9fa48("9337");
            result[key] = sanitizeObject(value as object);
          }
        } else {
          if (stryMutAct_9fa48("9338")) {
            {}
          } else {
            stryCov_9fa48("9338");
            result[key] = value;
          }
        }
      }
    }
    return result as T;
  }
};

/**
 * Strip all HTML tags from a string (more aggressive than encoding)
 */
export const stripHtml = (str: string): string => {
  if (stryMutAct_9fa48("9339")) {
    {}
  } else {
    stryCov_9fa48("9339");
    if (stryMutAct_9fa48("9342") ? typeof str === 'string' : stryMutAct_9fa48("9341") ? false : stryMutAct_9fa48("9340") ? true : (stryCov_9fa48("9340", "9341", "9342"), typeof str !== (stryMutAct_9fa48("9343") ? "" : (stryCov_9fa48("9343"), 'string')))) return str;
    return str.replace(stryMutAct_9fa48("9345") ? /<[>]*>/g : stryMutAct_9fa48("9344") ? /<[^>]>/g : (stryCov_9fa48("9344", "9345"), /<[^>]*>/g), stryMutAct_9fa48("9346") ? "Stryker was here!" : (stryCov_9fa48("9346"), ''));
  }
};

/**
 * Sanitize a URL to prevent javascript: protocol attacks
 */
export const sanitizeUrl = (url: string): string => {
  if (stryMutAct_9fa48("9347")) {
    {}
  } else {
    stryCov_9fa48("9347");
    if (stryMutAct_9fa48("9350") ? typeof url === 'string' : stryMutAct_9fa48("9349") ? false : stryMutAct_9fa48("9348") ? true : (stryCov_9fa48("9348", "9349", "9350"), typeof url !== (stryMutAct_9fa48("9351") ? "" : (stryCov_9fa48("9351"), 'string')))) return stryMutAct_9fa48("9352") ? "Stryker was here!" : (stryCov_9fa48("9352"), '');
    const trimmed = stryMutAct_9fa48("9354") ? url.toLowerCase() : stryMutAct_9fa48("9353") ? url.trim().toUpperCase() : (stryCov_9fa48("9353", "9354"), url.trim().toLowerCase());

    // Block dangerous protocols
    if (stryMutAct_9fa48("9357") ? (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) && trimmed.startsWith('vbscript:') : stryMutAct_9fa48("9356") ? false : stryMutAct_9fa48("9355") ? true : (stryCov_9fa48("9355", "9356", "9357"), (stryMutAct_9fa48("9359") ? trimmed.startsWith('javascript:') && trimmed.startsWith('data:') : stryMutAct_9fa48("9358") ? false : (stryCov_9fa48("9358", "9359"), (stryMutAct_9fa48("9360") ? trimmed.endsWith('javascript:') : (stryCov_9fa48("9360"), trimmed.startsWith(stryMutAct_9fa48("9361") ? "" : (stryCov_9fa48("9361"), 'javascript:')))) || (stryMutAct_9fa48("9362") ? trimmed.endsWith('data:') : (stryCov_9fa48("9362"), trimmed.startsWith(stryMutAct_9fa48("9363") ? "" : (stryCov_9fa48("9363"), 'data:')))))) || (stryMutAct_9fa48("9364") ? trimmed.endsWith('vbscript:') : (stryCov_9fa48("9364"), trimmed.startsWith(stryMutAct_9fa48("9365") ? "" : (stryCov_9fa48("9365"), 'vbscript:')))))) {
      if (stryMutAct_9fa48("9366")) {
        {}
      } else {
        stryCov_9fa48("9366");
        return stryMutAct_9fa48("9367") ? "Stryker was here!" : (stryCov_9fa48("9367"), '');
      }
    }
    return url;
  }
};