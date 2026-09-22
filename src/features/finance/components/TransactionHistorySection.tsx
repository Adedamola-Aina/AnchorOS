/**
 * TransactionHistorySection — Month nav + search + transaction list
 * Extracted from FinanceView per ARCH-001 200-line rule.
 */
// @ts-nocheck

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { useAuth } from '../../../context/AuthContext';
import { useFamilySharing } from '../../../hooks/useFamilySharing';
import { VirtualTransactionList } from './VirtualTransactionList';
import { TransactionFilterHeader } from './TransactionListParts';
import { isTransferLeg } from '../../../utils/financeInsights';
import { useInfiniteTransactionsQuery } from '../../../hooks/queries/useFinanceQueries';
import type { AnchorTransaction } from '../../../types';

interface TransactionHistorySectionProps {
  transactions: AnchorTransaction[];
  onEdit: (tx: AnchorTransaction) => void;
  onDelete: (tx: AnchorTransaction) => void;
  /** UX-FN-01: the empty state's action. */
  onRecordTransaction?: () => void;
  /** UX-FN-10: set only when activity exists in another month. */
  latestActivityLabel?: string;
  onJumpToLatestActivity?: () => void;
}

export const TransactionHistorySection = ({ transactions, onEdit, onDelete, onRecordTransaction, latestActivityLabel, onJumpToLatestActivity }: TransactionHistorySectionProps) => {
  const { currentMonth, nextMonth, prevMonth } = useFinance();
  const { user } = useAuth();
  const { isOwner, connection } = useFamilySharing(user?.uid);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const hasConnection = !!connection;
  const shouldUsePaginatedOwn = !!user?.uid && (!hasConnection || isOwner);

  const start = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString(),
    [currentMonth]
  );
  const end = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
    [currentMonth]
  );
  const {
    data: pagedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteTransactionsQuery(user?.uid, start, end, 100, shouldUsePaginatedOwn);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const pagedTransactions = useMemo(
    () => (pagedData?.pages || []).flatMap(page => page.page || []),
    [pagedData]
  );
  const activeTransactions = shouldUsePaginatedOwn ? pagedTransactions : transactions;

  const filtered = useMemo(() => {
    const scoped = activeTransactions.filter(tx => {
      const transfer = isTransferLeg(tx);
      if (filterType === 'transfer') return transfer;
      if (filterType === 'all') return true;
      // "Money in / Money out" are economic directions, so an internal transfer
      // leg (stored as income/expense) is excluded — it has its own scope.
      return !transfer && tx.type === filterType;
    });
    if (!searchQuery.trim()) return scoped;
    const q = searchQuery.toLowerCase();
    return scoped.filter(tx =>
      tx.title?.toLowerCase().includes(q) ||
      tx.category?.toLowerCase().includes(q) ||
      tx.accountName?.toLowerCase().includes(q)
    );
  }, [activeTransactions, searchQuery, filterType]);

  return (
    <section aria-labelledby="finance-transactions-heading">
      {/*
        * UX-FN-15: one heading, one period control, one search, one scope row —
        * and the rows themselves are list rows, not cards inside a card.
        */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 id="finance-transactions-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Transactions
        </h3>
        <div className="flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-0.5">
          <button
            type="button"
            onClick={prevMonth}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
          </button>
          <span className="px-1 text-xs font-semibold text-slate-700 dark:text-slate-200 select-none min-w-[86px] text-center">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
          </button>
        </div>
      </div>

      <TransactionFilterHeader
        searchQuery={searchQuery}
        filterType={filterType}
        hasWeekFilter={false}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterType}
        searchPlaceholder={`Search in ${currentMonth.toLocaleDateString('en-US', { month: 'long' })}…`}
      />

      <VirtualTransactionList
        transactions={filtered}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        onEdit={onEdit}
        onDelete={onDelete}
        onRecordTransaction={onRecordTransaction}
        latestActivityLabel={latestActivityLabel}
        onJumpToLatestActivity={onJumpToLatestActivity}
        className="min-h-[200px] max-h-[65vh]"
      />
      {shouldUsePaginatedOwn && hasNextPage && !searchQuery.trim() && (
        <div className="pb-3 pt-1 flex justify-center">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  );
};
