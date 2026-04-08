import { describe, it, expect } from 'vitest';
import type { AnchorTransaction } from '../../../types';
import { calculateScenario } from '../ScenarioCalculator';

function makeTx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: 'tx-1',
    userId: 'u1',
    title: 'Test',
    amountCents: 1000,
    currency: 'USD',
    type: 'expense',
    category: 'Food',
    date: '2026-03-15',
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-03-15T00:00:00Z',
    source: 'manual',
    isSoftDeleted: false,
    ...overrides,
  } as AnchorTransaction;
}

describe('calculateScenario', () => {
  const now = new Date('2026-03-20T12:00:00Z');

  it('returns baseline and projected spending for category reduction', () => {
    const txns = [
      makeTx({ id: 't1', type: 'income', amountCents: 500000, date: '2026-02-01' }),
      makeTx({ id: 't2', type: 'expense', amountCents: 100000, category: 'Food', date: '2026-02-10' }),
      makeTx({ id: 't3', type: 'expense', amountCents: 50000, category: 'Transport', date: '2026-02-15' }),
    ];
    const result = calculateScenario({
      transactions: txns,
      reduceCategory: 'Food',
      reducePercent: 20,
      projectionMonths: 3,
      now,
    });
    expect(result.baseline.monthlyExpenseCents).toBe(150000);
    expect(result.projected.monthlyExpenseCents).toBe(130000); // 100k * 0.8 + 50k
    expect(result.savingsOverPeriodCents).toBe(60000); // 20k * 3 months
    expect(result.projectionMonths).toBe(3);
  });

  it('handles missing category gracefully — projects total reduction', () => {
    const txns = [
      makeTx({ id: 't1', type: 'expense', amountCents: 100000, category: 'Food', date: '2026-02-10' }),
    ];
    const result = calculateScenario({
      transactions: txns,
      reducePercent: 10,
      projectionMonths: 6,
      now,
    });
    expect(result.projected.monthlyExpenseCents).toBe(90000);
    expect(result.savingsOverPeriodCents).toBe(60000);
  });

  it('returns zero savings when no expenses exist', () => {
    const result = calculateScenario({
      transactions: [],
      reducePercent: 20,
      projectionMonths: 3,
      now,
    });
    expect(result.baseline.monthlyExpenseCents).toBe(0);
    expect(result.savingsOverPeriodCents).toBe(0);
  });

  it('includes net savings rate in baseline and projected', () => {
    const txns = [
      makeTx({ id: 't1', type: 'income', amountCents: 500000, date: '2026-02-01' }),
      makeTx({ id: 't2', type: 'expense', amountCents: 200000, category: 'Food', date: '2026-02-10' }),
    ];
    const result = calculateScenario({
      transactions: txns,
      reduceCategory: 'Food',
      reducePercent: 50,
      projectionMonths: 6,
      now,
    });
    expect(result.baseline.monthlySavingsCents).toBe(300000);
    expect(result.projected.monthlySavingsCents).toBe(400000);
  });

  it('defaults to 3-month projection when not specified', () => {
    const txns = [
      makeTx({ id: 't1', type: 'expense', amountCents: 100000, date: '2026-02-10' }),
    ];
    const result = calculateScenario({
      transactions: txns,
      reducePercent: 10,
      now,
    });
    expect(result.projectionMonths).toBe(3);
  });
});
