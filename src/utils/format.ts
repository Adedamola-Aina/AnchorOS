import type { Currency } from '../types';

export const formatCurrency = (amount: number, currency: Currency) => {
    const locale = currency === 'NGN' ? 'en-NG' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Format currency with smart abbreviations for large numbers.
 * 
 * UX-019 FIX: Prevents UI overflow with large financial amounts.
 * - Numbers < 10K: Full format (₦9,999.00)
 * - Numbers >= 10K: Abbreviated (₦12.5K, ₦1.2M, ₦3.4B)
 * - Preserves precision with decimal for abbreviated numbers
 * 
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param options - Formatting options
 * @returns Formatted currency string with abbreviation if needed
 */
export const formatCurrencyCompact = (
    amount: number,
    currency: Currency,
    options?: {
        /** Force abbreviation even for small numbers */
        forceCompact?: boolean;
        /** Threshold for abbreviation (default: 10000) */
        compactThreshold?: number;
        /** Maximum decimal places for abbreviated numbers (default: 1) */
        maxDecimals?: number;
    }
) => {
    const threshold = options?.compactThreshold ?? 10000;
    const maxDecimals = options?.maxDecimals ?? 1;
    const absAmount = Math.abs(amount);

    // Use full format for small numbers (unless forced)
    if (!options?.forceCompact && absAmount < threshold) {
        return formatCurrency(amount, currency);
    }

    // Determine abbreviation
    let abbreviated: string;
    let suffix: string;

    if (absAmount >= 1_000_000_000) {
        // Billions
        abbreviated = (amount / 1_000_000_000).toFixed(maxDecimals);
        suffix = 'B';
    } else if (absAmount >= 1_000_000) {
        // Millions
        abbreviated = (amount / 1_000_000).toFixed(maxDecimals);
        suffix = 'M';
    } else {
        // Thousands (or forced compact for small numbers)
        abbreviated = (amount / 1_000).toFixed(maxDecimals);
        suffix = 'K';
    }

    // Remove trailing zeros after decimal
    abbreviated = abbreviated.replace(/\.0+$/, '');

    // Get currency symbol
    const locale = currency === 'NGN' ? 'en-NG' : 'en-US';
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    // Extract symbol (e.g., "₦" or "$")
    const parts = formatter.formatToParts(0);
    const symbol = parts.find(p => p.type === 'currency')?.value || '';

    return `${symbol}${abbreviated}${suffix}`;
};

/**
 * Get appropriate font size class based on number magnitude.
 * 
 * UX-019 FIX: Dynamic font sizing prevents overflow.
 * - Small numbers (< 100K): text-lg
 * - Medium numbers (100K - 1M): text-base
 * - Large numbers (> 1M): text-sm
 * 
 * @param amount - The amount to check
 * @returns Tailwind font size class
 */
export const getDynamicFontSize = (amount: number): string => {
    const absAmount = Math.abs(amount);

    if (absAmount >= 1_000_000) {
        return 'text-sm'; // Large numbers
    } else if (absAmount >= 100_000) {
        return 'text-base'; // Medium numbers
    } else {
        return 'text-lg'; // Small numbers (default)
    }
};
