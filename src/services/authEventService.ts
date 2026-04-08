/**
 * authEventService — SEC-009
 *
 * Records sign-in events to `users/{uid}/authEvents/{id}` with:
 *   - timestamp (ISO 8601)
 *   - deviceInfo: OS + browser parsed from user-agent
 *   - ipHash: SHA-256 of IP, fetched server-side (never raw IP stored)
 *
 * Also provides "Not me" forced sign-out that:
 *   1. Signs out all Firebase sessions via revokeRefreshTokens (Cloud Function)
 *   2. Sends a security alert email
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { secureDb } from '../utils/secureDb';

export interface AuthEvent {
    id?: string;
    timestamp: string;
    deviceInfo: DeviceInfo;
    /** SHA-256 hash of client IP — computed server-side, never raw IP */
    ipHash: string;
    method?: 'password' | 'google' | 'apple' | 'passkey';
    /** True if user flagged this event as "Not me" (SEC-009) */
    reported?: boolean;
    /** True if this sign-in was from a device not seen before (AUTH-008) */
    newDevice?: boolean;
}

interface DeviceInfo {
    os: string;
    browser: string;
    raw: string;
}

/** Parse a User-Agent string into human-readable OS + browser */
function parseUserAgent(ua: string): DeviceInfo {
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';

    // OS detection
    if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/Windows/.test(ua)) os = 'Windows';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Linux/.test(ua)) os = 'Linux';

    // Browser detection
    if (/CriOS/.test(ua)) browser = 'Chrome (iOS)';
    else if (/FxiOS/.test(ua)) browser = 'Firefox (iOS)';
    else if (/EdgA|EdgiOS/.test(ua)) browser = 'Edge';
    else if (/SamsungBrowser/.test(ua)) browser = 'Samsung Internet';
    else if (/OPR|Opera/.test(ua)) browser = 'Opera';
    else if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/Chrome/.test(ua)) browser = 'Chrome';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Safari/.test(ua)) browser = 'Safari';

    return { os, browser, raw: ua.slice(0, 200) };
}

/**
 * Record a sign-in event. Called client-side on successful auth.
 * IP hash is computed server-side by the recordAuthEvent Cloud Function.
 */
export async function recordAuthEvent(
    userAgent: string,
    method: 'password' | 'google' | 'apple' | 'passkey' = 'password'
): Promise<void> {
    try {
        const recordEvent = httpsCallable(functions, 'recordAuthEvent');
        await recordEvent({ userAgent, method });
    } catch {
        // Silently fail — auth event recording must never block sign-in
    }
}

/**
 * Fetch last 10 auth events for a user (client reads their own subcollection).
 */
export async function getAuthEvents(userId: string): Promise<AuthEvent[]> {
    const events = await secureDb.queryCollection<Record<string, unknown>>(
        userId,
        'authEvents',
        [],
    );

    const normalizeTimestamp = (value: unknown): string => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
            return (value as { toDate: () => Date }).toDate().toISOString();
        }
        if (value && typeof value === 'object' && 'seconds' in value && typeof (value as { seconds?: number }).seconds === 'number') {
            return new Date((value as { seconds: number }).seconds * 1000).toISOString();
        }
        return new Date(0).toISOString();
    };

    const mapped = events.map((event) => {
        const ua = typeof event.userAgent === 'string' ? event.userAgent : '';
        return {
            id: typeof event.id === 'string' ? event.id : undefined,
            timestamp: normalizeTimestamp(event.timestamp),
            deviceInfo: parseUserAgent(ua),
            ipHash: typeof event.ipHash === 'string' ? event.ipHash : 'unknown',
            method: (event.method as AuthEvent['method']) ?? 'password',
            reported: Boolean(event.reported),
            newDevice: Boolean(event.newDevice),
        } as AuthEvent;
    });

    return mapped.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 10);
}

/**
 * "Not me" handler — revokes all refresh tokens and sends a security alert.
 */
export async function reportUnrecognisedSignIn(eventId: string): Promise<void> {
    const reportFn = httpsCallable(functions, 'reportUnrecognisedSignIn');
    await reportFn({ eventId });
}

/**
 * Permanently delete a specific auth event from the user's history.
 * The Cloud Function hard-deletes the Firestore document — it won't reappear on reload.
 */
export async function dismissAuthEvent(eventId: string): Promise<void> {
    const dismissFn = httpsCallable(functions, 'dismissAuthEvent');
    await dismissFn({ eventId });
}

/**
 * Revoke a specific session (AUTH-003).
 * Records a security audit log entry and removes the session event.
 */
export async function revokeSession(eventId: string): Promise<void> {
    const revokeFn = httpsCallable(functions, 'revokeSession');
    await revokeFn({ eventId });
}

export { parseUserAgent };
