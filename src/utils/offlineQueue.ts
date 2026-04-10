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

    await set(IDB_KEY, remaining);
    return { succeeded, failed };
}

export async function clearQueue(): Promise<void> {
    await del(IDB_KEY);
}

// --- Task Toggle Offline Queue ---

const TASK_QUEUE_KEY = 'anchor_task_offline_queue';

export interface TaskQueueEntry {
    id: string;
    userId: string;
    taskId: string;
    currentStatus: boolean;
    createdAt: string;
}

async function readTaskQueue(): Promise<TaskQueueEntry[]> {
    const data = await get<TaskQueueEntry[]>(TASK_QUEUE_KEY);
    return Array.isArray(data) ? data : [];
}

export async function enqueueTaskToggle(userId: string, taskId: string, currentStatus: boolean): Promise<void> {
    const queue = await readTaskQueue();
    const filtered = queue.filter(entry => !(entry.userId === userId && entry.taskId === taskId));
    const entry: TaskQueueEntry = {
        id: crypto.randomUUID(),
        userId,
        taskId,
        currentStatus,
        createdAt: new Date().toISOString(),
    };
    filtered.push(entry);
    await set(TASK_QUEUE_KEY, filtered);
}

export async function getTaskQueueLength(): Promise<number> {
    return (await readTaskQueue()).length;
}

export async function processTaskQueue(
    processor: (entry: TaskQueueEntry) => Promise<void>,
): Promise<ProcessResult> {
    const queue = await readTaskQueue();
    if (queue.length === 0) return { succeeded: 0, failed: 0 };

    const failed: TaskQueueEntry[] = [];
    let succeeded = 0;

    for (const entry of queue) {
        try {
            await processor(entry);
            succeeded++;
        } catch {
            failed.push(entry);
        }
    }

    await set(TASK_QUEUE_KEY, failed);
    return { succeeded, failed: failed.length };
}

export async function processTaskQueueForUser(
    userId: string,
    processor: (entry: TaskQueueEntry) => Promise<void>,
): Promise<ProcessResult> {
    const queue = await readTaskQueue();
    if (queue.length === 0) return { succeeded: 0, failed: 0 };

    const remaining: TaskQueueEntry[] = [];
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

    await set(TASK_QUEUE_KEY, remaining);
    return { succeeded, failed };
}

export async function clearTaskQueue(): Promise<void> {
    await del(TASK_QUEUE_KEY);
}
