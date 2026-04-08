import { describe, it, expect } from 'vitest';
import type { AnchorGoal, AnchorTransaction } from '../../types';
import type { PredictionInput } from './predictionTypes';
import { buildGoalSignals } from './predictionGoalSignals';

function makeGoal(overrides: Partial<AnchorGoal>): AnchorGoal {
  return {
    id: 'goal-1',
    title: 'Emergency Fund',
    targetAmountCents: 100000,
    currentAmountCents: 50000,
    currency: 'USD',
    goalType: 'savings',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    ...overrides,
  };
}

function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: 'tx-1',
    userId: 'u1',
    title: 'Salary',
    amountCents: 5000,
    currency: 'USD',
    type: 'income',
    category: 'Salary',
    date: '2026-03-01',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    source: 'manual',
    isSoftDeleted: false,
    ...overrides,
  } as AnchorTransaction;
}

function makeInput(
  goals: AnchorGoal[],
  txns: AnchorTransaction[] = [],
  now?: Date,
): PredictionInput {
  return {
    patterns: [],
    transactions: txns,
    commitments: [],
    goals,
    now: now ?? new Date('2026-03-20T12:00:00Z'),
  };
}

describe('buildGoalSignals', () => {
  it('returns empty when no goals', () => {
    expect(buildGoalSignals(makeInput([]))).toEqual([]);
  });

  it('returns empty when goals undefined', () => {
    const input = { ...makeInput([]), goals: undefined };
    expect(buildGoalSignals(input)).toEqual([]);
  });

  it('returns goal_on_track for goal with sufficient savings rate', () => {
    // $500 remaining, goal in 6 months, net monthly savings of $200
    const goal = makeGoal({
      targetAmountCents: 100000,
      currentAmountCents: 95000,
      targetDate: '2026-09-20',
    });
    const txns = [
      makeTx({ id: 'i1', type: 'income', amountCents: 500000, date: '2026-02-01' }),
      makeTx({ id: 'e1', type: 'expense', amountCents: 300000, date: '2026-02-15' }),
    ];
    const result = buildGoalSignals(makeInput([goal], txns));
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('goal_on_track');
    expect(result[0].severity).toBe('info');
  });

  it('returns goal_at_risk when savings rate is too low', () => {
    // $900 remaining, goal in 1 month, net savings is low
    const goal = makeGoal({
      targetAmountCents: 100000,
      currentAmountCents: 10000,
      targetDate: '2026-04-20',
    });
    const txns = [
      makeTx({ id: 'i1', type: 'income', amountCents: 5000, date: '2026-02-01' }),
      makeTx({ id: 'e1', type: 'expense', amountCents: 4500, date: '2026-02-15' }),
    ];
    const result = buildGoalSignals(makeInput([goal], txns));
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('goal_at_risk');
    expect(result[0].severity).toBe('warning');
    expect(result[0].actionable).toBe(true);
  });

  it('skips goals without a target date', () => {
    const goal = makeGoal({ targetDate: undefined });
    const result = buildGoalSignals(makeInput([goal]));
    expect(result).toEqual([]);
  });

  it('skips already-completed goals', () => {
    const goal = makeGoal({
      targetAmountCents: 100000,
      currentAmountCents: 100000,
    });
    const result = buildGoalSignals(makeInput([goal]));
    expect(result).toEqual([]);
  });

  it('includes estimated completion in detail', () => {
    const goal = makeGoal({
      targetAmountCents: 100000,
      currentAmountCents: 50000,
      targetDate: '2026-12-20',
    });
    const txns = [
      makeTx({ id: 'i1', type: 'income', amountCents: 200000, date: '2026-02-01' }),
      makeTx({ id: 'e1', type: 'expense', amountCents: 150000, date: '2026-02-15' }),
    ];
    const result = buildGoalSignals(makeInput([goal], txns));
    expect(result.length).toBe(1);
    expect(result[0].detail).toContain('month');
  });

  it('caps at 3 goal signals', () => {
    const goals = Array.from({ length: 5 }, (_, i) =>
      makeGoal({
        id: `goal-${i}`,
        title: `Goal ${i}`,
        targetAmountCents: 100000,
        currentAmountCents: 10000,
        targetDate: '2026-04-20',
      }),
    );
    const txns = [
      makeTx({ id: 'i1', type: 'income', amountCents: 5000, date: '2026-02-01' }),
      makeTx({ id: 'e1', type: 'expense', amountCents: 4500, date: '2026-02-15' }),
    ];
    const result = buildGoalSignals(makeInput(goals, txns));
    expect(result.length).toBeLessThanOrEqual(3);
  });
});
