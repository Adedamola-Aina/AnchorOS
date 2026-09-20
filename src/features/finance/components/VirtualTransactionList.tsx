// @ts-nocheck
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { SwipeableTransactionItem } from './SwipeableTransactionItem';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTransaction } from '../../../types';

interface VirtualTransactionListProps {
    transactions: AnchorTransaction[];
    currentUserId?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    loading?: boolean;
    searchQuery?: string;
    onClearSearch?: () => void;
    className?: string;
    /** When provided, a "Previous month" divider is shown before this index. */
    carryoverStartIndex?: number;
    /**
     * UX-FN-01: the empty state used to instruct "Add your first transaction to
     * get started" with **no control at all**. The action now lives with the
     * instruction.
     */
    onRecordTransaction?: () => void;
    /**
     * UX-FN-10: when the account holds transactions in other months, the empty
     * state must say so and offer the one-tap way there instead of implying the
     * account is empty.
     */
    latestActivityLabel?: string;
    onJumpToLatestActivity?: () => void;
}

export const VirtualTransactionList: React.FC<VirtualTransactionListProps> = ({
    transactions,
    currentUserId,
    onEdit,
    onDelete,
    loading,
    searchQuery,
    onClearSearch,
    className = "h-[calc(100vh-320px)] min-h-[400px]",
    carryoverStartIndex,
    onRecordTransaction,
    latestActivityLabel,
    onJumpToLatestActivity,
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    // eslint-disable-next-line react-hooks/incompatible-library
    const parentVirtualizer = useVirtualizer({
        count: safeTransactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 88, // Row height: ~80px card + 8px gap
        overscan: 5,
    });

    const rowVirtualizer = parentVirtualizer;

    if (safeTransactions.length === 0) {
        const searching = !!searchQuery;
        const activityElsewhere = !searching && !!latestActivityLabel && !!onJumpToLatestActivity;

        // UX-FN-06: an empty list must state *why* it is empty — "no matches for
        // this search", "nothing this month but you have activity elsewhere", or
        // "you have not recorded anything yet" are three different situations.
        const title = searching
            ? 'No transactions found'
            : activityElsewhere
                ? 'Nothing this month'
                : 'No transactions yet';
        const body = searching
            ? 'Try a different search term.'
            : activityElsewhere
                ? `You have activity in ${latestActivityLabel}.`
                : 'Record your first transaction to get started.';

        return (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center" data-testid="transaction-empty-state">
                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{body}</p>

                {searching && onClearSearch && (
                    <button
                        onClick={onClearSearch}
                        className="mt-4 min-h-11 px-4 text-primary-500 text-sm font-bold hover:underline"
                    >
                        Clear search
                    </button>
                )}

                {activityElsewhere && (
                    <button
                        type="button"
                        onClick={onJumpToLatestActivity}
                        data-testid="jump-to-latest-activity"
                        className="mt-4 min-h-11 px-4 rounded-card bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                        Go to {latestActivityLabel}
                    </button>
                )}

                {!searching && !activityElsewhere && onRecordTransaction && (
                    <button
                        type="button"
                        onClick={onRecordTransaction}
                        data-testid="record-first-transaction"
                        className="mt-4 min-h-11 px-4 rounded-card bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                        Record transaction
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            ref={parentRef}
            className={`bg-transparent overflow-y-auto overscroll-contain ${className} ${loading ? 'opacity-40 grayscale-[0.5]' : ''}`}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const tx = safeTransactions[virtualRow.index];
                    // Safety check: ensure transaction exists (array may have changed)
                    if (!tx) return null;
                    return (
                        <div
                            key={tx.id}
                            data-index={virtualRow.index}
                            ref={rowVirtualizer.measureElement}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                            className="pb-2" // Gap between transaction cards only
                        >
                            {/* Carry-over divider */}
                            {carryoverStartIndex != null && carryoverStartIndex > 0 && virtualRow.index === carryoverStartIndex && (
                                <div className="flex items-center gap-3 py-2 px-1 mb-1">
                                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">Previous month</span>
                                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                </div>
                            )}
                            {isMobile ? (
                                <SwipeableTransactionItem
                                    transaction={tx}
                                    accountName={tx.accountName}
                                    currentUserId={currentUserId}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ) : (
                                <TransactionItem
                                    transaction={tx}
                                    accountName={tx.accountName}
                                    currentUserId={currentUserId}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            {!loading && safeTransactions.length > 0 && (
                <div className="py-6 text-center">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                        End of list
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 ml-2"></span>
                    </div>
                </div>
            )}
        </div>
    );
};
