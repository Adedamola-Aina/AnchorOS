
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
    /*
     * Deliberately NOT a viewport unit.
     *
     * The previous default was an arbitrary-height utility subtracting 320px from
     * `100vh`. `vh` resolves against the LARGE viewport, which in an installed iOS PWA
     * is taller than the layout viewport the shell is sized against (`html/body/#root`
     * are all `height: 100%` — see the viewport contract in index.css). A `vh`-sized
     * box inside a `100%`-sized shell is exactly the mismatch that contract exists to
     * prevent: the box is taller than the space it sits in, the page grows past what
     * was intended, and the extra height reads as unexplained empty space at the end
     * of the page.
     *
     * (The class is described rather than quoted on purpose: Tailwind v4 scans raw
     * file text, comments included, so quoting it here would emit the very utility
     * this change removes. `shellGeometry.test.ts` pins that.)
     *
     * Both current call sites pass their own `className`, so this value is only a
     * fallback — kept free of viewport units so it cannot reintroduce the mismatch
     * for a future caller.
     */
    className = 'min-h-[200px]',
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
        estimateSize: () => 64, // Native-style row: 56px + 8px separator breathing room
        overscan: 6,
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

    /*
     * The virtualised list keeps its bounded scrollport (the virtualiser needs one)
     * but no longer declares `overscroll-contain`: containing the gesture made the
     * list swallow scroll at its end, so the page around it could not continue and the
     * ledger read as a separate screen. Chaining is the platform default and the
     * correct behaviour — the list scrolls, then the page carries on.
     */
    return (
        <div
            ref={parentRef}
            className={`bg-transparent overflow-y-auto ${className} ${loading ? 'opacity-40 grayscale-[0.5]' : ''}`}
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
                            className="border-b border-slate-100 dark:border-slate-800/70"
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
                <p className="py-4 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    End of list
                </p>
            )}
        </div>
    );
};
