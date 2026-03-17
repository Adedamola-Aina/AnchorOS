import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import { shouldSendReminderForCategory, type NotificationPreferences } from './reminderPreferences';
import { sendReminderNotification } from './reminderSender';
import { getReminderLinkPath, type ReminderCategory } from './reminderRouting';

export const LAGOS_TZ = 'Africa/Lagos';
const lagosDateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: LAGOS_TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const lagosTimeFmt = new Intl.DateTimeFormat('en-GB', { timeZone: LAGOS_TZ, hour: '2-digit', minute: '2-digit', hour12: false });

export type NudgeType = 'streak' | 'budget' | 'surplus';
export type TaskLike = { title?: unknown; type?: unknown; completed?: unknown; currentStreak?: unknown };
export type TransactionLike = { date?: unknown; type?: unknown; amountCents?: unknown };

export interface SendNudgeInput {
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

export function getLagosClock(now: Date): { currentTime: string; todayKey: string; monthKey: string } {
  const todayKey = lagosDateFmt.format(now);
  return { currentTime: lagosTimeFmt.format(now), todayKey, monthKey: todayKey.slice(0, 7) };
}

export function isLastDayOfMonth(now: Date): boolean {
  const todayMonth = getLagosClock(now).monthKey;
  return getLagosClock(new Date(now.getTime() + (24 * 60 * 60 * 1000))).monthKey !== todayMonth;
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

export async function getFabricEnabledUsers(): Promise<FirebaseFirestore.DocumentReference[]> {
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

export async function sendNudge(input: SendNudgeInput): Promise<void> {
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
