/**
 * TransferOperations
 * 
 * Helper module for handling transfer transactions between accounts.
 * Extracted from TransactionService to maintain the 200-line rule.
 * 
 * @module services/TransferOperations
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
import { collection, doc, increment, type WriteBatch, type Firestore } from 'firebase/firestore';
import { APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import type { AnchorAccount } from '../types';
import { canAddTransaction } from '../features/finance/utils/permissions';
import type { CreateTransactionPayload } from './financeTypes';

/**
 * Handles transfer transaction creation between two accounts
 */
export function processTransferTransaction(firestore: Firestore, batch: WriteBatch, userId: string, payload: CreateTransactionPayload, sourceAccount: AnchorAccount, accounts: AnchorAccount[], transactionDate: string, createdAt: string, isBackdated: boolean): void {
  if (stryMutAct_9fa48("682")) {
    {}
  } else {
    stryCov_9fa48("682");
    if (stryMutAct_9fa48("685") ? false : stryMutAct_9fa48("684") ? true : stryMutAct_9fa48("683") ? payload.destinationAccountId : (stryCov_9fa48("683", "684", "685"), !payload.destinationAccountId)) {
      if (stryMutAct_9fa48("686")) {
        {}
      } else {
        stryCov_9fa48("686");
        throw new AnchorError(stryMutAct_9fa48("687") ? "" : (stryCov_9fa48("687"), 'Transfer missing destination account'), stryMutAct_9fa48("688") ? "" : (stryCov_9fa48("688"), 'VALIDATION'));
      }
    }
    const destAccount = accounts.find(stryMutAct_9fa48("689") ? () => undefined : (stryCov_9fa48("689"), a => stryMutAct_9fa48("692") ? a.id !== payload.destinationAccountId : stryMutAct_9fa48("691") ? false : stryMutAct_9fa48("690") ? true : (stryCov_9fa48("690", "691", "692"), a.id === payload.destinationAccountId)));
    if (stryMutAct_9fa48("695") ? false : stryMutAct_9fa48("694") ? true : stryMutAct_9fa48("693") ? destAccount : (stryCov_9fa48("693", "694", "695"), !destAccount)) {
      if (stryMutAct_9fa48("696")) {
        {}
      } else {
        stryCov_9fa48("696");
        throw new AnchorError(stryMutAct_9fa48("697") ? "" : (stryCov_9fa48("697"), 'Destination account not found'), stryMutAct_9fa48("698") ? "" : (stryCov_9fa48("698"), 'VALIDATION'));
      }
    }
    if (stryMutAct_9fa48("701") ? false : stryMutAct_9fa48("700") ? true : stryMutAct_9fa48("699") ? canAddTransaction(destAccount, userId) : (stryCov_9fa48("699", "700", "701"), !canAddTransaction(destAccount, userId))) {
      if (stryMutAct_9fa48("702")) {
        {}
      } else {
        stryCov_9fa48("702");
        throw new AnchorError(stryMutAct_9fa48("703") ? `` : (stryCov_9fa48("703"), `Permission denied: You cannot add transactions to ${destAccount.name}.`), stryMutAct_9fa48("704") ? "" : (stryCov_9fa48("704"), 'PERMISSION'));
      }
    }
    const linkId = stryMutAct_9fa48("705") ? crypto.randomUUID() : (stryCov_9fa48("705"), crypto.randomUUID().slice(0, 12));
    const sourceTxRef = doc(collection(firestore, stryMutAct_9fa48("706") ? "" : (stryCov_9fa48("706"), 'artifacts'), APP_ID, stryMutAct_9fa48("707") ? "" : (stryCov_9fa48("707"), 'users'), stryMutAct_9fa48("710") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("709") ? false : stryMutAct_9fa48("708") ? true : (stryCov_9fa48("708", "709", "710"), sourceAccount.ownerId || userId), stryMutAct_9fa48("711") ? "" : (stryCov_9fa48("711"), 'finance')));
    const destTxRef = doc(collection(firestore, stryMutAct_9fa48("712") ? "" : (stryCov_9fa48("712"), 'artifacts'), APP_ID, stryMutAct_9fa48("713") ? "" : (stryCov_9fa48("713"), 'users'), stryMutAct_9fa48("716") ? destAccount.ownerId && userId : stryMutAct_9fa48("715") ? false : stryMutAct_9fa48("714") ? true : (stryCov_9fa48("714", "715", "716"), destAccount.ownerId || userId), stryMutAct_9fa48("717") ? "" : (stryCov_9fa48("717"), 'finance')));
    const destAmount = stryMutAct_9fa48("718") ? payload.destinationAmountCents && payload.amountCents : (stryCov_9fa48("718"), payload.destinationAmountCents ?? payload.amountCents);

    // Record 1: Source (expense - money leaving)
    batch.set(sourceTxRef, stryMutAct_9fa48("719") ? {} : (stryCov_9fa48("719"), {
      ...payload,
      id: sourceTxRef.id,
      date: transactionDate,
      createdAt,
      isBackdated,
      type: stryMutAct_9fa48("720") ? "" : (stryCov_9fa48("720"), 'expense'),
      category: stryMutAct_9fa48("721") ? "" : (stryCov_9fa48("721"), 'Transfer'),
      title: stryMutAct_9fa48("722") ? `` : (stryCov_9fa48("722"), `Transfer to ${destAccount.name}`),
      accountName: sourceAccount.name,
      currency: sourceAccount.currency,
      createdBy: userId,
      isSoftDeleted: stryMutAct_9fa48("723") ? true : (stryCov_9fa48("723"), false),
      accountOwnerId: stryMutAct_9fa48("726") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("725") ? false : stryMutAct_9fa48("724") ? true : (stryCov_9fa48("724", "725", "726"), sourceAccount.ownerId || userId),
      accountShares: stryMutAct_9fa48("729") ? sourceAccount.shares && {} : stryMutAct_9fa48("728") ? false : stryMutAct_9fa48("727") ? true : (stryCov_9fa48("727", "728", "729"), sourceAccount.shares || {}),
      linkId,
      linkedTransactionId: destTxRef.id,
      linkedUserId: stryMutAct_9fa48("732") ? destAccount.ownerId && userId : stryMutAct_9fa48("731") ? false : stryMutAct_9fa48("730") ? true : (stryCov_9fa48("730", "731", "732"), destAccount.ownerId || userId)
    }));

    // Record 2: Destination (income - money arriving)
    batch.set(destTxRef, stryMutAct_9fa48("733") ? {} : (stryCov_9fa48("733"), {
      ...payload,
      id: destTxRef.id,
      amountCents: destAmount,
      // Use converted amount
      date: transactionDate,
      createdAt,
      isBackdated,
      type: stryMutAct_9fa48("734") ? "" : (stryCov_9fa48("734"), 'income'),
      category: stryMutAct_9fa48("735") ? "" : (stryCov_9fa48("735"), 'Transfer'),
      title: stryMutAct_9fa48("736") ? `` : (stryCov_9fa48("736"), `Transfer from ${sourceAccount.name}`),
      accountId: destAccount.id,
      accountName: destAccount.name,
      currency: destAccount.currency,
      createdBy: userId,
      isSoftDeleted: stryMutAct_9fa48("737") ? true : (stryCov_9fa48("737"), false),
      accountOwnerId: stryMutAct_9fa48("740") ? destAccount.ownerId && userId : stryMutAct_9fa48("739") ? false : stryMutAct_9fa48("738") ? true : (stryCov_9fa48("738", "739", "740"), destAccount.ownerId || userId),
      accountShares: stryMutAct_9fa48("743") ? destAccount.shares && {} : stryMutAct_9fa48("742") ? false : stryMutAct_9fa48("741") ? true : (stryCov_9fa48("741", "742", "743"), destAccount.shares || {}),
      linkId,
      linkedTransactionId: sourceTxRef.id,
      linkedUserId: stryMutAct_9fa48("746") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("745") ? false : stryMutAct_9fa48("744") ? true : (stryCov_9fa48("744", "745", "746"), sourceAccount.ownerId || userId)
    }));

    // Update balances
    const sourceAccRef = doc(firestore, stryMutAct_9fa48("747") ? "" : (stryCov_9fa48("747"), 'artifacts'), APP_ID, stryMutAct_9fa48("748") ? "" : (stryCov_9fa48("748"), 'users'), stryMutAct_9fa48("751") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("750") ? false : stryMutAct_9fa48("749") ? true : (stryCov_9fa48("749", "750", "751"), sourceAccount.ownerId || userId), stryMutAct_9fa48("752") ? "" : (stryCov_9fa48("752"), 'accounts'), sourceAccount.id);
    const destAccRef = doc(firestore, stryMutAct_9fa48("753") ? "" : (stryCov_9fa48("753"), 'artifacts'), APP_ID, stryMutAct_9fa48("754") ? "" : (stryCov_9fa48("754"), 'users'), stryMutAct_9fa48("757") ? destAccount.ownerId && userId : stryMutAct_9fa48("756") ? false : stryMutAct_9fa48("755") ? true : (stryCov_9fa48("755", "756", "757"), destAccount.ownerId || userId), stryMutAct_9fa48("758") ? "" : (stryCov_9fa48("758"), 'accounts'), destAccount.id);
    batch.update(sourceAccRef, stryMutAct_9fa48("759") ? {} : (stryCov_9fa48("759"), {
      balanceCents: increment(stryMutAct_9fa48("760") ? +payload.amountCents : (stryCov_9fa48("760"), -payload.amountCents))
    }));
    batch.update(destAccRef, stryMutAct_9fa48("761") ? {} : (stryCov_9fa48("761"), {
      balanceCents: increment(destAmount)
    }));
  }
}

/**
 * Handles standard (non-transfer) transaction creation
 */
export function processStandardTransaction(firestore: Firestore, batch: WriteBatch, userId: string, payload: CreateTransactionPayload, sourceAccount: AnchorAccount, transactionDate: string, createdAt: string, isBackdated: boolean): void {
  if (stryMutAct_9fa48("762")) {
    {}
  } else {
    stryCov_9fa48("762");
    // Exclude destinationAccountId (only for transfers) - explicitly omit with rest
    const {
      destinationAccountId: _ignored,
      ...transactionData
    } = payload;
    void _ignored; // Explicitly discard to satisfy linter
    const txRef = doc(collection(firestore, stryMutAct_9fa48("763") ? "" : (stryCov_9fa48("763"), 'artifacts'), APP_ID, stryMutAct_9fa48("764") ? "" : (stryCov_9fa48("764"), 'users'), stryMutAct_9fa48("767") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("766") ? false : stryMutAct_9fa48("765") ? true : (stryCov_9fa48("765", "766", "767"), sourceAccount.ownerId || userId), stryMutAct_9fa48("768") ? "" : (stryCov_9fa48("768"), 'finance')));
    batch.set(txRef, stryMutAct_9fa48("769") ? {} : (stryCov_9fa48("769"), {
      ...transactionData,
      id: txRef.id,
      date: transactionDate,
      createdAt,
      isBackdated,
      accountName: sourceAccount.name,
      currency: sourceAccount.currency,
      createdBy: userId,
      isSoftDeleted: stryMutAct_9fa48("770") ? true : (stryCov_9fa48("770"), false),
      accountOwnerId: stryMutAct_9fa48("773") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("772") ? false : stryMutAct_9fa48("771") ? true : (stryCov_9fa48("771", "772", "773"), sourceAccount.ownerId || userId),
      accountShares: stryMutAct_9fa48("776") ? sourceAccount.shares && {} : stryMutAct_9fa48("775") ? false : stryMutAct_9fa48("774") ? true : (stryCov_9fa48("774", "775", "776"), sourceAccount.shares || {})
    }));
    const accRef = doc(firestore, stryMutAct_9fa48("777") ? "" : (stryCov_9fa48("777"), 'artifacts'), APP_ID, stryMutAct_9fa48("778") ? "" : (stryCov_9fa48("778"), 'users'), stryMutAct_9fa48("781") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("780") ? false : stryMutAct_9fa48("779") ? true : (stryCov_9fa48("779", "780", "781"), sourceAccount.ownerId || userId), stryMutAct_9fa48("782") ? "" : (stryCov_9fa48("782"), 'accounts'), sourceAccount.id);
    batch.update(accRef, stryMutAct_9fa48("783") ? {} : (stryCov_9fa48("783"), {
      balanceCents: increment((stryMutAct_9fa48("786") ? payload.type !== 'income' : stryMutAct_9fa48("785") ? false : stryMutAct_9fa48("784") ? true : (stryCov_9fa48("784", "785", "786"), payload.type === (stryMutAct_9fa48("787") ? "" : (stryCov_9fa48("787"), 'income')))) ? payload.amountCents : stryMutAct_9fa48("788") ? +payload.amountCents : (stryCov_9fa48("788"), -payload.amountCents))
    }));
  }
}