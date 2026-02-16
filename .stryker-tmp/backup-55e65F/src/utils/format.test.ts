import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCurrencyCompact, getDynamicFontSize } from './format';

describe('formatCurrency', () => {
    describe('Basic formatting', () => {
        it('should format positive amounts correctly', () => {
            const result = formatCurrency(1000, 'USD');
            expect(result).toBe('$1,000.00');
        });

        it('should format negative amounts correctly', () => {
            const result = formatCurrency(-500, 'USD');
            expect(result).toBe('-$500.00');
        });

        it('should format zero correctly', () => {
            const result = formatCurrency(0, 'USD');
            expect(result).toBe('$0.00');
        });

        it('should format decimal amounts correctly', () => {
            const result = formatCurrency(123.45, 'USD');
            expect(result).toBe('$123.45');
        });

        it('should format large amounts with commas', () => {
            const result = formatCurrency(1234567.89, 'USD');
            expect(result).toBe('$1,234,567.89');
        });

        it('should format very small amounts', () => {
            const result = formatCurrency(0.01, 'USD');
            expect(result).toBe('$0.01');
        });

        it('should round to 2 decimal places', () => {
            const result = formatCurrency(10.999, 'USD');
            expect(result).toBe('$11.00');
        });
    });

    describe('Currency-specific formatting', () => {
        it('should format NGN with proper symbol', () => {
            const result = formatCurrency(1000, 'NGN');
            expect(result).toContain('1,000.00');
        });

        it('should format USD with proper symbol', () => {
            const result = formatCurrency(1000, 'USD');
            expect(result).toBe('$1,000.00');
        });
    });
});

describe('formatCurrencyCompact (UX-019)', () => {
    describe('Threshold behavior', () => {
        it('should use full format for numbers below threshold', () => {
            const result = formatCurrencyCompact(9999, 'USD');
            expect(result).toBe('$9,999.00');
        });

        it('should abbreviate numbers at or above threshold', () => {
            const result = formatCurrencyCompact(10000, 'USD');
            expect(result).toBe('$10K');
        });

        it('should respect custom threshold', () => {
            const result = formatCurrencyCompact(5000, 'USD', { compactThreshold: 5000 });
            expect(result).toBe('$5K');
        });
    });

    describe('Abbreviation formats', () => {
        it('should format thousands with K suffix', () => {
            const result = formatCurrencyCompact(12500, 'USD');
            expect(result).toBe('$12.5K');
        });

        it('should format millions with M suffix', () => {
            const result = formatCurrencyCompact(1200000, 'USD');
            expect(result).toBe('$1.2M');
        });

        it('should format billions with B suffix', () => {
            const result = formatCurrencyCompact(3400000000, 'USD');
            expect(result).toBe('$3.4B');
        });

        it('should remove trailing zeros', () => {
            const result = formatCurrencyCompact(10000, 'USD');
            expect(result).toBe('$10K'); // Not $10.0K
        });

        it('should preserve one decimal place for precision', () => {
            const result = formatCurrencyCompact(12345, 'USD');
            expect(result).toBe('$12.3K');
        });
    });

    describe('Negative numbers', () => {
        it('should handle negative thousands', () => {
            const result = formatCurrencyCompact(-15000, 'USD');
            expect(result).toBe('$-15K');
        });

        it('should handle negative millions', () => {
            const result = formatCurrencyCompact(-1500000, 'USD');
            expect(result).toBe('$-1.5M');
        });
    });

    describe('NGN currency', () => {
        it('should format NGN thousands correctly', () => {
            const result = formatCurrencyCompact(357320, 'NGN');
            // Should use ₦ symbol and abbreviate
            expect(result).toContain('357.3K');
        });

        it('should format NGN millions correctly', () => {
            const result = formatCurrencyCompact(1353320, 'NGN');
            expect(result).toContain('1.4M'); // Rounded
        });
    });

    describe('Edge cases', () => {
        it('should handle zero', () => {
            const result = formatCurrencyCompact(0, 'USD');
            expect(result).toBe('$0.00');
        });

        it('should handle very large numbers', () => {
            const result = formatCurrencyCompact(999999999999, 'USD');
            expect(result).toBe('$1000B'); // 1 trillion
        });

        it('should respect maxDecimals option', () => {
            const result = formatCurrencyCompact(12345, 'USD', { maxDecimals: 2 });
            expect(result).toBe('$12.35K'); // 2 decimal places
        });

        it('should force compact for small numbers when requested', () => {
            const result = formatCurrencyCompact(500, 'USD', { forceCompact: true });
            expect(result).toBe('$0.5K');
        });
    });

    describe('Real-world scenarios (from bug report)', () => {
        it('should handle Income: ₦357.32 -> ₦357.32 (below threshold)', () => {
            const result = formatCurrencyCompact(357.32, 'NGN');
            expect(result).toContain('357.32');
        });

        it('should handle Expense: ₦1,353.32 -> ₦1,353.32 (below threshold)', () => {
            const result = formatCurrencyCompact(1353.32, 'NGN');
            expect(result).toContain('1,353.32');
        });

        it('should handle Net: ₦-1,006.00 -> ₦-1,006.00 (below threshold)', () => {
            const result = formatCurrencyCompact(-1006.00, 'NGN');
            expect(result).toContain('-');
            expect(result).toContain('1,006.00');
        });

        it('should handle large Income: ₦357,320 -> ₦357.3K', () => {
            const result = formatCurrencyCompact(357320, 'NGN');
            expect(result).toContain('357.3K');
        });

        it('should handle large Expense: ₦1,353,320 -> ₦1.4M', () => {
            const result = formatCurrencyCompact(1353320, 'NGN');
            expect(result).toContain('1.4M');
        });

        it('should handle large negative Net: ₦-1,006,000 -> ₦-1M', () => {
            const result = formatCurrencyCompact(-1006000, 'NGN');
            expect(result).toContain('-1M');
        });
    });
});

describe('getDynamicFontSize (UX-019)', () => {
    it('should return text-lg for small numbers', () => {
        expect(getDynamicFontSize(1000)).toBe('text-lg');
        expect(getDynamicFontSize(99999)).toBe('text-lg');
    });

    it('should return text-base for medium numbers', () => {
        expect(getDynamicFontSize(100000)).toBe('text-base');
        expect(getDynamicFontSize(500000)).toBe('text-base');
        expect(getDynamicFontSize(999999)).toBe('text-base');
    });

    it('should return text-sm for large numbers', () => {
        expect(getDynamicFontSize(1000000)).toBe('text-sm');
        expect(getDynamicFontSize(10000000)).toBe('text-sm');
    });

    it('should handle negative numbers', () => {
        expect(getDynamicFontSize(-1000000)).toBe('text-sm');
        expect(getDynamicFontSize(-100000)).toBe('text-base');
    });

    it('should handle zero', () => {
        expect(getDynamicFontSize(0)).toBe('text-lg');
    });
});
