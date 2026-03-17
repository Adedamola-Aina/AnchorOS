import type { FabricQueryResult } from '../../../types';
import { detectPrimaryCurrency, formatCents, getDateRange, toDate } from '../fabricUtils';
import { buildDailyBriefing, getUpcomingItems } from '../DailyBriefingEngine';
import type { RunFabricQueryInput } from './types';

export function todayQuery(input: RunFabricQueryInput): FabricQueryResult {
  const briefing = buildDailyBriefing(
    'morning',
    input.transactions,
    input.commitments,
    input.recurring,
    input.now,
  );
  const { totalTasks, completedTasks, pendingTasks, streakHighlight } = briefing.todayStats;

  let summary: string;
  if (totalTasks === 0) {
    summary = 'No scheduled tasks today — a good day to rest or tackle something new.';
  } else if (pendingTasks === 0) {
    summary = `All ${totalTasks} tasks done for today — great work!`;
  } else {
    summary = `You have ${pendingTasks} task${pendingTasks === 1 ? '' : 's'} remaining today (${completedTasks}/${totalTasks} done).`;
  }

  const todayBills = briefing.upcoming.filter((u) => u.isToday);
  let detail: string | undefined;
  if (todayBills.length > 0) {
    detail = `Due today: ${todayBills.map((u) => u.title).join(', ')}.`;
  } else if (streakHighlight) {
    detail = `Keep your "${streakHighlight.title}" streak going — ${streakHighlight.days} days!`;
  }

  return {
    data: briefing.todayStats,
    summary,
    detail,
    visualizable: false,
    actions: [{ label: 'Open Commitments', type: 'navigate', payload: { page: 'commitments' } }],
  };
}

export function upcomingQuery(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const upcoming = getUpcomingItems(input.recurring, input.now);

  if (upcoming.length === 0) {
    return {
      data: [],
      summary: 'No upcoming bills or payments in the next 7 days.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const lines = upcoming.slice(0, 5).map((item) => {
    const when = item.isToday ? 'today' : item.isTomorrow ? 'tomorrow' : `in ${item.daysUntil} days`;
    const amount = item.amountCents ? ` — ${formatCents(item.amountCents, currency)}` : '';
    return `${item.title} (${when}${amount})`;
  });

  return {
    data: upcoming,
    summary: `${upcoming.length} upcoming payment${upcoming.length === 1 ? '' : 's'} in the next 7 days.`,
    detail: lines.join('\n'),
    visualizable: false,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

export function planWeek(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const { start: weekStart, end: weekEnd } = getDateRange('this_week', input.now);

  const weekTxns = input.transactions.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && d >= weekStart && d <= weekEnd && !tx.isSoftDeleted;
  });

  const spentCents = weekTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents, 0);
  const incomeCents = weekTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountCents, 0);

  const dailyTasks = input.commitments.filter((t) => t.type === 'daily');
  const completed = dailyTasks.filter((t) => t.completed).length;
  const rate = dailyTasks.length > 0 ? Math.round((completed / dailyTasks.length) * 100) : 0;

  const upcoming = getUpcomingItems(input.recurring, input.now);
  const upcomingThisWeek = upcoming.filter((u) => u.daysUntil <= 6);

  let summary = `This week: ${formatCents(spentCents, currency)} spent`;
  if (incomeCents > 0) summary += `, ${formatCents(incomeCents, currency)} earned`;
  summary += `. Daily habits: ${completed}/${dailyTasks.length} (${rate}%).`;

  const detail = upcomingThisWeek.length > 0
    ? `Coming up: ${upcomingThisWeek
        .map((u) => {
          const when = u.isToday ? 'today' : u.isTomorrow ? 'tomorrow' : `in ${u.daysUntil}d`;
          return `${u.title} (${when})`;
        })
        .join(', ')}.`
    : rate >= 80
      ? 'Great momentum — keep your streaks going through the week.'
      : 'Focus on building consistency with your daily habits this week.';

  return {
    data: { spentCents, incomeCents, completedTasks: completed, totalTasks: dailyTasks.length },
    summary,
    detail,
    visualizable: true,
    actions: [
      { label: 'View Commitments', type: 'navigate', payload: { page: 'commitments' } },
      { label: 'View Finance', type: 'navigate', payload: { page: 'finance' } },
    ],
  };
}
