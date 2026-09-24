import { describe, it, expect } from 'vitest';
import { shouldDehydrateQuery } from './persister';

/**
 * The persisted cache must be structured-cloneable, or the write to IndexedDB throws.
 *
 * This is a regression guard for a real defect found on staging: seven
 * `DataCloneError: ... #<Promise> could not be cloned` per page load, traced to
 * `$.clientState.queries[0].promise`. The filter previously in `App.tsx` checked only
 * the query key, which REPLACED query-core's default (`status === 'success'`) instead
 * of narrowing it — so in-flight queries were dehydrated, and query-core attaches a
 * live Promise to a pending query's dehydrated form.
 */
const query = (key: unknown, status: string) => ({ queryKey: [key], state: { status } });

describe('shouldDehydrateQuery', () => {
    it('refuses a query that is still fetching (its dehydrated form holds a Promise)', () => {
        expect(shouldDehydrateQuery(query('goals', 'pending'))).toBe(false);
    });

    it('refuses a failed query', () => {
        expect(shouldDehydrateQuery(query('goals', 'error'))).toBe(false);
    });

    it('accepts a settled, successful query', () => {
        expect(shouldDehydrateQuery(query('goals', 'success'))).toBe(true);
    });

    it('keeps the high-churn exclusions even when the query succeeded', () => {
        expect(shouldDehydrateQuery(query('tasks', 'success'))).toBe(false);
        expect(shouldDehydrateQuery(query('finance', 'success'))).toBe(false);
    });

    /**
     * The invariant that matters: nothing this function admits may contain a Promise.
     * A pending query is the only shape query-core attaches one to.
     */
    it('never admits a status that can carry a promise', () => {
        const admitted = ['pending', 'error', 'success'].filter((status) =>
            shouldDehydrateQuery(query('anything', status)),
        );
        expect(admitted).toEqual(['success']);
    });
});