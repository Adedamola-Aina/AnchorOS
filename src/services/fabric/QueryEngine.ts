import type { AnchorTask, AnchorTransaction, FabricQueryResult, ParsedIntent } from '../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, sumByCategory, toDate } from './fabricUtils';

interface RunFabricQueryInput {
  intent: ParsedIntent;
  input: string;
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}

function spendingSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const expenses = input.transactions.filter((tx) => {
    if (tx.type !== 'expense' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });

  const total = expenses.reduce((sum, tx) => sum + tx.amountCents, 0);
  const byCategory = sumByCategory(expenses);

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).at(0);
  const periodLabel = input.intent.entities.timePeriod?.replace(/_/g, ' ') ?? 'selected period';

  // Check if the category filter was specified
  const categoryFilter = input.intent.entities.category;
  if (categoryFilter) {
    const filtered = expenses.filter(
      (tx) => tx.category?.toLowerCase().includes(categoryFilter.toLowerCase()),
    );
    const filteredTotal = filtered.reduce((sum, tx) => sum + tx.amountCents, 0);
    return {
      data: { totalCents: filteredTotal, count: filtered.length, category: categoryFilter },
      summary: `You spent ${formatCents(filteredTotal, currency)} on ${categoryFilter} ${periodLabel} across ${filtered.length} transaction${filtered.length === 1 ? '' : 's'}.`,
      detail: filtered.length === 0 ? `No ${categoryFilter} expenses found for that period.` : undefined,
      visualizable: filtered.length > 0,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  return {
    data: { totalCents: total, count: expenses.length, topCategory },
    summary: expenses.length === 0
      ? `No expenses found for ${periodLabel}.`
      : `You spent ${formatCents(total, currency)} ${periodLabel} across ${expenses.length} transaction${expenses.length === 1 ? '' : 's'}.`,
    detail: topCategory
      ? `Top category: ${topCategory[0]} at ${formatCents(topCategory[1], currency)}.`
      : undefined,
    visualizable: expenses.length > 0,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function commitmentsSummary(input: RunFabricQueryInput): FabricQueryResult {
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const filtered = input.commitments.filter((task) => {
    const date = toDate(task.createdAt ?? null);
    return !date || (date >= range.start && date <= range.end);
  });
  const tasks = filtered.length > 0 ? filtered : input.commitments;

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const bestStreak = tasks.reduce((max, t) => Math.max(max, t.currentStreak ?? 0), 0);

  return {
    data: { total, completed, rate, bestStreak },
    summary: `Commitment completion is ${rate}% (${completed}/${total}).`,
    detail: rate >= 80
      ? `Great consistency! Best streak: ${bestStreak} day${bestStreak === 1 ? '' : 's'}.`
      : rate >= 50
        ? 'You can boost this by completing one pending task today.'
        : 'Consider narrowing your active commitments to build momentum.',
    visualizable: true,
    actions: [{ label: 'Open Commitments', type: 'navigate', payload: { page: 'commitments' } }],
  };
}

function weekSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const weekStart = new Date(input.now);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekTxns = input.transactions.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && d >= weekStart;
  });
  const spent = weekTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents, 0);
  const income = weekTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountCents, 0);
  const completed = input.commitments.filter((t) => t.completed).length;
  const total = input.commitments.length;

  return {
    data: { spent, income, completed, total },
    summary: `This week: ${formatCents(spent, currency)} spent, ${formatCents(income, currency)} earned. Commitments: ${completed}/${total} done.`,
    detail: income > spent ? `You're ${formatCents(income - spent, currency)} ahead — good week!` : undefined,
    visualizable: true,
    actions: [
      { label: 'View Finance', type: 'navigate', payload: { page: 'finance' } },
      { label: 'View Commitments', type: 'navigate', payload: { page: 'commitments' } },
    ],
  };
}

export function runFabricQuery(input: RunFabricQueryInput): FabricQueryResult {
  const { action } = input.intent;

  if (action === 'query_spending') return spendingSummary(input);
  if (action === 'query_commitments') return commitmentsSummary(input);
  if (action === 'summarize_week') return weekSummary(input);

  if (action === 'navigate' && input.intent.entities.page) {
    const page = input.intent.entities.page;
    return {
      data: null,
      summary: `Opening ${page}.`,
      visualizable: false,
      actions: [{ label: `Go to ${page}`, type: 'navigate', payload: { page } }],
    };
  }

  if (action === 'record_expense' || action === 'record_income') {
    const { amount, category } = input.intent.entities;
    return {
      data: { amount, category, type: action === 'record_expense' ? 'expense' : 'income' },
      summary: amount
        ? `Ready to log a${action === 'record_expense' ? 'n expense' : 'n income'} of ${formatCents(Math.round(amount * 100), detectPrimaryCurrency(input.transactions))}${category ? ` in ${category}` : ''}.`
        : `Opening transaction form.`,
      visualizable: false,
      actions: [{ label: 'Add Transaction', type: 'record_transaction', payload: { amount, category } }],
    };
  }

  return {
    data: null,
    summary: "I couldn't map that request. Try: 'how much did I spend this week?', 'show my commitments', or 'go to finance'.",
    visualizable: false,
    actions: [],
  };
}
