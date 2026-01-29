// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
    describe('USD formatting', () => {
        it('formats positive USD amounts correctly', () => {
            const result = formatCurrency(1000, 'USD');
            expect(result).toContain('$');
            expect(result).toContain('1,000.00');
        });

        it('formats negative USD amounts correctly', () => {
            const result = formatCurrency(-500, 'USD');
            expect(result).toContain('-');
            expect(result).toContain('500.00');
        });

        it('formats zero USD correctly', () => {
            const result = formatCurrency(0, 'USD');
            expect(result).toBe('$0.00');
        });

        it('formats decimal USD amounts correctly', () => {
            const result = formatCurrency(123.45, 'USD');
            expect(result).toContain('$123.45');
        });

        it('formats large USD amounts with proper thousand separators', () => {
            const result = formatCurrency(1234567.89, 'USD');
            expect(result).toContain('$');
            expect(result).toContain('1,234,567.89');
        });

        it('formats very small USD amounts correctly', () => {
            const result = formatCurrency(0.01, 'USD');
            expect(result).toBe('$0.01');
        });

        it('formats fractional cents correctly (rounds to 2 decimals)', () => {
            const result = formatCurrency(10.999, 'USD');
            expect(result).toContain('$');
            // JavaScript number formatting will handle rounding
            expect(result).toMatch(/\$11\.00|\$10\.99/);
        });
    });

    describe('NGN formatting', () => {
        it('formats positive NGN amounts correctly', () => {
            const result = formatCurrency(1000, 'NGN');
            expect(result).toContain('₦');
            expect(result).toContain('1,000.00');
        });

        it('formats negative NGN amounts correctly', () => {
            const result = formatCurrency(-500, 'NGN');
            expect(result).toContain('-');
            expect(result).toContain('500.00');
            expect(result).toContain('₦');
        });

        it('formats zero NGN correctly', () => {
            const result = formatCurrency(0, 'NGN');
            expect(result).toContain('₦');
            expect(result).toContain('0.00');
        });

        it('formats large NGN amounts correctly', () => {
            const result = formatCurrency(5000000, 'NGN');
            expect(result).toContain('₦');
            expect(result).toContain('5,000,000.00');
        });

        it('formats decimal NGN amounts correctly', () => {
            const result = formatCurrency(999.99, 'NGN');
            expect(result).toContain('₦');
            expect(result).toContain('999.99');
        });
    });

    describe('Edge cases and locale compatibility', () => {
        it('handles very large numbers without error', () => {
            const result = formatCurrency(999999999.99, 'USD');
            expect(result).toContain('$');
            expect(result).toContain('999,999,999.99');
        });

        it('handles very small negative numbers', () => {
            const result = formatCurrency(-0.01, 'USD');
            expect(result).toContain('-');
            expect(result).toContain('0.01');
        });

        it('maintains minimum fraction digits', () => {
            const result = formatCurrency(100, 'USD');
            // Should always show .00 for whole numbers
            expect(result).toBe('$100.00');
        });

        it('uses correct locale for NGN (en-NG)', () => {
            const result = formatCurrency(1000, 'NGN');
            // en-NG locale should format with comma separator
            expect(result).toMatch(/₦1,000\.00/);
        });

        it('uses correct locale for USD (en-US)', () => {
            const result = formatCurrency(1000, 'USD');
            // en-US locale should format with comma separator
            expect(result).toMatch(/\$1,000\.00/);
        });

        it('handles rounding edge cases consistently', () => {
            // Test that 0.005 rounds correctly (banker's rounding or standard)
            const result = formatCurrency(1.005, 'USD');
            expect(result).toMatch(/\$1\.0[01]/);
        });
    });
});
