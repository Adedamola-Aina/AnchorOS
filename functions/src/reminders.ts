/**
 * PLT-003: Commitment Reminders - Server-Side Push Delivery
 * 
 * Scheduled function that runs every 5 minutes to check for due reminders
 * and sends native push notifications via FCM.
 * 
 * Design Philosophy: Notifications are minimal, calm, straight to the point.
 * - No emoji clutter
 * - No "It's time for..." fluff
 * - Just the commitment title
 */
// @ts-nocheck


import { getMessaging, type Message } from 'firebase-admin/messaging';
import { type DocumentReference } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { format } from 'date-fns';
import { db, APP_ID } from './config';

/**
 * Scheduled function: runs every 5 minutes
 * Queries commitments with reminders in the current time window and sends push notifications.
 */
export const processReminders = onSchedule(
    { schedule: 'every 1 minutes', timeZone: 'Africa/Lagos' },
    async () => {
        const now = new Date();
        const currentTime = format(now, 'HH:mm');
        const todayDate = format(now, 'yyyy-MM-dd');

        console.log(`[Reminders] Processing reminders for ${currentTime} on ${todayDate}`);

        try {
            // Query all incomplete commitments with reminderTime matching current window
            // Note: This is a collection group query across all users
            const snapshot = await db.collectionGroup('commitments')
                .where('reminderTime', '==', currentTime)
                .where('completed', '==', false)
                .get();

            if (snapshot.empty) {
                console.log('[Reminders] No reminders due at this time.');
                return;
            }

            console.log(`[Reminders] Found ${snapshot.size} commitments with reminders.`);

            const sendPromises: Promise<void>[] = [];

            for (const doc of snapshot.docs) {
                const commitment = doc.data();
                const userId = doc.ref.parent.parent?.id;

                if (!userId) {
                    console.warn('[Reminders] Could not determine userId for commitment:', doc.id);
                    continue;
                }

                // Check if already notified today (prevent duplicates)
                const lastNotified = commitment.lastReminderSent;
                if (lastNotified === todayDate) {
                    console.log(`[Reminders] Already notified for ${doc.id} today, skipping.`);
                    continue;
                }

                // Get user's FCM tokens
                const tokensSnapshot = await db
                    .collection('artifacts')
                    .doc(APP_ID)
                    .collection('users')
                    .doc(userId)
                    .collection('fcmTokens')
                    .get();

                if (tokensSnapshot.empty) {
                    console.log(`[Reminders] No FCM tokens for user ${userId}, skipping.`);
                    continue;
                }

                // Send notification to each token
                for (const tokenDoc of tokensSnapshot.docs) {
                    const token = tokenDoc.id;
                    sendPromises.push(
                        sendReminderNotification(token, commitment.title, doc.ref, todayDate)
                    );
                }
            }

            await Promise.allSettled(sendPromises);
            console.log(`[Reminders] Processed ${sendPromises.length} notification(s).`);

            return;
        } catch (error) {
            console.error('[Reminders] Error processing reminders:', error);
            throw error;
        }
    }
);

/**
 * Send a single FCM notification for a commitment reminder.
 * 
 * Notification Copy (per DESIGN_PHILOSOPHY.md):
 * - Title: Just the commitment title (no prefix)
 * - Body: Empty or minimal - the title IS the message
 */
async function sendReminderNotification(
    token: string,
    title: string,
    commitmentRef: DocumentReference,
    todayDate: string
): Promise<void> {
    // FCM message - minimal, calm, direct
    const message: Message = {
        token,
        notification: {
            title: title,  // Just the commitment. No "Reminder:" prefix.
            body: undefined // No body - the title says it all
        },
        webpush: {
            notification: {
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                requireInteraction: false,
                silent: false
            },
            fcmOptions: {
                link: '/commitments' // Open commitments page when tapped
            }
        },
        // For iOS/Android native apps (future)
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                    badge: 1
                }
            }
        },
        android: {
            priority: 'high',
            notification: {
                sound: 'default',
                channelId: 'reminders'
            }
        }
    };

    try {
        await getMessaging().send(message);
        console.log(`[Reminders] Sent notification to token: ${token.substring(0, 10)}...`);

        // Mark as notified today to prevent duplicates
        await commitmentRef.update({
            lastReminderSent: todayDate
        });
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        // Handle stale tokens
        if (err.code === 'messaging/registration-token-not-registered' ||
            err.code === 'messaging/invalid-registration-token') {
            console.warn(`[Reminders] Removing stale token: ${token.substring(0, 10)}...`);
            // Token is invalid, could delete it here if needed
        } else {
            console.error(`[Reminders] Failed to send to ${token.substring(0, 10)}...:`, err.message);
        }
    }
}
