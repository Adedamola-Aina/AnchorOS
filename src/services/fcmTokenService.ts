/**
 * FCM Token Service - Handles push notification token retrieval with retry
 * 
 * ARCH-003: Extracted from NotificationContext to separate concerns.
 * Handles IDB timing issues that occur during PWA navigation.
 */

import { getToken, type Messaging } from 'firebase/messaging';

interface FcmTokenOptions {
    messaging: Messaging;
    vapidKey: string;
    maxRetries?: number;
    initialDelay?: number;
}

/**
 * Get FCM token with exponential backoff retry for IDB timing issues.
 * Safari and some mobile browsers close IndexedDB connections during
 * PWA navigation, causing transient failures.
 */
export async function getFcmTokenWithRetry({
    messaging,
    vapidKey,
    maxRetries = 3,
    initialDelay = 500,
}: FcmTokenOptions): Promise<string | null> {
    const attempt = async (retries: number, delay: number): Promise<string | null> => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const token = await getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: registration,
            });
            return token;
        } catch (err: unknown) {
            const e = err instanceof Error ? err : new Error(String(err));
            const isRetryable = retries > 0 && (
                e.message.includes('closing') ||
                e.name === 'InvalidStateError'
            );
            if (isRetryable) {
                if (import.meta.env.DEV) console.warn(`[Push] IDB timing error, retrying in ${delay}ms... (${retries} left)`);
                await new Promise(r => setTimeout(r, delay));
                return attempt(retries - 1, delay * 2);
            }
            throw e;
        }
    };

    return attempt(maxRetries, initialDelay);
}
