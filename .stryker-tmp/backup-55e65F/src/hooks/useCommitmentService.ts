import { useMemo, useCallback } from 'react';
import type { User } from 'firebase/auth';
import type { AnchorTask } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { useTasksQuery, TASK_KEYS } from './queries/useTaskQueries';
import { auditCommitments } from '../services/AuditService';
import { checkRateLimit, formatRetryTime, RATE_LIMIT_CONFIGS } from '../utils/rateLimit';
import { useCommitmentResetEffect } from './useCommitmentReset';
import {
  createCommitment,
  deleteCommitment,
  toggleCommitmentCompletion,
  updateCommitment,
} from '../api/CommitmentApi';

export const useCommitmentService = (user: User | null) => {
  const queryClient = useQueryClient();
  const { data: rawTasks = [], isLoading } = useTasksQuery(user?.uid);

  // Lazy reset: auto-reset completed status and break streaks when cycle changes
  useCommitmentResetEffect(user, rawTasks);

  const tasks = useMemo(() => {
    const timeOrder: Record<string, number> = { 'morning': 1, 'afternoon': 2, 'evening': 3, 'any': 4 };
    return [...rawTasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.type === 'daily' && b.type === 'daily') {
        return (timeOrder[a.timeOfDay || 'any'] || 4) - (timeOrder[b.timeOfDay || 'any'] || 4);
      }
      return 0;
    });
  }, [rawTasks]);

  const addTask = useCallback(async (task: Omit<AnchorTask, 'id' | 'createdAt'>) => {
    if (!user) return;

    // Rate limit: 20 commitments per hour
    const rateCheck = checkRateLimit(`commitmentCreate:${user.uid}`, RATE_LIMIT_CONFIGS.commitmentCreate);
    if (rateCheck.isLimited) {
      throw new Error(`Too many commitments created. Please try again in ${formatRetryTime(rateCheck.retryAfterMs || 0)}.`);
    }

    const docRef = await createCommitment(user.uid, task);
    // AUDIT: Log commitment creation
    auditCommitments.created(docRef.id, task.title);
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
  }, [user, queryClient]);

  /**
   * Toggle task completion with optimistic updates and atomic streak calculation.
   * 
   * BUG-023 FIX (COMPLETE): Uses optimistic updates with onSnapshot sync.
   * - Updates React Query cache immediately for instant UI feedback
   * - Executes Firestore transaction in background
   * - onSnapshot listener automatically syncs changes from Firestore
   * - Rolls back on error
   * 
   * This eliminates:
   * - Multi-click requirement (optimistic update provides instant feedback)
   * - State reversion (onSnapshot ensures sync with Firestore truth)
   * - Janky animations (smooth transitions with optimistic updates)
   */
  const toggleTask = useCallback(async (id: string, currentStatus: boolean) => {
    if (!user) return;

    // ✅ OPTIMISTIC UPDATE: Update cache immediately for instant UI feedback
    queryClient.setQueryData<AnchorTask[]>(
      TASK_KEYS.list(user.uid),
      (old) => {
        if (!old) return old;

        return old.map(task => {
          if (task.id !== id) return task;

          // Calculate updates (same logic as Firestore transaction)
          const updates: Partial<AnchorTask> = { completed: !currentStatus };

          if (!currentStatus) {
            // Completing
            updates.lastCompletedAt = new Date().toISOString();
            const currentStreak = task.currentStreak || 0;
            const newStreak = currentStreak + 1;
            updates.currentStreak = newStreak;
            updates.longestStreak = Math.max(newStreak, task.longestStreak || 0);
          } else {
            // Uncompleting
            const currentStreak = task.currentStreak || 0;
            if (currentStreak > 0) {
              updates.currentStreak = currentStreak - 1;
            }
          }

          return { ...task, ...updates };
        });
      }
    );

    // Execute Firestore transaction
    // onSnapshot listener will automatically sync the final state from Firestore
    try {
      await toggleCommitmentCompletion(user.uid, id, currentStatus);

      // ✅ NO REFETCH NEEDED: onSnapshot listener handles real-time sync automatically
      // The listener will fire when Firestore confirms the update, ensuring UI stays in sync

    } catch (error) {
      // ❌ ROLLBACK: If Firestore fails, invalidate cache to trigger onSnapshot refetch
      console.error('[toggleTask] Firestore transaction failed, rolling back optimistic update:', error);
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
      throw error;
    }

    // AUDIT: Log completion (only when completing, not uncompleting)
    if (!currentStatus) {
      auditCommitments.completed(id);
    }
  }, [user, queryClient]);

  const deleteTask = useCallback(async (id: string) => {
    if (!user) return;
    // AUDIT: Log commitment deletion
    auditCommitments.deleted(id);
    await deleteCommitment(user.uid, id);
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
  }, [user, queryClient]);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => {
    if (!user) return;
    await updateCommitment(user.uid, id, updates);
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
  }, [user, queryClient]);

  return useMemo(() => ({
    tasks, addTask, toggleTask, deleteTask, updateTask, loadingTasks: isLoading
  }), [tasks, addTask, toggleTask, deleteTask, updateTask, isLoading]);
};
