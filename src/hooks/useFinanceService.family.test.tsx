import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFinanceService } from './useFinanceService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { User } from 'firebase/auth';

// 1. Setup Hoisted Mocks
const firestoreMocks = vi.hoisted(() => {
    const listeners = new Map<string, Function>();
    const snapshots = new Map<string, any>();

    const mockBatch = {
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        commit: vi.fn(async () => { }),
    };

    return {
        listeners,
        snapshots,
        mockBatch,
        // Mock Implementation of onSnapshot
        onSnapshot: vi.fn((...args: any[]) => {
            const ref = args[0];
            const callback = typeof args[1] === 'function' ? args[1] : args[2];
            const path = ref.path;
            listeners.set(path, callback);

            setTimeout(() => {
                const current = snapshots.get(path) || [];
                if (typeof callback === 'function') callback({ docs: current });
            }, 0);

            const pathStr = typeof path === 'string' ? path : 'unknown';
            return vi.fn(() => listeners.delete(pathStr)); // unsubscribe
        }),
        triggerSnapshot: (path: string, docs: any[]) => {
            snapshots.set(path, docs);
            const listener = listeners.get(path);
            if (listener) {
                listener({ docs });
            }
        },
        clear: () => {
            listeners.clear();
            snapshots.clear();
            mockBatch.set.mockClear();
            mockBatch.update.mockClear();
            mockBatch.delete.mockClear();
            mockBatch.commit.mockClear();
        },
        addDoc: vi.fn(async () => ({ id: 'new-doc-id' })),
        updateDoc: vi.fn(async () => { }),
        deleteDoc: vi.fn(async () => { }),
        writeBatch: vi.fn(() => mockBatch),
        deleteField: vi.fn(() => 'DELETE_FIELD_SENTINEL'),
        increment: vi.fn((val) => ({ _increment: val })),
        collection: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
        doc: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
    };
});

// 2. Apply Mocks
vi.mock('../config/firebase', () => ({
    db: {},
    APP_ID: 'anchor-os-test',
}));

vi.mock('firebase/firestore', () => ({
    collection: firestoreMocks.collection,
    doc: firestoreMocks.doc,
    onSnapshot: firestoreMocks.onSnapshot,
    addDoc: firestoreMocks.addDoc,
    updateDoc: firestoreMocks.updateDoc,
    deleteDoc: firestoreMocks.deleteDoc,
    writeBatch: firestoreMocks.writeBatch,
    deleteField: firestoreMocks.deleteField,
    increment: firestoreMocks.increment,
    // Mock getDocs to return empty array by default or whatever is in snapshots
    getDocs: vi.fn(async () => {
        // Return empty docs to prevent crash in shareAccount loop
        return { docs: [] };
    }),

    // query() wraps a collection but must preserve path for onSnapshot to work
    query: vi.fn((collectionRef: any, ...constraints: any[]) => ({
        ...collectionRef,
        path: collectionRef?.path || 'unknown',
        type: 'query',
        _constraints: constraints
    })),
    where: vi.fn((...args: any[]) => ({ type: 'where', args })),
    orderBy: vi.fn((...args: any[]) => ({ type: 'orderBy', args })),
    limit: vi.fn((n: number) => ({ type: 'limit', n })),
}));

vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(),
    httpsCallable: vi.fn(() => async () => ({
        data: {
            accounts: [
                // For 'should share account' test
                { id: 'acc-1', ownerUid: 'user-1', name: 'Test Account', type: 'checking', balanceCents: 1000, currency: 'USD', sharedAt: '2024-01-01', scope: 'family' },
                // For 'Permission Enforcement' tests
                { id: 'read-acc', ownerUid: 'spouse-1', name: 'Read Shared', type: 'checking', balanceCents: 200000, currency: 'USD', sharedAt: '2024-01-01', scope: 'family', permission: 'read' },
                { id: 'transact-acc', ownerUid: 'spouse-1', name: 'Transact Shared', type: 'checking', balanceCents: 300000, currency: 'USD', sharedAt: '2024-01-01', scope: 'family', permission: 'transact' },
                { id: 'no-access-acc', ownerUid: 'spouse-1', name: 'No Access', type: 'checking', balanceCents: 400000, currency: 'USD', sharedAt: '2024-01-01', scope: 'family' }
            ]
        }
    }))
}));

// Mock family sharing to avoid NotificationProvider error
vi.mock('./useFamilySharing', () => ({
    useFamilySharing: vi.fn(() => ({
        isOwner: false,
        connection: { linkedUserId: 'spouse-1', acceptedAt: '2024-01-01' }
    }))
}));

const mockUser: User = { uid: 'user-1', email: 'user@test.com', displayName: 'User 1' } as any;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('useFinanceService (Family Mode)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        firestoreMocks.clear();
    });

    // Account Sharing tests removed as functionality moved to useFamilySharing hook

    describe('Permission Enforcement', () => {
        const setupAccounts = async (result: any) => {
            const accounts = [
                {
                    id: 'own-acc',
                    data: () => ({ name: 'Own Account', ownerId: 'user-1', balanceCents: 100000, currency: 'USD' })
                },
                {
                    id: 'read-acc',
                    data: () => ({
                        name: 'Read Shared',
                        ownerId: 'spouse-1',
                        shares: { 'user-1': 'read' },
                        balanceCents: 200000,
                        currency: 'USD'
                    })
                },
                {
                    id: 'transact-acc',
                    data: () => ({
                        name: 'Transact Shared',
                        ownerId: 'spouse-1',
                        shares: { 'user-1': 'transact' },
                        balanceCents: 300000,
                        currency: 'USD'
                    })
                },
                {
                    id: 'no-access-acc',
                    data: () => ({
                        name: 'No Access',
                        ownerId: 'spouse-1',
                        shares: {},
                        balanceCents: 400000,
                        currency: 'USD'
                    })
                }
            ];

            await waitFor(() => {
                firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/user-1/accounts', [accounts[0]]);
                firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/spouse-1/accounts', accounts.slice(1));
            });

            // Wait for state update
            await waitFor(() => expect(result.current.accounts.length).toBeGreaterThan(0));
        };

        it('should allow adding transaction to own account', async () => {
            const { result } = renderHook(() => useFinanceService(mockUser, 'spouse-1'), { wrapper: createWrapper() });
            await setupAccounts(result);

            await act(async () => {
                await result.current.addTransaction({
                    title: 'Test', amountCents: 10000, type: 'expense', category: 'General',
                    accountId: 'own-acc', accountName: 'Own Account', currency: 'USD', scope: 'personal'
                } as any);
            });

            expect(firestoreMocks.mockBatch.commit).toHaveBeenCalled();
        });

        it('should allow adding transaction to account with "transact" permission', async () => {
            const { result } = renderHook(() => useFinanceService(mockUser, 'spouse-1'), { wrapper: createWrapper() });
            await setupAccounts(result);

            await act(async () => {
                await result.current.addTransaction({
                    title: 'Test', amountCents: 10000, type: 'expense', category: 'General',
                    accountId: 'transact-acc', accountName: 'Transact Shared', currency: 'USD', scope: 'family'
                } as any);
            });

            expect(firestoreMocks.mockBatch.commit).toHaveBeenCalled();
        });

        it('should deny adding transaction to account with "read" permission', async () => {
            const { result } = renderHook(() => useFinanceService(mockUser, 'spouse-1'), { wrapper: createWrapper() });
            await setupAccounts(result);

            await expect(async () => {
                await act(async () => {
                    await result.current.addTransaction({
                        title: 'Test', amountCents: 10000, type: 'expense', category: 'General',
                        accountId: 'read-acc', accountName: 'Read Shared', currency: 'USD', scope: 'family'
                    } as any);
                });
            }).rejects.toThrow('Permission denied');

            expect(firestoreMocks.mockBatch.commit).not.toHaveBeenCalled();
        });

        it('should deny adding transaction to account with no permission', async () => {
            const { result } = renderHook(() => useFinanceService(mockUser, 'spouse-1'), { wrapper: createWrapper() });
            await setupAccounts(result);

            await expect(result.current.addTransaction({
                title: 'Test', amountCents: 10000, type: 'expense', category: 'General',
                accountId: 'no-access-acc', accountName: 'No Access', currency: 'USD', scope: 'family'
            } as any)).rejects.toThrow('Permission denied');

            expect(firestoreMocks.mockBatch.commit).not.toHaveBeenCalled();
        });
    });
});
