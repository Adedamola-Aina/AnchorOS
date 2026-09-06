import type { CreateTransactionPayload } from '../services/FinanceService';
import { safeGet, safeSet, safeDel, type ProcessResult } from './offlineQueueStorage';

const IDB_KEY = 'anchor_offline_queue';

interface QueueEntry {
    id: string;
    userId: string;
    payload: CreateTransactionPayload;
    createdAt: string;
}

async function readQueue(): Promise<QueueEntry[]> {
    const data = await safeGet<QueueEntry[]>(IDB_KEY);
    return Array.isArray(data) ? data : [];
}

export async function enqueueTransaction(userId: string, payload: CreateTransactionPayload): Promise<void> {
    const queue = await readQueue();
    const entry: QueueEntry = {
        id: crypto.randomUUID(),
        userId,
        payload,
        createdAt: new Date().toISOString(),
    };
    queue.push(entry);
    await safeSet(IDB_KEY, queue);
}

export async function getQueueLength(): Promise<number> {
    return (await readQueue()).length;
}

export async function processQueue(
    processor: (entry: QueueEntry) => Promise<void>,
): Promise<ProcessResult> {
    const queue = await readQueue();
    if (queue.length === 0) return { succeeded: 0, failed: 0 };

    const failed: QueueEntry[] = [];
    let succeeded = 0;

    for (const entry of queue) {
        try {
            await processor(entry);
            succeeded++;
        } catch {
            failed.push(entry);
        }
    }

    await safeSet(IDB_KEY, failed);
    return { succeeded, failed: failed.length };
}

export async function processQueueForUser(
    userId: string,
    processor: (entry: QueueEntry) => Promise<void>,
): Promise<ProcessResult> {
    const queue = await readQueue();
    if (queue.length === 0) return { succeeded: 0, failed: 0 };

    const remaining: QueueEntry[] = [];
    let succeeded = 0;
    let failed = 0;

    for (const entry of queue) {
        if (entry.userId !== userId) {
            remaining.push(entry);
            continue;
        }

        try {
            await processor(entry);
            succeeded++;
        } catch {
            failed++;
            remaining.push(entry);
        }
    }

    await safeSet(IDB_KEY, remaining);
    return { succeeded, failed };
}

export async function clearQueue(): Promise<void> {
    await safeDel(IDB_KEY);
}

// Back-compat re-exports: task queue moved to offlineTaskQueue.ts (ARCH-001 split).
export {
    enqueueTaskToggle,
    getTaskQueueLength,
    processTaskQueue,
    processTaskQueueForUser,
    clearTaskQueue,
} from './offlineTaskQueue';
