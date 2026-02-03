/**
 * VirtualTransactionList - Virtualized scrolling for transaction lists
 * DES-002: Migrated to semantic tokens and primitives
 */

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { SwipeableTransactionItem } from './SwipeableTransactionItem';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTransaction } from '../../../types';
import { Text, VStack, HStack, Indicator } from '../../../components/primitives';

interface VirtualTransactionListProps {
    transactions: AnchorTransaction[];
    currentUserId?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    loading?: boolean;
    searchQuery?: string;
    onClearSearch?: () => void;
    className?: string;
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
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();

    const parentVirtualizer = useVirtualizer({
        count: transactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 88,
        overscan: 5,
    });

    const rowVirtualizer = parentVirtualizer;

    if (transactions.length === 0) {
        return (
            <VStack align="center" justify="center" gap="sm" className="py-12 px-4">
                <Search className="w-10 h-10 text-subtle dark:text-subtle-dark" />
                <Text variant="heading" weight="bold">
                    {searchQuery ? 'No transactions found' : 'No transactions yet'}
                </Text>
                <Text variant="muted" size="sm">
                    {searchQuery ? 'Try a different search term' : 'Add your first transaction to get started'}
                </Text>
                {searchQuery && onClearSearch && (
                    <button
                        onClick={onClearSearch}
                        className="mt-4 text-primary-500 text-sm font-bold hover:underline"
                    >
                        Clear Search
                    </button>
                )}
            </VStack>
        );
    }

    return (
        <div
            ref={parentRef}
            className={`bg-transparent overflow-y-auto overscroll-contain ${className} ${loading ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}
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
                            className="pb-2"
                        >
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
                <HStack justify="center" className="py-6">
                    <HStack gap="sm" align="center" className="p-2 rounded-full bg-surface-3 dark:bg-surface-3-dark">
                        <Indicator status="default" size="xs" />
                        <Text variant="muted" size="xs">End of list</Text>
                        <Indicator status="default" size="xs" />
                    </HStack>
                </HStack>
            )}
        </div>
    );
};

