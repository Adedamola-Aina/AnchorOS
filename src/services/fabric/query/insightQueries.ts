import type { FabricQueryResult } from '../../../types';
import {
  buildWeekBuckets,
  detectPrimaryCurrency,
  formatCents,
  getBestCompletionDay,
  getDateRange,
  getHighSpendDay,
  withinRange,
} from '../fabricUtils';
import type { RunFabricQueryInput } from './types';

export function savingsRateQuery(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const { start, end } = getDateRange('this_month', input.now);

  const income = input.transactions
    .filter((tx) => tx.type === 'income' && !tx.isSoftDeleted && withinRange(tx.date, start, end))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  if (income === 0) {
    return {
      data: { incomeCents: 0, expenseCents: 0, savingsRate: 0 },
      summary: 'No income recorded this month yet',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const expenses = input.transactions
    .filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, start, end))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const rate = ((income - expenses) / income) * 100;
  const roundedRate = Math.round(rate);

  let detail: string;
  if (roundedRate >= 20) {
    detail = "Solid — you're above the 20% savings benchmark";
  } else if (roundedRate >= 10) {
    detail = 'Decent — aim for 20% to build a meaningful buffer';
  } else if (roundedRate >= 0) {
    detail = "You're saving something, but below the 20% benchmark";
  } else {
    detail = `Expenses exceed income this month by ${formatCents(Math.abs(income - expenses), currency)}`;
  }

  return {
    data: { incomeCents: income, expenseCents: expenses, savingsRate: roundedRate },
    summary: `You're saving ${roundedRate}% of your income this month`,
    detail,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

export function dayOfWeekQuery(input: RunFabricQueryInput): FabricQueryResult {
  const highSpend = getHighSpendDay(input.transactions, input.now);
  const bestCompletion = getBestCompletionDay(input.commitments, input.now);

  if (!highSpend && !bestCompletion) {
    return {
      data: null,
      summary: 'Not enough data yet — check back after a few months',
      visualizable: false,
      actions: [],
    };
  }

  const lines: string[] = [];
  if (highSpend) {
    lines.push(`${highSpend.dayName} is your highest-spend day`);
  }
  if (bestCompletion) {
    lines.push(`${bestCompletion.dayName} is your strongest completion day`);
  }

  return {
    data: { highSpend, bestCompletion },
    summary: lines.join('; '),
    detail: highSpend && bestCompletion
      ? `You spend most on ${highSpend.dayName}s, while commitment follow-through is strongest on ${bestCompletion.dayName}s.`
      : undefined,
    visualizable: true,
    actions: [{ label: 'Open Dashboard', type: 'navigate', payload: { page: 'dashboard' } }],
  };
}

export function correlationQuery(input: RunFabricQueryInput): FabricQueryResult {
  const buckets = buildWeekBuckets(input.transactions, input.commitments, input.now, 12);
  if (buckets.length < 8) {
    return {
      data: null,
      summary: 'Need at least 8 weeks of data to find patterns',
      visualizable: false,
      actions: [],
    };
  }

  const highCompletion = buckets.filter((b) => b.completionRate >= 0.7);
  const lowCompletion = buckets.filter((b) => b.completionRate < 0.5);

  const mean = (arr: number[]): number => arr.reduce((s, v) => s + v, 0) / arr.length;

  if (highCompletion.length >= 3 && lowCompletion.length >= 3) {
    const avgHighSpend = mean(highCompletion.map((b) => b.discretionaryCents));
    const avgLowSpend = mean(lowCompletion.map((b) => b.discretionaryCents));

    if (avgLowSpend > 0) {
      const diff = (avgLowSpend - avgHighSpend) / avgLowSpend;
      const overallMean = mean(buckets.map((b) => b.discretionaryCents));
      const recent8 = buckets.slice(-8);
      const patternHeld = recent8.filter((b) =>
        (b.completionRate >= 0.7 && b.discretionaryCents <= overallMean) ||
        (b.completionRate < 0.5 && b.discretionaryCents >= overallMean),
      ).length;

      if (diff >= 0.15 && patternHeld >= 5) {
        const currency = detectPrimaryCurrency(input.transactions);
        const pct = Math.round(diff * 100);
        return {
          data: {
            buckets: buckets.length,
            avgHighSpend,
            avgLowSpend,
            diffPct: pct,
            patternHeld,
          },
          summary: `In high-completion weeks, discretionary spending is about ${pct}% lower.`,
          detail: `High-completion weeks average ${formatCents(avgHighSpend, currency)} vs ${formatCents(avgLowSpend, currency)} in low-completion weeks. Pattern held in ${patternHeld} of the last 8 weeks.`,
          visualizable: true,
          actions: [{ label: 'Open Dashboard', type: 'navigate', payload: { page: 'dashboard' } }],
        };
      }
    }
  }

  return {
    data: { buckets: buckets.length },
    summary: 'No consistent pattern found yet between your habits and spending — check back in a few weeks',
    visualizable: false,
    actions: [],
  };
}
