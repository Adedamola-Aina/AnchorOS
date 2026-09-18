/**
 * Session revocation enforcement — Firestore emulator integration tests (A-03).
 *
 * Proves the *authority* half of revocation against real Firestore: an epoch
 * written by `revokeSession` makes a token issued before it unusable, while a
 * token issued after it still works. This is the mechanism `secureOnCall` uses on
 * every authenticated callable, so this is the "device is cut off" evidence.
 *
 * Isolation follows RA-18: the project is pinned and this suite uses its own NAMED
 * admin app, so the process-global default app (shared with other emulator test
 * files in the worker) cannot steer it.
 *
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npx vitest run --config vitest.emulator.config.ts
 *
 * @vitest-environment node
 */
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    const project = 'anchor-os-session-emulator-test';
    process.env.GCLOUD_PROJECT = project;
    process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: project });

    const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    if (!/^(localhost|127\.0\.0\.1|\[::1\]):([0-9]{1,5})$/.test(emulatorHost)) {
        throw new Error('Session enforcement tests require a loopback Firestore emulator');
    }
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;

    return { PROJECT: project };
});

vi.mock('./config', async () => {
    const { initializeApp, getApp, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    const name = 'session-enforcement-emulator-test';
    const app = getApps().some((existing) => existing.name === name)
        ? getApp(name)
        : initializeApp({ projectId: mockState.PROJECT }, name);

    return { db: getFirestore(app), APP_ID: 'anchor-os' };
});

import { db, APP_ID } from './config';
import {
    assertSessionValid,
    isTokenRevoked,
    markSessionsRevoked,
    readRevokedAfterMs,
    resetSessionEpochCache,
} from './sessionEnforcement';

const uid = 'session-user-1';
const epochRef = () => db.collection('artifacts').doc(APP_ID)
    .collection('users').doc(uid).collection('security').doc('sessionEpoch');

beforeEach(async () => {
    resetSessionEpochCache();
    await epochRef().delete();
});

afterAll(async () => {
    resetSessionEpochCache();
    await epochRef().delete();
});

describe('session revocation enforcement (real Firestore)', () => {
    it('reports nothing revoked before an epoch exists', async () => {
        expect(await readRevokedAfterMs(uid)).toBe(0);
        await expect(assertSessionValid(uid, 1)).resolves.toBeUndefined();
    });

    it('persists the epoch and rejects a token issued before it', async () => {
        const before = Math.floor(Date.now() / 1000);
        const validAfterMs = await markSessionsRevoked(uid, 'session_revoked', 'evt-1');

        const snap = await epochRef().get();
        expect(snap.exists).toBe(true);
        expect(snap.data()?.reason).toBe('session_revoked');
        expect(snap.data()?.eventId).toBe('evt-1');
        expect(snap.data()?.validAfterMs).toBe(validAfterMs);

        // A token minted a minute before the revocation is cut off.
        await expect(assertSessionValid(uid, before - 60)).rejects.toThrow('revoked');

        // A token minted a minute *after* it (fresh sign-in) is accepted.
        resetSessionEpochCache();
        await expect(assertSessionValid(uid, Math.floor(validAfterMs / 1000) + 60)).resolves.toBeUndefined();
    });

    it('fails closed for a token with no auth_time', () => {
        expect(isTokenRevoked(Date.now(), undefined)).toBe(true);
        expect(isTokenRevoked(0, undefined)).toBe(false);
    });

    it('re-reads the epoch after the per-instance cache expires', async () => {
        await markSessionsRevoked(uid, 'first');
        resetSessionEpochCache();

        const second = await markSessionsRevoked(uid, 'second');
        const readBack = await readRevokedAfterMs(uid);

        expect(readBack).toBe(second);
        expect(readBack).toBeGreaterThanOrEqual(second);
    });
});