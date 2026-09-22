import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../types';
import { FOCUS_LIMIT, selectTodayCommitments } from './todayCommitments';
import { buildDailyBriefing } from './DailyBriefingEngine';

/** 2026-09-20 is a Sunday; 2026-09-21 is a Monday. */
const SUNDAY = new Date(2026, 8, 20, 9, 0, 0);

const task = (overrides: Partial<AnchorTask> & { id: string; title: string }): AnchorTask => ({
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date('2026-01-01'),
    ...overrides,
} as AnchorTask);

/** Scheduled every day, so it is due today. */
const dailyToday = (id: string, extra: Partial<AnchorTask> = {}) => task({ id, title: id, type: 'daily', ...extra });
/** Weekly on Monday: its last scheduled day was before today, so it is carried over. */
const weeklyMonday = (id: string) => task({ id, title: id, type: 'weekly', daysOfWeek: [1] });

describe('the canonical today (CM-30)', () => {
    it('explains the headline: due = scheduled today + carried over', () => {
        const view = selectTodayCommitments([dailyToday('a'), dailyToday('b'), weeklyMonday('c')], SUNDAY);

        expect(view.dueTotal).toBe(3);
        expect(view.scheduledToday).toBe(2);
        expect(view.carriedOver).toBe(1);
        // The relationship the UI states is arithmetic, not editorial.
        expect(view.dueTotal).toBe(view.scheduledToday + view.carriedOver);
    });

    it('separates what is done from what is outstanding without double counting', () => {
        const view = selectTodayCommitments([
            dailyToday('a'),
            dailyToday('b', { completed: true, lastCompletedAt: SUNDAY.toISOString() }),
            weeklyMonday('c'),
        ], SUNDAY);

        expect(view.dueTotal).toBe(3);
        expect(view.completedToday).toBe(1);
        expect(view.remaining).toBe(2);
        expect(view.remaining + view.completedToday).toBe(view.dueTotal);
    });

    it('never counts a completed carried-over commitment as carried over work', () => {
        const view = selectTodayCommitments([weeklyMonday('c'), { ...weeklyMonday('d'), completed: true } as AnchorTask], SUNDAY);

        // Both are due (the second was completed today), but only one is outstanding.
        expect(view.carriedOver).toBe(1);
        expect(view.remaining).toBe(1);
    });

    it('does not carry over a commitment whose schedule has ended', () => {
        const ended = task({ id: 'ended', title: 'ended', type: 'weekly', daysOfWeek: [1], endDate: '2026-09-01' });
        const view = selectTodayCommitments([ended], SUNDAY);

        expect(view.dueTotal).toBe(0);
        expect(view.carriedOver).toBe(0);
    });

    it('draws the focus shortlist from the outstanding work only', () => {
        const view = selectTodayCommitments([
            dailyToday('done', { completed: true, lastCompletedAt: SUNDAY.toISOString() }),
            dailyToday('one'), dailyToday('two'), dailyToday('three'), dailyToday('four'),
        ], SUNDAY);

        expect(view.focusCount).toBe(FOCUS_LIMIT);
        expect(view.focus).toHaveLength(FOCUS_LIMIT);
        expect(view.focus.map((t) => t.id)).not.toContain('done');
        // A subset of the remaining work, never a competing total.
        expect(view.focusCount).toBeLessThanOrEqual(view.remaining);
    });

    it('ranks priority first, then the work that has waited longest', () => {
        const view = selectTodayCommitments([
            dailyToday('low', { priority: 'low' }),
            dailyToday('high', { priority: 'high' }),
            weeklyMonday('carried'),
        ], SUNDAY);

        expect(view.focus[0].id).toBe('high');
        expect(view.focus[1].id).toBe('carried');
    });

    it('is deterministic — the same data always shortlists the same way', () => {
        const tasks = [dailyToday('b'), dailyToday('a'), dailyToday('c')];
        expect(selectTodayCommitments(tasks, SUNDAY).focus.map((t) => t.id))
            .toEqual(selectTodayCommitments([...tasks].reverse(), SUNDAY).focus.map((t) => t.id));
    });

    /**
     * The cross-surface invariant: Home's brief and the assistant's briefing answer
     * "what do I have today" from the same selector. They used to be computed
     * independently, which is how a user ended up reading "15 remaining" in one place and
     * "8 pending" in another.
     */
    it('agrees with the assistant briefing about today', () => {
        const tasks = [
            dailyToday('a'),
            dailyToday('b', { completed: true, lastCompletedAt: SUNDAY.toISOString() }),
            weeklyMonday('c'),
            weeklyMonday('d'),
            task({ id: 'future', title: 'future', type: 'daily', startDate: '2026-09-21' }),
        ];
        const today = selectTodayCommitments(tasks, SUNDAY);
        const briefing = buildDailyBriefing('morning', [], tasks, [], SUNDAY).todayStats;

        expect(briefing.totalTasks).toBe(today.dueTotal);
        expect(briefing.pendingTasks).toBe(today.remaining);
        expect(briefing.completedTasks).toBe(today.completedToday);
        expect(briefing.overdueTasks).toBe(today.carriedOver);
    });

    it('reports a day with nothing due as empty, without inventing work', () => {
        // Starts tomorrow: nothing scheduled today, and nothing carried over either.
        const startsTomorrow = task({ id: 'future', title: 'future', type: 'daily', startDate: '2026-09-21' });
        const view = selectTodayCommitments([startsTomorrow], SUNDAY);

        expect(view.dueTotal).toBe(0);
        expect(view.focus).toEqual([]);
        expect(view.focusCount).toBe(0);
    });

    it('carries over a recurring commitment whose day has passed undone', () => {
        // Wednesday's slot, never done, still outstanding on Sunday.
        const wednesday = task({ id: 'wed', title: 'wed', type: 'weekly', daysOfWeek: [3] });
        const view = selectTodayCommitments([wednesday], SUNDAY);

        expect(view.dueTotal).toBe(1);
        expect(view.carriedOver).toBe(1);
        expect(view.focus.map((t) => t.id)).toEqual(['wed']);
    });
});