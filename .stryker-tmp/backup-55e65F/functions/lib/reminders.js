"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processReminders = void 0;
const messaging_1 = require("firebase-admin/messaging");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const date_fns_1 = require("date-fns");
const config_1 = require("./config");
/**
 * Scheduled function: runs every 5 minutes
 * Queries commitments with reminders in the current time window and sends push notifications.
 */
exports.processReminders = (0, scheduler_1.onSchedule)({ schedule: 'every 1 minutes', timeZone: 'Africa/Lagos' }, async () => {
    const now = new Date();
    const currentTime = (0, date_fns_1.format)(now, 'HH:mm');
    const todayDate = (0, date_fns_1.format)(now, 'yyyy-MM-dd');
    console.log(`[Reminders] Processing reminders for ${currentTime} on ${todayDate}`);
    try {
        // Query all incomplete commitments with reminderTime matching current window
        // Note: This is a collection group query across all users
        const snapshot = await config_1.db.collectionGroup('commitments')
            .where('reminderTime', '==', currentTime)
            .where('completed', '==', false)
            .get();
        if (snapshot.empty) {
            console.log('[Reminders] No reminders due at this time.');
            return;
        }
        console.log(`[Reminders] Found ${snapshot.size} commitments with reminders.`);
        const sendPromises = [];
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
            const tokensSnapshot = await config_1.db
                .collection('artifacts')
                .doc(config_1.APP_ID)
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
                sendPromises.push(sendReminderNotification(token, commitment.title, doc.ref, todayDate));
            }
        }
        await Promise.allSettled(sendPromises);
        console.log(`[Reminders] Processed ${sendPromises.length} notification(s).`);
        return;
    }
    catch (error) {
        console.error('[Reminders] Error processing reminders:', error);
        throw error;
    }
});
/**
 * Send a single FCM notification for a commitment reminder.
 *
 * Notification Copy (per DESIGN_PHILOSOPHY.md):
 * - Title: Just the commitment title (no prefix)
 * - Body: Empty or minimal - the title IS the message
 */
async function sendReminderNotification(token, title, commitmentRef, todayDate) {
    // FCM message - minimal, calm, direct
    const message = {
        token,
        notification: {
            title: title, // Just the commitment. No "Reminder:" prefix.
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
        await (0, messaging_1.getMessaging)().send(message);
        console.log(`[Reminders] Sent notification to token: ${token.substring(0, 10)}...`);
        // Mark as notified today to prevent duplicates
        await commitmentRef.update({
            lastReminderSent: todayDate
        });
    }
    catch (error) {
        const err = error;
        // Handle stale tokens
        if (err.code === 'messaging/registration-token-not-registered' ||
            err.code === 'messaging/invalid-registration-token') {
            console.warn(`[Reminders] Removing stale token: ${token.substring(0, 10)}...`);
            // Token is invalid, could delete it here if needed
        }
        else {
            console.error(`[Reminders] Failed to send to ${token.substring(0, 10)}...:`, err.message);
        }
    }
}
//# sourceMappingURL=reminders.js.map