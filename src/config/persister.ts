// @ts-nocheck
import { get, set, del } from 'idb-keyval';
import type {
    Persister,
    PersistedClient,
} from '@tanstack/react-query-persist-client';

/**
 * Creates an IndexedDB persister for TanStack Query.
 */
export function createIndexedDBPersister(idbKey: string = 'react-query-cache'): Persister {
    return {
        persistClient: async (client: PersistedClient) => {
            await set(idbKey, client);
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbKey);
        },
        removeClient: async () => {
            await del(idbKey);
        },
    };
}

/**
 * RA-05 (#149): single shared persister instance. The app provider and
 * `clearClientCache()` must operate on the same IndexedDB key so that clearing
 * on an auth transition actually removes the persisted cache.
 */
export const queryPersister: Persister = createIndexedDBPersister();
