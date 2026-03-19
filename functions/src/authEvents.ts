/**
 * Auth Event History — secure sign-in recording and incident reporting
 *
 * SEC-009: Records each successful sign-in with device/IP context.
 * Provides "Not me" incident reporting that force-revokes all sessions.
 */

import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { secureOnCall } from './callable';
import { createAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';
import { db, APP_ID } from './config';

const MAX_AUTH_EVENTS = 20;

interface RecordAuthEventData {
    userAgent: string;
    method: 'password' | 'google' | 'apple' | 'passkey';
}

interface ReportUnrecognisedData {
    eventId: string;
}

function hashIp(rawIp: string | undefined): string {
    if (!rawIp) return 'unknown';
    return createHash('sha256').update(`authip:${rawIp}`).digest('hex').slice(0, 16);
}

function pruneOldEvents(uid: string): Promise<void> {
    const colRef = db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(uid)
        .collection('authEvents');

    return db.runTransaction(async (tx) => {
        const snap = await tx.get(colRef.orderBy('timestamp', 'desc').offset(MAX_AUTH_EVENTS));
        snap.docs.forEach((doc) => tx.delete(doc.ref));
    });
}

// ============================================================================
// Callable: recordAuthEvent
// Called immediately after a successful sign-in from the client.
// ============================================================================

export const recordAuthEvent = secureOnCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Authentication required');
    }

    await enforceRateLimit('recordAuthEvent', request.auth.uid);

    const rawData = request.data as RecordAuthEventData;
    const userAgent = typeof rawData?.userAgent === 'string'
        ? rawData.userAgent.slice(0, 500)
        : 'unknown';
    const method = ['password', 'google', 'apple', 'passkey'].includes(rawData?.method)
        ? rawData.method
        : 'password';

    const rawIp = request.rawRequest?.ip ?? request.rawRequest?.headers?.['x-forwarded-for'];
    const ipHash = hashIp(Array.isArray(rawIp) ? rawIp[0] : rawIp);

    const eventsCol = db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(request.auth.uid)
        .collection('authEvents');

    const docRef = eventsCol.doc();
    await docRef.set({
        eventId: docRef.id,
        uid: request.auth.uid,
        method,
        ipHash,
        userAgent,
        timestamp: FieldValue.serverTimestamp(),
        reported: false,
    });

    // Fire-and-forget prune; don't block the response
    void pruneOldEvents(request.auth.uid).catch(() => undefined);

    await createAuditLog('auth_event_recorded', request.auth.uid, { method });

    return { success: true, eventId: docRef.id };
});

// ============================================================================
// Callable: reportUnrecognisedSignIn
// "Not me" — revokes all sessions and flags the event.
// ============================================================================

export const reportUnrecognisedSignIn = secureOnCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Authentication required');
    }

    await enforceRateLimit('reportUnrecognisedSignIn', request.auth.uid);

    const rawData = request.data as ReportUnrecognisedData;
    const eventId = typeof rawData?.eventId === 'string' ? rawData.eventId : null;

    if (!eventId) {
        throw new HttpsError('invalid-argument', 'eventId is required');
    }

    const uid = request.auth.uid;

    // Mark the event as reported
    const eventRef = db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(uid)
        .collection('authEvents').doc(eventId);

    const snap = await eventRef.get();
    if (!snap.exists || snap.data()?.uid !== uid) {
        throw new HttpsError('not-found', 'Auth event not found');
    }

    await eventRef.update({ reported: true, reportedAt: FieldValue.serverTimestamp() });

    // Force-revoke all refresh tokens (logs out all sessions)
    await getAuth().revokeRefreshTokens(uid);

    await createAuditLog('auth_unrecognised_signin_reported', uid, { eventId });

    return { success: true };
});
