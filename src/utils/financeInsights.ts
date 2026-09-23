/**
 * Finance Insights Utility Module
 * 
 * Refactored.
 * Weekly/recurring analysis extracted to financeInsightsWeekly.ts
 */

import type { AnchorTransaction } from '../types';
import { fromCents } from './moneyUtils';

// Re-export from extracted module
export { getWeeklySpending, detectRecurring } from './financeInsightsWeekly';

export interface AssetClass { id: string; name: string; amount: number; percent: number; currency: string; type?: string; }

/** A portfolio total for exactly ONE currency (see `getPortfolioTotals`). */
export interface CurrencyTotal { currency: string; total: number; accountCount: number }
interface CashFlowAnalysis {
    income: number;
    expense: number;
    net: number;
    prevNet: number;
    trend: 'better' | 'worse' | 'neutral';
    diffPercent: number;
    /**
     * Movement between the user's own accounts, reported separately and
     * deliberately NOT counted as income or expense (see `isTransferLeg`).
     */
    transferIn: number;
    transferOut: number;
}

/**
 * True when a transaction document is one leg of a transfer between the user's
 * own accounts.
 *
 * The ledger stores a transfer as TWO documents
 * (`services/TransferOperations.processTransferTransaction`): an `expense` leg on
 * the source account and an `income` leg on the destination account, both tagged
 * `category: 'Transfer'` and linked by `linkId` / `linkedTransactionId`. The
 * form's `type: 'transfer'` is an *intent*, never a stored value, so a naive
 * `type === 'income' | 'expense'` reading of the ledger double-counts internal
 * movement as economic income AND expense — the portfolio-inflation defect in
 * spec §10. Classifying the legs here fixes the presentation without touching the
 * ledger: the paired documents, balances and links stay exactly as written.
 */
export const isTransferLeg = (
    t: Pick<AnchorTransaction, 'type' | 'category' | 'linkId'> | null | undefined,
): boolean => {
    if (!t) return false;
    return t.type === 'transfer' || t.category === 'Transfer' || Boolean(t.linkId);
};

/**
 * Cash flow for a window of transactions, with internal transfers excluded.
 *
 * `income` / `expense` / `net` describe *economic* flow only. Money moved between
 * two accounts the user owns changes where the money is, not how much there is,
 * so it is reported as `transferIn` / `transferOut` and left out of the totals.
 */
export const getCashFlowAnalysis = (transactions: AnchorTransaction[]): CashFlowAnalysis => {
    const today = new Date();
    const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(today.getDate() - 7);
    const fourteenDaysAgo = new Date(today); fourteenDaysAgo.setDate(today.getDate() - 14);

    let currentIncome = 0, currentExpense = 0, prevIncome = 0, prevExpense = 0;
    let transferIn = 0, transferOut = 0;

    transactions.forEach(t => {
        if (!t || !t.date || t.isSoftDeleted) return;
        const d = new Date(t.date);
        const amount = fromCents(t.amountCents || 0);
        const isCurrentWindow = d >= sevenDaysAgo && d <= today;
        const isPreviousWindow = d >= fourteenDaysAgo && d < sevenDaysAgo;
        if (!isCurrentWindow && !isPreviousWindow) return;

        // Internal transfer legs are movement, not economic flow (spec §10).
        if (isTransferLeg(t)) {
            if (isCurrentWindow) {
                if (t.type === 'income') transferIn += amount;
                else if (t.type === 'expense') transferOut += amount;
            }
            return;
        }

        if (isCurrentWindow) {
            if (t.type === 'income') currentIncome += amount;
            if (t.type === 'expense') currentExpense += amount;
        } else {
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

    return { income: currentIncome, expense: currentExpense, net: currentNet, prevNet, trend, diffPercent, transferIn, transferOut };
};

/**
 * Per-currency portfolio totals (DB-03).
 *
 * Balances are stored in minor units, and ₦ kobo cannot be added to $ cents, so
 * a single cross-currency total is not a number this product is allowed to print
 * (UX-FN-02: mixed-currency totals must never be concatenated into one headline
 * figure). Each currency therefore gets its own total, and the caller decides how
 * to present more than one.
 */
export const getPortfolioTotals = (accounts: import('../types').AnchorAccount[]): CurrencyTotal[] => {
    const byCurrency = new Map<string, CurrencyTotal>();
    accounts
        .filter(a => !a.isArchived)
        .forEach(a => {
            const entry = byCurrency.get(a.currency) ?? { currency: a.currency, total: 0, accountCount: 0 };
            entry.total += fromCents(a.balanceCents);
            entry.accountCount += 1;
            byCurrency.set(a.currency, entry);
        });
    return [...byCurrency.values()].sort((a, b) => b.total - a.total);
};

/**
 * Asset shares, with `percent` computed WITHIN each currency (DB-02).
 *
 * The previous version summed every balance into one denominator, so in a
 * mixed-currency portfolio an NGN balance was divided by a total that included
 * USD cents — a share that meant nothing. Shares are now relative to their own
 * currency, which is the only comparison that is arithmetically true.
 *
 * Behaviour preserved: a portfolio whose totals are all zero has no distribution
 * to show and returns [].
 */
export const getAssetDistribution = (accounts: import('../types').AnchorAccount[]): AssetClass[] => {
    const active = accounts.filter(a => !a.isArchived);
    const totalsByCurrency = new Map<string, number>();
    active.forEach(a => {
        totalsByCurrency.set(a.currency, (totalsByCurrency.get(a.currency) ?? 0) + fromCents(a.balanceCents));
    });
    if ([...totalsByCurrency.values()].every(total => total === 0)) return [];

    return active
        .map(a => {
            const amount = fromCents(a.balanceCents);
            const currencyTotal = totalsByCurrency.get(a.currency) ?? 0;
            return {
                id: a.id,
                name: a.name,
                amount,
                percent: currencyTotal > 0 ? (amount / currencyTotal) * 100 : 0,
                currency: a.currency,
                type: a.type,
            };
        })
        .sort((a, b) => b.amount - a.amount);
};
