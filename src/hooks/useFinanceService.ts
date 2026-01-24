/**
 * useFinanceService Hook
 * 
 * Unified facade combining data retrieval (useFinanceData) and
 * mutation operations (useFinanceOperations) for backward compatibility.
 * 
 * @module hooks/useFinanceService
 */

import type { User } from 'firebase/auth';
import type { AnchorTransaction } from '../types';
import { useFinanceData } from './useFinanceData';
import { useFinanceOperations } from './useFinanceOperations';

/**
 * Extended transaction type with audit fields
 */
export interface ExtendedTransaction extends AnchorTransaction {
  createdBy?: string;
  lastEditedBy?: string;
  isSoftDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
  linkId?: string;
  accountOwnerId?: string;
}

/**
 * Combined finance service hook providing both data and operations
 * 
 * @param user - Firebase user object
 * @param _familyMemberId - Deprecated parameter, kept for compatibility
 * @param userName - Display name for activity logging
 */
export const useFinanceService = (
  user: User | null,
  _familyMemberId?: string | null,
  userName: string = 'User'
) => {
  // Data layer
  const {
    transactions,
    accounts,
    loadingFinance,
    currentMonth,
    nextMonth,
    prevMonth,
    jumpToMonth,
    netWorth,
    recentActivity,
    cashFlow,
  } = useFinanceData(user);

  // Operations layer
  const {
    addAccount,
    deleteAccount,
    renameAccount,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    restoreTransaction,
    convertCurrency,
  } = useFinanceOperations(user, userName, accounts, transactions);

  return {
    // Data
    transactions,
    accounts,
    loadingFinance,
    currentMonth,
    netWorth,
    recentActivity,
    cashFlow,
    // Navigation
    nextMonth,
    prevMonth,
    jumpToMonth,
    // Account operations
    addAccount,
    deleteAccount,
    renameAccount,
    // Transaction operations
    addTransaction,
    deleteTransaction,
    updateTransaction,
    restoreTransaction,
    convertCurrency,
  };
};
