import { describe, it, expect } from 'vitest';
import type { AnchorTransaction, UserPattern } from '../../types';
import type { PredictionInput } from './predictionTypes';
import { buildAnomalySignals } from './predictionAnomalySignals';

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

function makeInput(txns: AnchorTransaction[], now?: Date): PredictionInput {
  return {
    patterns: [] as UserPattern[],
    transactions: txns,
    commitments: [],
    now: now ?? new Date('2026-03-20T12:00:00Z'),
  };
}

describe('buildAnomalySignals', () => {
  it('returns empty when no anomalies detected', () => {
    const txns = [
      makeTx({ id: 'tx-1', amountCents: 1000 }),
      makeTx({ id: 'tx-2', amountCents: 1100 }),
      makeTx({ id: 'tx-3', amountCents: 900 }),
    ];
    const result = buildAnomalySignals(makeInput(txns));
    expect(result).toEqual([]);
  });

  it('returns unusual_spending prediction for anomalous transaction', () => {
    const txns = [
      makeTx({ id: 'tx-1', amountCents: 500, category: 'Food' }),
      makeTx({ id: 'tx-2', amountCents: 600, category: 'Food' }),
      makeTx({ id: 'tx-3', amountCents: 550, category: 'Food' }),
      makeTx({ id: 'tx-4', amountCents: 5000, category: 'Food', title: 'Fancy Dinner' }),
    ];
    const result = buildAnomalySignals(makeInput(txns));
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('unusual_spending');
    expect(result[0].severity).toBe('warning');
    expect(result[0].actionable).toBe(true);
    expect(result[0].message).toContain('Food');
    expect(result[0].confidence).toBeGreaterThan(0.5);
    expect(result[0].confidence).toBeLessThanOrEqual(1.0);
  });

  it('maps severity to critical when amount is >= 5x average', () => {
    // Need enough normal txns so the anomaly doesn't skew the average too much
    const normal = Array.from({ length: 10 }, (_, i) =>
      makeTx({ id: `tx-${i}`, amountCents: 200, category: 'Transport' }),
    );
    const txns = [
      ...normal,
      makeTx({ id: 'tx-big', amountCents: 5000, category: 'Transport', title: 'Big ride' }),
    ];
    const result = buildAnomalySignals(makeInput(txns));
    expect(result.length).toBe(1);
    expect(result[0].severity).toBe('critical');
  });

  it('returns multiple anomalies across categories', () => {
    const txns = [
      makeTx({ id: 't1', amountCents: 500, category: 'Food' }),
      makeTx({ id: 't2', amountCents: 600, category: 'Food' }),
      makeTx({ id: 't3', amountCents: 550, category: 'Food' }),
      makeTx({ id: 't4', amountCents: 5000, category: 'Food', title: 'Fancy' }),
      makeTx({ id: 't5', amountCents: 100, category: 'Coffee' }),
      makeTx({ id: 't6', amountCents: 120, category: 'Coffee' }),
      makeTx({ id: 't7', amountCents: 110, category: 'Coffee' }),
      makeTx({ id: 't8', amountCents: 1500, category: 'Coffee', title: 'Expensive Beans' }),
    ];
    const result = buildAnomalySignals(makeInput(txns));
    expect(result.length).toBe(2);
    expect(result.every((p) => p.type === 'unusual_spending')).toBe(true);
  });

  it('caps at 3 anomaly predictions', () => {
    // 4 categories, each with an anomaly
    const cats = ['A', 'B', 'C', 'D'];
    const txns = cats.flatMap((cat) => [
      makeTx({ id: `${cat}-1`, amountCents: 100, category: cat }),
      makeTx({ id: `${cat}-2`, amountCents: 110, category: cat }),
      makeTx({ id: `${cat}-3`, amountCents: 90, category: cat }),
      makeTx({ id: `${cat}-4`, amountCents: 2000, category: cat, title: `Big ${cat}` }),
    ]);
    const result = buildAnomalySignals(makeInput(txns));
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('includes action navigating to finance', () => {
    const txns = [
      makeTx({ id: 'tx-1', amountCents: 500 }),
      makeTx({ id: 'tx-2', amountCents: 600 }),
      makeTx({ id: 'tx-3', amountCents: 550 }),
      makeTx({ id: 'tx-4', amountCents: 5000, title: 'Big one' }),
    ];
    const result = buildAnomalySignals(makeInput(txns));
    expect(result[0].action?.navigateTo).toBe('/finance');
  });
});
