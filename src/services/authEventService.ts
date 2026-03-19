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
    /** True if user flagged this event as "Not me" (SEC-009) */
    reported?: boolean;
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
    const events = await secureDb.queryCollection<AuthEvent>(
        userId,
        'authEvents',
        [],
    );
    return events
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 10);
}

/**
 * "Not me" handler — revokes all refresh tokens and sends a security alert.
 */
export async function reportUnrecognisedSignIn(eventId: string): Promise<void> {
    const reportFn = httpsCallable(functions, 'reportUnrecognisedSignIn');
    await reportFn({ eventId });
}

export { parseUserAgent };
