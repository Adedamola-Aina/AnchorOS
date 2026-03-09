import type { AnchorTask, AnchorTransaction, Insight } from '../../types';

interface InsightInput {
  feature: 'dashboard' | 'commitments' | 'finance' | 'family';
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}

function buildSpendingInsight(transactions: AnchorTransaction[], nowIso: string): Insight | null {
  const expenses = transactions.filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted);
  if (expenses.length === 0) return null;

  const byCategory = expenses.reduce<Record<string, number>>((acc, tx) => {
    const key = tx.category || 'General';
    acc[key] = (acc[key] || 0) + tx.amountCents;
    return acc;
  }, {});
  const [category, total] = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  return {
    id: 'insight-spending-top-category',
    category: 'spending',
    headline: `Top spending category: ${category}`,
    detail: `You've spent $${(total / 100).toFixed(2)} in ${category} recently.`,
    trend: 'stable',
    severity: 'neutral',
    metric: { current: Number((total / 100).toFixed(2)), previous: 0, unit: 'USD' },
    actionLink: '/finance',
    createdAt: nowIso,
  };
}

function buildCommitmentInsight(commitments: AnchorTask[], nowIso: string): Insight | null {
  if (commitments.length === 0) return null;

  const completed = commitments.filter((task) => task.completed).length;
  const rate = Math.round((completed / commitments.length) * 100);

  return {
    id: 'insight-commitment-completion',
    category: 'commitments',
    headline: `Commitment completion is ${rate}%`,
    detail: `${completed} of ${commitments.length} commitments are complete in your recent activity.`,
    trend: rate >= 70 ? 'up' : 'stable',
    severity: rate >= 70 ? 'positive' : 'attention',
    metric: { current: rate, previous: 0, unit: '%' },
    actionLink: '/commitments',
    createdAt: nowIso,
  };
}

export function buildInsights(input: InsightInput): Insight[] {
  const nowIso = input.now.toISOString();
  const spending = buildSpendingInsight(input.transactions, nowIso);
  const commitments = buildCommitmentInsight(input.commitments, nowIso);

  if (input.feature === 'finance') return spending ? [spending] : [];
  if (input.feature === 'commitments') return commitments ? [commitments] : [];
  if (input.feature === 'family') return [];

  return [spending, commitments].filter((item): item is Insight => !!item);
}
