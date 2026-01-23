import type { AnchorTransaction } from '../types';
import { fromCents } from './moneyUtils';

export interface WeeklySpendingData {
    label: string;
    income: number;
    expense: number;
    net: number;
    weekStart: Date;
}

export interface RecurringTransactionGroup {
    id: string;
    title: string;
    amountCents: number;
    frequency: 'monthly' | 'weekly' | 'irregular';
    lastDate: string;
    count: number;
    avgGapDays: number;
}

export interface AssetClass {
    id: string;
    name: string;
    amount: number;
    percent: number;
    currency: string;
    type?: string;
}

// Helper to get start of week (Monday)
const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

// Helper to format date label
const formatDateLabel = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Aggregates transactions into weekly buckets for the last 4 weeks.
 */
export const getWeeklySpending = (transactions: AnchorTransaction[]): WeeklySpendingData[] => {
    const weeks: WeeklySpendingData[] = [];
    const today = new Date();

    // Align today to start of week (Monday)
    const currentWeekStart = getStartOfWeek(today);

    // Generate last 4 weeks (including current)
    for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(currentWeekStart);
        weekStart.setDate(weekStart.getDate() - (i * 7));

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // Filter transactions for this week (with null checks)
        const weekTxs = transactions.filter(t => {
            if (!t || !t.date) return false;
            const date = new Date(t.date);
            return date >= weekStart && date <= weekEnd;
        });

        const income = weekTxs
            .filter(t => t && t.type === 'income')
            .reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0);

        const expense = weekTxs
            .filter(t => t && t.type === 'expense')
            .reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0);

        weeks.push({
            label: i === 0 ? 'This Week' : formatDateLabel(weekStart),
            income,
            expense,
            net: income - expense,
            weekStart
        });
    }

    return weeks;
};

/**
 * Detects potential recurring transactions (subscriptions) based on simple heuristics:
 * - Same title (fuzzy match or exact)
 * - Same amount
 * - At least 2 occurrences
 */
export const detectRecurring = (transactions: AnchorTransaction[]): RecurringTransactionGroup[] => {
    const groups: Record<string, AnchorTransaction[]> = {};

    // Group by "Title + Amount" signature (with null checks)
    transactions.forEach(t => {
        if (!t || t.type !== 'expense' || !t.title) return; // Only expenses with valid title
        const key = `${t.title.trim().toLowerCase()}-${t.amountCents || 0}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(t);
    });

    const recurring: RecurringTransactionGroup[] = [];

    Object.values(groups).forEach(group => {
        if (group.length < 2) return;

        // improved heuristic: check dates
        // sort by date desc
        const sorted = group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Calculate gaps
        let gapSum = 0;
        const gaps = [];
        for (let i = 0; i < sorted.length - 1; i++) {
            const d1 = new Date(sorted[i].date).getTime();
            const d2 = new Date(sorted[i + 1].date).getTime();
            const diffDays = (d1 - d2) / (1000 * 3600 * 24);
            gaps.push(diffDays);
            gapSum += diffDays;
        }

        const avgGap = gapSum / gaps.length;

        // Frequency detection thresholds (days)
        const MONTHLY_MIN_DAYS = 26;
        const MONTHLY_MAX_DAYS = 32;
        const WEEKLY_MIN_DAYS = 6;
        const WEEKLY_MAX_DAYS = 8;

        // Determine frequency
        let frequency: 'monthly' | 'weekly' | 'irregular' = 'irregular';
        if (avgGap >= MONTHLY_MIN_DAYS && avgGap <= MONTHLY_MAX_DAYS) frequency = 'monthly';
        else if (avgGap >= WEEKLY_MIN_DAYS && avgGap <= WEEKLY_MAX_DAYS) frequency = 'weekly';

        if (frequency !== 'irregular') {
            recurring.push({
                id: sorted[0].id, // Use latest ID as representative
                title: sorted[0].title,
                amountCents: sorted[0].amountCents,
                frequency,
                lastDate: sorted[0].date as string,
                count: group.length,
                avgGapDays: avgGap
            });
        }
    });

    return recurring.sort((a, b) => b.amountCents - a.amountCents);
};

export interface CashFlowAnalysis {
    income: number;
    expense: number;
    net: number;
    prevNet: number;
    trend: 'better' | 'worse' | 'neutral';
    diffPercent: number;
}

export const getCashFlowAnalysis = (transactions: AnchorTransaction[]): CashFlowAnalysis => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    let currentIncome = 0;
    let currentExpense = 0;
    let prevIncome = 0;
    let prevExpense = 0;

    transactions.forEach(t => {
        if (!t.date || t.isSoftDeleted) return;
        const d = new Date(t.date);
        const amount = fromCents(t.amountCents);

        // Current 7 Days (Inclusive of today, exclusive of 7 days ago boundary roughly)
        // Simplification: strict timestamp comparison
        if (d >= sevenDaysAgo && d <= today) {
            if (t.type === 'income') currentIncome += amount;
            if (t.type === 'expense') currentExpense += amount;
        }
        // Previous 7 Days
        else if (d >= fourteenDaysAgo && d < sevenDaysAgo) {
            if (t.type === 'income') prevIncome += amount;
            if (t.type === 'expense') prevExpense += amount;
        }
    });

    const currentNet = currentIncome - currentExpense;
    const prevNet = prevIncome - prevExpense;

    // Trend logic: Better if Net is higher than prevNet
    let trend: 'better' | 'worse' | 'neutral' = 'neutral';
    if (currentNet > prevNet) trend = 'better';
    else if (currentNet < prevNet) trend = 'worse';

    const diffPercent = prevNet !== 0 ? ((currentNet - prevNet) / Math.abs(prevNet)) * 100 : 0;

    return {
        income: currentIncome,
        expense: currentExpense,
        net: currentNet,
        prevNet,
        trend,
        diffPercent
    };
};

export const getAssetDistribution = (accounts: import('../types').AnchorAccount[]): AssetClass[] => {
    const total = accounts.reduce((sum, a) => sum + fromCents(a.balanceCents), 0);
    if (total === 0) return [];

    return accounts.map(a => ({
        id: a.id,
        name: a.name,
        amount: fromCents(a.balanceCents),
        percent: (fromCents(a.balanceCents) / total) * 100,
        currency: a.currency,
        type: a.type
    })).sort((a, b) => b.amount - a.amount);
};
