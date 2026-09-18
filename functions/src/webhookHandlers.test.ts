import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * handleAccountUpdated idempotency (FI-01 side-effect protection).
 *
 * A redelivery after the handler succeeded but the completion record failed must
 * not reapply financial changes. The guard is Mono's documented `event_id`
 * recorded on the bank connection.
 */
const mockState = vi.hoisted(() => ({
    connection: {} as Record<string, unknown>,
    accountUpdate: vi.fn(),
    connUpdate: vi.fn(),
    getAccountDetails: vi.fn(),
    getTransactions: vi.fn(),
    mapAndDeduplicate: vi.fn(),
}));

vi.mock('firebase-functions', () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('./config', () => {
    const connDoc = () => ({ ref: { update: mockState.connUpdate }, data: () => mockState.connection });
    const connQuery = {
        where: () => connQuery,
        limit: () => connQuery,
        get: async () => ({ empty: false, docs: [connDoc()] }),
    };
    const financeQuery = {
        where: () => financeQuery,
        select: () => financeQuery,
        get: async () => ({ empty: true, docs: [] }),
    };
    const accountsDoc = {
        get: async () => ({ exists: true, data: () => ({ source: 'linked', currency: 'USD' }) }),
        update: mockState.accountUpdate,
    };
    const userRef = {
        collection: (name: string) => (name === 'finance' ? financeQuery : { doc: () => accountsDoc }),
    };
    const usersCollection = { doc: () => userRef };
    const artifactsDoc = { collection: () => usersCollection };

    const db = {
        collection: () => ({ doc: () => artifactsDoc }),
        collectionGroup: () => connQuery,
        batch: () => ({ set: vi.fn(), commit: async () => undefined }),
    };

    return { db, APP_ID: 'anchor-os' };
});

vi.mock('./mono/monoClient', () => ({
    getAccountDetails: (...args: unknown[]) => mockState.getAccountDetails(...args),
    getTransactions: (...args: unknown[]) => mockState.getTransactions(...args),
}));

vi.mock('./mono/transactionMapper', () => ({
    mapAndDeduplicate: (...args: unknown[]) => mockState.mapAndDeduplicate(...args),
}));

import { handleAccountUpdated } from './webhookHandlers';

const BASE_CONNECTION = {
    provider: 'mono',
    monoAccountId: 'mono-1',
    anchorAccountId: 'acc-1',
    userId: 'user-1',
    institutionName: 'Test Bank',
    linkedAt: '2026-01-01T00:00:00.000Z',
    status: 'active',
};

describe('handleAccountUpdated idempotency', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.connection = { ...BASE_CONNECTION };
        mockState.getAccountDetails.mockResolvedValue({ account: { balance: 100 }, meta: {} });
        mockState.getTransactions.mockResolvedValue({ data: [] });
        mockState.mapAndDeduplicate.mockReturnValue([]);
    });

    it('skips all work when the event was already applied', async () => {
        mockState.connection = { ...BASE_CONNECTION, lastProcessedEventId: 'evt-1' };

        await handleAccountUpdated('mono-1', 'evt-1');

        expect(mockState.getAccountDetails).not.toHaveBeenCalled();
        expect(mockState.accountUpdate).not.toHaveBeenCalled();
        expect(mockState.connUpdate).not.toHaveBeenCalled();
    });

    it('applies the event and records it when it is new', async () => {
        await handleAccountUpdated('mono-1', 'evt-2');

        expect(mockState.getAccountDetails).toHaveBeenCalledWith('mono-1');
        expect(mockState.accountUpdate).toHaveBeenCalled();
        expect(mockState.connUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ lastProcessedEventId: 'evt-2' }),
        );
    });

    it('still applies when no event_id was supplied (backwards compatible)', async () => {
        await handleAccountUpdated('mono-1');

        expect(mockState.accountUpdate).toHaveBeenCalled();
        const payload = mockState.connUpdate.mock.calls[0][0] as Record<string, unknown>;
        expect(payload).not.toHaveProperty('lastProcessedEventId');
    });
});
