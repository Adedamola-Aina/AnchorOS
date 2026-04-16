/**
 * Feedback submission callable.
 *
 * Routes support/feedback writes through trusted backend validation
 * and server-side rate limits.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { secureOnCall } from './callable';

interface FeedbackPayload {
    subject?: unknown;
    message?: unknown;
    name?: unknown;
    email?: unknown;
    appVersion?: unknown;
    deviceType?: unknown;
    platform?: unknown;
    currentPage?: unknown;
    timestamp?: unknown;
}

function asTrimmedString(value: unknown, field: string, maxLen: number): string {
    if (typeof value !== 'string') {
        throw new HttpsError('invalid-argument', `${field} must be a string`);
    }

    const trimmed = value.trim();
    if (!trimmed) {
        throw new HttpsError('invalid-argument', `${field} is required`);
    }

    if (trimmed.length > maxLen) {
        throw new HttpsError('invalid-argument', `${field} exceeds maximum length`);
    }

    return trimmed;
}

/** Metadata fields (platform, deviceType, etc.) are diagnostic — never throw on empty. */
function asMetaString(value: unknown, maxLen: number, fallback: string): string {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

export const submitFeedback = secureOnCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const uid = request.auth.uid;
    await enforceRateLimit('feedbackSubmit', uid);

    const data = request.data as FeedbackPayload;
    const subject = asTrimmedString(data.subject, 'subject', 80);
    const message = asTrimmedString(data.message, 'message', 4000);
    const name = asTrimmedString(data.name, 'name', 120);
    const email = asTrimmedString(data.email, 'email', 254);
    // Metadata fields are diagnostic — use lenient parsing with safe fallbacks
    const appVersion = asMetaString(data.appVersion, 32, 'unknown');
    const deviceType = asMetaString(data.deviceType, 2000, 'unknown');
    const platform = asMetaString(data.platform, 120, 'web');
    const currentPage = asMetaString(data.currentPage, 200, 'unknown');
    const timestamp = asMetaString(data.timestamp, 50, new Date().toISOString());

    await db.collection('artifacts').doc(APP_ID).collection('feedback').add({
        subject,
        message,
        name,
        email,
        userId: uid,
        appVersion,
        deviceType,
        platform,
        currentPage,
        timestamp,
        createdAt: new Date(),
        status: 'new',
    });

    return { success: true };
});
