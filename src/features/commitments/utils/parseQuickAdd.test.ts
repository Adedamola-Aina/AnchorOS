import { describe, it, expect } from 'vitest';
import { describeQuickAdd, parseQuickAdd } from './parseQuickAdd';

/** 2026-09-20 is a Sunday. */
const NOW = new Date(2026, 8, 20, 9, 0, 0);

describe('CM-16 — instant add parses a line into a draft', () => {
    it('parses a weekday and a time out of a promise', () => {
        const draft = parseQuickAdd('Pay rent Fri 9am', NOW);
        expect(draft).toEqual({
            title: 'Pay rent',
            type: 'weekly',
            daysOfWeek: [5],
            reminderTime: '09:00',
        });
    });

    it('parses a cadence word and leaves the duration in the title', () => {
        const draft = parseQuickAdd('Read 15m daily', NOW);
        expect(draft?.type).toBe('daily');
        expect(draft?.title).toBe('Read 15m');
    });

    it('parses "every 2 weeks" as an interval, not a title word', () => {
        const draft = parseQuickAdd('Call Mum every 2 weeks', NOW);
        expect(draft).toMatchObject({ title: 'Call Mum', type: 'weekly', interval: 2 });
    });

    it('parses an ordinal date as a monthly commitment', () => {
        const draft = parseQuickAdd('Pay rent on the 1st at 09:00', NOW);
        expect(draft).toMatchObject({ title: 'Pay rent', type: 'monthly', dayOfMonth: 1, reminderTime: '09:00' });
    });

    it('parses 24-hour and meridiem times, including 12am and 12pm', () => {
        expect(parseQuickAdd('Standup 9:30pm', NOW)?.reminderTime).toBe('21:30');
        expect(parseQuickAdd('Standup at 14:05', NOW)?.reminderTime).toBe('14:05');
        expect(parseQuickAdd('Night feed 12am', NOW)?.reminderTime).toBe('00:00');
        expect(parseQuickAdd('Lunch 12pm', NOW)?.reminderTime).toBe('12:00');
    });

    it('does not mistake a duration for a time', () => {
        const draft = parseQuickAdd('Run 30m daily', NOW);
        expect(draft?.reminderTime).toBeUndefined();
        expect(draft?.title).toBe('Run 30m');
    });

    it('turns "tomorrow" into an exact due date for a one-off', () => {
        const draft = parseQuickAdd('Submit form tomorrow', NOW);
        expect(draft).toMatchObject({ title: 'Submit form', type: 'todo', dueDate: '2026-09-21' });
    });

    it('keeps everything it cannot parse in the title', () => {
        expect(parseQuickAdd('Call the plumber about the boiler', NOW)).toEqual({
            title: 'Call the plumber about the boiler',
            type: 'todo',
        });
    });

    it('returns null for an empty or whitespace-only line', () => {
        expect(parseQuickAdd('', NOW)).toBeNull();
        expect(parseQuickAdd('   ', NOW)).toBeNull();
        expect(parseQuickAdd('daily', NOW)).toBeNull();
    });

    it('reads multiple weekdays as a set', () => {
        const draft = parseQuickAdd('Gym Mon Wed Fri', NOW);
        expect(draft?.type).toBe('weekly');
        expect(draft?.daysOfWeek).toEqual([1, 3, 5]);
        expect(draft?.title).toBe('Gym');
    });

    it('summarises a draft so the user can see what was understood', () => {
        expect(describeQuickAdd(parseQuickAdd('Pay rent Fri 9am', NOW)!)).toBe('weekly · Fri · at 09:00');
        expect(describeQuickAdd(parseQuickAdd('Call Mum every 2 weeks', NOW)!)).toBe('every 2 weeks');
        expect(describeQuickAdd(parseQuickAdd('Submit form tomorrow', NOW)!)).toBe('due 2026-09-21');
    });
});
