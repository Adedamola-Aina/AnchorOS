import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockState = vi.hoisted(() => {
    class OperationTimeoutError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'OperationTimeoutError';
        }
    }
    return {
        OperationTimeoutError,
        processor: null as null | ((entry: unknown) => Promise<void>),
        addTransaction: vi.fn().mockResolvedValue(undefined),
        captureError: vi.fn(),
        logTransactionAdded: vi.fn(),
    };
});

vi.mock('../utils/offlineQueue', () => ({
    enqueueTransaction: vi.fn().mockResolvedValue(undefined),
    processQueueForUser: vi.fn(async (_uid: string, processor: (entry: unknown) => Promise<void>) => {
        mockState.processor = processor;
        return { succeeded: 0, failed: 0 };
    }),
}));

vi.mock('../utils/secureDb', () => ({
    withTimeout: vi.fn(() =>
        Promise.reject(new mockState.OperationTimeoutError('Operation timed out: syncOfflineTransaction')),
    ),
}));

vi.mock('../utils/secureDbCore', () => ({
    isOperationTimeoutError: (error: unknown) => error instanceof mockState.OperationTimeoutError,
}));

vi.mock('../services/FinanceService', () => ({
    financeService: { addTransaction: (...args: unknown[]) => mockState.addTransaction(...args) },
}));

vi.mock('../utils/error', () => ({
    captureError: (...args: unknown[]) => mockState.captureError(...args),
}));

vi.mock('./financeActivityLogging', () => ({
    logTransactionAdded: (...args: unknown[]) => mockState.logTransactionAdded(...args),
}));

import { useFinanceOfflineSync } from './useFinanceOfflineSync';
import { withTimeout } from '../utils/secureDb';

/**
 * RA-06 (#152): a timed-out offline write may already have been applied, so the
 * flush must drop the entry (resolve) rather than re-queue it and double-apply.
 */
describe('useFinanceOfflineSync timeout handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.processor = null;
    });

    const mount = () => {
        const user = { uid: 'u1' } as never;
        return renderHook(() => useFinanceOfflineSync(user, 'User', []));
    };

    it('does not re-queue when a queued write times out', async () => {
        mount();
        await waitFor(() => expect(mockState.processor).toBeTypeOf('function'));

        await expect(
            mockState.processor!({ id: 'e1', userId: 'u1', payload: { accountId: 'a1' }, createdAt: 'now' }),
        ).resolves.toBeUndefined();

        expect(mockState.captureError).toHaveBeenCalledTimes(1);
        expect(mockState.logTransactionAdded).not.toHaveBeenCalled();
    });

    it('rethrows definitive failures so the entry stays queued', async () => {
        vi.mocked(withTimeout).mockImplementationOnce(() => Promise.reject(new Error('permission-denied')));

        mount();
        await waitFor(() => expect(mockState.processor).toBeTypeOf('function'));

        await expect(
            mockState.processor!({ id: 'e2', userId: 'u1', payload: { accountId: 'a1' }, createdAt: 'now' }),
        ).rejects.toThrow('permission-denied');

        expect(mockState.captureError).not.toHaveBeenCalled();
    });
});
