import { useCallback, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { toggleCommitmentCompletion } from '../api/CommitmentApi';
import { TASK_KEYS } from './queries/useTaskQueries';
import { enqueueTaskToggle, processTaskQueueForUser } from '../utils/offlineQueue';

interface SyncCapableRegistration extends ServiceWorkerRegistration {
    sync?: {
        register: (tag: string) => Promise<void>;
    };
}

export function useCommitmentOfflineSync(user: User | null) {
    const queryClient = useQueryClient();

    const flushTaskQueue = useCallback(async () => {
        if (!user || !navigator.onLine) return;
        await processTaskQueueForUser(user.uid, async (entry) => {
            await toggleCommitmentCompletion(user.uid, entry.taskId, entry.currentStatus);
        });
        queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(user.uid) });
    }, [user, queryClient]);

    useEffect(() => {
        if (!user) return;
        void flushTaskQueue();
        const handleOnline = () => { void flushTaskQueue(); };
        const handleSwMessage = (event: MessageEvent) => {
            if (event.data?.type === 'PROCESS_TASK_OFFLINE_QUEUE') void flushTaskQueue();
        };
        window.addEventListener('online', handleOnline);
        if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', handleSwMessage);
        return () => {
            window.removeEventListener('online', handleOnline);
            if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('message', handleSwMessage);
        };
    }, [user, flushTaskQueue]);

    const enqueueOfflineToggle = useCallback(async (taskId: string, currentStatus: boolean): Promise<boolean> => {
        if (!user) return false;
        await enqueueTaskToggle(user.uid, taskId, currentStatus);
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const reg = (await navigator.serviceWorker.ready) as SyncCapableRegistration;
            if (reg.sync?.register) {
                await reg.sync.register('sync-task-toggles');
            }
        }
        return true;
    }, [user]);

    return { enqueueOfflineToggle };
}
