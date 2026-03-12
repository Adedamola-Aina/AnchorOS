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
    const appVersion = asTrimmedString(data.appVersion, 'appVersion', 32);
    const deviceType = asTrimmedString(data.deviceType, 'deviceType', 2000);
    const platform = asTrimmedString(data.platform, 'platform', 120);
    const currentPage = asTrimmedString(data.currentPage, 'currentPage', 200);
    const timestamp = asTrimmedString(data.timestamp, 'timestamp', 50);

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
