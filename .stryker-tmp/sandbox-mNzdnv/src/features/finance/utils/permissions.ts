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
import type { AnchorAccount } from '../../../types';

// Permission levels for Family Mode
export type AccountPermission = 'owner' | 'read' | 'transact' | 'manage' | null;

/**
 * Get the permission level for a user on a specific account
 */
export const getAccountPermission = (account: AnchorAccount, userId: string): AccountPermission => {
  if (stryMutAct_9fa48("5039")) {
    {}
  } else {
    stryCov_9fa48("5039");
    if (stryMutAct_9fa48("5042") ? false : stryMutAct_9fa48("5041") ? true : stryMutAct_9fa48("5040") ? userId : (stryCov_9fa48("5040", "5041", "5042"), !userId)) return null;
    if (stryMutAct_9fa48("5045") ? account.ownerId !== userId : stryMutAct_9fa48("5044") ? false : stryMutAct_9fa48("5043") ? true : (stryCov_9fa48("5043", "5044", "5045"), account.ownerId === userId)) return stryMutAct_9fa48("5046") ? "" : (stryCov_9fa48("5046"), 'owner');

    // Check V2 SharedWith
    if (stryMutAct_9fa48("5049") ? account.sharedWith || account.sharedWith[userId] : stryMutAct_9fa48("5048") ? false : stryMutAct_9fa48("5047") ? true : (stryCov_9fa48("5047", "5048", "5049"), account.sharedWith && account.sharedWith[userId])) {
      if (stryMutAct_9fa48("5050")) {
        {}
      } else {
        stryCov_9fa48("5050");
        return stryMutAct_9fa48("5053") ? account.sharedWith[userId].permission && 'read' : stryMutAct_9fa48("5052") ? false : stryMutAct_9fa48("5051") ? true : (stryCov_9fa48("5051", "5052", "5053"), account.sharedWith[userId].permission || (stryMutAct_9fa48("5054") ? "" : (stryCov_9fa48("5054"), 'read')));
      }
    }

    // Legacy Shares
    if (stryMutAct_9fa48("5057") ? account.shares || account.shares[userId] : stryMutAct_9fa48("5056") ? false : stryMutAct_9fa48("5055") ? true : (stryCov_9fa48("5055", "5056", "5057"), account.shares && account.shares[userId])) {
      if (stryMutAct_9fa48("5058")) {
        {}
      } else {
        stryCov_9fa48("5058");
        return account.shares[userId] as AccountPermission;
      }
    }
    return null;
  }
};

/**
 * Check if a user can view an account
 */
export const canViewAccount = (account: AnchorAccount, userId: string): boolean => {
  if (stryMutAct_9fa48("5059")) {
    {}
  } else {
    stryCov_9fa48("5059");
    const perm = getAccountPermission(account, userId);
    return stryMutAct_9fa48("5062") ? perm === null : stryMutAct_9fa48("5061") ? false : stryMutAct_9fa48("5060") ? true : (stryCov_9fa48("5060", "5061", "5062"), perm !== null);
  }
};

/**
 * Check if a user can add a transaction to an account
 */
export const canAddTransaction = (account: AnchorAccount, userId: string): boolean => {
  if (stryMutAct_9fa48("5063")) {
    {}
  } else {
    stryCov_9fa48("5063");
    const perm = getAccountPermission(account, userId);
    return stryMutAct_9fa48("5066") ? (perm === 'owner' || perm === 'transact') && perm === 'manage' : stryMutAct_9fa48("5065") ? false : stryMutAct_9fa48("5064") ? true : (stryCov_9fa48("5064", "5065", "5066"), (stryMutAct_9fa48("5068") ? perm === 'owner' && perm === 'transact' : stryMutAct_9fa48("5067") ? false : (stryCov_9fa48("5067", "5068"), (stryMutAct_9fa48("5070") ? perm !== 'owner' : stryMutAct_9fa48("5069") ? false : (stryCov_9fa48("5069", "5070"), perm === (stryMutAct_9fa48("5071") ? "" : (stryCov_9fa48("5071"), 'owner')))) || (stryMutAct_9fa48("5073") ? perm !== 'transact' : stryMutAct_9fa48("5072") ? false : (stryCov_9fa48("5072", "5073"), perm === (stryMutAct_9fa48("5074") ? "" : (stryCov_9fa48("5074"), 'transact')))))) || (stryMutAct_9fa48("5076") ? perm !== 'manage' : stryMutAct_9fa48("5075") ? false : (stryCov_9fa48("5075", "5076"), perm === (stryMutAct_9fa48("5077") ? "" : (stryCov_9fa48("5077"), 'manage')))));
  }
};

/**
 * Check if a user can edit a transaction in an account
 */
export const canEditTransaction = (account: AnchorAccount, userId: string): boolean => {
  if (stryMutAct_9fa48("5078")) {
    {}
  } else {
    stryCov_9fa48("5078");
    const perm = getAccountPermission(account, userId);
    return stryMutAct_9fa48("5081") ? perm === 'owner' && perm === 'manage' : stryMutAct_9fa48("5080") ? false : stryMutAct_9fa48("5079") ? true : (stryCov_9fa48("5079", "5080", "5081"), (stryMutAct_9fa48("5083") ? perm !== 'owner' : stryMutAct_9fa48("5082") ? false : (stryCov_9fa48("5082", "5083"), perm === (stryMutAct_9fa48("5084") ? "" : (stryCov_9fa48("5084"), 'owner')))) || (stryMutAct_9fa48("5086") ? perm !== 'manage' : stryMutAct_9fa48("5085") ? false : (stryCov_9fa48("5085", "5086"), perm === (stryMutAct_9fa48("5087") ? "" : (stryCov_9fa48("5087"), 'manage')))));
  }
};

/**
 * Check if a user can delete a transaction from an account
 */
export const canDeleteTransaction = (account: AnchorAccount, userId: string): boolean => {
  if (stryMutAct_9fa48("5088")) {
    {}
  } else {
    stryCov_9fa48("5088");
    const perm = getAccountPermission(account, userId);
    // Allow deleting if user has rights to transact or manage
    // This assumes if you can Add, you can Delete (e.g., if you made a mistake)
    // Validated against rules which allow delete if in sharedWith keys (mapped to transact usually)
    return stryMutAct_9fa48("5091") ? (perm === 'owner' || perm === 'manage') && perm === 'transact' : stryMutAct_9fa48("5090") ? false : stryMutAct_9fa48("5089") ? true : (stryCov_9fa48("5089", "5090", "5091"), (stryMutAct_9fa48("5093") ? perm === 'owner' && perm === 'manage' : stryMutAct_9fa48("5092") ? false : (stryCov_9fa48("5092", "5093"), (stryMutAct_9fa48("5095") ? perm !== 'owner' : stryMutAct_9fa48("5094") ? false : (stryCov_9fa48("5094", "5095"), perm === (stryMutAct_9fa48("5096") ? "" : (stryCov_9fa48("5096"), 'owner')))) || (stryMutAct_9fa48("5098") ? perm !== 'manage' : stryMutAct_9fa48("5097") ? false : (stryCov_9fa48("5097", "5098"), perm === (stryMutAct_9fa48("5099") ? "" : (stryCov_9fa48("5099"), 'manage')))))) || (stryMutAct_9fa48("5101") ? perm !== 'transact' : stryMutAct_9fa48("5100") ? false : (stryCov_9fa48("5100", "5101"), perm === (stryMutAct_9fa48("5102") ? "" : (stryCov_9fa48("5102"), 'transact')))));
  }
};

/**
 * Check if a user can manage (delete/share) an account
 */
export const canManageAccount = (account: AnchorAccount, userId: string): boolean => {
  if (stryMutAct_9fa48("5103")) {
    {}
  } else {
    stryCov_9fa48("5103");
    const perm = getAccountPermission(account, userId);
    return stryMutAct_9fa48("5106") ? perm === 'owner' && perm === 'manage' : stryMutAct_9fa48("5105") ? false : stryMutAct_9fa48("5104") ? true : (stryCov_9fa48("5104", "5105", "5106"), (stryMutAct_9fa48("5108") ? perm !== 'owner' : stryMutAct_9fa48("5107") ? false : (stryCov_9fa48("5107", "5108"), perm === (stryMutAct_9fa48("5109") ? "" : (stryCov_9fa48("5109"), 'owner')))) || (stryMutAct_9fa48("5111") ? perm !== 'manage' : stryMutAct_9fa48("5110") ? false : (stryCov_9fa48("5110", "5111"), perm === (stryMutAct_9fa48("5112") ? "" : (stryCov_9fa48("5112"), 'manage')))));
  }
};