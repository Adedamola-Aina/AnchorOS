import type { AnchorTask, AnchorTransaction, RecurringTransaction } from '../../types';
import type { DailyBriefing, TodayStats, UpcomingItem } from '../../types/fabricBriefing';
import { detectPrimaryCurrency, getDateRange, toDate, withinRange } from './fabricUtils';

/** Day-name letters matching AnchorTask.daysOfWeek (Sun=0…Sat=6). */
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

/** Returns commitments that are scheduled for `now` (daily, relevant weekly, todo). */
function getTodayTasks(commitments: AnchorTask[], now: Date): AnchorTask[] {
  const dayIdx = now.getDay();
  const dayLetter = DAY_LETTERS[dayIdx];

  return commitments.filter((task) => {
    if (task.type === 'daily') return true;
    if (task.type === 'todo') return true; // show all outstanding todos
    if (task.type === 'weekly') {
      // daysOfWeek is an array like ['M','T','F'] – match on letter
      return task.daysOfWeek?.includes(dayLetter) ?? false;
    }
    if (task.type === 'monthly') {
      const dom = now.getDate();
      if (task.daysOfMonth?.length) return task.daysOfMonth.includes(dom);
      if (task.dayOfMonth) return task.dayOfMonth === dom;
    }
    return false;
  });
}

/** Returns upcoming recurring transactions within the next `windowDays` days. */
function getUpcomingItems(
  recurring: RecurringTransaction[],
  now: Date,
  windowDays = 7,
): UpcomingItem[] {
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  const cutoff = new Date(todayMidnight);
  cutoff.setDate(cutoff.getDate() + windowDays);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  return recurring
    .filter((r) => r.status === 'active')
    .reduce<UpcomingItem[]>((acc, r) => {
      const due = toDate(r.nextRunAt);
      if (!due || due > cutoff) return acc;

      const dueMidnight = new Date(due);
      dueMidnight.setHours(0, 0, 0, 0);
      const daysUntil = Math.round((dueMidnight.getTime() - todayMidnight.getTime()) / MS_PER_DAY);
      if (daysUntil < 0) return acc; // already passed

      acc.push({
        id: r.id,
        type: 'bill',
        title: r.title,
        dueDate: r.nextRunAt,
        amountCents: r.amountCents,
        currency: undefined,
        category: r.category,
        isToday: daysUntil === 0,
        isTomorrow: daysUntil === 1,
        daysUntil,
      });
      return acc;
    }, [])
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

function buildSubtitle(todayStats: TodayStats, upcoming: UpcomingItem[]): string {
  const parts: string[] = [];

  if (todayStats.totalTasks > 0) {
    if (todayStats.pendingTasks === 0) {
      parts.push('All tasks done today');
    } else {
      parts.push(`${todayStats.pendingTasks} task${todayStats.pendingTasks === 1 ? '' : 's'} remaining`);
    }
  }

  if (todayStats.streakHighlight) {
    parts.push(`${todayStats.streakHighlight.days}-day streak`);
  }

  const nextBill = upcoming.at(0);
  if (nextBill) {
    const when = nextBill.isToday ? 'today' : nextBill.isTomorrow ? 'tomorrow' : `in ${nextBill.daysUntil}d`;
    parts.push(`${nextBill.title} due ${when}`);
  }

  return parts.join(' · ') || 'Your personal AI companion';
}

export function buildDailyBriefing(
  timeOfDay: string,
  transactions: AnchorTransaction[],
  commitments: AnchorTask[],
  recurring: RecurringTransaction[],
  now: Date,
): DailyBriefing {
  const currency = detectPrimaryCurrency(transactions);

  // Greeting
  const greetingMap: Record<string, string> = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  };
  const greeting = greetingMap[timeOfDay] ?? 'Hello';

  // Today's tasks
  const todayTasks = getTodayTasks(commitments, now);
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const pendingTasks = todayTasks.length - completedTasks;

  // Best active streak (>= 3 days)
  const streakTask = commitments.reduce<AnchorTask | null>((best, t) => {
    const s = t.currentStreak ?? 0;
    if (s < 3) return best;
    return !best || s > (best.currentStreak ?? 0) ? t : best;
  }, null);

  const todayStats: TodayStats = {
    totalTasks: todayTasks.length,
    completedTasks,
    pendingTasks,
    streakHighlight: streakTask
      ? { title: streakTask.title, days: streakTask.currentStreak! }
      : undefined,
  };

  // Upcoming bills/recurring
  const upcoming = getUpcomingItems(recurring, now);

  // This week's spending
  const { start: weekStart, end: weekEnd } = getDateRange('this_week', now);
  const spendingThisWeek = transactions
    .filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, weekStart, weekEnd))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const subtitle = buildSubtitle(todayStats, upcoming);

  return {
    greeting,
    subtitle,
    todayStats,
    upcoming,
    spendingThisWeek,
    currency,
    generatedAt: now.toISOString(),
  };
}

/** Exported for QueryEngine use. */
export { getUpcomingItems, getTodayTasks };
