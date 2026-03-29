import { logger } from 'firebase-functions';
import { randomUUID } from 'node:crypto';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { format } from 'date-fns';
import { db, APP_ID } from './config';
import { shouldSendReminderForCategory, type NotificationPreferences } from './reminderPreferences';
import {
    deliverUserReminders,
    type PendingReminder,
    type ReminderDeliveryState,
} from './reminderDelivery';

export const processReminders = onSchedule(
    { schedule: 'every 1 minutes', timeZone: 'Africa/Lagos' },
    async () => {
        const now = new Date();
        const runId = randomUUID();
        const nowMs = now.getTime();
        const sentAt = now.toISOString();
        const currentTime = format(now, 'HH:mm');
        const todayDate = format(now, 'yyyy-MM-dd');

        logger.info(`[Reminders] Processing reminders for ${currentTime} on ${todayDate}`);

        try {
            const snapshot = await db.collectionGroup('commitments')
                .where('reminderTime', '==', currentTime)
                .where('completed', '==', false)
                .get();

            if (snapshot.empty) {
                logger.info('[Reminders] No reminders due at this time.');
                return;
            }

            logger.info(`[Reminders] Found ${snapshot.size} commitments with reminders.`);

            const remindersByUser = new Map<string, PendingReminder[]>();
            const preferenceCache = new Map<string, boolean>();
            const tokenCache = new Map<string, FirebaseFirestore.QueryDocumentSnapshot[]>();
            const deliveryStateCache = new Map<string, ReminderDeliveryState>();

            for (const doc of snapshot.docs) {
                const commitment = doc.data();
                const userId = doc.ref.parent.parent?.id;

                if (!userId) {
                    console.warn('[Reminders] Could not determine userId for commitment:', doc.id);
                    continue;
                }

                if (commitment.lastReminderSent === todayDate) {
                    logger.info(`[Reminders] Already notified for ${doc.id} today, skipping.`);
                    continue;
                }

                let notificationsAllowed = preferenceCache.get(userId);
                if (notificationsAllowed === undefined) {
                    const userRef = db.collection('artifacts').doc(APP_ID)
                        .collection('users').doc(userId);
                    const userDoc = await userRef.get();

                    const prefs = userDoc.data()?.notificationPreferences as NotificationPreferences | undefined;
                    notificationsAllowed = shouldSendReminderForCategory(prefs, 'commitments', currentTime);
                    preferenceCache.set(userId, notificationsAllowed);

                    deliveryStateCache.set(userId, {
                        key: userDoc.data()?.lastReminderDeliveryKey,
                        sentAt: userDoc.data()?.lastReminderDeliveryAt,
                        userRef,
                    });
                }

                if (!notificationsAllowed) {
                    continue;
                }

                let tokenDocs = tokenCache.get(userId);
                if (!tokenDocs) {
                    const tokensSnapshot = await db
                        .collection('artifacts')
                        .doc(APP_ID)
                        .collection('users')
                        .doc(userId)
                        .collection('fcmTokens')
                        .get();

                    tokenDocs = tokensSnapshot.docs;
                    tokenCache.set(userId, tokenDocs);
                }

                if (tokenDocs.length === 0) {
                    logger.info(`[Reminders] No FCM tokens for user ${userId}, skipping.`);
                    continue;
                }

                const pending = remindersByUser.get(userId) || [];
                pending.push({ title: commitment.title, ref: doc.ref, category: 'commitments' });
                remindersByUser.set(userId, pending);
            }

            const deliveryCount = await deliverUserReminders(
                remindersByUser,
                tokenCache,
                deliveryStateCache,
                { todayDate, currentTime, nowMs, sentAt, runId },
            );

            logger.info(`[Reminders] Processed ${deliveryCount} notification delivery attempt(s).`);
            return;
        } catch (error) {
            console.error('[Reminders] Error processing reminders:', error);
            throw error;
        }
    }
);
