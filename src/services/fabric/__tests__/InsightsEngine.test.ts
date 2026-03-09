import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import { buildInsights } from '../InsightsEngine';

describe('buildInsights', () => {
  const transactions: AnchorTransaction[] = [
    {
      id: 'tx-1',
      title: 'Food 1',
      amountCents: 2400,
      type: 'expense',
      category: 'Food',
      accountId: 'acc-1',
      currency: 'USD',
      scope: 'personal',
      date: '2026-03-02T10:00:00.000Z',
    },
    {
      id: 'tx-2',
      title: 'Food 2',
      amountCents: 3600,
      type: 'expense',
      category: 'Food',
      accountId: 'acc-1',
      currency: 'USD',
      scope: 'personal',
      date: '2026-03-03T10:00:00.000Z',
    },
  ];

  const commitments: AnchorTask[] = [
    {
      id: 'task-1',
      title: 'Workout',
      type: 'daily',
      completed: true,
      category: 'personal',
      createdAt: new Date('2026-03-02T10:00:00.000Z'),
    },
    {
      id: 'task-2',
      title: 'Read',
      type: 'daily',
      completed: false,
      category: 'personal',
      createdAt: new Date('2026-03-03T10:00:00.000Z'),
    },
  ];

  it('builds finance insights', () => {
    const insights = buildInsights({
      feature: 'finance',
      transactions,
      commitments,
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(insights.length).toBeGreaterThan(0);
    expect(insights.some((item) => item.category === 'spending')).toBe(true);
  });

  it('builds commitment insights', () => {
    const insights = buildInsights({
      feature: 'commitments',
      transactions,
      commitments,
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(insights.some((item) => item.category === 'commitments')).toBe(true);
  });
});
