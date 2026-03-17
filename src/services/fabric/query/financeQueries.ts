import type { FabricQueryResult } from '../../../types';
import {
  detectPrimaryCurrency,
  formatCents,
  formatPeriodLabel,
  getDateRange,
  sumByCategory,
  toDate,
} from '../fabricUtils';
import type { RunFabricQueryInput } from './types';

export {
  accountsSummary,
  recurringSummary,
  familySummary,
  netWorthSummary,
} from './accountQueries';

export function spendingSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const expenses = input.transactions.filter((tx) => {
    if (tx.type !== 'expense' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });

  const categoryFilter = input.intent.entities.category;
  if (categoryFilter) {
    const filtered = expenses.filter((tx) => tx.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
    const filteredTotal = filtered.reduce((sum, tx) => sum + tx.amountCents, 0);
    return {
      data: { totalCents: filteredTotal, count: filtered.length, category: categoryFilter },
      summary: `You spent ${formatCents(filteredTotal, currency)} on ${categoryFilter} ${formatPeriodLabel(input.intent.entities.timePeriod)} across ${filtered.length} transaction${filtered.length === 1 ? '' : 's'}.`,
      detail: filtered.length === 0 ? `No ${categoryFilter} expenses found for that period.` : undefined,
      visualizable: filtered.length > 0,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const total = expenses.reduce((sum, tx) => sum + tx.amountCents, 0);
  const topCategory = Object.entries(sumByCategory(expenses)).sort((a, b) => b[1] - a[1]).at(0);
  const periodLabel = formatPeriodLabel(input.intent.entities.timePeriod);

  return {
    data: { totalCents: total, count: expenses.length, topCategory },
    summary: expenses.length === 0
      ? `No expenses found for ${periodLabel}.`
      : `You spent ${formatCents(total, currency)} ${periodLabel} across ${expenses.length} transaction${expenses.length === 1 ? '' : 's'}.`,
    detail: topCategory ? `Top category: ${topCategory[0]} at ${formatCents(topCategory[1], currency)}.` : undefined,
    visualizable: expenses.length > 0,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

export function incomeSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const incomes = input.transactions.filter((tx) => {
    if (tx.type !== 'income' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });
  const total = incomes.reduce((sum, tx) => sum + tx.amountCents, 0);
  const periodLabel = formatPeriodLabel(input.intent.entities.timePeriod);

  return {
    data: { totalCents: total, count: incomes.length },
    summary: incomes.length === 0
      ? `No income recorded for ${periodLabel}.`
      : `You earned ${formatCents(total, currency)} ${periodLabel} across ${incomes.length} income transaction${incomes.length === 1 ? '' : 's'}.`,
    visualizable: incomes.length > 0,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

export function recordTransactionQuery(input: RunFabricQueryInput): FabricQueryResult {
  const { amount, category } = input.intent.entities;
  const isExpense = input.intent.action === 'record_expense';
  return {
    data: { amount, category, type: isExpense ? 'expense' : 'income' },
    summary: amount
      ? `Ready to log a${isExpense ? 'n expense' : 'n income'} of ${formatCents(Math.round(amount * 100), detectPrimaryCurrency(input.transactions))}${category ? ` in ${category}` : ''}.`
      : 'Opening transaction form.',
    visualizable: false,
    actions: [{ label: 'Add Transaction', type: 'record_transaction', payload: { amount, category } }],
  };
}
