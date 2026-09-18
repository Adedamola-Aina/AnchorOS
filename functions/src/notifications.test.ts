import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    const chain: Record<string, unknown> = {};
    const make = () => chain;
    chain.collection = vi.fn(make);
    chain.doc = vi.fn(make);
    chain.where = vi.fn(make);
    chain.orderBy = vi.fn(make);
    chain.limit = vi.fn(make);
    chain.startAfter = vi.fn(make);
    chain.get = vi.fn(async () => ({ size: 0, docs: [], empty: true, exists: false }));

    const db = { collection: vi.fn(make) };
    return { chain, db };
});

vi.mock('./callable', () => ({
    secureOnCall: (handler: unknown) => handler,
}));

vi.mock('./config', () => ({
    db: mockState.db,
    APP_ID: 'anchor-os',
}));

vi.mock('./rateLimit', () => ({
    enforceRateLimit: vi.fn().mockResolvedValue(undefined),
}));

import { getNotifications as getNotificationsCallable } from './notifications';

const getNotifications = getNotificationsCallable as unknown as (
    request: { auth: { uid: string } | null; data: Record<string, unknown> },
) => Promise<unknown>;

/**
 * RA-07 (#151): the client-supplied page size must be clamped.
 */
describe('getNotifications limit clamping', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const call = (data: Record<string, unknown>) =>
        getNotifications({ auth: { uid: 'u1' }, data } as never);

    it('clamps an oversized limit to the maximum page size', async () => {
        await call({ limit: 100000 });
        expect(mockState.chain.limit).toHaveBeenCalledWith(100);
    });

    it('falls back to the default limit for non-numeric input', async () => {
        await call({ limit: 'lots' });
        expect(mockState.chain.limit).toHaveBeenCalledWith(50);
    });

    it('clamps a negative limit to at least 1', async () => {
        await call({ limit: -5 });
        expect(mockState.chain.limit).toHaveBeenCalledWith(1);
    });

    it('floors a fractional limit', async () => {
        await call({ limit: 12.9 });
        expect(mockState.chain.limit).toHaveBeenCalledWith(12);
    });

    it('applies the default when no limit is supplied', async () => {
        await call({});
        expect(mockState.chain.limit).toHaveBeenCalledWith(50);
    });
});
