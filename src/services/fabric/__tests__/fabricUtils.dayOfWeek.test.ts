import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import {
  buildWeekBuckets,
  getBestCompletionDay,
  getCompletionByDayOfWeek,
  getHighSpendDay,
  getSpendingByDayOfWeek,
} from '../fabricUtils';

// ── Helpers ──────────────────────────────────────────────────────

function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: 'tx-' + Math.random().toString(36).slice(2, 8),
    title: 'Test expense',
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

function makeTask(overrides: Partial<AnchorTask>): AnchorTask {
  return {
    id: 'task-' + Math.random().toString(36).slice(2, 8),
    title: 'Test task',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: null,
    ...overrides,
  };
}

/** Generate a date string N days before `now`. */
function daysAgo(n: number, now: Date): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

// ── getSpendingByDayOfWeek ───────────────────────────────────────

describe('getSpendingByDayOfWeek', () => {
  // now = 2026-03-15 (Sunday)
  const now = new Date('2026-03-15T12:00:00.000Z');

  it('returns correct averages with known fixture data', () => {
    // Create transactions for 90 days (fills the full window)
    // Put heavier spend on Mondays (day 1)
    const txns: AnchorTransaction[] = [];

    // Walk back 90 days, placing an expense on each day
    for (let i = 0; i <= 90; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      const dow = d.getDay();
      // Mondays get 2000 cents, all others get 1000 cents
      const amount = dow === 1 ? 2000 : 1000;
      txns.push(makeTx({ date: d.toISOString(), amountCents: amount }));
    }

    const result = getSpendingByDayOfWeek(txns, now);

    // Monday average should be ~2000
    expect(result[1]).toBeCloseTo(2000, -1);
    // Other days should be ~1000
    expect(result[0]).toBeCloseTo(1000, -1);
    expect(result[2]).toBeCloseTo(1000, -1);
  });

  it('returns {} with fewer than 4 weeks of data', () => {
    // Only 20 days of data
    const txns: AnchorTransaction[] = [];
    for (let i = 1; i <= 20; i++) {
      txns.push(makeTx({ date: daysAgo(i, now) }));
    }

    const result = getSpendingByDayOfWeek(txns, now);
    expect(result).toEqual({});
  });

  it('excludes non-expense and soft-deleted transactions', () => {
    const txns: AnchorTransaction[] = [];
    for (let i = 1; i <= 60; i++) {
      txns.push(makeTx({ date: daysAgo(i, now), amountCents: 500 }));
    }
    // Add income and soft-deleted — these should be ignored
    txns.push(makeTx({ date: daysAgo(5, now), type: 'income', amountCents: 99999 }));
    txns.push(makeTx({ date: daysAgo(6, now), isSoftDeleted: true, amountCents: 99999 }));

    const result = getSpendingByDayOfWeek(txns, now);
    // All days should average around 500, not inflated
    for (const val of Object.values(result)) {
      expect(val).toBeLessThan(1000);
    }
  });
});

// ── getCompletionByDayOfWeek ─────────────────────────────────────

describe('getCompletionByDayOfWeek', () => {
  const now = new Date('2026-03-15T12:00:00.000Z');

  it('returns correct rates with fixture data', () => {
    // Create daily tasks with lastCompletedAt on various weekdays
    // 60 days of data, completions on Mondays only
    const tasks: AnchorTask[] = [];
    for (let i = 1; i <= 60; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      const dow = d.getDay();
      if (dow === 1) {
        // Monday completions
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
      }
    }

    const result = getCompletionByDayOfWeek(tasks, now);
    // Mondays should have a rate > 0
    expect(result[1]).toBeGreaterThan(0);
    // Other days should be 0 or undefined
    expect(result[0] ?? 0).toBe(0);
    expect(result[2] ?? 0).toBe(0);
  });

  it('returns {} with fewer than 14 days of completion data', () => {
    // Only 10 days of completion data
    const tasks: AnchorTask[] = [];
    for (let i = 1; i <= 10; i++) {
      tasks.push(makeTask({ lastCompletedAt: daysAgo(i, now), type: 'daily' }));
    }

    const result = getCompletionByDayOfWeek(tasks, now);
    expect(result).toEqual({});
  });

  it('caps completion rates at 1 when multiple completions happen on the same weekday', () => {
    const tasks: AnchorTask[] = [];
    for (let i = 1; i <= 42; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);

      if (d.getDay() === 1) {
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
      }
    }

    const result = getCompletionByDayOfWeek(tasks, now);
    expect(result[1]).toBe(1);
  });
});

// ── getHighSpendDay ──────────────────────────────────────────────

describe('getHighSpendDay', () => {
  const now = new Date('2026-03-15T12:00:00.000Z');

  it('returns null when difference is below 35%', () => {
    // Uniform spending — no day is 35% above average
    const txns: AnchorTransaction[] = [];
    for (let i = 1; i <= 60; i++) {
      txns.push(makeTx({ date: daysAgo(i, now), amountCents: 1000 }));
    }
    const result = getHighSpendDay(txns, now);
    expect(result).toBeNull();
  });

  it('returns correct day when difference >= 35%', () => {
    // Saturdays (day 6) get heavy spending
    const txns: AnchorTransaction[] = [];
    for (let i = 1; i <= 60; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      const dow = d.getDay();
      // Saturday gets 3x the spend → well above 35% of mean
      const amount = dow === 6 ? 3000 : 1000;
      txns.push(makeTx({ date: d.toISOString(), amountCents: amount }));
    }

    const result = getHighSpendDay(txns, now);
    expect(result).not.toBeNull();
    expect(result!.day).toBe(6);
    expect(result!.dayName).toBe('Saturday');
    expect(result!.vsAverage).toBeGreaterThanOrEqual(0.35);
    expect(result!.value).toBeGreaterThan(0);
  });

  it('requires at least 8 weeks of data', () => {
    // Only 40 days of data — less than 8 weeks (56 days)
    const txns: AnchorTransaction[] = [];
    for (let i = 1; i <= 40; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      const dow = d.getDay();
      const amount = dow === 6 ? 5000 : 1000;
      txns.push(makeTx({ date: d.toISOString(), amountCents: amount }));
    }
    const result = getHighSpendDay(txns, now);
    expect(result).toBeNull();
  });

  it('returns null when all weekday averages are zero', () => {
    const txns: AnchorTransaction[] = [];
    for (let i = 1; i <= 60; i++) {
      txns.push(makeTx({ date: daysAgo(i, now), amountCents: 0 }));
    }

    const result = getHighSpendDay(txns, now);
    expect(result).toBeNull();
  });
});

// ── getBestCompletionDay ─────────────────────────────────────────

describe('getBestCompletionDay', () => {
  const now = new Date('2026-03-15T12:00:00.000Z');

  it('returns null when spread is below 15 percentage points', () => {
    // Completions spread evenly across all days — no meaningful gap
    const tasks: AnchorTask[] = [];
    for (let i = 1; i <= 60; i++) {
      tasks.push(makeTask({ lastCompletedAt: daysAgo(i, now), type: 'daily' }));
    }
    const result = getBestCompletionDay(tasks, now);
    expect(result).toBeNull();
  });

  it('returns correct day when spread is meaningful', () => {
    // Completions only on Wednesdays (day 3) — creates a large spread
    const tasks: AnchorTask[] = [];
    for (let i = 1; i <= 60; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      const dow = d.getDay();
      if (dow === 3) {
        // Multiple completions on Wednesdays
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
      }
    }
    const result = getBestCompletionDay(tasks, now);
    expect(result).not.toBeNull();
    expect(result!.day).toBe(3);
    expect(result!.dayName).toBe('Wednesday');
    expect(result!.value).toBeGreaterThan(0);
  });

  it('ignores non-daily task completions when computing best day', () => {
    const tasks: AnchorTask[] = [];

    for (let i = 1; i <= 70; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      const dow = d.getDay();

      if (dow === 3) {
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
      }

      if (dow === 5) {
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'weekly' }));
        tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'weekly' }));
      }
    }

    const result = getBestCompletionDay(tasks, now);
    expect(result).not.toBeNull();
    expect(result!.day).toBe(3);
    expect(result!.dayName).toBe('Wednesday');
  });
});

// ── buildWeekBuckets ─────────────────────────────────────────────

describe('buildWeekBuckets', () => {
  // 2026-03-15 is Sunday
  const now = new Date('2026-03-15T12:00:00.000Z');

  /** Get Monday midnight for the week containing `date`. */
  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  it('returns correct completion rates per week', () => {
    const txns: AnchorTransaction[] = [];
    const tasks: AnchorTask[] = [];
    const thisMonday = getMonday(now);

    // Week 0: 3/5 completed = 60%, Week 1: 5/5 = 100%
    for (let w = 0; w < 12; w++) {
      const weekStart = new Date(thisMonday);
      weekStart.setDate(weekStart.getDate() - w * 7);

      for (let d = 0; d < 5; d++) {
        const taskDate = new Date(weekStart);
        taskDate.setDate(taskDate.getDate() + d);
        taskDate.setHours(12, 0, 0, 0);
        const completed = w === 0 ? d < 3 : true;
        tasks.push(makeTask({
          createdAt: new Date('2025-01-01'),
          completed,
          lastCompletedAt: completed ? taskDate.toISOString() : undefined,
        }));
        txns.push(makeTx({ date: taskDate.toISOString(), category: 'Food' }));
      }
    }

    const buckets = buildWeekBuckets(txns, tasks, now, 12);
    expect(buckets.length).toBeGreaterThanOrEqual(2);

    // Most recent bucket uses cumulative eligible tasks:
    // completed this week = 3, eligible by week end = 12 weeks * 5 tasks = 60.
    const week0 = buckets.find((b) => b.weekStart.getTime() === thisMonday.getTime());
    if (week0) {
      expect(week0.completionRate).toBeCloseTo(0.05, 2);
    }
  });

  it('returns correct discretionary spend per week', () => {
    const txns: AnchorTransaction[] = [];
    const tasks: AnchorTask[] = [];
    const thisMonday = getMonday(now);

    for (let w = 0; w < 12; w++) {
      const weekStart = new Date(thisMonday);
      weekStart.setDate(weekStart.getDate() - w * 7);

      for (let d = 0; d < 5; d++) {
        const taskDate = new Date(weekStart);
        taskDate.setDate(taskDate.getDate() + d);
        taskDate.setHours(12, 0, 0, 0);
        tasks.push(makeTask({
          createdAt: new Date('2025-01-01'),
          completed: true,
          lastCompletedAt: taskDate.toISOString(),
        }));
        // 1000 cents per day, 5 discretionary transactions per week
        txns.push(makeTx({ date: taskDate.toISOString(), amountCents: 1000, category: 'Shopping' }));
      }
    }

    const buckets = buildWeekBuckets(txns, tasks, now, 12);
    const week0 = buckets.find((b) => b.weekStart.getTime() === thisMonday.getTime());
    expect(week0).toBeDefined();
    // 5 transactions × 1000 cents = 5000
    expect(week0!.discretionaryCents).toBe(5000);
  });

  it('excludes weeks with no tasks', () => {
    const txns: AnchorTransaction[] = [];
    const tasks: AnchorTask[] = [];
    const thisMonday = getMonday(now);

    // Only put tasks in weeks 0 and 1
    for (let w = 0; w < 2; w++) {
      const weekStart = new Date(thisMonday);
      weekStart.setDate(weekStart.getDate() - w * 7);
      for (let d = 0; d < 5; d++) {
        const taskDate = new Date(weekStart);
        taskDate.setDate(taskDate.getDate() + d);
        taskDate.setHours(12, 0, 0, 0);
        tasks.push(makeTask({
          createdAt: new Date('2025-01-01'),
          completed: true,
          lastCompletedAt: taskDate.toISOString(),
        }));
        txns.push(makeTx({ date: taskDate.toISOString(), category: 'Food' }));
      }
    }

    const buckets = buildWeekBuckets(txns, tasks, now, 12);
    // Should only have 2 buckets (weeks with tasks), not 12
    expect(buckets.length).toBe(2);
  });

  it('excludes weeks with no discretionary spend', () => {
    const txns: AnchorTransaction[] = [];
    const tasks: AnchorTask[] = [];
    const thisMonday = getMonday(now);

    for (let w = 0; w < 4; w++) {
      const weekStart = new Date(thisMonday);
      weekStart.setDate(weekStart.getDate() - w * 7);
      for (let d = 0; d < 5; d++) {
        const taskDate = new Date(weekStart);
        taskDate.setDate(taskDate.getDate() + d);
        taskDate.setHours(12, 0, 0, 0);
        tasks.push(makeTask({
          createdAt: new Date('2025-01-01'),
          completed: true,
          lastCompletedAt: taskDate.toISOString(),
        }));
        // Weeks 0,1: discretionary; Weeks 2,3: non-discretionary category
        const category = w < 2 ? 'Food' : 'Salary';
        txns.push(makeTx({ date: taskDate.toISOString(), category, type: w < 2 ? 'expense' : 'income' }));
      }
    }

    const buckets = buildWeekBuckets(txns, tasks, now, 4);
    // Only weeks with discretionary spend should appear
    expect(buckets.length).toBe(2);
  });
});
