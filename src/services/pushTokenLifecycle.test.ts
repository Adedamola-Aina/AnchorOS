/**
 * Push token lifecycle — SN-01 / SN-03 / SN-08 acceptance tests.
 *
 * Invariants under test:
 *   1. A push token must not remain an authoritative delivery target for the
 *      previous authenticated user after logout or account switch.
 *   2. Logging out one device must NOT revoke push delivery for the same
 *      account's other devices (each device owns its own registration).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../config/firebase', () => ({
    getMessagingInstance: vi.fn(async () => null),
}));
vi.mock('../api/PushTokenApi', () => ({
    upsertPushToken: vi.fn(async () => undefined),
    deleteStoredPushToken: vi.fn(async () => undefined),
}));
vi.mock('../utils/error', () => ({ captureError: vi.fn() }));

import {
    createPushTokenLifecycle,
    isPushDisabledForUser,
    pushDisabledStorageKey,
    setPushDisabledForUser,
    type PushTokenLifecycleDeps,
    type StoredPushRegistration,
} from './pushTokenLifecycle';

/** In-memory Firestore token documents, shared by every simulated device. */
function createStore() {
    const tokenDocs = new Map<string, Set<string>>();
    return {
        tokenDocs,
        tokensFor: (uid: string): Set<string> => tokenDocs.get(uid) ?? new Set<string>(),
        add: (uid: string, token: string) => {
            if (!tokenDocs.has(uid)) tokenDocs.set(uid, new Set());
            tokenDocs.get(uid)!.add(token);
        },
        remove: (uid: string, token: string) => tokenDocs.get(uid)?.delete(token),
    };
}

/**
 * One simulated device. `localRegistration` is the single FCM registration this
 * device currently holds; `stored` is the registration it persisted locally.
 */
function createDevice(store: ReturnType<typeof createStore>) {
    let localRegistration: string | null = null;
    let stored: StoredPushRegistration | null = null;
    let failStoreDelete = false;
    let failLocalDelete = false;
    const captured: Array<{ error: unknown; context: string }> = [];

    const deps: PushTokenLifecycleDeps = {
        upsertToken: async (uid, token) => {
            localRegistration = token;
            store.add(uid, token);
        },
        deleteToken: async (uid, token) => {
            if (failStoreDelete) throw new Error('temporary store failure');
            store.remove(uid, token);
        },
        deleteLocalRegistration: async () => {
            if (failLocalDelete) throw new Error('deleteToken failed');
            localRegistration = null;
        },
        readRegistration: () => stored,
        writeRegistration: (registration) => { stored = registration; },
        clearRegistration: () => { stored = null; },
        captureError: (error, context) => captured.push({ error, context }),
        userAgent: () => 'test-agent',
    };

    const lifecycle = createPushTokenLifecycle(deps);

    return {
        lifecycle,
        captured,
        setFailStoreDelete: (value: boolean) => { failStoreDelete = value; },
        setFailLocalDelete: (value: boolean) => { failLocalDelete = value; },
        storedRegistration: () => stored,
        localRegistration: () => localRegistration,
        /** Would a push addressed to `uid` reach THIS device right now? */
        deliversTo: (uid: string) =>
            localRegistration !== null && store.tokensFor(uid).has(localRegistration),
    };
}

describe('pushTokenLifecycle', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("SN-01: logging out one device leaves the account's other device registered", async () => {
        const store = createStore();
        const deviceA = createDevice(store);
        const deviceB = createDevice(store);

        // User A registers Token A on device A and Token B on device B.
        await deviceA.lifecycle.register('user-a', 'token-a');
        await deviceB.lifecycle.register('user-a', 'token-b');
        expect(store.tokensFor('user-a')).toEqual(new Set(['token-a', 'token-b']));

        // Logout only on device A.
        expect(await deviceA.lifecycle.deregister('user-a')).toBe(true);

        // Token A is no longer an authoritative User A target...
        expect(store.tokensFor('user-a')).toEqual(new Set(['token-b']));
        expect(deviceA.deliversTo('user-a')).toBe(false);
        // ...but Token B still is.
        expect(deviceB.deliversTo('user-a')).toBe(true);
        expect(deviceB.storedRegistration()).toEqual({ uid: 'user-a', token: 'token-b' });
    });

    it('SN-01: a shared device switching User A to User B removes A authority only', async () => {
        const store = createStore();
        const shared = createDevice(store);
        const otherDevice = createDevice(store);

        await otherDevice.lifecycle.register('user-a', 'token-b');
        await shared.lifecycle.register('user-a', 'token-a');

        // Logout A on the shared device, then B signs in there.
        await shared.lifecycle.deregister('user-a');
        await shared.lifecycle.register('user-b', 'token-a2');

        expect(store.tokensFor('user-a')).toEqual(new Set(['token-b']));
        expect(store.tokensFor('user-b').has('token-a2')).toBe(true);
        expect(shared.deliversTo('user-a')).toBe(false);
        expect(shared.deliversTo('user-b')).toBe(true);
        expect(otherDevice.deliversTo('user-a')).toBe(true);
    });

    it("SN-01: deregistering one account never removes another account's tokens", async () => {
        const store = createStore();
        const deviceA = createDevice(store);
        const deviceB = createDevice(store);

        await deviceA.lifecycle.register('user-a', 'token-a');
        await deviceB.lifecycle.register('user-b', 'token-b');

        await deviceA.lifecycle.deregister('user-a');

        expect(store.tokensFor('user-b').has('token-b')).toBe(true);
        expect(deviceB.deliversTo('user-b')).toBe(true);
    });

    it("SN-01: a mismatched uid never deletes the stored account's documents", async () => {
        const store = createStore();
        const device = createDevice(store);
        await device.lifecycle.register('user-a', 'token-a');

        // Defensive: a stale call for a different account must not touch A's doc.
        expect(await device.lifecycle.deregister('user-b')).toBe(false);
        expect(store.tokensFor('user-a').has('token-a')).toBe(true);
    });

    it('SN-08: token refresh replaces the previous registration for the same account', async () => {
        const store = createStore();
        const device = createDevice(store);

        await device.lifecycle.register('user-a', 'token-a');
        await device.lifecycle.register('user-a', 'token-a2');

        expect(store.tokensFor('user-a')).toEqual(new Set(['token-a2']));
        expect(device.deliversTo('user-a')).toBe(true);
    });

    it('SN-08: repeated logout/cleanup is safe and idempotent', async () => {
        const store = createStore();
        const device = createDevice(store);
        await device.lifecycle.register('user-a', 'token-a');

        expect(await device.lifecycle.deregister('user-a')).toBe(true);
        expect(await device.lifecycle.deregister('user-a')).toBe(false);
        expect(await device.lifecycle.deregister('user-a')).toBe(false);
        expect(store.tokensFor('user-a').size).toBe(0);
    });

    it('SN-08: a no-op deregister (no uid) is safe', async () => {
        const device = createDevice(createStore());
        expect(await device.lifecycle.deregister(null)).toBe(false);
        expect(await device.lifecycle.deregister(undefined)).toBe(false);
    });

    it('SN-08: store-cleanup failure is fail-safe and recoverable on retry', async () => {
        const store = createStore();
        const device = createDevice(store);
        await device.lifecycle.register('user-a', 'token-a');

        device.setFailStoreDelete(true);
        // Must not throw, must still clear the local registration, must not
        // report success — a stale document may survive and be retried.
        await expect(device.lifecycle.deregister('user-a')).resolves.toBe(false);
        expect(device.localRegistration()).toBeNull();
        expect(device.captured.some((c) => c.context === 'PushTokenLifecycle.deregister.store')).toBe(true);
        expect(store.tokensFor('user-a').size).toBe(1);
        // The registration is retained so a retry can still target it.
        expect(device.storedRegistration()).not.toBeNull();

        device.setFailStoreDelete(false);
        expect(await device.lifecycle.deregister('user-a')).toBe(true);
        expect(store.tokensFor('user-a').size).toBe(0);
    });

    it('SN-08: a failed local-registration delete does not block store cleanup', async () => {
        const store = createStore();
        const device = createDevice(store);
        await device.lifecycle.register('user-a', 'token-a');

        device.setFailLocalDelete(true);
        await expect(device.lifecycle.deregister('user-a')).resolves.toBe(true);
        expect(device.captured.some((c) => c.context === 'PushTokenLifecycle.deregister.local')).toBe(true);
        expect(store.tokensFor('user-a').size).toBe(0);
    });

    it('SN-03: registration requires both a uid and a token', async () => {
        const device = createDevice(createStore());
        expect(await device.lifecycle.register('', 'token')).toBe(false);
        expect(await device.lifecycle.register('user-a', '')).toBe(false);
    });
});


describe('per-account push-disabled flag (SN-03)', () => {
    beforeEach(() => localStorage.clear());

    it('scopes the flag per account instead of device-global', () => {
        setPushDisabledForUser('user-a', true);

        expect(isPushDisabledForUser('user-a')).toBe(true);
        expect(isPushDisabledForUser('user-b')).toBe(false);
        expect(localStorage.getItem(pushDisabledStorageKey('user-a'))).toBe('true');
    });

    it('clears only the requested account flag', () => {
        setPushDisabledForUser('user-a', true);
        setPushDisabledForUser('user-b', true);

        setPushDisabledForUser('user-a', false);

        expect(isPushDisabledForUser('user-a')).toBe(false);
        expect(isPushDisabledForUser('user-b')).toBe(true);
    });

    it('treats missing/absent uid as not disabled', () => {
        expect(isPushDisabledForUser(null)).toBe(false);
        expect(isPushDisabledForUser(undefined)).toBe(false);
    });
});

