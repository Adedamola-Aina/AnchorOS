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
 *
 * Named: today | yesterday | this_week | last_week | this_month | last_month | this_year | last_year
 * Dynamic: month_YYYY_MM | last_N_months | last_N_weeks | last_N_days | year_YYYY
 *
 * Defaults to this_month for unknown/undefined values.
 */
export function getDateRange(timePeriod: string | undefined, now: Date): DateRange {
  const end = new Date(now);
  const start = new Date(now);

  if (timePeriod === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'yesterday') {
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - 1);
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

  if (timePeriod === 'this_year') {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(11, 31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'last_year') {
    start.setFullYear(start.getFullYear() - 1, 0, 1);
    start.setHours(0, 0, 0, 0);
    end.setFullYear(start.getFullYear(), 11, 31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // month_YYYY_MM — specific calendar month
  if (timePeriod?.startsWith('month_')) {
    const parts = timePeriod.split('_');
    const year = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; // 0-indexed
    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      start.setFullYear(year, month, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(year, month + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  // year_YYYY — full calendar year
  if (timePeriod?.startsWith('year_')) {
    const year = parseInt(timePeriod.slice(5), 10);
    if (!Number.isNaN(year)) {
      start.setFullYear(year, 0, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(year, 11, 31);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  // last_N_months
  if (timePeriod?.startsWith('last_') && timePeriod.endsWith('_months')) {
    const n = parseInt(timePeriod.split('_')[1], 10);
    if (!Number.isNaN(n)) {
      start.setMonth(start.getMonth() - n, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  // last_N_weeks
  if (timePeriod?.startsWith('last_') && timePeriod.endsWith('_weeks')) {
    const n = parseInt(timePeriod.split('_')[1], 10);
    if (!Number.isNaN(n)) {
      start.setDate(start.getDate() - n * 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  // last_N_days
  if (timePeriod?.startsWith('last_') && timePeriod.endsWith('_days')) {
    const n = parseInt(timePeriod.split('_')[1], 10);
    if (!Number.isNaN(n)) {
      start.setDate(start.getDate() - n);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
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

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Convert an internal time period key to a human-readable label.
 * e.g. "month_2026_01" → "January 2026", "last_3_months" → "the last 3 months"
 */
export function formatPeriodLabel(timePeriod: string | undefined): string {
  if (!timePeriod) return 'this month';
  if (timePeriod === 'today') return 'today';
  if (timePeriod === 'yesterday') return 'yesterday';
  if (timePeriod === 'this_week') return 'this week';
  if (timePeriod === 'last_week') return 'last week';
  if (timePeriod === 'this_month') return 'this month';
  if (timePeriod === 'last_month') return 'last month';
  if (timePeriod === 'this_year') return 'this year';
  if (timePeriod === 'last_year') return 'last year';

  if (timePeriod.startsWith('month_')) {
    const parts = timePeriod.split('_');
    const monthName = MONTH_NAMES[parseInt(parts[2], 10) - 1] ?? '';
    return `${monthName} ${parts[1]}`;
  }
  if (timePeriod.startsWith('year_')) return timePeriod.slice(5);

  if (timePeriod.startsWith('last_') && timePeriod.endsWith('_months')) {
    return `the last ${timePeriod.split('_')[1]} months`;
  }
  if (timePeriod.startsWith('last_') && timePeriod.endsWith('_weeks')) {
    return `the last ${timePeriod.split('_')[1]} weeks`;
  }
  if (timePeriod.startsWith('last_') && timePeriod.endsWith('_days')) {
    return `the last ${timePeriod.split('_')[1]} days`;
  }

  return timePeriod.replace(/_/g, ' ');
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
