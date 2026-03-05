import { describe, expect, it } from 'vitest';
import { buildReminderMessage } from './reminderBatching';

describe('reminderBatching', () => {
    it('returns single-title payload for one reminder', () => {
        const message = buildReminderMessage(['Morning walk']);
        expect(message).toEqual({ title: 'Morning walk', body: undefined });
    });

    it('returns concise summary body for multiple reminders', () => {
        const message = buildReminderMessage(['Morning walk', 'Read book', 'Drink water']);
        expect(message).toEqual({
            title: 'Morning walk',
            body: '+2 more commitments due now',
        });
    });

    it('returns safe fallback for empty lists', () => {
        const message = buildReminderMessage([]);
        expect(message).toEqual({
            title: 'Commitment reminder',
            body: undefined,
        });
    });
});
