import { logger } from 'firebase-functions';
import { type DocumentReference } from 'firebase-admin/firestore';
import { getMessaging, type Message } from 'firebase-admin/messaging';
import { classifyTokenSendError, removeTokenIfStale } from './reminderTokenCleanup';

interface SendReminderParams {
    token: string;
    title: string;
    body?: string;
    linkPath: string;
    tokenDocRef: DocumentReference;
}

export async function sendReminderNotification({
    token,
    title,
    body,
    linkPath,
    tokenDocRef,
}: SendReminderParams): Promise<boolean> {
    const message: Message = {
        token,
        notification: { title, body },
        webpush: {
            notification: {
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                requireInteraction: false,
                silent: false,
            },
            fcmOptions: { link: linkPath },
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                    badge: 1,
                },
            },
        },
        android: {
            priority: 'high',
            notification: {
                sound: 'default',
                channelId: 'reminders',
            },
        },
    };

    try {
        await getMessaging().send(message);
        logger.info(`[Reminders] Sent notification to token: ${token.substring(0, 10)}...`);
        return true;
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        const disposition = classifyTokenSendError(err.code);
        const removed = await removeTokenIfStale(err.code, token, tokenDocRef);
        if (!removed) {
            // SN-08: distinguish retryable failures from configuration faults so
            // an operator can act on the latter instead of it being silently
            // retried forever or mistaken for a stale token.
            const prefix =
                `[Reminders] Failed to send to ${token.substring(0, 10)}... code=${err.code ?? 'unknown'}`;
            if (disposition === 'transient') {
                logger.warn(`${prefix}: transient failure; will retry on a later run.`);
            } else if (disposition === 'configuration') {
                logger.error(`${prefix}: configuration fault (operator action required):`, err.message);
            } else {
                logger.error(`${prefix}: unknown failure:`, err.message);
            }
        }
        return false;
    }
}
