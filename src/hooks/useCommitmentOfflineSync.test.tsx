import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../utils/offlineQueue', () => ({
    enqueueTaskToggle: vi.fn().mockResolvedValue(undefined),
    processTaskQueueForUser: vi.fn().mockResolvedValue({ succeeded: 0, failed: 0 }),
}));

vi.mock('../api/CommitmentApi', () => ({
    toggleCommitmentCompletion: vi.fn().mockResolvedValue(undefined),
}));

import { enqueueTaskToggle, processTaskQueueForUser } from '../utils/offlineQueue';
import { useCommitmentOfflineSync } from './useCommitmentOfflineSync';

const mockUser = { uid: 'user-1' };

function wrapperFactory() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}

describe('useCommitmentOfflineSync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('flushes queue on mount when online', async () => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
        renderHook(() => useCommitmentOfflineSync(mockUser as never), { wrapper: wrapperFactory() });
        await vi.waitFor(() => expect(processTaskQueueForUser).toHaveBeenCalledWith('user-1', expect.any(Function)));
    });

    it('enqueueOfflineToggle queues for current user', async () => {
        const { result } = renderHook(() => useCommitmentOfflineSync(mockUser as never), { wrapper: wrapperFactory() });
        await act(async () => {
            await result.current.enqueueOfflineToggle('task-42', false);
        });
        expect(enqueueTaskToggle).toHaveBeenCalledWith('user-1', 'task-42', false);
    });

    it('returns false when no user is available', async () => {
        const { result } = renderHook(() => useCommitmentOfflineSync(null), { wrapper: wrapperFactory() });
        let output = true;
        await act(async () => {
            output = await result.current.enqueueOfflineToggle('task-42', false);
        });
        expect(output).toBe(false);
        expect(enqueueTaskToggle).not.toHaveBeenCalled();
    });
});
