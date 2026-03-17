import { onSchedule } from 'firebase-functions/v2/scheduler';
export {
    LAGOS_TZ, lagosDateFmt, lagosTimeFmt, NudgeType, formatCurrency, getLagosClock,
    isLastDayOfMonth, pickTopStreakTask, sumMonthlyTotals, getFabricEnabledUsers, sendNudge,
} from './fabricNudgeHelpers';
import {
  formatCurrency,
  getLagosClock,
  getFabricEnabledUsers,
  isLastDayOfMonth,
  pickTopStreakTask,
  sendNudge,
  sumMonthlyTotals,
  type TaskLike,
  type TransactionLike,
} from './fabricNudgeHelpers';

export const fabricStreakNudge = onSchedule(
  { schedule: 'every day 20:00', timeZone: 'Africa/Lagos' },
  async () => {
    const now = new Date(); const nowIso = now.toISOString();
    const { currentTime, todayKey, monthKey } = getLagosClock(now);

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
    const now = new Date(); const nowIso = now.toISOString();
    const { currentTime, monthKey } = getLagosClock(now);
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
    const { currentTime, monthKey } = getLagosClock(now);
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
