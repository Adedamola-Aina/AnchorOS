import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import { buildDailyBriefing } from '../DailyBriefingEngine';

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

/**
 * Generate 90 days of expense transactions.
 * `spikeDow` gets `spikeAmount`, all other days get `baseAmount`.
 */
function buildSpendingFixture(
  now: Date,
  spikeDow: number,
  spikeAmount: number,
  baseAmount: number,
): AnchorTransaction[] {
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

/**
 * Generate 90 days of daily task completions only on `completionDow`.
 */
function buildCompletionFixture(now: Date, completionDow: number): AnchorTask[] {
  const tasks: AnchorTask[] = [];
  for (let i = 0; i <= 90; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(12, 0, 0, 0);
    if (d.getDay() === completionDow) {
      tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
      tasks.push(makeTask({ lastCompletedAt: d.toISOString(), type: 'daily' }));
    }
  }
  return tasks;
}

// ── dayInsight tests ─────────────────────────────────────────────

describe('buildDailyBriefing dayInsight', () => {
  // 2026-03-15 is a Sunday (day 0)
  const now = new Date('2026-03-15T12:00:00.000Z');

  it('returns dayInsight when today is the high-spend day', () => {
    // Sunday (day 0) is the spike day, and now is Sunday
    const txns = buildSpendingFixture(now, 0, 3000, 1000);

    const result = buildDailyBriefing('morning', txns, [], [], now);

    expect(result.dayInsight).toBeDefined();
    expect(result.dayInsight).toContain('highest-spend day');
    expect(result.dayInsight).toContain('% above');
  });

  it('returns dayInsight when today is best completion day', () => {
    // Sunday (day 0) completions only, now is Sunday
    const tasks = buildCompletionFixture(now, 0);
    // Uniform spending so no high-spend signal triggers
    const txns: AnchorTransaction[] = [];
    for (let i = 0; i <= 90; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(12, 0, 0, 0);
      txns.push(makeTx({ date: d.toISOString(), amountCents: 1000 }));
    }

    const result = buildDailyBriefing('morning', txns, tasks, [], now);

    expect(result.dayInsight).toBeDefined();
    expect(result.dayInsight).toContain('strongest day');
    expect(result.dayInsight).toContain('% of tasks');
  });

  it('returns undefined dayInsight on a neutral day', () => {
    // Spike on Saturday (day 6), but today is Sunday (day 0) — no match
    const txns = buildSpendingFixture(now, 6, 3000, 1000);

    const result = buildDailyBriefing('morning', txns, [], [], now);

    expect(result.dayInsight).toBeUndefined();
  });

  it('high spend day takes priority over best completion day when both apply', () => {
    // Both spike on Sunday (day 0)
    const txns = buildSpendingFixture(now, 0, 3000, 1000);
    const tasks = buildCompletionFixture(now, 0);

    const result = buildDailyBriefing('morning', txns, tasks, [], now);

    expect(result.dayInsight).toBeDefined();
    expect(result.dayInsight).toContain('highest-spend day');
    // Should NOT contain completion message
    expect(result.dayInsight).not.toContain('strongest day');
  });
});
