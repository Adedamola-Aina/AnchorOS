/**
 * useFinanceOfflineSync — ARCH-001
 * Tests: offline queue enqueue
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../utils/offlineQueue', () => ({
    enqueueTransaction: vi.fn().mockResolvedValue(undefined),
    processQueueForUser: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../services/FinanceService', () => ({
    financeService: { addTransaction: vi.fn() },
}));

vi.mock('../utils/secureDb', () => ({
    secureDb: {},
    withTimeout: vi.fn((p: Promise<unknown>) => p),
}));

vi.mock('./financeActivityLogging', () => ({
    logTransactionAdded: vi.fn(),
}));

import { useFinanceOfflineSync } from './useFinanceOfflineSync';
import { enqueueTransaction } from '../utils/offlineQueue';

const mockUser = { uid: 'user-1' };
const accounts = [{ id: 'acc-1', name: 'Test', balanceCents: 0, currency: 'USD', type: 'checking' }];

describe('useFinanceOfflineSync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns enqueueOffline function', () => {
        const { result } = renderHook(() =>
            useFinanceOfflineSync(mockUser as never, 'Alice', accounts as never)
        );
        expect(typeof result.current.enqueueOffline).toBe('function');
    });

    it('enqueueOffline calls enqueueTransaction with userId and payload', async () => {
        const { result } = renderHook(() =>
            useFinanceOfflineSync(mockUser as never, 'Alice', accounts as never)
        );
        const tx = { accountId: 'acc-1', type: 'expense', amountCents: 500, description: 'lunch', category: 'food', date: '2026-03-01' };
        await act(async () => {
            await result.current.enqueueOffline(tx as never);
        });
        expect(enqueueTransaction).toHaveBeenCalledWith('user-1', tx);
    });

    it('enqueueOffline returns false when user is null', async () => {
        const { result } = renderHook(() =>
            useFinanceOfflineSync(null, '', accounts as never)
        );
        const tx = { accountId: 'acc-1', type: 'expense', amountCents: 100, description: 'x', category: 'misc', date: '2026-03-01' };
        let returned: unknown;
        await act(async () => {
            returned = await result.current.enqueueOffline(tx as never);
        });
        expect(returned).toBe(false);
        expect(enqueueTransaction).not.toHaveBeenCalled();
    });
});
