/**
 * Finance Insights - Weekly & Recurring Analysis
 * Extracted from financeInsights.ts per CLAUDE.md §3.2
 */

import type { AnchorTransaction } from '../types';
import { fromCents } from './moneyUtils';

interface WeeklySpendingData { label: string; income: number; expense: number; net: number; weekStart: Date; }
interface RecurringTransactionGroup { id: string; title: string; amountCents: number; frequency: 'monthly' | 'weekly' | 'irregular'; lastDate: string; count: number; avgGapDays: number; }

const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

const formatDateLabel = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/**
 * F-015: Updated to accept optional month reference date.
 * When viewing past months, uses that month's date range instead of today.
 * Now shows full month weeks, not just 4 weeks from today.
 */
export const getWeeklySpending = (transactions: AnchorTransaction[], referenceDate?: Date): WeeklySpendingData[] => {
    const weeks: WeeklySpendingData[] = [];
    const ref = referenceDate || new Date();
    
    // Use start and end of the reference month
    const monthStart = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const monthEnd = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Generate weeks that cover the month
    let weekStart = getStartOfWeek(monthStart);
    const today = new Date();
    
    while (weekStart <= monthEnd) {
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
        
        const isCurrentWeek = today >= weekStart && today <= weekEnd;
        const label = isCurrentWeek && !referenceDate ? 'This Week' : formatDateLabel(weekStart);
        
        weeks.push({ label, income, expense, net: income - expense, weekStart: new Date(weekStart) });
        
        weekStart = new Date(weekStart);
        weekStart.setDate(weekStart.getDate() + 7);
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
