import type { Prediction } from '../../types';
import { detectPrimaryCurrency, formatCents, monthKey, toDate } from './fabricUtils';
import { inMonth, nextIso } from './predictionCommon';
import type { PredictionInput } from './predictionTypes';

export function buildBehaviorSignals(input: PredictionInput): Prediction[] {
  const { now } = input;
  const year = now.getFullYear();
  const month = now.getMonth();
  const dayOfMonth = now.getDate();
  const mKey = monthKey(now);
  const currency = detectPrimaryCurrency(input.transactions);
  const results: Prediction[] = [];

  const pendingDaily = input.commitments.filter((task) => task.type === 'daily' && !task.completed);
  if (pendingDaily.length > 0) {
    const riskiest = pendingDaily.reduce((best, t) =>
      (t.currentStreak ?? 0) > (best.currentStreak ?? 0) ? t : best, pendingDaily[0]);
    const streakInfo = (riskiest.currentStreak ?? 0) > 0
      ? ` Your "${riskiest.title}" streak is at ${riskiest.currentStreak} day${riskiest.currentStreak === 1 ? '' : 's'}.`
      : '';

    results.push({
      id: `pred-streak-risk-${now.toISOString().slice(0, 10)}`,
      type: 'streak_at_risk',
      message: pendingDaily.length === 1
        ? `"${riskiest.title}" is still incomplete today.`
        : `${pendingDaily.length} daily commitments are still pending.`,
      detail: `Complete before midnight to keep your streak.${streakInfo}`,
      severity: 'warning',
      confidence: 0.75,
      actionable: true,
      action: { label: 'Open commitments', navigateTo: '/commitments' },
      expiresAt: nextIso(now, 1),
      createdAt: now.toISOString(),
    });
  }

  const recurringPattern = input.patterns.find(
    (p) => p.followUpAction.type === 'review_budget' && p.confidence >= 0.6,
  );
  const recurringCategory =
    recurringPattern?.followUpAction.type === 'review_budget'
      ? recurringPattern.followUpAction.category
      : undefined;

  if (recurringPattern && now.getDate() <= 5) {
    results.push({
      id: `pred-recurring-due-${mKey}`,
      type: 'recurring_due',
      message: `A regular ${recurringCategory ?? 'spending'} pattern may be due.`,
      detail: `Anchor AI has noticed a consistent pattern in your ${recurringCategory ?? 'monthly'} spend.`,
      severity: 'info',
      confidence: recurringPattern.confidence,
      actionable: true,
      action: { label: 'Review spending', navigateTo: '/finance' },
      expiresAt: nextIso(now, 5),
      createdAt: now.toISOString(),
    });
  }

  const thisMonthExpenses = input.transactions
    .filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted)
    .filter((tx) => {
      const d = toDate(tx.date);
      return !!d && inMonth(d, year, month);
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const thisMonthIncome = input.transactions
    .filter((tx) => {
      if (tx.type !== 'income' || tx.isSoftDeleted) return false;
      const d = toDate(tx.date);
      return !!d && inMonth(d, year, month);
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const surplus = thisMonthIncome - thisMonthExpenses;
  if (thisMonthIncome > 0 && surplus > 0 && dayOfMonth >= 15) {
    results.push({
      id: `pred-savings-opportunity-${mKey}`,
      type: 'cash_flow_alert',
      message: `You have a surplus of ${formatCents(surplus, currency)} this month.`,
      detail: 'Consider moving the difference to a savings account.',
      severity: 'info',
      confidence: 0.65,
      actionable: true,
      action: { label: 'View accounts', navigateTo: '/finance' },
      expiresAt: nextIso(now, 7),
      createdAt: now.toISOString(),
    });
  }

  const expenses = input.transactions.filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const last7Days = expenses.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && d >= sevenDaysAgo;
  });
  const last7Total = last7Days.reduce((sum, tx) => sum + tx.amountCents, 0);

  const lastMonthDate = new Date(year, month - 1, 1);
  const lastMonth = expenses
    .filter((tx) => {
      const d = toDate(tx.date);
      return !!d && inMonth(d, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const typical7Day = lastMonth / 4;
  if (typical7Day > 0 && last7Total > typical7Day * 1.5 && last7Days.length >= 3) {
    results.push({
      id: `pred-unusual-spike-${now.toISOString().slice(0, 10)}`,
      type: 'unusual_spending',
      message: 'Higher than usual spending in the last 7 days.',
      detail: `${formatCents(last7Total, currency)} spent - about ${Math.round((last7Total / typical7Day) * 100)}% of your typical weekly spend.`,
      severity: 'warning',
      confidence: 0.68,
      actionable: true,
      action: { label: 'Review transactions', navigateTo: '/finance' },
      expiresAt: nextIso(now, 2),
      createdAt: now.toISOString(),
    });
  }

  return results;
}
