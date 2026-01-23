import { useEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorTask } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { useTasksQuery, TASK_KEYS } from './queries/useTaskQueries';

export const useCommitmentService = (user: User | null) => {
  const queryClient = useQueryClient();
  const { data: rawTasks = [], isLoading } = useTasksQuery(user?.uid);

  // 1. Lazy Reset Logic (Effect based)
  useEffect(() => {
    if (!user || rawTasks.length === 0) return;

    const now = new Date();
    const today = now.toLocaleDateString('en-CA');

    rawTasks.forEach(t => {
      // Logic A: Reset 'completed' status if distinct period
      if (t.completed && t.lastCompletedAt) {
        const lastDate = new Date(t.lastCompletedAt);
        const lastDateLocal = lastDate.toLocaleDateString('en-CA');
        let shouldReset = false;

        if (lastDateLocal !== today) {
          if (t.type === 'daily') {
            shouldReset = true;
          } else if (t.type === 'weekly') {
            const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
            if (t.daysOfWeek?.includes(dayName)) {
              shouldReset = true;
            } else {
              const diffTime = Math.abs(now.getTime() - lastDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays >= 7) shouldReset = true;
            }
          } else if (t.type === 'monthly') {
            const todayDay = now.getDate();
            const isCommitmentDay = t.daysOfMonth?.includes(todayDay) || t.dayOfMonth === todayDay;
            if (isCommitmentDay || now.getMonth() !== lastDate.getMonth()) {
              shouldReset = true;
            }
          }
        }

        if (shouldReset) {
          updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments', t.id), {
            completed: false
          });
        }
      }

      // Logic B: Break Streaks if missed
      // If not completed, and lastCompletedAt was too long ago, reset streak
      if (!t.completed && (t.currentStreak || 0) > 0 && t.lastCompletedAt) {
        const lastDate = new Date(t.lastCompletedAt);
        const diffTime = now.getTime() - lastDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        let broken = false;
        if (t.type === 'daily' && diffDays > 1.5) broken = true; // Missed yesterday
        if (t.type === 'weekly' && diffDays > 8) broken = true;
        if (t.type === 'monthly' && diffDays > 32) broken = true;

        if (broken) {
          updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments', t.id), {
            currentStreak: 0
          });
        }
      }
    });
  }, [user, rawTasks]);

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

  const addTask = async (task: Omit<AnchorTask, 'id' | 'createdAt'>) => {
    if (!user) return;
    await addDoc(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments'), {
      ...task,
      createdAt: serverTimestamp(),
      currentStreak: 0,
      longestStreak: 0
    });
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    if (!user) return;
    const task = rawTasks.find(t => t.id === id);
    if (!task) return;

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

    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments', id), updates);
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments', id));
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
  };

  const updateTask = async (id: string, updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'commitments', id), updates);
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
  };

  return { tasks, addTask, toggleTask, deleteTask, updateTask, loadingTasks: isLoading };
};
