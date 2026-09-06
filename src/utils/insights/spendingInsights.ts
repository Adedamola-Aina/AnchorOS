import type { AnchorTransaction } from '../../types';

interface SpendingTrend {
    direction: 'up' | 'down' | 'flat';
    percentChange: number;
    currentMonthCents: number;
    previousMonthCents: number;
}

interface SourceBreakdown {
    manualCents: number;
    syncedCents: number;
    totalCents: number;
    syncedPercent: number;
    hasBankData: boolean;
}

const FLAT_THRESHOLD = 5;

function isTransfer(tx: AnchorTransaction): boolean {
    return Boolean(tx.linkId) || tx.category?.toLowerCase() === 'transfer';
}

export function isExpense(tx: AnchorTransaction): boolean {
    return tx.type === 'expense' && !tx.isSoftDeleted && !isTransfer(tx);
}

export function getMonthKey(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Calculates month-over-month spending trend comparing the two most recent months.
 */
export function getSpendingTrend(txns: AnchorTransaction[]): SpendingTrend {
    const flat: SpendingTrend = { direction: 'flat', percentChange: 0, currentMonthCents: 0, previousMonthCents: 0 };
    const expenses = txns.filter(isExpense);
    if (expenses.length === 0) return flat;

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

/**
 * Splits expense spending by source: manual (cash) vs synced (bank).
 */
export function getSourceBreakdown(txns: AnchorTransaction[]): SourceBreakdown {
    const empty: SourceBreakdown = { manualCents: 0, syncedCents: 0, totalCents: 0, syncedPercent: 0, hasBankData: false };
    const expenses = txns.filter(isExpense);
    if (expenses.length === 0) return empty;

    let manualCents = 0;
    let syncedCents = 0;

    for (const tx of expenses) {
        if (tx.source === 'synced') {
            syncedCents += tx.amountCents;
        } else {
            manualCents += tx.amountCents;
        }
    }

    const totalCents = manualCents + syncedCents;
    return {
        manualCents,
        syncedCents,
        totalCents,
        syncedPercent: totalCents > 0 ? Math.round((syncedCents / totalCents) * 10000) / 100 : 0,
        hasBankData: syncedCents > 0,
    };
}
