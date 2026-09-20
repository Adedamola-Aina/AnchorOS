import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../types';
import { countScheduledOccurrences, describeNextDue, getDueToday, getNextDue, isOverdue, isScheduledOn } from './commitmentSchedule';

const LETTERS = [0, 1, 2, 3, 4, 5, 6] as const;

function task(overrides: Partial<AnchorTask>): AnchorTask {
    return {
        id: 't1',
        title: 'Commitment',
        type: 'daily',
        completed: false,
        category: 'personal',
        createdAt: null,
        ...overrides,
    };
}

/** Any day; the assertions derive the weekday instead of assuming one. */
const now = new Date(2026, 8, 20, 9, 0, 0);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const twoDaysAgoLetter = LETTERS[twoDaysAgo.getDay()];

describe('commitmentSchedule — UX-AI-06 root cause', () => {
    it('treats a commitment whose scheduled day has passed as due today, not as "nothing scheduled"', () => {
        // The audit scenario: active weekly commitments on a day that is not
        // today, left outstanding — the assistant used to report 0.
        const weekly = task({ type: 'weekly', daysOfWeek: [twoDaysAgoLetter] });
        expect(isScheduledOn(weekly, now)).toBe(false);
        expect(isOverdue(weekly, now)).toBe(true);
        expect(getDueToday([weekly], now)).toHaveLength(1);
    });

    it('carries over every outstanding commitment, so the assistant cannot undercount', () => {
        const commitments = [1, 2, 3, 4].map((n) =>
            task({ id: `c${n}`, title: `Weekly ${n}`, type: 'weekly', daysOfWeek: [twoDaysAgoLetter] }),
        );
        expect(getDueToday(commitments, now)).toHaveLength(4);
    });

    it('never calls completed work overdue, so an old win is not dragged into today', () => {
        const done = task({ type: 'weekly', daysOfWeek: [twoDaysAgoLetter], completed: true, lastCompletedAt: twoDaysAgo.toISOString() });
        expect(isOverdue(done, now)).toBe(false);
        expect(getDueToday([done], now)).toHaveLength(0);
    });

    it('counts a completed commitment on its scheduled day (so "all done" is reachable)', () => {
        const todayLetter = LETTERS[now.getDay()];
        const doneToday = task({ type: 'weekly', daysOfWeek: [todayLetter], completed: true, lastCompletedAt: now.toISOString() });
        expect(getDueToday([doneToday], now)).toHaveLength(1);
        expect(isOverdue(doneToday, now)).toBe(false);
    });

    it('keeps a monthly commitment with a passed day-of-month visible', () => {
        const monthly = task({ type: 'monthly', dayOfMonth: 10 });
        const midMonth = new Date(2026, 0, 15, 9, 0, 0);
        expect(isScheduledOn(monthly, midMonth)).toBe(false);
        expect(isOverdue(monthly, midMonth)).toBe(true);
        expect(getDueToday([monthly], midMonth)).toHaveLength(1);
    });

    it('treats a weekly/monthly commitment with no configured day as available, never invisible', () => {
        expect(isScheduledOn(task({ type: 'weekly' }), now)).toBe(true);
        expect(isScheduledOn(task({ type: 'monthly' }), now)).toBe(true);
    });

    it('drops stale completed to-dos from the denominator but keeps today\'s completions', () => {
        const stale = task({ type: 'todo', completed: true, lastCompletedAt: new Date(2026, 7, 1).toISOString() });
        const completedToday = task({ type: 'todo', completed: true, lastCompletedAt: now.toISOString() });
        const open = task({ type: 'todo' });
        expect(getDueToday([stale], now)).toHaveLength(0);
        expect(getDueToday([completedToday], now)).toHaveLength(1);
        expect(getDueToday([open], now)).toHaveLength(1);
    });
});

describe('commitmentSchedule — next due', () => {
    it('labels the next day deterministically (no locale dependence)', () => {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const inThree = new Date(now);
        inThree.setDate(inThree.getDate() + 3);
        const inTen = new Date(now);
        inTen.setDate(inTen.getDate() + 10);

        expect(describeNextDue(now, now)).toBe('today');
        expect(describeNextDue(tomorrow, now)).toBe('tomorrow');
        expect(describeNextDue(inThree, now)).toBe(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][inThree.getDay()]);
        expect(describeNextDue(inTen, now)).toMatch(/^\d{1,2} [A-Z][a-z]{2}$/);
    });

    it('finds the earliest upcoming occurrence and ignores completed commitments', () => {
        const done = task({ id: 'done', type: 'daily', completed: true, lastCompletedAt: now.toISOString() });
        expect(getNextDue([], now)).toBeNull();
        expect(getNextDue([done], now)).toBeNull();
        expect(getNextDue([task({ type: 'daily' })], now)?.getDate()).toBe(now.getDate());
    });
});

describe('commitmentSchedule — expected occurrences (UX-AI-08 denominator)', () => {
    const from = new Date(2026, 8, 20, 0, 0, 0);
    from.setDate(from.getDate() - 30);

    it('counts how often a cadence required the commitment inside the window', () => {
        // 31 inclusive days for a daily commitment.
        expect(countScheduledOccurrences(task({ type: 'daily' }), from, now)).toBe(31);
        // A weekly commitment recurs roughly weekly in a 31-day window. The data
        // model stores day *letters* (S M T W T F S), so a 'T' or 'S' commitment
        // legitimately matches two weekdays — hence the range rather than a
        // single number. This letter collision is a known cadence limitation.
        const weekly = countScheduledOccurrences(task({ type: 'weekly', daysOfWeek: [LETTERS[now.getDay()]] }), from, now);
        expect(weekly).toBeGreaterThanOrEqual(4);
        expect(weekly).toBeLessThanOrEqual(10);
        // A one-off to-do carries a single expectation.
        expect(countScheduledOccurrences(task({ type: 'todo' }), from, now)).toBe(1);
    });

    it('does not blame a new commitment for weeks before it existed', () => {
        const createdToday = task({ type: 'daily', createdAt: now });
        expect(countScheduledOccurrences(createdToday, from, now)).toBe(1);
    });

    it('returns zero when the cadence was never due in the window', () => {
        const tomorrowsMonthly = task({ type: 'monthly', createdAt: now, dayOfMonth: now.getDate() + 1 });
        expect(countScheduledOccurrences(tomorrowsMonthly, from, now)).toBe(0);
        expect(countScheduledOccurrences(task({ type: 'daily' }), now, from)).toBe(0);
    });

    it('counts a monthly commitment once per matching day-of-month', () => {
        const monthly = task({ type: 'monthly', dayOfMonth: 15 });
        const wideFrom = new Date(2026, 5, 1, 0, 0, 0);   // 1 Jun 2026
        const wideTo = new Date(2026, 8, 20, 0, 0, 0);    // 20 Sep 2026
        expect(countScheduledOccurrences(monthly, wideFrom, wideTo)).toBe(4); // 15 Jun, Jul, Aug, Sep
    });
});
