import { addWeeks, addMonths, addYears } from 'date-fns';
import type { RecurringTransaction } from './types';

export const VALID_FREQUENCIES = new Set(['weekly', 'monthly', 'yearly']);
export const VALID_TYPES = new Set(['income', 'expense']);

export interface RecurringInput {
    title?: unknown;
    amountCents?: unknown;
    type?: unknown;
    category?: unknown;
    accountId?: unknown;
    frequency?: unknown;
    interval?: unknown;
    nextRunAt?: unknown;
}

export function validateRecurringInput(data: RecurringInput): string | null {
    if (!data.title || typeof data.title !== 'string' || (data.title as string).trim().length === 0)
        return 'title is required';
    if (typeof data.amountCents !== 'number' || data.amountCents <= 0 || !Number.isInteger(data.amountCents))
        return 'amountCents must be a positive integer';
    if (!VALID_TYPES.has(data.type as string))
        return `type must be one of: ${[...VALID_TYPES].join(', ')}`;
    if (!data.accountId || typeof data.accountId !== 'string')
        return 'accountId is required';
    if (!VALID_FREQUENCIES.has(data.frequency as string))
        return `frequency must be one of: ${[...VALID_FREQUENCIES].join(', ')}`;
    if (typeof data.interval !== 'number' || data.interval <= 0 || !Number.isInteger(data.interval))
        return 'interval must be a positive integer';
    if (!data.nextRunAt || typeof data.nextRunAt !== 'string')
        return 'nextRunAt is required';
    return null;
}

export function calcNextRun(from: Date, frequency: string, interval: number): Date {
    if (frequency === 'weekly') return addWeeks(from, interval);
    if (frequency === 'yearly') return addYears(from, interval);
    return addMonths(from, interval);
}

export type { RecurringTransaction };
