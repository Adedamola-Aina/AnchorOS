/**
 * Shared Account Activity Types
 * 
 * Used for tracking and displaying activity on shared family accounts
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
export type ActivityAction = 'transaction_added' | 'transaction_edited' | 'transaction_deleted' | 'account_renamed' | 'account_shared' | 'account_unshared';
export interface AccountActivity {
  id: string;
  accountId: string;
  accountOwnerId: string;
  action: ActivityAction;
  actorId: string;
  actorName: string;
  timestamp: string;
  details: {
    // For transactions
    transactionId?: string;
    transactionTitle?: string;
    amountCents?: number;
    currency?: string;
    type?: 'income' | 'expense' | 'transfer';
    // For edits
    previousTitle?: string;
    previousAmountCents?: number;
    // For account rename
    oldName?: string;
    newName?: string;
    // For sharing
    sharedWithName?: string;
    permission?: 'read' | 'transact' | 'manage';
  };
}

/**
 * Helper to create activity entries
 */
export const createActivityEntry = stryMutAct_9fa48("8499") ? () => undefined : (stryCov_9fa48("8499"), (() => {
  const createActivityEntry = (action: ActivityAction, accountId: string, accountOwnerId: string, actorId: string, actorName: string, details: AccountActivity['details']): Omit<AccountActivity, 'id'> => stryMutAct_9fa48("8500") ? {} : (stryCov_9fa48("8500"), {
    accountId,
    accountOwnerId,
    action,
    actorId,
    actorName,
    timestamp: new Date().toISOString(),
    details
  });
  return createActivityEntry;
})());

/**
 * Format activity for display
 */
export const formatActivityMessage = (activity: AccountActivity): string => {
  if (stryMutAct_9fa48("8501")) {
    {}
  } else {
    stryCov_9fa48("8501");
    const {
      action,
      actorName,
      details
    } = activity;
    switch (action) {
      case stryMutAct_9fa48("8503") ? "" : (stryCov_9fa48("8503"), 'transaction_added'):
        if (stryMutAct_9fa48("8502")) {} else {
          stryCov_9fa48("8502");
          return stryMutAct_9fa48("8504") ? `` : (stryCov_9fa48("8504"), `${actorName} added "${details.transactionTitle}"`);
        }
      case stryMutAct_9fa48("8506") ? "" : (stryCov_9fa48("8506"), 'transaction_edited'):
        if (stryMutAct_9fa48("8505")) {} else {
          stryCov_9fa48("8505");
          if (stryMutAct_9fa48("8509") ? details.previousTitle || details.previousTitle !== details.transactionTitle : stryMutAct_9fa48("8508") ? false : stryMutAct_9fa48("8507") ? true : (stryCov_9fa48("8507", "8508", "8509"), details.previousTitle && (stryMutAct_9fa48("8511") ? details.previousTitle === details.transactionTitle : stryMutAct_9fa48("8510") ? true : (stryCov_9fa48("8510", "8511"), details.previousTitle !== details.transactionTitle)))) {
            if (stryMutAct_9fa48("8512")) {
              {}
            } else {
              stryCov_9fa48("8512");
              return stryMutAct_9fa48("8513") ? `` : (stryCov_9fa48("8513"), `${actorName} renamed "${details.previousTitle}" to "${details.transactionTitle}"`);
            }
          }
          if (stryMutAct_9fa48("8516") ? details.previousAmountCents !== undefined || details.previousAmountCents !== details.amountCents : stryMutAct_9fa48("8515") ? false : stryMutAct_9fa48("8514") ? true : (stryCov_9fa48("8514", "8515", "8516"), (stryMutAct_9fa48("8518") ? details.previousAmountCents === undefined : stryMutAct_9fa48("8517") ? true : (stryCov_9fa48("8517", "8518"), details.previousAmountCents !== undefined)) && (stryMutAct_9fa48("8520") ? details.previousAmountCents === details.amountCents : stryMutAct_9fa48("8519") ? true : (stryCov_9fa48("8519", "8520"), details.previousAmountCents !== details.amountCents)))) {
            if (stryMutAct_9fa48("8521")) {
              {}
            } else {
              stryCov_9fa48("8521");
              return stryMutAct_9fa48("8522") ? `` : (stryCov_9fa48("8522"), `${actorName} updated amount on "${details.transactionTitle}"`);
            }
          }
          return stryMutAct_9fa48("8523") ? `` : (stryCov_9fa48("8523"), `${actorName} edited "${details.transactionTitle}"`);
        }
      case stryMutAct_9fa48("8525") ? "" : (stryCov_9fa48("8525"), 'transaction_deleted'):
        if (stryMutAct_9fa48("8524")) {} else {
          stryCov_9fa48("8524");
          return stryMutAct_9fa48("8526") ? `` : (stryCov_9fa48("8526"), `${actorName} deleted "${details.transactionTitle}"`);
        }
      case stryMutAct_9fa48("8528") ? "" : (stryCov_9fa48("8528"), 'account_renamed'):
        if (stryMutAct_9fa48("8527")) {} else {
          stryCov_9fa48("8527");
          return stryMutAct_9fa48("8529") ? `` : (stryCov_9fa48("8529"), `${actorName} renamed account from "${details.oldName}" to "${details.newName}"`);
        }
      case stryMutAct_9fa48("8531") ? "" : (stryCov_9fa48("8531"), 'account_shared'):
        if (stryMutAct_9fa48("8530")) {} else {
          stryCov_9fa48("8530");
          return stryMutAct_9fa48("8532") ? `` : (stryCov_9fa48("8532"), `${actorName} shared this account with ${details.sharedWithName}`);
        }
      case stryMutAct_9fa48("8534") ? "" : (stryCov_9fa48("8534"), 'account_unshared'):
        if (stryMutAct_9fa48("8533")) {} else {
          stryCov_9fa48("8533");
          return stryMutAct_9fa48("8535") ? `` : (stryCov_9fa48("8535"), `${actorName} stopped sharing with ${details.sharedWithName}`);
        }
      default:
        if (stryMutAct_9fa48("8536")) {} else {
          stryCov_9fa48("8536");
          return stryMutAct_9fa48("8537") ? `` : (stryCov_9fa48("8537"), `${actorName} performed an action`);
        }
    }
  }
};

/**
 * Get icon name for activity type
 */
export const getActivityIcon = (action: ActivityAction): string => {
  if (stryMutAct_9fa48("8538")) {
    {}
  } else {
    stryCov_9fa48("8538");
    switch (action) {
      case stryMutAct_9fa48("8540") ? "" : (stryCov_9fa48("8540"), 'transaction_added'):
        if (stryMutAct_9fa48("8539")) {} else {
          stryCov_9fa48("8539");
          return stryMutAct_9fa48("8541") ? "" : (stryCov_9fa48("8541"), 'plus-circle');
        }
      case stryMutAct_9fa48("8543") ? "" : (stryCov_9fa48("8543"), 'transaction_edited'):
        if (stryMutAct_9fa48("8542")) {} else {
          stryCov_9fa48("8542");
          return stryMutAct_9fa48("8544") ? "" : (stryCov_9fa48("8544"), 'pencil');
        }
      case stryMutAct_9fa48("8546") ? "" : (stryCov_9fa48("8546"), 'transaction_deleted'):
        if (stryMutAct_9fa48("8545")) {} else {
          stryCov_9fa48("8545");
          return stryMutAct_9fa48("8547") ? "" : (stryCov_9fa48("8547"), 'trash-2');
        }
      case stryMutAct_9fa48("8549") ? "" : (stryCov_9fa48("8549"), 'account_renamed'):
        if (stryMutAct_9fa48("8548")) {} else {
          stryCov_9fa48("8548");
          return stryMutAct_9fa48("8550") ? "" : (stryCov_9fa48("8550"), 'type');
        }
      case stryMutAct_9fa48("8552") ? "" : (stryCov_9fa48("8552"), 'account_shared'):
        if (stryMutAct_9fa48("8551")) {} else {
          stryCov_9fa48("8551");
          return stryMutAct_9fa48("8553") ? "" : (stryCov_9fa48("8553"), 'user-plus');
        }
      case stryMutAct_9fa48("8555") ? "" : (stryCov_9fa48("8555"), 'account_unshared'):
        if (stryMutAct_9fa48("8554")) {} else {
          stryCov_9fa48("8554");
          return stryMutAct_9fa48("8556") ? "" : (stryCov_9fa48("8556"), 'user-minus');
        }
      default:
        if (stryMutAct_9fa48("8557")) {} else {
          stryCov_9fa48("8557");
          return stryMutAct_9fa48("8558") ? "" : (stryCov_9fa48("8558"), 'activity');
        }
    }
  }
};

/**
 * Get color class for activity type
 */
export const getActivityColor = (action: ActivityAction): string => {
  if (stryMutAct_9fa48("8559")) {
    {}
  } else {
    stryCov_9fa48("8559");
    switch (action) {
      case stryMutAct_9fa48("8561") ? "" : (stryCov_9fa48("8561"), 'transaction_added'):
        if (stryMutAct_9fa48("8560")) {} else {
          stryCov_9fa48("8560");
          return stryMutAct_9fa48("8562") ? "" : (stryCov_9fa48("8562"), 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20');
        }
      case stryMutAct_9fa48("8564") ? "" : (stryCov_9fa48("8564"), 'transaction_edited'):
        if (stryMutAct_9fa48("8563")) {} else {
          stryCov_9fa48("8563");
          return stryMutAct_9fa48("8565") ? "" : (stryCov_9fa48("8565"), 'text-primary-500 bg-primary-50 dark:bg-blue-900/20');
        }
      case stryMutAct_9fa48("8567") ? "" : (stryCov_9fa48("8567"), 'transaction_deleted'):
        if (stryMutAct_9fa48("8566")) {} else {
          stryCov_9fa48("8566");
          return stryMutAct_9fa48("8568") ? "" : (stryCov_9fa48("8568"), 'text-rose-500 bg-rose-50 dark:bg-rose-900/20');
        }
      case stryMutAct_9fa48("8570") ? "" : (stryCov_9fa48("8570"), 'account_renamed'):
        if (stryMutAct_9fa48("8569")) {} else {
          stryCov_9fa48("8569");
          return stryMutAct_9fa48("8571") ? "" : (stryCov_9fa48("8571"), 'text-amber-500 bg-amber-50 dark:bg-amber-900/20');
        }
      case stryMutAct_9fa48("8573") ? "" : (stryCov_9fa48("8573"), 'account_shared'):
        if (stryMutAct_9fa48("8572")) {} else {
          stryCov_9fa48("8572");
          return stryMutAct_9fa48("8574") ? "" : (stryCov_9fa48("8574"), 'text-primary-500 bg-primary-50 dark:bg-indigo-900/20');
        }
      case stryMutAct_9fa48("8576") ? "" : (stryCov_9fa48("8576"), 'account_unshared'):
        if (stryMutAct_9fa48("8575")) {} else {
          stryCov_9fa48("8575");
          return stryMutAct_9fa48("8577") ? "" : (stryCov_9fa48("8577"), 'text-slate-500 bg-slate-50 dark:bg-slate-900/20');
        }
      default:
        if (stryMutAct_9fa48("8578")) {} else {
          stryCov_9fa48("8578");
          return stryMutAct_9fa48("8579") ? "" : (stryCov_9fa48("8579"), 'text-slate-500 bg-slate-50 dark:bg-slate-900/20');
        }
    }
  }
};