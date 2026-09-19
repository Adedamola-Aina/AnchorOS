import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../../types';
import { buildCommitmentInsight } from './commitmentInsights';

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

describe('buildCommitmentInsight — UX-AI-08 metric honesty', () => {
    const now = new Date(2026, 8, 20, 9, 0, 0);

    it('no longer reports "0 of N in the last 30 days" for a habit the user has kept', () => {
        // The audit case: a daily commitment completed every day. The old metric
        // read the momentary `completed` flag against the number of commitments
        // and called it 30-day performance: 0 of 1 = 0%.
        const kept = task({ completed: true, currentStreak: 30, lastCompletedAt: now.toISOString() });

        const insight = buildCommitmentInsight([kept], now);

        expect(insight).not.toBeNull();
        expect(insight!.detail).toContain('30 of 31 scheduled commitments');
        expect(insight!.detail).not.toMatch(/0 of 1 /);
        expect(insight!.metric.current).toBeGreaterThanOrEqual(90);
    });

    it('measures partial consistency against what the cadence required', () => {
        const weekly = task({
            type: 'weekly',
            daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            completed: false,
            currentStreak: 1,
            lastCompletedAt: new Date(2026, 8, 18, 9, 0, 0).toISOString(),
        });

        const insight = buildCommitmentInsight([weekly], now);

        expect(insight).not.toBeNull();
        // A daily-equivalent weekly requires 31 occurrences in the window.
        expect(insight!.detail).toContain('1 of 31 scheduled commitments');
        expect(insight!.severity).toBe('attention');
    });

    it('stays silent when nothing was due in the window instead of reporting 0%', () => {
        const futureMonthly = task({ type: 'monthly', createdAt: now, dayOfMonth: now.getDate() + 1 });

        expect(buildCommitmentInsight([futureMonthly], now)).toBeNull();
    });

    it('returns null when there are no commitments at all', () => {
        expect(buildCommitmentInsight([], now)).toBeNull();
    });

    it('caps completions at the expectation so the rate can never exceed 100%', () => {
        const overAchiever = task({ completed: true, currentStreak: 400, lastCompletedAt: now.toISOString() });

        const insight = buildCommitmentInsight([overAchiever], now);

        expect(insight!.metric.current).toBe(100);
        expect(insight!.detail).toContain('31 of 31 scheduled commitments');
    });
});
