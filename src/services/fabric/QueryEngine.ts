import type { AnchorTask, AnchorTransaction, FabricQueryResult, ParsedIntent } from '../../types';

interface RunFabricQueryInput {
  intent: ParsedIntent;
  input: string;
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}

function toDate(value: Date | string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function getDateRange(timePeriod: ParsedIntent['entities']['timePeriod'], now: Date): { start: Date; end: Date } {
  const end = new Date(now);
  const start = new Date(now);

  if (timePeriod === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'this_week' || timePeriod === 'last_week') {
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset + (timePeriod === 'last_week' ? -7 : 0));
    start.setHours(0, 0, 0, 0);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  if (timePeriod === 'last_month') {
    start.setMonth(start.getMonth() - 1);
  }
  end.setFullYear(start.getFullYear(), start.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function spendingSummary(input: RunFabricQueryInput): FabricQueryResult {
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const expenses = input.transactions.filter((tx) => {
    if (tx.type !== 'expense' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });

  const total = expenses.reduce((sum, tx) => sum + tx.amountCents, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, tx) => {
    const key = tx.category || 'General';
    acc[key] = (acc[key] || 0) + tx.amountCents;
    return acc;
  }, {});
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  return {
    data: { totalCents: total, count: expenses.length, topCategory },
    summary: `You spent ${formatMoney(total)} in the selected period across ${expenses.length} expense transactions.`,
    detail: topCategory ? `Top category was ${topCategory[0]} at ${formatMoney(topCategory[1])}.` : 'No spending categories found yet.',
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function commitmentsSummary(input: RunFabricQueryInput): FabricQueryResult {
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const filtered = input.commitments.filter((task) => {
    const date = toDate(task.createdAt ?? undefined);
    return !date || (date >= range.start && date <= range.end);
  });
  const tasks = filtered.length > 0 ? filtered : input.commitments;

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    data: { total, completed, rate },
    summary: `Commitment completion is ${rate}% (${completed}/${total}) for the selected period.`,
    detail: rate >= 80 ? 'Great consistency this period.' : 'You can boost this by completing one pending task today.',
    visualizable: true,
    actions: [{ label: 'Open Commitments', type: 'navigate', payload: { page: 'commitments' } }],
  };
}

export function runFabricQuery(input: RunFabricQueryInput): FabricQueryResult {
  if (input.intent.action === 'query_spending') return spendingSummary(input);
  if (input.intent.action === 'query_commitments') return commitmentsSummary(input);

  if (input.intent.action === 'navigate' && input.intent.entities.page) {
    return {
      data: null,
      summary: `Opening ${input.intent.entities.page}.`,
      visualizable: false,
      actions: [{ label: `Go to ${input.intent.entities.page}`, type: 'navigate', payload: { page: input.intent.entities.page } }],
    };
  }

  return {
    data: null,
    summary: "I couldn't map that request yet. Try one of the guided prompts.",
    detail: 'Supported: spending, commitments, and navigation intents.',
    visualizable: false,
    actions: [],
  };
}
