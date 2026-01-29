// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { toCents, fromCents, formatMoney, addMoney, subtractMoney, parseInputToCents } from './moneyUtils';

describe('moneyUtils', () => {
    describe('toCents', () => {
        it('converts display amounts to cents', () => {
            expect(toCents(10.50)).toBe(1050);
            expect(toCents(0.01)).toBe(1);
            expect(toCents(1000)).toBe(100000);
            expect(toCents(0)).toBe(0);
        });

        it('handles floating point edge cases', () => {
            // The classic 0.1 + 0.2 problem
            expect(toCents(0.1 + 0.2)).toBe(30); // Would be 30.000000000000004 in float
        });
    });

    describe('fromCents', () => {
        it('converts cents to display amounts', () => {
            expect(fromCents(1050)).toBe(10.50);
            expect(fromCents(1)).toBe(0.01);
            expect(fromCents(100000)).toBe(1000);
        });
    });

    describe('formatMoney', () => {
        it('formats USD correctly', () => {
            expect(formatMoney(1050, 'USD')).toBe('$10.50');
            expect(formatMoney(100000, 'USD')).toBe('$1,000.00');
        });

        it('formats NGN correctly', () => {
            expect(formatMoney(1050, 'NGN')).toBe('₦10.50');
            expect(formatMoney(50000000, 'NGN')).toBe('₦500,000.00');
        });
    });

    describe('addMoney / subtractMoney', () => {
        it('safely adds money', () => {
            expect(addMoney(1050, 250)).toBe(1300); // $10.50 + $2.50 = $13.00
        });

        it('safely subtracts money', () => {
            expect(subtractMoney(1050, 250)).toBe(800); // $10.50 - $2.50 = $8.00
        });
    });

    describe('parseInputToCents', () => {
        it('parses standard decimal input', () => {
            expect(parseInputToCents('10.50')).toBe(1050);
            expect(parseInputToCents('1000')).toBe(100000);
        });

        it('handles currency symbols', () => {
            expect(parseInputToCents('$10.50')).toBe(1050);
            expect(parseInputToCents('₦500,000.00')).toBe(50000000);
        });

        it('handles invalid input', () => {
            expect(parseInputToCents('')).toBe(0);
            expect(parseInputToCents('abc')).toBe(0);
        });

        it('handles extreme amounts (Trillions of cents)', () => {
            // 1 Trillion Dollars = 100,000,000,000,000 cents
            expect(toCents(1000000000000)).toBe(100000000000000);
        });

        it('handles comma-first European-style input if accidentally passed', () => {
            // Some users might type 10,50 instead of 10.50
            expect(parseInputToCents('10,50')).toBe(1050);
        });
    });
});
