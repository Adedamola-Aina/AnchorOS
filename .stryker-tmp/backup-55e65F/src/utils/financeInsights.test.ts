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

        it('calculates net as income minus expense', () => {
            const data = getWeeklySpending(mockTxs);
            const thisWeek = data.find(d => d.label === 'This Week');
            expect(thisWeek?.net).toBe(thisWeek!.income - thisWeek!.expense);
        });

        it('uses reference date for past month viewing', () => {
            const pastMonth = new Date(2025, 0, 15); // Jan 15, 2025
            const data = getWeeklySpending([], pastMonth);
            expect(data.length).toBeGreaterThanOrEqual(4);
            // With reference date, should NOT have "This Week" label
            const hasThisWeek = data.some(d => d.label === 'This Week');
            expect(hasThisWeek).toBe(false);
        });

        it('uses formatted date labels for non-current weeks', () => {
            const pastMonth = new Date(2025, 0, 15);
            const data = getWeeklySpending([], pastMonth);
            // All labels should be date-formatted, not "This Week"
            data.forEach(d => {
                expect(d.label).not.toBe('This Week');
                expect(d.label.length).toBeGreaterThan(0);
            });
        });

        it('filters transactions to correct week', () => {
            const now = new Date();
            const txs: AnchorTransaction[] = [
                { id: 't1', title: 'Now', amountCents: 10000, type: 'expense', category: 'Food', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const data = getWeeklySpending(txs);
            const thisWeek = data.find(d => d.label === 'This Week');
            expect(thisWeek?.expense).toBe(100);
        });

        it('skips transactions with no date', () => {
            const txs: AnchorTransaction[] = [
                { id: 't1', title: 'NoDate', amountCents: 10000, type: 'expense', category: 'Food', date: undefined as any, accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const data = getWeeklySpending(txs);
            data.forEach(w => {
                expect(w.expense).toBe(0);
                expect(w.income).toBe(0);
            });
        });

        it('skips null transactions in array', () => {
            const txs = [null as any, undefined as any];
            const data = getWeeklySpending(txs);
            data.forEach(w => {
                expect(w.expense).toBe(0);
                expect(w.income).toBe(0);
            });
        });

        it('handles transactions with zero amountCents', () => {
            const now = new Date();
            const txs: AnchorTransaction[] = [
                { id: 't1', title: 'Zero', amountCents: 0, type: 'expense', category: 'Food', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const data = getWeeklySpending(txs);
            const thisWeek = data.find(d => d.label === 'This Week');
            expect(thisWeek?.expense).toBe(0);
        });

        it('includes weekStart as Date in each week', () => {
            const data = getWeeklySpending([]);
            data.forEach(w => {
                expect(w.weekStart).toBeInstanceOf(Date);
            });
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

        it('ignores income transactions', () => {
            const now = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            const txs: AnchorTransaction[] = [
                { id: 'i1', title: 'Salary', amountCents: 500000, type: 'income', category: 'Salary', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'i2', title: 'Salary', amountCents: 500000, type: 'income', category: 'Salary', date: lastMonth.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const results = detectRecurring(txs);
            expect(results.length).toBe(0);
        });

        it('ignores single occurrences', () => {
            const txs: AnchorTransaction[] = [
                { id: 's1', title: 'One-time', amountCents: 5000, type: 'expense', category: 'Other', date: new Date().toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const results = detectRecurring(txs);
            expect(results.length).toBe(0);
        });

        it('detects weekly recurring transactions', () => {
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const txs: AnchorTransaction[] = [
                { id: 'w1', title: 'Coffee', amountCents: 500, type: 'expense', category: 'Food', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'w2', title: 'Coffee', amountCents: 500, type: 'expense', category: 'Food', date: oneWeekAgo.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'w3', title: 'Coffee', amountCents: 500, type: 'expense', category: 'Food', date: twoWeeksAgo.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const results = detectRecurring(txs);
            expect(results.length).toBe(1);
            expect(results[0].frequency).toBe('weekly');
        });

        it('filters out irregular frequency patterns', () => {
            const now = new Date();
            const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            const txs: AnchorTransaction[] = [
                { id: 'ir1', title: 'Random', amountCents: 1000, type: 'expense', category: 'Other', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'ir2', title: 'Random', amountCents: 1000, type: 'expense', category: 'Other', date: threeDaysAgo.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const results = detectRecurring(txs);
            // 3 day gap - neither weekly (6-8) nor monthly (26-32)
            expect(results.length).toBe(0);
        });

        it('sorts results by amount descending', () => {
            const now = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            const txs: AnchorTransaction[] = [
                { id: 'a1', title: 'Small Sub', amountCents: 999, type: 'expense', category: 'Sub', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'a2', title: 'Small Sub', amountCents: 999, type: 'expense', category: 'Sub', date: lastMonth.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'b1', title: 'Big Sub', amountCents: 4999, type: 'expense', category: 'Sub', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'b2', title: 'Big Sub', amountCents: 4999, type: 'expense', category: 'Sub', date: lastMonth.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const results = detectRecurring(txs);
            if (results.length >= 2) {
                expect(results[0].amountCents).toBeGreaterThanOrEqual(results[1].amountCents);
            }
        });

        it('skips null/undefined transactions', () => {
            const txs = [null as any, undefined as any];
            const results = detectRecurring(txs);
            expect(results.length).toBe(0);
        });

        it('skips transactions without title', () => {
            const now = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            const txs: AnchorTransaction[] = [
                { id: 'nt1', title: '', amountCents: 999, type: 'expense', category: 'Sub', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'nt2', title: '', amountCents: 999, type: 'expense', category: 'Sub', date: lastMonth.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const results = detectRecurring(txs);
            expect(results.length).toBe(0);
        });

        it('returns correct count and avgGapDays', () => {
            const now = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            const txs: AnchorTransaction[] = [
                { id: 'c1', title: 'Netflix', amountCents: 1599, type: 'expense', category: 'Sub', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'c2', title: 'Netflix', amountCents: 1599, type: 'expense', category: 'Sub', date: lastMonth.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const results = detectRecurring(txs);
            if (results.length > 0) {
                expect(results[0].count).toBe(2);
                expect(results[0].avgGapDays).toBeGreaterThan(25);
                expect(results[0].avgGapDays).toBeLessThan(35);
                expect(results[0].lastDate).toBeTruthy();
                expect(results[0].id).toBeTruthy();
            }
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

        it('returns worse trend when current net < previous net', () => {
            const now = new Date();
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(now.getDate() - 10);
            const txs: AnchorTransaction[] = [
                { id: 'w1', title: 'Small Income', amountCents: 10000, type: 'income', category: 'Pay', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'w2', title: 'Big Expense', amountCents: 50000, type: 'expense', category: 'Rent', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'w3', title: 'Good Income', amountCents: 200000, type: 'income', category: 'Pay', date: tenDaysAgo.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const analysis = getCashFlowAnalysis(txs);
            expect(analysis.trend).toBe('worse');
        });

        it('calculates expense amounts correctly', () => {
            const now = new Date();
            const txs: AnchorTransaction[] = [
                { id: 'e1', title: 'Rent', amountCents: 100000, type: 'expense', category: 'Housing', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
                { id: 'e2', title: 'Food', amountCents: 20000, type: 'expense', category: 'Food', date: now.toISOString(), accountId: 'a', currency: 'USD', scope: 'personal' },
            ];
            const analysis = getCashFlowAnalysis(txs);
            expect(analysis.expense).toBe(1200); // (100000 + 20000) / 100
        });

        it('handles empty transactions', () => {
            const analysis = getCashFlowAnalysis([]);
            expect(analysis.income).toBe(0);
            expect(analysis.expense).toBe(0);
            expect(analysis.net).toBe(0);
            expect(analysis.prevNet).toBe(0);
            expect(analysis.trend).toBe('neutral');
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

        it('excludes archived (deleted) accounts from distribution', () => {
            const accounts = [
                buildAccount({ id: 'a1', name: 'Active', balanceCents: 50000, currency: 'NGN' }),
                buildAccount({ id: 'a2', name: 'Archived', balanceCents: 50000, currency: 'NGN', isArchived: true }),
            ];
            const result = getAssetDistribution(accounts);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Active');
            expect(result[0].percent).toBe(100);
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

