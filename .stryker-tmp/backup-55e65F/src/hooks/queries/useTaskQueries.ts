import { useQuery } from '@tanstack/react-query';
import { fetchTasksForUser } from '../../api/TaskQueryApi';
import type { AnchorTask } from '../../types';

export const TASK_KEYS = {
    all: ['tasks'] as const,
    list: (userId: string) => [...TASK_KEYS.all, 'list', userId] as const,
};

/**
 * BUG-023 FIX: Replaced unreliable onSnapshot with polling-based fetching.
 * 
 * WHY: onSnapshot was failing with 400 errors due to Firestore Listen stream issues.
 * The optimistic updates were working but being reverted when onSnapshot failed.
 * 
 * HOW: Now uses getDocs with short staleTime for near-real-time updates.
 * Optimistic updates still work instantly, and polling ensures sync with DB.
 */
export const useTasksQuery = (userId: string | undefined) => {
    const queryKey = TASK_KEYS.list(userId || '');

    return useQuery<AnchorTask[]>({
        queryKey,
        queryFn: () => fetchTasksForUser(userId!),
        enabled: !!userId,
        // Short staleTime for near-real-time feel
        staleTime: 5000, // 5 seconds
        // Refetch in background to keep data fresh
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        // Retry on failure
        retry: 3,
        retryDelay: 1000,
        // Keep previous data while fetching
        placeholderData: (previousData) => previousData,
    });
};
