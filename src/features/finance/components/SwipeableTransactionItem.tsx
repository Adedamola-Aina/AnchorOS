/**
 * SwipeableTransactionItem - Mobile-optimized transaction row with swipe actions
 * DES-002: Already uses semantic icon colors (blue/red for edit/delete)
 */


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

    // On mobile, wrap with SwipeableRow for gesture support
    if (isMobile) {
        return (
            <SwipeableRow
                onSwipeLeft={() => onDelete(transaction)}
                onSwipeRight={() => onEdit(transaction)}
                leftAction={{
                    label: 'Edit',
                    color: 'blue',
                    icon: <Pencil className="w-4 h-4 mr-1" />,
                }}
                rightAction={{
                    label: 'Delete',
                    color: 'red',
                    icon: <Trash2 className="w-4 h-4 mr-1" />,
                }}
            >
                <TransactionItem
                    transaction={transaction}
                    accountName={accountName}
                    onEdit={onEdit}
                    onDelete={onDelete}
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
            onDelete={onDelete}
            currentUserId={currentUserId}
        />
    );
};
