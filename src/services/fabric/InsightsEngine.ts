import type { AnchorTask, AnchorTransaction, Insight, RecurringTransaction } from '../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, getHighSpendDay, getSpendingByDayOfWeek, sumByCategory, toDate, withinRange } from './fabricUtils';

interface InsightInput {
  feature: 'dashboard' | 'commitments' | 'finance' | 'family';
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  recurring: RecurringTransaction[];
  now: Date;
}

function buildSpendingInsight(
  transactions: AnchorTransaction[],
  now: Date,
): Insight | null {
  const currency = detectPrimaryCurrency(transactions);

  // Scope to current month for relevance
  const { start, end } = getDateRange('this_month', now);
  const thisMonthExpenses = transactions.filter(
    (tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, start, end),
  );
  if (thisMonthExpenses.length === 0) return null;

  const byCategory = sumByCategory(thisMonthExpenses);

  const topEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).at(0);
  if (!topEntry) return null;
  const [category, total] = topEntry;

  // Previous month for comparison
  const { start: prevStart, end: prevEnd } = getDateRange('last_month', now);
  const prevExpenses = transactions.filter(
    (tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, prevStart, prevEnd),
  );
  const prevByCategory = sumByCategory(prevExpenses);
  const prevTotal = prevByCategory[category] ?? 0;

  const trend: Insight['trend'] = prevTotal === 0 ? 'stable'
    : total > prevTotal * 1.1 ? 'up'
    : total < prevTotal * 0.9 ? 'down'
    : 'stable';

  return {
    id: 'insight-spending-top-category',
    category: 'spending',
    headline: `Top spend this month: ${category}`,
    detail: `${formatCents(total, currency)} in ${category}${prevTotal > 0 ? ` — ${trend === 'up' ? '↑' : trend === 'down' ? '↓' : '≈'} vs last month (${formatCents(prevTotal, currency)})` : ''}.`,
    trend,
    severity: trend === 'up' ? 'attention' : 'neutral',
    metric: {
      current: Number((total / 100).toFixed(2)),
      previous: Number((prevTotal / 100).toFixed(2)),
      unit: currency,
    },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}

function buildCommitmentInsight(commitments: AnchorTask[], now: Date): Insight | null {
  if (commitments.length === 0) return null;

  // Scope to tasks created in the last 30 days for recency
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  const recent = commitments.filter((task) => {
    const d = toDate(task.createdAt ?? null);
    return !d || d >= cutoff;
  });
  const pool = recent.length > 0 ? recent : commitments;

  const completed = pool.filter((task) => task.completed).length;
  const rate = Math.round((completed / pool.length) * 100);

  // Find best streak for the detail line
  const bestStreak = pool.reduce((max, t) => Math.max(max, t.currentStreak ?? 0), 0);
  const streakNote = bestStreak >= 3 ? ` Best streak: ${bestStreak} days.` : '';

  return {
    id: 'insight-commitment-completion',
    category: 'commitments',
    headline: `Commitment completion: ${rate}%`,
    detail: `${completed} of ${pool.length} done in the last 30 days.${streakNote}`,
    trend: rate >= 80 ? 'up' : rate >= 50 ? 'stable' : 'down',
    severity: rate >= 70 ? 'positive' : 'attention',
    metric: { current: rate, previous: 0, unit: '%' },
    actionLink: '/commitments',
    createdAt: now.toISOString(),
  };
}

function buildFamilyInsight(transactions: AnchorTransaction[], now: Date): Insight | null {
  const currency = detectPrimaryCurrency(transactions);

  // Surface shared account activity volume this month
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
    trend: 'stable',
    severity: 'neutral',
    metric: { current: familyTxns.length, previous: 0, unit: 'transactions' },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}

/** Celebrate a commitment that has a streak of 5+ days. */
function buildStreakInsight(commitments: AnchorTask[], now: Date): Insight | null {
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
    trend: 'up',
    severity: 'positive',
    metric: { current: days, previous: 0, unit: 'days' },
    actionLink: '/commitments',
    createdAt: now.toISOString(),
  };
}

/** How much is spent on active recurring subscriptions per month. */
function buildSubscriptionInsight(
  recurring: RecurringTransaction[],
  currency: 'NGN' | 'USD',
  now: Date,
): Insight | null {
  const subs = recurring.filter(
    (r) => r.status === 'active' && r.frequency === 'monthly' && r.type === 'expense',
  );
  if (subs.length === 0) return null;

  const totalCents = subs.reduce((sum, r) => sum + r.amountCents, 0);
  const cur = currency;

  return {
    id: 'insight-subscriptions',
    category: 'spending',
    headline: `${subs.length} active subscription${subs.length === 1 ? '' : 's'} — ${formatCents(totalCents, cur)}/month`,
    detail: subs.length <= 4
      ? subs.map((s) => s.title).join(', ') + '.'
      : `Including ${subs.slice(0, 3).map((s) => s.title).join(', ')} and ${subs.length - 3} more.`,
    trend: 'stable',
    severity: 'neutral',
    metric: { current: Number((totalCents / 100).toFixed(2)), previous: 0, unit: cur },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}

/** Savings rate: what % of income was kept this month. */
function buildSavingsRateInsight(transactions: AnchorTransaction[], now: Date): Insight | null {
  const currency = detectPrimaryCurrency(transactions);
  const { start, end } = getDateRange('this_month', now);

  const income = transactions
    .filter((tx) => tx.type === 'income' && !tx.isSoftDeleted && withinRange(tx.date, start, end))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  if (income === 0) return null;

  const expenses = transactions
    .filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, start, end))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const savingsRate = Math.round(((income - expenses) / income) * 100);
  const savedCents = income - expenses;

  const trend: Insight['trend'] = savingsRate >= 20 ? 'up' : savingsRate >= 0 ? 'stable' : 'down';

  return {
    id: 'insight-savings-rate',
    category: 'spending',
    headline: savingsRate >= 0
      ? `Saving ${savingsRate}% of income this month`
      : `Spending exceeds income by ${formatCents(Math.abs(savedCents), currency)}`,
    detail: savingsRate >= 20
      ? `You kept ${formatCents(savedCents, currency)} from ${formatCents(income, currency)} earned — solid month.`
      : savingsRate >= 0
        ? `You saved ${formatCents(savedCents, currency)} of ${formatCents(income, currency)} earned. Aim for 20% to build a buffer.`
        : `Your expenses outpaced your income this month. Review discretionary spending.`,
    trend,
    severity: savingsRate >= 20 ? 'positive' : savingsRate >= 0 ? 'neutral' : 'attention',
    metric: { current: savingsRate, previous: 0, unit: '%' },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}

function buildDayOfWeekInsight(
  transactions: AnchorTransaction[],
  _tasks: AnchorTask[],
  now: Date,
): Insight | null {
  const highSpend = getHighSpendDay(transactions, now);
  if (!highSpend) return null;

  const pct = Math.round(highSpend.vsAverage * 100);
  const currency = detectPrimaryCurrency(transactions);

  const byDay = getSpendingByDayOfWeek(transactions, now);
  const entries = Object.values(byDay);
  const overallAvg = entries.length > 0
    ? Math.round(entries.reduce((s, v) => s + v, 0) / entries.length)
    : 0;

  return {
    id: 'insight-high-spend-day',
    category: 'patterns',
    headline: `${highSpend.dayName}s are your highest-spend day`,
    detail: `You spend an average of ${pct}% more on ${highSpend.dayName}s ` +
            `(${formatCents(Math.round(highSpend.value), currency)} avg vs ` +
            `${formatCents(overallAvg, currency)} daily average). ` +
            (now.getDay() === highSpend.day
              ? `Today is ${highSpend.dayName} — worth being intentional.`
              : `Next ${highSpend.dayName}, consider tracking more closely.`),
    trend: 'stable',
    severity: 'attention',
    metric: { current: highSpend.value, previous: overallAvg, unit: currency },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}

export function buildInsights(input: InsightInput): Insight[] {
  const spending = buildSpendingInsight(input.transactions, input.now);
  const commitment = buildCommitmentInsight(input.commitments, input.now);
  const family = buildFamilyInsight(input.transactions, input.now);
  const streak = buildStreakInsight(input.commitments, input.now);
  const currency = detectPrimaryCurrency(input.transactions);
  const subscriptions = buildSubscriptionInsight(input.recurring, currency, input.now);
  const savings = buildSavingsRateInsight(input.transactions, input.now);
  const dayOfWeek = buildDayOfWeekInsight(input.transactions, input.commitments, input.now);

  if (input.feature === 'finance') {
    return [spending, subscriptions, savings, dayOfWeek].filter((i): i is Insight => !!i);
  }
  if (input.feature === 'commitments') {
    return [commitment, streak].filter((i): i is Insight => !!i);
  }
  if (input.feature === 'family') return family ? [family] : [];

  // Dashboard: spending + commitments + streak + savings + day-of-week
  return [spending, commitment, streak, savings, dayOfWeek].filter((i): i is Insight => !!i);
}
