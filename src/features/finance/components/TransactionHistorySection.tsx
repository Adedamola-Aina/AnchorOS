/**
 * TransactionHistorySection — Month nav + search + transaction list
 * Extracted from FinanceView per ARCH-001 200-line rule.
 */
// @ts-nocheck

import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Search } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { VirtualTransactionList } from './VirtualTransactionList';
import type { AnchorTransaction } from '../../../types';

interface TransactionHistorySectionProps {
  transactions: AnchorTransaction[];
  onEdit: (tx: AnchorTransaction) => void;
  onDelete: (tx: AnchorTransaction) => void;
}

export const TransactionHistorySection = ({ transactions, onEdit, onDelete }: TransactionHistorySectionProps) => {
  const { currentMonth, nextMonth, prevMonth } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(tx =>
      tx.title?.toLowerCase().includes(q) ||
      tx.category?.toLowerCase().includes(q) ||
      tx.accountName?.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  return (
    <div>
      {/* Toolbar: month nav + search */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Month navigation */}
        <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-800">
          <button type="button" onClick={prevMonth} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Previous month">
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="px-2 flex items-center gap-2 min-w-[140px] justify-center text-sm font-bold text-slate-900 dark:text-white select-none">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{monthLabel}</span>
          </div>
          <button type="button" onClick={nextMonth} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Next month">
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[120px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search in ${currentMonth.toLocaleDateString('en-US', { month: 'long' })}...`}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <VirtualTransactionList
          transactions={filtered}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onEdit={onEdit}
          onDelete={onDelete}
          className="min-h-[200px] max-h-[calc(100vh-250px)]"
        />
      </div>
    </div>
  );
};
