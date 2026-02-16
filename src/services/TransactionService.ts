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
import { doc, increment, writeBatch, runTransaction, type Firestore } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import { checkRateLimit, formatRetryTime, RATE_LIMIT_CONFIGS } from '../utils/rateLimit';
import { auditFinance } from './AuditService';
import type { AnchorTransaction, AnchorAccount } from '../types';
import { canAddTransaction, canDeleteTransaction } from '../features/finance/utils/permissions';
import { processTransferTransaction, processStandardTransaction } from './TransferOperations';
import { updateTransaction as updateTransactionOp } from './TransactionUpdateOps';
import type { CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

// Re-export types for backward compatibility
export type { CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

/**
 * TransactionService providing transaction management operations
 */
export class TransactionService {
  private firestore: Firestore;
  constructor(firestore: Firestore = db) {
    if (stryMutAct_9fa48("450")) {
      {}
    } else {
      stryCov_9fa48("450");
      this.firestore = firestore;
    }
  }

  /** Add a new transaction (handles transfers and standard transactions) */
  async addTransaction(userId: string, payload: CreateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
    if (stryMutAct_9fa48("451")) {
      {}
    } else {
      stryCov_9fa48("451");
      // Rate limit: 100 transactions per hour
      const rateCheck = checkRateLimit(stryMutAct_9fa48("452") ? `` : (stryCov_9fa48("452"), `transactionCreate:${userId}`), RATE_LIMIT_CONFIGS.transactionCreate);
      if (stryMutAct_9fa48("454") ? false : stryMutAct_9fa48("453") ? true : (stryCov_9fa48("453", "454"), rateCheck.isLimited)) {
        if (stryMutAct_9fa48("455")) {
          {}
        } else {
          stryCov_9fa48("455");
          throw new AnchorError(stryMutAct_9fa48("456") ? `` : (stryCov_9fa48("456"), `Too many transactions created. Please try again in ${formatRetryTime(stryMutAct_9fa48("459") ? rateCheck.retryAfterMs && 0 : stryMutAct_9fa48("458") ? false : stryMutAct_9fa48("457") ? true : (stryCov_9fa48("457", "458", "459"), rateCheck.retryAfterMs || 0))}.`), stryMutAct_9fa48("460") ? "" : (stryCov_9fa48("460"), 'RATE_LIMIT'));
        }
      }
      const sourceAccount = accounts.find(stryMutAct_9fa48("461") ? () => undefined : (stryCov_9fa48("461"), a => stryMutAct_9fa48("464") ? a.id !== payload.accountId : stryMutAct_9fa48("463") ? false : stryMutAct_9fa48("462") ? true : (stryCov_9fa48("462", "463", "464"), a.id === payload.accountId)));
      if (stryMutAct_9fa48("467") ? false : stryMutAct_9fa48("466") ? true : stryMutAct_9fa48("465") ? sourceAccount : (stryCov_9fa48("465", "466", "467"), !sourceAccount)) throw new AnchorError(stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), 'Source account not found'), stryMutAct_9fa48("469") ? "" : (stryCov_9fa48("469"), 'VALIDATION'));
      if (stryMutAct_9fa48("472") ? false : stryMutAct_9fa48("471") ? true : stryMutAct_9fa48("470") ? canAddTransaction(sourceAccount, userId) : (stryCov_9fa48("470", "471", "472"), !canAddTransaction(sourceAccount, userId))) {
        if (stryMutAct_9fa48("473")) {
          {}
        } else {
          stryCov_9fa48("473");
          throw new AnchorError(stryMutAct_9fa48("474") ? `` : (stryCov_9fa48("474"), `Permission denied: You cannot add transactions to ${sourceAccount.name}.`), stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), 'PERMISSION'));
        }
      }
      try {
        if (stryMutAct_9fa48("476")) {
          {}
        } else {
          stryCov_9fa48("476");
          const batch = writeBatch(this.firestore);
          const now = new Date();
          const createdAt = now.toISOString();
          const transactionDate = stryMutAct_9fa48("479") ? payload.date && createdAt : stryMutAct_9fa48("478") ? false : stryMutAct_9fa48("477") ? true : (stryCov_9fa48("477", "478", "479"), payload.date || createdAt);
          const isBackdated = payload.date ? stryMutAct_9fa48("482") ? new Date(payload.date).toDateString() === now.toDateString() : stryMutAct_9fa48("481") ? false : stryMutAct_9fa48("480") ? true : (stryCov_9fa48("480", "481", "482"), new Date(payload.date).toDateString() !== now.toDateString()) : stryMutAct_9fa48("483") ? true : (stryCov_9fa48("483"), false);
          if (stryMutAct_9fa48("486") ? payload.type !== 'transfer' : stryMutAct_9fa48("485") ? false : stryMutAct_9fa48("484") ? true : (stryCov_9fa48("484", "485", "486"), payload.type === (stryMutAct_9fa48("487") ? "" : (stryCov_9fa48("487"), 'transfer')))) {
            if (stryMutAct_9fa48("488")) {
              {}
            } else {
              stryCov_9fa48("488");
              processTransferTransaction(this.firestore, batch, userId, payload, sourceAccount, accounts, transactionDate, createdAt, isBackdated);
            }
          } else {
            if (stryMutAct_9fa48("489")) {
              {}
            } else {
              stryCov_9fa48("489");
              processStandardTransaction(this.firestore, batch, userId, payload, sourceAccount, transactionDate, createdAt, isBackdated);
            }
          }
          await batch.commit();

          // AUDIT: Log transaction creation
          auditFinance.transactionCreated(stryMutAct_9fa48("490") ? "" : (stryCov_9fa48("490"), 'batch'),
          // Batch operation doesn't return single ID
          payload.accountId, payload.amountCents, payload.type);
        }
      } catch (error) {
        if (stryMutAct_9fa48("491")) {
          {}
        } else {
          stryCov_9fa48("491");
          if (stryMutAct_9fa48("493") ? false : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493"), error instanceof AnchorError)) throw error;
          throw new AnchorError(stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), 'Failed to add transaction'), stryMutAct_9fa48("495") ? "" : (stryCov_9fa48("495"), 'DATABASE'), error);
        }
      }
    }
  }

  /** Delete a transaction (soft delete with balance reversal) */
  async deleteTransaction(userId: string, transactionId: string, accountId: string, accounts: AnchorAccount[], transactions: AnchorTransaction[]): Promise<void> {
    if (stryMutAct_9fa48("496")) {
      {}
    } else {
      stryCov_9fa48("496");
      const account = accounts.find(stryMutAct_9fa48("497") ? () => undefined : (stryCov_9fa48("497"), a => stryMutAct_9fa48("500") ? a.id !== accountId : stryMutAct_9fa48("499") ? false : stryMutAct_9fa48("498") ? true : (stryCov_9fa48("498", "499", "500"), a.id === accountId)));
      if (stryMutAct_9fa48("503") ? false : stryMutAct_9fa48("502") ? true : stryMutAct_9fa48("501") ? account : (stryCov_9fa48("501", "502", "503"), !account)) throw new AnchorError(stryMutAct_9fa48("504") ? "" : (stryCov_9fa48("504"), 'Account not found'), stryMutAct_9fa48("505") ? "" : (stryCov_9fa48("505"), 'VALIDATION'));
      if (stryMutAct_9fa48("508") ? false : stryMutAct_9fa48("507") ? true : stryMutAct_9fa48("506") ? canDeleteTransaction(account, userId) : (stryCov_9fa48("506", "507", "508"), !canDeleteTransaction(account, userId))) {
        if (stryMutAct_9fa48("509")) {
          {}
        } else {
          stryCov_9fa48("509");
          throw new AnchorError(stryMutAct_9fa48("510") ? "" : (stryCov_9fa48("510"), 'Permission denied: You cannot delete transactions from this account.'), stryMutAct_9fa48("511") ? "" : (stryCov_9fa48("511"), 'PERMISSION'));
        }
      }
      const txToDelete = transactions.find(stryMutAct_9fa48("512") ? () => undefined : (stryCov_9fa48("512"), t => stryMutAct_9fa48("515") ? t.id !== transactionId : stryMutAct_9fa48("514") ? false : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514", "515"), t.id === transactionId)));
      if (stryMutAct_9fa48("518") ? false : stryMutAct_9fa48("517") ? true : stryMutAct_9fa48("516") ? txToDelete : (stryCov_9fa48("516", "517", "518"), !txToDelete)) throw new AnchorError(stryMutAct_9fa48("519") ? "" : (stryCov_9fa48("519"), 'Transaction not found'), stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), 'VALIDATION'));
      try {
        if (stryMutAct_9fa48("521")) {
          {}
        } else {
          stryCov_9fa48("521");
          const timestamp = new Date().toISOString();
          const targetUserId = stryMutAct_9fa48("524") ? account.ownerId && userId : stryMutAct_9fa48("523") ? false : stryMutAct_9fa48("522") ? true : (stryCov_9fa48("522", "523", "524"), account.ownerId || userId);

          // BUG-035 Fix: Use runTransaction for linked deletions to prevent race conditions
          if (stryMutAct_9fa48("527") ? txToDelete.linkedTransactionId || txToDelete.linkedUserId : stryMutAct_9fa48("526") ? false : stryMutAct_9fa48("525") ? true : (stryCov_9fa48("525", "526", "527"), txToDelete.linkedTransactionId && txToDelete.linkedUserId)) {
            if (stryMutAct_9fa48("528")) {
              {}
            } else {
              stryCov_9fa48("528");
              await runTransaction(this.firestore, async transaction => {
                if (stryMutAct_9fa48("529")) {
                  {}
                } else {
                  stryCov_9fa48("529");
                  const txRef = doc(this.firestore, stryMutAct_9fa48("530") ? "" : (stryCov_9fa48("530"), 'artifacts'), APP_ID, stryMutAct_9fa48("531") ? "" : (stryCov_9fa48("531"), 'users'), targetUserId, stryMutAct_9fa48("532") ? "" : (stryCov_9fa48("532"), 'finance'), transactionId);
                  transaction.update(txRef, stryMutAct_9fa48("533") ? {} : (stryCov_9fa48("533"), {
                    isSoftDeleted: stryMutAct_9fa48("534") ? false : (stryCov_9fa48("534"), true),
                    deletedBy: userId,
                    deletedAt: timestamp
                  }));
                  const accRef = doc(this.firestore, stryMutAct_9fa48("535") ? "" : (stryCov_9fa48("535"), 'artifacts'), APP_ID, stryMutAct_9fa48("536") ? "" : (stryCov_9fa48("536"), 'users'), targetUserId, stryMutAct_9fa48("537") ? "" : (stryCov_9fa48("537"), 'accounts'), accountId);
                  const balanceAdj = (stryMutAct_9fa48("540") ? txToDelete.type !== 'income' : stryMutAct_9fa48("539") ? false : stryMutAct_9fa48("538") ? true : (stryCov_9fa48("538", "539", "540"), txToDelete.type === (stryMutAct_9fa48("541") ? "" : (stryCov_9fa48("541"), 'income')))) ? stryMutAct_9fa48("542") ? +txToDelete.amountCents : (stryCov_9fa48("542"), -txToDelete.amountCents) : txToDelete.amountCents;
                  transaction.update(accRef, stryMutAct_9fa48("543") ? {} : (stryCov_9fa48("543"), {
                    balanceCents: increment(balanceAdj)
                  }));
                  await this.deleteLinkedTransaction(transaction, txToDelete, userId, timestamp);
                }
              });
            }
          } else {
            if (stryMutAct_9fa48("544")) {
              {}
            } else {
              stryCov_9fa48("544");
              // Simple delete uses writeBatch (still atomic, but faster for single ops)
              const batch = writeBatch(this.firestore);
              const txRef = doc(this.firestore, stryMutAct_9fa48("545") ? "" : (stryCov_9fa48("545"), 'artifacts'), APP_ID, stryMutAct_9fa48("546") ? "" : (stryCov_9fa48("546"), 'users'), targetUserId, stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), 'finance'), transactionId);
              batch.update(txRef, stryMutAct_9fa48("548") ? {} : (stryCov_9fa48("548"), {
                isSoftDeleted: stryMutAct_9fa48("549") ? false : (stryCov_9fa48("549"), true),
                deletedBy: userId,
                deletedAt: timestamp
              }));
              const accRef = doc(this.firestore, stryMutAct_9fa48("550") ? "" : (stryCov_9fa48("550"), 'artifacts'), APP_ID, stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), 'users'), targetUserId, stryMutAct_9fa48("552") ? "" : (stryCov_9fa48("552"), 'accounts'), accountId);
              const balanceAdj = (stryMutAct_9fa48("555") ? txToDelete.type !== 'income' : stryMutAct_9fa48("554") ? false : stryMutAct_9fa48("553") ? true : (stryCov_9fa48("553", "554", "555"), txToDelete.type === (stryMutAct_9fa48("556") ? "" : (stryCov_9fa48("556"), 'income')))) ? stryMutAct_9fa48("557") ? +txToDelete.amountCents : (stryCov_9fa48("557"), -txToDelete.amountCents) : txToDelete.amountCents;
              batch.update(accRef, stryMutAct_9fa48("558") ? {} : (stryCov_9fa48("558"), {
                balanceCents: increment(balanceAdj)
              }));
              await batch.commit();
            }
          }

          // AUDIT: Log transaction deletion
          auditFinance.transactionDeleted(transactionId, accountId);
        }
      } catch (error) {
        if (stryMutAct_9fa48("559")) {
          {}
        } else {
          stryCov_9fa48("559");
          if (stryMutAct_9fa48("561") ? false : stryMutAct_9fa48("560") ? true : (stryCov_9fa48("560", "561"), error instanceof AnchorError)) throw error;
          throw new AnchorError(stryMutAct_9fa48("562") ? "" : (stryCov_9fa48("562"), 'Failed to delete transaction'), stryMutAct_9fa48("563") ? "" : (stryCov_9fa48("563"), 'DATABASE'), error);
        }
      }
    }
  }
  private async deleteLinkedTransaction(transaction: Parameters<Parameters<typeof runTransaction>[1]>[0], txToDelete: AnchorTransaction, userId: string, timestamp: string): Promise<void> {
    if (stryMutAct_9fa48("564")) {
      {}
    } else {
      stryCov_9fa48("564");
      const linkedTxRef = doc(this.firestore, stryMutAct_9fa48("565") ? "" : (stryCov_9fa48("565"), 'artifacts'), APP_ID, stryMutAct_9fa48("566") ? "" : (stryCov_9fa48("566"), 'users'), txToDelete.linkedUserId!, stryMutAct_9fa48("567") ? "" : (stryCov_9fa48("567"), 'finance'), txToDelete.linkedTransactionId!);
      // BUG-035 Fix: Use transaction.get() instead of getDoc() for atomicity
      const linkedTxDoc = await transaction.get(linkedTxRef);
      if (stryMutAct_9fa48("569") ? false : stryMutAct_9fa48("568") ? true : (stryCov_9fa48("568", "569"), linkedTxDoc.exists())) {
        if (stryMutAct_9fa48("570")) {
          {}
        } else {
          stryCov_9fa48("570");
          const pairedTx = linkedTxDoc.data() as AnchorTransaction;
          transaction.update(linkedTxRef, stryMutAct_9fa48("571") ? {} : (stryCov_9fa48("571"), {
            isSoftDeleted: stryMutAct_9fa48("572") ? false : (stryCov_9fa48("572"), true),
            deletedBy: userId,
            deletedAt: timestamp
          }));
          const linkedAccRef = doc(this.firestore, stryMutAct_9fa48("573") ? "" : (stryCov_9fa48("573"), 'artifacts'), APP_ID, stryMutAct_9fa48("574") ? "" : (stryCov_9fa48("574"), 'users'), txToDelete.linkedUserId!, stryMutAct_9fa48("575") ? "" : (stryCov_9fa48("575"), 'accounts'), pairedTx.accountId);
          transaction.update(linkedAccRef, stryMutAct_9fa48("576") ? {} : (stryCov_9fa48("576"), {
            balanceCents: increment((stryMutAct_9fa48("579") ? pairedTx.type !== 'income' : stryMutAct_9fa48("578") ? false : stryMutAct_9fa48("577") ? true : (stryCov_9fa48("577", "578", "579"), pairedTx.type === (stryMutAct_9fa48("580") ? "" : (stryCov_9fa48("580"), 'income')))) ? stryMutAct_9fa48("581") ? +pairedTx.amountCents : (stryCov_9fa48("581"), -pairedTx.amountCents) : pairedTx.amountCents)
          }));
        }
      }
    }
  }

  /** Update a transaction with optimistic locking */
  async updateTransaction(userId: string, transactionId: string, accountId: string, updates: UpdateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
    if (stryMutAct_9fa48("582")) {
      {}
    } else {
      stryCov_9fa48("582");
      return updateTransactionOp(this.firestore, userId, transactionId, accountId, updates, accounts);
    }
  }
}
export const transactionService = new TransactionService();