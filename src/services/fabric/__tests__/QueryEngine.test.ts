import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction, ParsedIntent } from '../../../types';
import { runFabricQuery } from '../QueryEngine';

const transactions: AnchorTransaction[] = [
  {
    id: 'tx-1',
    title: 'Groceries',
    amountCents: 2500,
    type: 'expense',
    category: 'Food',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: '2026-03-02T10:00:00.000Z',
  },
  {
    id: 'tx-2',
    title: 'Salary',
    amountCents: 100000,
    type: 'income',
    category: 'Salary',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: '2026-03-03T10:00:00.000Z',
  },
  {
    id: 'tx-3',
    title: 'Transport',
    amountCents: 1800,
    type: 'expense',
    category: 'Transport',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: '2026-03-04T10:00:00.000Z',
  },
];

const commitments: AnchorTask[] = [
  {
    id: 'task-1',
    title: 'Read',
    type: 'daily',
    completed: true,
    category: 'personal',
    createdAt: new Date('2026-03-02T10:00:00.000Z'),
  },
  {
    id: 'task-2',
    title: 'Workout',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date('2026-03-03T10:00:00.000Z'),
  },
];

describe('runFabricQuery', () => {
  it('returns spending summary for query_spending intent', () => {
    const intent: ParsedIntent = {
      action: 'query_spending',
      confidence: 0.9,
      entities: { timePeriod: 'this_month' },
      rawInput: 'how much did i spend this month',
    };

    const result = runFabricQuery({
      intent,
      input: intent.rawInput,
      transactions,
      commitments,
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(result.summary.toLowerCase()).toContain('spent');
    expect(result.summary).toContain('$43.00');
    expect(result.visualizable).toBe(true);
  });

  it('returns commitments summary for query_commitments intent', () => {
    const intent: ParsedIntent = {
      action: 'query_commitments',
      confidence: 0.8,
      entities: { timePeriod: 'this_week' },
      rawInput: 'how are my commitments this week',
    };

    const result = runFabricQuery({
      intent,
      input: intent.rawInput,
      transactions,
      commitments,
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(result.summary.toLowerCase()).toContain('commitment');
    expect(result.summary).toContain('50%');
    expect(result.visualizable).toBe(true);
  });

  it('returns fallback for unknown intent', () => {
    const intent: ParsedIntent = {
      action: 'unknown',
      confidence: 0,
      entities: {},
      rawInput: 'tell me something random',
    };

    const result = runFabricQuery({
      intent,
      input: intent.rawInput,
      transactions,
      commitments,
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(result.summary.toLowerCase()).toContain('couldn\'t map');
    expect(result.visualizable).toBe(false);
  });
});
