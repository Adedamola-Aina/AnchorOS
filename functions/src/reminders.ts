// @ts-nocheck
import { randomUUID } from 'node:crypto';
import { type DocumentReference } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { format } from 'date-fns';
import { db, APP_ID } from './config';
import { shouldSendReminderForCategory, type NotificationPreferences } from './reminderPreferences';
import { buildReminderMessage } from './reminderBatching';
import { buildReminderDeliveryKey, shouldSkipReminderDelivery } from './reminderDedupe';
import { sendReminderNotification } from './reminderSender';
import { getReminderLinkPath, type ReminderCategory } from './reminderRouting';
import { claimReminderDeliverySlot, releaseReminderDeliverySlot } from './reminderClaim';

interface PendingReminder {
    title: string;
    ref: DocumentReference;
    category: ReminderCategory;
}
interface ReminderDeliveryState {
    key?: string;
    sentAt?: string;
    userRef: DocumentReference;
}

export const processReminders = onSchedule(
    { schedule: 'every 1 minutes', timeZone: 'Africa/Lagos' },
    async () => {
        const now = new Date();
        const runId = randomUUID();
        const nowMs = now.getTime();
        const sentAt = now.toISOString();
        const currentTime = format(now, 'HH:mm');
        const todayDate = format(now, 'yyyy-MM-dd');

        console.log(`[Reminders] Processing reminders for ${currentTime} on ${todayDate}`);

        try {
            const snapshot = await db.collectionGroup('commitments')
                .where('reminderTime', '==', currentTime)
                .where('completed', '==', false)
                .get();

            if (snapshot.empty) {
                console.log('[Reminders] No reminders due at this time.');
                return;
            }

            console.log(`[Reminders] Found ${snapshot.size} commitments with reminders.`);

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
                    console.log(`[Reminders] Already notified for ${doc.id} today, skipping.`);
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
                    console.log(`[Reminders] No FCM tokens for user ${userId}, skipping.`);
                    continue;
                }

                const pending = remindersByUser.get(userId) || [];
                pending.push({ title: commitment.title, ref: doc.ref, category: 'commitments' });
                remindersByUser.set(userId, pending);
            }

            let deliveryCount = 0;

            for (const [userId, reminders] of remindersByUser.entries()) {
                const tokenDocs = tokenCache.get(userId) || [];
                const deliveryState = deliveryStateCache.get(userId);
                if (tokenDocs.length === 0 || !deliveryState) {
                    continue;
                }

                const dedupeKey = buildReminderDeliveryKey(
                    todayDate,
                    currentTime,
                    reminders.map((reminder) => reminder.title),
                );

                if (shouldSkipReminderDelivery({
                    previousKey: deliveryState.key,
                    previousSentAt: deliveryState.sentAt,
                    currentKey: dedupeKey,
                    nowMs,
                })) {
                    console.log(`[Reminders] Skipping duplicate reminder batch for user ${userId}.`);
                    continue;
                }

                const hasClaim = await claimReminderDeliverySlot({
                    userId,
                    dedupeKey,
                    runId,
                    nowMs,
                });

                if (!hasClaim) {
                    console.log(`[Reminders] Another run already claimed batch for user ${userId}.`);
                    continue;
                }

                try {
                    const message = buildReminderMessage(reminders.map((reminder) => reminder.title));
                    const linkPath = getReminderLinkPath(reminders.map((reminder) => reminder.category));

                    const sendResults = await Promise.allSettled(
                        tokenDocs.map((tokenDoc) =>
                            sendReminderNotification({
                                token: tokenDoc.id,
                                title: message.title,
                                body: message.body,
                                tokenDocRef: tokenDoc.ref,
                                linkPath,
                            })
                        )
                    );

                    const hasAnySuccess = sendResults.some(
                        (result) => result.status === 'fulfilled' && result.value === true
                    );
                    if (!hasAnySuccess) {
                        continue;
                    }

                    await deliveryState.userRef.set({
                        lastReminderDeliveryKey: dedupeKey,
                        lastReminderDeliveryAt: sentAt,
                    }, { merge: true });

                    deliveryStateCache.set(userId, { ...deliveryState, key: dedupeKey, sentAt });
                    await Promise.all(reminders.map((reminder) => reminder.ref.update({ lastReminderSent: todayDate })));
                    deliveryCount += tokenDocs.length;
                } finally {
                    await releaseReminderDeliverySlot({
                        userId,
                        dedupeKey,
                        runId,
                    }).catch((error) => {
                        console.error(`[Reminders] Failed to release claim for user ${userId}:`, error);
                    });
                }
            }

            console.log(`[Reminders] Processed ${deliveryCount} notification delivery attempt(s).`);
            return;
        } catch (error) {
            console.error('[Reminders] Error processing reminders:', error);
            throw error;
        }
    }
);
