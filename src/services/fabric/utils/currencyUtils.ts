import type { AnchorTransaction } from '../../../types';

export type Currency = 'NGN' | 'USD';

/**
 * Format an integer cent amount as a human-readable currency string.
 * Respects the user's currency (₦ for NGN, $ for USD).
 */
export function formatCents(cents: number, currency: Currency = 'USD'): string {
  const amount = cents / 100;
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Detect the user's primary currency from their transaction history.
 * Falls back to USD if no transactions exist.
 */
export function detectPrimaryCurrency(transactions: AnchorTransaction[]): Currency {
  const first = transactions.find((tx) => tx.currency === 'NGN' || tx.currency === 'USD');
  return (first?.currency as Currency) ?? 'USD';
}

/**
 * Aggregate transaction amounts by category into a { category → totalCents } map.
 * Falls back to 'General' for transactions with no category set.
 */
export function sumByCategory(transactions: AnchorTransaction[]): Record<string, number> {
  return transactions.reduce<Record<string, number>>((acc, tx) => {
    const key = tx.category || 'General';
    acc[key] = (acc[key] || 0) + tx.amountCents;
    return acc;
  }, {});
}
