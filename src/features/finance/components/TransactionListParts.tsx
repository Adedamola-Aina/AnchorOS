/**
 * TransactionListVirtual Parts
 * Extracted from TransactionListVirtual.tsx per CLAUDE.md §3.2
 * Note: TransactionRow removed - using unified TransactionItem/SwipeableTransactionItem
 */
// @ts-nocheck


import React from 'react';
import { Search } from 'lucide-react';

interface FilterHeaderProps { searchQuery: string; filterType: 'all' | 'income' | 'expense'; hasWeekFilter: boolean; onSearchChange: (q: string) => void; onFilterChange: (f: 'all' | 'income' | 'expense') => void; }
export const TransactionFilterHeader: React.FC<FilterHeaderProps> = ({ searchQuery, filterType, hasWeekFilter, onSearchChange, onFilterChange }) => (
    <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            History {hasWeekFilter && <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Filtered by Week</span>}
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full sm:w-48 pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white" />
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {(['all', 'expense', 'income'] as const).map((type) => (
                    <button key={type} onClick={() => onFilterChange(type)} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === type ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {type === 'all' ? 'All' : type === 'expense' ? 'Out' : 'In'}
                    </button>
                ))}
            </div>
        </div>
    </div>
);


// TransactionRow removed - using unified TransactionItem/SwipeableTransactionItem instead
