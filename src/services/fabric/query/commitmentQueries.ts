import type { FabricQueryResult } from '../../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, toDate } from '../fabricUtils';
import type { RunFabricQueryInput } from './types';

export function commitmentsSummary(input: RunFabricQueryInput): FabricQueryResult {
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const filtered = input.commitments.filter((task) => {
    const date = toDate(task.createdAt ?? null);
    return !date || (date >= range.start && date <= range.end);
  });
  const tasks = filtered.length > 0 ? filtered : input.commitments;

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const bestStreak = tasks.reduce((max, t) => Math.max(max, t.currentStreak ?? 0), 0);

  return {
    data: { total, completed, rate, bestStreak },
    summary: `Commitment completion is ${rate}% (${completed}/${total}).`,
    detail: rate >= 80
      ? `Great consistency! Best streak: ${bestStreak} day${bestStreak === 1 ? '' : 's'}.`
      : rate >= 50
        ? 'You can boost this by completing one pending task today.'
        : 'Consider narrowing your active commitments to build momentum.',
    visualizable: true,
    actions: [{ label: 'Open Commitments', type: 'navigate', payload: { page: 'commitments' } }],
  };
}

export function weekSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const weekStart = new Date(input.now);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekTxns = input.transactions.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && d >= weekStart;
  });
  const spent = weekTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents, 0);
  const income = weekTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountCents, 0);
  const completed = input.commitments.filter((t) => t.completed).length;
  const total = input.commitments.length;

  return {
    data: { spent, income, completed, total },
    summary: `This week: ${formatCents(spent, currency)} spent, ${formatCents(income, currency)} earned. Commitments: ${completed}/${total} done.`,
    detail: income > spent ? `You're ${formatCents(income - spent, currency)} ahead — good week!` : undefined,
    visualizable: true,
    actions: [
      { label: 'View Finance', type: 'navigate', payload: { page: 'finance' } },
      { label: 'View Commitments', type: 'navigate', payload: { page: 'commitments' } },
    ],
  };
}
