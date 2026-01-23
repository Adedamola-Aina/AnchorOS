import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSharedAccounts } from '../useSharedAccounts';
import { httpsCallable } from 'firebase/functions';
import { onSnapshot } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(),
    httpsCallable: vi.fn()
}));

vi.mock('../../config/firebase', () => ({
    db: {},
    APP_ID: 'anchor-os',
    functions: {}
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    onSnapshot: vi.fn(() => vi.fn()),
    orderBy: vi.fn()
}));

describe('useSharedAccounts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns empty arrays when not enabled', () => {
        const { result } = renderHook(() => useSharedAccounts('user123', false));

        expect(result.current.sharedAccounts).toEqual([]);
        expect(result.current.sharedTransactions).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it('returns empty arrays when no user', () => {
        const { result } = renderHook(() => useSharedAccounts(undefined, true));

        expect(result.current.sharedAccounts).toEqual([]);
        expect(result.current.sharedTransactions).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it('fetches shared accounts successfully', async () => {
        const mockAccounts = [
            {
                id: 'acc1',
                ownerUid: 'owner1',
                name: 'Shared Wallet',
                type: 'cash',
                balanceCents: 1000,
                currency: 'USD',
                sharedAt: '2023-01-01'
            }
        ];

        const mockHttpsCallable = vi.fn().mockResolvedValue({
            data: { accounts: mockAccounts }
        });
        (httpsCallable as any).mockReturnValue(mockHttpsCallable);

        const { result } = renderHook(() => useSharedAccounts('user123', true));

        // Initial loading state
        expect(result.current.loading).toBe(true);
        expect(result.current.sharedAccounts).toEqual([]);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.sharedAccounts).toHaveLength(1);
        expect(result.current.sharedAccounts[0].name).toBe('Shared Wallet');
        expect(result.current.error).toBeNull();
    });

    it('handles fetch error gracefully', async () => {
        const mockHttpsCallable = vi.fn().mockRejectedValue(new Error('Cloud function error'));
        (httpsCallable as any).mockReturnValue(mockHttpsCallable);

        const { result } = renderHook(() => useSharedAccounts('user123', true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Unable to load shared accounts');
        expect(result.current.sharedAccounts).toEqual([]);
    });

    it('subscribes to transactions for fetched accounts', async () => {
        const mockAccounts = [{ id: 'acc1', ownerUid: 'owner1', name: 'Shared', type: 'cash', balanceCents: 100, currency: 'USD', sharedAt: '2023-01-01' }];
        const mockHttpsCallable = vi.fn().mockResolvedValue({ data: { accounts: mockAccounts } });
        (httpsCallable as any).mockReturnValue(mockHttpsCallable);

        // Mock onSnapshot
        const mockUnsubscribe = vi.fn();
        (onSnapshot as any).mockImplementation((_query: any, callback: any) => {
            // Simulate receiving data
            callback({
                docs: [
                    { id: 'tx1', data: () => ({ amountCents: 50, date: '2023-01-02' }) }
                ]
            });
            return mockUnsubscribe;
        });

        const { result } = renderHook(() => useSharedAccounts('user123', true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await waitFor(() => {
            expect(result.current.sharedTransactions).toHaveLength(1);
        });

        expect(onSnapshot).toHaveBeenCalled();
        expect(result.current.sharedTransactions[0].id).toBe('tx1');
        // Check if accountOwnerId was injected
        expect((result.current.sharedTransactions[0] as any).accountOwnerId).toBe('owner1');
    });
});
