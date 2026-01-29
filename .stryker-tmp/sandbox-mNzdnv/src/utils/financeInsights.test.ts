// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { getWeeklySpending, detectRecurring, getCashFlowAnalysis } from './financeInsights';
import type { AnchorTransaction } from '../types';

describe('financeInsights', () => {
    const mockTxs: AnchorTransaction[] = [
        {
            id: '1',
            title: 'Netflix',
            amountCents: 1599,
            type: 'expense',
            category: 'Subscription',
            date: new Date().toISOString(),
            accountId: 'acc1',
            currency: 'USD',
            scope: 'personal'
        },
        {
            id: '2',
            title: 'Salary',
            amountCents: 500000,
            type: 'income',
            category: 'Salary',
            date: new Date().toISOString(),
            accountId: 'acc1',
            currency: 'USD',
            scope: 'personal'
        }
    ];

    describe('getWeeklySpending', () => {
        it('calculates income and expense for the current week', () => {
            const data = getWeeklySpending(mockTxs);
            const thisWeek = data.find(d => d.label === 'This Week');
            expect(thisWeek?.income).toBe(5000);
            expect(thisWeek?.expense).toBe(15.99);
            expect(thisWeek?.net).toBe(4984.01);
        });

        it('handles empty transactions', () => {
            const data = getWeeklySpending([]);
            expect(data.length).toBe(4);
            expect(data[0].income).toBe(0);
        });
    });

    describe('detectRecurring', () => {
        it('detects a monthly subscription', () => {
            const now = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);

            const recurringTxs: AnchorTransaction[] = [
                {
                    id: 'r1',
                    title: 'Spotify',
                    amountCents: 999,
                    type: 'expense',
                    category: 'Music',
                    date: now.toISOString(),
                    accountId: 'acc1',
                    currency: 'USD',
                    scope: 'personal'
                },
                {
                    id: 'r2',
                    title: 'Spotify',
                    amountCents: 999,
                    type: 'expense',
                    category: 'Music',
                    date: lastMonth.toISOString(),
                    accountId: 'acc1',
                    currency: 'USD',
                    scope: 'personal'
                }
            ];

            const results = detectRecurring(recurringTxs);
            expect(results.length).toBe(1);
            expect(results[0].title).toBe('Spotify');
            expect(results[0].frequency).toBe('monthly');
        });

        it('ignores irregular transactions with same name but different amounts', () => {
            const txs: AnchorTransaction[] = [
                { id: 'i1', title: 'Food', amountCents: 1000, type: 'expense', category: 'Food', date: new Date().toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'i2', title: 'Food', amountCents: 2000, type: 'expense', category: 'Food', date: new Date().toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' }
            ];
            const results = detectRecurring(txs);
            expect(results.length).toBe(0);
        });
    });

    describe('getCashFlowAnalysis', () => {
        it('compares current week with previous week', () => {
            const now = new Date();
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(now.getDate() - 10);

            const txs: AnchorTransaction[] = [
                { id: 'c1', title: 'Income Now', amountCents: 100000, type: 'income', category: 'Pay', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'p1', title: 'Income Then', amountCents: 50000, type: 'income', category: 'Pay', date: tenDaysAgo.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' }
            ];

            const analysis = getCashFlowAnalysis(txs);
            expect(analysis.income).toBe(1000);
            expect(analysis.prevNet).toBe(500);
            expect(analysis.trend).toBe('better');
            expect(analysis.diffPercent).toBe(100);
        });
    });
});
