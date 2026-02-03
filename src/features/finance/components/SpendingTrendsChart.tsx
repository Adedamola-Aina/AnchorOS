/**
 * SpendingTrendsChart - 30-day spending trends visualization
 * DES-002: Migrated to semantic tokens and primitives
 */

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
import type { Currency } from '../../../types';
import { Text, HStack, VStack } from '../../../components/primitives';

interface WeeklyData {
    weekStart: Date;
    income: number;
    expense: number;
    net: number;
}

interface SpendingTrendsChartProps {
    weeklyData: WeeklyData[];
    currency: Currency;
    selectedWeekStart: Date | null;
    onSelectWeek: (weekStart: Date | null) => void;
    maxAmount: number;
}

export const SpendingTrendsChart = ({
    weeklyData,
    currency,
    selectedWeekStart,
    onSelectWeek,
    maxAmount,
}: SpendingTrendsChartProps) => {
    // Calculate 30-day totals
    const totals = weeklyData.reduce(
        (acc, d) => ({
            income: acc.income + d.income,
            expense: acc.expense + d.expense,
        }),
        { income: 0, expense: 0 }
    );
    const net = totals.income - totals.expense;

    return (
        <div className="glass-card p-5">
            {/* Header with Summary */}
            <HStack justify="between" align="center" className="mb-4">
                <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    30 Day Summary
                </Text>
                {selectedWeekStart && (
                    <button
                        onClick={() => onSelectWeek(null)}
                        className="text-[10px] font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400"
                    >
                        Clear Filter
                    </button>
                )}
            </HStack>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-3 rounded-xl bg-finance-50 dark:bg-finance-900/20">
                    <HStack justify="center" gap="xs" align="center" className="mb-1">
                        <ArrowUpRight className="w-3 h-3 text-finance-500" />
                        <Text variant="finance" size="xs" weight="bold" className="uppercase">In</Text>
                    </HStack>
                    <Text variant="finance" size="sm" weight="bold" mono>
                        {formatCurrencyCompact(totals.income, currency)}
                    </Text>
                </div>
                <div className="text-center p-3 rounded-xl bg-danger-bg dark:bg-danger-bgDark">
                    <HStack justify="center" gap="xs" align="center" className="mb-1">
                        <ArrowDownRight className="w-3 h-3 text-danger" />
                        <Text variant="danger" size="xs" weight="bold" className="uppercase">Out</Text>
                    </HStack>
                    <Text variant="danger" size="sm" weight="bold" mono>
                        {formatCurrencyCompact(totals.expense, currency)}
                    </Text>
                </div>
                <div className={`text-center p-3 rounded-xl ${net >= 0 ? 'bg-info-bg dark:bg-info-bgDark' : 'bg-warning-bg dark:bg-warning-bgDark'}`}>
                    <HStack justify="center" gap="xs" align="center" className="mb-1">
                        {net >= 0 ? <TrendingUp className="w-3 h-3 text-info" /> : <TrendingDown className="w-3 h-3 text-warning" />}
                        <Text variant={net >= 0 ? 'info' : 'warning'} size="xs" weight="bold" className="uppercase">Net</Text>
                    </HStack>
                    <Text variant={net >= 0 ? 'info' : 'warning'} size="sm" weight="bold" mono>
                        {net > 0 ? '+' : ''}{formatCurrencyCompact(net, currency)}
                    </Text>
                </div>
            </div>

            {/* Weekly Chart with clear label */}
            <VStack gap="sm" className="mt-1">
                <Text variant="subtle" size="xs" className="text-center">
                    Week by week breakdown
                </Text>
                <div className="h-20 flex items-end gap-1">
                    {weeklyData.map((d, i) => {
                        const isSelected = selectedWeekStart && d.weekStart.getTime() === selectedWeekStart.getTime();
                        const isDimmed = selectedWeekStart && !isSelected;
                        const incomeHeight = (d.income / maxAmount) * 100;
                        const expenseHeight = (d.expense / maxAmount) * 100;
                        const weekNum = i + 1;
                        const weekEnd = new Date(d.weekStart);
                        weekEnd.setDate(weekEnd.getDate() + 6);

                        return (
                            <button
                                key={i}
                                onClick={() => onSelectWeek(isSelected ? null : d.weekStart)}
                                className={`flex-1 flex flex-col items-center gap-1 group transition-all ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                                title={`${d.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                            >
                                <div className="w-full flex gap-0.5 items-end h-14">
                                    {/* Income Bar */}
                                    <div className="flex-1 h-full flex items-end">
                                        <div
                                            style={{ height: `${Math.max(incomeHeight, 4)}%` }}
                                            className={`w-full rounded-t transition-colors ${isSelected ? 'bg-finance-400' : 'bg-finance-500/70 group-hover:bg-finance-500'}`}
                                        />
                                    </div>
                                    {/* Expense Bar */}
                                    <div className="flex-1 h-full flex items-end">
                                        <div
                                            style={{ height: `${Math.max(expenseHeight, 4)}%` }}
                                            className={`w-full rounded-t transition-colors ${isSelected ? 'bg-danger' : 'bg-danger/70 group-hover:bg-danger'}`}
                                        />
                                    </div>
                                </div>
                                <Text variant={isSelected ? 'primary' : 'subtle'} size="xs" weight="bold">
                                    W{weekNum}
                                </Text>
                            </button>
                        );
                    })}
                </div>
            </VStack>

            {/* Compact Legend */}
            <HStack justify="center" gap="md" className="mt-3">
                <HStack gap="xs" align="center">
                    <div className="w-2 h-2 bg-finance-500 rounded-sm" />
                    <Text variant="subtle" size="xs" weight="bold">Income</Text>
                </HStack>
                <HStack gap="xs" align="center">
                    <div className="w-2 h-2 bg-danger rounded-sm" />
                    <Text variant="subtle" size="xs" weight="bold">Expenses</Text>
                </HStack>
            </HStack>
        </div>
    );
};

