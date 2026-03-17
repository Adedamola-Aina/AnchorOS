import type { AnchorTask, AnchorTransaction } from '../../../types';
import { toDate, withinRange } from './dateUtils';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export interface DayOfWeekSignal {
  day: number;
  dayName: string;
  value: number;
  vsAverage: number;
}

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

  const weekdayCounts = new Map<number, Set<string>>();
  for (let d = new Date(cutoff); d <= now; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (!weekdayCounts.has(dow)) weekdayCounts.set(dow, new Set());
    weekdayCounts.get(dow)!.add(d.toISOString().slice(0, 10));
  }

  const earliestExpense = expenses.reduce<Date | null>((min, tx) => {
    const d = toDate(tx.date);
    return d && (!min || d < min) ? d : min;
  }, null);
  if (!earliestExpense) return {};
  const dataSpanDays = Math.round((now.getTime() - earliestExpense.getTime()) / (24 * 60 * 60 * 1000));
  if (dataSpanDays < 28) return {};

  const sums = new Map<number, number>();
  for (const tx of expenses) {
    const d = toDate(tx.date);
    if (!d) continue;
    const dow = d.getDay();
    sums.set(dow, (sums.get(dow) ?? 0) + tx.amountCents);
  }

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

  const dates = completions
    .map((t) => toDate(t.lastCompletedAt!)!)
    .sort((a, b) => a.getTime() - b.getTime());
  if (dates.length === 0) return {};
  const spanDays = Math.round((dates[dates.length - 1].getTime() - dates[0].getTime()) / (24 * 60 * 60 * 1000));
  if (spanDays < 14) return {};

  const weekdayCounts = new Map<number, number>();
  for (let d = new Date(cutoff); d <= now; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    weekdayCounts.set(dow, (weekdayCounts.get(dow) ?? 0) + 1);
  }

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

export function getHighSpendDay(
  transactions: AnchorTransaction[],
  now: Date,
): DayOfWeekSignal | null {
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

  // Keep this signal scoped to daily habits only.
  const byDay = getCompletionByDayOfWeek(dailyWithCompletion, now);
  const entries = Object.entries(byDay).map(([k, v]) => [Number(k), v] as [number, number]);
  if (entries.length === 0) return null;

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
