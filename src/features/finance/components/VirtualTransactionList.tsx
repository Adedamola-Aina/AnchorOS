import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import type { AnchorTransaction } from '../../../types';

interface VirtualTransactionListProps {
    transactions: AnchorTransaction[];
    currentUserId?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    loading?: boolean;
    searchQuery?: string;
    onClearSearch?: () => void;
}

export const VirtualTransactionList: React.FC<VirtualTransactionListProps> = ({
    transactions,
    currentUserId,
    onEdit,
    onDelete,
    loading,
    searchQuery,
    onClearSearch,
}) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: transactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100, // Height of Card-based TransactionItem + spacing
        overscan: 5, // Render 5 extra items above/below viewport
    });

    if (transactions.length === 0) {
        return (
            <div className="p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                    {searchQuery ? 'No transactions found' : 'No transactions yet'}
                </h4>
                {searchQuery && onClearSearch && (
                    <button
                        onClick={onClearSearch}
                        className="mt-4 text-blue-500 text-sm font-bold hover:underline"
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
            className={`md:max-h-[600px] overflow-y-auto ${loading ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}
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
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                            className="pb-3" // Spacing between cards
                        >
                            <TransactionItem
                                transaction={tx}
                                accountName={tx.accountName}
                                currentUserId={currentUserId}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
