/**
 * Push token lifecycle — ownership-aware, per-device registration/revocation.
 *
 * Invariant: a push token must not remain an authoritative delivery target for
 * the previous authenticated user after logout or account switch, WITHOUT
 * revoking push delivery for that same account's other devices.
 *
 * Findings closed here:
 *  - SN-01: the departing account's *current device* registration is revoked
 *           before sign-out/switch, while that account is still authenticated
 *           to write its own token document. Other devices keep working because
 *           every device owns a distinct FCM registration document id.
 *  - SN-03: the persisted delivery state and the UI state agree, and the
 *           "push disabled" flag is per-account, not device-global.
 *  - SN-08: registration and deregistration are idempotent and fail-safe so
 *           retries can neither resurrect a previous user's authority nor
 *           abort a lifecycle transition.
 *
 * There is deliberately no device-id abstraction: the FCM registration token
 * already is the per-device/per-registration identity (it is also the Firestore
 * document id), so all we persist is the registration this device last wrote.
 */

import { getMessagingInstance } from '../config/firebase';
import { deleteStoredPushToken, upsertPushToken } from '../api/PushTokenApi';
import { captureError } from '../utils/error';

export const PUSH_DISABLED_STORAGE_KEY_PREFIX = 'anchor_push_disabled';

/**
 * Storage key holding the FCM registration this device most recently wrote.
 *
 * Persisting it lets logout/switch revoke exactly ONE device — the one holding
 * this registration — without enumerating or touching the account's other
 * devices.
 */
export const PUSH_REGISTRATION_STORAGE_KEY = 'anchor_push_registration';

export interface StoredPushRegistration {
    uid: string;
    token: string;
}

/** Per-account disabled flag key (SN-03: replaces the device-global flag). */
export function pushDisabledStorageKey(uid: string): string {
    return `${PUSH_DISABLED_STORAGE_KEY_PREFIX}:${uid}`;
}

function safeStorage(): Storage | null {
    try {
        return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch {
        return null;
    }
}

export function isPushDisabledForUser(uid?: string | null): boolean {
    if (!uid) return false;
    const storage = safeStorage();
    if (!storage) return false;
    try {
        return storage.getItem(pushDisabledStorageKey(uid)) === 'true';
    } catch {
        return false;
    }
}

export function setPushDisabledForUser(uid: string | null | undefined, disabled: boolean): void {
    if (!uid) return;
    const storage = safeStorage();
    if (!storage) return;
    try {
        if (disabled) {
            storage.setItem(pushDisabledStorageKey(uid), 'true');
        } else {
            storage.removeItem(pushDisabledStorageKey(uid));
        }
    } catch {
        // Storage unavailable — non-fatal; delivery state stays authoritative
        // and the next session re-derives the UI state.
    }
}

export function readStoredPushRegistration(): StoredPushRegistration | null {
    const storage = safeStorage();
    if (!storage) return null;
    try {
        const raw = storage.getItem(PUSH_REGISTRATION_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<StoredPushRegistration> | null;
        if (!parsed || typeof parsed.uid !== 'string' || typeof parsed.token !== 'string') {
            return null;
        }
        return { uid: parsed.uid, token: parsed.token };
    } catch {
        return null;
    }
}

export function writeStoredPushRegistration(registration: StoredPushRegistration): void {
    const storage = safeStorage();
    if (!storage) return;
    try {
        storage.setItem(PUSH_REGISTRATION_STORAGE_KEY, JSON.stringify(registration));
    } catch {
        // Non-fatal: revocation still deletes the local FCM registration, after
        // which Functions stale-token cleanup removes the dead document.
    }
}

export function clearStoredPushRegistration(): void {
    const storage = safeStorage();
    if (!storage) return;
    try {
        storage.removeItem(PUSH_REGISTRATION_STORAGE_KEY);
    } catch {
        // ignore
    }
}


export interface PushTokenLifecycleDeps {
    /** Persist a token for `uid` (idempotent upsert). */
    upsertToken: (uid: string, token: string, userAgent: string, platform?: string) => Promise<void>;
    /** Remove ONE registration document — per-device revocation. */
    deleteToken: (uid: string, token: string) => Promise<void>;
    /** Best-effort removal of the local FCM registration on this device. */
    deleteLocalRegistration: () => Promise<void>;
    readRegistration: () => StoredPushRegistration | null;
    writeRegistration: (registration: StoredPushRegistration) => void;
    clearRegistration: () => void;
    captureError: (error: unknown, context: string) => void;
    userAgent: () => string;
}

export interface PushTokenLifecycle {
    register: (uid: string, token: string, platform?: string) => Promise<boolean>;
    deregister: (uid?: string | null) => Promise<boolean>;
}

/**
 * Pure lifecycle core with injected side effects — directly unit-testable for
 * the two-device logout/switch scenario, idempotency, and failure/retry.
 */
export function createPushTokenLifecycle(deps: PushTokenLifecycleDeps): PushTokenLifecycle {
    return {
        async register(uid, token, platform = 'web') {
            if (!uid || !token) return false;

            const previous = deps.readRegistration();
            await deps.upsertToken(uid, token, deps.userAgent(), platform);

            // Token rotation for the SAME account: drop the superseded
            // registration so it cannot linger as an alternate delivery target.
            if (previous && previous.uid === uid && previous.token !== token) {
                try {
                    await deps.deleteToken(uid, previous.token);
                } catch (error) {
                    deps.captureError(error, 'PushTokenLifecycle.register.rotate');
                }
            }

            deps.writeRegistration({ uid, token });
            return true;
        },

        async deregister(uid) {
            if (!uid) return false;

            const previous = deps.readRegistration();
            let removed = false;

            if (previous && previous.uid === uid) {
                try {
                    await deps.deleteToken(uid, previous.token);
                    removed = true;
                    deps.clearRegistration();
                } catch (error) {
                    // Fail-safe: keep the registration so a retry can remove the
                    // document that survived. Never abort logout because of it.
                    deps.captureError(error, 'PushTokenLifecycle.deregister.store');
                }
            } else if (previous) {
                // The stored registration belongs to a different account; never
                // touch another account's documents. Forget the stale device
                // registration and fall back to local-registration revocation.
                deps.clearRegistration();
            }

            try {
                await deps.deleteLocalRegistration();
            } catch (error) {
                deps.captureError(error, 'PushTokenLifecycle.deregister.local');
            }

            return removed;
        },
    };
}

/**
 * Delete the browser's FCM registration token. This is defence in depth for
 * SN-01: even if a stored document somehow survived, the device token stops
 * being deliverable and Functions stale-token cleanup removes the document.
 */
async function deleteLocalFirebaseRegistration(): Promise<void> {
    const messaging = await getMessagingInstance();
    if (!messaging) return;
    const { deleteToken } = await import('firebase/messaging');
    await deleteToken(messaging);
}

export const pushTokenLifecycle = createPushTokenLifecycle({
    upsertToken: (uid, token, userAgent, platform) =>
        upsertPushToken(uid, token, userAgent, platform),
    deleteToken: (uid, token) => deleteStoredPushToken(uid, token),
    deleteLocalRegistration: deleteLocalFirebaseRegistration,
    readRegistration: readStoredPushRegistration,
    writeRegistration: writeStoredPushRegistration,
    clearRegistration: clearStoredPushRegistration,
    captureError: (error, context) => captureError(error, context),
    userAgent: () => (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
});

/** Ownership-aware registration for the signed-in user (SN-01/SN-03). */
export function registerDevicePushToken(
    uid: string,
    token: string,
    platform: string = 'web',
): Promise<boolean> {
    return pushTokenLifecycle.register(uid, token, platform);
}

/**
 * Ownership-aware, per-device deregistration for the departing user. Idempotent
 * and fail-safe; safe to call on logout, account switch, or cleanup retries.
 */
export function deregisterDevicePushToken(uid?: string | null): Promise<boolean> {
    return pushTokenLifecycle.deregister(uid);
}
