import { describe, expect, it } from 'vitest';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ParsedIntent,
  RecurringTransaction,
} from '../../../../types';
import { correlationQuery, dayOfWeekQuery, savingsRateQuery } from '../../query/insightQueries';
import type { RunFabricQueryInput } from '../../query/types';

type CompletionProfile = 'high' | 'low';

interface WeekProfile {
  completion: CompletionProfile;
  discretionaryCents: number;
}

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
    intent: makeIntent('query_savings_rate'),
    input: 'test query',
    transactions: [],
    commitments: [],
    accounts: [] as AnchorAccount[],
    recurring: [] as RecurringTransaction[],
    now,
    ...overrides,
  };
}

function getWeekdayDate(base: Date, targetDay: number, weeksAgo: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() - weeksAgo * 7);
  const diff = targetDay - d.getDay();
  d.setDate(d.getDate() + diff);
  d.setHours(12, 0, 0, 0);
  return d;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildCorrelationFixture(currentNow: Date, profiles: WeekProfile[]): {
  transactions: AnchorTransaction[];
  tasks: AnchorTask[];
} {
  const transactions: AnchorTransaction[] = [];
  const tasks: AnchorTask[] = [];
  const thisMonday = getMonday(currentNow);
  let eligibleTaskCount = 0;

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const weeksAgo = profiles.length - 1 - i;
    const weekStart = new Date(thisMonday);
    weekStart.setDate(weekStart.getDate() - weeksAgo * 7);

    const completedCount = profile.completion === 'high'
      ? Math.max(3, Math.ceil((eligibleTaskCount * 0.7) / 0.3))
      : 1;

    for (let j = 0; j < completedCount; j++) {
      const completedAt = new Date(weekStart);
      completedAt.setDate(completedAt.getDate() + (j % 7));
      completedAt.setHours(12, 0, 0, 0);

      tasks.push(
        makeTask({
          id: `task-${i}-${j}`,
          createdAt: weekStart,
          completed: true,
          lastCompletedAt: completedAt.toISOString(),
        }),
      );
    }

    eligibleTaskCount += completedCount;

    const txDate = new Date(weekStart);
    txDate.setDate(txDate.getDate() + 2);
    txDate.setHours(12, 0, 0, 0);
    transactions.push(
      makeTx({
        id: `tx-${i}`,
        date: txDate.toISOString(),
        amountCents: profile.discretionaryCents,
        category: 'Food',
        type: 'expense',
      }),
    );
  }

  return { transactions, tasks };
}

describe('insight query handlers', () => {
  it('returns no-income savings result when income is zero', () => {
    const result = savingsRateQuery(
      makeInput({
        transactions: [makeTx({ type: 'expense', amountCents: 10_000, date: '2026-03-04T10:00:00.000Z' })],
      }),
    );

    expect(result.summary).toBe('No income recorded this month yet');
    expect(result.visualizable).toBe(false);
  });

  it('returns savings benchmark detail for 20%+ savings rate', () => {
    const result = savingsRateQuery(
      makeInput({
        transactions: [
          makeTx({ id: 'tx-inc', type: 'income', amountCents: 100_000, date: '2026-03-04T10:00:00.000Z' }),
          makeTx({ id: 'tx-exp', type: 'expense', amountCents: 70_000, date: '2026-03-06T10:00:00.000Z' }),
        ],
      }),
    );

    expect(result.summary).toContain('saving 30%');
    expect(result.detail).toContain('above the 20% savings benchmark');
  });

  it('returns mid-range savings detail for 10% to 19%', () => {
    const result = savingsRateQuery(
      makeInput({
        transactions: [
          makeTx({ id: 'tx-inc', type: 'income', amountCents: 100_000, date: '2026-03-04T10:00:00.000Z' }),
          makeTx({ id: 'tx-exp', type: 'expense', amountCents: 85_000, date: '2026-03-06T10:00:00.000Z' }),
        ],
      }),
    );

    expect(result.summary).toContain('saving 15%');
    expect(result.detail).toContain('Decent');
  });

  it('returns low-positive savings detail for 0% to 9%', () => {
    const result = savingsRateQuery(
      makeInput({
        transactions: [
          makeTx({ id: 'tx-inc', type: 'income', amountCents: 100_000, date: '2026-03-04T10:00:00.000Z' }),
          makeTx({ id: 'tx-exp', type: 'expense', amountCents: 95_000, date: '2026-03-06T10:00:00.000Z' }),
        ],
      }),
    );

    expect(result.summary).toContain('saving 5%');
    expect(result.detail).toContain('below the 20% benchmark');
  });

  it('returns negative savings detail when expenses exceed income', () => {
    const result = savingsRateQuery(
      makeInput({
        transactions: [
          makeTx({ id: 'tx-inc', type: 'income', amountCents: 100_000, date: '2026-03-04T10:00:00.000Z' }),
          makeTx({ id: 'tx-exp', type: 'expense', amountCents: 120_000, date: '2026-03-06T10:00:00.000Z' }),
        ],
      }),
    );

    expect(result.summary).toContain('saving -20%');
    expect(result.detail).toContain('Expenses exceed income this month');
  });

  it('returns no day-of-week signal when there is insufficient history', () => {
    const result = dayOfWeekQuery(
      makeInput({
        intent: makeIntent('query_day_of_week'),
        transactions: [],
        commitments: [],
      }),
    );

    expect(result.summary).toContain('Not enough data yet');
    expect(result.visualizable).toBe(false);
  });

  it('returns combined day-of-week signal when spending and completion patterns exist', () => {
    const transactions: AnchorTransaction[] = [];
    const commitments: AnchorTask[] = [];

    for (let week = 0; week < 10; week++) {
      const monday = getWeekdayDate(now, 1, week);
      const tuesday = getWeekdayDate(now, 2, week);
      const wednesday = getWeekdayDate(now, 3, week);

      transactions.push(makeTx({ id: `tx-m-${week}`, date: monday.toISOString(), amountCents: 10_000 }));
      transactions.push(makeTx({ id: `tx-t-${week}`, date: tuesday.toISOString(), amountCents: 1000 }));
      commitments.push(
        makeTask({ id: `task-w1-${week}`, type: 'daily', lastCompletedAt: wednesday.toISOString() }),
      );
      commitments.push(
        makeTask({ id: `task-w2-${week}`, type: 'daily', lastCompletedAt: wednesday.toISOString() }),
      );
    }

    const result = dayOfWeekQuery(
      makeInput({
        intent: makeIntent('query_day_of_week'),
        transactions,
        commitments,
      }),
    );

    expect(result.summary).toContain('highest-spend day');
    expect(result.summary).toContain('strongest completion day');
    expect(result.detail).toContain('while commitment follow-through is strongest');
    expect(result.visualizable).toBe(true);
  });

  it('returns one-line day-of-week summary without detail when only one signal exists', () => {
    const transactions: AnchorTransaction[] = [];
    for (let week = 0; week < 10; week++) {
      const monday = getWeekdayDate(now, 1, week);
      const tuesday = getWeekdayDate(now, 2, week);
      transactions.push(makeTx({ id: `tx-m-${week}`, date: monday.toISOString(), amountCents: 10_000 }));
      transactions.push(makeTx({ id: `tx-t-${week}`, date: tuesday.toISOString(), amountCents: 1000 }));
    }

    const result = dayOfWeekQuery(
      makeInput({
        intent: makeIntent('query_day_of_week'),
        transactions,
        commitments: [],
      }),
    );

    expect(result.summary).toContain('highest-spend day');
    expect(result.detail).toBeUndefined();
  });

  it('returns minimum-data response when correlation has fewer than 8 buckets', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];
    const fixture = buildCorrelationFixture(now, profiles);

    const result = correlationQuery(
      makeInput({
        intent: makeIntent('query_correlation'),
        transactions: fixture.transactions,
        commitments: fixture.tasks,
      }),
    );

    expect(result.summary).toContain('Need at least 8 weeks');
    expect(result.visualizable).toBe(false);
  });

  it('returns no-pattern response when correlation difference is weak', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 1800 },
      { completion: 'high', discretionaryCents: 1800 },
      { completion: 'high', discretionaryCents: 1800 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];
    const fixture = buildCorrelationFixture(now, profiles);

    const result = correlationQuery(
      makeInput({
        intent: makeIntent('query_correlation'),
        transactions: fixture.transactions,
        commitments: fixture.tasks,
      }),
    );

    expect(result.summary).toContain('No consistent pattern found yet');
    expect(result.visualizable).toBe(false);
  });

  it('returns correlation pattern summary when spread and consistency thresholds are met', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];
    const fixture = buildCorrelationFixture(now, profiles);

    const result = correlationQuery(
      makeInput({
        intent: makeIntent('query_correlation'),
        transactions: fixture.transactions,
        commitments: fixture.tasks,
      }),
    );

    expect(result.summary).toContain('discretionary spending is about');
    expect(result.detail).toContain('Pattern held in');
    expect(result.visualizable).toBe(true);
  });
});