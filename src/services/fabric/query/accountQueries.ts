import type { FabricQueryResult } from '../../../types';
import {
  detectPrimaryCurrency,
  formatCents,
  formatPeriodLabel,
  getDateRange,
  toDate,
} from '../fabricUtils';
import type { RunFabricQueryInput } from './types';

export function accountsSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const active = input.accounts.filter((a) => !a.isArchived);
  if (active.length === 0) {
    return {
      data: null,
      summary: 'No accounts found. Add an account in Finance to get started.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const totalCents = active.reduce((sum, a) => sum + a.balanceCents, 0);
  const top = [...active].sort((a, b) => b.balanceCents - a.balanceCents).at(0);
  return {
    data: { accounts: active.length, totalCents },
    summary: `You have ${active.length} account${active.length === 1 ? '' : 's'} with a combined balance of ${formatCents(totalCents, currency)}.`,
    detail: top ? `Highest balance: ${top.name} at ${formatCents(top.balanceCents, currency)}.` : undefined,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

export function recurringSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const active = input.recurring.filter((r) => r.status === 'active');
  if (active.length === 0) {
    return {
      data: null,
      summary: 'No active recurring transactions found.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const totalMonthlyCents = active.filter((r) => r.frequency === 'monthly').reduce((sum, r) => sum + r.amountCents, 0);
  const upcoming = [...active].sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime()).at(0);

  return {
    data: { count: active.length, totalMonthlyCents },
    summary: `You have ${active.length} active recurring transaction${active.length === 1 ? '' : 's'}${totalMonthlyCents > 0 ? `, totalling ${formatCents(totalMonthlyCents, currency)}/month` : ''}.`,
    detail: upcoming ? `Next due: ${upcoming.title} on ${new Date(upcoming.nextRunAt).toLocaleDateString()}.` : undefined,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

export function familySummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const familyTxns = input.transactions.filter((tx) => {
    if (tx.scope !== 'family' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });

  if (familyTxns.length === 0) {
    return {
      data: null,
      summary: 'No shared family transactions found for that period.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const totalSpent = familyTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents, 0);
  return {
    data: { count: familyTxns.length, totalSpentCents: totalSpent },
    summary: `${familyTxns.length} shared transactions ${formatPeriodLabel(input.intent.entities.timePeriod)} — ${formatCents(totalSpent, currency)} in shared expenses.`,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

export function netWorthSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const active = input.accounts.filter((a) => !a.isArchived);
  if (active.length === 0) {
    return {
      data: null,
      summary: 'Add accounts in Finance to track your net worth.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const assets = active.filter((a) => a.balanceCents >= 0).reduce((s, a) => s + a.balanceCents, 0);
  const liabilities = active.filter((a) => a.balanceCents < 0).reduce((s, a) => s + Math.abs(a.balanceCents), 0);
  const net = assets - liabilities;

  return {
    data: { netCents: net, assetsCents: assets, liabilitiesCents: liabilities },
    summary: `Your net worth is ${formatCents(net, currency)} across ${active.length} account${active.length === 1 ? '' : 's'}.`,
    detail: liabilities > 0 ? `Assets: ${formatCents(assets, currency)} · Liabilities: ${formatCents(liabilities, currency)}.` : undefined,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}
