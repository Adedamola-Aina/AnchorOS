import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enqueueTransaction, processQueue, getQueueLength, clearQueue } from './offlineQueue';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
}));

import { get, set, del } from 'idb-keyval';

const mockGet = vi.mocked(get);
const mockSet = vi.mocked(set);
const mockDel = vi.mocked(del);

const samplePayload = {
    title: 'Groceries',
    amountCents: 5000,
    type: 'expense' as const,
    category: 'Food',
    accountId: 'acc-1',
    currency: 'NGN',
    scope: 'personal' as const,
};

describe('offlineQueue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGet.mockResolvedValue(undefined);
        mockSet.mockResolvedValue(undefined);
        mockDel.mockResolvedValue(undefined);
    });

    describe('enqueueTransaction', () => {
        it('adds a transaction to an empty queue', async () => {
            mockGet.mockResolvedValue(undefined);

            await enqueueTransaction('user-1', samplePayload);

            expect(mockSet).toHaveBeenCalledWith(
                'anchor_offline_queue',
                expect.arrayContaining([
                    expect.objectContaining({
                        userId: 'user-1',
                        payload: samplePayload,
                    }),
                ])
            );
        });

        it('appends to existing queue entries', async () => {
            const existing = [{ id: 'old-1', userId: 'user-1', payload: samplePayload, createdAt: '2026-01-01' }];
            mockGet.mockResolvedValue(existing);

            await enqueueTransaction('user-1', { ...samplePayload, title: 'Transport' });

            const savedQueue = mockSet.mock.calls[0][1] as Array<unknown>;
            expect(savedQueue).toHaveLength(2);
        });

        it('assigns a unique id and timestamp to each entry', async () => {
            await enqueueTransaction('user-1', samplePayload);

            const savedQueue = mockSet.mock.calls[0][1] as Array<{ id: string; createdAt: string }>;
            expect(savedQueue[0].id).toBeDefined();
            expect(savedQueue[0].createdAt).toBeDefined();
        });
    });

    describe('getQueueLength', () => {
        it('returns 0 when queue is empty', async () => {
            mockGet.mockResolvedValue(undefined);
            expect(await getQueueLength()).toBe(0);
        });

        it('returns count of queued items', async () => {
            mockGet.mockResolvedValue([
                { id: '1', userId: 'u', payload: samplePayload, createdAt: '' },
                { id: '2', userId: 'u', payload: samplePayload, createdAt: '' },
            ]);
            expect(await getQueueLength()).toBe(2);
        });
    });

    describe('processQueue', () => {
        it('calls the processor for each queued entry and clears on success', async () => {
            const entries = [
                { id: '1', userId: 'user-1', payload: samplePayload, createdAt: '2026-01-01' },
                { id: '2', userId: 'user-1', payload: { ...samplePayload, title: 'Rent' }, createdAt: '2026-01-02' },
            ];
            mockGet.mockResolvedValue(entries);

            const processor = vi.fn().mockResolvedValue(undefined);
            const result = await processQueue(processor);

            expect(processor).toHaveBeenCalledTimes(2);
            expect(result.succeeded).toBe(2);
            expect(result.failed).toBe(0);
            expect(mockSet).toHaveBeenCalledWith('anchor_offline_queue', []);
        });

        it('retains failed entries in queue', async () => {
            const entries = [
                { id: '1', userId: 'user-1', payload: samplePayload, createdAt: '2026-01-01' },
                { id: '2', userId: 'user-1', payload: { ...samplePayload, title: 'Rent' }, createdAt: '2026-01-02' },
            ];
            mockGet.mockResolvedValue(entries);

            const processor = vi.fn()
                .mockResolvedValueOnce(undefined)
                .mockRejectedValueOnce(new Error('Network error'));

            const result = await processQueue(processor);

            expect(result.succeeded).toBe(1);
            expect(result.failed).toBe(1);
            // Failed entry should remain
            const savedQueue = mockSet.mock.calls[0][1] as Array<unknown>;
            expect(savedQueue).toHaveLength(1);
        });

        it('returns zero counts on empty queue', async () => {
            mockGet.mockResolvedValue(undefined);
            const processor = vi.fn();
            const result = await processQueue(processor);

            expect(result.succeeded).toBe(0);
            expect(result.failed).toBe(0);
            expect(processor).not.toHaveBeenCalled();
        });
    });

    describe('clearQueue', () => {
        it('removes all entries from IndexedDB', async () => {
            await clearQueue();
            expect(mockDel).toHaveBeenCalledWith('anchor_offline_queue');
        });
    });
});
