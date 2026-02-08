import { describe, it, expect } from 'vitest';
import { getWeeklySpending, detectRecurring, getCashFlowAnalysis, getAssetDistribution, getExpenseCategoryBreakdown } from './financeInsights';
import type { AnchorTransaction } from '../types';
import { buildAccount, buildTransaction } from '../test/factories';

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
            // F-015: Now returns full month's weeks (4-6 depending on month)
            expect(data.length).toBeGreaterThanOrEqual(4);
            expect(data.length).toBeLessThanOrEqual(6);
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

        it('skips soft-deleted transactions', () => {
            const now = new Date();
            const txs: AnchorTransaction[] = [
                { id: 'sd1', title: 'Deleted', amountCents: 50000, type: 'income', category: 'Pay', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal', isSoftDeleted: true },
            ];
            const analysis = getCashFlowAnalysis(txs);
            expect(analysis.income).toBe(0);
        });

        it('skips transactions without date', () => {
            const txs: AnchorTransaction[] = [
                { id: 'nd1', title: 'NoDate', amountCents: 50000, type: 'income', category: 'Pay', date: undefined as any, accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const analysis = getCashFlowAnalysis(txs);
            expect(analysis.income).toBe(0);
        });

        it('returns neutral when nets are equal', () => {
            const now = new Date();
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(now.getDate() - 10);
            const txs: AnchorTransaction[] = [
                { id: 'eq1', title: 'A', amountCents: 10000, type: 'income', category: 'Pay', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'eq2', title: 'B', amountCents: 10000, type: 'income', category: 'Pay', date: tenDaysAgo.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const analysis = getCashFlowAnalysis(txs);
            expect(analysis.trend).toBe('neutral');
        });

        it('returns 0 diffPercent when prevNet is 0', () => {
            const now = new Date();
            const txs: AnchorTransaction[] = [
                { id: 'z1', title: 'A', amountCents: 10000, type: 'income', category: 'Pay', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const analysis = getCashFlowAnalysis(txs);
            expect(analysis.diffPercent).toBe(0);
        });
    });

    describe('getAssetDistribution', () => {
        it('returns sorted percentages for accounts', () => {
            const accounts = [
                buildAccount({ id: 'a1', name: 'Small', balanceCents: 10000, currency: 'NGN' }),
                buildAccount({ id: 'a2', name: 'Big', balanceCents: 90000, currency: 'NGN' }),
            ];
            const result = getAssetDistribution(accounts);
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Big');
            expect(result[0].percent).toBe(90);
            expect(result[1].percent).toBe(10);
        });

        it('returns empty array when total balance is 0', () => {
            const accounts = [buildAccount({ balanceCents: 0 })];
            const result = getAssetDistribution(accounts);
            expect(result).toEqual([]);
        });

        it('includes currency and type in output', () => {
            const accounts = [buildAccount({ id: 'x', name: 'X', balanceCents: 100, currency: 'USD', type: 'savings' })];
            const result = getAssetDistribution(accounts);
            expect(result[0].currency).toBe('USD');
            expect(result[0].type).toBe('savings');
        });
    });

    describe('getExpenseCategoryBreakdown', () => {
        const daysAgo = (n: number) => {
            const d = new Date();
            d.setDate(d.getDate() - n);
            return d.toISOString();
        };

        it('returns top 5 categories sorted by amount', () => {
            const txs = [
                buildTransaction({ type: 'expense', category: 'Food', amountCents: 50000, date: daysAgo(5) }),
                buildTransaction({ type: 'expense', category: 'Transport', amountCents: 30000, date: daysAgo(5) }),
                buildTransaction({ type: 'expense', category: 'Housing', amountCents: 20000, date: daysAgo(5) }),
            ];
            const result = getExpenseCategoryBreakdown(txs);
            expect(result).toHaveLength(3);
            expect(result[0].category).toBe('Food');
            expect(result[0].percent).toBe(50);
        });

        it('returns empty when no expenses in 30-day window', () => {
            const txs = [buildTransaction({ type: 'income', amountCents: 100000, date: daysAgo(5) })];
            const result = getExpenseCategoryBreakdown(txs);
            expect(result).toEqual([]);
        });

        it('groups transactions by category', () => {
            const txs = [
                buildTransaction({ type: 'expense', category: 'Food', amountCents: 10000, date: daysAgo(1) }),
                buildTransaction({ type: 'expense', category: 'Food', amountCents: 20000, date: daysAgo(2) }),
            ];
            const result = getExpenseCategoryBreakdown(txs);
            expect(result).toHaveLength(1);
            expect(result[0].amount).toBe(300);
        });

        it('uses "Uncategorized" for transactions without category', () => {
            const txs = [buildTransaction({ type: 'expense', amountCents: 10000, date: daysAgo(1), category: undefined as any })];
            const result = getExpenseCategoryBreakdown(txs);
            expect(result[0].category).toBe('Uncategorized');
        });

        it('excludes soft-deleted expenses', () => {
            const txs = [buildTransaction({ type: 'expense', amountCents: 10000, date: daysAgo(1), isSoftDeleted: true })];
            const result = getExpenseCategoryBreakdown(txs);
            expect(result).toEqual([]);
        });

        it('limits to 5 categories', () => {
            const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            const txs = categories.map((cat, i) =>
                buildTransaction({ type: 'expense', category: cat, amountCents: (7 - i) * 10000, date: daysAgo(1) })
            );
            const result = getExpenseCategoryBreakdown(txs);
            expect(result).toHaveLength(5);
        });
    });
});

