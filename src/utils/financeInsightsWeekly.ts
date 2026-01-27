/**
 * Finance Insights - Weekly & Recurring Analysis
 * Extracted from financeInsights.ts per CLAUDE.md §3.2
 */

import type { AnchorTransaction } from '../types';
import { fromCents } from './moneyUtils';

export interface WeeklySpendingData { label: string; income: number; expense: number; net: number; weekStart: Date; }
export interface RecurringTransactionGroup { id: string; title: string; amountCents: number; frequency: 'monthly' | 'weekly' | 'irregular'; lastDate: string; count: number; avgGapDays: number; }

const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

const formatDateLabel = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const getWeeklySpending = (transactions: AnchorTransaction[]): WeeklySpendingData[] => {
    const weeks: WeeklySpendingData[] = [];
    const today = new Date();
    const currentWeekStart = getStartOfWeek(today);

    for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(currentWeekStart);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekTxs = transactions.filter(t => {
            if (!t || !t.date) return false;
            const date = new Date(t.date);
            return date >= weekStart && date <= weekEnd;
        });

        const income = weekTxs.filter(t => t && t.type === 'income').reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0);
        const expense = weekTxs.filter(t => t && t.type === 'expense').reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0);
        weeks.push({ label: i === 0 ? 'This Week' : formatDateLabel(weekStart), income, expense, net: income - expense, weekStart });
    }
    return weeks;
};

export const detectRecurring = (transactions: AnchorTransaction[]): RecurringTransactionGroup[] => {
    const groups: Record<string, AnchorTransaction[]> = {};
    transactions.forEach(t => {
        if (!t || t.type !== 'expense' || !t.title) return;
        const key = `${t.title.trim().toLowerCase()}-${t.amountCents || 0}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(t);
    });

    const recurring: RecurringTransactionGroup[] = [];
    Object.values(groups).forEach(group => {
        if (group.length < 2) return;
        const sorted = group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let gapSum = 0;
        for (let i = 0; i < sorted.length - 1; i++) {
            const d1 = new Date(sorted[i].date).getTime();
            const d2 = new Date(sorted[i + 1].date).getTime();
            gapSum += (d1 - d2) / (1000 * 3600 * 24);
        }
        const avgGap = gapSum / (sorted.length - 1);
        let frequency: 'monthly' | 'weekly' | 'irregular' = 'irregular';
        if (avgGap >= 26 && avgGap <= 32) frequency = 'monthly';
        else if (avgGap >= 6 && avgGap <= 8) frequency = 'weekly';

        if (frequency !== 'irregular') {
            recurring.push({ id: sorted[0].id, title: sorted[0].title, amountCents: sorted[0].amountCents || 0, frequency, lastDate: sorted[0].date as string, count: group.length, avgGapDays: avgGap });
        }
    });
    return recurring.sort((a, b) => (b.amountCents || 0) - (a.amountCents || 0));
};
