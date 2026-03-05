import type { AnchorTransaction } from '../../types';

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

interface SpendingTrend {
    direction: 'up' | 'down' | 'flat';
    percentChange: number;
    currentMonthCents: number;
    previousMonthCents: number;
}

const ANOMALY_THRESHOLD = 2.0;
const FLAT_THRESHOLD = 5;

function isTransfer(tx: AnchorTransaction): boolean {
    return Boolean(tx.linkId) || tx.category?.toLowerCase() === 'transfer';
}

function isExpense(tx: AnchorTransaction): boolean {
    return tx.type === 'expense' && !tx.isSoftDeleted && !isTransfer(tx);
}

function getMonthKey(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

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

/**
 * Calculates month-over-month spending trend comparing the two most recent months.
 */
export function getSpendingTrend(txns: AnchorTransaction[]): SpendingTrend {
    const flat: SpendingTrend = { direction: 'flat', percentChange: 0, currentMonthCents: 0, previousMonthCents: 0 };
    const expenses = txns.filter(isExpense);
    if (expenses.length === 0) return flat;

    // Group spending by month
    const monthTotals: Record<string, number> = {};
    for (const tx of expenses) {
        const key = getMonthKey(tx.date);
        monthTotals[key] = (monthTotals[key] || 0) + tx.amountCents;
    }

    const sortedMonths = Object.keys(monthTotals).sort();
    if (sortedMonths.length < 2) return flat;

    const currentMonth = sortedMonths[sortedMonths.length - 1];
    const previousMonth = sortedMonths[sortedMonths.length - 2];
    const current = monthTotals[currentMonth];
    const previous = monthTotals[previousMonth];

    if (previous === 0) return { ...flat, currentMonthCents: current };

    const pctChange = Math.abs(((current - previous) / previous) * 100);
    let direction: 'up' | 'down' | 'flat' = 'flat';

    if (pctChange > FLAT_THRESHOLD) {
        direction = current > previous ? 'up' : 'down';
    }

    return {
        direction,
        percentChange: Math.round(pctChange * 100) / 100,
        currentMonthCents: current,
        previousMonthCents: previous,
    };
}
