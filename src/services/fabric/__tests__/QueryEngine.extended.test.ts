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

function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: 'tx-' + Math.random().toString(36).slice(2, 8),
    title: 'Test transaction',
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
    id: 'task-' + Math.random().toString(36).slice(2, 8),
    title: 'Task',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date('2026-02-20T12:00:00.000Z'),
    ...overrides,
  };
}

function run(intent: ParsedIntent, transactions: AnchorTransaction[], commitments: AnchorTask[]) {
  return runFabricQuery({
    intent,
    input: intent.rawInput,
    transactions,
    commitments,
    accounts: [] as AnchorAccount[],
    recurring: [] as RecurringTransaction[],
    now,
  });
}

describe('runFabricQuery extended handlers', () => {
  it('savingsRateQuery returns correct summary and positive detail at 25%', () => {
    const result = run(
      {
        action: 'query_savings_rate',
        confidence: 0.8,
        entities: {},
        rawInput: "what's my savings rate",
      },
      [
        makeTx({ type: 'income', amountCents: 100000, date: '2026-03-03T10:00:00.000Z' }),
        makeTx({ type: 'expense', amountCents: 75000, date: '2026-03-04T10:00:00.000Z' }),
      ],
      [],
    );

    expect(result.summary).toBe("You're saving 25% of your income this month");
    expect(result.detail).toContain("above the 20% savings benchmark");
  });

  it('savingsRateQuery returns exceeds-income message for negative rate', () => {
    const result = run(
      {
        action: 'query_savings_rate',
        confidence: 0.8,
        entities: {},
        rawInput: "what's my savings rate",
      },
      [
        makeTx({ type: 'income', amountCents: 100000, date: '2026-03-03T10:00:00.000Z' }),
        makeTx({ type: 'expense', amountCents: 120000, date: '2026-03-04T10:00:00.000Z' }),
      ],
      [],
    );

    expect(result.detail).toBe('Expenses exceed income this month by $200.00');
  });

  it('savingsRateQuery returns no-income message when income is zero', () => {
    const result = run(
      {
        action: 'query_savings_rate',
        confidence: 0.8,
        entities: {},
        rawInput: "what's my savings rate",
      },
      [makeTx({ type: 'expense', amountCents: 10000, date: '2026-03-04T10:00:00.000Z' })],
      [],
    );

    expect(result.summary).toBe('No income recorded this month yet');
  });

  it('dayOfWeekQuery returns fallback when data is insufficient', () => {
    const result = run(
      {
        action: 'query_day_of_week',
        confidence: 0.8,
        entities: {},
        rawInput: 'which day do I spend most',
      },
      [],
      [],
    );

    expect(result.summary).toBe('Not enough data yet — check back after a few months');
  });

  it('correlationQuery returns fallback with fewer than 8 weeks', () => {
    const transactions: AnchorTransaction[] = [];
    const tasks: AnchorTask[] = [];

    for (let w = 0; w < 4; w++) {
      const d = new Date(now);
      d.setDate(d.getDate() - w * 7);
      d.setHours(12, 0, 0, 0);
      transactions.push(makeTx({ date: d.toISOString(), amountCents: 1000, category: 'Food' }));
      tasks.push(makeTask({ createdAt: new Date('2026-01-01T00:00:00.000Z'), lastCompletedAt: d.toISOString() }));
    }

    const result = run(
      {
        action: 'query_correlation',
        confidence: 0.8,
        entities: {},
        rawInput: 'how do my habits connect to my spending',
      },
      transactions,
      tasks,
    );

    expect(result.summary).toBe('Need at least 8 weeks of data to find patterns');
  });

  it('momentumQuery shows correct metric directions', () => {
    const transactions = [
      makeTx({ type: 'expense', amountCents: 20000, date: '2026-03-04T10:00:00.000Z' }),
      makeTx({ type: 'expense', amountCents: 10000, date: '2026-03-11T10:00:00.000Z' }),
      makeTx({ type: 'income', amountCents: 30000, date: '2026-03-12T10:00:00.000Z' }),
    ];

    const tasks: AnchorTask[] = [
      makeTask({ lastCompletedAt: '2026-03-04T09:00:00.000Z' }),
      makeTask({ lastCompletedAt: '2026-03-05T09:00:00.000Z' }),
      makeTask({ lastCompletedAt: '2026-03-10T09:00:00.000Z' }),
      makeTask({ lastCompletedAt: '2026-03-11T09:00:00.000Z' }),
      makeTask({ lastCompletedAt: '2026-03-11T10:00:00.000Z' }),
      makeTask({ lastCompletedAt: '2026-03-12T09:00:00.000Z' }),
      makeTask({ lastCompletedAt: '2026-03-13T09:00:00.000Z' }),
      makeTask({ lastCompletedAt: '2026-03-14T09:00:00.000Z' }),
      makeTask({}),
      makeTask({}),
    ];

    const result = run(
      {
        action: 'query_momentum',
        confidence: 0.8,
        entities: {},
        rawInput: 'how am i trending this week',
      },
      transactions,
      tasks,
    );

    expect(result.summary).toContain('habits up');
    expect(result.summary).toContain('spending down');
    expect(result.summary).toContain('net cash flow positive');
  });

  it('unknown action uses improved fallback with suggestions', () => {
    const result = run(
      {
        action: 'unknown',
        confidence: 0.15,
        entities: {},
        rawInput: 'what now?',
      },
      [],
      [],
    );

    expect(result.summary).toBe("I didn't quite catch that.");
    expect(result.detail).toContain("What's my savings rate?");
    expect(result.detail).toContain('Which day do I spend the most?');
  });
});
