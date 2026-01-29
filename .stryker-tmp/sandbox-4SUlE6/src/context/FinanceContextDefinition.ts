// @ts-nocheck
import { createContext } from 'react';
import type { AnchorTransaction, AnchorAccount, TransactionType } from '../types';
import type { CreateAccountPayload, CreateTransactionPayload, UpdateTransactionPayload } from '../services/FinanceService';
export interface FinanceContextType {
  transactions: AnchorTransaction[];
  accounts: AnchorAccount[];
  loadingFinance: boolean;
  addAccount: (acc: CreateAccountPayload) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addTransaction: (tx: CreateTransactionPayload) => Promise<void>;
  deleteTransaction: (id: string, accountId: string) => Promise<void>;
  restoreTransaction: (id: string, accountId: string, amountCents: number, type: TransactionType) => Promise<void>;
  convertCurrency: (fromAccountId: string, toAccountId: string, amountCents: number, rate: number) => Promise<void>;
  renameAccount: (id: string, newName: string) => Promise<void>;
  updateTransaction: (id: string, accountId: string, updates: UpdateTransactionPayload) => Promise<void>;
  currentMonth: Date;
  nextMonth: () => void;
  prevMonth: () => void;
  jumpToMonth: (date: Date) => void;
  // Derived state
  netWorth: {
    NGN: number;
    USD: number;
  };
  recentActivity: AnchorTransaction[];
  cashFlow: {
    income: number;
    expense: number;
    net: number;
    trend: 'better' | 'worse' | 'neutral';
  };
  // Refetch data
  refetch: () => Promise<void>;
}
export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);