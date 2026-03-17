import type { FabricQueryResult } from '../../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, toDate, withinRange } from '../fabricUtils';
import type { RunFabricQueryInput } from './types';

export function momentumQuery(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const thisWeek = getDateRange('this_week', input.now);
  const lastWeek = getDateRange('last_week', input.now);

  const completionRateForRange = (start: Date, end: Date): number => {
    const completedCount = input.commitments.filter((task) => {
      const completedAt =
        ('completedAt' in task ? (task as { completedAt?: Date | string }).completedAt : undefined) ??
        task.lastCompletedAt;
      if (!completedAt) return false;
      return withinRange(completedAt, start, end);
    }).length;

    const eligibleCount = input.commitments.filter((task) => {
      const created = toDate(task.createdAt ?? null);
      return !created || created <= end;
    }).length;

    if (eligibleCount === 0) return 0;
    return (completedCount / eligibleCount) * 100;
  };

  const sumByType = (type: 'income' | 'expense', start: Date, end: Date): number =>
    input.transactions
      .filter((tx) => tx.type === type && !tx.isSoftDeleted && withinRange(tx.date, start, end))
      .reduce((sum, tx) => sum + tx.amountCents, 0);

  const thisWeekCompletion = completionRateForRange(thisWeek.start, thisWeek.end);
  const lastWeekCompletion = completionRateForRange(lastWeek.start, lastWeek.end);
  const completionDelta = thisWeekCompletion - lastWeekCompletion;

  const thisWeekExpenses = sumByType('expense', thisWeek.start, thisWeek.end);
  const lastWeekExpenses = sumByType('expense', lastWeek.start, lastWeek.end);
  const expenseDeltaPct =
    lastWeekExpenses === 0 ? (thisWeekExpenses > 0 ? 100 : 0) : ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses) * 100;

  const thisWeekIncome = sumByType('income', thisWeek.start, thisWeek.end);
  const thisWeekNet = thisWeekIncome - thisWeekExpenses;

  const habitsDirection = completionDelta >= 0 ? 'up' : 'down';
  const spendingDirection = expenseDeltaPct >= 0 ? 'up' : 'down';
  const cashFlowDirection = thisWeekNet >= 0 ? 'positive' : 'negative';

  return {
    data: {
      completionDelta,
      expenseDeltaPct,
      thisWeekNetCents: thisWeekNet,
      thisWeekExpenses,
      lastWeekExpenses,
    },
    summary: `This week vs last week: habits ${habitsDirection} ${Math.abs(Math.round(completionDelta))} pp, spending ${spendingDirection} ${Math.abs(Math.round(expenseDeltaPct))}%, net cash flow ${cashFlowDirection}`,
    detail: `This week net cash flow is ${formatCents(thisWeekNet, currency)}.`,
    visualizable: true,
    actions: [{ label: 'Open Dashboard', type: 'navigate', payload: { page: 'dashboard' } }],
  };
}
