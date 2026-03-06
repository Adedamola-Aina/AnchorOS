/**
 * SwipeableTransactionItem - Mobile-optimized transaction row with swipe actions
 * 
 * Wraps TransactionItem with SwipeableRow for mobile gesture support.
 * On mobile: swipe left to delete, swipe right to edit
 * On desktop: uses hover-based action buttons (no swipe)
 * 
 * @module features/finance/components/SwipeableTransactionItem
 */
// @ts-nocheck


import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { SwipeableRow } from '../../../components/mobile/SwipeableRow';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTransaction } from '../../../types';

interface SwipeableTransactionItemProps {
    transaction: AnchorTransaction;
    accountName?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    currentUserId?: string;
}

export const SwipeableTransactionItem: React.FC<SwipeableTransactionItemProps> = ({
    transaction,
    accountName,
    onEdit,
    onDelete,
    currentUserId,
}) => {
    const { isMobile } = useResponsive();

    const isSynced = transaction.source === 'synced';

    // On mobile, wrap with SwipeableRow for gesture support
    if (isMobile) {
        return (
            <SwipeableRow
                onSwipeLeft={isSynced ? undefined : () => onDelete(transaction)}
                onSwipeRight={() => onEdit(transaction)}
                leftAction={{
                    label: 'Edit',
                    color: 'blue',
                    icon: <Pencil className="w-4 h-4 mr-1" />,
                }}
                rightAction={isSynced ? undefined : {
                    label: 'Delete',
                    color: 'red',
                    icon: <Trash2 className="w-4 h-4 mr-1" />,
                }}
            >
                <TransactionItem
                    transaction={transaction}
                    accountName={accountName}
                    onEdit={onEdit}
                    onDelete={isSynced ? undefined : onDelete}
                    currentUserId={currentUserId}
                />
            </SwipeableRow>
        );
    }

    // On desktop, render TransactionItem directly (uses hover-based actions)
    return (
        <TransactionItem
            transaction={transaction}
            accountName={accountName}
            onEdit={onEdit}
            onDelete={isSynced ? undefined : onDelete}
            currentUserId={currentUserId}
        />
    );
};
