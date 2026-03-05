import { onSchedule } from 'firebase-functions/v2/scheduler';
import { format } from 'date-fns';
import { db, APP_ID } from './config';
import { shouldSendReminderForCategory } from './reminderPreferences';
import { sendReminderNotification } from './reminderSender';
import { getBillsDueSoon, buildBillReminderMessage, shouldSendBillReminder } from './billReminders';
import { getReminderLinkPath } from './reminderRouting';
import type { RecurringTransaction } from './types';
import type { NotificationPreferences } from './reminderPreferences';

/**
 * Scheduled Cloud Function: runs daily at 09:00 Africa/Lagos.
 * Checks recurring expense rules due within 24h and sends FCM reminders.
 */
export const processBillReminders = onSchedule(
    { schedule: 'every day 09:00', timeZone: 'Africa/Lagos' },
    async () => {
        const now = new Date();
        const todayDate = format(now, 'yyyy-MM-dd');

        const recurringRef = db.collection('artifacts').doc(APP_ID).collection('recurring_transactions');
        const snapshot = await recurringRef.where('status', '==', 'active').get();

        if (snapshot.empty) return;

        const allRules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as RecurringTransaction);
        const dueSoon = getBillsDueSoon(allRules, now);

        if (dueSoon.length === 0) return;

        // Group by user
        const byUser = new Map<string, RecurringTransaction[]>();
        for (const rule of dueSoon) {
            const list = byUser.get(rule.userId) || [];
            list.push(rule);
            byUser.set(rule.userId, list);
        }

        for (const [userId, bills] of byUser.entries()) {
            // Filter bills that haven't been reminded today
            const unremindered = bills.filter(b =>
                shouldSendBillReminder(b.id, b.lastRunAt, todayDate)
            );
            if (unremindered.length === 0) continue;

            // Check notification preferences
            const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId);
            const userDoc = await userRef.get();
            const prefs = userDoc.data()?.notificationPreferences as NotificationPreferences | undefined;
            if (!shouldSendReminderForCategory(prefs, 'finance', format(now, 'HH:mm'))) continue;

            // Get FCM tokens
            const tokensSnap = await userRef.collection('fcmTokens').get();
            if (tokensSnap.empty) continue;

            const msg = buildBillReminderMessage(unremindered);
            const linkPath = getReminderLinkPath(['finance']);

            for (const tokenDoc of tokensSnap.docs) {
                await sendReminderNotification({
                    token: tokenDoc.id,
                    title: msg.title,
                    body: msg.body,
                    linkPath,
                    tokenDocRef: tokenDoc.ref,
                });
            }

            // Mark bills as reminded today
            const batch = db.batch();
            for (const rule of unremindered) {
                const ruleRef = recurringRef.doc(rule.id);
                batch.update(ruleRef, { lastBillReminderSent: todayDate });
            }
            await batch.commit();
        }
    }
);
