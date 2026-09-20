import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../types';
import {
    countScheduledOccurrences,
    describeNextDue,
    getDueDate,
    getDueToday,
    getNextDue,
    isOverdue,
    isScheduledOn,
    nextScheduledOnOrAfter,
    toDateOnly,
} from './commitmentSchedule';

/**
 * CM-17 — the real schedule model: an anchor date, an end date and an interval.
 * "Pay rent on the 1st at 9am, until December" is a promise, and promises have
 * dates. Every field is optional, so the presets behave exactly as before.
 */

function task(overrides: Partial<AnchorTask>): AnchorTask {
    return {
        id: 't1',
        title: 'Commitment',
        type: 'weekly',
        completed: false,
        category: 'personal',
        createdAt: null,
        ...overrides,
    };
}

const MONDAY = new Date(2026, 8, 21, 9, 0, 0);

describe('CM-17 — start date, end date and interval', () => {
    it('does not fire before its start date', () => {
        const t = task({ type: 'daily', startDate: '2026-09-23' });
        expect(isScheduledOn(t, new Date(2026, 8, 22, 9, 0, 0))).toBe(false);
        expect(isScheduledOn(t, new Date(2026, 8, 23, 9, 0, 0))).toBe(true);
    });

    it('stops firing after its end date and is never overdue afterwards', () => {
        const t = task({ type: 'daily', endDate: '2026-09-22' });
        expect(isScheduledOn(t, new Date(2026, 8, 22, 9, 0, 0))).toBe(true);
        expect(isScheduledOn(t, new Date(2026, 8, 25, 9, 0, 0))).toBe(false);
        // A retired commitment must not haunt the list as carried-over work.
        expect(isOverdue(t, new Date(2026, 8, 25, 9, 0, 0))).toBe(false);
        expect(getDueToday([t], new Date(2026, 8, 25, 9, 0, 0))).toHaveLength(0);
    });

    it('honours "every 2 days" for a daily commitment', () => {
        const t = task({ type: 'daily', startDate: '2026-09-21', interval: 2 });
        expect(isScheduledOn(t, new Date(2026, 8, 21, 9, 0, 0))).toBe(true);
        expect(isScheduledOn(t, new Date(2026, 8, 22, 9, 0, 0))).toBe(false);
        expect(isScheduledOn(t, new Date(2026, 8, 23, 9, 0, 0))).toBe(true);
    });

    it('honours "every 2 weeks" from the anchor week', () => {
        // Anchor week is the week of Sun 2026-09-20; the next scheduled week is
        // the week of Sun 2026-10-04.
        const t = task({ type: 'weekly', daysOfWeek: [1], startDate: '2026-09-21', interval: 2 });
        expect(isScheduledOn(t, MONDAY)).toBe(true);
        expect(isScheduledOn(t, new Date(2026, 8, 28, 9, 0, 0))).toBe(false); // next Monday
        expect(isScheduledOn(t, new Date(2026, 9, 5, 9, 0, 0))).toBe(true);   // two weeks on
    });

    it('honours "every 3 months" for a monthly commitment', () => {
        const t = task({ type: 'monthly', dayOfMonth: 1, startDate: '2026-01-01', interval: 3 });
        expect(isScheduledOn(t, new Date(2026, 0, 1, 9, 0, 0))).toBe(true);
        expect(isScheduledOn(t, new Date(2026, 1, 1, 9, 0, 0))).toBe(false);
        expect(isScheduledOn(t, new Date(2026, 3, 1, 9, 0, 0))).toBe(true);
    });

    it('keeps the preset behaviour when an interval has no anchor to count from', () => {
        const t = task({ type: 'daily', interval: 3 });
        expect(isScheduledOn(t, MONDAY)).toBe(true);
    });

    it('treats a one-off with a due date as promised for that day', () => {
        const t = task({ type: 'todo', dueDate: '2026-09-25' });
        expect(getDueDate(t)).not.toBeNull();
        expect(isScheduledOn(t, new Date(2026, 8, 24, 9, 0, 0))).toBe(false);
        expect(isScheduledOn(t, new Date(2026, 8, 25, 9, 0, 0))).toBe(true);
    });

    it('keeps an unpaid one-off visible after its due date instead of losing it', () => {
        const t = task({ type: 'todo', dueDate: '2026-09-25' });
        expect(isScheduledOn(t, new Date(2026, 8, 27, 9, 0, 0))).toBe(true);
        expect(getDueToday([t], new Date(2026, 8, 27, 9, 0, 0))).toHaveLength(1);
    });

    it('drops a completed one-off out of today', () => {
        const t = task({ type: 'todo', dueDate: '2026-09-25', completed: true, lastCompletedAt: new Date(2026, 8, 25, 10, 0, 0).toISOString() });
        expect(getDueToday([t], new Date(2026, 8, 27, 9, 0, 0))).toHaveLength(0);
    });

    it('counts expectations only inside the schedule window', () => {
        const bounded = task({ type: 'daily', startDate: '2026-09-21', endDate: '2026-09-25' });
        expect(countScheduledOccurrences(bounded, new Date(2026, 8, 1), new Date(2026, 8, 30))).toBe(5);
    });

    it('reports no next occurrence once the schedule has ended', () => {
        const ended = task({ type: 'daily', endDate: '2026-09-22' });
        expect(nextScheduledOnOrAfter(ended, new Date(2026, 8, 25, 9, 0, 0))).toBeNull();
        expect(getNextDue([ended], new Date(2026, 8, 25, 9, 0, 0))).toBeNull();
    });

    it('describes the next due day in plain words', () => {
        expect(describeNextDue(new Date(2026, 8, 21, 9, 0, 0), new Date(2026, 8, 20, 9, 0, 0))).toBe('tomorrow');
        expect(describeNextDue(new Date(2026, 8, 25, 9, 0, 0), new Date(2026, 8, 20, 9, 0, 0))).toBe('Fri');
        expect(describeNextDue(new Date(2026, 9, 5, 9, 0, 0), new Date(2026, 8, 20, 9, 0, 0))).toBe('5 Oct');
    });

    it('serialises a date to the local day, so the picker round-trips', () => {
        expect(toDateOnly(new Date(2026, 8, 20, 23, 30, 0))).toBe('2026-09-20');
        expect(toDateOnly(new Date(2026, 0, 5, 0, 0, 0))).toBe('2026-01-05');
    });
});
