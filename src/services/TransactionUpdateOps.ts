/**
 * Transaction update and linked-transaction sync operations.
 *
 * Extracted from TransactionService to keep modules under 200 lines.
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
import { doc, increment, runTransaction, type Firestore } from 'firebase/firestore';
import { APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import { auditFinance } from './AuditService';
import { canEditTransaction } from '../features/finance/utils/permissions';
import type { AnchorTransaction, AnchorAccount } from '../types';
import type { UpdateTransactionPayload } from './financeTypes';
export async function updateTransaction(firestore: Firestore, userId: string, transactionId: string, accountId: string, updates: UpdateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
  if (stryMutAct_9fa48("583")) {
    {}
  } else {
    stryCov_9fa48("583");
    const account = accounts.find(stryMutAct_9fa48("584") ? () => undefined : (stryCov_9fa48("584"), a => stryMutAct_9fa48("587") ? a.id !== accountId : stryMutAct_9fa48("586") ? false : stryMutAct_9fa48("585") ? true : (stryCov_9fa48("585", "586", "587"), a.id === accountId)));
    if (stryMutAct_9fa48("590") ? false : stryMutAct_9fa48("589") ? true : stryMutAct_9fa48("588") ? account : (stryCov_9fa48("588", "589", "590"), !account)) throw new AnchorError(stryMutAct_9fa48("591") ? "" : (stryCov_9fa48("591"), 'Account not found'), stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), 'VALIDATION'));
    if (stryMutAct_9fa48("595") ? false : stryMutAct_9fa48("594") ? true : stryMutAct_9fa48("593") ? canEditTransaction(account, userId) : (stryCov_9fa48("593", "594", "595"), !canEditTransaction(account, userId))) {
      if (stryMutAct_9fa48("596")) {
        {}
      } else {
        stryCov_9fa48("596");
        throw new AnchorError(stryMutAct_9fa48("597") ? "" : (stryCov_9fa48("597"), 'Permission denied: You cannot edit transactions in this account.'), stryMutAct_9fa48("598") ? "" : (stryCov_9fa48("598"), 'PERMISSION'));
      }
    }
    try {
      if (stryMutAct_9fa48("599")) {
        {}
      } else {
        stryCov_9fa48("599");
        await runTransaction(firestore, async transaction => {
          if (stryMutAct_9fa48("600")) {
            {}
          } else {
            stryCov_9fa48("600");
            const targetUserId = stryMutAct_9fa48("603") ? account.ownerId && userId : stryMutAct_9fa48("602") ? false : stryMutAct_9fa48("601") ? true : (stryCov_9fa48("601", "602", "603"), account.ownerId || userId);
            const txRef = doc(firestore, stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), 'artifacts'), APP_ID, stryMutAct_9fa48("605") ? "" : (stryCov_9fa48("605"), 'users'), targetUserId, stryMutAct_9fa48("606") ? "" : (stryCov_9fa48("606"), 'finance'), transactionId);
            const txDoc = await transaction.get(txRef);
            if (stryMutAct_9fa48("609") ? false : stryMutAct_9fa48("608") ? true : stryMutAct_9fa48("607") ? txDoc.exists() : (stryCov_9fa48("607", "608", "609"), !txDoc.exists())) throw new AnchorError(stryMutAct_9fa48("610") ? "" : (stryCov_9fa48("610"), 'Transaction does not exist'), stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), 'VALIDATION'));
            const currentData = txDoc.data() as AnchorTransaction;

            // BUG-036 Fix: Handle type change, amount change, or both
            const oldType = currentData.type;
            const newType = stryMutAct_9fa48("612") ? updates.type && oldType : (stryCov_9fa48("612"), updates.type ?? oldType);
            const oldAmount = currentData.amountCents;
            const newAmount = stryMutAct_9fa48("613") ? updates.amountCents && oldAmount : (stryCov_9fa48("613"), updates.amountCents ?? oldAmount);
            if (stryMutAct_9fa48("616") ? newType !== oldType && newAmount !== oldAmount : stryMutAct_9fa48("615") ? false : stryMutAct_9fa48("614") ? true : (stryCov_9fa48("614", "615", "616"), (stryMutAct_9fa48("618") ? newType === oldType : stryMutAct_9fa48("617") ? false : (stryCov_9fa48("617", "618"), newType !== oldType)) || (stryMutAct_9fa48("620") ? newAmount === oldAmount : stryMutAct_9fa48("619") ? false : (stryCov_9fa48("619", "620"), newAmount !== oldAmount)))) {
              if (stryMutAct_9fa48("621")) {
                {}
              } else {
                stryCov_9fa48("621");
                const oldContribution = (stryMutAct_9fa48("624") ? oldType !== 'income' : stryMutAct_9fa48("623") ? false : stryMutAct_9fa48("622") ? true : (stryCov_9fa48("622", "623", "624"), oldType === (stryMutAct_9fa48("625") ? "" : (stryCov_9fa48("625"), 'income')))) ? oldAmount : stryMutAct_9fa48("626") ? +oldAmount : (stryCov_9fa48("626"), -oldAmount);
                const newContribution = (stryMutAct_9fa48("629") ? newType !== 'income' : stryMutAct_9fa48("628") ? false : stryMutAct_9fa48("627") ? true : (stryCov_9fa48("627", "628", "629"), newType === (stryMutAct_9fa48("630") ? "" : (stryCov_9fa48("630"), 'income')))) ? newAmount : stryMutAct_9fa48("631") ? +newAmount : (stryCov_9fa48("631"), -newAmount);
                const correction = stryMutAct_9fa48("632") ? newContribution + oldContribution : (stryCov_9fa48("632"), newContribution - oldContribution);
                if (stryMutAct_9fa48("635") ? correction === 0 : stryMutAct_9fa48("634") ? false : stryMutAct_9fa48("633") ? true : (stryCov_9fa48("633", "634", "635"), correction !== 0)) {
                  if (stryMutAct_9fa48("636")) {
                    {}
                  } else {
                    stryCov_9fa48("636");
                    const accRef = doc(firestore, stryMutAct_9fa48("637") ? "" : (stryCov_9fa48("637"), 'artifacts'), APP_ID, stryMutAct_9fa48("638") ? "" : (stryCov_9fa48("638"), 'users'), targetUserId, stryMutAct_9fa48("639") ? "" : (stryCov_9fa48("639"), 'accounts'), accountId);
                    transaction.update(accRef, stryMutAct_9fa48("640") ? {} : (stryCov_9fa48("640"), {
                      balanceCents: increment(correction)
                    }));
                  }
                }
              }
            }
            transaction.update(txRef, stryMutAct_9fa48("641") ? {} : (stryCov_9fa48("641"), {
              ...updates,
              lastEditedBy: userId,
              updatedAt: new Date().toISOString()
            }));
            if (stryMutAct_9fa48("644") ? currentData.linkedTransactionId || currentData.linkedUserId : stryMutAct_9fa48("643") ? false : stryMutAct_9fa48("642") ? true : (stryCov_9fa48("642", "643", "644"), currentData.linkedTransactionId && currentData.linkedUserId)) {
              if (stryMutAct_9fa48("645")) {
                {}
              } else {
                stryCov_9fa48("645");
                await syncLinkedTransaction(firestore, transaction, currentData, updates);
              }
            }
          }
        });
        const changedFields = Object.keys(updates);
        auditFinance.transactionUpdated(transactionId, accountId, changedFields);
      }
    } catch (error) {
      if (stryMutAct_9fa48("646")) {
        {}
      } else {
        stryCov_9fa48("646");
        if (stryMutAct_9fa48("648") ? false : stryMutAct_9fa48("647") ? true : (stryCov_9fa48("647", "648"), error instanceof AnchorError)) throw error;
        throw new AnchorError(stryMutAct_9fa48("649") ? "" : (stryCov_9fa48("649"), 'Failed to update transaction'), stryMutAct_9fa48("650") ? "" : (stryCov_9fa48("650"), 'DATABASE'), error);
      }
    }
  }
}
async function syncLinkedTransaction(firestore: Firestore, transaction: Parameters<Parameters<typeof runTransaction>[1]>[0], currentData: AnchorTransaction, updates: UpdateTransactionPayload): Promise<void> {
  if (stryMutAct_9fa48("651")) {
    {}
  } else {
    stryCov_9fa48("651");
    const linkedTxRef = doc(firestore, stryMutAct_9fa48("652") ? "" : (stryCov_9fa48("652"), 'artifacts'), APP_ID, stryMutAct_9fa48("653") ? "" : (stryCov_9fa48("653"), 'users'), currentData.linkedUserId!, stryMutAct_9fa48("654") ? "" : (stryCov_9fa48("654"), 'finance'), currentData.linkedTransactionId!);
    const linkedDoc = await transaction.get(linkedTxRef);
    if (stryMutAct_9fa48("656") ? false : stryMutAct_9fa48("655") ? true : (stryCov_9fa48("655", "656"), linkedDoc.exists())) {
      if (stryMutAct_9fa48("657")) {
        {}
      } else {
        stryCov_9fa48("657");
        const linkedData = linkedDoc.data() as AnchorTransaction;

        // BUG-034: For cross-currency transfers, use destinationAmountCents
        const linkedAmountUpdate = stryMutAct_9fa48("658") ? updates.destinationAmountCents && updates.amountCents : (stryCov_9fa48("658"), updates.destinationAmountCents ?? updates.amountCents);
        if (stryMutAct_9fa48("661") ? linkedAmountUpdate !== undefined || linkedAmountUpdate !== linkedData.amountCents : stryMutAct_9fa48("660") ? false : stryMutAct_9fa48("659") ? true : (stryCov_9fa48("659", "660", "661"), (stryMutAct_9fa48("663") ? linkedAmountUpdate === undefined : stryMutAct_9fa48("662") ? true : (stryCov_9fa48("662", "663"), linkedAmountUpdate !== undefined)) && (stryMutAct_9fa48("665") ? linkedAmountUpdate === linkedData.amountCents : stryMutAct_9fa48("664") ? true : (stryCov_9fa48("664", "665"), linkedAmountUpdate !== linkedData.amountCents)))) {
          if (stryMutAct_9fa48("666")) {
            {}
          } else {
            stryCov_9fa48("666");
            const diff = stryMutAct_9fa48("667") ? linkedAmountUpdate + linkedData.amountCents : (stryCov_9fa48("667"), linkedAmountUpdate - linkedData.amountCents);
            const correction = (stryMutAct_9fa48("670") ? linkedData.type !== 'income' : stryMutAct_9fa48("669") ? false : stryMutAct_9fa48("668") ? true : (stryCov_9fa48("668", "669", "670"), linkedData.type === (stryMutAct_9fa48("671") ? "" : (stryCov_9fa48("671"), 'income')))) ? diff : stryMutAct_9fa48("672") ? +diff : (stryCov_9fa48("672"), -diff);
            const linkedAccRef = doc(firestore, stryMutAct_9fa48("673") ? "" : (stryCov_9fa48("673"), 'artifacts'), APP_ID, stryMutAct_9fa48("674") ? "" : (stryCov_9fa48("674"), 'users'), currentData.linkedUserId!, stryMutAct_9fa48("675") ? "" : (stryCov_9fa48("675"), 'accounts'), linkedData.accountId);
            transaction.update(linkedAccRef, stryMutAct_9fa48("676") ? {} : (stryCov_9fa48("676"), {
              balanceCents: increment(correction)
            }));
          }
        }
        const linkedUpdates = stryMutAct_9fa48("677") ? {} : (stryCov_9fa48("677"), {
          ...updates
        });
        if (stryMutAct_9fa48("680") ? updates.destinationAmountCents === undefined : stryMutAct_9fa48("679") ? false : stryMutAct_9fa48("678") ? true : (stryCov_9fa48("678", "679", "680"), updates.destinationAmountCents !== undefined)) {
          if (stryMutAct_9fa48("681")) {
            {}
          } else {
            stryCov_9fa48("681");
            linkedUpdates.amountCents = updates.destinationAmountCents;
            delete linkedUpdates.destinationAmountCents;
          }
        }
        transaction.update(linkedTxRef, linkedUpdates);
      }
    }
  }
}