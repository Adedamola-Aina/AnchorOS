import { FieldValue } from 'firebase-admin/firestore';
import { format } from 'date-fns';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db, APP_ID } from './config';
import { shouldSendReminderForCategory, type NotificationPreferences } from './reminderPreferences';
import { sendReminderNotification } from './reminderSender';
import { getReminderLinkPath, type ReminderCategory } from './reminderRouting';

type NudgeType = 'streak' | 'budget' | 'surplus';
type TaskLike = { title?: unknown; type?: unknown; completed?: unknown; currentStreak?: unknown };
type TransactionLike = { date?: unknown; type?: unknown; amountCents?: unknown };

interface SendNudgeInput {
  userRef: FirebaseFirestore.DocumentReference;
  title: string;
  body: string;
  category: ReminderCategory;
  logDocId: string;
  logField: 'streak' | 'budget_mid_month' | 'surplus';
  nudgeType: NudgeType;
  currentTime: string;
  nowIso: string;
  monthKey: string;
}

export function formatCurrency(cents: number): string {
  return `₦${(cents / 100).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

export function isLastDayOfMonth(now: Date): boolean {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return tomorrow.getMonth() !== now.getMonth();
}

export function pickTopStreakTask(tasks: TaskLike[]): { title: string; currentStreak: number } | null {
  let top: { title: string; currentStreak: number } | null = null;
  for (const task of tasks) {
    if (task.type !== 'daily' || task.completed !== false) continue;
    const streak = typeof task.currentStreak === 'number' ? task.currentStreak : 0;
    if (streak < 3) continue;
    const title = typeof task.title === 'string' ? task.title : 'Daily task';
    if (!top || streak > top.currentStreak) top = { title, currentStreak: streak };
  }
  return top;
}

export function sumMonthlyTotals(transactions: TransactionLike[], start: Date, endExclusive: Date): { income: number; expense: number } {
  let income = 0;
  let expense = 0;
  for (const tx of transactions) {
    if (typeof tx.date !== 'string') continue;
    const txDate = new Date(tx.date);
    if (Number.isNaN(txDate.getTime()) || txDate < start || txDate >= endExclusive) continue;
    const amount = typeof tx.amountCents === 'number' ? tx.amountCents : 0;
    if (tx.type === 'income') income += amount;
    if (tx.type === 'expense') expense += amount;
  }
  return { income, expense };
}

async function getFabricEnabledUsers(): Promise<FirebaseFirestore.DocumentReference[]> {
  const usersRef = db.collection('artifacts').doc(APP_ID).collection('users');
  const usersSnap = await usersRef.get();
  const enabled: FirebaseFirestore.DocumentReference[] = [];
  for (const userDoc of usersSnap.docs) {
    const userRef = usersRef.doc(userDoc.id);
    const settingsDoc = await userRef.collection('fabric_settings').doc('state').get();
    if (settingsDoc.exists && settingsDoc.data()?.enabled === true) enabled.push(userRef);
  }
  return enabled;
}

async function sendNudge(input: SendNudgeInput): Promise<void> {
  const userDoc = await input.userRef.get();
  const prefs = userDoc.data()?.notificationPreferences as NotificationPreferences | undefined;
  if (!shouldSendReminderForCategory(prefs, input.category, input.currentTime)) return;

  const logRef = input.userRef.collection('fabric_nudge_log').doc(input.logDocId);
  const logDoc = await logRef.get();
  if (logDoc.data()?.[input.logField] === true) return;

  const tokensSnap = await input.userRef.collection('fcmTokens').get();
  if (tokensSnap.empty) return;

  const linkPath = getReminderLinkPath([input.category]);
  const sendResults = await Promise.allSettled(tokensSnap.docs.map((tokenDoc) => sendReminderNotification({
    token: tokenDoc.id,
    title: input.title,
    body: input.body,
    linkPath,
    tokenDocRef: tokenDoc.ref,
  })));

  const hasAnySuccess = sendResults.some((r) => r.status === 'fulfilled' && r.value === true);
  if (!hasAnySuccess) return;

  await logRef.set({ [input.logField]: true, sentAt: input.nowIso }, { merge: true });
  await input.userRef.collection('fabric_analytics').doc(input.monthKey).set({
    fabric_nudge_received: FieldValue.arrayUnion({ nudge_type: input.nudgeType, sentAt: input.nowIso }),
  }, { merge: true });
}

export const fabricStreakNudge = onSchedule(
  { schedule: 'every day 20:00', timeZone: 'Africa/Lagos' },
  async () => {
    const now = new Date();
    const nowIso = now.toISOString();
    const currentTime = format(now, 'HH:mm');
    const todayKey = format(now, 'yyyy-MM-dd');
    const monthKey = format(now, 'yyyy-MM');

    for (const userRef of await getFabricEnabledUsers()) {
      const cmtSnap = await userRef.collection('commitments').where('type', '==', 'daily').get();
      const top = pickTopStreakTask(cmtSnap.docs.map((doc) => doc.data() as TaskLike));
      if (!top) continue;
      await sendNudge({
        userRef,
        title: 'Streak alert',
        body: `"${top.title}" streak is at ${top.currentStreak} days - complete before midnight.`,
        category: 'commitments',
        logDocId: todayKey,
        logField: 'streak',
        nudgeType: 'streak',
        currentTime,
        nowIso,
        monthKey,
      });
    }
  },
);

export const fabricBudgetNudge = onSchedule(
  { schedule: '0 10 14 * *', timeZone: 'Africa/Lagos' },
  async () => {
    const now = new Date();
    const nowIso = now.toISOString();
    const currentTime = format(now, 'HH:mm');
    const monthKey = format(now, 'yyyy-MM');
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    for (const userRef of await getFabricEnabledUsers()) {
      const txSnap = await userRef.collection('finance').get();
      const transactions = txSnap.docs.map((doc) => doc.data() as TransactionLike);
      const currentExpense = sumMonthlyTotals(transactions, currentStart, nextStart).expense;
      const previousExpense = sumMonthlyTotals(transactions, previousStart, currentStart).expense;
      if (previousExpense <= 0 || currentExpense < previousExpense * 1.2) continue;
      await sendNudge({
        userRef,
        title: 'Mid-month check',
        body: `Spending is ${Math.round(((currentExpense - previousExpense) / previousExpense) * 100)}% above last month with 2 weeks to go.`,
        category: 'finance',
        logDocId: monthKey,
        logField: 'budget_mid_month',
        nudgeType: 'budget',
        currentTime,
        nowIso,
        monthKey,
      });
    }
  },
);

export const fabricSurplusNudge = onSchedule(
  { schedule: '0 18 28-31 * *', timeZone: 'Africa/Lagos' },
  async () => {
    const now = new Date();
    if (!isLastDayOfMonth(now)) return;
    const nowIso = now.toISOString();
    const currentTime = format(now, 'HH:mm');
    const monthKey = format(now, 'yyyy-MM');
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    for (const userRef of await getFabricEnabledUsers()) {
      const txSnap = await userRef.collection('finance').get();
      const totals = sumMonthlyTotals(txSnap.docs.map((doc) => doc.data() as TransactionLike), currentStart, nextStart);
      const surplus = totals.income - totals.expense;
      if (surplus <= 0) continue;
      await sendNudge({
        userRef,
        title: 'Month-end surplus',
        body: `You have a ${formatCurrency(surplus)} surplus this month - consider moving it to savings.`,
        category: 'finance',
        logDocId: monthKey,
        logField: 'surplus',
        nudgeType: 'surplus',
        currentTime,
        nowIso,
        monthKey,
      });
    }
  },
);
