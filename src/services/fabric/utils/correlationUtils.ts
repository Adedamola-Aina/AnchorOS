import type { AnchorTask, AnchorTransaction } from '../../../types';
import { toDate, withinRange } from './dateUtils';

export interface WeekBucket {
  weekStart: Date;
  completionRate: number;
  discretionaryCents: number;
}

const DISCRETIONARY_CATEGORIES = new Set([
  'Food',
  'Groceries',
  'Entertainment',
  'Shopping',
  'Transportation',
  'Dining',
  'General',
]);

export function buildWeekBuckets(
  transactions: AnchorTransaction[],
  tasks: AnchorTask[],
  now: Date,
  weeksBack = 12,
): WeekBucket[] {
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const thisMonday = new Date(now);
  thisMonday.setDate(thisMonday.getDate() + mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);

  const buckets: WeekBucket[] = [];

  for (let w = weeksBack - 1; w >= 0; w--) {
    const weekStart = new Date(thisMonday);
    weekStart.setDate(weekStart.getDate() - w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const completedThisWeek = tasks.filter((t) => {
      const completedAt =
        ('completedAt' in t ? (t as { completedAt?: Date | string }).completedAt : undefined) ??
        t.lastCompletedAt;
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
