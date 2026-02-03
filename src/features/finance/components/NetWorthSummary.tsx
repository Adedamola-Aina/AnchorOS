/**
 * NetWorthSummary - Displays net worth in both currencies
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { DollarSign, Landmark } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
import { Text, HStack, VStack } from '../../../components/primitives';

interface NetWorthSummaryProps {
    netWorth: { NGN: number; USD: number };
}

export const NetWorthSummary: React.FC<NetWorthSummaryProps> = ({ netWorth }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-2 dark:bg-surface-2-dark p-6 rounded-2xl shadow-sm border border-[var(--border)]">
                <HStack gap="md" align="center">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                        <Landmark className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <VStack gap="none" className="min-w-0 flex-1">
                        <Text variant="muted" size="xs" weight="medium" className="uppercase tracking-wider">
                            Net Worth (NGN)
                        </Text>
                        <Text variant="heading" size="xl" weight="bold" mono truncate className="mt-1">
                            {formatCurrencyCompact(netWorth.NGN, 'NGN')}
                        </Text>
                    </VStack>
                </HStack>
            </div>

            <div className="bg-surface-2 dark:bg-surface-2-dark p-6 rounded-2xl shadow-sm border border-[var(--border)]">
                <HStack gap="md" align="center">
                    <div className="p-3 bg-finance-50 dark:bg-finance-900/20 rounded-xl">
                        <DollarSign className="w-6 h-6 text-finance-600 dark:text-finance-400" />
                    </div>
                    <VStack gap="none" className="min-w-0 flex-1">
                        <Text variant="muted" size="xs" weight="medium" className="uppercase tracking-wider">
                            Net Worth (USD)
                        </Text>
                        <Text variant="heading" size="xl" weight="bold" mono truncate className="mt-1">
                            {formatCurrencyCompact(netWorth.USD, 'USD')}
                        </Text>
                    </VStack>
                </HStack>
            </div>
        </div>
    );
};

