// @ts-nocheck
import React, { useMemo } from 'react';
import { TrendingDown, TrendingUp, Target, PieChart } from 'lucide-react';
import { formatCurrencyCompact } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import { getSpendingTrend, detectAnomalies } from '../../utils/insights/transactionInsights';
import { InsightCards } from './components/InsightCards';
import type { AnchorTransaction, Currency } from '../../types';

interface MonthlyInsightProps {
    transactions: AnchorTransaction[];
    currency: Currency;
}

export const MonthlyInsight: React.FC<MonthlyInsightProps> = ({ transactions, currency }) => {
    const summary = useMemo(() => {
        let income = 0;
        let expense = 0;
        const categories: Record<string, number> = {};

        // BUG-037 Fix: Helper to detect transfers (have linkId or category is Transfer)
        const isTransfer = (tx: AnchorTransaction): boolean => {
            return Boolean(tx.linkId) || tx.category?.toLowerCase() === 'transfer';
        };

        transactions.forEach(tx => {
            if (!tx || tx.isSoftDeleted) return;
            // BUG-037 Fix: Skip transfers from income/expense totals
            if (isTransfer(tx)) return;

            const amount = tx.amountCents || 0;
            if (tx.type === 'income') {
                income += amount;
            } else if (tx.type === 'expense') {
                expense += amount;
                const cat = tx.category || 'Other';
                categories[cat] = (categories[cat] || 0) + amount;
            }
        });

        const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
        const savings = income - expense;

        return {
            income,
            expense,
            topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
            savings
        };
    }, [transactions]);

    const trend = useMemo(() => getSpendingTrend(transactions), [transactions]);
    const anomalies = useMemo(() => detectAnomalies(transactions), [transactions]);

    if (transactions.length === 0) return null;

    // BUG-037 Fix: Handle floating point precision issues
    const isOverspending = Math.round(summary.savings) < 0;

    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Income</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                        {formatCurrencyCompact(fromCents(summary.income), currency)}
                    </p>
                </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4">
                <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-2xl text-rose-600">
                    <TrendingDown className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Spent</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                        {formatCurrencyCompact(fromCents(summary.expense), currency)}
                    </p>
                </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isOverspending
                    ? 'bg-rose-100 dark:bg-rose-900/20 text-rose-600'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                    }`}>
                    {isOverspending ? <TrendingDown className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                        {isOverspending ? 'Overspending' : 'Potential Savings'}
                    </p>
                    <p className={`text-lg font-bold tabular-nums truncate ${isOverspending ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                        }`}>
                        {formatCurrencyCompact(fromCents(Math.abs(summary.savings)), currency)}
                    </p>
                </div>
            </div>

            {summary.topCategory && (
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-2xl text-primary-600">
                        <PieChart className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 truncate">Top: {summary.topCategory.name}</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                            {formatCurrencyCompact(fromCents(summary.topCategory.amount), currency)}
                        </p>
                    </div>
                </div>
            )}
        </div>
        <InsightCards trend={trend} anomalies={anomalies} currency={currency} />
        </>
    );
};
