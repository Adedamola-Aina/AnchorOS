/**
 * useFinanceOfflineSync — offline queue flush logic for finance operations.
 * Extracted from useFinanceOperations per ARCH-001 (200-line rule).
 */

import { useCallback, useEffect } from 'react';
import type { User } from 'firebase/auth';
import type { AnchorAccount } from '../types';
import { financeService } from '../services/FinanceService';
import type { CreateTransactionPayload } from '../services/FinanceService';
import { withTimeout } from '../utils/secureDb';
import { logTransactionAdded } from './financeActivityLogging';
import { enqueueTransaction, processQueueForUser } from '../utils/offlineQueue';
import { isOperationTimeoutError } from '../utils/secureDbCore';
import { captureError } from '../utils/error';

const OPERATION_TIMEOUT = 10000;

/** Safari/iOS expose Background Sync on the registration; the DOM lib types omit it. */
interface SyncCapableRegistration extends ServiceWorkerRegistration {
    sync: { register(tag: string): Promise<void> };
}

export function useFinanceOfflineSync(
    user: User | null,
    userName: string,
    accounts: AnchorAccount[],
) {
    const flushOfflineQueue = useCallback(async () => {
        if (!user || !navigator.onLine) return;
        await processQueueForUser(user.uid, async (entry) => {
            try {
                await withTimeout(
                    financeService.addTransaction(user.uid, entry.payload as CreateTransactionPayload, accounts),
                    OPERATION_TIMEOUT,
                    'syncOfflineTransaction',
                );
            } catch (err) {
                if (isOperationTimeoutError(err)) {
                    // RA-06 (#152): the write is not cancellable and may already have
                    // been applied. Re-queueing would double-apply it (two balance
                    // deltas), so drop the entry and surface the uncertainty instead.
                    captureError(err, 'Finance.offlineSync.timeout');
                    return;
                }
                throw err;
            }
            const account = accounts.find(a => a.id === (entry.payload as CreateTransactionPayload).accountId);
            if (account) logTransactionAdded(user, userName, account, entry.payload as CreateTransactionPayload);
        });
    }, [user, userName, accounts]);

    useEffect(() => {
        if (!user) return;
        void flushOfflineQueue();
        const handleOnline = () => { void flushOfflineQueue(); };
        const handleSwMessage = (event: MessageEvent) => {
            if (event.data?.type === 'PROCESS_OFFLINE_QUEUE') void flushOfflineQueue();
        };
        window.addEventListener('online', handleOnline);
        if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', handleSwMessage);
        return () => {
            window.removeEventListener('online', handleOnline);
            if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('message', handleSwMessage);
        };
    }, [user, flushOfflineQueue]);

    const enqueueOffline = useCallback(async (tx: CreateTransactionPayload) => {
        if (!user) return false;
        await enqueueTransaction(user.uid, tx);
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const reg = (await navigator.serviceWorker.ready) as SyncCapableRegistration;
            await reg.sync.register('sync-transactions');
        }
        return true;
    }, [user]);

    return { enqueueOffline };
}
