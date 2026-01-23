/**
 * Finance Service Hook
 * 
 * Combines own data with shared account data from family connections
 */

import { useState, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { db, APP_ID } from '../config/firebase';
import type { AnchorTransaction, TransactionType } from '../types';
import { calculateNetWorth } from '../utils/finance';
import { getCashFlowAnalysis } from '../utils/financeInsights';
import { financeService } from '../services/FinanceService';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from '../services/FinanceService';
import { handleError } from '../utils/error';
import { doc, collection, writeBatch, increment } from 'firebase/firestore';
import {
  useTransactionsQuery,
  useAccountsQuery,
  useRecentTransactionsQuery,
} from './queries/useFinanceQueries';
import { useSharedAccounts } from './useSharedAccounts';
import { useFamilySharing } from './useFamilySharing';
import { canDeleteTransaction } from '../features/finance/utils/permissions';

export interface ExtendedTransaction extends AnchorTransaction {
  createdBy?: string;
  lastEditedBy?: string;
  isSoftDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
  linkId?: string;
  accountOwnerId?: string;
}

export const useFinanceService = (
  user: User | null,
  _familyMemberId?: string | null, // Deprecated parameter, kept for compatibility
  userName: string = 'User'
) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const start = useMemo(() =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString(),
    [currentMonth]
  );
  const end = useMemo(() =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
    [currentMonth]
  );

  // Get family connection status
  const { isOwner, connection } = useFamilySharing(user?.uid);
  const hasConnection = !!connection;

  // Own data
  const { data: ownTransactions = [], isLoading: loadingOwnTx } = useTransactionsQuery(user?.uid, start, end);
  const { data: ownAccounts = [], isLoading: loadingOwnAcc } = useAccountsQuery(user?.uid);
  const { data: recentOwn = [] } = useRecentTransactionsQuery(user?.uid, 20);

  // Shared accounts (only for non-owners with active connection)
  const shouldLoadShared = hasConnection && !isOwner;
  const {
    sharedAccounts,
    sharedTransactions: allSharedTransactions,
    loading: loadingShared
  } = useSharedAccounts(user?.uid, shouldLoadShared);

  // Filter shared transactions by current month
  const sharedTransactions = useMemo(() => {
    if (!shouldLoadShared || !Array.isArray(allSharedTransactions)) return [];

    return allSharedTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      const startDate = new Date(start);
      const endDate = new Date(end);
      return txDate >= startDate && txDate <= endDate;
    });
  }, [allSharedTransactions, start, end, shouldLoadShared]);

  // Combine own and shared data
  const transactions = useMemo(() => {
    const all = [...ownTransactions, ...sharedTransactions].filter(t => !t.isSoftDeleted);

    // Deduplicate by ID
    const seen = new Set<string>();
    const unique: AnchorTransaction[] = [];
    for (const tx of all) {
      if (!seen.has(tx.id)) {
        seen.add(tx.id);
        unique.push(tx);
      }
    }

    return unique.sort((a, b) => {
      const dateA = typeof a.date === 'string' ? a.date : a.date.toISOString();
      const dateB = typeof b.date === 'string' ? b.date : b.date.toISOString();
      return dateB > dateA ? 1 : -1;
    });
  }, [ownTransactions, sharedTransactions]);

  const accounts = useMemo(() => {
    const all = [...ownAccounts, ...sharedAccounts];

    // Deduplicate by ID
    const seen = new Set<string>();
    const unique = [];
    for (const acc of all) {
      if (!seen.has(acc.id)) {
        seen.add(acc.id);
        unique.push(acc);
      }
    }
    return unique;
  }, [ownAccounts, sharedAccounts]);

  const loadingFinance = loadingOwnTx || loadingOwnAcc || (shouldLoadShared && loadingShared);

  const recentActivity = useMemo(() => {
    // Defensive checks for array existence
    const sharedTx = Array.isArray(allSharedTransactions) ? allSharedTransactions : [];
    const ownTx = Array.isArray(recentOwn) ? recentOwn : [];

    const recentShared = sharedTx.slice(0, 20);
    const combined = [...ownTx, ...recentShared]
      .filter(t => t && !t.isSoftDeleted)
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
        const dateB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
        return dateB - dateA;
      });

    const seen = new Set();
    const unique = [];
    for (const tx of combined) {
      if (!seen.has(tx.id)) {
        seen.add(tx.id);
        unique.push(tx);
      }
    }

    return unique.slice(0, 5);
  }, [recentOwn, allSharedTransactions]);

  const netWorth = useMemo(() => {
    const activeAccounts = accounts.filter(a => !a.isArchived);
    return calculateNetWorth(activeAccounts);
  }, [accounts]);

  const cashFlow = useMemo(() => {
    return getCashFlowAnalysis(transactions);
  }, [transactions]);

  // Navigation helpers
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const jumpToMonth = (date: Date) => {
    setCurrentMonth(date);
  };

  // Account operations
  const addAccount = async (acc: CreateAccountPayload) => {
    if (!user) return;
    try {
      await financeService.addAccount(user.uid, acc);
    } catch (err) {
      throw handleError(err);
    }
  };

  const deleteAccount = async (id: string) => {
    if (!user) return;
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    // Only owner can delete
    if (account.ownerId && account.ownerId !== user.uid) {
      throw new Error('Only the account owner can delete this account');
    }

    try {
      await financeService.deleteAccount(user.uid, userName, account);
    } catch (err) {
      throw handleError(err);
    }
  };

  const renameAccount = async (id: string, newName: string) => {
    if (!user) return;
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    // Only owner can rename
    if (account.ownerId && account.ownerId !== user.uid) {
      throw new Error('Only the account owner can rename this account');
    }

    try {
      await financeService.renameAccount(user.uid, userName, account, newName);
    } catch (err) {
      throw handleError(err);
    }
  };

  // Transaction operations
  const addTransaction = async (tx: CreateTransactionPayload) => {
    if (!user) return;

    try {
      await financeService.addTransaction(user.uid, tx, accounts);
    } catch (err) {
      throw handleError(err);
    }
  };

  const deleteTransaction = async (id: string, accountId: string) => {
    if (!user) return;

    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    // Check permissions
    if (!canDeleteTransaction(account, user.uid)) {
      throw new Error('You do not have permission to delete transactions from this account');
    }

    try {
      await financeService.deleteTransaction(user.uid, id, accountId, accounts, transactions);
    } catch (err) {
      throw handleError(err);
    }
  };

  const updateTransaction = async (
    id: string,
    accountId: string,
    updates: UpdateTransactionPayload
  ) => {
    if (!user) return;
    try {
      await financeService.updateTransaction(user.uid, id, accountId, updates, accounts);
    } catch (err) {
      throw handleError(err);
    }
  };

  const restoreTransaction = async (
    id: string,
    accountId: string,
    amountCents: number,
    type: TransactionType
  ) => {
    if (!user) return;
    try {
      const account = accounts.find(a => a.id === accountId);
      if (!account) return;

      const batch = writeBatch(db);
      const targetUserId = account.ownerId || user.uid;
      const txRef = doc(db, 'artifacts', APP_ID, 'users', targetUserId, 'finance', id);
      batch.update(txRef, { isSoftDeleted: false, deletedBy: null, deletedAt: null });
      const accRef = doc(db, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
      batch.update(accRef, {
        balanceCents: increment(type === 'income' ? amountCents : -amountCents)
      });
      await batch.commit();
    } catch (err) {
      throw handleError(err);
    }
  };

  const convertCurrency = async (
    fromAccountId: string,
    toAccountId: string,
    amountCents: number,
    rate: number
  ) => {
    if (!user) return;
    try {
      const fromAcc = accounts.find(a => a.id === fromAccountId);
      const toAcc = accounts.find(a => a.id === toAccountId);
      if (!fromAcc || !toAcc) return;

      const batch = writeBatch(db);
      const linkId = crypto.randomUUID();

      const fromOwnerId = fromAcc.ownerId || user.uid;
      const outRef = doc(collection(db, 'artifacts', APP_ID, 'users', fromOwnerId, 'finance'));
      batch.set(outRef, {
        title: `Conversion to ${toAcc.currency}`,
        amountCents: amountCents,
        type: 'expense',
        category: 'Conversion',
        accountId: fromAccountId,
        accountName: fromAcc.name,
        currency: fromAcc.currency,
        scope: 'family',
        date: new Date().toISOString(),
        createdBy: user.uid,
        linkId,
        conversionRate: rate
      });
      const fromAccRef = doc(db, 'artifacts', APP_ID, 'users', fromOwnerId, 'accounts', fromAccountId);
      batch.update(fromAccRef, { balanceCents: increment(-amountCents) });

      const toOwnerId = toAcc.ownerId || user.uid;
      const inRef = doc(collection(db, 'artifacts', APP_ID, 'users', toOwnerId, 'finance'));
      const convertedAmountCents = Math.round(amountCents * rate);

      batch.set(inRef, {
        title: `Conversion from ${fromAcc.currency}`,
        amountCents: convertedAmountCents,
        type: 'income',
        category: 'Conversion',
        accountId: toAccountId,
        accountName: toAcc.name,
        currency: toAcc.currency,
        scope: 'family',
        date: new Date().toISOString(),
        createdBy: user.uid,
        linkId,
        conversionRate: rate
      });
      const toAccRef = doc(db, 'artifacts', APP_ID, 'users', toOwnerId, 'accounts', toAccountId);
      batch.update(toAccRef, { balanceCents: increment(convertedAmountCents) });

      await batch.commit();
    } catch (err) {
      throw handleError(err);
    }
  };

  return {
    transactions,
    accounts,
    addAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    restoreTransaction,
    convertCurrency,
    renameAccount,
    loadingFinance,
    currentMonth,
    nextMonth,
    prevMonth,
    jumpToMonth,
    netWorth,
    recentActivity,
    cashFlow
  };
};
