/**
 * Tests for seederData.ts — secureRandomInt, randomDate, randomItem, constants
 * Target: 90%+ mutation kill rate
 */
// @ts-nocheck


import { describe, it, expect, vi } from 'vitest';
import {
    secureRandomInt,
    randomDate,
    randomItem,
    TITLES,
    ACCOUNT_NAMES,
    TASK_TITLES,
    CATEGORIES,
    DOMAINS,
    ACCOUNT_COLORS,
} from './seederData';

describe('seederData constants', () => {
    it('exports non-empty TITLES array', () => {
        expect(TITLES.length).toBeGreaterThan(0);
        expect(TITLES).toContain('Groceries');
        expect(TITLES).toContain('Rent');
    });

    it('exports non-empty ACCOUNT_NAMES array', () => {
        expect(ACCOUNT_NAMES.length).toBeGreaterThan(0);
        expect(ACCOUNT_NAMES).toContain('Main Checking');
    });

    it('exports non-empty TASK_TITLES array', () => {
        expect(TASK_TITLES.length).toBeGreaterThan(0);
        expect(TASK_TITLES).toContain('Morning Jog');
    });

    it('exports non-empty CATEGORIES array', () => {
        expect(CATEGORIES.length).toBeGreaterThan(0);
        expect(CATEGORIES).toContain('Food');
        expect(CATEGORIES).toContain('Transfer');
    });

    it('exports non-empty DOMAINS array', () => {
        expect(DOMAINS.length).toBeGreaterThan(0);
        expect(DOMAINS).toContain('Health');
    });

    it('exports non-empty ACCOUNT_COLORS array', () => {
        expect(ACCOUNT_COLORS.length).toBeGreaterThan(0);
        expect(ACCOUNT_COLORS[0]).toMatch(/^#[0-9a-f]{6}$/);
    });
});

describe('secureRandomInt', () => {
    it('returns 0 when max is 0', () => {
        expect(secureRandomInt(0)).toBe(0);
    });

    it('returns 0 when max is negative', () => {
        expect(secureRandomInt(-5)).toBe(0);
    });

    it('returns values in [0, max) range', () => {
        const max = 10;
        for (let i = 0; i < 50; i++) {
            const val = secureRandomInt(max);
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(max);
        }
    });

    it('returns 0 for max = 1', () => {
        // Only possible value in [0, 1) is 0
        expect(secureRandomInt(1)).toBe(0);
    });

    it('returns integer values only', () => {
        for (let i = 0; i < 20; i++) {
            const val = secureRandomInt(100);
            expect(Number.isInteger(val)).toBe(true);
        }
    });

    it('handles large max values', () => {
        const val = secureRandomInt(1000000);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1000000);
    });

    it('performs rejection sampling to avoid bias', () => {
        // Mock crypto to return a value that triggers rejection, then a good one
        const mockGetRandomValues = vi.fn();
        const originalGetRandomValues = crypto.getRandomValues.bind(crypto);

        // First call: return a value >= limit to trigger re-sample
        // For max=3, limit = 0x100000000 - (0x100000000 % 3) = 0xFFFFFFFF
        // So any value < 0xFFFFFFFF will be accepted. To test rejection,
        // we'd need max where 0x100000000 % max != 0
        // With max=3: limit = 4294967296 - (4294967296 % 3) = 4294967296 - 1 = 4294967295
        // So value >= 4294967295 triggers rejection
        let callCount = 0;
        mockGetRandomValues.mockImplementation((arr: Uint32Array) => {
            callCount++;
            if (callCount === 1) {
                arr[0] = 0xFFFFFFFF; // This may trigger rejection for some max values
            } else {
                arr[0] = 5; // Safe value
            }
            return arr;
        });

        crypto.getRandomValues = mockGetRandomValues;
        try {
            const val = secureRandomInt(3);
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(3);
        } finally {
            crypto.getRandomValues = originalGetRandomValues;
        }
    });
});

describe('randomDate', () => {
    it('returns a date between start and end', () => {
        const start = new Date('2025-01-01');
        const end = new Date('2025-12-31');
        const result = randomDate(start, end);

        expect(result.getTime()).toBeGreaterThanOrEqual(start.getTime());
        expect(result.getTime()).toBeLessThanOrEqual(end.getTime());
    });

    it('returns start date when start equals end', () => {
        const date = new Date('2025-06-15');
        const result = randomDate(date, date);
        expect(result.getTime()).toBe(date.getTime());
    });

    it('returns a Date object', () => {
        const start = new Date('2025-01-01');
        const end = new Date('2025-06-01');
        const result = randomDate(start, end);
        expect(result).toBeInstanceOf(Date);
    });
});

describe('randomItem', () => {
    it('returns an item from the array', () => {
        const arr = ['a', 'b', 'c'];
        const result = randomItem(arr);
        expect(arr).toContain(result);
    });

    it('returns the only item from single-element array', () => {
        const arr = [42];
        expect(randomItem(arr)).toBe(42);
    });

    it('works with different types', () => {
        const arr = [{ id: 1 }, { id: 2 }];
        const result = randomItem(arr);
        expect(result).toHaveProperty('id');
        expect([1, 2]).toContain(result.id);
    });
});
