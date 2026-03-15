import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import {
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
});
