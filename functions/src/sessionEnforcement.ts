/**
 * Session revocation enforcement (A-03 / AM-11).
 *
 * Firebase Auth can revoke refresh tokens user-wide (`revokeRefreshTokens`), which
 * stops a device from ever minting a *new* ID token — but an ID token already in
 * flight stays valid until it expires (up to one hour), and Firestore rules cannot
 * observe revocation at all. So revocation also records a server-side epoch, and
 * `secureOnCall` rejects any authenticated call whose token predates it. That is
 * what makes "Revoke" bite immediately rather than eventually.
 *
 * The epoch document is server-only: nothing in the client reads or writes it.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { db, APP_ID } from './config';

/** Per-instance cache: revocation must bite within seconds, but a burst of
 *  callables should not read the epoch document on every invocation. */
const CACHE_TTL_MS = 5_000;
const cache = new Map<string, { epochMs: number; at: number }>();

/** Test helper — clears the per-instance cache. */
export function resetSessionEpochCache(): void {
    cache.clear();
}

function epochRef(uid: string) {
    return db.collection('artifacts').doc(APP_ID)
        .collection('users').doc(uid)
        .collection('security').doc('sessionEpoch');
}

/**
 * Mark every token issued before now as revoked for this user.
 * Returns the epoch in epoch-milliseconds.
 */
export async function markSessionsRevoked(uid: string, reason: string, eventId?: string): Promise<number> {
    const validAfterMs = Date.now();

    await epochRef(uid).set(
        {
            validAfterMs,
            reason,
            ...(eventId ? { eventId } : {}),
            updatedAt: new Date(validAfterMs).toISOString(),
        },
        { merge: true },
    );

    cache.set(uid, { epochMs: validAfterMs, at: validAfterMs });
    return validAfterMs;
}

/** Read the revocation epoch (0 = nothing revoked). Cached briefly per instance. */
export async function readRevokedAfterMs(uid: string, nowMs: number = Date.now()): Promise<number> {
    const hit = cache.get(uid);
    if (hit && nowMs - hit.at < CACHE_TTL_MS) return hit.epochMs;

    const snap = await epochRef(uid).get();
    const raw = snap.exists ? snap.data()?.validAfterMs : 0;
    const epochMs = typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;

    cache.set(uid, { epochMs, at: nowMs });
    return epochMs;
}

/**
 * True when the token must be treated as revoked.
 * A token without `auth_time` cannot be proven fresh and is rejected.
 */
export function isTokenRevoked(epochMs: number, authTimeSeconds: number | undefined): boolean {
    if (!epochMs) return false;
    if (typeof authTimeSeconds !== 'number' || !Number.isFinite(authTimeSeconds)) return true;
    return authTimeSeconds * 1000 < epochMs;
}

/** Throw `unauthenticated` when the caller's token predates the revocation epoch. */
export async function assertSessionValid(uid: string, authTimeSeconds: number | undefined): Promise<void> {
    const epochMs = await readRevokedAfterMs(uid);
    if (isTokenRevoked(epochMs, authTimeSeconds)) {
        throw new HttpsError('unauthenticated', 'This session was revoked. Please sign in again.');
    }
}
