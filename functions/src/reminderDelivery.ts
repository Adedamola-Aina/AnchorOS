import { logger } from 'firebase-functions';
import type { DocumentReference } from 'firebase-admin/firestore';
import { buildReminderDeliveryKey, shouldSkipReminderDelivery } from './reminderDedupe';
import { claimReminderDeliverySlot, releaseReminderDeliverySlot } from './reminderClaim';
import { buildReminderMessage } from './reminderBatching';
import { getReminderLinkPath, type ReminderCategory } from './reminderRouting';
import { sendReminderNotification } from './reminderSender';

export interface PendingReminder {
    title: string;
    ref: DocumentReference;
    category: ReminderCategory;
}

export interface ReminderDeliveryState {
    key?: string;
    sentAt?: string;
    userRef: DocumentReference;
}

export async function deliverUserReminders(
    remindersByUser: Map<string, PendingReminder[]>,
    tokenCache: Map<string, FirebaseFirestore.QueryDocumentSnapshot[]>,
    deliveryStateCache: Map<string, ReminderDeliveryState>,
    opts: { todayDate: string; currentTime: string; nowMs: number; sentAt: string; runId: string },
): Promise<number> {
    let deliveryCount = 0;
    const { todayDate, currentTime, nowMs, sentAt, runId } = opts;

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
            logger.info(`[Reminders] Skipping duplicate reminder batch for user ${userId}.`);
            continue;
        }

        const hasClaim = await claimReminderDeliverySlot({
            userId,
            dedupeKey,
            runId,
            nowMs,
        });

        if (!hasClaim) {
            logger.info(`[Reminders] Another run already claimed batch for user ${userId}.`);
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

    return deliveryCount;
}
