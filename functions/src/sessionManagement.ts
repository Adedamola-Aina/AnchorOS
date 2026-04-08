/**
 * Session Management — AUTH-003
 *
 * Callables for listing and revoking active sign-in sessions.
 * A "session" is modelled as an authEvent document — each recorded
 * sign-in represents one session entry the user can review or revoke.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { createAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';
import { db, APP_ID } from './config';

interface SessionEntry {
    eventId: string;
    method: string;
    deviceDescription: string;
    userAgent: string;
    ipHash: string;
    timestamp: string | null;
    reported: boolean;
    newDevice: boolean;
}

// ============================================================================
// Callable: listActiveSessions
// Returns the user's recorded sign-in events as a session list.
// ============================================================================

export const listActiveSessions = secureOnCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const uid = request.auth.uid;

    const eventsCol = db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(uid)
        .collection('authEvents');

    const snap = await eventsCol.orderBy('timestamp', 'desc').limit(20).get();

    const sessions: SessionEntry[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
            eventId: doc.id,
            method: typeof d.method === 'string' ? d.method : 'unknown',
            deviceDescription: typeof d.deviceDescription === 'string' ? d.deviceDescription : 'Unknown device',
            userAgent: typeof d.userAgent === 'string' ? d.userAgent : '',
            ipHash: typeof d.ipHash === 'string' ? d.ipHash : '',
            timestamp: d.timestamp?.toDate?.()?.toISOString() ?? null,
            reported: d.reported === true,
            newDevice: d.newDevice === true,
        };
    });

    return { sessions };
});

// ============================================================================
// Callable: revokeSession
// Deletes a specific auth event (session) from the user's history.
// Does NOT force-revoke Firebase refresh tokens — that's reportUnrecognisedSignIn.
// ============================================================================

export const revokeSession = secureOnCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Authentication required');
    }

    await enforceRateLimit('revokeSession', request.auth.uid);

    const rawData = request.data as { eventId?: string };
    const eventId = typeof rawData?.eventId === 'string' ? rawData.eventId : null;

    if (!eventId) {
        throw new HttpsError('invalid-argument', 'eventId is required');
    }

    const uid = request.auth.uid;

    const eventRef = db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(uid)
        .collection('authEvents').doc(eventId);

    const snap = await eventRef.get();
    if (!snap.exists || snap.data()?.uid !== uid) {
        throw new HttpsError('not-found', 'Session not found');
    }

    await eventRef.delete();

    await createAuditLog('session_revoked', uid, { eventId });

    return { success: true };
});

