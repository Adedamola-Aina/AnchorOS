
import { get, set, del } from 'idb-keyval';
import type {
    Persister,
    PersistedClient,
} from '@tanstack/react-query-persist-client';

/**
 * Creates an IndexedDB persister for TanStack Query.
 */
function createIndexedDBPersister(idbKey: string = 'react-query-cache'): Persister {
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
const basePersister = createIndexedDBPersister();

export const queryPersister: Persister = {
    ...basePersister,
    /**
     * A cache write is best-effort, so it must never be able to break the app.
     *
     * `shouldDehydrateQuery` below is the real fix for the non-cloneable data; this
     * guard exists because the failure mode is so bad when that filter is wrong: the
     * rejection surfaced as an unhandled `pageerror` on every write
     * (`DataCloneError: ... #<Promise> could not be cloned`), repeated for each one,
     * with no way for the user to tell that only a cache write was affected.
     */
    persistClient: async (client: PersistedClient) => {
        try {
            await basePersister.persistClient(client);
        } catch (error) {
            console.warn('[persister] dropping an unserialisable cache write', error);
        }
    },
};

/** The subset of a query the filter needs; kept structural so it stays testable. */
export interface DehydratableQuery {
    queryKey: readonly unknown[];
    state: { status: string };
}

/**
 * Which queries may be written to IndexedDB.
 *
 * Being selective is not an optimisation here — a dehydrated query carries a live
 * Promise whenever it is still fetching:
 *
 *   // @tanstack/query-core, dehydrateQuery
 *   ...query.state.status === "pending" && { promise: dehydratePromise() }
 *
 * and a Promise is not structured-cloneable, so `IDBObjectStore.put` throws
 * `DataCloneError` and the ENTIRE cache write is lost. query-core's own default is
 * `status === 'success'`; the previous filter here replaced that default with a
 * key-only check rather than narrowing it, which re-introduced pending queries (and
 * therefore the Promise) into the persisted payload. Observed on staging as seven
 * `DataCloneError`s per page load, traced to `$.clientState.queries[0].promise`.
 */
export const shouldDehydrateQuery = (query: DehydratableQuery): boolean => {
    // Restore the library's default: only settled, successful queries are persistable.
    if (query.state.status !== 'success') return false;
    // …and keep this app's own exclusions — high-churn keys that are re-read on launch.
    const key = query.queryKey[0];
    return key !== 'tasks' && key !== 'finance';
};
