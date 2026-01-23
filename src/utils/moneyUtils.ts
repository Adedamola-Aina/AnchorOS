/**
 * Money Utilities - Safe integer-based currency operations
 * 
 * All money is stored as integer CENTS (or kobo for NGN) to avoid
 * floating-point precision errors. Display functions convert back.
 */

/**
 * Convert a display amount (e.g., 10.50 or "10.50") to storage cents (1050)
 */
export const toCents = (displayAmount: number | string): number => {
    if (typeof displayAmount === 'string') {
        let cleaned = displayAmount.replace(/[$₦\s]/g, ''); // Remove currency symbols and spaces

        // Handle European notation: if there's exactly one comma and no period, treat comma as decimal
        const commaCount = (cleaned.match(/,/g) || []).length;
        const periodCount = (cleaned.match(/\./g) || []).length;

        if (commaCount === 1 && periodCount === 0) {
            // European notation: "10,50" -> "10.50"
            cleaned = cleaned.replace(',', '.');
        } else {
            // US notation: "1,000.50" -> remove thousand separators
            cleaned = cleaned.replace(/,/g, '');
        }

        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : Math.round(parsed * 100);
    }
    return Math.round(displayAmount * 100);
};

/**
 * Convert storage cents (1050) to display amount (10.50)
 */
export const fromCents = (cents: number): number => {
    if (!cents) return 0;
    return cents / 100;
};

/**
 * Format cents as a currency string for display
 */
export const formatMoney = (cents: number, currency: 'USD' | 'NGN' = 'USD'): string => {
    const amount = fromCents(cents);
    const symbol = currency === 'NGN' ? '₦' : '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Safely add two money amounts (in cents)
 */
export const addMoney = (a: number, b: number): number => {
    return a + b;
};

/**
 * Safely subtract money amounts (in cents)
 */
export const subtractMoney = (a: number, b: number): number => {
    return a - b;
};

/**
 * Parse user input string to cents
 * Alias for toCents for semantic clarity in forms
 */
export const parseInputToCents = (input: string): number => {
    return toCents(input);
};
