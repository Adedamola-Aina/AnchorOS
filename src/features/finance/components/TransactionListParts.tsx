/**
 * TransactionListVirtual Parts
 * Extracted from TransactionListVirtual.tsx per CLAUDE.md §3.2
 * Note: TransactionRow removed - using unified TransactionItem/SwipeableTransactionItem
 */

import React from 'react';
import { Search, Pencil } from 'lucide-react';

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

interface NameHistoryEntry { oldName: string; newName: string; date: string; actorName: string; }
interface NameHistoryProps { entries: NameHistoryEntry[]; }
export const AccountNameHistory: React.FC<NameHistoryProps> = ({ entries }) => (
    <div className="border-b border-amber-100 dark:border-amber-900/30">
        {entries.slice().reverse().map((entry, idx) => (
            <div key={`rename-${idx}`} className="flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 text-sm">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl"><Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" /></div>
                <div className="flex-1 min-w-0"><p className="font-medium text-amber-900 dark:text-amber-200">Account renamed</p><p className="text-xs text-amber-700/70 dark:text-amber-400/70"><span className="line-through">{entry.oldName}</span><span className="mx-2">→</span><span className="font-semibold">{entry.newName}</span></p></div>
                <div className="text-right text-xs text-amber-600/60 dark:text-amber-400/60"><p>{new Date(entry.date).toLocaleDateString()}</p><p>by {entry.actorName}</p></div>
            </div>
        ))}
    </div>
);

// TransactionRow removed - using unified TransactionItem/SwipeableTransactionItem instead
