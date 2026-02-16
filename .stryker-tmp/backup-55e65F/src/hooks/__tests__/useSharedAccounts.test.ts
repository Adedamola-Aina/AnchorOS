import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSharedAccounts } from '../useSharedAccounts';

// Hoisted mock setup for proper timing
const mockCallable = vi.hoisted(() => vi.fn());
const mockOnSnapshot = vi.hoisted(() => vi.fn());

// Mock Firebase Functions
vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(() => ({})),
    httpsCallable: vi.fn(() => mockCallable)
}));

vi.mock('../../config/firebase', () => ({
    db: {},
    APP_ID: 'anchor-os',
    functions: {}
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn((db, ...paths) => ({
        path: paths.join('/'),
        type: 'collection'
    })),
    doc: vi.fn((db, ...paths) => ({
        path: paths.join('/'),
        type: 'doc'
    })),
    query: vi.fn((ref) => ({ ...ref, type: 'query' })),
    where: vi.fn(),
    onSnapshot: mockOnSnapshot,
    orderBy: vi.fn()
}));

describe('useSharedAccounts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCallable.mockReset();
        mockOnSnapshot.mockReset();

        // Default: httpsCallable returns empty accounts
        mockCallable.mockResolvedValue({ data: { accounts: [] } });

        // Default: onSnapshot handles both collection and document refs
        mockOnSnapshot.mockImplementation((ref, successCallback, _errorCallback) => {
            setTimeout(() => {
                if (typeof successCallback === 'function') {
                    if (ref.type === 'doc') {
                        // Document snapshot
                        successCallback({
                            id: ref.path.split('/').pop(),
                            exists: () => true,
                            data: () => ({ name: 'Mock Account', balanceCents: 1000 })
                        });
                    } else {
                        // Collection/query snapshot
                        successCallback({
                            docs: []
                        });
                    }
                }
            }, 0);
            return vi.fn(); // unsubscribe
        });
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

        // Setup mock to return accounts
        mockCallable.mockResolvedValue({
            data: { accounts: mockAccounts }
        });

        // Mock onSnapshot to properly handle both doc and collection subscriptions
        mockOnSnapshot.mockImplementation((ref, successCallback, _errorCallback) => {
            setTimeout(() => {
                if (typeof successCallback === 'function') {
                    if (ref.type === 'doc') {
                        // Document snapshot for account updates
                        successCallback({
                            id: 'acc1',
                            exists: () => true,
                            data: () => ({
                                name: 'Shared Wallet',
                                balanceCents: 1000,
                                type: 'cash',
                                currency: 'USD'
                            })
                        });
                    } else {
                        // Collection/query snapshot for transactions
                        successCallback({ docs: [] });
                    }
                }
            }, 5);
            return vi.fn(); // unsubscribe
        });

        const { result } = renderHook(() => useSharedAccounts('user123', true));

        // Initial loading state
        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // The hook transforms accounts from the Cloud Function response
        await waitFor(() => {
            expect(result.current.sharedAccounts).toHaveLength(1);
        }, { timeout: 2000 });

        expect(result.current.sharedAccounts[0].name).toBe('Shared Wallet');
        expect(result.current.error).toBeNull();
    });

    it('handles fetch error gracefully', async () => {
        mockCallable.mockRejectedValue(new Error('Cloud function error'));

        const { result } = renderHook(() => useSharedAccounts('user123', true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Unable to load shared accounts');
        expect(result.current.sharedAccounts).toEqual([]);
    });

    it('subscribes to transactions for fetched accounts', async () => {
        const mockAccounts = [
            { id: 'acc1', ownerUid: 'owner1', name: 'Shared', type: 'cash', balanceCents: 100, currency: 'USD', sharedAt: '2023-01-01' }
        ];

        mockCallable.mockResolvedValue({ data: { accounts: mockAccounts } });

        // Mock onSnapshot to handle both document and collection subscriptions
        const mockUnsubscribe = vi.fn();
        mockOnSnapshot.mockImplementation((ref, successCallback, _errorCallback) => {
            setTimeout(() => {
                if (typeof successCallback === 'function') {
                    if (ref.type === 'doc') {
                        // Document snapshot for account updates
                        successCallback({
                            id: 'acc1',
                            exists: () => true,
                            data: () => ({
                                name: 'Shared',
                                balanceCents: 100,
                                type: 'cash',
                                currency: 'USD'
                            })
                        });
                    } else {
                        // Collection/query snapshot for transactions
                        successCallback({
                            docs: [
                                { id: 'tx1', data: () => ({ amountCents: 50, date: '2023-01-02' }) }
                            ]
                        });
                    }
                }
            }, 5);
            return mockUnsubscribe;
        });

        const { result } = renderHook(() => useSharedAccounts('user123', true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await waitFor(() => {
            expect(result.current.sharedTransactions).toHaveLength(1);
        }, { timeout: 2000 });

        expect(mockOnSnapshot).toHaveBeenCalled();
        expect(result.current.sharedTransactions[0].id).toBe('tx1');
        // Check if accountOwnerId was injected
        expect((result.current.sharedTransactions[0] as any).accountOwnerId).toBe('owner1');
    });
});
