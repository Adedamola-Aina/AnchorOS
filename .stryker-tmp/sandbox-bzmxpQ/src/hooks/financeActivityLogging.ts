/**
 * Activity Logging Helpers for Finance Operations
 * 
 * Extracted from useFinanceOperations.ts to keep hooks under 200 lines.
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
import type { User } from 'firebase/auth';
import type { AnchorAccount, AnchorTransaction } from '../types';
import { logAccountActivity } from '../utils/activityLogger';
import type { CreateTransactionPayload, UpdateTransactionPayload } from '../services/FinanceService';

/**
 * Log activity for a transaction that was added
 */
export function logTransactionAdded(user: User, userName: string, account: AnchorAccount, tx: CreateTransactionPayload): void {
  if (stryMutAct_9fa48("6534")) {
    {}
  } else {
    stryCov_9fa48("6534");
    if (stryMutAct_9fa48("6537") ? account.sharedWith && account.ownerId !== user.uid : stryMutAct_9fa48("6536") ? false : stryMutAct_9fa48("6535") ? true : (stryCov_9fa48("6535", "6536", "6537"), account.sharedWith || (stryMutAct_9fa48("6539") ? account.ownerId === user.uid : stryMutAct_9fa48("6538") ? false : (stryCov_9fa48("6538", "6539"), account.ownerId !== user.uid)))) {
      if (stryMutAct_9fa48("6540")) {
        {}
      } else {
        stryCov_9fa48("6540");
        logAccountActivity(stryMutAct_9fa48("6541") ? {} : (stryCov_9fa48("6541"), {
          action: stryMutAct_9fa48("6542") ? "" : (stryCov_9fa48("6542"), 'transaction_added'),
          accountId: tx.accountId,
          accountOwnerId: stryMutAct_9fa48("6545") ? account.ownerId && user.uid : stryMutAct_9fa48("6544") ? false : stryMutAct_9fa48("6543") ? true : (stryCov_9fa48("6543", "6544", "6545"), account.ownerId || user.uid),
          actorId: user.uid,
          actorName: userName,
          details: stryMutAct_9fa48("6546") ? {} : (stryCov_9fa48("6546"), {
            transactionTitle: tx.title,
            amountCents: tx.amountCents,
            currency: tx.currency,
            type: tx.type
          })
        }));
      }
    }
  }
}

/**
 * Log activity for a transaction that was deleted
 */
export function logTransactionDeleted(user: User, userName: string, account: AnchorAccount, txId: string, txToDelete?: AnchorTransaction): void {
  if (stryMutAct_9fa48("6547")) {
    {}
  } else {
    stryCov_9fa48("6547");
    if (stryMutAct_9fa48("6550") ? account.sharedWith && account.ownerId !== user.uid : stryMutAct_9fa48("6549") ? false : stryMutAct_9fa48("6548") ? true : (stryCov_9fa48("6548", "6549", "6550"), account.sharedWith || (stryMutAct_9fa48("6552") ? account.ownerId === user.uid : stryMutAct_9fa48("6551") ? false : (stryCov_9fa48("6551", "6552"), account.ownerId !== user.uid)))) {
      if (stryMutAct_9fa48("6553")) {
        {}
      } else {
        stryCov_9fa48("6553");
        logAccountActivity(stryMutAct_9fa48("6554") ? {} : (stryCov_9fa48("6554"), {
          action: stryMutAct_9fa48("6555") ? "" : (stryCov_9fa48("6555"), 'transaction_deleted'),
          accountId: account.id,
          accountOwnerId: stryMutAct_9fa48("6558") ? account.ownerId && user.uid : stryMutAct_9fa48("6557") ? false : stryMutAct_9fa48("6556") ? true : (stryCov_9fa48("6556", "6557", "6558"), account.ownerId || user.uid),
          actorId: user.uid,
          actorName: userName,
          details: stryMutAct_9fa48("6559") ? {} : (stryCov_9fa48("6559"), {
            transactionId: txId,
            transactionTitle: stryMutAct_9fa48("6562") ? txToDelete?.title && 'Unknown' : stryMutAct_9fa48("6561") ? false : stryMutAct_9fa48("6560") ? true : (stryCov_9fa48("6560", "6561", "6562"), (stryMutAct_9fa48("6563") ? txToDelete.title : (stryCov_9fa48("6563"), txToDelete?.title)) || (stryMutAct_9fa48("6564") ? "" : (stryCov_9fa48("6564"), 'Unknown'))),
            amountCents: stryMutAct_9fa48("6565") ? txToDelete.amountCents : (stryCov_9fa48("6565"), txToDelete?.amountCents),
            currency: stryMutAct_9fa48("6566") ? txToDelete.currency : (stryCov_9fa48("6566"), txToDelete?.currency),
            type: stryMutAct_9fa48("6567") ? txToDelete.type : (stryCov_9fa48("6567"), txToDelete?.type)
          })
        }));
      }
    }
  }
}

/**
 * Log activity for a transaction that was edited
 */
export function logTransactionEdited(user: User, userName: string, account: AnchorAccount, txId: string, updates: UpdateTransactionPayload, originalTx?: AnchorTransaction): void {
  if (stryMutAct_9fa48("6568")) {
    {}
  } else {
    stryCov_9fa48("6568");
    if (stryMutAct_9fa48("6571") ? account.sharedWith && account.ownerId !== user.uid : stryMutAct_9fa48("6570") ? false : stryMutAct_9fa48("6569") ? true : (stryCov_9fa48("6569", "6570", "6571"), account.sharedWith || (stryMutAct_9fa48("6573") ? account.ownerId === user.uid : stryMutAct_9fa48("6572") ? false : (stryCov_9fa48("6572", "6573"), account.ownerId !== user.uid)))) {
      if (stryMutAct_9fa48("6574")) {
        {}
      } else {
        stryCov_9fa48("6574");
        logAccountActivity(stryMutAct_9fa48("6575") ? {} : (stryCov_9fa48("6575"), {
          action: stryMutAct_9fa48("6576") ? "" : (stryCov_9fa48("6576"), 'transaction_edited'),
          accountId: account.id,
          accountOwnerId: stryMutAct_9fa48("6579") ? account.ownerId && user.uid : stryMutAct_9fa48("6578") ? false : stryMutAct_9fa48("6577") ? true : (stryCov_9fa48("6577", "6578", "6579"), account.ownerId || user.uid),
          actorId: user.uid,
          actorName: userName,
          details: stryMutAct_9fa48("6580") ? {} : (stryCov_9fa48("6580"), {
            transactionId: txId,
            transactionTitle: stryMutAct_9fa48("6583") ? (updates.title || originalTx?.title) && 'Unknown' : stryMutAct_9fa48("6582") ? false : stryMutAct_9fa48("6581") ? true : (stryCov_9fa48("6581", "6582", "6583"), (stryMutAct_9fa48("6585") ? updates.title && originalTx?.title : stryMutAct_9fa48("6584") ? false : (stryCov_9fa48("6584", "6585"), updates.title || (stryMutAct_9fa48("6586") ? originalTx.title : (stryCov_9fa48("6586"), originalTx?.title)))) || (stryMutAct_9fa48("6587") ? "" : (stryCov_9fa48("6587"), 'Unknown'))),
            amountCents: stryMutAct_9fa48("6590") ? updates.amountCents && originalTx?.amountCents : stryMutAct_9fa48("6589") ? false : stryMutAct_9fa48("6588") ? true : (stryCov_9fa48("6588", "6589", "6590"), updates.amountCents || (stryMutAct_9fa48("6591") ? originalTx.amountCents : (stryCov_9fa48("6591"), originalTx?.amountCents))),
            previousTitle: stryMutAct_9fa48("6592") ? originalTx.title : (stryCov_9fa48("6592"), originalTx?.title),
            previousAmountCents: stryMutAct_9fa48("6593") ? originalTx.amountCents : (stryCov_9fa48("6593"), originalTx?.amountCents),
            currency: stryMutAct_9fa48("6594") ? originalTx.currency : (stryCov_9fa48("6594"), originalTx?.currency),
            type: stryMutAct_9fa48("6595") ? originalTx.type : (stryCov_9fa48("6595"), originalTx?.type)
          })
        }));
      }
    }
  }
}