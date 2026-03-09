import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import { buildWeeklyReport } from '../WeeklyReportEngine';

describe('buildWeeklyReport', () => {
  it('builds weekly report metrics from transactions and commitments', () => {
    const transactions: AnchorTransaction[] = [
      {
        id: 'tx-1',
        title: 'Salary',
        amountCents: 200000,
        type: 'income',
        category: 'Salary',
        accountId: 'acc-1',
        currency: 'USD',
        scope: 'personal',
        date: '2026-03-04T10:00:00.000Z',
      },
      {
        id: 'tx-2',
        title: 'Food',
        amountCents: 5000,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        currency: 'USD',
        scope: 'personal',
        date: '2026-03-05T10:00:00.000Z',
      },
    ];

    const commitments: AnchorTask[] = [
      {
        id: 'task-1',
        title: 'Workout',
        type: 'daily',
        completed: true,
        category: 'personal',
        createdAt: new Date('2026-03-05T10:00:00.000Z'),
        currentStreak: 4,
      },
      {
        id: 'task-2',
        title: 'Read',
        type: 'daily',
        completed: false,
        category: 'personal',
        createdAt: new Date('2026-03-06T10:00:00.000Z'),
      },
    ];

    const report = buildWeeklyReport({
      transactions,
      commitments,
      now: new Date('2026-03-09T10:00:00.000Z'),
    });

    expect(report.financeSummary.totalIncome).toBe(2000);
    expect(report.financeSummary.totalSpent).toBe(50);
    expect(report.commitmentSummary.completionRate).toBe(50);
    expect(report.commitmentSummary.longestStreak.days).toBe(4);
  });
});
