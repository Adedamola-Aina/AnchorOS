/**
 * Tests for finance.ts — 6 pure utility functions
 * Target: 90%+ coverage
 */
// @ts-nocheck


import { describe, it, expect } from 'vitest';
import {
    groupSmallValues,
    suggestCategory,
    calculateNetWorth,
    getTransactionLabel,
    calculateCashFlow,
    deduplicateLabels,
} from './finance';
import { buildAccount, buildTransaction } from '../test/factories';

// ── groupSmallValues ────────────────────────────────────────────────
describe('groupSmallValues', () => {
    const item = (name: string, value: number) => ({ name, value, color: '#000' });

    it('returns data unchanged when total is 0', () => {
        const data = [item('A', 0), item('B', 0)];
        expect(groupSmallValues(data)).toEqual(data);
    });

    it('returns data unchanged when all items above threshold', () => {
        const data = [item('A', 50), item('B', 50)];
        expect(groupSmallValues(data)).toEqual(data);
    });

    it('groups items below 5% threshold into "Other"', () => {
        const data = [item('Big', 95), item('Tiny1', 2), item('Tiny2', 3)];
        const result = groupSmallValues(data);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Big');
        expect(result[1].name).toBe('Other');
        expect(result[1].value).toBe(5);
    });

    it('uses custom threshold', () => {
        const data = [item('A', 80), item('B', 20)];
        const result = groupSmallValues(data, 0.25);
        expect(result).toHaveLength(2); // B at 20% < 25% threshold → grouped
        expect(result[1].name).toBe('Other');
    });

    it('returns empty array for empty input', () => {
        expect(groupSmallValues([])).toEqual([]);
    });

    it('groups nothing when single item is 100%', () => {
        const data = [item('Only', 100)];
        expect(groupSmallValues(data)).toEqual(data);
    });
});

// ── suggestCategory ─────────────────────────────────────────────────
describe('suggestCategory', () => {
    const recentTx = [
        buildTransaction({ title: 'Grocery Store', category: 'Food' }),
        buildTransaction({ title: 'Shell Gas', category: 'Transport' }),
        buildTransaction({ title: 'Netflix', category: 'Entertainment' }),
    ];

    it('returns null for empty description', () => {
        expect(suggestCategory('', recentTx)).toBeNull();
    });

    it('returns null for single-character description', () => {
        expect(suggestCategory('a', recentTx)).toBeNull();
    });

    it('finds matching category by partial title match', () => {
        expect(suggestCategory('grocery', recentTx)).toBe('Food');
    });

    it('finds category when search term contains transaction title', () => {
        expect(suggestCategory('netflix subscription', recentTx)).toBe('Entertainment');
    });

    it('returns null when no match found', () => {
        expect(suggestCategory('airplane tickets', recentTx)).toBeNull();
    });

    it('respects the limit parameter', () => {
        // With limit 1, only checks first transaction
        expect(suggestCategory('netflix', recentTx, 1)).toBeNull();
    });

    it('is case-insensitive', () => {
        expect(suggestCategory('SHELL', recentTx)).toBe('Transport');
    });
});

// ── calculateNetWorth ───────────────────────────────────────────────
describe('calculateNetWorth', () => {
    it('returns zeros for empty accounts', () => {
        const result = calculateNetWorth([]);
        expect(result.NGN).toBe(0);
        expect(result.USD).toBe(0);
        expect(result.total.amount).toBe(0);
    });

    it('sums NGN accounts correctly (cents → display)', () => {
        const accounts = [
            buildAccount({ balanceCents: 100000, currency: 'NGN' }),
            buildAccount({ balanceCents: 200000, currency: 'NGN' }),
        ];
        const result = calculateNetWorth(accounts);
        expect(result.NGN).toBe(3000); // ₦3,000.00
        expect(result.total.currency).toBe('NGN');
    });

    it('sums USD accounts separately', () => {
        const accounts = [
            buildAccount({ balanceCents: 50000, currency: 'USD' }),
        ];
        const result = calculateNetWorth(accounts);
        expect(result.USD).toBe(500);
        expect(result.total.currency).toBe('USD');
    });

    it('uses dominant currency (higher absolute value) for total', () => {
        const accounts = [
            buildAccount({ balanceCents: 10000000, currency: 'NGN' }), // ₦100,000
            buildAccount({ balanceCents: 5000, currency: 'USD' }),      // $50
        ];
        const result = calculateNetWorth(accounts);
        expect(result.total.currency).toBe('NGN');
        expect(result.total.amount).toBe(100000);
    });

    it('selects USD when USD total is higher', () => {
        const accounts = [
            buildAccount({ balanceCents: 100, currency: 'NGN' }),     // ₦1
            buildAccount({ balanceCents: 100000, currency: 'USD' }),   // $1,000
        ];
        const result = calculateNetWorth(accounts);
        expect(result.total.currency).toBe('USD');
    });

    it('handles negative balances', () => {
        const accounts = [
            buildAccount({ balanceCents: -50000, currency: 'NGN' }),
        ];
        const result = calculateNetWorth(accounts);
        expect(result.NGN).toBe(-500);
    });
});

// ── getTransactionLabel ─────────────────────────────────────────────
describe('getTransactionLabel', () => {
    it('returns correct labels for income', () => {
        const result = getTransactionLabel('income');
        expect(result.header).toBe('Record Income');
        expect(result.accountLabel).toBe('DEPOSIT TO');
    });

    it('returns correct labels for expense', () => {
        const result = getTransactionLabel('expense');
        expect(result.header).toBe('Record Expense');
        expect(result.accountLabel).toBe('SPEND FROM');
    });

    it('returns correct labels for transfer', () => {
        const result = getTransactionLabel('transfer');
        expect(result.header).toBe('Record Transfer');
        expect(result.accountLabel).toBe('TRANSFER FROM');
    });
});

// ── calculateCashFlow ───────────────────────────────────────────────
describe('calculateCashFlow', () => {
    it('returns zeros for empty transactions', () => {
        const result = calculateCashFlow([]);
        expect(result).toEqual({ income: 0, expense: 0, net: 0 });
    });

    it('sums income and expense within date window', () => {
        const today = new Date().toISOString();
        const transactions = [
            buildTransaction({ type: 'income', amountCents: 50000, date: today }),
            buildTransaction({ type: 'expense', amountCents: 20000, date: today }),
        ];
        const result = calculateCashFlow(transactions, 30);
        expect(result.income).toBe(500);
        expect(result.expense).toBe(200);
        expect(result.net).toBe(300);
    });

    it('excludes transactions outside the date window', () => {
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 60);
        const transactions = [
            buildTransaction({ type: 'income', amountCents: 50000, date: oldDate.toISOString() }),
        ];
        const result = calculateCashFlow(transactions, 30);
        expect(result.income).toBe(0);
    });

    it('supports custom day window', () => {
        const recent = new Date();
        recent.setDate(recent.getDate() - 5);
        const transactions = [
            buildTransaction({ type: 'expense', amountCents: 10000, date: recent.toISOString() }),
        ];
        const result = calculateCashFlow(transactions, 7);
        expect(result.expense).toBe(100);
    });

    it('ignores transfer transactions (only counts income/expense)', () => {
        const today = new Date().toISOString();
        const transactions = [
            buildTransaction({ type: 'transfer', amountCents: 99999, date: today }),
        ];
        const result = calculateCashFlow(transactions, 30);
        expect(result.income).toBe(0);
        expect(result.expense).toBe(0);
    });
});

// ── deduplicateLabels ───────────────────────────────────────────────
describe('deduplicateLabels', () => {
    const item = (name: string) => ({ name, value: 10, color: '#000' });

    it('returns empty array for empty input', () => {
        expect(deduplicateLabels([])).toEqual([]);
    });

    it('leaves unique names unchanged', () => {
        const data = [item('A'), item('B'), item('C')];
        const result = deduplicateLabels(data);
        expect(result.map(d => d.name)).toEqual(['A', 'B', 'C']);
    });

    it('appends (2), (3) to duplicate names', () => {
        const data = [item('Savings'), item('Savings'), item('Savings')];
        const result = deduplicateLabels(data);
        expect(result.map(d => d.name)).toEqual(['Savings', 'Savings (2)', 'Savings (3)']);
    });

    it('handles mixed unique and duplicate names', () => {
        const data = [item('A'), item('B'), item('A'), item('C'), item('B')];
        const result = deduplicateLabels(data);
        expect(result.map(d => d.name)).toEqual(['A', 'B', 'A (2)', 'C', 'B (2)']);
    });
});
