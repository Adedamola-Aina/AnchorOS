import { describe, expect, it } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../types';
import { buildInsights } from '../InsightsEngine';

type CompletionProfile = 'high' | 'low';

interface WeekProfile {
  completion: CompletionProfile;
  discretionaryCents: number;
}

let txCounter = 0;
let taskCounter = 0;

function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: `tx-${txCounter++}`,
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
    id: `task-${taskCounter++}`,
    title: 'Test task',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: null,
    ...overrides,
  };
}

/**
 * Get Monday midnight for the week containing `date`.
 */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Build weekly fixtures in chronological order (oldest -> newest).
 * Completion rate behavior mirrors buildWeekBuckets: completed this week / all eligible tasks.
 */
function buildCorrelationFixture(now: Date, profiles: WeekProfile[]): {
  transactions: AnchorTransaction[];
  tasks: AnchorTask[];
} {
  const transactions: AnchorTransaction[] = [];
  const tasks: AnchorTask[] = [];
  const thisMonday = getMonday(now);
  let eligibleTaskCount = 0;

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const weeksAgo = profiles.length - 1 - i;
    const weekStart = new Date(thisMonday);
    weekStart.setDate(weekStart.getDate() - weeksAgo * 7);

    const completedCount = profile.completion === 'high'
      ? Math.max(3, Math.ceil((eligibleTaskCount * 0.7) / 0.3))
      : 1;

    for (let j = 0; j < completedCount; j++) {
      const completedAt = new Date(weekStart);
      completedAt.setDate(completedAt.getDate() + (j % 7));
      completedAt.setHours(12, 0, 0, 0);

      tasks.push(makeTask({
        createdAt: weekStart,
        completed: true,
        lastCompletedAt: completedAt.toISOString(),
      }));
    }

    eligibleTaskCount += completedCount;

    const txDate = new Date(weekStart);
    txDate.setDate(txDate.getDate() + 2);
    txDate.setHours(12, 0, 0, 0);
    transactions.push(makeTx({
      date: txDate.toISOString(),
      amountCents: profile.discretionaryCents,
      category: 'Food',
      type: 'expense',
    }));
  }

  return { transactions, tasks };
}

function runCorrelation(now: Date, profiles: WeekProfile[]) {
  const { transactions, tasks } = buildCorrelationFixture(now, profiles);
  return buildInsights({
    feature: 'dashboard',
    transactions,
    commitments: tasks,
    recurring: [],
    now,
  }).find((i) => i.id === 'insight-correlation-finance-commitments');
}

describe('buildCorrelationInsight', () => {
  const now = new Date('2026-03-15T12:00:00.000Z');

  it('returns null with fewer than 8 weeks of data', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];

    const corr = runCorrelation(now, profiles);
    expect(corr).toBeUndefined();
  });

  it('returns null when spend difference is below 15%', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 1800 },
      { completion: 'high', discretionaryCents: 1800 },
      { completion: 'high', discretionaryCents: 1800 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];

    const corr = runCorrelation(now, profiles);
    expect(corr).toBeUndefined();
  });

  it('returns null when pattern held in fewer than 5 of 8 weeks', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2200 },
      { completion: 'low', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2200 },
      { completion: 'low', discretionaryCents: 2200 },
    ];

    const corr = runCorrelation(now, profiles);
    expect(corr).toBeUndefined();
  });

  it('returns correct headline with known fixture data', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];

    const corr = runCorrelation(now, profiles);
    expect(corr).toBeDefined();
    expect(corr!.category).toBe('patterns');
    expect(corr!.headline).toBe('When you follow through on habits, you spend 65% less');
  });

  it('sets trend to up when current week completion >= 70%', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'high', discretionaryCents: 700 },
    ];

    const corr = runCorrelation(now, profiles);
    expect(corr).toBeDefined();
    expect(corr!.trend).toBe('up');
    expect(corr!.severity).toBe('positive');
  });

  it('sets trend to stable when current week completion < 70%', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];

    const corr = runCorrelation(now, profiles);
    expect(corr).toBeDefined();
    expect(corr!.trend).toBe('stable');
    expect(corr!.severity).toBe('attention');
  });

  it('detail text contains correct avgHighSpend and avgLowSpend', () => {
    const profiles: WeekProfile[] = [
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'high', discretionaryCents: 700 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
      { completion: 'low', discretionaryCents: 2000 },
    ];

    const corr = runCorrelation(now, profiles);
    expect(corr).toBeDefined();
    expect(corr!.detail).toContain('$7.00');
    expect(corr!.detail).toContain('$20.00');
  });
});
