/**
 * RecentActivityList - Shows recent transactions
 * DES-002: Migrated to semantic tokens and primitives
 */

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { AnchorTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';
import { formatCurrencyCompact } from '../../../utils/format';
import { Text, VStack, HStack } from '../../../components/primitives';

interface RecentActivityListProps {
    recentActivity: AnchorTransaction[];
}

export function RecentActivityList({ recentActivity }: RecentActivityListProps) {
    return (
        <div className="glass-card p-6 overflow-hidden">
            <Text size="xs" weight="bold" variant="muted" className="font-black uppercase tracking-[0.2em] mb-4">Recent Activity</Text>
            <VStack gap="sm">
                {recentActivity.length > 0 ? (
                    recentActivity.map((tx, idx) => {
                        // Use transactionDate (actual date) if available, else entry date
                        const displayDate = tx.transactionDate || tx.date;
                        const dateStr = displayDate
                            ? new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : '';

                        return (
                            <HStack
                                key={tx.id || idx}
                                justify="between"
                                align="center"
                                className="text-sm group p-3 rounded-xl hover:bg-surface-3 dark:hover:bg-surface-3-dark transition-colors"
                            >
                                <HStack gap="sm" align="center" className="min-w-0 flex-1">
                                    <div className={`p-2 rounded-xl shrink-0 ${tx.type === 'income'
                                        ? 'bg-finance-500/10 text-finance-500'
                                        : tx.type === 'expense'
                                            ? 'bg-danger-500/10 text-danger-500'
                                            : 'bg-primary-500/10 text-primary-500'
                                        }`}>
                                        {tx.type === 'income'
                                            ? <TrendingUp className="w-4 h-4" />
                                            : tx.type === 'expense'
                                                ? <TrendingDown className="w-4 h-4" />
                                                : <Activity className="w-4 h-4" />
                                        }
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Text size="sm" weight="bold" className="text-subtle dark:text-subtle-dark truncate">
                                            {tx.title}
                                        </Text>
                                        <HStack gap="sm" align="center" className="mt-0.5 min-w-0">
                                            <Text size="xs" variant="muted" className="shrink-0">
                                                {dateStr}
                                            </Text>
                                            <span className="text-[10px] text-muted px-1.5 py-0.5 bg-surface-3 dark:bg-surface-3-dark rounded truncate">
                                                {tx.category}
                                            </span>
                                        </HStack>
                                    </div>
                                </HStack>
                                <span className={`font-mono font-bold text-sm tabular-nums shrink-0 ${tx.type === 'income'
                                    ? 'text-finance-500'
                                    : tx.type === 'expense'
                                        ? 'text-danger-500'
                                        : 'text-primary-500'
                                    }`}>
                                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                                    {formatCurrencyCompact(fromCents(tx.amountCents || 0), tx.currency || 'NGN')}
                                </span>
                            </HStack>
                        );
                    })
                ) : (
                    <Text size="sm" variant="muted" className="italic text-center py-4">No recent transactions</Text>
                )}
            </VStack>
        </div>
    );
}

