import type { AnchorTask, AnchorTransaction, Insight } from '../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, sumByCategory, toDate, withinRange } from './fabricUtils';

interface InsightInput {
  feature: 'dashboard' | 'commitments' | 'finance' | 'family';
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
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

export function buildInsights(input: InsightInput): Insight[] {
  const spending = buildSpendingInsight(input.transactions, input.now);
  const commitments = buildCommitmentInsight(input.commitments, input.now);
  const family = buildFamilyInsight(input.transactions, input.now);

  if (input.feature === 'finance') return spending ? [spending] : [];
  if (input.feature === 'commitments') return commitments ? [commitments] : [];
  if (input.feature === 'family') return family ? [family] : [];

  // Dashboard: all non-null insights
  return [spending, commitments].filter((item): item is Insight => !!item);
}
