import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCommitmentService } from './useCommitmentService';

// Mock dependencies
vi.mock('../config/firebase', () => ({
  db: {},
  APP_ID: 'test-app',
}));

vi.mock('../services/AuditService', () => ({
  auditCommitments: {
    created: vi.fn(),
    completed: vi.fn(),
    deleted: vi.fn(),
  },
}));

vi.mock('../utils/rateLimit', () => ({
  checkRateLimit: vi.fn(() => ({ isLimited: false })),
  formatRetryTime: vi.fn((ms: number) => `${ms}ms`),
  RATE_LIMIT_CONFIGS: { commitmentCreate: {} },
}));

// Mock the task queries
const mockTasks = vi.fn(() => []);
vi.mock('./queries/useTaskQueries', () => ({
  useTasksQuery: vi.fn(() => ({ data: mockTasks(), isLoading: false })),
  TASK_KEYS: {
    list: (uid: string) => ['tasks', uid],
    detail: (uid: string, id: string) => ['tasks', uid, id],
  },
}));

const {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  runTransaction,
} = await import('firebase/firestore');

const { checkRateLimit } = await import('../utils/rateLimit');
const { auditCommitments } = await import('../services/AuditService');

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

const mockUser = { uid: 'user-1', email: 'test@test.com' } as any;

describe('useCommitmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTasks.mockReturnValue([]);
  });

  describe('tasks sorting', () => {
    it('sorts incomplete before completed', () => {
      mockTasks.mockReturnValue([
        { id: '1', title: 'Done', completed: true, type: 'daily' },
        { id: '2', title: 'Active', completed: false, type: 'daily' },
      ]);

      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(result.current.tasks[0].title).toBe('Active');
      expect(result.current.tasks[1].title).toBe('Done');
    });

    it('sorts daily tasks by timeOfDay', () => {
      mockTasks.mockReturnValue([
        { id: '1', title: 'Evening', completed: false, type: 'daily', timeOfDay: 'evening' },
        { id: '2', title: 'Morning', completed: false, type: 'daily', timeOfDay: 'morning' },
        { id: '3', title: 'Afternoon', completed: false, type: 'daily', timeOfDay: 'afternoon' },
      ]);

      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(result.current.tasks.map(t => t.title)).toEqual([
        'Morning', 'Afternoon', 'Evening',
      ]);
    });

    it('puts tasks without timeOfDay last among dailies', () => {
      mockTasks.mockReturnValue([
        { id: '1', title: 'No time', completed: false, type: 'daily' },
        { id: '2', title: 'Morning', completed: false, type: 'daily', timeOfDay: 'morning' },
      ]);

      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(result.current.tasks[0].title).toBe('Morning');
      expect(result.current.tasks[1].title).toBe('No time');
    });
  });

  describe('addTask', () => {
    it('creates a Firestore document and audits', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.addTask({
          title: 'Exercise',
          type: 'daily',
          completed: false,
        } as any);
      });

      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: 'Exercise',
          type: 'daily',
          currentStreak: 0,
          longestStreak: 0,
        })
      );
      expect(auditCommitments.created).toHaveBeenCalledWith('mock-doc-id', 'Exercise');
    });

    it('throws when rate limited', async () => {
      vi.mocked(checkRateLimit).mockReturnValueOnce({
        isLimited: true,
        retryAfterMs: 5000,
      } as any);

      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.addTask({ title: 'Test', type: 'daily', completed: false } as any);
        })
      ).rejects.toThrow('Too many commitments');
    });

    it('is a no-op when user is null', async () => {
      const { result } = renderHook(() => useCommitmentService(null), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.addTask({ title: 'Test', type: 'daily', completed: false } as any);
      });

      expect(addDoc).not.toHaveBeenCalled();
    });
  });

  describe('toggleTask', () => {
    it('updates cache optimistically and runs transaction', async () => {
      mockTasks.mockReturnValue([
        { id: 't1', title: 'Read', completed: false, currentStreak: 3, longestStreak: 5, type: 'daily' },
      ]);

      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.toggleTask('t1', false);
      });

      expect(runTransaction).toHaveBeenCalled();
      // Audit: completing
      expect(auditCommitments.completed).toHaveBeenCalledWith('t1');
    });

    it('does not audit when uncompleting', async () => {
      mockTasks.mockReturnValue([
        { id: 't1', title: 'Read', completed: true, currentStreak: 3, longestStreak: 5, type: 'daily' },
      ]);

      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.toggleTask('t1', true);
      });

      expect(auditCommitments.completed).not.toHaveBeenCalled();
    });

    it('is a no-op when user is null', async () => {
      const { result } = renderHook(() => useCommitmentService(null), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.toggleTask('t1', false);
      });

      expect(runTransaction).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('deletes from Firestore and audits', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.deleteTask('t1');
      });

      expect(deleteDoc).toHaveBeenCalled();
      expect(auditCommitments.deleted).toHaveBeenCalledWith('t1');
    });

    it('is a no-op when user is null', async () => {
      const { result } = renderHook(() => useCommitmentService(null), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.deleteTask('t1');
      });

      expect(deleteDoc).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('updates Firestore document', async () => {
      const { result } = renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.updateTask('t1', { title: 'Updated' });
      });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { title: 'Updated' }
      );
    });

    it('is a no-op when user is null', async () => {
      const { result } = renderHook(() => useCommitmentService(null), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.updateTask('t1', { title: 'Test' });
      });

      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  describe('lazy reset logic', () => {
    it('resets completed daily task when lastCompletedAt is from different day', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      mockTasks.mockReturnValue([
        {
          id: 't1',
          title: 'Daily',
          type: 'daily',
          completed: true,
          lastCompletedAt: yesterday.toISOString(),
          currentStreak: 5,
        },
      ]);

      renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      // The effect fires and calls updateDoc to reset completed
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { completed: false }
      );
    });

    it('does not reset if lastCompletedAt is today', () => {
      mockTasks.mockReturnValue([
        {
          id: 't1',
          title: 'Daily',
          type: 'daily',
          completed: true,
          lastCompletedAt: new Date().toISOString(),
          currentStreak: 5,
        },
      ]);

      renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(updateDoc).not.toHaveBeenCalled();
    });

    it('breaks daily streak when missed by > 1.5 days', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      mockTasks.mockReturnValue([
        {
          id: 't1',
          title: 'Daily',
          type: 'daily',
          completed: false,
          lastCompletedAt: threeDaysAgo.toISOString(),
          currentStreak: 10,
        },
      ]);

      renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { currentStreak: 0 }
      );
    });

    it('breaks weekly streak when missed by > 8 days', () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      mockTasks.mockReturnValue([
        {
          id: 't1',
          title: 'Weekly',
          type: 'weekly',
          completed: false,
          lastCompletedAt: tenDaysAgo.toISOString(),
          currentStreak: 4,
        },
      ]);

      renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { currentStreak: 0 }
      );
    });

    it('breaks monthly streak when missed by > 32 days', () => {
      const fortyDaysAgo = new Date();
      fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

      mockTasks.mockReturnValue([
        {
          id: 't1',
          title: 'Monthly',
          type: 'monthly',
          completed: false,
          lastCompletedAt: fortyDaysAgo.toISOString(),
          currentStreak: 3,
        },
      ]);

      renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { currentStreak: 0 }
      );
    });

    it('does not break streak when currentStreak is 0', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      mockTasks.mockReturnValue([
        {
          id: 't1',
          title: 'Daily',
          type: 'daily',
          completed: false,
          lastCompletedAt: threeDaysAgo.toISOString(),
          currentStreak: 0,
        },
      ]);

      renderHook(() => useCommitmentService(mockUser), {
        wrapper: makeWrapper(),
      });

      expect(updateDoc).not.toHaveBeenCalled();
    });

    it('does nothing when no user', () => {
      mockTasks.mockReturnValue([
        {
          id: 't1',
          title: 'Daily',
          type: 'daily',
          completed: true,
          lastCompletedAt: '2025-01-01',
          currentStreak: 5,
        },
      ]);

      renderHook(() => useCommitmentService(null), {
        wrapper: makeWrapper(),
      });

      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  it('returns loadingTasks from query', async () => {
    const mod = await import('./queries/useTaskQueries');
    vi.mocked(mod.useTasksQuery).mockReturnValueOnce({ data: [], isLoading: true } as any);

    const { result } = renderHook(() => useCommitmentService(mockUser), {
      wrapper: makeWrapper(),
    });

    expect(result.current.loadingTasks).toBe(true);
  });
});
