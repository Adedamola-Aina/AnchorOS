/**
 * SpendingTrendsChart - 30-day spending trends visualization
 * 
 * CLAUDE.md Design Philosophy:
 * - Clarity over cleverness: Clear income vs expense comparison
 * - Quiet over loud: Minimal visual noise
 * - Useful over impressive: Actionable insights at a glance
 */

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import type { Currency } from '../../../types';

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
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    30 Day Summary
                </h3>
                {selectedWeekStart && (
                    <button
                        onClick={() => onSelectWeek(null)}
                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">In</span>
                    </div>
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatCurrency(totals.income, currency)}
                    </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <ArrowDownRight className="w-3 h-3 text-rose-500" />
                        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase">Out</span>
                    </div>
                    <p className="font-bold text-sm text-rose-600 dark:text-rose-400 tabular-nums">
                        {formatCurrency(totals.expense, currency)}
                    </p>
                </div>
                <div className={`text-center p-3 rounded-xl ${net >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        {net >= 0 ? <TrendingUp className="w-3 h-3 text-blue-500" /> : <TrendingDown className="w-3 h-3 text-amber-500" />}
                        <span className={`text-[9px] font-bold uppercase ${net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>Net</span>
                    </div>
                    <p className={`font-bold text-sm tabular-nums ${net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {net > 0 ? '+' : ''}{formatCurrency(net, currency)}
                    </p>
                </div>
            </div>

            {/* Compact Weekly Chart */}
            <div className="h-24 flex items-end gap-1">
                {weeklyData.map((d, i) => {
                    const isSelected = selectedWeekStart && d.weekStart.getTime() === selectedWeekStart.getTime();
                    const isDimmed = selectedWeekStart && !isSelected;
                    const incomeHeight = (d.income / maxAmount) * 100;
                    const expenseHeight = (d.expense / maxAmount) * 100;

                    return (
                        <button
                            key={i}
                            onClick={() => onSelectWeek(isSelected ? null : d.weekStart)}
                            className={`flex-1 flex flex-col items-center gap-1 group transition-all ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                            title={`Week of ${d.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                        >
                            <div className="w-full flex gap-0.5 items-end h-16">
                                {/* Income Bar */}
                                <div className="flex-1 h-full flex items-end">
                                    <div
                                        style={{ height: `${Math.max(incomeHeight, 4)}%` }}
                                        className={`w-full rounded-t transition-colors ${isSelected ? 'bg-emerald-400' : 'bg-emerald-500/70 group-hover:bg-emerald-500'}`}
                                    />
                                </div>
                                {/* Expense Bar */}
                                <div className="flex-1 h-full flex items-end">
                                    <div
                                        style={{ height: `${Math.max(expenseHeight, 4)}%` }}
                                        className={`w-full rounded-t transition-colors ${isSelected ? 'bg-rose-400' : 'bg-rose-500/70 group-hover:bg-rose-500'}`}
                                    />
                                </div>
                            </div>
                            <span className={`text-[8px] font-bold ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                                {d.weekStart.toLocaleDateString('en-US', { day: 'numeric' })}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Compact Legend */}
            <div className="flex justify-center gap-4 mt-3 text-[9px] font-bold text-slate-400">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
                    <span>Income</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-rose-500 rounded-sm" />
                    <span>Expenses</span>
                </div>
            </div>
        </div>
    );
};
