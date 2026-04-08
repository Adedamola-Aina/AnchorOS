import type { AnchorTransaction, Insight, RecurringTransaction } from '../../../types';
import {
  detectPrimaryCurrency,
  formatCents,
  getDateRange,
  getSpendingByDayOfWeek,
  getHighSpendDay,
  sumByCategory,
  withinRange,
} from '../fabricUtils';

export function buildSpendingInsight(
  transactions: AnchorTransaction[],
  now: Date,
): Insight | null {
  const currency = detectPrimaryCurrency(transactions);

  const { start, end } = getDateRange('this_month', now);
  const thisMonthExpenses = transactions.filter(
    (tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, start, end),
  );
  if (thisMonthExpenses.length === 0) return null;

  const byCategory = sumByCategory(thisMonthExpenses);
  const topEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).at(0);
  if (!topEntry) return null;
  const [category, total] = topEntry;

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
    reasoning: `Compared ${thisMonthExpenses.length} expenses this month against last month's ${category} total${prevTotal > 0 ? ` of ${formatCents(prevTotal, currency)}` : ''}.`,
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

export function buildSavingsRateInsight(
  transactions: AnchorTransaction[],
  now: Date,
): Insight | null {
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
    reasoning: `Calculated from ${formatCents(income, currency)} income minus ${formatCents(expenses, currency)} expenses this month.`,
    trend,
    severity: savingsRate >= 20 ? 'positive' : savingsRate >= 0 ? 'neutral' : 'attention',
    metric: { current: savingsRate, previous: 0, unit: '%' },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}

export function buildDayOfWeekInsight(
  transactions: AnchorTransaction[],
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
    reasoning: `Analysed spending by day of week over the last 30 days. ${highSpend.dayName} averaged ${pct}% above the daily mean.`,
    trend: 'stable',
    severity: 'attention',
    metric: { current: highSpend.value, previous: overallAvg, unit: currency },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}

export function buildSubscriptionInsight(
  recurring: RecurringTransaction[],
  currency: 'NGN' | 'USD',
  now: Date,
): Insight | null {
  const subs = recurring.filter(
    (r) => r.status === 'active' && r.frequency === 'monthly' && r.type === 'expense',
  );
  if (subs.length === 0) return null;

  const totalCents = subs.reduce((sum, r) => sum + r.amountCents, 0);

  return {
    id: 'insight-subscriptions',
    category: 'spending',
    headline: `${subs.length} active subscription${subs.length === 1 ? '' : 's'} — ${formatCents(totalCents, currency)}/month`,
    detail: subs.length <= 4
      ? `${subs.map((s) => s.title).join(', ')}.`
      : `Including ${subs.slice(0, 3).map((s) => s.title).join(', ')} and ${subs.length - 3} more.`,
    reasoning: `Found ${subs.length} active monthly recurring expense${subs.length === 1 ? '' : 's'} totalling ${formatCents(totalCents, currency)}.`,
    trend: 'stable',
    severity: 'neutral',
    metric: { current: Number((totalCents / 100).toFixed(2)), previous: 0, unit: currency },
    actionLink: '/finance',
    createdAt: now.toISOString(),
  };
}
