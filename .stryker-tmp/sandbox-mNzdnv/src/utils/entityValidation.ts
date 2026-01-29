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
  if (stryMutAct_9fa48("8606")) {
    {}
  } else {
    stryCov_9fa48("8606");
    const errors: ValidationError[] = stryMutAct_9fa48("8607") ? ["Stryker was here"] : (stryCov_9fa48("8607"), []);
    const nameError = validateString(data.name, stryMutAct_9fa48("8608") ? "" : (stryCov_9fa48("8608"), 'Account name'), stryMutAct_9fa48("8609") ? {} : (stryCov_9fa48("8609"), {
      minLength: 1,
      maxLength: 255
    }));
    if (stryMutAct_9fa48("8611") ? false : stryMutAct_9fa48("8610") ? true : (stryCov_9fa48("8610", "8611"), nameError)) errors.push(nameError);
    const typeError = validateString(data.type, stryMutAct_9fa48("8612") ? "" : (stryCov_9fa48("8612"), 'Account type'), stryMutAct_9fa48("8613") ? {} : (stryCov_9fa48("8613"), {
      maxLength: 50
    }));
    if (stryMutAct_9fa48("8615") ? false : stryMutAct_9fa48("8614") ? true : (stryCov_9fa48("8614", "8615"), typeError)) errors.push(typeError);
    const currencyError = validateString(data.currency, stryMutAct_9fa48("8616") ? "" : (stryCov_9fa48("8616"), 'Currency'), stryMutAct_9fa48("8617") ? {} : (stryCov_9fa48("8617"), {
      maxLength: 10
    }));
    if (stryMutAct_9fa48("8619") ? false : stryMutAct_9fa48("8618") ? true : (stryCov_9fa48("8618", "8619"), currencyError)) errors.push(currencyError);
    if (stryMutAct_9fa48("8622") ? data.balanceCents === undefined : stryMutAct_9fa48("8621") ? false : stryMutAct_9fa48("8620") ? true : (stryCov_9fa48("8620", "8621", "8622"), data.balanceCents !== undefined)) {
      if (stryMutAct_9fa48("8623")) {
        {}
      } else {
        stryCov_9fa48("8623");
        const balanceError = validateNumber(data.balanceCents, stryMutAct_9fa48("8624") ? "" : (stryCov_9fa48("8624"), 'Balance'), stryMutAct_9fa48("8625") ? {} : (stryCov_9fa48("8625"), {
          integer: stryMutAct_9fa48("8626") ? false : (stryCov_9fa48("8626"), true)
        }));
        if (stryMutAct_9fa48("8628") ? false : stryMutAct_9fa48("8627") ? true : (stryCov_9fa48("8627", "8628"), balanceError)) errors.push(balanceError);
      }
    }
    return stryMutAct_9fa48("8629") ? {} : (stryCov_9fa48("8629"), {
      valid: stryMutAct_9fa48("8632") ? errors.length !== 0 : stryMutAct_9fa48("8631") ? false : stryMutAct_9fa48("8630") ? true : (stryCov_9fa48("8630", "8631", "8632"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate transaction creation/update input
 */
export function validateTransaction(data: Record<string, unknown>): ValidationResult {
  if (stryMutAct_9fa48("8633")) {
    {}
  } else {
    stryCov_9fa48("8633");
    const errors: ValidationError[] = stryMutAct_9fa48("8634") ? ["Stryker was here"] : (stryCov_9fa48("8634"), []);
    const titleError = validateString(data.title, stryMutAct_9fa48("8635") ? "" : (stryCov_9fa48("8635"), 'Description'), stryMutAct_9fa48("8636") ? {} : (stryCov_9fa48("8636"), {
      minLength: 1,
      maxLength: 500
    }));
    if (stryMutAct_9fa48("8638") ? false : stryMutAct_9fa48("8637") ? true : (stryCov_9fa48("8637", "8638"), titleError)) errors.push(titleError);
    const amountError = validateNumber(data.amountCents, stryMutAct_9fa48("8639") ? "" : (stryCov_9fa48("8639"), 'Amount'), stryMutAct_9fa48("8640") ? {} : (stryCov_9fa48("8640"), {
      min: 1,
      integer: stryMutAct_9fa48("8641") ? false : (stryCov_9fa48("8641"), true)
    }));
    if (stryMutAct_9fa48("8643") ? false : stryMutAct_9fa48("8642") ? true : (stryCov_9fa48("8642", "8643"), amountError)) errors.push(amountError);
    const typeError = validateString(data.type, stryMutAct_9fa48("8644") ? "" : (stryCov_9fa48("8644"), 'Transaction type'), stryMutAct_9fa48("8645") ? {} : (stryCov_9fa48("8645"), {
      maxLength: 20
    }));
    if (stryMutAct_9fa48("8647") ? false : stryMutAct_9fa48("8646") ? true : (stryCov_9fa48("8646", "8647"), typeError)) errors.push(typeError);
    const categoryError = validateString(data.category, stryMutAct_9fa48("8648") ? "" : (stryCov_9fa48("8648"), 'Category'), stryMutAct_9fa48("8649") ? {} : (stryCov_9fa48("8649"), {
      maxLength: 50,
      required: stryMutAct_9fa48("8650") ? true : (stryCov_9fa48("8650"), false)
    }));
    if (stryMutAct_9fa48("8652") ? false : stryMutAct_9fa48("8651") ? true : (stryCov_9fa48("8651", "8652"), categoryError)) errors.push(categoryError);
    const dateError = validateDate(data.transactionDate, stryMutAct_9fa48("8653") ? "" : (stryCov_9fa48("8653"), 'Date'), stryMutAct_9fa48("8654") ? {} : (stryCov_9fa48("8654"), {
      required: stryMutAct_9fa48("8655") ? true : (stryCov_9fa48("8655"), false)
    }));
    if (stryMutAct_9fa48("8657") ? false : stryMutAct_9fa48("8656") ? true : (stryCov_9fa48("8656", "8657"), dateError)) errors.push(dateError);
    return stryMutAct_9fa48("8658") ? {} : (stryCov_9fa48("8658"), {
      valid: stryMutAct_9fa48("8661") ? errors.length !== 0 : stryMutAct_9fa48("8660") ? false : stryMutAct_9fa48("8659") ? true : (stryCov_9fa48("8659", "8660", "8661"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate profile update input
 */
export function validateProfileUpdate(data: Record<string, unknown>): ValidationResult {
  if (stryMutAct_9fa48("8662")) {
    {}
  } else {
    stryCov_9fa48("8662");
    const errors: ValidationError[] = stryMutAct_9fa48("8663") ? ["Stryker was here"] : (stryCov_9fa48("8663"), []);
    if (stryMutAct_9fa48("8666") ? data.name === undefined : stryMutAct_9fa48("8665") ? false : stryMutAct_9fa48("8664") ? true : (stryCov_9fa48("8664", "8665", "8666"), data.name !== undefined)) {
      if (stryMutAct_9fa48("8667")) {
        {}
      } else {
        stryCov_9fa48("8667");
        const nameError = validateString(data.name, stryMutAct_9fa48("8668") ? "" : (stryCov_9fa48("8668"), 'Display name'), stryMutAct_9fa48("8669") ? {} : (stryCov_9fa48("8669"), {
          minLength: 1,
          maxLength: 100
        }));
        if (stryMutAct_9fa48("8671") ? false : stryMutAct_9fa48("8670") ? true : (stryCov_9fa48("8670", "8671"), nameError)) errors.push(nameError);
      }
    }
    return stryMutAct_9fa48("8672") ? {} : (stryCov_9fa48("8672"), {
      valid: stryMutAct_9fa48("8675") ? errors.length !== 0 : stryMutAct_9fa48("8674") ? false : stryMutAct_9fa48("8673") ? true : (stryCov_9fa48("8673", "8674", "8675"), errors.length === 0),
      errors
    });
  }
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (stryMutAct_9fa48("8676")) {
    {}
  } else {
    stryCov_9fa48("8676");
    return errors.map(stryMutAct_9fa48("8677") ? () => undefined : (stryCov_9fa48("8677"), e => e.message)).join(stryMutAct_9fa48("8678") ? "" : (stryCov_9fa48("8678"), '. '));
  }
}