import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../types';
import { buildDailyBriefing } from './DailyBriefingEngine';

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

describe('buildDailyBriefing — UX-AI-06 (assistant must agree with Commitments)', () => {
    const now = new Date(2026, 8, 20, 9, 0, 0);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const letter = LETTERS[twoDaysAgo.getDay()];

    it('reports carried-over commitments as due today instead of "nothing scheduled"', () => {
        const commitments = [1, 2, 3, 4].map((n) =>
            task({ id: `c${n}`, title: `Weekly ${n}`, type: 'weekly', daysOfWeek: [letter] }),
        );

        const briefing = buildDailyBriefing('evening', [], commitments, [], now);

        expect(briefing.todayStats.totalTasks).toBe(4);
        expect(briefing.todayStats.pendingTasks).toBe(4);
        expect(briefing.todayStats.overdueTasks).toBe(4);
        expect(briefing.todayStats.trackedCommitments).toBe(4);
        expect(briefing.todayStats.nextDueLabel).toBeTruthy();
        expect(briefing.subtitle).toContain('4 tasks remaining');
    });

    it('says an honest empty day, and offers no next-due for a user with no commitments', () => {
        const briefing = buildDailyBriefing('evening', [], [], [], now);

        expect(briefing.todayStats.totalTasks).toBe(0);
        expect(briefing.todayStats.trackedCommitments).toBe(0);
        expect(briefing.todayStats.overdueTasks).toBe(0);
        expect(briefing.todayStats.nextDueLabel).toBeUndefined();
    });

    it('does not count a completed commitment twice or call it overdue', () => {
        const done = task({ type: 'weekly', daysOfWeek: [letter], completed: true, lastCompletedAt: twoDaysAgo.toISOString() });
        const open = task({ id: 'open', type: 'weekly', daysOfWeek: [letter] });

        const briefing = buildDailyBriefing('morning', [], [done, open], [], now);

        expect(briefing.todayStats.totalTasks).toBe(1);
        expect(briefing.todayStats.completedTasks).toBe(0);
        expect(briefing.todayStats.overdueTasks).toBe(1);
    });
});
