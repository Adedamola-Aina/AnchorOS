import { safeGet, safeSet, safeDel, type ProcessResult } from './offlineQueueStorage';

const TASK_QUEUE_KEY = 'anchor_task_offline_queue';

interface TaskQueueEntry {
    id: string;
    userId: string;
    taskId: string;
    currentStatus: boolean;
    createdAt: string;
}

async function readTaskQueue(): Promise<TaskQueueEntry[]> {
    const data = await safeGet<TaskQueueEntry[]>(TASK_QUEUE_KEY);
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
    await safeSet(TASK_QUEUE_KEY, filtered);
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

    await safeSet(TASK_QUEUE_KEY, failed);
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

    await safeSet(TASK_QUEUE_KEY, remaining);
    return { succeeded, failed };
}

export async function clearTaskQueue(): Promise<void> {
    await safeDel(TASK_QUEUE_KEY);
}
