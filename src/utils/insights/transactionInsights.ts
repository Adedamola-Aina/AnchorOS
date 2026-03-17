import type { AnchorTransaction } from '../../types';
import { isExpense, getMonthKey } from './spendingInsights';

export type { SpendingTrend, SourceBreakdown } from './spendingInsights';
export { getSpendingTrend, getSourceBreakdown } from './spendingInsights';

interface CategoryAverage {
    category: string;
    averageCents: number;
    totalCents: number;
    monthCount: number;
}

interface Anomaly {
    id: string;
    title: string;
    category: string;
    amountCents: number;
    averageCents: number;
    date: string;
}

const ANOMALY_THRESHOLD = 2.0;

/**
 * Calculates average monthly spending per category.
 */
export function getMonthlyAverages(txns: AnchorTransaction[]): CategoryAverage[] {
    const expenses = txns.filter(isExpense);
    if (expenses.length === 0) return [];

    const months = new Set<string>();
    const categoryTotals: Record<string, number> = {};

    for (const tx of expenses) {
        const monthKey = getMonthKey(tx.date);
        months.add(monthKey);
        const cat = tx.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amountCents;
    }

    const monthCount = Math.max(months.size, 1);

    return Object.entries(categoryTotals)
        .map(([category, totalCents]) => ({
            category,
            totalCents,
            averageCents: Math.round(totalCents / monthCount),
            monthCount,
        }))
        .sort((a, b) => b.averageCents - a.averageCents);
}

/**
 * Detects transactions that are significantly above their category average.
 * Flags any single transaction > ANOMALY_THRESHOLD × category average per-transaction amount.
 */
export function detectAnomalies(txns: AnchorTransaction[]): Anomaly[] {
    const expenses = txns.filter(isExpense);
    if (expenses.length === 0) return [];

    // Group by category and calculate per-transaction average
    const categoryGroups: Record<string, AnchorTransaction[]> = {};
    for (const tx of expenses) {
        const cat = tx.category || 'Other';
        if (!categoryGroups[cat]) categoryGroups[cat] = [];
        categoryGroups[cat].push(tx);
    }

    const anomalies: Anomaly[] = [];

    for (const [category, group] of Object.entries(categoryGroups)) {
        if (group.length < 3) continue; // Need enough data

        const total = group.reduce((sum, tx) => sum + tx.amountCents, 0);
        const avg = total / group.length;

        for (const tx of group) {
            if (tx.amountCents > avg * ANOMALY_THRESHOLD) {
                anomalies.push({
                    id: tx.id,
                    title: tx.title,
                    category,
                    amountCents: tx.amountCents,
                    averageCents: Math.round(avg),
                    date: typeof tx.date === 'string' ? tx.date : tx.date.toISOString(),
                });
            }
        }
    }

    return anomalies.sort((a, b) => b.amountCents - a.amountCents);
}
