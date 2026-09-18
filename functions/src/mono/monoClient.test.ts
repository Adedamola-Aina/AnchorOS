import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import type { MonoTransaction } from './monoTypes';

/**
 * FI-03 — transaction history pagination.
 *
 * The client previously issued a single request and callers passed
 * `paginate: false`, so everything beyond the first page was silently dropped.
 * These tests drive `getAllTransactions` against a mocked fetch and assert that
 * every page is followed, bounded, and reported honestly.
 */
function tx(id: string): MonoTransaction {
    return {
        _id: id,
        type: 'debit',
        amount: 10,
        narration: `tx ${id}`,
        date: '2026-01-01T00:00:00.000Z',
        balance: 0,
        currency: 'NGN',
    };
}

function page(ids: string[], next: string | null, total: number) {
    return {
        data: ids.map(tx),
        paging: { total, page: 1, previous: null, next },
    };
}

function mockFetchSequence(bodies: unknown[]) {
    let call = 0;
    return vi.fn(async () => {
        const body = bodies[Math.min(call, bodies.length - 1)];
        call += 1;
        if (body instanceof Error) throw body;
        return { ok: true, json: async () => body } as unknown as Response;
    });
}

describe('getAllTransactions (FI-03)', () => {
    const originalKey = process.env.MONO_SECRET_KEY;

    beforeEach(() => {
        process.env.MONO_SECRET_KEY = 'test-secret-key';
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        if (originalKey === undefined) delete process.env.MONO_SECRET_KEY;
        else process.env.MONO_SECRET_KEY = originalKey;
    });

    it('follows paging.next until it is exhausted', async () => {
        const fetchMock = mockFetchSequence([
            page(['a', 'b'], '/accounts/acc-1/transactions?page=2', 4),
            page(['c', 'd'], null, 4),
        ]);
        vi.stubGlobal('fetch', fetchMock);

        const { getAllTransactions } = await import('./monoClient');
        const result = await getAllTransactions('acc-1');

        expect(result.transactions.map((t) => t._id)).toEqual(['a', 'b', 'c', 'd']);
        expect(result.pages).toBe(2);
        expect(result.total).toBe(4);
        expect(result.truncated).toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('discards the provider-supplied host when following a cursor', async () => {
        const fetchMock = mockFetchSequence([
            page(['a'], 'https://evil.example.com/accounts/acc-1/transactions?page=2', 2),
            page(['b'], null, 2),
        ]);
        vi.stubGlobal('fetch', fetchMock);

        const { getAllTransactions } = await import('./monoClient');
        await getAllTransactions('acc-1');

        // The secret key must never travel to a host we did not choose.
        const urls = fetchMock.mock.calls.map((call) => String(call[0]));
        expect(urls[1]).toContain('api.withmono.com');
        expect(urls[1]).not.toContain('evil.example.com');
    });

    it('stops at the page budget and reports truncation', async () => {
        const fetchMock = vi.fn(async (url: string) =>
            ({ ok: true, json: async () => page([url.includes('page=') ? 'x' : 'a'], '/accounts/acc-1/transactions?page=next', 99) }) as unknown as Response);
        vi.stubGlobal('fetch', fetchMock);

        const { getAllTransactions } = await import('./monoClient');
        const result = await getAllTransactions('acc-1', { maxPages: 3 });

        expect(result.pages).toBe(3);
        expect(result.truncated).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('flags truncation when the provider counts more rows than it returned', async () => {
        vi.stubGlobal('fetch', mockFetchSequence([page(['a'], null, 50)]));

        const { getAllTransactions } = await import('./monoClient');
        const result = await getAllTransactions('acc-1');

        expect(result.transactions).toHaveLength(1);
        expect(result.total).toBe(50);
        expect(result.truncated).toBe(true);
    });
});
