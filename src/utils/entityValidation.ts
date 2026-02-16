/**
 * Entity Validation Schemas
 * Extracted from validation.ts per CLAUDE.md §3.2
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
import { validateString, validateNumber, validateDate, type ValidationError, type ValidationResult } from './validation';

/**
 * Validate account creation/update input
 */
export function validateAccount(data: Record<string, unknown>): ValidationResult {
  if (stryMutAct_9fa48("905")) {
    {}
  } else {
    stryCov_9fa48("905");
    const errors: ValidationError[] = stryMutAct_9fa48("906") ? ["Stryker was here"] : (stryCov_9fa48("906"), []);
    const nameError = validateString(data.name, stryMutAct_9fa48("907") ? "" : (stryCov_9fa48("907"), 'Account name'), stryMutAct_9fa48("908") ? {} : (stryCov_9fa48("908"), {
      minLength: 1,
      maxLength: 255
    }));
    if (stryMutAct_9fa48("910") ? false : stryMutAct_9fa48("909") ? true : (stryCov_9fa48("909", "910"), nameError)) errors.push(nameError);
    const typeError = validateString(data.type, stryMutAct_9fa48("911") ? "" : (stryCov_9fa48("911"), 'Account type'), stryMutAct_9fa48("912") ? {} : (stryCov_9fa48("912"), {
      maxLength: 50
    }));
    if (stryMutAct_9fa48("914") ? false : stryMutAct_9fa48("913") ? true : (stryCov_9fa48("913", "914"), typeError)) errors.push(typeError);
    const currencyError = validateString(data.currency, stryMutAct_9fa48("915") ? "" : (stryCov_9fa48("915"), 'Currency'), stryMutAct_9fa48("916") ? {} : (stryCov_9fa48("916"), {
      maxLength: 10
    }));
    if (stryMutAct_9fa48("918") ? false : stryMutAct_9fa48("917") ? true : (stryCov_9fa48("917", "918"), currencyError)) errors.push(currencyError);
    if (stryMutAct_9fa48("921") ? data.balanceCents === undefined : stryMutAct_9fa48("920") ? false : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920", "921"), data.balanceCents !== undefined)) {
      if (stryMutAct_9fa48("922")) {
        {}
      } else {
        stryCov_9fa48("922");
        const balanceError = validateNumber(data.balanceCents, stryMutAct_9fa48("923") ? "" : (stryCov_9fa48("923"), 'Balance'), stryMutAct_9fa48("924") ? {} : (stryCov_9fa48("924"), {
          integer: stryMutAct_9fa48("925") ? false : (stryCov_9fa48("925"), true)
        }));
        if (stryMutAct_9fa48("927") ? false : stryMutAct_9fa48("926") ? true : (stryCov_9fa48("926", "927"), balanceError)) errors.push(balanceError);
      }
    }
    return stryMutAct_9fa48("928") ? {} : (stryCov_9fa48("928"), {
      valid: stryMutAct_9fa48("931") ? errors.length !== 0 : stryMutAct_9fa48("930") ? false : stryMutAct_9fa48("929") ? true : (stryCov_9fa48("929", "930", "931"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate transaction creation/update input
 */
export function validateTransaction(data: Record<string, unknown>): ValidationResult {
  if (stryMutAct_9fa48("932")) {
    {}
  } else {
    stryCov_9fa48("932");
    const errors: ValidationError[] = stryMutAct_9fa48("933") ? ["Stryker was here"] : (stryCov_9fa48("933"), []);
    const titleError = validateString(data.title, stryMutAct_9fa48("934") ? "" : (stryCov_9fa48("934"), 'Description'), stryMutAct_9fa48("935") ? {} : (stryCov_9fa48("935"), {
      minLength: 1,
      maxLength: 500
    }));
    if (stryMutAct_9fa48("937") ? false : stryMutAct_9fa48("936") ? true : (stryCov_9fa48("936", "937"), titleError)) errors.push(titleError);
    const amountError = validateNumber(data.amountCents, stryMutAct_9fa48("938") ? "" : (stryCov_9fa48("938"), 'Amount'), stryMutAct_9fa48("939") ? {} : (stryCov_9fa48("939"), {
      min: 1,
      integer: stryMutAct_9fa48("940") ? false : (stryCov_9fa48("940"), true)
    }));
    if (stryMutAct_9fa48("942") ? false : stryMutAct_9fa48("941") ? true : (stryCov_9fa48("941", "942"), amountError)) errors.push(amountError);
    const typeError = validateString(data.type, stryMutAct_9fa48("943") ? "" : (stryCov_9fa48("943"), 'Transaction type'), stryMutAct_9fa48("944") ? {} : (stryCov_9fa48("944"), {
      maxLength: 20
    }));
    if (stryMutAct_9fa48("946") ? false : stryMutAct_9fa48("945") ? true : (stryCov_9fa48("945", "946"), typeError)) errors.push(typeError);
    const categoryError = validateString(data.category, stryMutAct_9fa48("947") ? "" : (stryCov_9fa48("947"), 'Category'), stryMutAct_9fa48("948") ? {} : (stryCov_9fa48("948"), {
      maxLength: 50,
      required: stryMutAct_9fa48("949") ? true : (stryCov_9fa48("949"), false)
    }));
    if (stryMutAct_9fa48("951") ? false : stryMutAct_9fa48("950") ? true : (stryCov_9fa48("950", "951"), categoryError)) errors.push(categoryError);
    const dateError = validateDate(data.transactionDate, stryMutAct_9fa48("952") ? "" : (stryCov_9fa48("952"), 'Date'), stryMutAct_9fa48("953") ? {} : (stryCov_9fa48("953"), {
      required: stryMutAct_9fa48("954") ? true : (stryCov_9fa48("954"), false)
    }));
    if (stryMutAct_9fa48("956") ? false : stryMutAct_9fa48("955") ? true : (stryCov_9fa48("955", "956"), dateError)) errors.push(dateError);
    return stryMutAct_9fa48("957") ? {} : (stryCov_9fa48("957"), {
      valid: stryMutAct_9fa48("960") ? errors.length !== 0 : stryMutAct_9fa48("959") ? false : stryMutAct_9fa48("958") ? true : (stryCov_9fa48("958", "959", "960"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate profile update input
 */
export function validateProfileUpdate(data: Record<string, unknown>): ValidationResult {
  if (stryMutAct_9fa48("961")) {
    {}
  } else {
    stryCov_9fa48("961");
    const errors: ValidationError[] = stryMutAct_9fa48("962") ? ["Stryker was here"] : (stryCov_9fa48("962"), []);
    if (stryMutAct_9fa48("965") ? data.name === undefined : stryMutAct_9fa48("964") ? false : stryMutAct_9fa48("963") ? true : (stryCov_9fa48("963", "964", "965"), data.name !== undefined)) {
      if (stryMutAct_9fa48("966")) {
        {}
      } else {
        stryCov_9fa48("966");
        const nameError = validateString(data.name, stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), 'Display name'), stryMutAct_9fa48("968") ? {} : (stryCov_9fa48("968"), {
          minLength: 1,
          maxLength: 100
        }));
        if (stryMutAct_9fa48("970") ? false : stryMutAct_9fa48("969") ? true : (stryCov_9fa48("969", "970"), nameError)) errors.push(nameError);
      }
    }
    return stryMutAct_9fa48("971") ? {} : (stryCov_9fa48("971"), {
      valid: stryMutAct_9fa48("974") ? errors.length !== 0 : stryMutAct_9fa48("973") ? false : stryMutAct_9fa48("972") ? true : (stryCov_9fa48("972", "973", "974"), errors.length === 0),
      errors
    });
  }
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (stryMutAct_9fa48("975")) {
    {}
  } else {
    stryCov_9fa48("975");
    return errors.map(stryMutAct_9fa48("976") ? () => undefined : (stryCov_9fa48("976"), e => e.message)).join(stryMutAct_9fa48("977") ? "" : (stryCov_9fa48("977"), '. '));
  }
}