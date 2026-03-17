import { describe, expect, it } from 'vitest';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ParsedIntent,
  RecurringTransaction,
} from '../../../../types';
import {
  accountsSummary,
  familySummary,
  incomeSummary,
  netWorthSummary,
  recordTransactionQuery,
  recurringSummary,
  spendingSummary,
} from '../../query/financeQueries';
import type { RunFabricQueryInput } from '../../query/types';

const now = new Date('2026-03-15T12:00:00.000Z');

function makeIntent(action: ParsedIntent['action'], entities: ParsedIntent['entities'] = {}): ParsedIntent {
  return {
    action,
    confidence: 0.9,
    entities,
    rawInput: 'test query',
  };
}

function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: 'tx-1',
    title: 'Transaction',
    amountCents: 1000,
    type: 'expense',
    category: 'Food',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: now.toISOString(),
    ...overrides,
  };
}

function makeAccount(overrides: Partial<AnchorAccount>): AnchorAccount {
  return {
    id: 'acc-1',
    name: 'Main',
    type: 'checking',
    currency: 'USD',
    balanceCents: 100_000,
    color: '#111111',
    scope: 'personal',
    ...overrides,
  };
}

function makeRecurring(overrides: Partial<RecurringTransaction>): RecurringTransaction {
  return {
    id: 'rec-1',
    title: 'Rent',
    amountCents: 50_000,
    type: 'expense',
    category: 'Housing',
    accountId: 'acc-1',
    frequency: 'monthly',
    interval: 1,
    nextRunAt: '2026-03-18T00:00:00.000Z',
    status: 'active',
    userId: 'user-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeInput(overrides: Partial<RunFabricQueryInput>): RunFabricQueryInput {
  return {
    intent: makeIntent('query_spending', { timePeriod: 'this_month' }),
    input: 'test query',
    transactions: [],
    commitments: [] as AnchorTask[],
    accounts: [],
    recurring: [],
    now,
    ...overrides,
  };
}

describe('financeQueries', () => {
  it('returns category-filtered spending totals', () => {
    const result = spendingSummary(
      makeInput({
        intent: makeIntent('query_spending', { timePeriod: 'this_month', category: 'food' }),
        transactions: [
          makeTx({ id: 'tx-a', category: 'Food', amountCents: 4000 }),
          makeTx({ id: 'tx-b', category: 'Food Delivery', amountCents: 3500 }),
          makeTx({ id: 'tx-c', category: 'Transport', amountCents: 2000 }),
        ],
      }),
    );

    expect(result.summary.toLowerCase()).toContain('on food');
    expect(result.visualizable).toBe(true);
    expect(result.data).toEqual({ totalCents: 7500, count: 2, category: 'food' });
  });

  it('returns category detail when no matching expenses exist', () => {
    const result = spendingSummary(
      makeInput({
        intent: makeIntent('query_spending', { timePeriod: 'this_month', category: 'travel' }),
        transactions: [makeTx({ id: 'tx-a', category: 'Food', amountCents: 4000 })],
      }),
    );

    expect(result.visualizable).toBe(false);
    expect(result.detail).toContain('No travel expenses found');
  });

  it('summarizes spending with top category for unfiltered queries', () => {
    const result = spendingSummary(
      makeInput({
        transactions: [
          makeTx({ id: 'tx-a', category: 'Food', amountCents: 5000 }),
          makeTx({ id: 'tx-b', category: 'Food', amountCents: 2000 }),
          makeTx({ id: 'tx-c', category: 'Transport', amountCents: 1500 }),
          makeTx({ id: 'tx-d', isSoftDeleted: true, amountCents: 9999 }),
          makeTx({ id: 'tx-e', date: '2026-01-15T12:00:00.000Z', amountCents: 8888 }),
        ],
      }),
    );

    expect(result.summary).toContain('You spent');
    expect(result.detail).toContain('Top category: Food');
    expect(result.visualizable).toBe(true);
  });

  it('returns no-expenses summary when period has no expense records', () => {
    const result = spendingSummary(
      makeInput({
        transactions: [makeTx({ id: 'tx-a', type: 'income', amountCents: 100_000 })],
      }),
    );

    expect(result.summary).toContain('No expenses found');
    expect(result.visualizable).toBe(false);
  });

  it('reports income totals when income exists', () => {
    const result = incomeSummary(
      makeInput({
        intent: makeIntent('query_income', { timePeriod: 'this_month' }),
        transactions: [
          makeTx({ id: 'tx-a', type: 'income', amountCents: 80_000 }),
          makeTx({ id: 'tx-b', type: 'income', amountCents: 20_000 }),
        ],
      }),
    );

    expect(result.summary).toContain('You earned');
    expect(result.summary).toContain('2 income transactions');
    expect(result.visualizable).toBe(true);
  });

  it('returns no-income summary when none exists', () => {
    const result = incomeSummary(
      makeInput({
        intent: makeIntent('query_income', { timePeriod: 'this_month' }),
        transactions: [makeTx({ id: 'tx-a', type: 'expense' })],
      }),
    );

    expect(result.summary).toContain('No income recorded');
    expect(result.visualizable).toBe(false);
  });

  it('returns empty-accounts guidance when all accounts are archived', () => {
    const result = accountsSummary(
      makeInput({
        intent: makeIntent('query_accounts'),
        accounts: [makeAccount({ id: 'acc-archived', isArchived: true })],
      }),
    );

    expect(result.summary).toContain('No accounts found');
    expect(result.visualizable).toBe(false);
  });

  it('summarizes active accounts with highest balance detail', () => {
    const result = accountsSummary(
      makeInput({
        intent: makeIntent('query_accounts'),
        accounts: [
          makeAccount({ id: 'acc-1', name: 'Main', balanceCents: 120_000 }),
          makeAccount({ id: 'acc-2', name: 'Savings', balanceCents: 500_000 }),
          makeAccount({ id: 'acc-3', name: 'Old', balanceCents: 30_000, isArchived: true }),
        ],
      }),
    );

    expect(result.summary).toContain('You have 2 accounts');
    expect(result.detail).toContain('Highest balance: Savings');
    expect(result.visualizable).toBe(true);
  });

  it('returns no-active-recurring summary when all are paused', () => {
    const result = recurringSummary(
      makeInput({
        intent: makeIntent('query_recurring'),
        recurring: [makeRecurring({ id: 'rec-paused', status: 'paused' })],
      }),
    );

    expect(result.summary).toContain('No active recurring transactions found');
    expect(result.visualizable).toBe(false);
  });

  it('summarizes active recurring items and next due item', () => {
    const result = recurringSummary(
      makeInput({
        intent: makeIntent('query_recurring'),
        recurring: [
          makeRecurring({ id: 'rec-rent', title: 'Rent', amountCents: 50_000, frequency: 'monthly' }),
          makeRecurring({ id: 'rec-net', title: 'Internet', amountCents: 10_000, frequency: 'monthly' }),
          makeRecurring({ id: 'rec-annual', title: 'Domain', amountCents: 12_000, frequency: 'yearly' }),
        ],
      }),
    );

    expect(result.summary).toContain('3 active recurring transactions');
    expect(result.summary).toContain('/month');
    expect(result.detail).toContain('Next due: Rent');
    expect(result.visualizable).toBe(true);
  });

  it('returns no-family-data summary when no shared transactions exist', () => {
    const result = familySummary(
      makeInput({
        intent: makeIntent('query_family', { timePeriod: 'this_month' }),
        transactions: [makeTx({ id: 'tx-a', scope: 'personal' })],
      }),
    );

    expect(result.summary).toContain('No shared family transactions found');
    expect(result.visualizable).toBe(false);
  });

  it('summarizes family transactions and shared expenses', () => {
    const result = familySummary(
      makeInput({
        intent: makeIntent('query_family', { timePeriod: 'this_month' }),
        transactions: [
          makeTx({ id: 'tx-a', scope: 'family', type: 'expense', amountCents: 9000 }),
          makeTx({ id: 'tx-b', scope: 'family', type: 'income', amountCents: 5000 }),
        ],
      }),
    );

    expect(result.summary).toContain('2 shared transactions');
    expect(result.summary).toContain('in shared expenses');
    expect(result.visualizable).toBe(true);
  });

  it('returns net-worth guidance when no active accounts exist', () => {
    const result = netWorthSummary(
      makeInput({
        intent: makeIntent('query_net_worth'),
        accounts: [],
      }),
    );

    expect(result.summary).toContain('Add accounts in Finance to track your net worth');
    expect(result.visualizable).toBe(false);
  });

  it('summarizes net worth with liabilities breakdown', () => {
    const result = netWorthSummary(
      makeInput({
        intent: makeIntent('query_net_worth'),
        accounts: [
          makeAccount({ id: 'acc-1', balanceCents: 200_000 }),
          makeAccount({ id: 'acc-2', balanceCents: -50_000, type: 'investment' }),
        ],
      }),
    );

    expect(result.summary).toContain('Your net worth is');
    expect(result.detail).toContain('Assets:');
    expect(result.detail).toContain('Liabilities:');
    expect(result.visualizable).toBe(true);
  });

  it('builds a prefilled expense record response when amount is provided', () => {
    const result = recordTransactionQuery(
      makeInput({
        intent: makeIntent('record_expense', { amount: 32.5, category: 'Food' }),
      }),
    );

    expect(result.summary).toContain('Ready to log an expense');
    expect(result.actions?.[0].type).toBe('record_transaction');
    expect(result.data).toEqual({ amount: 32.5, category: 'Food', type: 'expense' });
  });

  it('opens generic transaction form when no amount is provided', () => {
    const result = recordTransactionQuery(
      makeInput({
        intent: makeIntent('record_income'),
      }),
    );

    expect(result.summary).toBe('Opening transaction form.');
    expect(result.data).toEqual({ amount: undefined, category: undefined, type: 'income' });
  });
});