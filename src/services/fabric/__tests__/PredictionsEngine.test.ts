import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction, UserPattern } from '../../../types';
import { buildPredictions } from '../PredictionsEngine';

describe('buildPredictions', () => {
  it('builds budget overage and recurring due predictions', () => {
    const transactions: AnchorTransaction[] = [
      {
        id: 'tx-1',
        title: 'Food',
        amountCents: 10000,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        currency: 'USD',
        scope: 'personal',
        date: '2026-02-05T10:00:00.000Z',
      },
      {
        id: 'tx-2',
        title: 'Food',
        amountCents: 22000,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        currency: 'USD',
        scope: 'personal',
        date: '2026-03-05T10:00:00.000Z',
      },
    ];

    const patterns: UserPattern[] = [
      {
        id: 'seed-finance-rent',
        trigger: { type: 'transaction_recorded', category: 'Rent' },
        followUpAction: { type: 'review_budget', category: 'Rent' },
        frequency: 3,
        confidence: 0.77,
        lastOccurred: '2026-03-01T00:00:00.000Z',
        averageDelayMs: 0,
        dismissed: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      },
    ];

    const predictions = buildPredictions({
      patterns,
      transactions,
      commitments: [],
      now: new Date('2026-03-03T10:00:00.000Z'),
    });

    expect(predictions.some((item) => item.type === 'budget_overage')).toBe(true);
    expect(predictions.some((item) => item.type === 'recurring_due')).toBe(true);
  });

  it('builds streak risk prediction for unfinished daily commitments', () => {
    const commitments: AnchorTask[] = [
      {
        id: 'task-1',
        title: 'Workout',
        type: 'daily',
        completed: false,
        category: 'personal',
        createdAt: new Date('2026-03-07T10:00:00.000Z'),
      },
    ];

    const predictions = buildPredictions({
      patterns: [],
      transactions: [],
      commitments,
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(predictions.some((item) => item.type === 'streak_at_risk')).toBe(true);
  });

  it('does not throw when high-confidence pattern action has no category field', () => {
    const predictions = buildPredictions({
      patterns: [
        {
          id: 'p-no-category',
          trigger: { type: 'app_opened' },
          followUpAction: { type: 'view_page', page: 'finance' },
          frequency: 4,
          confidence: 0.8,
          lastOccurred: '2026-03-02T00:00:00.000Z',
          averageDelayMs: 0,
          dismissed: 0,
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-02T00:00:00.000Z',
        },
      ],
      transactions: [],
      commitments: [],
      now: new Date('2026-03-03T10:00:00.000Z'),
    });

    expect(Array.isArray(predictions)).toBe(true);
  });
});
