/**
 * Push token ownership — SN-01 emulator Integration.
 *
 * Proves the Firestore/auth ownership transition of the push-token lifecycle
 * against the REAL Firestore rules and emulator (not the in-memory unit
 * harness):
 *  - one authoritative fcmTokens document per device registration,
 *  - logout on device A removes only device A's registration; the same
 *    account's other-device registration stays a valid delivery target,
 *  - after the shared device switches A -> B it can no longer hold or recreate
 *    an A registration, and B cannot read A's registrations.
 *
 * Lane: `npm run test:integration` (runs when functions/rules change).
 * Skips cleanly when the Firestore emulator is not running so ordinary unit
 * runs stay green.
 */
// @ts-nocheck

import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const isEmulatorRunning = () => !!process.env.FIRESTORE_EMULATOR_HOST;

const APP_ID = 'anchor-os';

describe('Push token ownership Integration (SN-01)', () => {
    let testEnv: RulesTestEnvironment;

    const tokens = (db, uid) =>
        db.collection('artifacts').doc(APP_ID).collection('users').doc(uid).collection('fcmTokens');
    const tokenRef = (db, uid, token) => tokens(db, uid).doc(token);

    const existsAsAdmin = async (uid, token) => {
        let exists = false;
        await testEnv.withSecurityRulesDisabled(async (context) => {
            const snap = await tokenRef(context.firestore(), uid, token).get();
            exists = snap.exists;
        });
        return exists;
    };

    beforeAll(async () => {
        if (!isEmulatorRunning()) return;
        const rules = readFileSync(resolve(__dirname, '../../../config/firestore.rules'), 'utf-8');
        testEnv = await initializeTestEnvironment({
            projectId: 'anchor-os-test',
            firestore: { host: 'localhost', port: 8080, rules },
        });
    });

    beforeEach(async () => {
        if (testEnv) await testEnv.clearFirestore();
    });

    afterAll(async () => {
        if (testEnv) await testEnv.cleanup();
    });

    it('logout on device A revokes only A while A other-device token stays a target', async () => {
        if (!testEnv) return;
        const deviceA = testEnv.authenticatedContext('user-a').firestore();
        const deviceB = testEnv.authenticatedContext('user-a').firestore();

        await tokenRef(deviceA, 'user-a', 'token-a').set({ token: 'token-a', platform: 'web' });
        await tokenRef(deviceB, 'user-a', 'token-b').set({ token: 'token-b', platform: 'web' });

        // Logout on device A (runs as A while still authenticated).
        await tokenRef(deviceA, 'user-a', 'token-a').delete();

        expect(await existsAsAdmin('user-a', 'token-a')).toBe(false);
        expect(await existsAsAdmin('user-a', 'token-b')).toBe(true);
    });

    it('a shared device switching A -> B cannot remain an A delivery target', async () => {
        if (!testEnv) return;
        const asA = testEnv.authenticatedContext('user-a').firestore();
        await tokenRef(asA, 'user-a', 'shared-token').set({ token: 'shared-token', platform: 'web' });
        await tokenRef(asA, 'user-a', 'shared-token').delete();

        const asB = testEnv.authenticatedContext('user-b').firestore();
        await tokenRef(asB, 'user-b', 'shared-token').set({ token: 'shared-token', platform: 'web' });

        expect(await existsAsAdmin('user-a', 'shared-token')).toBe(false);
        expect(await existsAsAdmin('user-b', 'shared-token')).toBe(true);

        // B must not be able to recreate or read an A registration.
        await expect(tokenRef(asB, 'user-a', 'shared-token').set({ token: 'shared-token' })).rejects.toThrow();
        await expect(tokenRef(asB, 'user-a', 'shared-token').get()).rejects.toThrow();
    });

    it('per-registration documents are independent for two accounts', async () => {
        if (!testEnv) return;
        const asA = testEnv.authenticatedContext('user-a').firestore();
        const asB = testEnv.authenticatedContext('user-b').firestore();

        await tokenRef(asA, 'user-a', 'token-a').set({ token: 'token-a' });
        await tokenRef(asB, 'user-b', 'token-b').set({ token: 'token-b' });

        expect(await existsAsAdmin('user-a', 'token-a')).toBe(true);
        expect(await existsAsAdmin('user-b', 'token-b')).toBe(true);

        // One account can never read the other's delivery targets.
        await expect(tokenRef(asA, 'user-b', 'token-b').get()).rejects.toThrow();
        await expect(tokenRef(asB, 'user-a', 'token-a').get()).rejects.toThrow();
    });
});