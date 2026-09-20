import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../../types';
import { describeSmartView, filterBySmartView, groupCompletedByPeriod, searchCommitments, SMART_VIEWS } from './smartViews';

/** 2026-09-20 is a Sunday. */
const NOW = new Date(2026, 8, 20, 9, 0, 0);

function task(overrides: Partial<AnchorTask>): AnchorTask {
    return {
        id: Math.random().toString(36).slice(2),
        title: 'Commitment',
        type: 'daily',
        completed: false,
        category: 'personal',
        createdAt: null,
        ...overrides,
    };
}

describe('CM-21 — smart views', () => {
    it('names every view for what it does', () => {
        expect(SMART_VIEWS.map((view) => view.id)).toEqual(['today', 'overdue', 'week', 'later', 'done', 'all']);
        expect(SMART_VIEWS.every((view) => view.description.length > 0)).toBe(true);
    });

    it('Today holds what is owed right now, including carry-over', () => {
        const dueToday = task({ type: 'daily' });
        const carriedOver = task({ type: 'weekly', daysOfWeek: [5] }); // Friday, outstanding
        // Scheduled to *start* tomorrow: nothing was ever missed, so it is not owed today.
        const startsTomorrow = task({ type: 'weekly', daysOfWeek: [1], startDate: '2026-09-21' });
        // Completed today: it still counts on the day it was completed, so the
        // "all done" state is reachable (documented schedule semantics).
        const doneToday = task({ type: 'daily', completed: true, lastCompletedAt: NOW.toISOString() });

        const today = filterBySmartView([dueToday, carriedOver, startsTomorrow, doneToday], 'today', NOW);
        expect(today.map((t) => t.id).sort()).toEqual([dueToday.id, carriedOver.id, doneToday.id].sort());
        expect(today).not.toContain(startsTomorrow);
    });

    it('Overdue is the carried-over part of today', () => {
        const carriedOver = task({ type: 'weekly', daysOfWeek: [5] });
        const dueToday = task({ type: 'daily' });
        const overdue = filterBySmartView([carriedOver, dueToday], 'overdue', NOW);
        expect(overdue.map((t) => t.id)).toEqual([carriedOver.id]);
    });

    it('This week is the next seven days, today excluded', () => {
        const tomorrow = task({ type: 'weekly', daysOfWeek: [1] });      // Monday
        const inThree = task({ type: 'weekly', daysOfWeek: [3] });       // Wednesday
        const today = task({ type: 'daily' });
        // Every two weeks from the week of 14 Sep → next occurrence 28 Sep (8 days).
        const fortnightly = task({ type: 'weekly', daysOfWeek: [1], startDate: '2026-09-14', interval: 2 });

        const week = filterBySmartView([tomorrow, inThree, today, fortnightly], 'week', NOW);
        expect(week.map((t) => t.id).sort()).toEqual([tomorrow.id, inThree.id].sort());
    });

    it('Later is anything beyond a week', () => {
        const fortnightly = task({ type: 'weekly', daysOfWeek: [1], startDate: '2026-09-14', interval: 2 });
        const tomorrow = task({ type: 'weekly', daysOfWeek: [1] });
        expect(filterBySmartView([fortnightly, tomorrow], 'later', NOW).map((t) => t.id)).toEqual([fortnightly.id]);
    });

    it('Done holds completed work, and All holds everything', () => {
        const done = task({ completed: true, lastCompletedAt: NOW.toISOString() });
        const active = task({});
        expect(filterBySmartView([done, active], 'done', NOW).map((t) => t.id)).toEqual([done.id]);
        expect(filterBySmartView([done, active], 'all', NOW)).toHaveLength(2);
    });

    it('never leaves work invisible: every open commitment appears in some view', () => {
        const open = [
            task({ type: 'daily' }),
            task({ type: 'weekly', daysOfWeek: [5] }),
            task({ type: 'weekly', daysOfWeek: [2] }),
            task({ type: 'weekly', daysOfWeek: [1], startDate: '2026-09-21', interval: 2 }),
            task({ type: 'todo', dueDate: '2026-10-30' }),
        ];
        const covered = new Set([
            ...filterBySmartView(open, 'today', NOW),
            ...filterBySmartView(open, 'week', NOW),
            ...filterBySmartView(open, 'later', NOW),
        ].map((t) => t.id));
        expect(covered.size).toBe(open.length);
    });

    it('describes a view for the empty state', () => {
        expect(describeSmartView('overdue', 0)).toContain('Nothing in Overdue');
        expect(describeSmartView('today', 2)).toContain('2 commitments');
        expect(describeSmartView('today', 1)).toContain('1 commitment');
    });
});

describe('CM-15 — search', () => {
    it('matches title, notes and area, case-insensitively', () => {
        const rent = task({ title: 'Pay rent', domain: 'Financial' });
        const run = task({ title: 'Run', notes: '5km before breakfast' });
        const other = task({ title: 'Read', domain: 'Bible' });

        expect(searchCommitments([rent, run, other], 'rent').map((t) => t.id)).toEqual([rent.id]);
        expect(searchCommitments([rent, run, other], '5KM').map((t) => t.id)).toEqual([run.id]);
        expect(searchCommitments([rent, run, other], 'financial').map((t) => t.id)).toEqual([rent.id]);
    });

    it('returns everything for an empty query, so the control is not a trap', () => {
        const tasks = [task({}), task({})];
        expect(searchCommitments(tasks, '   ')).toHaveLength(2);
    });

    it('returns nothing when there is no match, rather than everything', () => {
        expect(searchCommitments([task({ title: 'Read' })], 'zzz')).toHaveLength(0);
    });
});

describe('CM-25 — done history by period', () => {
    it('groups completed work into Today, This week and Earlier', () => {
        const today = task({ completed: true, lastCompletedAt: NOW.toISOString() });
        const threeDaysAgo = task({ completed: true, lastCompletedAt: new Date(2026, 8, 17, 9, 0, 0).toISOString() });
        const lastMonth = task({ completed: true, lastCompletedAt: new Date(2026, 7, 2, 9, 0, 0).toISOString() });

        const groups = groupCompletedByPeriod([today, threeDaysAgo, lastMonth], NOW);
        expect(groups.map((group) => group.label)).toEqual(['Today', 'This week', 'Earlier']);
        expect(groups[0]?.tasks.map((t) => t.id)).toEqual([today.id]);
        expect(groups[1]?.tasks.map((t) => t.id)).toEqual([threeDaysAgo.id]);
        expect(groups[2]?.tasks.map((t) => t.id)).toEqual([lastMonth.id]);
    });

    it('omits empty periods instead of showing an empty heading', () => {
        const groups = groupCompletedByPeriod([task({ completed: true, lastCompletedAt: NOW.toISOString() })], NOW);
        expect(groups.map((group) => group.label)).toEqual(['Today']);
    });

    it('files a completed task with no timestamp under Earlier rather than losing it', () => {
        const groups = groupCompletedByPeriod([task({ completed: true })], NOW);
        expect(groups).toHaveLength(1);
        expect(groups[0]?.label).toBe('Earlier');
    });

    it('ignores active commitments entirely', () => {
        expect(groupCompletedByPeriod([task({})], NOW)).toEqual([]);
    });
});
