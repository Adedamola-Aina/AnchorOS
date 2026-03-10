import type { AnchorTransaction } from '../../types';

/** Safely parse a Date | string | undefined into a Date, or null on failure. */
export function toDate(value: Date | string | undefined | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value as string | Date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

/** Returns true if the value falls within [start, end] inclusive. */
export function withinRange(value: Date | string | undefined | null, start: Date, end: Date): boolean {
  const parsed = toDate(value);
  if (!parsed) return false;
  return parsed >= start && parsed <= end;
}

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

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Compute a date range for a named time period relative to `now`.
 * Supports: today, this_week, last_week, this_month, last_month.
 * Defaults to this_month for unknown or undefined values.
 */
export function getDateRange(timePeriod: string | undefined, now: Date): DateRange {
  const end = new Date(now);
  const start = new Date(now);

  if (timePeriod === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'this_week' || timePeriod === 'last_week') {
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset + (timePeriod === 'last_week' ? -7 : 0));
    start.setHours(0, 0, 0, 0);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // this_month (default) or last_month
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  if (timePeriod === 'last_month') {
    start.setMonth(start.getMonth() - 1);
  }
  end.setFullYear(start.getFullYear(), start.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/** Return the start of the previous 7-day window before `weekStart`. */
export function previousWeekRange(weekStart: Date, weekEnd: Date): DateRange {
  const start = new Date(weekStart);
  start.setDate(start.getDate() - 7);
  const end = new Date(weekEnd);
  end.setDate(end.getDate() - 7);
  return { start, end };
}

/** Return ISO month key like "2026-03" for a given date. */
export function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
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
