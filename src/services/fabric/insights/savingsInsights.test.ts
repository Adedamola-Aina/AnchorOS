import { describe, it, expect } from 'vitest';
import type { AnchorTransaction } from '../../../types';
import { buildSavingsInsight } from './savingsInsights';

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

describe('buildSavingsInsight', () => {
  const now = new Date('2026-03-20T12:00:00Z');

  it('returns null when no transactions', () => {
    expect(buildSavingsInsight([], now)).toBeNull();
  });

  it('returns null when no expenses (nothing to save on)', () => {
    const txns = [makeTx({ type: 'income', amountCents: 5000 })];
    expect(buildSavingsInsight(txns, now)).toBeNull();
  });

  it('suggests reducing top discretionary category with rising spend', () => {
    const txns = [
      // Last month — lower Food spending
      makeTx({ id: 't1', amountCents: 2000, category: 'Food', date: '2026-02-10' }),
      makeTx({ id: 't2', amountCents: 1500, category: 'Food', date: '2026-02-20' }),
      // This month — higher Food spending
      makeTx({ id: 't3', amountCents: 3000, category: 'Food', date: '2026-03-05' }),
      makeTx({ id: 't4', amountCents: 3500, category: 'Food', date: '2026-03-15' }),
    ];
    const result = buildSavingsInsight(txns, now);
    expect(result).not.toBeNull();
    expect(result!.category).toBe('spending');
    expect(result!.headline).toContain('Food');
    expect(result!.severity).toBe('attention');
    expect(result!.reasoning).toBeDefined();
    expect(result!.trend).toBe('up');
  });

  it('returns null when no category has rising spend', () => {
    const txns = [
      // Last month — higher
      makeTx({ id: 't1', amountCents: 5000, category: 'Food', date: '2026-02-10' }),
      // This month — lower
      makeTx({ id: 't2', amountCents: 2000, category: 'Food', date: '2026-03-10' }),
    ];
    const result = buildSavingsInsight(txns, now);
    expect(result).toBeNull();
  });

  it('picks the category with the largest increase', () => {
    const txns = [
      // Food: small increase
      makeTx({ id: 't1', amountCents: 2000, category: 'Food', date: '2026-02-10' }),
      makeTx({ id: 't2', amountCents: 2500, category: 'Food', date: '2026-03-10' }),
      // Entertainment: larger increase
      makeTx({ id: 't3', amountCents: 1000, category: 'Entertainment', date: '2026-02-10' }),
      makeTx({ id: 't4', amountCents: 4000, category: 'Entertainment', date: '2026-03-10' }),
    ];
    const result = buildSavingsInsight(txns, now);
    expect(result).not.toBeNull();
    expect(result!.headline).toContain('Entertainment');
  });

  it('includes potential savings amount in detail', () => {
    const txns = [
      makeTx({ id: 't1', amountCents: 2000, category: 'Food', date: '2026-02-10' }),
      makeTx({ id: 't2', amountCents: 5000, category: 'Food', date: '2026-03-10' }),
    ];
    const result = buildSavingsInsight(txns, now);
    expect(result).not.toBeNull();
    expect(result!.detail).toContain('$');
  });
});
