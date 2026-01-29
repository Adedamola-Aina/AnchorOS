/**
 * useFinanceOperations Hook
 * 
 * Handles all finance CRUD operations (accounts and transactions)
 * with activity logging for shared accounts.
 * 
 * @module hooks/useFinanceOperations
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
import { db, APP_ID } from '../config/firebase';
import { doc, collection, writeBatch, increment } from 'firebase/firestore';
import type { AnchorTransaction, AnchorAccount, TransactionType } from '../types';
import { financeService } from '../services/FinanceService';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from '../services/FinanceService';
import { handleError } from '../utils/error';
import { withTimeout } from '../utils/secureDb';
import { canDeleteTransaction } from '../features/finance/utils/permissions';
import { logTransactionAdded, logTransactionDeleted, logTransactionEdited } from './financeActivityLogging';
const OPERATION_TIMEOUT = 10000;
export const useFinanceOperations = (user: User | null, userName: string, accounts: AnchorAccount[], transactions: AnchorTransaction[]) => {
  if (stryMutAct_9fa48("7481")) {
    {}
  } else {
    stryCov_9fa48("7481");
    // Account operations
    const addAccount = async (acc: CreateAccountPayload) => {
      if (stryMutAct_9fa48("7482")) {
        {}
      } else {
        stryCov_9fa48("7482");
        if (stryMutAct_9fa48("7485") ? false : stryMutAct_9fa48("7484") ? true : stryMutAct_9fa48("7483") ? user : (stryCov_9fa48("7483", "7484", "7485"), !user)) return;
        try {
          if (stryMutAct_9fa48("7486")) {
            {}
          } else {
            stryCov_9fa48("7486");
            await withTimeout(financeService.addAccount(user.uid, acc), OPERATION_TIMEOUT, stryMutAct_9fa48("7487") ? "" : (stryCov_9fa48("7487"), 'addAccount'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("7488")) {
            {}
          } else {
            stryCov_9fa48("7488");
            throw handleError(err);
          }
        }
      }
    };
    const deleteAccount = async (id: string) => {
      if (stryMutAct_9fa48("7489")) {
        {}
      } else {
        stryCov_9fa48("7489");
        if (stryMutAct_9fa48("7492") ? false : stryMutAct_9fa48("7491") ? true : stryMutAct_9fa48("7490") ? user : (stryCov_9fa48("7490", "7491", "7492"), !user)) return;
        const account = accounts.find(stryMutAct_9fa48("7493") ? () => undefined : (stryCov_9fa48("7493"), a => stryMutAct_9fa48("7496") ? a.id !== id : stryMutAct_9fa48("7495") ? false : stryMutAct_9fa48("7494") ? true : (stryCov_9fa48("7494", "7495", "7496"), a.id === id)));
        if (stryMutAct_9fa48("7499") ? false : stryMutAct_9fa48("7498") ? true : stryMutAct_9fa48("7497") ? account : (stryCov_9fa48("7497", "7498", "7499"), !account)) return;
        if (stryMutAct_9fa48("7502") ? account.ownerId || account.ownerId !== user.uid : stryMutAct_9fa48("7501") ? false : stryMutAct_9fa48("7500") ? true : (stryCov_9fa48("7500", "7501", "7502"), account.ownerId && (stryMutAct_9fa48("7504") ? account.ownerId === user.uid : stryMutAct_9fa48("7503") ? true : (stryCov_9fa48("7503", "7504"), account.ownerId !== user.uid)))) {
          if (stryMutAct_9fa48("7505")) {
            {}
          } else {
            stryCov_9fa48("7505");
            throw new Error(stryMutAct_9fa48("7506") ? "" : (stryCov_9fa48("7506"), 'Only the account owner can delete this account'));
          }
        }
        try {
          if (stryMutAct_9fa48("7507")) {
            {}
          } else {
            stryCov_9fa48("7507");
            await withTimeout(financeService.deleteAccount(user.uid, userName, account), OPERATION_TIMEOUT, stryMutAct_9fa48("7508") ? "" : (stryCov_9fa48("7508"), 'deleteAccount'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("7509")) {
            {}
          } else {
            stryCov_9fa48("7509");
            throw handleError(err);
          }
        }
      }
    };
    const renameAccount = async (id: string, newName: string) => {
      if (stryMutAct_9fa48("7510")) {
        {}
      } else {
        stryCov_9fa48("7510");
        if (stryMutAct_9fa48("7513") ? false : stryMutAct_9fa48("7512") ? true : stryMutAct_9fa48("7511") ? user : (stryCov_9fa48("7511", "7512", "7513"), !user)) return;
        const account = accounts.find(stryMutAct_9fa48("7514") ? () => undefined : (stryCov_9fa48("7514"), a => stryMutAct_9fa48("7517") ? a.id !== id : stryMutAct_9fa48("7516") ? false : stryMutAct_9fa48("7515") ? true : (stryCov_9fa48("7515", "7516", "7517"), a.id === id)));
        if (stryMutAct_9fa48("7520") ? false : stryMutAct_9fa48("7519") ? true : stryMutAct_9fa48("7518") ? account : (stryCov_9fa48("7518", "7519", "7520"), !account)) return;
        if (stryMutAct_9fa48("7523") ? account.ownerId || account.ownerId !== user.uid : stryMutAct_9fa48("7522") ? false : stryMutAct_9fa48("7521") ? true : (stryCov_9fa48("7521", "7522", "7523"), account.ownerId && (stryMutAct_9fa48("7525") ? account.ownerId === user.uid : stryMutAct_9fa48("7524") ? true : (stryCov_9fa48("7524", "7525"), account.ownerId !== user.uid)))) {
          if (stryMutAct_9fa48("7526")) {
            {}
          } else {
            stryCov_9fa48("7526");
            throw new Error(stryMutAct_9fa48("7527") ? "" : (stryCov_9fa48("7527"), 'Only the account owner can rename this account'));
          }
        }
        try {
          if (stryMutAct_9fa48("7528")) {
            {}
          } else {
            stryCov_9fa48("7528");
            await withTimeout(financeService.renameAccount(user.uid, userName, account, newName), OPERATION_TIMEOUT, stryMutAct_9fa48("7529") ? "" : (stryCov_9fa48("7529"), 'renameAccount'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("7530")) {
            {}
          } else {
            stryCov_9fa48("7530");
            throw handleError(err);
          }
        }
      }
    };

    // Transaction operations
    const addTransaction = async (tx: CreateTransactionPayload) => {
      if (stryMutAct_9fa48("7531")) {
        {}
      } else {
        stryCov_9fa48("7531");
        if (stryMutAct_9fa48("7534") ? false : stryMutAct_9fa48("7533") ? true : stryMutAct_9fa48("7532") ? user : (stryCov_9fa48("7532", "7533", "7534"), !user)) return;
        try {
          if (stryMutAct_9fa48("7535")) {
            {}
          } else {
            stryCov_9fa48("7535");
            await withTimeout(financeService.addTransaction(user.uid, tx, accounts), OPERATION_TIMEOUT, stryMutAct_9fa48("7536") ? "" : (stryCov_9fa48("7536"), 'addTransaction'));
            const account = accounts.find(stryMutAct_9fa48("7537") ? () => undefined : (stryCov_9fa48("7537"), a => stryMutAct_9fa48("7540") ? a.id !== tx.accountId : stryMutAct_9fa48("7539") ? false : stryMutAct_9fa48("7538") ? true : (stryCov_9fa48("7538", "7539", "7540"), a.id === tx.accountId)));
            if (stryMutAct_9fa48("7542") ? false : stryMutAct_9fa48("7541") ? true : (stryCov_9fa48("7541", "7542"), account)) {
              if (stryMutAct_9fa48("7543")) {
                {}
              } else {
                stryCov_9fa48("7543");
                logTransactionAdded(user, userName, account, tx);
              }
            }
          }
        } catch (err) {
          if (stryMutAct_9fa48("7544")) {
            {}
          } else {
            stryCov_9fa48("7544");
            throw handleError(err);
          }
        }
      }
    };
    const deleteTransaction = async (id: string, accountId: string) => {
      if (stryMutAct_9fa48("7545")) {
        {}
      } else {
        stryCov_9fa48("7545");
        if (stryMutAct_9fa48("7548") ? false : stryMutAct_9fa48("7547") ? true : stryMutAct_9fa48("7546") ? user : (stryCov_9fa48("7546", "7547", "7548"), !user)) return;
        const account = accounts.find(stryMutAct_9fa48("7549") ? () => undefined : (stryCov_9fa48("7549"), a => stryMutAct_9fa48("7552") ? a.id !== accountId : stryMutAct_9fa48("7551") ? false : stryMutAct_9fa48("7550") ? true : (stryCov_9fa48("7550", "7551", "7552"), a.id === accountId)));
        if (stryMutAct_9fa48("7555") ? false : stryMutAct_9fa48("7554") ? true : stryMutAct_9fa48("7553") ? account : (stryCov_9fa48("7553", "7554", "7555"), !account)) return;
        if (stryMutAct_9fa48("7558") ? false : stryMutAct_9fa48("7557") ? true : stryMutAct_9fa48("7556") ? canDeleteTransaction(account, user.uid) : (stryCov_9fa48("7556", "7557", "7558"), !canDeleteTransaction(account, user.uid))) {
          if (stryMutAct_9fa48("7559")) {
            {}
          } else {
            stryCov_9fa48("7559");
            throw new Error(stryMutAct_9fa48("7560") ? "" : (stryCov_9fa48("7560"), 'You do not have permission to delete transactions from this account'));
          }
        }
        const txToDelete = transactions.find(stryMutAct_9fa48("7561") ? () => undefined : (stryCov_9fa48("7561"), t => stryMutAct_9fa48("7564") ? t.id !== id : stryMutAct_9fa48("7563") ? false : stryMutAct_9fa48("7562") ? true : (stryCov_9fa48("7562", "7563", "7564"), t.id === id)));
        try {
          if (stryMutAct_9fa48("7565")) {
            {}
          } else {
            stryCov_9fa48("7565");
            await withTimeout(financeService.deleteTransaction(user.uid, id, accountId, accounts, transactions), OPERATION_TIMEOUT, stryMutAct_9fa48("7566") ? "" : (stryCov_9fa48("7566"), 'deleteTransaction'));
            logTransactionDeleted(user, userName, account, id, txToDelete);
          }
        } catch (err) {
          if (stryMutAct_9fa48("7567")) {
            {}
          } else {
            stryCov_9fa48("7567");
            throw handleError(err);
          }
        }
      }
    };
    const updateTransaction = async (id: string, accountId: string, updates: UpdateTransactionPayload) => {
      if (stryMutAct_9fa48("7568")) {
        {}
      } else {
        stryCov_9fa48("7568");
        if (stryMutAct_9fa48("7571") ? false : stryMutAct_9fa48("7570") ? true : stryMutAct_9fa48("7569") ? user : (stryCov_9fa48("7569", "7570", "7571"), !user)) return;
        const originalTx = transactions.find(stryMutAct_9fa48("7572") ? () => undefined : (stryCov_9fa48("7572"), t => stryMutAct_9fa48("7575") ? t.id !== id : stryMutAct_9fa48("7574") ? false : stryMutAct_9fa48("7573") ? true : (stryCov_9fa48("7573", "7574", "7575"), t.id === id)));
        const account = accounts.find(stryMutAct_9fa48("7576") ? () => undefined : (stryCov_9fa48("7576"), a => stryMutAct_9fa48("7579") ? a.id !== accountId : stryMutAct_9fa48("7578") ? false : stryMutAct_9fa48("7577") ? true : (stryCov_9fa48("7577", "7578", "7579"), a.id === accountId)));
        try {
          if (stryMutAct_9fa48("7580")) {
            {}
          } else {
            stryCov_9fa48("7580");
            await withTimeout(financeService.updateTransaction(user.uid, id, accountId, updates, accounts), OPERATION_TIMEOUT, stryMutAct_9fa48("7581") ? "" : (stryCov_9fa48("7581"), 'updateTransaction'));
            if (stryMutAct_9fa48("7583") ? false : stryMutAct_9fa48("7582") ? true : (stryCov_9fa48("7582", "7583"), account)) {
              if (stryMutAct_9fa48("7584")) {
                {}
              } else {
                stryCov_9fa48("7584");
                logTransactionEdited(user, userName, account, id, updates, originalTx);
              }
            }
          }
        } catch (err) {
          if (stryMutAct_9fa48("7585")) {
            {}
          } else {
            stryCov_9fa48("7585");
            throw handleError(err);
          }
        }
      }
    };
    const restoreTransaction = async (id: string, accountId: string, amountCents: number, type: TransactionType) => {
      if (stryMutAct_9fa48("7586")) {
        {}
      } else {
        stryCov_9fa48("7586");
        if (stryMutAct_9fa48("7589") ? false : stryMutAct_9fa48("7588") ? true : stryMutAct_9fa48("7587") ? user : (stryCov_9fa48("7587", "7588", "7589"), !user)) return;
        try {
          if (stryMutAct_9fa48("7590")) {
            {}
          } else {
            stryCov_9fa48("7590");
            const account = accounts.find(stryMutAct_9fa48("7591") ? () => undefined : (stryCov_9fa48("7591"), a => stryMutAct_9fa48("7594") ? a.id !== accountId : stryMutAct_9fa48("7593") ? false : stryMutAct_9fa48("7592") ? true : (stryCov_9fa48("7592", "7593", "7594"), a.id === accountId)));
            if (stryMutAct_9fa48("7597") ? false : stryMutAct_9fa48("7596") ? true : stryMutAct_9fa48("7595") ? account : (stryCov_9fa48("7595", "7596", "7597"), !account)) return;
            const batch = writeBatch(db);
            const targetUserId = stryMutAct_9fa48("7600") ? account.ownerId && user.uid : stryMutAct_9fa48("7599") ? false : stryMutAct_9fa48("7598") ? true : (stryCov_9fa48("7598", "7599", "7600"), account.ownerId || user.uid);
            const txRef = doc(db, stryMutAct_9fa48("7601") ? "" : (stryCov_9fa48("7601"), 'artifacts'), APP_ID, stryMutAct_9fa48("7602") ? "" : (stryCov_9fa48("7602"), 'users'), targetUserId, stryMutAct_9fa48("7603") ? "" : (stryCov_9fa48("7603"), 'finance'), id);
            batch.update(txRef, stryMutAct_9fa48("7604") ? {} : (stryCov_9fa48("7604"), {
              isSoftDeleted: stryMutAct_9fa48("7605") ? true : (stryCov_9fa48("7605"), false),
              deletedBy: null,
              deletedAt: null
            }));
            const accRef = doc(db, stryMutAct_9fa48("7606") ? "" : (stryCov_9fa48("7606"), 'artifacts'), APP_ID, stryMutAct_9fa48("7607") ? "" : (stryCov_9fa48("7607"), 'users'), targetUserId, stryMutAct_9fa48("7608") ? "" : (stryCov_9fa48("7608"), 'accounts'), accountId);
            batch.update(accRef, stryMutAct_9fa48("7609") ? {} : (stryCov_9fa48("7609"), {
              balanceCents: increment((stryMutAct_9fa48("7612") ? type !== 'income' : stryMutAct_9fa48("7611") ? false : stryMutAct_9fa48("7610") ? true : (stryCov_9fa48("7610", "7611", "7612"), type === (stryMutAct_9fa48("7613") ? "" : (stryCov_9fa48("7613"), 'income')))) ? amountCents : stryMutAct_9fa48("7614") ? +amountCents : (stryCov_9fa48("7614"), -amountCents))
            }));
            await batch.commit();
          }
        } catch (err) {
          if (stryMutAct_9fa48("7615")) {
            {}
          } else {
            stryCov_9fa48("7615");
            throw handleError(err);
          }
        }
      }
    };
    const convertCurrency = async (fromAccountId: string, toAccountId: string, amountCents: number, rate: number) => {
      if (stryMutAct_9fa48("7616")) {
        {}
      } else {
        stryCov_9fa48("7616");
        if (stryMutAct_9fa48("7619") ? false : stryMutAct_9fa48("7618") ? true : stryMutAct_9fa48("7617") ? user : (stryCov_9fa48("7617", "7618", "7619"), !user)) return;
        try {
          if (stryMutAct_9fa48("7620")) {
            {}
          } else {
            stryCov_9fa48("7620");
            const fromAcc = accounts.find(stryMutAct_9fa48("7621") ? () => undefined : (stryCov_9fa48("7621"), a => stryMutAct_9fa48("7624") ? a.id !== fromAccountId : stryMutAct_9fa48("7623") ? false : stryMutAct_9fa48("7622") ? true : (stryCov_9fa48("7622", "7623", "7624"), a.id === fromAccountId)));
            const toAcc = accounts.find(stryMutAct_9fa48("7625") ? () => undefined : (stryCov_9fa48("7625"), a => stryMutAct_9fa48("7628") ? a.id !== toAccountId : stryMutAct_9fa48("7627") ? false : stryMutAct_9fa48("7626") ? true : (stryCov_9fa48("7626", "7627", "7628"), a.id === toAccountId)));
            if (stryMutAct_9fa48("7631") ? !fromAcc && !toAcc : stryMutAct_9fa48("7630") ? false : stryMutAct_9fa48("7629") ? true : (stryCov_9fa48("7629", "7630", "7631"), (stryMutAct_9fa48("7632") ? fromAcc : (stryCov_9fa48("7632"), !fromAcc)) || (stryMutAct_9fa48("7633") ? toAcc : (stryCov_9fa48("7633"), !toAcc)))) return;
            const batch = writeBatch(db);
            const linkId = crypto.randomUUID();
            const now = new Date().toISOString();
            const fromOwnerId = stryMutAct_9fa48("7636") ? fromAcc.ownerId && user.uid : stryMutAct_9fa48("7635") ? false : stryMutAct_9fa48("7634") ? true : (stryCov_9fa48("7634", "7635", "7636"), fromAcc.ownerId || user.uid);
            const outRef = doc(collection(db, stryMutAct_9fa48("7637") ? "" : (stryCov_9fa48("7637"), 'artifacts'), APP_ID, stryMutAct_9fa48("7638") ? "" : (stryCov_9fa48("7638"), 'users'), fromOwnerId, stryMutAct_9fa48("7639") ? "" : (stryCov_9fa48("7639"), 'finance')));
            batch.set(outRef, stryMutAct_9fa48("7640") ? {} : (stryCov_9fa48("7640"), {
              title: stryMutAct_9fa48("7641") ? `` : (stryCov_9fa48("7641"), `Conversion to ${toAcc.currency}`),
              amountCents,
              type: stryMutAct_9fa48("7642") ? "" : (stryCov_9fa48("7642"), 'expense'),
              category: stryMutAct_9fa48("7643") ? "" : (stryCov_9fa48("7643"), 'Conversion'),
              accountId: fromAccountId,
              accountName: fromAcc.name,
              currency: fromAcc.currency,
              scope: stryMutAct_9fa48("7644") ? "" : (stryCov_9fa48("7644"), 'family'),
              date: now,
              createdBy: user.uid,
              linkId,
              conversionRate: rate
            }));
            batch.update(doc(db, stryMutAct_9fa48("7645") ? "" : (stryCov_9fa48("7645"), 'artifacts'), APP_ID, stryMutAct_9fa48("7646") ? "" : (stryCov_9fa48("7646"), 'users'), fromOwnerId, stryMutAct_9fa48("7647") ? "" : (stryCov_9fa48("7647"), 'accounts'), fromAccountId), stryMutAct_9fa48("7648") ? {} : (stryCov_9fa48("7648"), {
              balanceCents: increment(stryMutAct_9fa48("7649") ? +amountCents : (stryCov_9fa48("7649"), -amountCents))
            }));
            const toOwnerId = stryMutAct_9fa48("7652") ? toAcc.ownerId && user.uid : stryMutAct_9fa48("7651") ? false : stryMutAct_9fa48("7650") ? true : (stryCov_9fa48("7650", "7651", "7652"), toAcc.ownerId || user.uid);
            const convertedAmountCents = Math.round(stryMutAct_9fa48("7653") ? amountCents / rate : (stryCov_9fa48("7653"), amountCents * rate));
            const inRef = doc(collection(db, stryMutAct_9fa48("7654") ? "" : (stryCov_9fa48("7654"), 'artifacts'), APP_ID, stryMutAct_9fa48("7655") ? "" : (stryCov_9fa48("7655"), 'users'), toOwnerId, stryMutAct_9fa48("7656") ? "" : (stryCov_9fa48("7656"), 'finance')));
            batch.set(inRef, stryMutAct_9fa48("7657") ? {} : (stryCov_9fa48("7657"), {
              title: stryMutAct_9fa48("7658") ? `` : (stryCov_9fa48("7658"), `Conversion from ${fromAcc.currency}`),
              amountCents: convertedAmountCents,
              type: stryMutAct_9fa48("7659") ? "" : (stryCov_9fa48("7659"), 'income'),
              category: stryMutAct_9fa48("7660") ? "" : (stryCov_9fa48("7660"), 'Conversion'),
              accountId: toAccountId,
              accountName: toAcc.name,
              currency: toAcc.currency,
              scope: stryMutAct_9fa48("7661") ? "" : (stryCov_9fa48("7661"), 'family'),
              date: now,
              createdBy: user.uid,
              linkId,
              conversionRate: rate
            }));
            batch.update(doc(db, stryMutAct_9fa48("7662") ? "" : (stryCov_9fa48("7662"), 'artifacts'), APP_ID, stryMutAct_9fa48("7663") ? "" : (stryCov_9fa48("7663"), 'users'), toOwnerId, stryMutAct_9fa48("7664") ? "" : (stryCov_9fa48("7664"), 'accounts'), toAccountId), stryMutAct_9fa48("7665") ? {} : (stryCov_9fa48("7665"), {
              balanceCents: increment(convertedAmountCents)
            }));
            await batch.commit();
          }
        } catch (err) {
          if (stryMutAct_9fa48("7666")) {
            {}
          } else {
            stryCov_9fa48("7666");
            throw handleError(err);
          }
        }
      }
    };
    return stryMutAct_9fa48("7667") ? {} : (stryCov_9fa48("7667"), {
      addAccount,
      deleteAccount,
      renameAccount,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      restoreTransaction,
      convertCurrency
    });
  }
};