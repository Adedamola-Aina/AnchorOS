/**
 * RA-12 (#168): the goals reader — empty and populated coverage.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AnchorGoal } from '../../types';

const mockQueryCollection = vi.fn();

vi.mock('../../utils/secureDb', () => ({
    secureDb: {
        queryCollection: (...args: unknown[]) => mockQueryCollection(...args),
    },
}));

import { useGoalsQuery, GOALS_KEYS } from './useGoalsQuery';

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}

const goal = (overrides: Partial<AnchorGoal> = {}): AnchorGoal => ({
    id: 'goal-1',
    title: 'Emergency Fund',
    targetAmountCents: 500_000,
    currentAmountCents: 0,
    currency: 'USD',
    goalType: 'emergency_fund',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
});

describe('useGoalsQuery', () => {
    beforeEach(() => {
        mockQueryCollection.mockReset();
    });

    it('does not query when there is no user', async () => {
        const { result } = renderHook(() => useGoalsQuery(undefined), { wrapper: createWrapper() });

        expect(result.current.data).toBeUndefined();
        expect(mockQueryCollection).not.toHaveBeenCalled();
    });

    it('reads owner-scoped goals and sorts them newest first', async () => {
        mockQueryCollection.mockResolvedValue([
            goal({ id: 'older', title: 'Vacation', createdAt: '2026-08-01T00:00:00.000Z' }),
            goal({ id: 'newer', createdAt: '2026-09-10T00:00:00.000Z' }),
        ]);

        const { result } = renderHook(() => useGoalsQuery('user-1'), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.data).toHaveLength(2));

        expect(mockQueryCollection).toHaveBeenCalledWith('user-1', 'goals');
        expect(result.current.data?.map((g) => g.id)).toEqual(['newer', 'older']);
    });

    it('returns an empty list when the user has no goals', async () => {
        mockQueryCollection.mockResolvedValue([]);

        const { result } = renderHook(() => useGoalsQuery('user-2'), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([]);
    });

    it('exposes a stable, user-scoped query key', () => {
        expect(GOALS_KEYS.list('user-1')).toEqual(['goals', 'user-1']);
        expect(GOALS_KEYS.list('user-2')).not.toEqual(GOALS_KEYS.list('user-1'));
    });
});
