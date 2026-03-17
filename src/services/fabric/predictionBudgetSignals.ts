import type { Prediction } from '../../types';
import { detectPrimaryCurrency, formatCents, monthKey, sumByCategory, toDate } from './fabricUtils';
import { inMonth, nextIso } from './predictionCommon';
import type { PredictionInput } from './predictionTypes';

export function buildBudgetAndBurnSignals(input: PredictionInput): Prediction[] {
  const { now } = input;
  const year = now.getFullYear();
  const month = now.getMonth();
  const mKey = monthKey(now);
  const currency = detectPrimaryCurrency(input.transactions);
  const results: Prediction[] = [];

  const expenses = input.transactions.filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted);
  const thisMonthExpenses = expenses.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && inMonth(d, year, month);
  });
  const thisMonth = thisMonthExpenses.reduce((sum, tx) => sum + tx.amountCents, 0);

  const lastMonthDate = new Date(year, month - 1, 1);
  const lastMonth = expenses
    .filter((tx) => {
      const d = toDate(tx.date);
      return !!d && inMonth(d, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  if (lastMonth > 0 && thisMonth > lastMonth * 1.2) {
    const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    results.push({
      id: `pred-budget-overage-${mKey}`,
      type: 'budget_overage',
      message: `Spending is ${pct}% above last month.`,
      detail: `This month: ${formatCents(thisMonth, currency)} vs last month: ${formatCents(lastMonth, currency)}.`,
      severity: 'warning',
      confidence: 0.82,
      actionable: true,
      action: { label: 'Review spending', navigateTo: '/finance' },
      expiresAt: nextIso(now, 3),
      createdAt: now.toISOString(),
    });
  }

  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthProgress = dayOfMonth / daysInMonth;

  if (monthProgress > 0.1 && lastMonth > 0) {
    const lastMonthByCategory = sumByCategory(
      expenses.filter((tx) => {
        const d = toDate(tx.date);
        return !!d && inMonth(d, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
      }),
    );
    const thisMonthByCategory = sumByCategory(thisMonthExpenses);

    for (const [category, spent] of Object.entries(thisMonthByCategory)) {
      const typical = lastMonthByCategory[category] ?? 0;
      if (typical === 0) continue;
      const projected = spent / monthProgress;
      if (projected <= typical * 1.3) continue;

      results.push({
        id: `pred-burn-rate-${category.toLowerCase().replace(/\s+/g, '-')}-${mKey}`,
        type: 'budget_overage',
        message: `${category} spend is running high.`,
        detail: `On pace for ${formatCents(Math.round(projected), currency)} vs typical ${formatCents(typical, currency)} last month.`,
        severity: 'warning',
        confidence: 0.72,
        actionable: true,
        action: { label: 'View transactions', navigateTo: '/finance' },
        expiresAt: nextIso(now, 2),
        createdAt: now.toISOString(),
      });
      break;
    }
  }

  return results;
}
