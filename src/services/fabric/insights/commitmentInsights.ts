import type { AnchorTask, AnchorTransaction, Insight } from '../../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, toDate, withinRange } from '../fabricUtils';
import { countScheduledOccurrences } from '../commitmentSchedule';

/**
 * Commitment completion insight (UX-AI-08).
 *
 * The metric used to be `currentlyFlaggedComplete / commitmentsTracked`, but it
 * was *described* as performance "in the last 30 days". For a daily habit kept
 * 30 times, the momentary flag is false the moment the day resets — so the first
 * insight a diligent user saw was "Commitment completion: 0% — 0 of 4 done in
 * the last 30 days". The number was not measuring what the sentence claimed.
 *
 * It now measures expected occurrences against evidenced completions:
 *   - denominator = how many times the cadence *required* the commitment inside
 *     the window (clamped to its creation date, so a new habit is not blamed for
 *     weeks before it existed),
 *   - numerator = completions evidenced by `currentStreak` and
 *     `lastCompletedAt`, capped by the expectation,
 *   - and when nothing was due in the window the insight is simply not emitted
 *     rather than reporting a meaningless 0%.
 */
export function buildCommitmentInsight(
  commitments: AnchorTask[],
  now: Date,
): Insight | null {
  if (commitments.length === 0) return null;

  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 30);

  let expected = 0;
  let completed = 0;
  for (const task of commitments) {
    const taskExpected = countScheduledOccurrences(task, windowStart, now);
    if (taskExpected === 0) continue;
    expected += taskExpected;

    const streak = task.currentStreak ?? 0;
    const lastDone = toDate(task.lastCompletedAt ?? null);
    const completedInsideWindow = Boolean(lastDone && lastDone >= windowStart);
    const evidenced = task.completed && completedInsideWindow ? Math.max(1, streak) : streak;
    completed += Math.min(evidenced, taskExpected);
  }

  if (expected === 0) return null;

  completed = Math.min(completed, expected);
  const rate = Math.round((completed / expected) * 100);
  const bestStreak = commitments.reduce((max, t) => Math.max(max, t.currentStreak ?? 0), 0);
  const streakNote = bestStreak >= 3 ? ` Best streak: ${bestStreak} days.` : '';
  const since = windowStart.toISOString().slice(0, 10);

  return {
    id: 'insight-commitment-completion',
    category: 'commitments',
    headline: `Commitment completion: ${rate}%`,
    detail: `${completed} of ${expected} scheduled commitments done in the last 30 days.${streakNote}`,
    reasoning: `Counted ${expected} scheduled occurrences per cadence since ${since}, and matched them against your recorded streaks and last-completed dates.`,
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
