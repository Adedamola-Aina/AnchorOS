import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../../types';
import type { Insight } from '../../../types/fabric';
import { selectTodayCommitments } from '../todayCommitments';
import { selectHomeInsight } from './homeInsight';

const SUNDAY = new Date(2026, 8, 20, 9, 0, 0);

const task = (id: string, overrides: Partial<AnchorTask> = {}): AnchorTask => ({
    id, title: id, type: 'daily', completed: false, category: 'personal',
    createdAt: new Date('2026-01-01'), ...overrides,
} as AnchorTask);

/** `remaining` outstanding today, `carried` of which came from an earlier day. */
const workload = (remaining: number, carried: number) => {
    const carriedTasks = Array.from({ length: carried }, (_, i) => task(`c${i}`, { type: 'weekly', daysOfWeek: [3] }));
    const freshTasks = Array.from({ length: remaining - carried }, (_, i) => task(`f${i}`));
    return selectTodayCommitments([...carriedTasks, ...freshTasks], SUNDAY);
};

const assistantInsight = (overrides: Partial<Insight> = {}): Insight => ({
    id: 'assistant-1', category: 'commitments', headline: 'Commitment completion: 3%',
    detail: '9 of 358 scheduled commitments done in the last 30 days.',
    reasoning: 'Counted 358 scheduled occurrences per cadence since 2026-08-21.',
    trend: 'down', severity: 'attention', metric: { current: 3, previous: 0, unit: '%' },
    actionLink: '/commitments', createdAt: SUNDAY.toISOString(), ...overrides,
});

describe('selectHomeInsight (CM-30)', () => {
    it('says nothing when there is nothing worth saying', () => {
        const quiet = selectHomeInsight({ today: workload(2, 0), insights: null, now: SUNDAY });
        expect(quiet).toBeNull();
    });

    /**
     * The reported problem was narration: Home restating a count the user had already
     * read. This insight has to earn its place with an interpretation and evidence.
     */
    it('interprets a heavy, mostly carried-over day', () => {
        const insight = selectHomeInsight({ today: workload(12, 5), insights: null, now: SUNDAY });

        expect(insight).not.toBeNull();
        expect(insight!.severity).toBe('attention');
        expect(insight!.summary).toMatch(/12 commitments are still outstanding/);
        expect(insight!.summary).toMatch(/5 of them were carried over/);
        // "Why" explains a consequence rather than repeating the numbers.
        expect(insight!.why).toMatch(/waited longest|unmanageable/);
        expect(insight!.evidence).toEqual([
            '12 due today', '7 scheduled for today', '5 carried over', '0 already done',
        ]);
        expect(insight!.actions[0]).toEqual({ label: 'Review commitments', href: '/commitments' });
        expect(insight!.source).toBe('commitments');
    });

    it('stays quiet for a busy-but-healthy day', () => {
        expect(selectHomeInsight({ today: workload(12, 1), insights: null, now: SUNDAY })).toBeNull();
        expect(selectHomeInsight({ today: workload(4, 4), insights: null, now: SUNDAY })).toBeNull();
    });

    it('prefers what needs attention over what is merely good news', () => {
        const insight = selectHomeInsight({
            today: workload(1, 0),
            insights: [
                assistantInsight({ id: 'positive', severity: 'positive', headline: '30-day streak' }),
                assistantInsight({ id: 'attention', severity: 'attention' }),
            ],
            now: SUNDAY,
        });

        expect(insight!.id).toBe('attention');
    });

    it('carries the assistant’s own reasoning through rather than paraphrasing it', () => {
        const insight = selectHomeInsight({ today: workload(1, 0), insights: [assistantInsight()], now: SUNDAY });

        expect(insight!.why).toBe('Counted 358 scheduled occurrences per cadence since 2026-08-21.');
        expect(insight!.summary).toBe('9 of 358 scheduled commitments done in the last 30 days.');
        expect(insight!.evidence).toEqual(['3% now', 'Trend: down']);
    });

    it('names its source, so provenance can be shown', () => {
        expect(selectHomeInsight({ today: workload(1, 0), insights: [assistantInsight()], now: SUNDAY })!.source).toBe('assistant');
        expect(selectHomeInsight({ today: workload(12, 5), insights: null, now: SUNDAY })!.source).toBe('commitments');
    });

    it('respects a dismissal instead of showing it again', () => {
        const dismissed = selectHomeInsight({
            today: workload(12, 5), insights: null, dismissedIds: ['home-insight-overcommitment'], now: SUNDAY,
        });

        expect(dismissed).toBeNull();
    });

    it('falls back to the next candidate when the first is dismissed', () => {
        const next = selectHomeInsight({
            today: workload(12, 5),
            insights: [assistantInsight()],
            dismissedIds: ['home-insight-overcommitment'],
            now: SUNDAY,
        });

        expect(next!.id).toBe('assistant-1');
    });

    it('never invents an insight to fill the card', () => {
        // No commitments, no assistant insights, no goals: Home shows no insight at all.
        const empty = selectTodayCommitments([], SUNDAY);
        expect(selectHomeInsight({ today: empty, insights: [], now: SUNDAY })).toBeNull();
    });
});