import type { RecurringTransaction } from './types';
import { addWeeks, addMonths, addYears, parseISO } from 'date-fns';

export const VALID_FREQUENCIES = new Set(['weekly', 'monthly', 'yearly']);
export const VALID_TYPES = new Set(['income', 'expense']);

/**
 * Validate required fields on a recurring rule before processing.
 * Returns an error string if invalid, null if valid.
 */
export function validateRule(rule: RecurringTransaction): string | null {
    if (!rule.userId || typeof rule.userId !== 'string') return 'missing userId';
    if (!rule.accountId || typeof rule.accountId !== 'string') return 'missing accountId';
    if (!rule.title || typeof rule.title !== 'string') return 'missing title';
    if (typeof rule.amountCents !== 'number' || rule.amountCents <= 0) return 'invalid amountCents';
    if (!VALID_TYPES.has(rule.type)) return `invalid type: ${rule.type}`;
    if (!VALID_FREQUENCIES.has(rule.frequency)) return `invalid frequency: ${rule.frequency}`;
    if (typeof rule.interval !== 'number' || rule.interval <= 0 || !Number.isInteger(rule.interval)) return 'invalid interval';
    if (!rule.nextRunAt || typeof rule.nextRunAt !== 'string') return 'missing nextRunAt';
    return null;
}

export function calculateNextRun(currentDate: Date, frequency: string, interval: number): Date {
    switch (frequency) {
        case 'weekly':
            return addWeeks(currentDate, interval);
        case 'monthly':
            return addMonths(currentDate, interval);
        case 'yearly':
            return addYears(currentDate, interval);
        default:
            return addMonths(currentDate, interval);
    }
}

// Re-export parseISO so consumers only need one import
export { parseISO };
