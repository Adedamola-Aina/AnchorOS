/**
 * Shared Account Subscription Helpers
 * 
 * Extracted from useSharedAccounts.ts to keep hooks under 200 lines.
 * Handles real-time Firestore subscriptions for shared accounts.
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
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import type { DocumentSnapshot, QuerySnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, AnchorTransaction } from '../types';
interface SharedAccountInfo {
  id: string;
  ownerUid: string;
}

/**
 * Subscribe to transactions for a shared account
 */
export function subscribeToTransactions(account: SharedAccountInfo, allTransactions: Map<string, AnchorTransaction[]>, onUpdate: (transactions: AnchorTransaction[]) => void): () => void {
  if (stryMutAct_9fa48("6698")) {
    {}
  } else {
    stryCov_9fa48("6698");
    const key = stryMutAct_9fa48("6699") ? `` : (stryCov_9fa48("6699"), `${account.ownerUid}:${account.id}`);
    const txQuery = query(collection(db, stryMutAct_9fa48("6700") ? "" : (stryCov_9fa48("6700"), 'artifacts'), APP_ID, stryMutAct_9fa48("6701") ? "" : (stryCov_9fa48("6701"), 'users'), account.ownerUid, stryMutAct_9fa48("6702") ? "" : (stryCov_9fa48("6702"), 'finance')), where(stryMutAct_9fa48("6703") ? "" : (stryCov_9fa48("6703"), 'accountId'), stryMutAct_9fa48("6704") ? "" : (stryCov_9fa48("6704"), '=='), account.id), orderBy(stryMutAct_9fa48("6705") ? "" : (stryCov_9fa48("6705"), 'date'), stryMutAct_9fa48("6706") ? "" : (stryCov_9fa48("6706"), 'desc')));
    return onSnapshot(txQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      if (stryMutAct_9fa48("6707")) {
        {}
      } else {
        stryCov_9fa48("6707");
        const txs = snapshot.docs.map(stryMutAct_9fa48("6708") ? () => undefined : (stryCov_9fa48("6708"), doc => ({
          id: doc.id,
          ...doc.data(),
          accountOwnerId: account.ownerUid
        }) as AnchorTransaction));
        allTransactions.set(key, txs);

        // Merge and sort all transactions
        const merged: AnchorTransaction[] = stryMutAct_9fa48("6709") ? ["Stryker was here"] : (stryCov_9fa48("6709"), []);
        allTransactions.forEach(stryMutAct_9fa48("6710") ? () => undefined : (stryCov_9fa48("6710"), txList => merged.push(...txList)));
        stryMutAct_9fa48("6711") ? merged : (stryCov_9fa48("6711"), merged.sort(stryMutAct_9fa48("6712") ? () => undefined : (stryCov_9fa48("6712"), (a, b) => stryMutAct_9fa48("6713") ? new Date(b.date).getTime() + new Date(a.date).getTime() : (stryCov_9fa48("6713"), new Date(b.date).getTime() - new Date(a.date).getTime()))));
        onUpdate(merged);
      }
    }, stryMutAct_9fa48("6714") ? () => undefined : (stryCov_9fa48("6714"), (err: FirestoreError) => console.error(stryMutAct_9fa48("6715") ? `` : (stryCov_9fa48("6715"), `Transaction subscription error for ${key}:`), err)));
  }
}

/**
 * Subscribe to account document for real-time balance updates
 */
export function subscribeToAccountDetails(account: SharedAccountInfo, onUpdate: (updater: (prev: AnchorAccount[]) => AnchorAccount[]) => void): () => void {
  if (stryMutAct_9fa48("6716")) {
    {}
  } else {
    stryCov_9fa48("6716");
    const key = stryMutAct_9fa48("6717") ? `` : (stryCov_9fa48("6717"), `${account.ownerUid}:${account.id}`);
    const accRef = doc(db, stryMutAct_9fa48("6718") ? "" : (stryCov_9fa48("6718"), 'artifacts'), APP_ID, stryMutAct_9fa48("6719") ? "" : (stryCov_9fa48("6719"), 'users'), account.ownerUid, stryMutAct_9fa48("6720") ? "" : (stryCov_9fa48("6720"), 'accounts'), account.id);
    return onSnapshot(accRef, (snapshot: DocumentSnapshot<DocumentData>) => {
      if (stryMutAct_9fa48("6721")) {
        {}
      } else {
        stryCov_9fa48("6721");
        if (stryMutAct_9fa48("6723") ? false : stryMutAct_9fa48("6722") ? true : (stryCov_9fa48("6722", "6723"), snapshot.exists())) {
          if (stryMutAct_9fa48("6724")) {
            {}
          } else {
            stryCov_9fa48("6724");
            const data = snapshot.data();
            onUpdate(prev => {
              if (stryMutAct_9fa48("6725")) {
                {}
              } else {
                stryCov_9fa48("6725");
                const idx = prev.findIndex(stryMutAct_9fa48("6726") ? () => undefined : (stryCov_9fa48("6726"), a => stryMutAct_9fa48("6729") ? a.id !== account.id : stryMutAct_9fa48("6728") ? false : stryMutAct_9fa48("6727") ? true : (stryCov_9fa48("6727", "6728", "6729"), a.id === account.id)));
                if (stryMutAct_9fa48("6732") ? idx !== -1 : stryMutAct_9fa48("6731") ? false : stryMutAct_9fa48("6730") ? true : (stryCov_9fa48("6730", "6731", "6732"), idx === (stryMutAct_9fa48("6733") ? +1 : (stryCov_9fa48("6733"), -1)))) return prev;
                const updatedAccount: AnchorAccount = {
                  id: snapshot.id,
                  ...(data as Record<string, unknown>),
                  ownerId: account.ownerUid,
                  sharedWith: data.sharedWith || prev[idx].sharedWith
                } as AnchorAccount;
                const newArr = stryMutAct_9fa48("6734") ? [] : (stryCov_9fa48("6734"), [...prev]);
                newArr[idx] = updatedAccount;
                return newArr;
              }
            });
          }
        } else {
          if (stryMutAct_9fa48("6735")) {
            {}
          } else {
            stryCov_9fa48("6735");
            // Account deleted
            onUpdate(stryMutAct_9fa48("6736") ? () => undefined : (stryCov_9fa48("6736"), prev => stryMutAct_9fa48("6737") ? prev : (stryCov_9fa48("6737"), prev.filter(stryMutAct_9fa48("6738") ? () => undefined : (stryCov_9fa48("6738"), a => stryMutAct_9fa48("6741") ? a.id === account.id : stryMutAct_9fa48("6740") ? false : stryMutAct_9fa48("6739") ? true : (stryCov_9fa48("6739", "6740", "6741"), a.id !== account.id))))));
          }
        }
      }
    }, stryMutAct_9fa48("6742") ? () => undefined : (stryCov_9fa48("6742"), (err: FirestoreError) => console.error(stryMutAct_9fa48("6743") ? `` : (stryCov_9fa48("6743"), `Account subscription error for ${key}:`), err)));
  }
}