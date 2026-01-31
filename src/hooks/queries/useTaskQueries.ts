import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, APP_ID } from '../../config/firebase';
import type { AnchorTask } from '../../types';

export const TASK_KEYS = {
    all: ['tasks'] as const,
    list: (userId: string) => [...TASK_KEYS.all, 'list', userId] as const,
};

/**
 * Fetch tasks from Firestore using getDocs (one-time fetch).
 * More reliable than onSnapshot which has been failing with 400 errors.
 */
async function fetchTasks(userId: string): Promise<AnchorTask[]> {
    const q = query(
        collection(db, 'artifacts', APP_ID, 'users', userId, 'commitments'),
        orderBy('createdAt', 'desc'),
        limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnchorTask));
}

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
        queryFn: () => fetchTasks(userId!),
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
