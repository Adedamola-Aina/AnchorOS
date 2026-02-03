/**
 * TransactionItem - Individual transaction row in the transaction list
 * 
 * DES-002: Migrated to semantic tokens and primitives
 * Follows the Calm Computing design philosophy
 */

import React from 'react';
import { CategoryIcon } from '../../../components/shared';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorTransaction } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Badge, Text, HStack, VStack } from '../../../components/primitives';

interface TransactionItemProps {
    transaction: AnchorTransaction;
    accountName?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    currentUserId?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
    transaction,
    currentUserId,
}) => {
    if (!transaction) return null;

    // Backdated calculation
    const isBackdated = transaction.isBackdated ?? (() => {
        if (!transaction.transactionDate) return false;
        const entryDate = new Date(transaction.date).getTime();
        const txDate = new Date(transaction.transactionDate).getTime();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        return (entryDate - txDate) > ONE_DAY_MS;
    })();

    const displayDate = transaction.transactionDate || transaction.date;

    // Semantic amount styling
    const amountVariant = transaction.type === 'income'
        ? 'finance'
        : transaction.type === 'transfer'
            ? 'primary'
            : 'body';

    const amountPrefix = transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : '';

    return (
        <Card className="group p-3 sm:p-4 transition-all hover:border-[var(--border)]">
            <HStack gap="sm" align="center">
                {/* Icon */}
                <CategoryIcon
                    category={transaction.category}
                    className="shrink-0"
                />

                {/* Title + Meta */}
                <VStack gap="xs" className="min-w-0 flex-1">
                    <HStack justify="between" align="center" gap="sm">
                        <Text as="h4" variant="heading" size="sm" truncate className="leading-tight">
                            {transaction.title}
                        </Text>
                        <Text
                            variant={amountVariant}
                            weight="bold"
                            size="sm"
                            mono
                            truncate
                            className="shrink-0"
                        >
                            {amountPrefix}
                            {formatCurrencyCompact(fromCents(transaction.amountCents || 0), transaction.currency || 'USD')}
                        </Text>
                    </HStack>

                    {/* Metadata row */}
                    <HStack gap="xs" align="center" wrap className="min-w-0">
                        <Text variant="muted" size="xs" className="shrink-0">
                            {new Date(displayDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Text>

                        {/* Category Badge */}
                        <Badge variant="default" size="xs" className="truncate max-w-[120px]">
                            {transaction.category}
                        </Badge>

                        {/* Family Member Badge */}
                        {transaction.createdBy && currentUserId && transaction.createdBy !== currentUserId && (
                            <Badge variant="info" size="xs" className="truncate max-w-[100px]">
                                {transaction.createdByName || 'Family'}
                            </Badge>
                        )}

                        {/* Backdated Badge */}
                        {isBackdated && (
                            <Badge variant="warning" size="xs">
                                Backdated
                            </Badge>
                        )}
                    </HStack>
                </VStack>
            </HStack>
        </Card>
    );
};

