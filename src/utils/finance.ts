/**
 * Finance Utility Functions
 * Separates business logic from view components
 */

import type { AnchorTransaction, AnchorAccount } from '../types';
import { fromCents } from './moneyUtils';

interface ChartDataItem {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Groups small values (< threshold %) into an "Other" category
 * Prevents chart legend clutter
 */
export function groupSmallValues(
    data: ChartDataItem[],
    threshold: number = 0.05
): ChartDataItem[] {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return data;

    const significant: ChartDataItem[] = [];
    let otherValue = 0;

    data.forEach(item => {
        const percentage = item.value / total;
        if (percentage >= threshold) {
            significant.push(item);
        } else {
            otherValue += item.value;
        }
    });

    if (otherValue > 0) {
        significant.push({
            name: 'Other',
            value: otherValue,
            color: '#94a3b8' // slate-400
        });
    }

    return significant;
}

/**
 * Smart category suggestion based on transaction history
 * Queries recent transactions to auto-suggest category
 */
export function suggestCategory(
    description: string,
    recentTransactions: AnchorTransaction[],
    limit: number = 50
): string | null {
    if (!description || description.length < 2) return null;

    const searchTerm = description.toLowerCase().trim();
    const recent = recentTransactions.slice(0, limit);

    // Find matching transaction by title
    const match = recent.find(tx =>
        tx.title.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(tx.title.toLowerCase())
    );

    return match?.category || null;
}

/**
 * Calculate net worth from accounts
 * Separates by currency
 */
export function calculateNetWorth(accounts: AnchorAccount[]): {
    NGN: number;
    USD: number;
    total: { amount: number; currency: 'NGN' };
} {
    const NGN_Cents = accounts
        .filter(acc => acc.currency === 'NGN')
        .reduce((sum, acc) => sum + acc.balanceCents, 0);

    const USD_Cents = accounts
        .filter(acc => acc.currency === 'USD')
        .reduce((sum, acc) => sum + acc.balanceCents, 0);

    // Convert to display decimals only at the very end
    const NGN = fromCents(NGN_Cents);
    const USD = fromCents(USD_Cents);

    return {
        NGN,
        USD,
        total: { amount: NGN, currency: 'NGN' }
    };
}

/**
 * Get transaction label based on type
 */
export function getTransactionLabel(type: 'income' | 'expense' | 'transfer'): {
    header: string;
    accountLabel: string;
} {
    switch (type) {
        case 'income':
            return { header: 'Record Income', accountLabel: 'DEPOSIT TO' };
        case 'expense':
            return { header: 'Record Expense', accountLabel: 'SPEND FROM' };
        case 'transfer':
            return { header: 'Record Transfer', accountLabel: 'TRANSFER FROM' };
    }
}

/**
 * Calculate cash flow summary for a time period
 */
export function calculateCashFlow(
    transactions: AnchorTransaction[],
    days: number = 30
): { income: number; expense: number; net: number } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= cutoff;
    });

    const incomeCents = filtered
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amountCents, 0);

    const expenseCents = filtered
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amountCents, 0);

    const income = fromCents(incomeCents);
    const expense = fromCents(expenseCents);

    return {
        income,
        expense,
        net: income - expense
    };
}

/**
 * Deduplicate account names for chart labels
 */
export function deduplicateLabels(data: ChartDataItem[]): ChartDataItem[] {
    const nameCount: Record<string, number> = {};

    return data.map(item => {
        if (nameCount[item.name]) {
            nameCount[item.name]++;
            return { ...item, name: `${item.name} (${nameCount[item.name]})` };
        }
        nameCount[item.name] = 1;
        return item;
    });
}
