import type { AnchorTask, AnchorTransaction } from '../../types';

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

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export function getSpendingByDayOfWeek(
  transactions: AnchorTransaction[],
  now: Date,
): Record<number, number> {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 90);
  cutoff.setHours(0, 0, 0, 0);

  const expenses = transactions.filter(
    (tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, cutoff, now),
  );

  // Count distinct calendar dates per weekday in the 90-day window
  const weekdayCounts = new Map<number, Set<string>>();
  for (let d = new Date(cutoff); d <= now; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (!weekdayCounts.has(dow)) weekdayCounts.set(dow, new Set());
    weekdayCounts.get(dow)!.add(d.toISOString().slice(0, 10));
  }

  // Require at least 4 weeks of data
  const earliestExpense = expenses.reduce<Date | null>((min, tx) => {
    const d = toDate(tx.date);
    return d && (!min || d < min) ? d : min;
  }, null);
  if (!earliestExpense) return {};
  const dataSpanDays = Math.round((now.getTime() - earliestExpense.getTime()) / (24 * 60 * 60 * 1000));
  if (dataSpanDays < 28) return {};

  // Sum amountCents per weekday
  const sums = new Map<number, number>();
  for (const tx of expenses) {
    const d = toDate(tx.date);
    if (!d) continue;
    const dow = d.getDay();
    sums.set(dow, (sums.get(dow) ?? 0) + tx.amountCents);
  }

  // Average per weekday
  const result: Record<number, number> = {};
  for (const [dow, total] of sums) {
    const count = weekdayCounts.get(dow)?.size ?? 1;
    result[dow] = total / count;
  }
  return result;
}

export function getCompletionByDayOfWeek(
  tasks: AnchorTask[],
  now: Date,
): Record<number, number> {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 90);
  cutoff.setHours(0, 0, 0, 0);

  const completions = tasks.filter((t) => {
    if (!t.lastCompletedAt) return false;
    const d = toDate(t.lastCompletedAt);
    return d && d >= cutoff && d <= now;
  });

  // Require at least 14 days of completion data span
  const dates = completions
    .map((t) => toDate(t.lastCompletedAt!)!)
    .sort((a, b) => a.getTime() - b.getTime());
  if (dates.length === 0) return {};
  const spanDays = Math.round((dates[dates.length - 1].getTime() - dates[0].getTime()) / (24 * 60 * 60 * 1000));
  if (spanDays < 14) return {};

  // Count distinct calendar dates per weekday in the window
  const weekdayCounts = new Map<number, number>();
  for (let d = new Date(cutoff); d <= now; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    weekdayCounts.set(dow, (weekdayCounts.get(dow) ?? 0) + 1);
  }

  // Count completions per weekday
  const completionCounts = new Map<number, number>();
  for (const task of completions) {
    const d = toDate(task.lastCompletedAt!)!;
    const dow = d.getDay();
    completionCounts.set(dow, (completionCounts.get(dow) ?? 0) + 1);
  }

  const result: Record<number, number> = {};
  for (const [dow, count] of completionCounts) {
    const total = weekdayCounts.get(dow) ?? 1;
    result[dow] = Math.min(count / total, 1);
  }
  return result;
}

export interface DayOfWeekSignal {
  day: number;
  dayName: string;
  value: number;
  vsAverage: number;
}

export function getHighSpendDay(
  transactions: AnchorTransaction[],
  now: Date,
): DayOfWeekSignal | null {
  // Require at least 8 weeks of expense data
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 90);
  cutoff.setHours(0, 0, 0, 0);
  const expenses = transactions.filter(
    (tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, cutoff, now),
  );
  const earliest = expenses.reduce<Date | null>((min, tx) => {
    const d = toDate(tx.date);
    return d && (!min || d < min) ? d : min;
  }, null);
  if (!earliest) return null;
  const spanDays = Math.round((now.getTime() - earliest.getTime()) / (24 * 60 * 60 * 1000));
  if (spanDays < 56) return null;

  const byDay = getSpendingByDayOfWeek(transactions, now);
  const entries = Object.entries(byDay).map(([k, v]) => [Number(k), v] as [number, number]);
  if (entries.length === 0) return null;

  const mean = entries.reduce((s, [, v]) => s + v, 0) / entries.length;
  if (mean === 0) return null;

  const best = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const vsAverage = (best[1] - mean) / mean;
  if (vsAverage < 0.35) return null;

  return {
    day: best[0],
    dayName: DAY_NAMES[best[0]],
    value: best[1],
    vsAverage: Math.round(vsAverage * 100) / 100,
  };
}

export function getBestCompletionDay(
  tasks: AnchorTask[],
  now: Date,
): DayOfWeekSignal | null {
  // Require at least 4 weeks of daily task data
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 90);
  cutoff.setHours(0, 0, 0, 0);
  const dailyWithCompletion = tasks.filter(
    (t) => t.type === 'daily' && t.lastCompletedAt && withinRange(t.lastCompletedAt, cutoff, now),
  );
  const dates = dailyWithCompletion
    .map((t) => toDate(t.lastCompletedAt!)!)
    .sort((a, b) => a.getTime() - b.getTime());
  if (dates.length === 0) return null;
  const spanDays = Math.round((dates[dates.length - 1].getTime() - dates[0].getTime()) / (24 * 60 * 60 * 1000));
  if (spanDays < 28) return null;

  const byDay = getCompletionByDayOfWeek(tasks, now);
  const entries = Object.entries(byDay).map(([k, v]) => [Number(k), v] as [number, number]);
  if (entries.length === 0) return null;

  // Include all 7 days (0 for missing) so days without data count as worst
  const allDays: [number, number][] = Array.from({ length: 7 }, (_, i) => {
    const found = entries.find(([k]) => k === i);
    return [i, found ? found[1] : 0];
  });

  const best = allDays.reduce((a, b) => (b[1] > a[1] ? b : a));
  const worst = allDays.reduce((a, b) => (b[1] < a[1] ? b : a));
  const spread = best[1] - worst[1];
  if (spread < 0.15) return null;

  const mean = allDays.reduce((s, [, v]) => s + v, 0) / allDays.length;
  const vsAverage = mean === 0 ? 0 : (best[1] - mean) / mean;

  return {
    day: best[0],
    dayName: DAY_NAMES[best[0]],
    value: best[1],
    vsAverage: Math.round(vsAverage * 100) / 100,
  };
}

export interface WeekBucket {
  weekStart: Date;
  completionRate: number;
  discretionaryCents: number;
}

const DISCRETIONARY_CATEGORIES = new Set([
  'Food', 'Groceries', 'Entertainment', 'Shopping',
  'Transportation', 'Dining', 'General',
]);

export function buildWeekBuckets(
  transactions: AnchorTransaction[],
  tasks: AnchorTask[],
  now: Date,
  weeksBack = 12,
): WeekBucket[] {
  // Find the Monday of the current week
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const thisMonday = new Date(now);
  thisMonday.setDate(thisMonday.getDate() + mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);

  const buckets: WeekBucket[] = [];

  // Build chronologically so "last 8" maps to the most recent 8 buckets.
  for (let w = weeksBack - 1; w >= 0; w--) {
    const weekStart = new Date(thisMonday);
    weekStart.setDate(weekStart.getDate() - w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Completion rate: tasks completed this week / eligible tasks
    const completedThisWeek = tasks.filter((t) => {
      const completedAt = ('completedAt' in t ? (t as { completedAt?: Date | string }).completedAt : undefined)
        ?? t.lastCompletedAt;
      if (!completedAt) return false;
      return withinRange(completedAt, weekStart, weekEnd);
    });

    const eligibleTasks = tasks.filter((t) => {
      const created = toDate(t.createdAt ?? null);
      return !created || created <= weekEnd;
    });

    if (eligibleTasks.length === 0) continue;
    const completionRate = completedThisWeek.length / eligibleTasks.length;
    if (completionRate <= 0) continue;

    // Discretionary spending
    const discretionaryTxns = transactions.filter(
      (tx) =>
        tx.type === 'expense' &&
        !tx.isSoftDeleted &&
        DISCRETIONARY_CATEGORIES.has(tx.category) &&
        withinRange(tx.date, weekStart, weekEnd),
    );
    if (discretionaryTxns.length === 0) continue;

    const discretionaryCents = discretionaryTxns.reduce((s, tx) => s + tx.amountCents, 0);

    buckets.push({ weekStart, completionRate, discretionaryCents });
  }

  return buckets;
}
