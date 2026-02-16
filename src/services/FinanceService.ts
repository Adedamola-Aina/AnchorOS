/**
 * FinanceService
 * 
 * Unified facade for all finance-related operations.
 * Re-exports from AccountService and TransactionService for backward compatibility.
 * 
 * @module services/FinanceService
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
import type { Firestore } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AccountService } from './AccountService';
import { TransactionService } from './TransactionService';
import type { AnchorAccount, AnchorTransaction } from '../types';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

// Re-export types for backward compatibility
export type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from './financeTypes';

/**
 * FinanceService - Unified facade combining account and transaction operations
 */
export class FinanceService {
  private accountService: AccountService;
  private transactionService: TransactionService;
  constructor(firestore: Firestore = db) {
    if (stryMutAct_9fa48("443")) {
      {}
    } else {
      stryCov_9fa48("443");
      this.accountService = new AccountService(firestore);
      this.transactionService = new TransactionService(firestore);
    }
  }

  // Account Operations
  async addAccount(userId: string, payload: CreateAccountPayload): Promise<string> {
    if (stryMutAct_9fa48("444")) {
      {}
    } else {
      stryCov_9fa48("444");
      return this.accountService.addAccount(userId, payload);
    }
  }
  async deleteAccount(userId: string, userName: string, account: AnchorAccount): Promise<void> {
    if (stryMutAct_9fa48("445")) {
      {}
    } else {
      stryCov_9fa48("445");
      return this.accountService.deleteAccount(userId, userName, account);
    }
  }
  async renameAccount(userId: string, userName: string, account: AnchorAccount, newName: string): Promise<void> {
    if (stryMutAct_9fa48("446")) {
      {}
    } else {
      stryCov_9fa48("446");
      return this.accountService.renameAccount(userId, userName, account, newName);
    }
  }

  // Transaction Operations
  async addTransaction(userId: string, payload: CreateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
    if (stryMutAct_9fa48("447")) {
      {}
    } else {
      stryCov_9fa48("447");
      return this.transactionService.addTransaction(userId, payload, accounts);
    }
  }
  async deleteTransaction(userId: string, transactionId: string, accountId: string, accounts: AnchorAccount[], transactions: AnchorTransaction[]): Promise<void> {
    if (stryMutAct_9fa48("448")) {
      {}
    } else {
      stryCov_9fa48("448");
      return this.transactionService.deleteTransaction(userId, transactionId, accountId, accounts, transactions);
    }
  }
  async updateTransaction(userId: string, transactionId: string, accountId: string, updates: UpdateTransactionPayload, accounts: AnchorAccount[]): Promise<void> {
    if (stryMutAct_9fa48("449")) {
      {}
    } else {
      stryCov_9fa48("449");
      return this.transactionService.updateTransaction(userId, transactionId, accountId, updates, accounts);
    }
  }
}
export const financeService = new FinanceService();