import { describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
    clear: vi.fn(),
    removeClient: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./queryClient', () => ({ queryClient: { clear: mockState.clear } }));
vi.mock('./persister', () => ({ queryPersister: { removeClient: mockState.removeClient } }));

import { clearClientCache } from './queryCache';

/**
 * RA-05 (#149): auth transitions must clear both the in-memory and persisted
 * client cache, and must never throw.
 */
describe('clearClientCache', () => {
    it('clears the in-memory query cache and the persisted client', async () => {
        mockState.clear.mockClear();
        mockState.removeClient.mockClear();

        await clearClientCache();

        expect(mockState.clear).toHaveBeenCalledTimes(1);
        expect(mockState.removeClient).toHaveBeenCalledTimes(1);
    });

    it('never throws when the in-memory or persisted clear fails', async () => {
        mockState.clear.mockImplementationOnce(() => { throw new Error('boom'); });
        mockState.removeClient.mockRejectedValueOnce(new Error('idb closed'));

        await expect(clearClientCache()).resolves.toBeUndefined();
    });
});
