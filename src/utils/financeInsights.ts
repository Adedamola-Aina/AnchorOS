/**
 * Finance Insights Utility Module
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Weekly/recurring analysis extracted to financeInsightsWeekly.ts
 */

import type { AnchorTransaction } from '../types';
import { fromCents } from './moneyUtils';

// Re-export from extracted module
export { getWeeklySpending, detectRecurring } from './financeInsightsWeekly';

export interface AssetClass { id: string; name: string; amount: number; percent: number; currency: string; type?: string; }
interface CashFlowAnalysis { income: number; expense: number; net: number; prevNet: number; trend: 'better' | 'worse' | 'neutral'; diffPercent: number; }

export const getCashFlowAnalysis = (transactions: AnchorTransaction[]): CashFlowAnalysis => {
    const today = new Date();
    const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(today.getDate() - 7);
    const fourteenDaysAgo = new Date(today); fourteenDaysAgo.setDate(today.getDate() - 14);

    let currentIncome = 0, currentExpense = 0, prevIncome = 0, prevExpense = 0;

    transactions.forEach(t => {
        if (!t || !t.date || t.isSoftDeleted) return;
        const d = new Date(t.date);
        const amount = fromCents(t.amountCents || 0);

        if (d >= sevenDaysAgo && d <= today) {
            if (t.type === 'income') currentIncome += amount;
            if (t.type === 'expense') currentExpense += amount;
        } else if (d >= fourteenDaysAgo && d < sevenDaysAgo) {
            if (t.type === 'income') prevIncome += amount;
            if (t.type === 'expense') prevExpense += amount;
        }
    });

    const currentNet = currentIncome - currentExpense;
    const prevNet = prevIncome - prevExpense;
    let trend: 'better' | 'worse' | 'neutral' = 'neutral';
    if (currentNet > prevNet) trend = 'better';
    else if (currentNet < prevNet) trend = 'worse';
    const diffPercent = prevNet !== 0 ? ((currentNet - prevNet) / Math.abs(prevNet)) * 100 : 0;

    return { income: currentIncome, expense: currentExpense, net: currentNet, prevNet, trend, diffPercent };
};

export const getAssetDistribution = (accounts: import('../types').AnchorAccount[]): AssetClass[] => {
    const active = accounts.filter(a => !a.isArchived);
    const total = active.reduce((sum, a) => sum + fromCents(a.balanceCents), 0);
    if (total === 0) return [];
    return active.map(a => ({ id: a.id, name: a.name, amount: fromCents(a.balanceCents), percent: (fromCents(a.balanceCents) / total) * 100, currency: a.currency, type: a.type })).sort((a, b) => b.amount - a.amount);
};
