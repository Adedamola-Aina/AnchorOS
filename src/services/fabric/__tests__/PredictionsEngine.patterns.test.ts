import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction, UserPattern } from '../../../types';
import { buildPredictions } from '../PredictionsEngine';

function makeTransaction(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: 'tx-' + Math.random().toString(36).slice(2, 8),
    title: 'Test tx',
    amountCents: 1000,
    type: 'expense',
    category: 'Food',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: '2026-03-10T10:00:00.000Z',
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
    createdAt: new Date('2026-03-01T10:00:00.000Z'),
    ...overrides,
  };
}

function basePattern(overrides: Partial<UserPattern>): UserPattern {
  return {
    id: 'pattern-1',
    trigger: { type: 'app_opened' },
    followUpAction: { type: 'review_budget', category: 'Food' },
    frequency: 4,
    confidence: 0.8,
    lastOccurred: '2026-03-10T00:00:00.000Z',
    averageDelayMs: 0,
    dismissed: 0,
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-10T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildPatternInformedPredictions via buildPredictions', () => {
  it('time_of_day pattern within 2h produces commitment_reminder', () => {
    const now = new Date('2026-03-15T10:30:00.000Z');
    const patterns: UserPattern[] = [
      basePattern({
        trigger: { type: 'time_of_day', hour: 9 },
        followUpAction: { type: 'check_commitment' },
      }),
    ];

    const predictions = buildPredictions({
      patterns,
      transactions: [],
      commitments: [],
      now,
    });

    const pred = predictions.find((p) => p.id.startsWith('pred-pattern-time-9-'));
    expect(pred).toBeDefined();
    expect(pred!.type).toBe('commitment_reminder');
  });

  it('time_of_day pattern more than 2h away produces nothing', () => {
    const now = new Date('2026-03-15T10:30:00.000Z');
    const patterns: UserPattern[] = [
      basePattern({
        trigger: { type: 'time_of_day', hour: 2 },
        followUpAction: { type: 'check_commitment' },
      }),
    ];

    const predictions = buildPredictions({
      patterns,
      transactions: [],
      commitments: [],
      now,
    });

    expect(predictions.some((p) => p.id.startsWith('pred-pattern-time-'))).toBe(false);
  });

  it('transaction_recorded pattern with elevated category produces budget_overage', () => {
    const now = new Date('2026-03-15T10:30:00.000Z');
    const patterns: UserPattern[] = [
      basePattern({
        trigger: { type: 'transaction_recorded', category: 'Food' },
      }),
    ];

    const transactions: AnchorTransaction[] = [
      makeTransaction({ category: 'Food', amountCents: 10000, date: '2026-02-10T10:00:00.000Z' }),
      makeTransaction({ category: 'Food', amountCents: 15000, date: '2026-03-10T10:00:00.000Z' }),
    ];

    const predictions = buildPredictions({
      patterns,
      transactions,
      commitments: [],
      now,
    });

    const pred = predictions.find((p) => p.id.startsWith('pred-pattern-category-food-'));
    expect(pred).toBeDefined();
    expect(pred!.type).toBe('budget_overage');
  });

  it('transaction_recorded pattern with normal category produces nothing', () => {
    const now = new Date('2026-03-15T10:30:00.000Z');
    const patterns: UserPattern[] = [
      basePattern({
        trigger: { type: 'transaction_recorded', category: 'Food' },
      }),
    ];

    const transactions: AnchorTransaction[] = [
      makeTransaction({ category: 'Food', amountCents: 10000, date: '2026-02-10T10:00:00.000Z' }),
      makeTransaction({ category: 'Food', amountCents: 10000, date: '2026-03-10T10:00:00.000Z' }),
    ];

    const predictions = buildPredictions({
      patterns,
      transactions,
      commitments: [],
      now,
    });

    expect(predictions.some((p) => p.id.startsWith('pred-pattern-category-food-'))).toBe(false);
  });

  it('commitment_completed pattern with incomplete task produces reminder', () => {
    const now = new Date('2026-03-15T10:30:00.000Z');
    const task = makeTask({ id: 'task-a', title: 'Workout', completed: false, type: 'daily' });
    const patterns: UserPattern[] = [
      basePattern({
        trigger: { type: 'commitment_completed', commitmentId: 'task-a' },
        followUpAction: { type: 'check_commitment', commitmentId: 'task-a' },
      }),
    ];

    const predictions = buildPredictions({
      patterns,
      transactions: [],
      commitments: [task],
      now,
    });

    const pred = predictions.find((p) => p.id.startsWith('pred-pattern-commitment-task-a-'));
    expect(pred).toBeDefined();
    expect(pred!.type).toBe('commitment_reminder');
  });

  it('commitment_completed pattern with completed task produces nothing', () => {
    const now = new Date('2026-03-15T10:30:00.000Z');
    const task = makeTask({ id: 'task-a', title: 'Workout', completed: true, type: 'daily' });
    const patterns: UserPattern[] = [
      basePattern({
        trigger: { type: 'commitment_completed', commitmentId: 'task-a' },
        followUpAction: { type: 'check_commitment', commitmentId: 'task-a' },
      }),
    ];

    const predictions = buildPredictions({
      patterns,
      transactions: [],
      commitments: [task],
      now,
    });

    expect(predictions.some((p) => p.id.startsWith('pred-pattern-commitment-task-a-'))).toBe(false);
  });

  it('enforces cap of two pattern predictions in final list', () => {
    const now = new Date('2026-03-15T10:30:00.000Z');
    const patterns: UserPattern[] = [
      basePattern({ id: 'p-1', trigger: { type: 'time_of_day', hour: 10 }, followUpAction: { type: 'check_commitment' } }),
      basePattern({ id: 'p-2', trigger: { type: 'time_of_day', hour: 9 }, followUpAction: { type: 'review_budget', category: 'Food' } }),
      basePattern({ id: 'p-3', trigger: { type: 'time_of_day', hour: 11 }, followUpAction: { type: 'check_commitment' } }),
    ];

    const predictions = buildPredictions({
      patterns,
      transactions: [],
      commitments: [],
      now,
    });

    const patternCount = predictions.filter((p) => p.id.startsWith('pred-pattern-')).length;
    expect(patternCount).toBeLessThanOrEqual(2);
  });
});
