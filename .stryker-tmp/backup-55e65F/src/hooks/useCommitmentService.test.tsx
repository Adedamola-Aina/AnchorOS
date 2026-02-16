import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCommitmentService } from './useCommitmentService';
import type { User } from 'firebase/auth';
import type { AnchorTask } from '../types';

// 1. Setup Hoisted Mocks (Guaranteed to run before vi.mock)
const firestoreMocks = vi.hoisted(() => {
  const mockData = new Map<string, any[]>();

  return {
    mockData,
    // Mock Implementation of getDocs
    getDocs: vi.fn(async (queryRef: any) => {
      const path = queryRef.path || 'unknown';
      const docs = mockData.get(path) || [];
      return {
        docs: docs.map(docData => ({
          id: docData.id(),
          data: docData.data,
          exists: () => true,
        })),
        empty: docs.length === 0,
        size: docs.length,
      };
    }),
    // Helper to set mock data
    setMockData: (path: string, docs: any[]) => {
      mockData.set(path, docs);
    },
    // Helper to clear state
    clear: () => {
      mockData.clear();
    },
    addDoc: vi.fn(async () => ({ id: 'new-task-id' })),
    updateDoc: vi.fn(async () => { }),
    deleteDoc: vi.fn(async () => { }),
    writeBatch: vi.fn(() => ({
      commit: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
    // Mock runTransaction for atomic operations
    runTransaction: vi.fn(async (db: any, callback: Function) => {
      // Create a mock transaction object
      const mockTransaction = {
        get: vi.fn(async (_docRef: unknown) => ({
          exists: () => true,
          data: () => ({
            id: 'task-123',
            title: 'Test Task',
            completed: false,
            currentStreak: 0,
            longestStreak: 0,
          }),
        })),
        update: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
      };
      // Execute the transaction callback
      await callback(mockTransaction);
      return mockTransaction;
    }),
  };
});

// 2. Apply Mocks
vi.mock('../config/firebase', () => ({
  db: {},
  functions: {},
  APP_ID: 'anchor-os-test',
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
  doc: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
  getDocs: firestoreMocks.getDocs,
  addDoc: firestoreMocks.addDoc,
  updateDoc: firestoreMocks.updateDoc,
  deleteDoc: firestoreMocks.deleteDoc,
  writeBatch: firestoreMocks.writeBatch,
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
  // query() wraps a collection but must preserve path for getDocs to work
  query: vi.fn((collectionRef, ...constraints) => ({
    ...collectionRef,
    path: collectionRef?.path || 'unknown',
    type: 'query',
    _constraints: constraints
  })),
  where: vi.fn((...args) => ({ type: 'where', args })),
  orderBy: vi.fn((...args) => ({ type: 'orderBy', args })),
  limit: vi.fn((n) => ({ type: 'limit', n })),
  runTransaction: firestoreMocks.runTransaction,
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
    <QueryClientProvider client={queryClient} > {children} </QueryClientProvider>
  );
};

describe('useCommitmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMocks.clear();
  });

  describe('Initialization and State', () => {
    it('should initialize with empty task array when user is null', () => {
      const { result } = renderHook(() => useCommitmentService(null), { wrapper: createWrapper() });
      expect(result.current.tasks).toEqual([]);
    });

    it('should fetch tasks when user is provided', async () => {
      const mockTasks = [
        { id: () => 'task1', data: () => ({ id: 'task1', title: 'Test Task', type: 'daily', completed: false }) },
      ];

      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);

      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(firestoreMocks.getDocs).toHaveBeenCalled();
        expect(result.current.tasks).toHaveLength(1);
      });
    });

    it('should not fetch when user is null', () => {
      renderHook(() => useCommitmentService(null), { wrapper: createWrapper() });
      expect(firestoreMocks.getDocs).not.toHaveBeenCalled();
    });
  });

  describe('Task Fetching and Sorting', () => {
    it('should fetch tasks correctly', async () => {
      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Morning Task', type: 'daily', completed: false }) },
        { id: () => 'task2', data: () => ({ title: 'Weekly Task', type: 'weekly', completed: false }) },
      ];

      // Set snapshot data BEFORE rendering hook
      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);

      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(2);
      });
    });

    it('should sort completed tasks to the bottom', async () => {
      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Completed Task', type: 'daily', completed: true, timeOfDay: 'morning' }) },
        { id: () => 'task2', data: () => ({ title: 'Active Task', type: 'daily', completed: false, timeOfDay: 'afternoon' }) },
        { id: () => 'task3', data: () => ({ title: 'Another Completed', type: 'daily', completed: true, timeOfDay: 'evening' }) },
      ];

      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(3);
        expect(result.current.tasks[0].completed).toBe(false);
        expect(result.current.tasks[1].completed).toBe(true);
        expect(result.current.tasks[2].completed).toBe(true);
      });
    });

    it('should sort daily tasks by time of day', async () => {
      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Any Time', type: 'daily', completed: false, timeOfDay: 'any' }) },
        { id: () => 'task2', data: () => ({ title: 'Evening', type: 'daily', completed: false, timeOfDay: 'evening' }) },
        { id: () => 'task3', data: () => ({ title: 'Morning', type: 'daily', completed: false, timeOfDay: 'morning' }) },
        { id: () => 'task4', data: () => ({ title: 'Afternoon', type: 'daily', completed: false, timeOfDay: 'afternoon' }) },
      ];

      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(4);
        expect(result.current.tasks[0].title).toBe('Morning');
        expect(result.current.tasks[1].title).toBe('Afternoon');
        expect(result.current.tasks[2].title).toBe('Evening');
        expect(result.current.tasks[3].title).toBe('Any Time');
      });
    });

    it('should sort non-daily tasks correctly', async () => {
      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Weekly', type: 'weekly', completed: false }) },
        { id: () => 'task2', data: () => ({ title: 'Monthly', type: 'monthly', completed: false }) },
        { id: () => 'task3', data: () => ({ title: 'Todo', type: 'todo', completed: false }) },
      ];

      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(3);
      });
    });

    it('should handle complex sorting scenarios', async () => {
      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Completed Evening', type: 'daily', completed: true, timeOfDay: 'evening' }) },
        { id: () => 'task2', data: () => ({ title: 'Active Afternoon', type: 'daily', completed: false, timeOfDay: 'afternoon' }) },
        { id: () => 'task3', data: () => ({ title: 'Active Morning', type: 'daily', completed: false, timeOfDay: 'morning' }) },
      ];

      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(3);
        // Active morning first
        expect(result.current.tasks[0].title).toBe('Active Morning');
        // Active afternoon second
        expect(result.current.tasks[1].title).toBe('Active Afternoon');
        // Completed last
        expect(result.current.tasks[2].completed).toBe(true);
      });
    });
  });

  describe('Task Management Functions', () => {
    it('should add a task', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      // Wait for React Query to settle
      await waitFor(() => expect(result.current.tasks).toBeDefined());

      const newTask: Omit<AnchorTask, 'id' | 'createdAt'> = {
        title: 'New Task',
        type: 'daily',
        completed: false,
        category: 'personal',
        timeOfDay: 'morning',
      };

      await act(async () => {
        await result.current.addTask(newTask);
      });

      expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'artifacts/anchor-os-test/users/test-user-123/commitments' }),
        expect.objectContaining({
          ...newTask,
          createdAt: expect.objectContaining({ _serverTimestamp: true }),
        })
      );
    });

    it('should toggle task completion with atomic transaction', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => expect(result.current.tasks).toBeDefined());

      await act(async () => {
        await result.current.toggleTask('task-123', false);
      });

      // Verify runTransaction was called (atomic update)
      expect(firestoreMocks.runTransaction).toHaveBeenCalled();
    });

    it('should delete task', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => expect(result.current.tasks).toBeDefined());

      await act(async () => {
        await result.current.deleteTask('task-123');
      });

      expect(firestoreMocks.deleteDoc).toHaveBeenCalled();
    });
  });

  describe('Optimistic Updates (BUG-023)', () => {
    it.todo('should update cache immediately without flash of empty state (BUG-023: optimistic updates not yet implemented)');
    it.skip('should update cache immediately without flash of empty state — wip', async () => {
      const wrapper = createWrapper();

      // Setup initial tasks
      const mockTasks = [
        {
          id: () => 'task-1',
          data: () => ({
            id: 'task-1',
            title: 'Morning Task',
            type: 'daily',
            completed: false,
            currentStreak: 5,
            longestStreak: 10,
          })
        },
        {
          id: () => 'task-2',
          data: () => ({
            id: 'task-2',
            title: 'Evening Task',
            type: 'daily',
            completed: false,
            currentStreak: 0,
            longestStreak: 0,
          })
        },
      ];

      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks[0].completed).toBe(false);
      });

      // Toggle task - should update immediately
      await act(async () => {
        await result.current.toggleTask('task-1', false);
      });

      // CRITICAL: Cache should update immediately (no flash of empty state)
      // Task should be marked as completed instantly
      expect(result.current.tasks).toHaveLength(2); // Still 2 tasks (no empty array)
      expect(result.current.tasks.find(t => t.id === 'task-1')?.completed).toBe(true);
      expect(result.current.tasks.find(t => t.id === 'task-1')?.currentStreak).toBe(6); // Incremented
    });

    it.todo('should handle uncompleting task optimistically (BUG-023: optimistic updates not yet implemented)');
    it.skip('should handle uncompleting task optimistically — wip', async () => {
      const wrapper = createWrapper();

      const mockTasks = [
        {
          id: () => 'task-1',
          data: () => ({
            id: 'task-1',
            title: 'Completed Task',
            type: 'daily',
            completed: true,
            currentStreak: 5,
            longestStreak: 10,
          })
        },
      ];

      firestoreMocks.setMockData('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper });

      await waitFor(() => {
        expect(result.current.tasks[0].completed).toBe(true);
      });

      // Uncomplete task
      await act(async () => {
        await result.current.toggleTask('task-1', true);
      });

      // Should update immediately
      expect(result.current.tasks[0].completed).toBe(false);
      expect(result.current.tasks[0].currentStreak).toBe(4); // Decremented
    });
  });
});
