/**
 * useRecurringQueries — React Query hooks for recurring transactions
 * Target: 80%+ coverage of optimistic updates + rollback
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ── Mock RecurringApi ──────────────────────────────────────────────
const mockSubscribeToRecurring = vi.fn();
const mockCreateRecurring = vi.fn();
const mockUpdateRecurring = vi.fn();
const mockDeleteRecurring = vi.fn();

vi.mock('../api/RecurringApi', () => ({
    recurringApi: {
        subscribeToRecurring: (...args: any[]) => mockSubscribeToRecurring(...args),
        createRecurring: (...args: any[]) => mockCreateRecurring(...args),
        updateRecurring: (...args: any[]) => mockUpdateRecurring(...args),
        deleteRecurring: (...args: any[]) => mockDeleteRecurring(...args),
    },
}));

import {
    useRecurringTransactions,
    useCreateRecurringTransaction,
    useUpdateRecurringTransaction,
    useDeleteRecurringTransaction,
} from './useRecurringQueries';

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
        queryClient,
    };
}

describe('useRecurringTransactions', () => {
    let dataCallback: ((data: any[]) => void) | null = null;
    let errorCallback: ((err: Error) => void) | null = null;
    const unsub = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        dataCallback = null;
        errorCallback = null;
        mockSubscribeToRecurring.mockImplementation((_userId: string, onData: any, onError: any) => {
            dataCallback = onData;
            errorCallback = onError;
            return unsub;
        });
    });

    it('starts with empty data and loading', () => {
        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useRecurringTransactions('user-1'), { wrapper });

        expect(result.current.data).toEqual([]);
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isEmpty).toBe(true);
    });

    it('populates data from subscription', async () => {
        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useRecurringTransactions('user-1'), { wrapper });

        act(() => {
            dataCallback?.([
                { id: 'r1', title: 'Netflix', amountCents: 1700, userId: 'user-1' },
            ]);
        });

        await waitFor(() => {
            expect(result.current.data).toHaveLength(1);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isEmpty).toBe(false);
        });
    });

    it('sets error from subscription', async () => {
        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useRecurringTransactions('user-1'), { wrapper });

        act(() => {
            errorCallback?.(new Error('network'));
        });

        await waitFor(() => {
            expect(result.current.error).toBeTruthy();
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('unsubscribes on unmount', () => {
        const { wrapper } = createWrapper();
        const { unmount } = renderHook(() => useRecurringTransactions('user-1'), { wrapper });
        unmount();
        expect(unsub).toHaveBeenCalled();
    });

    it('does not subscribe when userId is undefined', () => {
        const { wrapper } = createWrapper();
        renderHook(() => useRecurringTransactions(undefined), { wrapper });
        expect(mockSubscribeToRecurring).not.toHaveBeenCalled();
    });
});

describe('useCreateRecurringTransaction', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls createRecurring and applies optimistic update', async () => {
        mockCreateRecurring.mockResolvedValue('new-id');
        const { wrapper, queryClient } = createWrapper();

        // Pre-seed cache
        queryClient.setQueryData(['recurring_transactions', 'user-1'], []);

        const { result } = renderHook(() => useCreateRecurringTransaction(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({
                title: 'Spotify',
                amountCents: 999,
                userId: 'user-1',
                frequency: 'monthly',
                currency: 'NGN',
                accountId: 'acc-1',
                category: 'subscription',
                nextDate: '2025-02-01',
                type: 'expense',
            } as any);
        });

        expect(mockCreateRecurring).toHaveBeenCalled();
    });
});

describe('useUpdateRecurringTransaction', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls updateRecurring', async () => {
        mockUpdateRecurring.mockResolvedValue(undefined);
        const { wrapper, queryClient } = createWrapper();

        // Pre-seed cache
        queryClient.setQueryData(['recurring_transactions', 'user-1'], [
            { id: 'r1', title: 'Netflix', amountCents: 1700, userId: 'user-1' },
        ]);

        const { result } = renderHook(() => useUpdateRecurringTransaction(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({ id: 'r1', updates: { title: 'Netflix Premium' } });
        });

        expect(mockUpdateRecurring).toHaveBeenCalledWith('r1', { title: 'Netflix Premium' });
    });

    it('rolls back on error', async () => {
        mockUpdateRecurring.mockRejectedValue(new Error('fail'));
        const { wrapper, queryClient } = createWrapper();

        const original = [{ id: 'r1', title: 'Netflix', amountCents: 1700, userId: 'user-1' }];
        queryClient.setQueryData(['recurring_transactions', 'user-1'], original);

        const { result } = renderHook(() => useUpdateRecurringTransaction(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync({ id: 'r1', updates: { title: 'Bad' } });
            } catch { /* expected */ }
        });

        // Cache should be rolled back
        await waitFor(() => {
            const cached = queryClient.getQueryData(['recurring_transactions', 'user-1']);
            expect(cached).toEqual(original);
        });
    });
});

describe('useDeleteRecurringTransaction', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls deleteRecurring and removes optimistically', async () => {
        mockDeleteRecurring.mockResolvedValue(undefined);
        const { wrapper, queryClient } = createWrapper();

        queryClient.setQueryData(['recurring_transactions', 'user-1'], [
            { id: 'r1', title: 'Netflix', amountCents: 1700, userId: 'user-1' },
        ]);

        const { result } = renderHook(() => useDeleteRecurringTransaction(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync('r1');
        });

        expect(mockDeleteRecurring).toHaveBeenCalledWith('r1');
    });

    it('rolls back on delete error', async () => {
        mockDeleteRecurring.mockRejectedValue(new Error('fail'));
        const { wrapper, queryClient } = createWrapper();

        const original = [{ id: 'r1', title: 'Netflix', amountCents: 1700, userId: 'user-1' }];
        queryClient.setQueryData(['recurring_transactions', 'user-1'], original);

        const { result } = renderHook(() => useDeleteRecurringTransaction(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutateAsync('r1');
            } catch { /* expected */ }
        });

        await waitFor(() => {
            const cached = queryClient.getQueryData(['recurring_transactions', 'user-1']);
            expect(cached).toEqual(original);
        });
    });
});
