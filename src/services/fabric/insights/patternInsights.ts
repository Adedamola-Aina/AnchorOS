import type { AnchorTask, AnchorTransaction, Insight } from '../../../types';
import { buildWeekBuckets, detectPrimaryCurrency, formatCents } from '../fabricUtils';

export function buildCorrelationInsight(
  transactions: AnchorTransaction[],
  tasks: AnchorTask[],
  now: Date,
): Insight | null {
  const buckets = buildWeekBuckets(transactions, tasks, now, 12);
  if (buckets.length < 8) return null;

  const highCompletion = buckets.filter((b) => b.completionRate >= 0.70);
  const lowCompletion = buckets.filter((b) => b.completionRate < 0.50);
  if (highCompletion.length < 3 || lowCompletion.length < 3) return null;

  const mean = (arr: number[]): number => arr.reduce((s, v) => s + v, 0) / arr.length;
  const avgHighSpend = mean(highCompletion.map((b) => b.discretionaryCents));
  const avgLowSpend = mean(lowCompletion.map((b) => b.discretionaryCents));
  if (avgLowSpend === 0) return null;

  const diff = (avgLowSpend - avgHighSpend) / avgLowSpend;
  if (diff < 0.15) return null;

  const overallMean = mean(buckets.map((b) => b.discretionaryCents));
  const recent8 = buckets.slice(-8);
  const patternHeld = recent8.filter((b) =>
    (b.completionRate >= 0.70 && b.discretionaryCents <= overallMean) ||
    (b.completionRate < 0.50 && b.discretionaryCents >= overallMean),
  ).length;
  if (patternHeld < 5) return null;

  const thisWeekBuckets = buildWeekBuckets(transactions, tasks, now, 1);
  const currentCompletion = thisWeekBuckets[0]?.completionRate ?? 0;
  const trend: Insight['trend'] = currentCompletion >= 0.70 ? 'up' : 'stable';

  const pct = Math.round(diff * 100);
  const currency = detectPrimaryCurrency(transactions);

  return {
    id: 'insight-correlation-finance-commitments',
    category: 'patterns',
    headline: `When you follow through on habits, you spend ${pct}% less`,
    detail: `In weeks where your commitment completion is above 70%, your ` +
            `discretionary spending averages ${formatCents(avgHighSpend, currency)} ` +
            `— compared to ${formatCents(avgLowSpend, currency)} in lower-completion weeks. ` +
            `This pattern has held for ${patternHeld} of the last 8 weeks.` +
            (trend === 'up'
              ? ` This week is on track — you're in a high-completion week.`
              : ` This week's completion is at ${Math.round(currentCompletion * 100)}% — ` +
                `worth watching your discretionary spend.`),
    trend,
    severity: trend === 'up' ? 'positive' : 'attention',
    metric: {
      current: Math.round(avgHighSpend / 100),
      previous: Math.round(avgLowSpend / 100),
      unit: currency,
    },
    actionLink: '/dashboard',
    createdAt: now.toISOString(),
  };
}
