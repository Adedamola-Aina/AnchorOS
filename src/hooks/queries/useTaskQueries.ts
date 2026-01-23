import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, APP_ID } from '../../config/firebase';
import type { AnchorTask } from '../../types';

export const TASK_KEYS = {
    all: ['tasks'] as const,
    list: (userId: string) => [...TASK_KEYS.all, 'list', userId] as const,
};

export const useTasksQuery = (userId: string | undefined) => {
    const queryClient = useQueryClient();
    const queryKey = TASK_KEYS.list(userId || '');
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, 'artifacts', APP_ID, 'users', userId, 'commitments'),
            orderBy('createdAt', 'desc'),
            limit(100)
        );

        // onSnapshot fires immediately with current Firestore data
        // This automatically syncs across devices in real-time
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnchorTask));
            queryClient.setQueryData(queryKey, data);
            hasInitializedRef.current = true;
        });

        return () => unsubscribe();
    }, [userId, queryClient, queryKey]);

    return useQuery<AnchorTask[]>({
        queryKey,
        queryFn: () => [],
        enabled: !!userId,
        // Keep staleTime high - onSnapshot handles real-time updates via setQueryData
        staleTime: Infinity,
        // Don't refetch on mount - onSnapshot provides fresh data immediately
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};
