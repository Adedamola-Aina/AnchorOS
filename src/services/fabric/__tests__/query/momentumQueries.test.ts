import { describe, expect, it } from 'vitest';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ParsedIntent,
  RecurringTransaction,
} from '../../../../types';
import { momentumQuery } from '../../query/momentumQueries';
import type { RunFabricQueryInput } from '../../query/types';

const now = new Date('2026-03-15T12:00:00.000Z');

function makeIntent(action: ParsedIntent['action']): ParsedIntent {
  return {
    action,
    confidence: 0.9,
    entities: {},
    rawInput: 'test momentum',
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

function makeTask(overrides: Partial<AnchorTask>): AnchorTask {
  return {
    id: 'task-1',
    title: 'Task',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

function makeInput(overrides: Partial<RunFabricQueryInput>): RunFabricQueryInput {
  return {
    intent: makeIntent('query_momentum'),
    input: 'test momentum',
    transactions: [],
    commitments: [],
    accounts: [] as AnchorAccount[],
    recurring: [] as RecurringTransaction[],
    now,
    ...overrides,
  };
}

describe('momentumQuery', () => {
  it('handles zero eligible commitments and zero expense baseline', () => {
    const result = momentumQuery(
      makeInput({
        transactions: [],
        commitments: [
          makeTask({
            id: 'future-task',
            createdAt: new Date('2026-12-01T00:00:00.000Z'),
            lastCompletedAt: '2026-03-11T10:00:00.000Z',
          }),
        ],
      }),
    );

    expect(result.summary).toContain('habits up 0 pp');
    expect(result.summary).toContain('spending up 0%');
    expect(result.summary).toContain('net cash flow positive');
  });

  it('returns 100% spending increase when last week had no expenses', () => {
    const result = momentumQuery(
      makeInput({
        transactions: [
          makeTx({ id: 'tx-this-week', type: 'expense', amountCents: 20_000, date: '2026-03-12T10:00:00.000Z' }),
          makeTx({ id: 'tx-income', type: 'income', amountCents: 5_000, date: '2026-03-13T10:00:00.000Z' }),
        ],
        commitments: [],
      }),
    );

    expect(result.summary).toContain('spending up 100%');
    expect(result.summary).toContain('net cash flow negative');
    expect(result.detail).toContain('$-150.00');
  });

  it('uses completedAt field when available and reports downward trends', () => {
    const taskWithCompletedAt = {
      ...makeTask({
        id: 'task-with-completed-at',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
      completedAt: '2026-03-04T09:00:00.000Z',
    } as AnchorTask & { completedAt: string };

    const result = momentumQuery(
      makeInput({
        transactions: [
          makeTx({ id: 'tx-last-week', type: 'expense', amountCents: 30_000, date: '2026-03-04T10:00:00.000Z' }),
          makeTx({ id: 'tx-this-week', type: 'expense', amountCents: 10_000, date: '2026-03-11T10:00:00.000Z' }),
        ],
        commitments: [taskWithCompletedAt],
      }),
    );

    expect(result.summary).toContain('habits down');
    expect(result.summary).toContain('spending down');
  });
});