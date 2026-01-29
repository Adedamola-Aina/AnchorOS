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
const DANGEROUS_PATTERNS = stryMutAct_9fa48("9844") ? [] : (stryCov_9fa48("9844"), [stryMutAct_9fa48("9846") ? /<script\b[>]*>/i : stryMutAct_9fa48("9845") ? /<script\b[^>]>/i : (stryCov_9fa48("9845", "9846"), /<script\b[^>]*>/i),
// Script tags
/<\/script>/i,
// Closing script tags
/javascript:/i, // JavaScript protocol
stryMutAct_9fa48("9850") ? /on\w+\S*=/i : stryMutAct_9fa48("9849") ? /on\w+\s=/i : stryMutAct_9fa48("9848") ? /on\W+\s*=/i : stryMutAct_9fa48("9847") ? /on\w\s*=/i : (stryCov_9fa48("9847", "9848", "9849", "9850"), /on\w+\s*=/i),
// Event handlers (onclick=, onerror=, etc.)
/<iframe\b/i,
// iframes
/<embed\b/i,
// embed tags
/<object\b/i,
// object tags
/data:text\/html/i, // Data URLs with HTML
stryMutAct_9fa48("9854") ? /<svg\b[^>]*\bon\W+=/i : stryMutAct_9fa48("9853") ? /<svg\b[^>]*\bon\w=/i : stryMutAct_9fa48("9852") ? /<svg\b[>]*\bon\w+=/i : stryMutAct_9fa48("9851") ? /<svg\b[^>]\bon\w+=/i : (stryCov_9fa48("9851", "9852", "9853", "9854"), /<svg\b[^>]*\bon\w+=/i),
// SVG with event handlers
/<math\b/i, // Math tags (can be XSS vectors)
stryMutAct_9fa48("9856") ? /expression\S*\(/i : stryMutAct_9fa48("9855") ? /expression\s\(/i : (stryCov_9fa48("9855", "9856"), /expression\s*\(/i),
// CSS expression() 
/vbscript:/i,
// VBScript protocol
/<base\b/i, // Base tag manipulation
stryMutAct_9fa48("9858") ? /<form\b[>]*action=/i : stryMutAct_9fa48("9857") ? /<form\b[^>]action=/i : (stryCov_9fa48("9857", "9858"), /<form\b[^>]*action=/i) // Form injection
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
  if (stryMutAct_9fa48("9859")) {
    {}
  } else {
    stryCov_9fa48("9859");
    return stryMutAct_9fa48("9860") ? DANGEROUS_PATTERNS.every(pattern => pattern.test(value)) : (stryCov_9fa48("9860"), DANGEROUS_PATTERNS.some(stryMutAct_9fa48("9861") ? () => undefined : (stryCov_9fa48("9861"), pattern => pattern.test(value))));
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
  if (stryMutAct_9fa48("9862")) {
    {}
  } else {
    stryCov_9fa48("9862");
    const {
      minLength = 0,
      maxLength = Infinity,
      required = stryMutAct_9fa48("9863") ? false : (stryCov_9fa48("9863"), true),
      rejectDangerous = stryMutAct_9fa48("9864") ? false : (stryCov_9fa48("9864"), true)
    } = options;
    if (stryMutAct_9fa48("9867") ? (value === undefined || value === null) && value === '' : stryMutAct_9fa48("9866") ? false : stryMutAct_9fa48("9865") ? true : (stryCov_9fa48("9865", "9866", "9867"), (stryMutAct_9fa48("9869") ? value === undefined && value === null : stryMutAct_9fa48("9868") ? false : (stryCov_9fa48("9868", "9869"), (stryMutAct_9fa48("9871") ? value !== undefined : stryMutAct_9fa48("9870") ? false : (stryCov_9fa48("9870", "9871"), value === undefined)) || (stryMutAct_9fa48("9873") ? value !== null : stryMutAct_9fa48("9872") ? false : (stryCov_9fa48("9872", "9873"), value === null)))) || (stryMutAct_9fa48("9875") ? value !== '' : stryMutAct_9fa48("9874") ? false : (stryCov_9fa48("9874", "9875"), value === (stryMutAct_9fa48("9876") ? "Stryker was here!" : (stryCov_9fa48("9876"), '')))))) {
      if (stryMutAct_9fa48("9877")) {
        {}
      } else {
        stryCov_9fa48("9877");
        if (stryMutAct_9fa48("9879") ? false : stryMutAct_9fa48("9878") ? true : (stryCov_9fa48("9878", "9879"), required)) return stryMutAct_9fa48("9880") ? {} : (stryCov_9fa48("9880"), {
          field,
          message: stryMutAct_9fa48("9881") ? `` : (stryCov_9fa48("9881"), `${field} is required`)
        });
        return null;
      }
    }
    if (stryMutAct_9fa48("9884") ? typeof value === 'string' : stryMutAct_9fa48("9883") ? false : stryMutAct_9fa48("9882") ? true : (stryCov_9fa48("9882", "9883", "9884"), typeof value !== (stryMutAct_9fa48("9885") ? "" : (stryCov_9fa48("9885"), 'string')))) return stryMutAct_9fa48("9886") ? {} : (stryCov_9fa48("9886"), {
      field,
      message: stryMutAct_9fa48("9887") ? `` : (stryCov_9fa48("9887"), `${field} must be a string`)
    });
    if (stryMutAct_9fa48("9891") ? value.length >= minLength : stryMutAct_9fa48("9890") ? value.length <= minLength : stryMutAct_9fa48("9889") ? false : stryMutAct_9fa48("9888") ? true : (stryCov_9fa48("9888", "9889", "9890", "9891"), value.length < minLength)) return stryMutAct_9fa48("9892") ? {} : (stryCov_9fa48("9892"), {
      field,
      message: stryMutAct_9fa48("9893") ? `` : (stryCov_9fa48("9893"), `${field} must be at least ${minLength} characters`)
    });
    if (stryMutAct_9fa48("9897") ? value.length <= maxLength : stryMutAct_9fa48("9896") ? value.length >= maxLength : stryMutAct_9fa48("9895") ? false : stryMutAct_9fa48("9894") ? true : (stryCov_9fa48("9894", "9895", "9896", "9897"), value.length > maxLength)) return stryMutAct_9fa48("9898") ? {} : (stryCov_9fa48("9898"), {
      field,
      message: stryMutAct_9fa48("9899") ? `` : (stryCov_9fa48("9899"), `${field} must be ${maxLength} characters or fewer`)
    });
    if (stryMutAct_9fa48("9902") ? rejectDangerous || containsDangerousPatterns(value) : stryMutAct_9fa48("9901") ? false : stryMutAct_9fa48("9900") ? true : (stryCov_9fa48("9900", "9901", "9902"), rejectDangerous && containsDangerousPatterns(value))) return stryMutAct_9fa48("9903") ? {} : (stryCov_9fa48("9903"), {
      field,
      message: stryMutAct_9fa48("9904") ? `` : (stryCov_9fa48("9904"), `${field} contains invalid content`)
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
  if (stryMutAct_9fa48("9905")) {
    {}
  } else {
    stryCov_9fa48("9905");
    const {
      min = stryMutAct_9fa48("9906") ? +Infinity : (stryCov_9fa48("9906"), -Infinity),
      max = Infinity,
      required = stryMutAct_9fa48("9907") ? false : (stryCov_9fa48("9907"), true),
      integer = stryMutAct_9fa48("9908") ? true : (stryCov_9fa48("9908"), false)
    } = options;
    if (stryMutAct_9fa48("9911") ? value === undefined && value === null : stryMutAct_9fa48("9910") ? false : stryMutAct_9fa48("9909") ? true : (stryCov_9fa48("9909", "9910", "9911"), (stryMutAct_9fa48("9913") ? value !== undefined : stryMutAct_9fa48("9912") ? false : (stryCov_9fa48("9912", "9913"), value === undefined)) || (stryMutAct_9fa48("9915") ? value !== null : stryMutAct_9fa48("9914") ? false : (stryCov_9fa48("9914", "9915"), value === null)))) {
      if (stryMutAct_9fa48("9916")) {
        {}
      } else {
        stryCov_9fa48("9916");
        if (stryMutAct_9fa48("9918") ? false : stryMutAct_9fa48("9917") ? true : (stryCov_9fa48("9917", "9918"), required)) return stryMutAct_9fa48("9919") ? {} : (stryCov_9fa48("9919"), {
          field,
          message: stryMutAct_9fa48("9920") ? `` : (stryCov_9fa48("9920"), `${field} is required`)
        });
        return null;
      }
    }
    if (stryMutAct_9fa48("9923") ? typeof value !== 'number' && isNaN(value) : stryMutAct_9fa48("9922") ? false : stryMutAct_9fa48("9921") ? true : (stryCov_9fa48("9921", "9922", "9923"), (stryMutAct_9fa48("9925") ? typeof value === 'number' : stryMutAct_9fa48("9924") ? false : (stryCov_9fa48("9924", "9925"), typeof value !== (stryMutAct_9fa48("9926") ? "" : (stryCov_9fa48("9926"), 'number')))) || isNaN(value))) return stryMutAct_9fa48("9927") ? {} : (stryCov_9fa48("9927"), {
      field,
      message: stryMutAct_9fa48("9928") ? `` : (stryCov_9fa48("9928"), `${field} must be a valid number`)
    });
    if (stryMutAct_9fa48("9931") ? integer || !Number.isInteger(value) : stryMutAct_9fa48("9930") ? false : stryMutAct_9fa48("9929") ? true : (stryCov_9fa48("9929", "9930", "9931"), integer && (stryMutAct_9fa48("9932") ? Number.isInteger(value) : (stryCov_9fa48("9932"), !Number.isInteger(value))))) return stryMutAct_9fa48("9933") ? {} : (stryCov_9fa48("9933"), {
      field,
      message: stryMutAct_9fa48("9934") ? `` : (stryCov_9fa48("9934"), `${field} must be a whole number`)
    });
    if (stryMutAct_9fa48("9938") ? value >= min : stryMutAct_9fa48("9937") ? value <= min : stryMutAct_9fa48("9936") ? false : stryMutAct_9fa48("9935") ? true : (stryCov_9fa48("9935", "9936", "9937", "9938"), value < min)) return stryMutAct_9fa48("9939") ? {} : (stryCov_9fa48("9939"), {
      field,
      message: stryMutAct_9fa48("9940") ? `` : (stryCov_9fa48("9940"), `${field} must be at least ${min}`)
    });
    if (stryMutAct_9fa48("9944") ? value <= max : stryMutAct_9fa48("9943") ? value >= max : stryMutAct_9fa48("9942") ? false : stryMutAct_9fa48("9941") ? true : (stryCov_9fa48("9941", "9942", "9943", "9944"), value > max)) return stryMutAct_9fa48("9945") ? {} : (stryCov_9fa48("9945"), {
      field,
      message: stryMutAct_9fa48("9946") ? `` : (stryCov_9fa48("9946"), `${field} must be at most ${max}`)
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
  if (stryMutAct_9fa48("9947")) {
    {}
  } else {
    stryCov_9fa48("9947");
    const {
      required = stryMutAct_9fa48("9948") ? false : (stryCov_9fa48("9948"), true)
    } = options;
    if (stryMutAct_9fa48("9951") ? (value === undefined || value === null) && value === '' : stryMutAct_9fa48("9950") ? false : stryMutAct_9fa48("9949") ? true : (stryCov_9fa48("9949", "9950", "9951"), (stryMutAct_9fa48("9953") ? value === undefined && value === null : stryMutAct_9fa48("9952") ? false : (stryCov_9fa48("9952", "9953"), (stryMutAct_9fa48("9955") ? value !== undefined : stryMutAct_9fa48("9954") ? false : (stryCov_9fa48("9954", "9955"), value === undefined)) || (stryMutAct_9fa48("9957") ? value !== null : stryMutAct_9fa48("9956") ? false : (stryCov_9fa48("9956", "9957"), value === null)))) || (stryMutAct_9fa48("9959") ? value !== '' : stryMutAct_9fa48("9958") ? false : (stryCov_9fa48("9958", "9959"), value === (stryMutAct_9fa48("9960") ? "Stryker was here!" : (stryCov_9fa48("9960"), '')))))) {
      if (stryMutAct_9fa48("9961")) {
        {}
      } else {
        stryCov_9fa48("9961");
        if (stryMutAct_9fa48("9963") ? false : stryMutAct_9fa48("9962") ? true : (stryCov_9fa48("9962", "9963"), required)) return stryMutAct_9fa48("9964") ? {} : (stryCov_9fa48("9964"), {
          field,
          message: stryMutAct_9fa48("9965") ? `` : (stryCov_9fa48("9965"), `${field} is required`)
        });
        return null;
      }
    }
    if (stryMutAct_9fa48("9968") ? typeof value === 'string' : stryMutAct_9fa48("9967") ? false : stryMutAct_9fa48("9966") ? true : (stryCov_9fa48("9966", "9967", "9968"), typeof value !== (stryMutAct_9fa48("9969") ? "" : (stryCov_9fa48("9969"), 'string')))) return stryMutAct_9fa48("9970") ? {} : (stryCov_9fa48("9970"), {
      field,
      message: stryMutAct_9fa48("9971") ? `` : (stryCov_9fa48("9971"), `${field} must be a date string`)
    });
    const date = new Date(value);
    if (stryMutAct_9fa48("9973") ? false : stryMutAct_9fa48("9972") ? true : (stryCov_9fa48("9972", "9973"), isNaN(date.getTime()))) return stryMutAct_9fa48("9974") ? {} : (stryCov_9fa48("9974"), {
      field,
      message: stryMutAct_9fa48("9975") ? `` : (stryCov_9fa48("9975"), `${field} is not a valid date`)
    });
    return null;
  }
}

// Re-export entity schemas for backward compatibility
export { validateAccount, validateTransaction, validateProfileUpdate, formatValidationErrors } from './entityValidation';