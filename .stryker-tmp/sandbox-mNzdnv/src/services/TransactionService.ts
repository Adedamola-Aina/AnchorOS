/**
 * TransactionService
 * 
 * Handles all transaction-related operations including creation, deletion,
 * and updates with optimistic locking and transfer support.
 * 
 * @module services/TransactionService
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
import { doc, increment, writeBatch, getDoc, runTransaction, type Firestore } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import type { AnchorTransaction, AnchorAccount } from '../types';
import { canAddTransaction, canDeleteTransaction, canEditTransaction } from '../features/finance/utils/permissions';
import { processTransferTransaction, processStandardTransaction } from './TransferOperations';
import type { CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

// Re-export types for backward compatibility
export type { CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

/**
 * TransactionService providing transaction management operations
 */
export class TransactionService {
  private firestore: Firestore;
  constructor(firestore: Firestore = db) {
    if (stryMutAct_9fa48("8203")) {
      {}
    } else {
      stryCov_9fa48("8203");
      this.firestore = firestore;
    }
  }

  /** Add a new transaction (handles transfers and standard transactions) */
  async addTransaction(userId: string, payload: CreateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
    if (stryMutAct_9fa48("8204")) {
      {}
    } else {
      stryCov_9fa48("8204");
      const sourceAccount = accounts.find(stryMutAct_9fa48("8205") ? () => undefined : (stryCov_9fa48("8205"), a => stryMutAct_9fa48("8208") ? a.id !== payload.accountId : stryMutAct_9fa48("8207") ? false : stryMutAct_9fa48("8206") ? true : (stryCov_9fa48("8206", "8207", "8208"), a.id === payload.accountId)));
      if (stryMutAct_9fa48("8211") ? false : stryMutAct_9fa48("8210") ? true : stryMutAct_9fa48("8209") ? sourceAccount : (stryCov_9fa48("8209", "8210", "8211"), !sourceAccount)) throw new AnchorError(stryMutAct_9fa48("8212") ? "" : (stryCov_9fa48("8212"), 'Source account not found'), stryMutAct_9fa48("8213") ? "" : (stryCov_9fa48("8213"), 'VALIDATION'));
      if (stryMutAct_9fa48("8216") ? false : stryMutAct_9fa48("8215") ? true : stryMutAct_9fa48("8214") ? canAddTransaction(sourceAccount, userId) : (stryCov_9fa48("8214", "8215", "8216"), !canAddTransaction(sourceAccount, userId))) {
        if (stryMutAct_9fa48("8217")) {
          {}
        } else {
          stryCov_9fa48("8217");
          throw new AnchorError(stryMutAct_9fa48("8218") ? `` : (stryCov_9fa48("8218"), `Permission denied: You cannot add transactions to ${sourceAccount.name}.`), stryMutAct_9fa48("8219") ? "" : (stryCov_9fa48("8219"), 'PERMISSION'));
        }
      }
      try {
        if (stryMutAct_9fa48("8220")) {
          {}
        } else {
          stryCov_9fa48("8220");
          const batch = writeBatch(this.firestore);
          const now = new Date();
          const createdAt = now.toISOString();
          const transactionDate = stryMutAct_9fa48("8223") ? payload.date && createdAt : stryMutAct_9fa48("8222") ? false : stryMutAct_9fa48("8221") ? true : (stryCov_9fa48("8221", "8222", "8223"), payload.date || createdAt);
          const isBackdated = payload.date ? stryMutAct_9fa48("8226") ? new Date(payload.date).toDateString() === now.toDateString() : stryMutAct_9fa48("8225") ? false : stryMutAct_9fa48("8224") ? true : (stryCov_9fa48("8224", "8225", "8226"), new Date(payload.date).toDateString() !== now.toDateString()) : stryMutAct_9fa48("8227") ? true : (stryCov_9fa48("8227"), false);
          if (stryMutAct_9fa48("8230") ? payload.type !== 'transfer' : stryMutAct_9fa48("8229") ? false : stryMutAct_9fa48("8228") ? true : (stryCov_9fa48("8228", "8229", "8230"), payload.type === (stryMutAct_9fa48("8231") ? "" : (stryCov_9fa48("8231"), 'transfer')))) {
            if (stryMutAct_9fa48("8232")) {
              {}
            } else {
              stryCov_9fa48("8232");
              processTransferTransaction(this.firestore, batch, userId, payload, sourceAccount, accounts, transactionDate, createdAt, isBackdated);
            }
          } else {
            if (stryMutAct_9fa48("8233")) {
              {}
            } else {
              stryCov_9fa48("8233");
              processStandardTransaction(this.firestore, batch, userId, payload, sourceAccount, transactionDate, createdAt, isBackdated);
            }
          }
          await batch.commit();
        }
      } catch (error) {
        if (stryMutAct_9fa48("8234")) {
          {}
        } else {
          stryCov_9fa48("8234");
          if (stryMutAct_9fa48("8236") ? false : stryMutAct_9fa48("8235") ? true : (stryCov_9fa48("8235", "8236"), error instanceof AnchorError)) throw error;
          throw new AnchorError(stryMutAct_9fa48("8237") ? "" : (stryCov_9fa48("8237"), 'Failed to add transaction'), stryMutAct_9fa48("8238") ? "" : (stryCov_9fa48("8238"), 'DATABASE'), error);
        }
      }
    }
  }

  /** Delete a transaction (soft delete with balance reversal) */
  async deleteTransaction(userId: string, transactionId: string, accountId: string, accounts: AnchorAccount[], transactions: AnchorTransaction[]): Promise<void> {
    if (stryMutAct_9fa48("8239")) {
      {}
    } else {
      stryCov_9fa48("8239");
      const account = accounts.find(stryMutAct_9fa48("8240") ? () => undefined : (stryCov_9fa48("8240"), a => stryMutAct_9fa48("8243") ? a.id !== accountId : stryMutAct_9fa48("8242") ? false : stryMutAct_9fa48("8241") ? true : (stryCov_9fa48("8241", "8242", "8243"), a.id === accountId)));
      if (stryMutAct_9fa48("8246") ? false : stryMutAct_9fa48("8245") ? true : stryMutAct_9fa48("8244") ? account : (stryCov_9fa48("8244", "8245", "8246"), !account)) throw new AnchorError(stryMutAct_9fa48("8247") ? "" : (stryCov_9fa48("8247"), 'Account not found'), stryMutAct_9fa48("8248") ? "" : (stryCov_9fa48("8248"), 'VALIDATION'));
      if (stryMutAct_9fa48("8251") ? false : stryMutAct_9fa48("8250") ? true : stryMutAct_9fa48("8249") ? canDeleteTransaction(account, userId) : (stryCov_9fa48("8249", "8250", "8251"), !canDeleteTransaction(account, userId))) {
        if (stryMutAct_9fa48("8252")) {
          {}
        } else {
          stryCov_9fa48("8252");
          throw new AnchorError(stryMutAct_9fa48("8253") ? "" : (stryCov_9fa48("8253"), 'Permission denied: You cannot delete transactions from this account.'), stryMutAct_9fa48("8254") ? "" : (stryCov_9fa48("8254"), 'PERMISSION'));
        }
      }
      const txToDelete = transactions.find(stryMutAct_9fa48("8255") ? () => undefined : (stryCov_9fa48("8255"), t => stryMutAct_9fa48("8258") ? t.id !== transactionId : stryMutAct_9fa48("8257") ? false : stryMutAct_9fa48("8256") ? true : (stryCov_9fa48("8256", "8257", "8258"), t.id === transactionId)));
      if (stryMutAct_9fa48("8261") ? false : stryMutAct_9fa48("8260") ? true : stryMutAct_9fa48("8259") ? txToDelete : (stryCov_9fa48("8259", "8260", "8261"), !txToDelete)) throw new AnchorError(stryMutAct_9fa48("8262") ? "" : (stryCov_9fa48("8262"), 'Transaction not found'), stryMutAct_9fa48("8263") ? "" : (stryCov_9fa48("8263"), 'VALIDATION'));
      try {
        if (stryMutAct_9fa48("8264")) {
          {}
        } else {
          stryCov_9fa48("8264");
          const batch = writeBatch(this.firestore);
          const timestamp = new Date().toISOString();
          const targetUserId = stryMutAct_9fa48("8267") ? account.ownerId && userId : stryMutAct_9fa48("8266") ? false : stryMutAct_9fa48("8265") ? true : (stryCov_9fa48("8265", "8266", "8267"), account.ownerId || userId);
          const txRef = doc(this.firestore, stryMutAct_9fa48("8268") ? "" : (stryCov_9fa48("8268"), 'artifacts'), APP_ID, stryMutAct_9fa48("8269") ? "" : (stryCov_9fa48("8269"), 'users'), targetUserId, stryMutAct_9fa48("8270") ? "" : (stryCov_9fa48("8270"), 'finance'), transactionId);
          batch.update(txRef, stryMutAct_9fa48("8271") ? {} : (stryCov_9fa48("8271"), {
            isSoftDeleted: stryMutAct_9fa48("8272") ? false : (stryCov_9fa48("8272"), true),
            deletedBy: userId,
            deletedAt: timestamp
          }));
          const accRef = doc(this.firestore, stryMutAct_9fa48("8273") ? "" : (stryCov_9fa48("8273"), 'artifacts'), APP_ID, stryMutAct_9fa48("8274") ? "" : (stryCov_9fa48("8274"), 'users'), targetUserId, stryMutAct_9fa48("8275") ? "" : (stryCov_9fa48("8275"), 'accounts'), accountId);
          const balanceAdj = (stryMutAct_9fa48("8278") ? txToDelete.type !== 'income' : stryMutAct_9fa48("8277") ? false : stryMutAct_9fa48("8276") ? true : (stryCov_9fa48("8276", "8277", "8278"), txToDelete.type === (stryMutAct_9fa48("8279") ? "" : (stryCov_9fa48("8279"), 'income')))) ? stryMutAct_9fa48("8280") ? +txToDelete.amountCents : (stryCov_9fa48("8280"), -txToDelete.amountCents) : txToDelete.amountCents;
          batch.update(accRef, stryMutAct_9fa48("8281") ? {} : (stryCov_9fa48("8281"), {
            balanceCents: increment(balanceAdj)
          }));
          if (stryMutAct_9fa48("8284") ? txToDelete.linkedTransactionId || txToDelete.linkedUserId : stryMutAct_9fa48("8283") ? false : stryMutAct_9fa48("8282") ? true : (stryCov_9fa48("8282", "8283", "8284"), txToDelete.linkedTransactionId && txToDelete.linkedUserId)) {
            if (stryMutAct_9fa48("8285")) {
              {}
            } else {
              stryCov_9fa48("8285");
              await this.deleteLinkedTransaction(batch, txToDelete, userId, timestamp);
            }
          }
          await batch.commit();
        }
      } catch (error) {
        if (stryMutAct_9fa48("8286")) {
          {}
        } else {
          stryCov_9fa48("8286");
          if (stryMutAct_9fa48("8288") ? false : stryMutAct_9fa48("8287") ? true : (stryCov_9fa48("8287", "8288"), error instanceof AnchorError)) throw error;
          throw new AnchorError(stryMutAct_9fa48("8289") ? "" : (stryCov_9fa48("8289"), 'Failed to delete transaction'), stryMutAct_9fa48("8290") ? "" : (stryCov_9fa48("8290"), 'DATABASE'), error);
        }
      }
    }
  }
  private async deleteLinkedTransaction(batch: ReturnType<typeof writeBatch>, txToDelete: AnchorTransaction, userId: string, timestamp: string): Promise<void> {
    if (stryMutAct_9fa48("8291")) {
      {}
    } else {
      stryCov_9fa48("8291");
      const linkedTxRef = doc(this.firestore, stryMutAct_9fa48("8292") ? "" : (stryCov_9fa48("8292"), 'artifacts'), APP_ID, stryMutAct_9fa48("8293") ? "" : (stryCov_9fa48("8293"), 'users'), txToDelete.linkedUserId!, stryMutAct_9fa48("8294") ? "" : (stryCov_9fa48("8294"), 'finance'), txToDelete.linkedTransactionId!);
      const linkedTxDoc = await getDoc(linkedTxRef);
      if (stryMutAct_9fa48("8296") ? false : stryMutAct_9fa48("8295") ? true : (stryCov_9fa48("8295", "8296"), linkedTxDoc.exists())) {
        if (stryMutAct_9fa48("8297")) {
          {}
        } else {
          stryCov_9fa48("8297");
          const pairedTx = linkedTxDoc.data() as AnchorTransaction;
          batch.update(linkedTxRef, stryMutAct_9fa48("8298") ? {} : (stryCov_9fa48("8298"), {
            isSoftDeleted: stryMutAct_9fa48("8299") ? false : (stryCov_9fa48("8299"), true),
            deletedBy: userId,
            deletedAt: timestamp
          }));
          const linkedAccRef = doc(this.firestore, stryMutAct_9fa48("8300") ? "" : (stryCov_9fa48("8300"), 'artifacts'), APP_ID, stryMutAct_9fa48("8301") ? "" : (stryCov_9fa48("8301"), 'users'), txToDelete.linkedUserId!, stryMutAct_9fa48("8302") ? "" : (stryCov_9fa48("8302"), 'accounts'), pairedTx.accountId);
          batch.update(linkedAccRef, stryMutAct_9fa48("8303") ? {} : (stryCov_9fa48("8303"), {
            balanceCents: increment((stryMutAct_9fa48("8306") ? pairedTx.type !== 'income' : stryMutAct_9fa48("8305") ? false : stryMutAct_9fa48("8304") ? true : (stryCov_9fa48("8304", "8305", "8306"), pairedTx.type === (stryMutAct_9fa48("8307") ? "" : (stryCov_9fa48("8307"), 'income')))) ? stryMutAct_9fa48("8308") ? +pairedTx.amountCents : (stryCov_9fa48("8308"), -pairedTx.amountCents) : pairedTx.amountCents)
          }));
        }
      }
    }
  }

  /** Update a transaction with optimistic locking */
  async updateTransaction(userId: string, transactionId: string, accountId: string, updates: UpdateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
    if (stryMutAct_9fa48("8309")) {
      {}
    } else {
      stryCov_9fa48("8309");
      const account = accounts.find(stryMutAct_9fa48("8310") ? () => undefined : (stryCov_9fa48("8310"), a => stryMutAct_9fa48("8313") ? a.id !== accountId : stryMutAct_9fa48("8312") ? false : stryMutAct_9fa48("8311") ? true : (stryCov_9fa48("8311", "8312", "8313"), a.id === accountId)));
      if (stryMutAct_9fa48("8316") ? false : stryMutAct_9fa48("8315") ? true : stryMutAct_9fa48("8314") ? account : (stryCov_9fa48("8314", "8315", "8316"), !account)) throw new AnchorError(stryMutAct_9fa48("8317") ? "" : (stryCov_9fa48("8317"), 'Account not found'), stryMutAct_9fa48("8318") ? "" : (stryCov_9fa48("8318"), 'VALIDATION'));
      if (stryMutAct_9fa48("8321") ? false : stryMutAct_9fa48("8320") ? true : stryMutAct_9fa48("8319") ? canEditTransaction(account, userId) : (stryCov_9fa48("8319", "8320", "8321"), !canEditTransaction(account, userId))) {
        if (stryMutAct_9fa48("8322")) {
          {}
        } else {
          stryCov_9fa48("8322");
          throw new AnchorError(stryMutAct_9fa48("8323") ? "" : (stryCov_9fa48("8323"), 'Permission denied: You cannot edit transactions in this account.'), stryMutAct_9fa48("8324") ? "" : (stryCov_9fa48("8324"), 'PERMISSION'));
        }
      }
      try {
        if (stryMutAct_9fa48("8325")) {
          {}
        } else {
          stryCov_9fa48("8325");
          await runTransaction(this.firestore, async transaction => {
            if (stryMutAct_9fa48("8326")) {
              {}
            } else {
              stryCov_9fa48("8326");
              const targetUserId = stryMutAct_9fa48("8329") ? account.ownerId && userId : stryMutAct_9fa48("8328") ? false : stryMutAct_9fa48("8327") ? true : (stryCov_9fa48("8327", "8328", "8329"), account.ownerId || userId);
              const txRef = doc(this.firestore, stryMutAct_9fa48("8330") ? "" : (stryCov_9fa48("8330"), 'artifacts'), APP_ID, stryMutAct_9fa48("8331") ? "" : (stryCov_9fa48("8331"), 'users'), targetUserId, stryMutAct_9fa48("8332") ? "" : (stryCov_9fa48("8332"), 'finance'), transactionId);
              const txDoc = await transaction.get(txRef);
              if (stryMutAct_9fa48("8335") ? false : stryMutAct_9fa48("8334") ? true : stryMutAct_9fa48("8333") ? txDoc.exists() : (stryCov_9fa48("8333", "8334", "8335"), !txDoc.exists())) throw new AnchorError(stryMutAct_9fa48("8336") ? "" : (stryCov_9fa48("8336"), 'Transaction does not exist'), stryMutAct_9fa48("8337") ? "" : (stryCov_9fa48("8337"), 'VALIDATION'));
              const currentData = txDoc.data() as AnchorTransaction;
              if (stryMutAct_9fa48("8340") ? updates.amountCents !== undefined || updates.amountCents !== currentData.amountCents : stryMutAct_9fa48("8339") ? false : stryMutAct_9fa48("8338") ? true : (stryCov_9fa48("8338", "8339", "8340"), (stryMutAct_9fa48("8342") ? updates.amountCents === undefined : stryMutAct_9fa48("8341") ? true : (stryCov_9fa48("8341", "8342"), updates.amountCents !== undefined)) && (stryMutAct_9fa48("8344") ? updates.amountCents === currentData.amountCents : stryMutAct_9fa48("8343") ? true : (stryCov_9fa48("8343", "8344"), updates.amountCents !== currentData.amountCents)))) {
                if (stryMutAct_9fa48("8345")) {
                  {}
                } else {
                  stryCov_9fa48("8345");
                  const diff = stryMutAct_9fa48("8346") ? updates.amountCents + currentData.amountCents : (stryCov_9fa48("8346"), updates.amountCents - currentData.amountCents);
                  const correction = (stryMutAct_9fa48("8349") ? currentData.type !== 'income' : stryMutAct_9fa48("8348") ? false : stryMutAct_9fa48("8347") ? true : (stryCov_9fa48("8347", "8348", "8349"), currentData.type === (stryMutAct_9fa48("8350") ? "" : (stryCov_9fa48("8350"), 'income')))) ? diff : stryMutAct_9fa48("8351") ? +diff : (stryCov_9fa48("8351"), -diff);
                  const accRef = doc(this.firestore, stryMutAct_9fa48("8352") ? "" : (stryCov_9fa48("8352"), 'artifacts'), APP_ID, stryMutAct_9fa48("8353") ? "" : (stryCov_9fa48("8353"), 'users'), targetUserId, stryMutAct_9fa48("8354") ? "" : (stryCov_9fa48("8354"), 'accounts'), accountId);
                  transaction.update(accRef, stryMutAct_9fa48("8355") ? {} : (stryCov_9fa48("8355"), {
                    balanceCents: increment(correction)
                  }));
                }
              }
              transaction.update(txRef, stryMutAct_9fa48("8356") ? {} : (stryCov_9fa48("8356"), {
                ...updates,
                lastEditedBy: userId,
                updatedAt: new Date().toISOString()
              }));
              if (stryMutAct_9fa48("8359") ? currentData.linkedTransactionId || currentData.linkedUserId : stryMutAct_9fa48("8358") ? false : stryMutAct_9fa48("8357") ? true : (stryCov_9fa48("8357", "8358", "8359"), currentData.linkedTransactionId && currentData.linkedUserId)) {
                if (stryMutAct_9fa48("8360")) {
                  {}
                } else {
                  stryCov_9fa48("8360");
                  await this.syncLinkedTransaction(transaction, currentData, updates);
                }
              }
            }
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("8361")) {
          {}
        } else {
          stryCov_9fa48("8361");
          if (stryMutAct_9fa48("8363") ? false : stryMutAct_9fa48("8362") ? true : (stryCov_9fa48("8362", "8363"), error instanceof AnchorError)) throw error;
          throw new AnchorError(stryMutAct_9fa48("8364") ? "" : (stryCov_9fa48("8364"), 'Failed to update transaction'), stryMutAct_9fa48("8365") ? "" : (stryCov_9fa48("8365"), 'DATABASE'), error);
        }
      }
    }
  }
  private async syncLinkedTransaction(transaction: Parameters<Parameters<typeof runTransaction>[1]>[0], currentData: AnchorTransaction, updates: UpdateTransactionPayload): Promise<void> {
    if (stryMutAct_9fa48("8366")) {
      {}
    } else {
      stryCov_9fa48("8366");
      const linkedTxRef = doc(this.firestore, stryMutAct_9fa48("8367") ? "" : (stryCov_9fa48("8367"), 'artifacts'), APP_ID, stryMutAct_9fa48("8368") ? "" : (stryCov_9fa48("8368"), 'users'), currentData.linkedUserId!, stryMutAct_9fa48("8369") ? "" : (stryCov_9fa48("8369"), 'finance'), currentData.linkedTransactionId!);
      const linkedDoc = await transaction.get(linkedTxRef);
      if (stryMutAct_9fa48("8371") ? false : stryMutAct_9fa48("8370") ? true : (stryCov_9fa48("8370", "8371"), linkedDoc.exists())) {
        if (stryMutAct_9fa48("8372")) {
          {}
        } else {
          stryCov_9fa48("8372");
          const linkedData = linkedDoc.data() as AnchorTransaction;
          if (stryMutAct_9fa48("8375") ? updates.amountCents !== undefined || updates.amountCents !== linkedData.amountCents : stryMutAct_9fa48("8374") ? false : stryMutAct_9fa48("8373") ? true : (stryCov_9fa48("8373", "8374", "8375"), (stryMutAct_9fa48("8377") ? updates.amountCents === undefined : stryMutAct_9fa48("8376") ? true : (stryCov_9fa48("8376", "8377"), updates.amountCents !== undefined)) && (stryMutAct_9fa48("8379") ? updates.amountCents === linkedData.amountCents : stryMutAct_9fa48("8378") ? true : (stryCov_9fa48("8378", "8379"), updates.amountCents !== linkedData.amountCents)))) {
            if (stryMutAct_9fa48("8380")) {
              {}
            } else {
              stryCov_9fa48("8380");
              const diff = stryMutAct_9fa48("8381") ? updates.amountCents + linkedData.amountCents : (stryCov_9fa48("8381"), updates.amountCents - linkedData.amountCents);
              const correction = (stryMutAct_9fa48("8384") ? linkedData.type !== 'income' : stryMutAct_9fa48("8383") ? false : stryMutAct_9fa48("8382") ? true : (stryCov_9fa48("8382", "8383", "8384"), linkedData.type === (stryMutAct_9fa48("8385") ? "" : (stryCov_9fa48("8385"), 'income')))) ? diff : stryMutAct_9fa48("8386") ? +diff : (stryCov_9fa48("8386"), -diff);
              const linkedAccRef = doc(this.firestore, stryMutAct_9fa48("8387") ? "" : (stryCov_9fa48("8387"), 'artifacts'), APP_ID, stryMutAct_9fa48("8388") ? "" : (stryCov_9fa48("8388"), 'users'), currentData.linkedUserId!, stryMutAct_9fa48("8389") ? "" : (stryCov_9fa48("8389"), 'accounts'), linkedData.accountId);
              transaction.update(linkedAccRef, stryMutAct_9fa48("8390") ? {} : (stryCov_9fa48("8390"), {
                balanceCents: increment(correction)
              }));
            }
          }
          transaction.update(linkedTxRef, stryMutAct_9fa48("8391") ? {} : (stryCov_9fa48("8391"), {
            ...updates
          }));
        }
      }
    }
  }
}
export const transactionService = new TransactionService();