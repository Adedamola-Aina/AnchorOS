import { describe, it, expect } from 'vitest';
import { getMonthlyAverages, detectAnomalies, getSpendingTrend } from './transactionInsights';
import type { AnchorTransaction } from '../../types';

function makeTx(overrides: Partial<AnchorTransaction> = {}): AnchorTransaction {
    return {
        id: 'tx-' + Math.random().toString(36).slice(2, 8),
        title: 'Test',
        amountCents: 10000,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        currency: 'NGN',
        scope: 'personal',
        date: '2026-02-15T00:00:00.000Z',
        createdAt: '2026-02-15T00:00:00.000Z',
        ...overrides,
    } as AnchorTransaction;
}

describe('transactionInsights', () => {
    describe('getMonthlyAverages', () => {
        it('calculates average spending per category across months', () => {
            const txns: AnchorTransaction[] = [
                makeTx({ amountCents: 20000, category: 'Food', date: '2026-01-10' }),
                makeTx({ amountCents: 30000, category: 'Food', date: '2026-02-10' }),
                makeTx({ amountCents: 10000, category: 'Transport', date: '2026-01-15' }),
            ];

            const avgs = getMonthlyAverages(txns);
            // Food: (20000+30000)/2 = 25000
            expect(avgs.find(a => a.category === 'Food')?.averageCents).toBe(25000);
            // Transport: 10000/2 months span = 5000
            expect(avgs.find(a => a.category === 'Transport')?.averageCents).toBe(5000);
        });

        it('excludes transfers and income', () => {
            const txns: AnchorTransaction[] = [
                makeTx({ type: 'income', amountCents: 500000, category: 'Salary' }),
                makeTx({ type: 'expense', amountCents: 20000, category: 'Food' }),
                makeTx({ type: 'transfer', amountCents: 10000, category: 'Transfer' }),
                makeTx({ linkId: 'link-1', amountCents: 10000, category: 'Food' }),
            ];

            const avgs = getMonthlyAverages(txns);
            expect(avgs).toHaveLength(1);
            expect(avgs[0].category).toBe('Food');
        });

        it('returns empty array for no expenses', () => {
            expect(getMonthlyAverages([])).toEqual([]);
        });
    });

    describe('detectAnomalies', () => {
        it('flags transactions significantly above category average', () => {
            const txns: AnchorTransaction[] = [
                // 3 normal food transactions across months
                makeTx({ amountCents: 10000, category: 'Food', date: '2026-01-05' }),
                makeTx({ amountCents: 12000, category: 'Food', date: '2026-01-15' }),
                makeTx({ amountCents: 11000, category: 'Food', date: '2026-02-05' }),
                // 1 anomalous food transaction (5x the average)
                makeTx({ amountCents: 55000, category: 'Food', date: '2026-02-20' }),
            ];

            const anomalies = detectAnomalies(txns);
            expect(anomalies.length).toBeGreaterThanOrEqual(1);
            expect(anomalies[0].amountCents).toBe(55000);
            expect(anomalies[0].category).toBe('Food');
        });

        it('returns empty for consistent spending', () => {
            const txns: AnchorTransaction[] = [
                makeTx({ amountCents: 10000, category: 'Food', date: '2026-01-05' }),
                makeTx({ amountCents: 11000, category: 'Food', date: '2026-02-05' }),
                makeTx({ amountCents: 10500, category: 'Food', date: '2026-02-15' }),
            ];

            const anomalies = detectAnomalies(txns);
            expect(anomalies).toHaveLength(0);
        });

        it('skips soft-deleted transactions', () => {
            const txns: AnchorTransaction[] = [
                makeTx({ amountCents: 10000, category: 'Food', date: '2026-01-05' }),
                makeTx({ amountCents: 10000, category: 'Food', date: '2026-02-05' }),
                makeTx({ amountCents: 99000, category: 'Food', date: '2026-02-20', isSoftDeleted: true }),
            ];

            const anomalies = detectAnomalies(txns);
            expect(anomalies).toHaveLength(0);
        });
    });

    describe('getSpendingTrend', () => {
        it('calculates month-over-month percentage change', () => {
            const txns: AnchorTransaction[] = [
                makeTx({ amountCents: 100000, date: '2026-01-15' }),
                makeTx({ amountCents: 120000, date: '2026-02-15' }),
            ];

            const trend = getSpendingTrend(txns);
            // Jan: 100000, Feb: 120000 → +20%
            expect(trend.direction).toBe('up');
            expect(trend.percentChange).toBeCloseTo(20);
        });

        it('detects decreasing spending', () => {
            const txns: AnchorTransaction[] = [
                makeTx({ amountCents: 100000, date: '2026-01-15' }),
                makeTx({ amountCents: 80000, date: '2026-02-15' }),
            ];

            const trend = getSpendingTrend(txns);
            expect(trend.direction).toBe('down');
            expect(trend.percentChange).toBeCloseTo(20);
        });

        it('returns flat when spending is similar', () => {
            const txns: AnchorTransaction[] = [
                makeTx({ amountCents: 100000, date: '2026-01-15' }),
                makeTx({ amountCents: 101000, date: '2026-02-15' }),
            ];

            const trend = getSpendingTrend(txns);
            expect(trend.direction).toBe('flat');
        });

        it('handles empty or single-month data', () => {
            expect(getSpendingTrend([]).direction).toBe('flat');

            const single = [makeTx({ amountCents: 50000, date: '2026-02-15' })];
            expect(getSpendingTrend(single).direction).toBe('flat');
        });
    });
});
