import { describe, expect, it } from 'vitest';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ParsedIntent,
  RecurringTransaction,
} from '../../../types';
import { runFabricQuery } from '../QueryEngine';

const now = new Date('2026-03-15T12:00:00.000Z');

function makeIntent(action: ParsedIntent['action'], entities: ParsedIntent['entities'] = {}): ParsedIntent {
  return {
    action,
    confidence: 0.8,
    entities,
    rawInput: 'test route',
  };
}

function run(intent: ParsedIntent) {
  return runFabricQuery({
    intent,
    input: intent.rawInput,
    transactions: [] as AnchorTransaction[],
    commitments: [] as AnchorTask[],
    accounts: [] as AnchorAccount[],
    recurring: [] as RecurringTransaction[],
    now,
  });
}

function runWithData(params: {
  intent: ParsedIntent;
  transactions?: AnchorTransaction[];
  commitments?: AnchorTask[];
  accounts?: AnchorAccount[];
  recurring?: RecurringTransaction[];
}) {
  return runFabricQuery({
    intent: params.intent,
    input: params.intent.rawInput,
    transactions: params.transactions ?? ([] as AnchorTransaction[]),
    commitments: params.commitments ?? ([] as AnchorTask[]),
    accounts: params.accounts ?? ([] as AnchorAccount[]),
    recurring: params.recurring ?? ([] as RecurringTransaction[]),
    now,
  });
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

function makeTask(overrides: Partial<AnchorTask>): AnchorTask {
  return {
    id: 'task-1',
    title: 'Task',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    ...overrides,
  };
}

function makeAccount(overrides: Partial<AnchorAccount>): AnchorAccount {
  return {
    id: 'acc-1',
    name: 'Main',
    type: 'checking',
    currency: 'USD',
    balanceCents: 50_000,
    color: '#222222',
    scope: 'personal',
    ...overrides,
  };
}

function makeRecurring(overrides: Partial<RecurringTransaction>): RecurringTransaction {
  return {
    id: 'rec-1',
    title: 'Bill',
    amountCents: 12_000,
    type: 'expense',
    category: 'Utilities',
    accountId: 'acc-1',
    frequency: 'monthly',
    interval: 1,
    nextRunAt: '2026-03-17T08:00:00.000Z',
    status: 'active',
    userId: 'user-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('runFabricQuery route coverage', () => {
  it('routes navigate action when page is provided', () => {
    const result = run(makeIntent('navigate', { page: 'finance' }));

    expect(result.summary).toBe('Opening finance.');
    expect(result.actions?.[0].payload).toEqual({ page: 'finance' });
  });

  it('falls back when navigate action has no page', () => {
    const result = run(makeIntent('navigate'));

    expect(result.summary).toBe("That's not something I can help with yet.");
  });

  it('routes record_income action to transaction prefill query', () => {
    const result = run(makeIntent('record_income', { amount: 125, category: 'Salary' }));

    expect(result.summary).toContain('Ready to log an income');
    expect(result.actions?.[0].type).toBe('record_transaction');
  });

  it('routes record_expense action to transaction prefill query', () => {
    const result = run(makeIntent('record_expense', { amount: 25, category: 'Transport' }));

    expect(result.summary).toContain('Ready to log an expense');
    expect(result.actions?.[0].type).toBe('record_transaction');
  });

  it('routes query_accounts action', () => {
    const result = runWithData({
      intent: makeIntent('query_accounts'),
      accounts: [makeAccount({ name: 'Main', balanceCents: 100_000 })],
    });

    expect(result.summary).toContain('combined balance');
  });

  it('routes query_recurring action', () => {
    const result = runWithData({
      intent: makeIntent('query_recurring'),
      recurring: [makeRecurring({ title: 'Rent' })],
    });

    expect(result.summary).toContain('active recurring transaction');
  });

  it('routes query_family action', () => {
    const result = runWithData({
      intent: makeIntent('query_family', { timePeriod: 'this_month' }),
      transactions: [makeTx({ scope: 'family', amountCents: 8000, type: 'expense' })],
    });

    expect(result.summary).toContain('shared transactions');
  });

  it('routes query_net_worth action', () => {
    const result = runWithData({
      intent: makeIntent('query_net_worth'),
      accounts: [makeAccount({ balanceCents: 125_000 })],
    });

    expect(result.summary).toContain('net worth');
  });

  it('routes query_today action', () => {
    const result = runWithData({
      intent: makeIntent('query_today'),
      commitments: [makeTask({ completed: false })],
    });

    expect(result.summary).toContain('task remaining today');
  });

  it('routes query_upcoming action', () => {
    const result = runWithData({
      intent: makeIntent('query_upcoming'),
      recurring: [makeRecurring({ title: 'Internet' })],
    });

    expect(result.summary).toContain('upcoming payment');
  });

  it('routes plan_week action', () => {
    const result = runWithData({
      intent: makeIntent('plan_week'),
      transactions: [makeTx({ type: 'expense', amountCents: 2000 })],
      commitments: [makeTask({ completed: true })],
    });

    expect(result.summary).toContain('This week:');
  });

  it('routes summarize_week action', () => {
    const result = runWithData({
      intent: makeIntent('summarize_week'),
      transactions: [makeTx({ type: 'expense', amountCents: 2000 })],
      commitments: [makeTask({ completed: true })],
    });

    expect(result.summary).toContain('This week:');
    expect(result.summary).toContain('Commitments: 1/1 done');
  });

  it('routes query_day_of_week action', () => {
    const result = runWithData({
      intent: makeIntent('query_day_of_week'),
      transactions: [],
      commitments: [],
    });

    expect(result.summary).toContain('Not enough data yet');
  });

  it('routes query_correlation action', () => {
    const result = runWithData({
      intent: makeIntent('query_correlation'),
      transactions: [],
      commitments: [],
    });

    expect(result.summary).toContain('Need at least 8 weeks');
  });
});