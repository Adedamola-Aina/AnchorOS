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
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();

    const parentVirtualizer = useVirtualizer({
        count: transactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 88, // Row height: ~80px card + 8px gap
        overscan: 5,
    });

    const rowVirtualizer = parentVirtualizer;

    if (transactions.length === 0) {
        return (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                    {searchQuery ? 'No transactions found' : 'No transactions yet'}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {searchQuery ? 'Try a different search term' : 'Add your first transaction to get started'}
                </p>
                {searchQuery && onClearSearch && (
                    <button
                        onClick={onClearSearch}
                        className="mt-4 text-primary-500 text-sm font-bold hover:underline"
                    >
                        Clear Search
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
                    const tx = transactions[virtualRow.index];
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
            {!loading && transactions.length > 0 && (
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
