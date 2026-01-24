/**
 * TransactionListVirtual - Virtualized transaction list with search/filter
 * Extracted from AccountDetailsView for better maintainability
 */

import { useRef } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { AnchorTransaction, AnchorAccount, Currency } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import { CategoryIcon } from '../../../components/shared';

interface TransactionListVirtualProps {
    transactions: AnchorTransaction[];
    account: AnchorAccount;
    currentUserId?: string;
    searchQuery: string;
    filterType: 'all' | 'income' | 'expense';
    selectedWeekStart: Date | null;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: 'all' | 'income' | 'expense') => void;
    onEdit?: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
}

export const TransactionListVirtual = ({
    transactions,
    account,
    currentUserId,
    searchQuery,
    filterType,
    selectedWeekStart,
    onSearchChange,
    onFilterChange,
    onEdit,
    onDelete,
}: TransactionListVirtualProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const isOwner = !account.ownerId || account.ownerId === currentUserId;

    const rowVirtualizer = useVirtualizer({
        count: transactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 72,
        overscan: 5,
    });

    return (
        <div className="glass-card overflow-hidden">
            {/* Header & Filters */}
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    History
                    {selectedWeekStart && (
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                            Filtered by Week
                        </span>
                    )}
                </h3>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full sm:w-48 pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {(['all', 'expense', 'income'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => onFilterChange(type)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === type
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                                        : 'text-slate-400'
                                    }`}
                            >
                                {type === 'all' ? 'All' : type === 'expense' ? 'Out' : 'In'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Name History */}
            {account.nameHistory && account.nameHistory.length > 0 && !searchQuery && filterType === 'all' && (
                <div className="border-b border-amber-100 dark:border-amber-900/30">
                    {account.nameHistory.slice().reverse().map((entry, idx) => (
                        <div
                            key={`rename-${idx}`}
                            className="flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 text-sm"
                        >
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-amber-900 dark:text-amber-200">Account renamed</p>
                                <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
                                    <span className="line-through">{entry.oldName}</span>
                                    <span className="mx-2">→</span>
                                    <span className="font-semibold">{entry.newName}</span>
                                </p>
                            </div>
                            <div className="text-right text-xs text-amber-600/60 dark:text-amber-400/60">
                                <p>{new Date(entry.date).toLocaleDateString()}</p>
                                <p>by {entry.actorName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Virtualized Transaction List */}
            <div ref={parentRef} className="max-h-[500px] overflow-y-auto">
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const tx = transactions[virtualItem.index];
                        const txTitle = tx.title || 'Untitled';
                        const txCategory = tx.category || 'Other';
                        const txDate = tx.date ? new Date(tx.date).toLocaleDateString() : 'Unknown Date';
                        const txAmount = tx.amountCents || 0;
                        const txCurrency = tx.currency || ('NGN' as Currency);

                        return (
                            <div
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                ref={rowVirtualizer.measureElement}
                                className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group absolute top-0 left-0 w-full"
                                style={{ transform: `translateY(${virtualItem.start}px)` }}
                            >
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    <CategoryIcon category={txCategory} size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{txTitle}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {txDate} • {txCategory}
                                        {tx.createdByName && currentUserId && tx.createdBy !== currentUserId && (
                                            <span className="text-indigo-500 ml-1">• by {tx.createdByName}</span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-mono font-black text-sm tabular-nums ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'
                                        }`}>
                                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(fromCents(txAmount), txCurrency)}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    {onEdit && isOwner && (
                                        <button
                                            onClick={() => onEdit(tx)}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all"
                                            aria-label="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    )}
                                    {isOwner && (
                                        <button
                                            onClick={() => onDelete(tx)}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                                            aria-label="Delete transaction"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {transactions.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        {selectedWeekStart ? 'No transactions in selected week.' : 'No transactions found.'}
                    </div>
                )}
            </div>
        </div>
    );
};
