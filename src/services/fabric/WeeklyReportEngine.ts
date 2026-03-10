import type { AnchorTask, AnchorTransaction, WeeklyReport } from '../../types';
import { buildInsights } from './InsightsEngine';
import { detectPrimaryCurrency, previousWeekRange, sumByCategory, withinRange } from './fabricUtils';
import { fromCents } from '../../utils/moneyUtils';

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

export function buildWeeklyReport(input: WeeklyReportInput): WeeklyReport {
  const weekStart = startOfWeek(input.now);
  const weekEnd = new Date(input.now);
  weekEnd.setHours(23, 59, 59, 999);

  const weekTransactions = input.transactions.filter((tx) =>
    withinRange(tx.date, weekStart, weekEnd),
  );
  const weekCommitments = input.commitments.filter((task) =>
    withinRange(task.createdAt ?? null, weekStart, weekEnd),
  );

  const currency = detectPrimaryCurrency(input.transactions);

  const totalSpentCents = weekTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amountCents, 0);
  const totalIncomeCents = weekTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const topCategoryMap = sumByCategory(weekTransactions.filter((tx) => tx.type === 'expense'));
  const [topCategoryName, topCategoryValue] = Object.entries(topCategoryMap)
    .sort((a, b) => b[1] - a[1])
    .at(0) ?? ['General', 0];

  // ── vsLastWeek: compare total spend to the previous 7-day window ────────────
  const { start: prevStart, end: prevEnd } = previousWeekRange(weekStart, weekEnd);
  const lastWeekSpentCents = input.transactions
    .filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, prevStart, prevEnd))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const vsLastWeek =
    lastWeekSpentCents > 0
      ? Number((((totalSpentCents - lastWeekSpentCents) / lastWeekSpentCents) * 100).toFixed(1))
      : 0;

  // ── Commitment summary ───────────────────────────────────────────────────────
  const completed = weekCommitments.filter((task) => task.completed).length;
  const missed = weekCommitments.filter((task) => !task.completed).length;
  const completionRate =
    weekCommitments.length > 0
      ? Math.round((completed / weekCommitments.length) * 100)
      : 0;

  const longestStreakTask = weekCommitments.reduce<{ name: string; days: number }>(
    (best, task) => {
      const streak = task.currentStreak ?? 0;
      return streak > best.days ? { name: task.title, days: streak } : best;
    },
    { name: 'N/A', days: 0 },
  );

  const categoryScores = weekCommitments.reduce<Record<string, { total: number; completed: number }>>(
    (acc, task) => {
      const key = task.category;
      const current = acc[key] ?? { total: 0, completed: 0 };
      current.total += 1;
      current.completed += task.completed ? 1 : 0;
      acc[key] = current;
      return acc;
    },
    {},
  );

  const rankedCategories = Object.entries(categoryScores)
    .map(([name, score]) => ({
      name,
      rate: score.total > 0 ? score.completed / score.total : 0,
    }))
    .sort((a, b) => b.rate - a.rate);

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    insights: buildInsights({
      feature: 'dashboard',
      transactions: weekTransactions,
      commitments: weekCommitments,
      now: input.now,
    }),
    commitmentSummary: {
      completed,
      skipped: 0, // Not tracked at the data model level; requires explicit user action
      missed,
      completionRate,
      bestCategory: rankedCategories.at(0)?.name ?? 'N/A',
      worstCategory: rankedCategories.at(-1)?.name ?? 'N/A',
      longestStreak: longestStreakTask,
    },
    financeSummary: {
      totalSpent: fromCents(totalSpentCents),
      totalIncome: fromCents(totalIncomeCents),
      netCashFlow: fromCents(totalIncomeCents - totalSpentCents),
      topCategory: { name: topCategoryName, amount: fromCents(topCategoryValue) },
      vsLastWeek,
    },
    generatedAt: input.now.toISOString(),
    currency,
  };
}
