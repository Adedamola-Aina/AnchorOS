import { queryClient } from './queryClient';
import { queryPersister } from './persister';

/**
 * RA-05 (#149): the persisted React Query cache is device-global
 * (`react-query-cache`), and it dehydrates everything except `tasks`/`finance`.
 * Without an explicit clear it survives logout and account switch, so a second
 * account on a shared device can hydrate the previous account's cached
 * profile/commitments/notifications/fabric data.
 *
 * Call this on every authentication transition (sign-in, sign-up, social
 * sign-in, logout). Never throws: clearing the in-memory cache is the
 * security-relevant half, and a failed IndexedDB delete must not block auth.
 */
export async function clearClientCache(): Promise<void> {
    try {
        queryClient.clear();
    } catch {
        // ignore
    }

    try {
        await queryPersister.removeClient();
    } catch {
        // ignore
    }
}