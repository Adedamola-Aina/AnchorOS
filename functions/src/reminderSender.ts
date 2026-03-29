import { logger } from 'firebase-functions';
import { type DocumentReference } from 'firebase-admin/firestore';
import { getMessaging, type Message } from 'firebase-admin/messaging';
import { removeTokenIfStale } from './reminderTokenCleanup';

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
        const removed = await removeTokenIfStale(err.code, token, tokenDocRef);
        if (!removed) {
            console.error(`[Reminders] Failed to send to ${token.substring(0, 10)}...:`, err.message);
        }
        return false;
    }
}
