import { describe, expect, it } from 'vitest';
import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ParsedIntent,
  RecurringTransaction,
} from '../../../../types';
import { commitmentsSummary, weekSummary } from '../../query/commitmentQueries';
import { planWeek, todayQuery, upcomingQuery } from '../../query/planningQueries';
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

function makeRecurring(overrides: Partial<RecurringTransaction>): RecurringTransaction {
  return {
    id: 'rec-1',
    title: 'Bill',
    amountCents: 10_000,
    type: 'expense',
    category: 'Housing',
    accountId: 'acc-1',
    frequency: 'monthly',
    interval: 1,
    nextRunAt: '2026-03-17T00:00:00.000Z',
    status: 'active',
    userId: 'user-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeInput(overrides: Partial<RunFabricQueryInput>): RunFabricQueryInput {
  return {
    intent: makeIntent('query_today'),
    input: 'test query',
    transactions: [],
    commitments: [],
    accounts: [] as AnchorAccount[],
    recurring: [],
    now,
    ...overrides,
  };
}

describe('planning and commitment query handlers', () => {
  it('returns no-task summary for today when nothing is scheduled', () => {
    const result = todayQuery(makeInput({ commitments: [] }));

    expect(result.summary).toContain('No scheduled tasks today');
    expect(result.actions?.[0].payload).toEqual({ page: 'commitments' });
  });

  it('returns all-done summary for today when pending count is zero', () => {
    const result = todayQuery(
      makeInput({
        commitments: [makeTask({ id: 'task-a', completed: true })],
      }),
    );

    expect(result.summary).toContain('All 1 tasks done for today');
  });

  it('returns pending summary and due-today detail for today query', () => {
    const result = todayQuery(
      makeInput({
        commitments: [
          makeTask({ id: 'task-a', title: 'Read', completed: true }),
          makeTask({ id: 'task-b', title: 'Workout', completed: false }),
        ],
        recurring: [
          makeRecurring({ id: 'rec-today', title: 'Rent', nextRunAt: '2026-03-15T08:00:00.000Z' }),
          makeRecurring({ id: 'rec-soon', title: 'Internet', nextRunAt: '2026-03-16T08:00:00.000Z' }),
        ],
      }),
    );

    expect(result.summary).toContain('1 task remaining today');
    expect(result.detail).toContain('Due today: Rent');
  });

  it('returns streak detail when there are no bills due today', () => {
    const result = todayQuery(
      makeInput({
        commitments: [makeTask({ title: 'Read', completed: false, currentStreak: 5 })],
        recurring: [makeRecurring({ title: 'Gym', nextRunAt: '2026-03-22T08:00:00.000Z' })],
      }),
    );

    expect(result.detail).toContain('Keep your "Read" streak going');
  });

  it('returns no-upcoming summary when there are no active upcoming items', () => {
    const result = upcomingQuery(
      makeInput({
        intent: makeIntent('query_upcoming'),
        recurring: [makeRecurring({ status: 'paused' })],
      }),
    );

    expect(result.summary).toContain('No upcoming bills or payments');
    expect(result.visualizable).toBe(false);
  });

  it('formats upcoming items with today/tomorrow/in-days labels', () => {
    const result = upcomingQuery(
      makeInput({
        intent: makeIntent('query_upcoming'),
        recurring: [
          makeRecurring({ id: 'rec-a', title: 'Card', amountCents: 5000, nextRunAt: '2026-03-15T08:00:00.000Z' }),
          makeRecurring({ id: 'rec-b', title: 'Data', amountCents: 3000, nextRunAt: '2026-03-16T08:00:00.000Z' }),
          makeRecurring({ id: 'rec-c', title: 'School', amountCents: 0, nextRunAt: '2026-03-18T08:00:00.000Z' }),
        ],
      }),
    );

    expect(result.summary).toContain('3 upcoming payments');
    expect(result.detail).toContain('Card (today');
    expect(result.detail).toContain('Data (tomorrow');
    expect(result.detail).toContain('School (in 3 days');
  });

  it('returns plan-week summary with upcoming detail when upcoming exists', () => {
    const result = planWeek(
      makeInput({
        intent: makeIntent('plan_week'),
        transactions: [
          makeTx({ id: 'tx-expense', type: 'expense', amountCents: 15_000, date: '2026-03-11T10:00:00.000Z' }),
          makeTx({ id: 'tx-income', type: 'income', amountCents: 50_000, date: '2026-03-12T10:00:00.000Z' }),
        ],
        commitments: [
          makeTask({ id: 'task-a', completed: true }),
          makeTask({ id: 'task-b', completed: false }),
        ],
        recurring: [makeRecurring({ title: 'Rent', nextRunAt: '2026-03-17T08:00:00.000Z' })],
      }),
    );

    expect(result.summary).toContain('This week:');
    expect(result.summary).toContain('earned');
    expect(result.detail).toContain('Coming up:');
  });

  it('returns momentum encouragement detail for high daily completion rate', () => {
    const result = planWeek(
      makeInput({
        intent: makeIntent('plan_week'),
        commitments: [
          makeTask({ id: 'task-a', completed: true }),
          makeTask({ id: 'task-b', completed: true }),
          makeTask({ id: 'task-c', completed: true }),
          makeTask({ id: 'task-d', completed: true }),
          makeTask({ id: 'task-e', completed: false }),
        ],
        recurring: [],
      }),
    );

    expect(result.detail).toContain('Great momentum');
  });

  it('returns habit-focus detail for low daily completion rate', () => {
    const result = planWeek(
      makeInput({
        intent: makeIntent('plan_week'),
        commitments: [
          makeTask({ id: 'task-a', completed: true }),
          makeTask({ id: 'task-b', completed: false }),
          makeTask({ id: 'task-c', completed: false }),
          makeTask({ id: 'task-d', completed: false }),
        ],
        recurring: [],
      }),
    );

    expect(result.detail).toContain('Focus on building consistency');
  });

  it('returns high-consistency commitments detail at 80%+', () => {
    const result = commitmentsSummary(
      makeInput({
        intent: makeIntent('query_commitments', { timePeriod: 'this_month' }),
        commitments: [
          makeTask({ id: 'task-a', completed: true }),
          makeTask({ id: 'task-b', completed: true }),
          makeTask({ id: 'task-c', completed: true }),
          makeTask({ id: 'task-d', completed: true }),
          makeTask({ id: 'task-e', completed: false }),
        ],
      }),
    );

    expect(result.summary).toContain('80%');
    expect(result.detail).toContain('Great consistency');
  });

  it('returns medium-consistency commitment guidance between 50% and 79%', () => {
    const result = commitmentsSummary(
      makeInput({
        intent: makeIntent('query_commitments', { timePeriod: 'this_month' }),
        commitments: [
          makeTask({ id: 'task-a', completed: true }),
          makeTask({ id: 'task-b', completed: false }),
        ],
      }),
    );

    expect(result.summary).toContain('50%');
    expect(result.detail).toContain('boost this');
  });

  it('falls back to all commitments when date-filtered set is empty', () => {
    const result = commitmentsSummary(
      makeInput({
        intent: makeIntent('query_commitments', { timePeriod: 'this_week' }),
        commitments: [
          makeTask({ id: 'task-a', completed: true, createdAt: new Date('2025-01-01T00:00:00.000Z') }),
          makeTask({ id: 'task-b', completed: false, createdAt: new Date('2025-01-02T00:00:00.000Z') }),
          makeTask({ id: 'task-c', completed: false, createdAt: new Date('2025-01-03T00:00:00.000Z') }),
        ],
      }),
    );

    expect(result.summary).toContain('33% (1/3)');
    expect(result.detail).toContain('narrowing your active commitments');
  });

  it('returns positive week summary detail when income exceeds spending', () => {
    const result = weekSummary(
      makeInput({
        intent: makeIntent('summarize_week'),
        transactions: [
          makeTx({ id: 'tx-a', type: 'expense', amountCents: 15_000, date: '2026-03-14T12:00:00.000Z' }),
          makeTx({ id: 'tx-b', type: 'income', amountCents: 30_000, date: '2026-03-13T12:00:00.000Z' }),
        ],
        commitments: [
          makeTask({ id: 'task-a', completed: true }),
          makeTask({ id: 'task-b', completed: false }),
        ],
      }),
    );

    expect(result.summary).toContain('This week:');
    expect(result.detail).toContain("ahead");
  });

  it('omits week summary detail when spending is not below income', () => {
    const result = weekSummary(
      makeInput({
        intent: makeIntent('summarize_week'),
        transactions: [
          makeTx({ id: 'tx-a', type: 'expense', amountCents: 25_000, date: '2026-03-14T12:00:00.000Z' }),
          makeTx({ id: 'tx-b', type: 'income', amountCents: 20_000, date: '2026-03-13T12:00:00.000Z' }),
        ],
        commitments: [makeTask({ id: 'task-a', completed: true })],
      }),
    );

    expect(result.summary).toContain('This week:');
    expect(result.detail).toBeUndefined();
  });
});