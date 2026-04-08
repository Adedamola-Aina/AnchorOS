import { describe, it, expect } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import { buildMonthlyReview } from '../MonthlyReviewEngine';

function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: 'tx-1',
    userId: 'u1',
    title: 'Test',
    amountCents: 1000,
    currency: 'USD',
    type: 'expense',
    category: 'Food',
    date: '2026-02-15',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
    source: 'manual',
    isSoftDeleted: false,
    ...overrides,
  } as AnchorTransaction;
}

function makeTask(overrides: Partial<AnchorTask>): AnchorTask {
  return {
    id: 'task-1',
    userId: 'u1',
    title: 'Exercise',
    type: 'daily',
    category: 'health',
    completed: false,
    currentStreak: 0,
    bestStreak: 0,
    createdAt: '2026-02-01T00:00:00Z',
    ...overrides,
  } as AnchorTask;
}

describe('buildMonthlyReview', () => {
  const now = new Date('2026-03-05T12:00:00Z');

  it('returns review for the previous month', () => {
    const txns = [
      makeTx({ id: 't1', type: 'income', amountCents: 500000, date: '2026-02-01' }),
      makeTx({ id: 't2', type: 'expense', amountCents: 200000, category: 'Food', date: '2026-02-10' }),
      makeTx({ id: 't3', type: 'expense', amountCents: 100000, category: 'Transport', date: '2026-02-20' }),
    ];
    const result = buildMonthlyReview({ transactions: txns, commitments: [], now });
    expect(result.month).toBe('2026-02');
    expect(result.financeSummary.totalIncomeCents).toBe(500000);
    expect(result.financeSummary.totalExpenseCents).toBe(300000);
    expect(result.financeSummary.savingsRatePercent).toBe(40);
  });

  it('returns top 3 categories by spend', () => {
    const txns = [
      makeTx({ id: 't1', amountCents: 50000, category: 'Food', date: '2026-02-01' }),
      makeTx({ id: 't2', amountCents: 30000, category: 'Transport', date: '2026-02-05' }),
      makeTx({ id: 't3', amountCents: 20000, category: 'Entertainment', date: '2026-02-10' }),
      makeTx({ id: 't4', amountCents: 10000, category: 'Other', date: '2026-02-15' }),
    ];
    const result = buildMonthlyReview({ transactions: txns, commitments: [], now });
    expect(result.financeSummary.topCategories).toHaveLength(3);
    expect(result.financeSummary.topCategories[0].name).toBe('Food');
  });

  it('includes commitment summary', () => {
    const tasks = [
      makeTask({ id: 'c1', completed: true }),
      makeTask({ id: 'c2', completed: true }),
      makeTask({ id: 'c3', completed: false }),
    ];
    const result = buildMonthlyReview({ transactions: [], commitments: tasks, now });
    expect(result.commitmentSummary.completed).toBe(2);
    expect(result.commitmentSummary.total).toBe(3);
    expect(result.commitmentSummary.completionRatePercent).toBeCloseTo(66.7, 0);
  });

  it('handles zero income gracefully', () => {
    const txns = [
      makeTx({ id: 't1', amountCents: 10000, category: 'Food', date: '2026-02-10' }),
    ];
    const result = buildMonthlyReview({ transactions: txns, commitments: [], now });
    expect(result.financeSummary.savingsRatePercent).toBe(0);
  });

  it('ignores transactions outside the review month', () => {
    const txns = [
      makeTx({ id: 't1', amountCents: 50000, date: '2026-01-15' }), // too early
      makeTx({ id: 't2', amountCents: 30000, date: '2026-02-15' }), // in range
      makeTx({ id: 't3', amountCents: 20000, date: '2026-03-05' }), // too late
    ];
    const result = buildMonthlyReview({ transactions: txns, commitments: [], now });
    expect(result.financeSummary.totalExpenseCents).toBe(30000);
  });
});
