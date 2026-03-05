import { describe, expect, it } from 'vitest';
import { getReminderLinkPath } from './reminderRouting';

describe('reminderRouting', () => {
    it('routes single commitments category to commitments screen', () => {
        expect(getReminderLinkPath(['commitments'])).toBe('/commitments');
    });

    it('routes single finance category to finance screen', () => {
        expect(getReminderLinkPath(['finance'])).toBe('/finance');
    });

    it('routes mixed categories to generic notifications screen', () => {
        expect(getReminderLinkPath(['commitments', 'family'])).toBe('/notifications');
    });
});
