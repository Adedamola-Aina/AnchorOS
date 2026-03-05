import { get, set, del } from 'idb-keyval';
import type { CreateTransactionPayload } from '../services/FinanceService';

const IDB_KEY = 'anchor_offline_queue';

export interface QueueEntry {
    id: string;
    userId: string;
    payload: CreateTransactionPayload;
    createdAt: string;
}

interface ProcessResult {
    succeeded: number;
    failed: number;
}

async function readQueue(): Promise<QueueEntry[]> {
    const data = await get<QueueEntry[]>(IDB_KEY);
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
    await set(IDB_KEY, queue);
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

    await set(IDB_KEY, failed);
    return { succeeded, failed: failed.length };
}

export async function clearQueue(): Promise<void> {
    await del(IDB_KEY);
}
