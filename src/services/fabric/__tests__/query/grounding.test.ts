import { describe, it, expect } from 'vitest';
import type { AnchorTask, AnchorTransaction } from '../../../../types';
import { runFabricQuery } from '../../QueryEngine';
import { deriveCitations, UNCITED_ACTIONS } from '../../query/citations';
import { getDueToday } from '../../commitmentSchedule';
import type { RunFabricQueryInput } from '../../query/types';

/**
 * AI-11 — grounding invariants.
 *
 * The assistant is only worth trusting if its numbers are the page's numbers.
 * These tests compare what the assistant says against the same shared functions
 * the pages use, so the two can never quietly diverge.
 */

const NOW = new Date(2026, 8, 20, 9, 0, 0); // Sunday

function txn(overrides: Partial<AnchorTransaction>): AnchorTransaction {
    return {
        id: `tx-${Math.random().toString(36).slice(2)}`,
        accountId: 'acc-1',
        amountCents: 1000,
        type: 'expense',
        category: 'Groceries',
        date: new Date(2026, 8, 18).toISOString(),
        ...overrides,
    } as AnchorTransaction;
}

function task(overrides: Partial<AnchorTask>): AnchorTask {
    return {
        id: `task-${Math.random().toString(36).slice(2)}`,
        title: 'Commitment',
        type: 'daily',
        completed: false,
        category: 'personal',
        createdAt: null,
        ...overrides,
    };
}

function makeInput(action: string, overrides: Partial<RunFabricQueryInput> = {}): RunFabricQueryInput {
    return {
        intent: { action, entities: { timePeriod: 'this_month' } } as RunFabricQueryInput['intent'],
        input: 'test',
        transactions: [
            txn({ amountCents: 2500, type: 'expense', date: new Date(2026, 8, 15).toISOString() }),
            txn({ amountCents: 1000, type: 'expense', date: new Date(2026, 8, 16).toISOString() }),
            txn({ amountCents: 5000, type: 'income', category: 'Salary', date: new Date(2026, 8, 17).toISOString() }),
            // Outside the window, and soft-deleted: neither may be counted.
            txn({ amountCents: 9900, type: 'expense', date: new Date(2026, 6, 1).toISOString() }),
            txn({ amountCents: 7700, type: 'expense', isSoftDeleted: true, date: new Date(2026, 8, 18).toISOString() }),
        ],
        commitments: [
            task({ type: 'daily' }),
            task({ type: 'weekly', daysOfWeek: [5] }),            // Friday, outstanding
            task({ type: 'daily', completed: true, lastCompletedAt: NOW.toISOString() }),
        ],
        accounts: [
            { id: 'acc-1', balanceCents: 100000, currency: 'NGN' } as RunFabricQueryInput['accounts'][number],
        ],
        recurring: [],
        now: NOW,
        ...overrides,
    };
}

describe('AI-11 — every answer that claims a number is grounded', () => {
    it('cites the records for every data-claiming action', () => {
        const claiming = [
            'query_spending', 'query_income', 'query_commitments', 'query_savings_rate',
            'query_day_of_week', 'query_correlation', 'query_momentum', 'query_accounts',
            'query_recurring', 'query_family', 'query_net_worth', 'query_today',
            'query_upcoming', 'plan_week', 'summarize_week', 'query_scenario',
        ];
        for (const action of claiming) {
            const citations = deriveCitations(makeInput(action));
            expect(citations, `${action} must cite its records`).toBeDefined();
            expect(citations!.length).toBeGreaterThan(0);
            // A citation is only useful if it says what, how many and on what basis.
            for (const citation of citations!) {
                expect(citation.label.length).toBeGreaterThan(0);
                expect(citation.basis.length).toBeGreaterThan(0);
                expect(citation.count).toBeGreaterThanOrEqual(0);
            }
        }
    });

    it('cites nothing for answers that claim nothing', () => {
        for (const action of UNCITED_ACTIONS) {
            expect(deriveCitations(makeInput(action))).toBeUndefined();
        }
    });

    it('attaches citations through the engine, so no query can bypass them', () => {
        const result = runFabricQuery(makeInput('query_spending'));
        expect(result.citations).toBeDefined();
        expect(result.summary.length).toBeGreaterThan(0);
    });

    it('reports the same "today" as the Commitments page', () => {
        const input = makeInput('query_today');
        const citations = deriveCitations(input)!;
        // The page's own definition, not a second implementation of it.
        expect(citations[0]!.count).toBe(getDueToday(input.commitments, NOW).length);
        expect(citations[0]!.count).toBe(3);
    });

    it('counts the spending records the page would count — window applied, deleted excluded', () => {
        const citations = deriveCitations(makeInput('query_spending'))!;
        // Two in-window expenses; the July one is outside the window and the
        // soft-deleted one is excluded.
        expect(citations[0]!.count).toBe(2);
    });

    it('states the window for time-bound answers and the basis for all of them', () => {
        const citations = deriveCitations(makeInput('query_income'))!;
        expect(citations[0]!.window).toBe('this month');
        expect(citations[0]!.basis).toMatch(/soft-deleted/i);
    });

    it('agrees with the page on the commitment completion count', () => {
        const input = makeInput('query_commitments');
        const result = runFabricQuery(input);
        const pageCompleted = input.commitments.filter((entry) => entry.completed).length;
        expect(result.summary).toContain(`(${pageCompleted}/3)`);
        expect(deriveCitations(input)![0]!.count).toBe(input.commitments.length);
    });

    it('grounds the weekly plan in this week only', () => {
        const citations = deriveCitations(makeInput('plan_week', {
            intent: { action: 'plan_week', entities: { timePeriod: 'this_week' } } as RunFabricQueryInput['intent'],
        }))!;
        expect(citations.map((citation) => citation.window)).toEqual(['this week', 'this week']);
    });
});
