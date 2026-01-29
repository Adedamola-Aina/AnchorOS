// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFinanceService } from './useFinanceService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { User } from 'firebase/auth';
import type { AnchorAccount } from '../types';

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
      // Determine if 2nd arg is options or callback
      const callback = typeof args[1] === 'function' ? args[1] : args[2];

      const path = ref.path;
      // If callback is not a function (e.g. still options because I miscalculated), log or fail safely?
      // But above logic covers (ref, callback) and (ref, opts, callback).

      listeners.set(path, callback);

      // Always trigger initial state asynchronously, reading latest data
      setTimeout(() => {
        const current = snapshots.get(path) || [];
        if (typeof callback === 'function') {
          callback({ docs: current });
        }
      }, 0);

      const pathStr = typeof path === 'string' ? path : 'unknown';
      return vi.fn(() => listeners.delete(pathStr)); // unsubscribe
    }),
    // Helper to trigger updates from tests
    triggerSnapshot: (path: string, docs: any[]) => {
      snapshots.set(path, docs);
      const listener = listeners.get(path);
      if (listener) {
        listener({ docs });
      }
    },
    // Helper to clear state
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
    increment: vi.fn((value: number) => ({ _increment: value })),
    serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
    collection: vi.fn((db, ...paths) => ({ path: paths.join('/'), type: 'collection' })),
    doc: vi.fn((db, ...paths) => ({ path: paths.join('/'), type: 'doc' })),
    getDocs: vi.fn(async () => ({ docs: [] })),
  };
});

// 2. Apply Mocks
vi.mock('../config/firebase', () => ({
  db: {},
  APP_ID: 'anchor-os-test',
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: firestoreMocks.collection,
  doc: firestoreMocks.doc,
  onSnapshot: firestoreMocks.onSnapshot,
  addDoc: firestoreMocks.addDoc,
  updateDoc: firestoreMocks.updateDoc,
  deleteDoc: firestoreMocks.deleteDoc,
  getDocs: firestoreMocks.getDocs,
  writeBatch: firestoreMocks.writeBatch,
  increment: firestoreMocks.increment,
  serverTimestamp: firestoreMocks.serverTimestamp,
  // query() wraps a collection but must preserve path for onSnapshot to work
  query: vi.fn((collectionRef, ...constraints) => ({
    ...collectionRef,
    path: collectionRef?.path || 'unknown',
    type: 'query',
    _constraints: constraints
  })),
  where: vi.fn((...args) => ({ type: 'where', args })),
  orderBy: vi.fn((...args) => ({ type: 'orderBy', args })),
  limit: vi.fn((n) => ({ type: 'limit', n })),
}));

// Mock related hooks to avoid Context dependency errors
vi.mock('./useFamilySharing', () => ({
  useFamilySharing: vi.fn(() => ({ isOwner: false, connection: null }))
}));

vi.mock('./useSharedAccounts', () => ({
  useSharedAccounts: vi.fn(() => ({
    sharedAccounts: [],
    sharedTransactions: [],
    loading: false
  }))
}));

// 3. Test Data
const mockUser: User = {
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  phoneNumber: null,
  photoURL: null,
  providerId: 'firebase',
  delete: vi.fn(),
  getIdToken: vi.fn(),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient} >
      {children}
    </QueryClientProvider>
  );
};

describe('useFinanceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMocks.clear();
  });

  describe('Initialization and State', () => {
    it('should initialize with empty arrays and loading state when user is null', () => {
      const { result } = renderHook(() => useFinanceService(null), { wrapper: createWrapper() });
      expect(result.current.transactions).toEqual([]);
      expect(result.current.accounts).toEqual([]);
      expect(result.current.loadingFinance).toBe(false);
    });

    it('should set up Firestore listeners when user is provided', async () => {
      renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => {
        // Now called by query hooks
        expect(firestoreMocks.onSnapshot).toHaveBeenCalled();
      });
    });

    it('should set loading to false after accounts are loaded', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(result.current.loadingFinance).toBe(false);
      });
    });

    it('should set loadingFinance to true when jumping to a new month', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });

      // Wait for initial load
      await waitFor(() => expect(result.current.loadingFinance).toBe(false));

      // Jump to a new month
      const newMonth = new Date(2025, 5, 1);
      await act(async () => {
        result.current.jumpToMonth(newMonth);
      });

      // Verify it immediately goes back to loading (or at least we see it in that state)
      expect(result.current.loadingFinance).toBe(true);

      // Verify currentMonth updated
      expect(result.current.currentMonth.getMonth()).toBe(5);
    });
  });

  describe('Data Fetching and Sorting', () => {
    it('should fetch and sort transactions by date (newest first)', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });

      const mockTransactions = [
        { id: 'tx1', data: () => ({ title: 'Old Transaction', date: '2024-01-01', amountCents: 10000 }) },
        { id: 'tx2', data: () => ({ title: 'New Transaction', date: '2024-01-15', amountCents: 20000 }) },
        { id: 'tx3', data: () => ({ title: 'Middle Transaction', date: '2024-01-10', amountCents: 15000 }) },
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/finance', mockTransactions);
      });

      await waitFor(() => {
        expect(result.current.transactions).toHaveLength(3);
        expect(result.current.transactions[0].title).toBe('New Transaction');
        expect(result.current.transactions[2].title).toBe('Old Transaction');
      });
    });

    it('should fetch accounts correctly', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });

      const mockAccounts = [
        { id: 'acc1', data: () => ({ name: 'Checking', balanceCents: 100000, currency: 'USD' }) },
        { id: 'acc2', data: () => ({ name: 'Savings', balanceCents: 500000, currency: 'USD' }) },
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/accounts', mockAccounts);
      });

      await waitFor(() => {
        expect(result.current.accounts).toHaveLength(2);
        expect(result.current.accounts[0].name).toBe('Checking');
      });
    });

    it('should handle empty transaction list', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(result.current.transactions).toEqual([]);
      });
    });
  });

  describe('Account Management', () => {
    it('should call addAccount with correct data', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });
      const newAccount: Omit<AnchorAccount, 'id'> = {
        name: 'New Checking',
        type: 'checking',
        currency: 'USD',
        balanceCents: 50000,
        color: 'bg-blue-500',
        scope: 'personal',
      };

      await result.current.addAccount(newAccount as any);

      expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'collection' }),
        expect.objectContaining({
          ...newAccount,
          ownerId: 'test-user-123',
          isArchived: false,
          shares: {}
        })
      );
    });

    it('should not call addAccount when user is null', async () => {
      const { result } = renderHook(() => useFinanceService(null), { wrapper: createWrapper() });
      await result.current.addAccount({
        name: 'Test',
        type: 'checking',
        currency: 'USD',
        balanceCents: 0,
        color: 'bg-blue-500',
        scope: 'personal',
      } as any);
      expect(firestoreMocks.addDoc).not.toHaveBeenCalled();
    });

    it('should call deleteAccount with correct ID (soft delete)', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });

      // Populate accounts
      const mockAccounts = [
        { id: 'account-123', data: () => ({ name: 'Checking', balanceCents: 100000, currency: 'USD', type: 'checking', scope: 'personal', color: 'blue', ownerId: 'test-user-123' }) }
      ];
      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/accounts', mockAccounts);
      });
      await waitFor(() => expect(result.current.accounts).toHaveLength(1));

      await result.current.deleteAccount('account-123');

      expect(firestoreMocks.mockBatch.update).toHaveBeenCalledWith(
        expect.anything(),
        { isArchived: true }
      );
      expect(firestoreMocks.mockBatch.commit).toHaveBeenCalled();
    });

    it('should call renameAccount with correct data and update audit trail', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });

      const mockAccount = {
        id: 'acc-1',
        name: 'Old Name',
        ownerId: 'test-user-123'
      };

      // Mock account in state
      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/accounts', [
          { id: 'acc-1', data: () => mockAccount }
        ]);
      });

      await result.current.renameAccount('acc-1', 'New Name');

      expect(firestoreMocks.mockBatch.update).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'artifacts/anchor-os-test/users/test-user-123/accounts/acc-1' }),
        expect.objectContaining({
          name: 'New Name',
          nameHistory: expect.any(Array)
        })
      );
      expect(firestoreMocks.mockBatch.commit).toHaveBeenCalled();
    });
  });

  describe('Transaction Management', () => {
    it('should add income transaction and update account balance correctly', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });
      const newTransaction = {
        title: 'Salary',
        amountCents: 500000,
        type: 'income',
        category: 'Salary',
        accountId: 'acc-123',
        accountName: 'Checking',
        scope: 'personal',
      };

      // Populate accounts first (WITH ownerId)
      const mockAccounts = [
        {
          id: 'acc-123',
          data: () => ({ name: 'Checking', balanceCents: 100000, currency: 'USD', type: 'checking', scope: 'personal', color: 'blue', ownerId: 'test-user-123' })
        }
      ];
      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/accounts', mockAccounts);
      });

      // Wait for state to update
      await waitFor(() => expect(result.current.accounts).toHaveLength(1));

      await result.current.addTransaction(newTransaction as any);

      expect(firestoreMocks.mockBatch.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...newTransaction,
          date: expect.any(String),
        })
      );

      expect(firestoreMocks.mockBatch.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          balanceCents: { _increment: 500000 },
        })
      );

      expect(firestoreMocks.mockBatch.commit).toHaveBeenCalled();
    });

    it('should add expense transaction and update account balance correctly', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });
      const newTransaction = {
        title: 'Groceries',
        amountCents: 15000,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-123',
        accountName: 'Checking',
        scope: 'personal',
      };

      // Populate accounts
      const mockAccounts = [
        {
          id: 'acc-123',
          data: () => ({ name: 'Checking', balanceCents: 100000, currency: 'USD', type: 'checking', scope: 'personal', color: 'blue', ownerId: 'test-user-123' })
        }
      ];
      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/accounts', mockAccounts);
      });

      await waitFor(() => expect(result.current.accounts).toHaveLength(1));

      await result.current.addTransaction(newTransaction as any);

      expect(firestoreMocks.mockBatch.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          balanceCents: { _increment: -15000 },
        })
      );
    });

    it('should delete transaction and reverse account balance correctly', async () => {
      const { result } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });

      // Populate accounts
      const mockAccounts = [
        {
          id: 'acc-123',
          data: () => ({ name: 'Checking', balanceCents: 100000, currency: 'USD', type: 'checking', scope: 'personal', color: 'blue', ownerId: 'test-user-123' })
        }
      ];
      const mockTransactions = [
        { id: 'tx-123', data: () => ({ id: 'tx-123', accountId: 'acc-123', amountCents: 100000, type: 'income', isSoftDeleted: false, date: '2024-01-01' }) },
        { id: 'tx-124', data: () => ({ id: 'tx-124', accountId: 'acc-123', amountCents: 50000, type: 'expense', isSoftDeleted: false, date: '2024-01-02' }) }
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/accounts', mockAccounts);
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/finance', mockTransactions);
      });

      await waitFor(() => expect(result.current.accounts).toHaveLength(1));

      // Delete an income transaction - should decrease balance
      await result.current.deleteTransaction('tx-123', 'acc-123');

      expect(firestoreMocks.mockBatch.update).toHaveBeenCalledWith(
        expect.anything(), // txRef
        expect.objectContaining({
          isSoftDeleted: true,
          deletedBy: mockUser.uid
        })
      );

      // Expect balance update
      expect(firestoreMocks.mockBatch.update).toHaveBeenCalledWith(
        expect.anything(), // accRef
        expect.objectContaining({
          balanceCents: { _increment: -100000 }, // Reverse of income
        })
      );

      firestoreMocks.mockBatch.update.mockClear();

      // Delete an expense transaction - should increase balance
      await result.current.deleteTransaction('tx-124', 'acc-123');

      expect(firestoreMocks.mockBatch.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          balanceCents: { _increment: 50000 }, // Reverse of expense
        })
      );
    });

    it('should not add transaction when user is null', async () => {
      const { result } = renderHook(() => useFinanceService(null), { wrapper: createWrapper() });
      await result.current.addTransaction({
        title: 'Test',
        amountCents: 10000,
        type: 'expense',
        category: 'General',
        accountId: 'acc-123',
        accountName: 'Test',
        scope: 'personal',
      } as any);
      expect(firestoreMocks.writeBatch).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe from listeners on unmount', () => {
      const unsubscribe = vi.fn();
      firestoreMocks.onSnapshot.mockReturnValue(unsubscribe);

      const { unmount } = renderHook(() => useFinanceService(mockUser), { wrapper: createWrapper() });
      unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(3);
    });
  });
});
