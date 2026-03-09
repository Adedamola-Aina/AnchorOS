import type { AnchorTask, AnchorTransaction, WeeklyReport } from '../../types';
import { buildInsights } from './InsightsEngine';

interface WeeklyReportInput {
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}

function startOfWeek(now: Date): Date {
  const copy = new Date(now);
  copy.setDate(copy.getDate() - 6);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function toDate(value: Date | string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function withinRange(value: Date | string | undefined, start: Date, end: Date): boolean {
  const parsed = toDate(value);
  if (!parsed) return false;
  return parsed >= start && parsed <= end;
}

function toDollars(cents: number): number {
  return Number((cents / 100).toFixed(2));
}

export function buildWeeklyReport(input: WeeklyReportInput): WeeklyReport {
  const weekStart = startOfWeek(input.now);
  const weekEnd = new Date(input.now);
  weekEnd.setHours(23, 59, 59, 999);

  const weekTransactions = input.transactions.filter((tx) => withinRange(tx.date, weekStart, weekEnd));
  const weekCommitments = input.commitments.filter((task) => withinRange(task.createdAt ?? undefined, weekStart, weekEnd));

  const totalSpentCents = weekTransactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amountCents, 0);
  const totalIncomeCents = weekTransactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amountCents, 0);

  const topCategoryMap = weekTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce<Record<string, number>>((acc, tx) => {
      const key = tx.category || 'General';
      acc[key] = (acc[key] || 0) + tx.amountCents;
      return acc;
    }, {});
  const [topCategoryName, topCategoryValue] = Object.entries(topCategoryMap).sort((a, b) => b[1] - a[1])[0] || ['General', 0];

  const completed = weekCommitments.filter((task) => task.completed).length;
  const missed = weekCommitments.filter((task) => !task.completed).length;
  const completionRate = weekCommitments.length > 0 ? Math.round((completed / weekCommitments.length) * 100) : 0;

  const longestStreakTask = weekCommitments.reduce<{ name: string; days: number }>((best, task) => {
    const streak = task.currentStreak || 0;
    return streak > best.days ? { name: task.title, days: streak } : best;
  }, { name: 'N/A', days: 0 });

  const categoryScores = weekCommitments.reduce<Record<string, { total: number; completed: number }>>((acc, task) => {
    const key = task.category;
    const current = acc[key] || { total: 0, completed: 0 };
    current.total += 1;
    current.completed += task.completed ? 1 : 0;
    acc[key] = current;
    return acc;
  }, {});

  const rankedCategories = Object.entries(categoryScores).map(([name, score]) => ({
    name,
    rate: score.total > 0 ? score.completed / score.total : 0,
  })).sort((a, b) => b.rate - a.rate);

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    insights: buildInsights({ feature: 'dashboard', transactions: weekTransactions, commitments: weekCommitments, now: input.now }),
    commitmentSummary: {
      completed,
      skipped: 0,
      missed,
      completionRate,
      bestCategory: rankedCategories[0]?.name || 'N/A',
      worstCategory: rankedCategories[rankedCategories.length - 1]?.name || 'N/A',
      longestStreak: longestStreakTask,
    },
    financeSummary: {
      totalSpent: toDollars(totalSpentCents),
      totalIncome: toDollars(totalIncomeCents),
      netCashFlow: toDollars(totalIncomeCents - totalSpentCents),
      topCategory: { name: topCategoryName, amount: toDollars(topCategoryValue) },
      vsLastWeek: 0,
    },
    generatedAt: input.now.toISOString(),
  };
}
