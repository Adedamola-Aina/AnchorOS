import { get, set, del } from 'idb-keyval';

const memoryQueueStore = new Map<string, unknown>();

export async function safeGet<T>(key: string): Promise<T | undefined> {
    try {
        return await get<T>(key);
    } catch {
        return memoryQueueStore.get(key) as T | undefined;
    }
}

export async function safeSet<T>(key: string, value: T): Promise<void> {
    try {
        await set(key, value);
    } catch {
        memoryQueueStore.set(key, value);
    }
}

export async function safeDel(key: string): Promise<void> {
    try {
        await del(key);
    } catch {
        memoryQueueStore.delete(key);
    }
}

export interface ProcessResult {
    succeeded: number;
    failed: number;
}
