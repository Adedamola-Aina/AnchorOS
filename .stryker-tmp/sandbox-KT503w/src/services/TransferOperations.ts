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
  if (stryMutAct_9fa48("8392")) {
    {}
  } else {
    stryCov_9fa48("8392");
    if (stryMutAct_9fa48("8395") ? false : stryMutAct_9fa48("8394") ? true : stryMutAct_9fa48("8393") ? payload.destinationAccountId : (stryCov_9fa48("8393", "8394", "8395"), !payload.destinationAccountId)) {
      if (stryMutAct_9fa48("8396")) {
        {}
      } else {
        stryCov_9fa48("8396");
        throw new AnchorError(stryMutAct_9fa48("8397") ? "" : (stryCov_9fa48("8397"), 'Transfer missing destination account'), stryMutAct_9fa48("8398") ? "" : (stryCov_9fa48("8398"), 'VALIDATION'));
      }
    }
    const destAccount = accounts.find(stryMutAct_9fa48("8399") ? () => undefined : (stryCov_9fa48("8399"), a => stryMutAct_9fa48("8402") ? a.id !== payload.destinationAccountId : stryMutAct_9fa48("8401") ? false : stryMutAct_9fa48("8400") ? true : (stryCov_9fa48("8400", "8401", "8402"), a.id === payload.destinationAccountId)));
    if (stryMutAct_9fa48("8405") ? false : stryMutAct_9fa48("8404") ? true : stryMutAct_9fa48("8403") ? destAccount : (stryCov_9fa48("8403", "8404", "8405"), !destAccount)) {
      if (stryMutAct_9fa48("8406")) {
        {}
      } else {
        stryCov_9fa48("8406");
        throw new AnchorError(stryMutAct_9fa48("8407") ? "" : (stryCov_9fa48("8407"), 'Destination account not found'), stryMutAct_9fa48("8408") ? "" : (stryCov_9fa48("8408"), 'VALIDATION'));
      }
    }
    if (stryMutAct_9fa48("8411") ? false : stryMutAct_9fa48("8410") ? true : stryMutAct_9fa48("8409") ? canAddTransaction(destAccount, userId) : (stryCov_9fa48("8409", "8410", "8411"), !canAddTransaction(destAccount, userId))) {
      if (stryMutAct_9fa48("8412")) {
        {}
      } else {
        stryCov_9fa48("8412");
        throw new AnchorError(stryMutAct_9fa48("8413") ? `` : (stryCov_9fa48("8413"), `Permission denied: You cannot add transactions to ${destAccount.name}.`), stryMutAct_9fa48("8414") ? "" : (stryCov_9fa48("8414"), 'PERMISSION'));
      }
    }
    const linkId = stryMutAct_9fa48("8415") ? crypto.randomUUID() : (stryCov_9fa48("8415"), crypto.randomUUID().slice(0, 12));
    const sourceTxRef = doc(collection(firestore, stryMutAct_9fa48("8416") ? "" : (stryCov_9fa48("8416"), 'artifacts'), APP_ID, stryMutAct_9fa48("8417") ? "" : (stryCov_9fa48("8417"), 'users'), stryMutAct_9fa48("8420") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("8419") ? false : stryMutAct_9fa48("8418") ? true : (stryCov_9fa48("8418", "8419", "8420"), sourceAccount.ownerId || userId), stryMutAct_9fa48("8421") ? "" : (stryCov_9fa48("8421"), 'finance')));
    const destTxRef = doc(collection(firestore, stryMutAct_9fa48("8422") ? "" : (stryCov_9fa48("8422"), 'artifacts'), APP_ID, stryMutAct_9fa48("8423") ? "" : (stryCov_9fa48("8423"), 'users'), stryMutAct_9fa48("8426") ? destAccount.ownerId && userId : stryMutAct_9fa48("8425") ? false : stryMutAct_9fa48("8424") ? true : (stryCov_9fa48("8424", "8425", "8426"), destAccount.ownerId || userId), stryMutAct_9fa48("8427") ? "" : (stryCov_9fa48("8427"), 'finance')));
    const destAmount = stryMutAct_9fa48("8428") ? payload.destinationAmountCents && payload.amountCents : (stryCov_9fa48("8428"), payload.destinationAmountCents ?? payload.amountCents);

    // Record 1: Source (expense - money leaving)
    batch.set(sourceTxRef, stryMutAct_9fa48("8429") ? {} : (stryCov_9fa48("8429"), {
      ...payload,
      id: sourceTxRef.id,
      date: transactionDate,
      createdAt,
      isBackdated,
      type: stryMutAct_9fa48("8430") ? "" : (stryCov_9fa48("8430"), 'expense'),
      category: stryMutAct_9fa48("8431") ? "" : (stryCov_9fa48("8431"), 'Transfer'),
      title: stryMutAct_9fa48("8432") ? `` : (stryCov_9fa48("8432"), `Transfer to ${destAccount.name}`),
      accountName: sourceAccount.name,
      currency: sourceAccount.currency,
      createdBy: userId,
      isSoftDeleted: stryMutAct_9fa48("8433") ? true : (stryCov_9fa48("8433"), false),
      accountOwnerId: stryMutAct_9fa48("8436") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("8435") ? false : stryMutAct_9fa48("8434") ? true : (stryCov_9fa48("8434", "8435", "8436"), sourceAccount.ownerId || userId),
      accountShares: stryMutAct_9fa48("8439") ? sourceAccount.shares && {} : stryMutAct_9fa48("8438") ? false : stryMutAct_9fa48("8437") ? true : (stryCov_9fa48("8437", "8438", "8439"), sourceAccount.shares || {}),
      linkId,
      linkedTransactionId: destTxRef.id,
      linkedUserId: stryMutAct_9fa48("8442") ? destAccount.ownerId && userId : stryMutAct_9fa48("8441") ? false : stryMutAct_9fa48("8440") ? true : (stryCov_9fa48("8440", "8441", "8442"), destAccount.ownerId || userId)
    }));

    // Record 2: Destination (income - money arriving)
    batch.set(destTxRef, stryMutAct_9fa48("8443") ? {} : (stryCov_9fa48("8443"), {
      ...payload,
      id: destTxRef.id,
      amountCents: destAmount,
      // Use converted amount
      date: transactionDate,
      createdAt,
      isBackdated,
      type: stryMutAct_9fa48("8444") ? "" : (stryCov_9fa48("8444"), 'income'),
      category: stryMutAct_9fa48("8445") ? "" : (stryCov_9fa48("8445"), 'Transfer'),
      title: stryMutAct_9fa48("8446") ? `` : (stryCov_9fa48("8446"), `Transfer from ${sourceAccount.name}`),
      accountId: destAccount.id,
      accountName: destAccount.name,
      currency: destAccount.currency,
      createdBy: userId,
      isSoftDeleted: stryMutAct_9fa48("8447") ? true : (stryCov_9fa48("8447"), false),
      accountOwnerId: stryMutAct_9fa48("8450") ? destAccount.ownerId && userId : stryMutAct_9fa48("8449") ? false : stryMutAct_9fa48("8448") ? true : (stryCov_9fa48("8448", "8449", "8450"), destAccount.ownerId || userId),
      accountShares: stryMutAct_9fa48("8453") ? destAccount.shares && {} : stryMutAct_9fa48("8452") ? false : stryMutAct_9fa48("8451") ? true : (stryCov_9fa48("8451", "8452", "8453"), destAccount.shares || {}),
      linkId,
      linkedTransactionId: sourceTxRef.id,
      linkedUserId: stryMutAct_9fa48("8456") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("8455") ? false : stryMutAct_9fa48("8454") ? true : (stryCov_9fa48("8454", "8455", "8456"), sourceAccount.ownerId || userId),
      exchangeRate: payload.exchangeRate
    }));

    // Update balances
    const sourceAccRef = doc(firestore, stryMutAct_9fa48("8457") ? "" : (stryCov_9fa48("8457"), 'artifacts'), APP_ID, stryMutAct_9fa48("8458") ? "" : (stryCov_9fa48("8458"), 'users'), stryMutAct_9fa48("8461") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("8460") ? false : stryMutAct_9fa48("8459") ? true : (stryCov_9fa48("8459", "8460", "8461"), sourceAccount.ownerId || userId), stryMutAct_9fa48("8462") ? "" : (stryCov_9fa48("8462"), 'accounts'), sourceAccount.id);
    const destAccRef = doc(firestore, stryMutAct_9fa48("8463") ? "" : (stryCov_9fa48("8463"), 'artifacts'), APP_ID, stryMutAct_9fa48("8464") ? "" : (stryCov_9fa48("8464"), 'users'), stryMutAct_9fa48("8467") ? destAccount.ownerId && userId : stryMutAct_9fa48("8466") ? false : stryMutAct_9fa48("8465") ? true : (stryCov_9fa48("8465", "8466", "8467"), destAccount.ownerId || userId), stryMutAct_9fa48("8468") ? "" : (stryCov_9fa48("8468"), 'accounts'), destAccount.id);
    batch.update(sourceAccRef, stryMutAct_9fa48("8469") ? {} : (stryCov_9fa48("8469"), {
      balanceCents: increment(stryMutAct_9fa48("8470") ? +payload.amountCents : (stryCov_9fa48("8470"), -payload.amountCents))
    }));
    batch.update(destAccRef, stryMutAct_9fa48("8471") ? {} : (stryCov_9fa48("8471"), {
      balanceCents: increment(destAmount)
    }));
  }
}

/**
 * Handles standard (non-transfer) transaction creation
 */
export function processStandardTransaction(firestore: Firestore, batch: WriteBatch, userId: string, payload: CreateTransactionPayload, sourceAccount: AnchorAccount, transactionDate: string, createdAt: string, isBackdated: boolean): void {
  if (stryMutAct_9fa48("8472")) {
    {}
  } else {
    stryCov_9fa48("8472");
    // Exclude destinationAccountId (only for transfers) - explicitly omit with rest
    const {
      destinationAccountId: _ignored,
      ...transactionData
    } = payload;
    void _ignored; // Explicitly discard to satisfy linter
    const txRef = doc(collection(firestore, stryMutAct_9fa48("8473") ? "" : (stryCov_9fa48("8473"), 'artifacts'), APP_ID, stryMutAct_9fa48("8474") ? "" : (stryCov_9fa48("8474"), 'users'), stryMutAct_9fa48("8477") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("8476") ? false : stryMutAct_9fa48("8475") ? true : (stryCov_9fa48("8475", "8476", "8477"), sourceAccount.ownerId || userId), stryMutAct_9fa48("8478") ? "" : (stryCov_9fa48("8478"), 'finance')));
    batch.set(txRef, stryMutAct_9fa48("8479") ? {} : (stryCov_9fa48("8479"), {
      ...transactionData,
      id: txRef.id,
      date: transactionDate,
      createdAt,
      isBackdated,
      accountName: sourceAccount.name,
      currency: sourceAccount.currency,
      createdBy: userId,
      isSoftDeleted: stryMutAct_9fa48("8480") ? true : (stryCov_9fa48("8480"), false),
      accountOwnerId: stryMutAct_9fa48("8483") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("8482") ? false : stryMutAct_9fa48("8481") ? true : (stryCov_9fa48("8481", "8482", "8483"), sourceAccount.ownerId || userId),
      accountShares: stryMutAct_9fa48("8486") ? sourceAccount.shares && {} : stryMutAct_9fa48("8485") ? false : stryMutAct_9fa48("8484") ? true : (stryCov_9fa48("8484", "8485", "8486"), sourceAccount.shares || {})
    }));
    const accRef = doc(firestore, stryMutAct_9fa48("8487") ? "" : (stryCov_9fa48("8487"), 'artifacts'), APP_ID, stryMutAct_9fa48("8488") ? "" : (stryCov_9fa48("8488"), 'users'), stryMutAct_9fa48("8491") ? sourceAccount.ownerId && userId : stryMutAct_9fa48("8490") ? false : stryMutAct_9fa48("8489") ? true : (stryCov_9fa48("8489", "8490", "8491"), sourceAccount.ownerId || userId), stryMutAct_9fa48("8492") ? "" : (stryCov_9fa48("8492"), 'accounts'), sourceAccount.id);
    batch.update(accRef, stryMutAct_9fa48("8493") ? {} : (stryCov_9fa48("8493"), {
      balanceCents: increment((stryMutAct_9fa48("8496") ? payload.type !== 'income' : stryMutAct_9fa48("8495") ? false : stryMutAct_9fa48("8494") ? true : (stryCov_9fa48("8494", "8495", "8496"), payload.type === (stryMutAct_9fa48("8497") ? "" : (stryCov_9fa48("8497"), 'income')))) ? payload.amountCents : stryMutAct_9fa48("8498") ? +payload.amountCents : (stryCov_9fa48("8498"), -payload.amountCents))
    }));
  }
}