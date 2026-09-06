import type { AnchorTask, AnchorTransaction } from '../../types';
import { getDateRange, sumByCategory, withinRange } from './fabricUtils';

interface MonthlyReviewInput {
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}

interface CategoryBreakdown {
  name: string;
  amountCents: number;
}

export interface MonthlyReview {
  month: string;
  financeSummary: {
    totalIncomeCents: number;
    totalExpenseCents: number;
    savingsRatePercent: number;
    topCategories: CategoryBreakdown[];
  };
  commitmentSummary: {
    completed: number;
    total: number;
    completionRatePercent: number;
  };
  generatedAt: string;
}

export function buildMonthlyReview(input: MonthlyReviewInput): MonthlyReview {
  const { start, end } = getDateRange('last_month', input.now);
  const monthLabel = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;

  const monthTxns = input.transactions.filter((tx) =>
    withinRange(tx.date, start, end),
  );

  const incomeCents = monthTxns
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amountCents, 0);
  const expenseCents = monthTxns
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const savingsRatePercent = incomeCents > 0
    ? Math.round(((incomeCents - expenseCents) / incomeCents) * 100)
    : 0;

  const categoryMap = sumByCategory(monthTxns.filter((tx) => tx.type === 'expense'));
  const topCategories = Object.entries(categoryMap)
    .map(([name, amountCents]) => ({ name, amountCents }))
    .sort((a, b) => b.amountCents - a.amountCents)
    .slice(0, 3);

  const completed = input.commitments.filter((t) => t.completed).length;
  const total = input.commitments.length;
  const completionRatePercent = total > 0
    ? Math.round((completed / total) * 1000) / 10
    : 0;

  return {
    month: monthLabel,
    financeSummary: { totalIncomeCents: incomeCents, totalExpenseCents: expenseCents, savingsRatePercent, topCategories },
    commitmentSummary: { completed, total, completionRatePercent },
    generatedAt: input.now.toISOString(),
  };
}
