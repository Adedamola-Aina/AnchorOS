/**
 * TransactionListVirtual - Virtualized transaction list with search/filter
 * 
 * Follows CLAUDE.md design system with Card-based transaction items
 */

import { useRef } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTransaction, AnchorAccount, Currency } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import { CategoryIcon, Badge } from '../../../components/shared';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

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
    const { isMobile } = useResponsive();
    const isOwner = !account.ownerId || account.ownerId === currentUserId;

    const parentVirtualizer = useVirtualizer({
        count: transactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100, // Card-based height
        overscan: 5,
    });

    const windowVirtualizer = useWindowVirtualizer({
        count: transactions.length,
        estimateSize: () => 100,
        overscan: 5,
        scrollMargin: parentRef.current?.offsetTop ?? 0,
    });

    const rowVirtualizer = isMobile ? windowVirtualizer : parentVirtualizer;

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
            <div ref={parentRef} className={isMobile ? 'p-3' : 'md:max-h-[500px] overflow-y-auto p-3'}>
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
                        // Use transactionDate (actual) if available, else entry date
                        const displayDate = tx.transactionDate || tx.date;
                        const txDate = displayDate ? new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown';
                        const txAmount = tx.amountCents || 0;
                        const txCurrency = tx.currency || ('NGN' as Currency);

                        // Check if backdated
                        const isBackdated = tx.isBackdated ?? (() => {
                            if (!tx.transactionDate) return false;
                            const entryDate = new Date(tx.date).getTime();
                            const actualDate = new Date(tx.transactionDate).getTime();
                            return (entryDate - actualDate) > 24 * 60 * 60 * 1000;
                        })();

                        const amountColor = tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : tx.type === 'transfer'
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-900 dark:text-white';

                        return (
                            <div
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                ref={rowVirtualizer.measureElement}
                                className="absolute top-0 left-0 w-full pb-3"
                                style={{ transform: `translateY(${virtualItem.start - (isMobile ? rowVirtualizer.options.scrollMargin : 0)}px)` }}
                            >
                                <Card className="group p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Left: Icon + Info */}
                                        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                            <CategoryIcon
                                                category={txCategory}
                                                className="shrink-0 mt-0.5 sm:mt-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                                                    {txTitle}
                                                </h4>
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {txDate}
                                                    </span>
                                                    <Badge type="todo" variant="outline">
                                                        {txCategory}
                                                    </Badge>
                                                    {tx.createdBy && currentUserId && tx.createdBy !== currentUserId && (
                                                        <Badge type="family">
                                                            {tx.createdByName || 'Family'}
                                                        </Badge>
                                                    )}
                                                    {isBackdated && (
                                                        <Badge type="warning" variant="outline">
                                                            Backdated
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Amount + Actions */}
                                        <div className="flex items-center justify-between sm:justify-end gap-4">
                                            <p className={`font-semibold text-sm tabular-nums ${amountColor}`}>
                                                {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                                                {formatCurrency(fromCents(txAmount), txCurrency)}
                                            </p>
                                            <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                {onEdit && isOwner && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onEdit(tx)}
                                                        className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {isOwner && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onDelete(tx)}
                                                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
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
