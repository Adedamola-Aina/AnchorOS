import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCommitmentService } from './useCommitmentService';
import type { User } from 'firebase/auth';
import type { AnchorTask } from '../types';

// 1. Setup Hoisted Mocks (Guaranteed to run before vi.mock)
const firestoreMocks = vi.hoisted(() => {
  const listeners = new Map<string, Function>();
  const snapshots = new Map<string, any>();

  return {
    listeners,
    snapshots,
    // Mock Implementation of onSnapshot
    onSnapshot: vi.fn((ref: any, callback: Function) => {
      const path = ref.path;
      listeners.set(path, callback);

      // Always trigger initial state asynchronously, reading latest data
      setTimeout(() => {
        const current = snapshots.get(path) || [];
        callback({ docs: current });
      }, 0);

      return vi.fn(() => listeners.delete(path)); // unsubscribe
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
  };
});

// 2. Apply Mocks
vi.mock('../config/firebase', () => ({
  db: {},
  APP_ID: 'anchor-os-test',
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
  doc: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
  onSnapshot: firestoreMocks.onSnapshot,
  addDoc: firestoreMocks.addDoc,
  updateDoc: firestoreMocks.updateDoc,
  deleteDoc: firestoreMocks.deleteDoc,
  writeBatch: firestoreMocks.writeBatch,
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
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
    <QueryClientProvider client= { queryClient } > { children } </QueryClientProvider>
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

    it('should set up Firestore listener when user is provided', async () => {
      renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(firestoreMocks.onSnapshot).toHaveBeenCalled();
      });
    });

    it('should not set up listener when user is null', () => {
      renderHook(() => useCommitmentService(null), { wrapper: createWrapper() });
      expect(firestoreMocks.onSnapshot).not.toHaveBeenCalled();
    });
  });

  describe('Task Fetching and Sorting', () => {
    it('should fetch tasks correctly', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Morning Task', type: 'daily', completed: false }) },
        { id: () => 'task2', data: () => ({ title: 'Weekly Task', type: 'weekly', completed: false }) },
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(2);
      });
    });

    it('should sort completed tasks to the bottom', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Completed Task', type: 'daily', completed: true, timeOfDay: 'morning' }) },
        { id: () => 'task2', data: () => ({ title: 'Active Task', type: 'daily', completed: false, timeOfDay: 'afternoon' }) },
        { id: () => 'task3', data: () => ({ title: 'Another Completed', type: 'daily', completed: true, timeOfDay: 'evening' }) },
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(3);
        expect(result.current.tasks[0].completed).toBe(false);
        expect(result.current.tasks[1].completed).toBe(true);
        expect(result.current.tasks[2].completed).toBe(true);
      });
    });

    it('should sort daily tasks by time of day', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Any Time', type: 'daily', completed: false, timeOfDay: 'any' }) },
        { id: () => 'task2', data: () => ({ title: 'Evening', type: 'daily', completed: false, timeOfDay: 'evening' }) },
        { id: () => 'task3', data: () => ({ title: 'Morning', type: 'daily', completed: false, timeOfDay: 'morning' }) },
        { id: () => 'task4', data: () => ({ title: 'Afternoon', type: 'daily', completed: false, timeOfDay: 'afternoon' }) },
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(4);
        expect(result.current.tasks[0].title).toBe('Morning');
        expect(result.current.tasks[1].title).toBe('Afternoon');
        expect(result.current.tasks[2].title).toBe('Evening');
        expect(result.current.tasks[3].title).toBe('Any Time');
      });
    });

    it('should sort non-daily tasks correctly', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Weekly', type: 'weekly', completed: false }) },
        { id: () => 'task2', data: () => ({ title: 'Monthly', type: 'monthly', completed: false }) },
        { id: () => 'task3', data: () => ({ title: 'Todo', type: 'todo', completed: false }) },
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(3);
      });
    });

    it('should handle complex sorting scenarios', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });

      const mockTasks = [
        { id: () => 'task1', data: () => ({ title: 'Completed Evening', type: 'daily', completed: true, timeOfDay: 'evening' }) },
        { id: () => 'task2', data: () => ({ title: 'Active Afternoon', type: 'daily', completed: false, timeOfDay: 'afternoon' }) },
        { id: () => 'task3', data: () => ({ title: 'Active Morning', type: 'daily', completed: false, timeOfDay: 'morning' }) },
      ];

      await waitFor(() => {
        firestoreMocks.triggerSnapshot('artifacts/anchor-os-test/users/test-user-123/commitments', mockTasks);
      });

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

      // Wait for initial snapshot to settle to avoid race conditions
      await waitFor(() => expect(firestoreMocks.onSnapshot).toHaveBeenCalled());

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

    it('should toggle task completion', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => expect(firestoreMocks.onSnapshot).toHaveBeenCalled());

      await act(async () => {
        await result.current.toggleTask('task-123', false);
      });

      expect(firestoreMocks.updateDoc).toHaveBeenCalled();
    });

    it('should delete task', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), { wrapper: createWrapper() });
      await waitFor(() => expect(firestoreMocks.onSnapshot).toHaveBeenCalled());

      await act(async () => {
        await result.current.deleteTask('task-123');
      });

      expect(firestoreMocks.deleteDoc).toHaveBeenCalled();
    });
  });
});
