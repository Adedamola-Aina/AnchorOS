import type { AnchorTask, AnchorTransaction, Prediction, UserPattern } from '../../types';

interface PredictionInput {
  patterns: UserPattern[];
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}

function inMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

function toDate(value: Date | string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function nextIso(now: Date, days: number): string {
  const copy = new Date(now);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString();
}

export function buildPredictions(input: PredictionInput): Prediction[] {
  const predictions: Prediction[] = [];
  const year = input.now.getFullYear();
  const month = input.now.getMonth();

  const expenses = input.transactions.filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted);
  const thisMonth = expenses
    .filter((tx) => {
      const date = toDate(tx.date);
      return !!date && inMonth(date, year, month);
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const lastMonthDate = new Date(year, month - 1, 1);
  const lastMonth = expenses
    .filter((tx) => {
      const date = toDate(tx.date);
      return !!date && inMonth(date, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  if (lastMonth > 0 && thisMonth > lastMonth * 1.2) {
    predictions.push({
      id: 'pred-budget-overage',
      type: 'budget_overage',
      message: 'Current month spending is tracking above last month.',
      detail: `This month: $${(thisMonth / 100).toFixed(2)} vs last month: $${(lastMonth / 100).toFixed(2)}.`,
      severity: 'warning',
      confidence: 0.82,
      actionable: true,
      action: { label: 'Review finance', navigateTo: '/finance' },
      expiresAt: nextIso(input.now, 3),
      createdAt: input.now.toISOString(),
    });
  }

  const pendingDaily = input.commitments.filter((task) => task.type === 'daily' && !task.completed);
  if (pendingDaily.length > 0) {
    predictions.push({
      id: 'pred-streak-risk',
      type: 'streak_at_risk',
      message: 'One or more daily commitments are still incomplete.',
      detail: `You have ${pendingDaily.length} pending daily commitment(s).`,
      severity: 'warning',
      confidence: 0.75,
      actionable: true,
      action: { label: 'Open commitments', navigateTo: '/commitments' },
      expiresAt: nextIso(input.now, 1),
      createdAt: input.now.toISOString(),
    });
  }

  const recurringPattern = input.patterns.find((pattern) =>
    pattern.followUpAction.type === 'review_budget' && pattern.confidence >= 0.6
  );
  const recurringCategory =
    recurringPattern?.followUpAction.type === 'review_budget'
      ? recurringPattern.followUpAction.category
      : undefined;
  if (recurringPattern && input.now.getDate() <= 5) {
    predictions.push({
      id: 'pred-recurring-due',
      type: 'recurring_due',
      message: 'A recurring spending pattern may be due soon.',
      detail: `Pattern suggests checking ${recurringCategory || 'your regular'} spend.`,
      severity: 'info',
      confidence: recurringPattern.confidence,
      actionable: true,
      action: { label: 'Review category', navigateTo: '/finance' },
      expiresAt: nextIso(input.now, 5),
      createdAt: input.now.toISOString(),
    });
  }

  return predictions.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
}
