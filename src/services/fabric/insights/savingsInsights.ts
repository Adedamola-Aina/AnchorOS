import type { AnchorTransaction, Insight } from '../../../types';
import {
  detectPrimaryCurrency,
  formatCents,
  getDateRange,
  sumByCategory,
  withinRange,
} from '../fabricUtils';

const INCREASE_THRESHOLD = 1.15; // 15% increase triggers suggestion

export function buildSavingsInsight(
  transactions: AnchorTransaction[],
  now: Date,
): Insight | null {
  const expenses = transactions.filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted);
  if (expenses.length === 0) return null;

  const currency = detectPrimaryCurrency(transactions);
  const { start: thisStart, end: thisEnd } = getDateRange('this_month', now);
  const { start: prevStart, end: prevEnd } = getDateRange('last_month', now);

  const thisMonth = expenses.filter((tx) => withinRange(tx.date, thisStart, thisEnd));
  const prevMonth = expenses.filter((tx) => withinRange(tx.date, prevStart, prevEnd));

  if (thisMonth.length === 0) return null;

  const thisByCategory = sumByCategory(thisMonth);
  const prevByCategory = sumByCategory(prevMonth);

  // Find category with largest absolute increase
  let bestCategory = '';
  let bestIncrease = 0;
  let bestThisTotal = 0;
  let bestPrevTotal = 0;

  for (const [category, thisTotal] of Object.entries(thisByCategory)) {
    const prevTotal = prevByCategory[category] ?? 0;
    if (prevTotal === 0) continue; // Can't compare without baseline
    const increase = thisTotal - prevTotal;
    if (thisTotal > prevTotal * INCREASE_THRESHOLD && increase > bestIncrease) {
      bestCategory = category;
      bestIncrease = increase;
      bestThisTotal = thisTotal;
      bestPrevTotal = prevTotal;
    }
  }

  if (!bestCategory) return null;

  return {
    id: `insight-savings-suggestion-${now.toISOString().slice(0, 7)}`,
    category: 'spending',
    headline: `Potential savings: ${bestCategory}`,
    detail: `${bestCategory} is up ${formatCents(bestIncrease, currency)} vs last month (${formatCents(bestPrevTotal, currency)} → ${formatCents(bestThisTotal, currency)}). Reducing to last month's level could save ${formatCents(bestIncrease, currency)}/mo.`,
    reasoning: `Compared ${bestCategory} spending this month (${formatCents(bestThisTotal, currency)}) against last month (${formatCents(bestPrevTotal, currency)}) — a ${Math.round((bestIncrease / bestPrevTotal) * 100)}% increase.`,
    trend: 'up',
    severity: 'attention',
    createdAt: now.toISOString(),
  };
}
