import { onSchedule } from 'firebase-functions/v2/scheduler';
import { format, subDays } from 'date-fns';
import { db, APP_ID } from './config';
import { shouldSendReminderForCategory } from './reminderPreferences';
import { sendReminderNotification } from './reminderSender';
import { getReminderLinkPath } from './reminderRouting';
import type { NotificationPreferences } from './reminderPreferences';

interface WeeklyReportData {
  totalExpensesCents: number;
  completionRate: number;
  topCategory: string | null;
  upcomingBills: number;
  generatedAt: string;
  weekKey: string;
}

function formatCurrency(cents: number): string {
  const naira = Math.round(cents / 100);
  return `₦${naira.toLocaleString()}`;
}

/**
 * Scheduled Cloud Function: runs every Sunday at 19:00 Africa/Lagos.
 * Generates weekly summary reports for Fabric-enabled users and
 * sends a push notification with the highlights.
 */
export const generateWeeklyReport = onSchedule(
  { schedule: 'every sunday 19:00', timeZone: 'Africa/Lagos' },
  async () => {
    const now = new Date();
    const weekKey = format(now, 'yyyy-MM-dd');
    const currentTime = format(now, 'HH:mm');
    const sevenDaysAgo = subDays(now, 7);
    const sevenDaysAgoIso = sevenDaysAgo.toISOString();
    const nowIso = now.toISOString();
    const sevenDaysFromNow = subDays(now, -7);

    const usersRef = db.collection('artifacts').doc(APP_ID).collection('users');
    const usersSnap = await usersRef.get();

    if (usersSnap.empty) return;

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userRef = usersRef.doc(userId);

      // 1. Check fabric_settings enabled
      const settingsDoc = await userRef.collection('fabric_settings').doc('state').get();
      if (!settingsDoc.exists || !settingsDoc.data()?.enabled) continue;

      // 2. Idempotency: skip if report already exists for this weekKey
      const existingReport = await userRef.collection('fabric_reports').doc(weekKey).get();
      if (existingReport.exists) continue;

      // 3. Load transactions from last 7 days
      const txSnap = await userRef.collection('finance')
        .where('date', '>=', sevenDaysAgoIso)
        .where('date', '<=', nowIso)
        .get();

      const expenses: Array<{ amountCents: number; category: string }> = [];
      for (const txDoc of txSnap.docs) {
        const tx = txDoc.data();
        if (tx.type === 'expense') {
          expenses.push({ amountCents: tx.amountCents ?? 0, category: tx.category ?? 'Other' });
        }
      }

      const totalExpensesCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);

      // Top spending category
      const categoryTotals = new Map<string, number>();
      for (const e of expenses) {
        categoryTotals.set(e.category, (categoryTotals.get(e.category) ?? 0) + e.amountCents);
      }
      let topCategory: string | null = null;
      let topAmount = 0;
      for (const [cat, amt] of categoryTotals) {
        if (amt > topAmount) {
          topCategory = cat;
          topAmount = amt;
        }
      }

      // 4. Commitment completion rate
      const cmtSnap = await userRef.collection('commitments').get();
      let totalCommitments = 0;
      let completedCommitments = 0;
      for (const cmtDoc of cmtSnap.docs) {
        totalCommitments++;
        if (cmtDoc.data().completed) completedCommitments++;
      }
      const completionRate = totalCommitments > 0
        ? Math.round((completedCommitments / totalCommitments) * 100)
        : 0;

      // 5. Upcoming bills in next 7 days
      const recurringRef = db.collection('artifacts').doc(APP_ID).collection('recurring_transactions');
      const recurringSnap = await recurringRef
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .get();

      let upcomingBills = 0;
      for (const rtDoc of recurringSnap.docs) {
        const rt = rtDoc.data();
        const nextRunAt = typeof rt.nextRunAt === 'string' ? new Date(rt.nextRunAt) : null;
        if (
          rt.type === 'expense' &&
          nextRunAt &&
          !Number.isNaN(nextRunAt.getTime()) &&
          nextRunAt >= now &&
          nextRunAt <= sevenDaysFromNow
        ) {
          upcomingBills++;
        }
      }

      // 6. Persist report
      const report: WeeklyReportData = {
        totalExpensesCents,
        completionRate,
        topCategory,
        upcomingBills,
        generatedAt: now.toISOString(),
        weekKey,
      };

      const batch = db.batch();
      const reportRef = userRef.collection('fabric_reports').doc(weekKey);
      batch.set(reportRef, report);
      await batch.commit();

      // 7. Check notification preferences
      const userDataDoc = await userRef.get();
      const prefs = userDataDoc.data()?.notificationPreferences as NotificationPreferences | undefined;
      if (!shouldSendReminderForCategory(prefs, 'finance', currentTime)) continue;

      // 8. Get FCM tokens
      const tokensSnap = await userRef.collection('fcmTokens').get();
      if (tokensSnap.empty) continue;

      // 9. Send notification
      const body = `${formatCurrency(totalExpensesCents)} spent · ${completionRate}% habits complete · Review ready`;
      const linkPath = getReminderLinkPath(['finance']);

      for (const tokenDoc of tokensSnap.docs) {
        await sendReminderNotification({
          token: tokenDoc.id,
          title: 'Your week in review',
          body,
          linkPath,
          tokenDocRef: tokenDoc.ref,
        });
      }
    }
  }
);
