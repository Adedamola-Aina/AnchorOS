import type { AnchorTask, AnchorTransaction, Insight } from '../../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, toDate, withinRange } from '../fabricUtils';

export function buildCommitmentInsight(
  commitments: AnchorTask[],
  now: Date,
): Insight | null {
  if (commitments.length === 0) return null;

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  const recent = commitments.filter((task) => {
    const d = toDate(task.createdAt ?? null);
    return !d || d >= cutoff;
  });
  const pool = recent.length > 0 ? recent : commitments;

  const completed = pool.filter((task) => task.completed).length;
  const rate = Math.round((completed / pool.length) * 100);
  const bestStreak = pool.reduce((max, t) => Math.max(max, t.currentStreak ?? 0), 0);
  const streakNote = bestStreak >= 3 ? ` Best streak: ${bestStreak} days.` : '';

  return {
    id: 'insight-commitment-completion',
    category: 'commitments',
    headline: `Commitment completion: ${rate}%`,
    detail: `${completed} of ${pool.length} done in the last 30 days.${streakNote}`,
    reasoning: `Based on ${pool.length} commitments tracked over the last 30 days. ${completed} marked complete.`,
    trend: rate >= 80 ? 'up' : rate >= 50 ? 'stable' : 'down',
    severity: rate >= 70 ? 'positive' : 'attention',
    metric: { current: rate, previous: 0, unit: '%' },
    actionLink: '/commitments',
    createdAt: now.toISOString(),
  };
}

export function buildStreakInsight(
  commitments: AnchorTask[],
  now: Date,
): Insight | null {
  const best = commitments.reduce<AnchorTask | null>((acc, t) => {
    if ((t.currentStreak ?? 0) < 5) return acc;
    return !acc || (t.currentStreak ?? 0) > (acc.currentStreak ?? 0) ? t : acc;
  }, null);
  if (!best) return null;

  const days = best.currentStreak!;
  return {
    id: `insight-streak-${best.id}`,
    category: 'commitments',
    headline: `${days}-day streak on "${best.title}"`,
    detail: days >= 30
      ? `An incredible month-long habit — you've built something real.`
      : days >= 14
        ? `Two solid weeks in a row. Keep the momentum going.`
        : `Great consistency — you're building a lasting habit.`,
    reasoning: `"${best.title}" has been completed every day for the last ${days} consecutive days.`,
    trend: 'up',
    severity: 'positive',
    metric: { current: days, previous: 0, unit: 'days' },
    actionLink: '/commitments',
    createdAt: now.toISOString(),
  };
}

export function buildFamilyInsight(
  transactions: AnchorTransaction[],
  now: Date,
): Insight | null {
  const currency = detectPrimaryCurrency(transactions);
  const { start, end } = getDateRange('this_month', now);
  const familyTxns = transactions.filter(
    (tx) => tx.scope === 'family' && !tx.isSoftDeleted && withinRange(tx.date, start, end),
  );
  if (familyTxns.length === 0) return null;

  const totalSpent = familyTxns
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  return {
    id: 'insight-family-activity',
    category: 'household',
    headline: `${familyTxns.length} shared transactions this month`,
    detail: `${formatCents(totalSpent, currency)} in shared account expenses.`,
    reasoning: `Counted ${familyTxns.length} family-scoped transactions this month totalling ${formatCents(totalSpent, currency)}.`,
    trend: 'stable',
    severity: 'neutral',
    metric: { current: familyTxns.length, previous: 0, unit: 'transactions' },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}
