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
      recurring: [],
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
      recurring: [],
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(insights.some((item) => item.category === 'commitments')).toBe(true);
  });
});

describe('buildInsights — day-of-week insight', () => {
  function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
    return {
      id: 'tx-' + Math.random().toString(36).slice(2, 8),
      title: 'Expense',
      amountCents: 1000,
      type: 'expense',
      category: 'Food',
      accountId: 'acc-1',
      currency: 'USD',
      scope: 'personal',
      date: new Date().toISOString(),
      ...overrides,
    };
  }

  // 2026-03-15 is Sunday (day 0)
  const now = new Date('2026-03-15T12:00:00.000Z');

  function buildSpendingFixture(spikeDow: number, spikeAmount: number, baseAmount: number): AnchorTransaction[] {
    const txns: AnchorTransaction[] = [];
    for (let i = 0; i <= 90; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      const amount = d.getDay() === spikeDow ? spikeAmount : baseAmount;
      txns.push(makeTx({ date: d.toISOString(), amountCents: amount }));
    }
    return txns;
  }

  it('returns null when no meaningful signal exists', () => {
    // Uniform spending — no spike day
    const txns = buildSpendingFixture(-1, 1000, 1000);
    const insights = buildInsights({
      feature: 'finance',
      transactions: txns,
      commitments: [],
      recurring: [],
      now,
    });

    const dowInsight = insights.find((i) => i.id === 'insight-high-spend-day');
    expect(dowInsight).toBeUndefined();
  });

  it('contains correct day name and percentages when signal is strong', () => {
    // Saturday (day 6) spike — 3x normal
    const txns = buildSpendingFixture(6, 3000, 1000);
    const insights = buildInsights({
      feature: 'finance',
      transactions: txns,
      commitments: [],
      recurring: [],
      now,
    });

    const dowInsight = insights.find((i) => i.id === 'insight-high-spend-day');
    expect(dowInsight).toBeDefined();
    expect(dowInsight!.category).toBe('patterns');
    expect(dowInsight!.headline).toContain('Saturday');
    expect(dowInsight!.detail).toContain('%');
    expect(dowInsight!.severity).toBe('attention');
  });

  it('appears in dashboard insights when signal is strong', () => {
    const txns = buildSpendingFixture(6, 3000, 1000);
    const insights = buildInsights({
      feature: 'dashboard',
      transactions: txns,
      commitments: [],
      recurring: [],
      now,
    });

    const dowInsight = insights.find((i) => i.id === 'insight-high-spend-day');
    expect(dowInsight).toBeDefined();
  });
});
