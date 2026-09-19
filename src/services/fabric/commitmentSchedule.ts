import type { AnchorTask } from '../../types';

/**
 * Schedule model for commitments — ONE source of truth (UX-AI-06 / P1b).
 *
 * ROOT CAUSE this fixes: the assistant only counted commitments whose cadence
 * *matched today*, so on a non-scheduled day it stated "No tasks scheduled
 * today" while the Commitments page still showed outstanding work, and the nav
 * badge silently read 0. Both surfaces (and the badge) now derive "today" from
 * this module, so the assistant can never disagree with the page again.
 *
 * Semantics:
 *   - "Today" = scheduled today OR overdue (outstanding, past its most recent
 *     scheduled day). Work is never invisible while it is owed.
 *   - A weekly/monthly commitment with no day configured is available every day
 *     of its period rather than never scheduled at all.
 *   - A to-do counts while incomplete, plus on the day it was completed, so the
 *     "all done" state is reachable and stale completed to-dos stop inflating
 *     the denominator.
 *   - A completed commitment never counts as overdue (no guilt for old work).
 */

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Weekly/monthly scan bound; a month is the longest cadence period. */
const MAX_LOOKBACK_DAYS = 31;
/** Forward scan bound for "next up" (covers a yearly leap). */
const MAX_LOOKAHEAD_DAYS = 366;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date: Date, amount: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function completedOn(task: AnchorTask, date: Date): boolean {
  if (!task.completed || !task.lastCompletedAt) return false;
  const done = new Date(task.lastCompletedAt);
  return !Number.isNaN(done.getTime()) && isSameDay(done, date);
}

/** True when the commitment has a scheduled occurrence on `date`. */
export function isScheduledOn(task: AnchorTask, date: Date): boolean {
  switch (task.type) {
    case 'daily':
      return true;
    case 'todo':
      return !task.completed || completedOn(task, date);
    case 'weekly':
      if (!task.daysOfWeek?.length) return true;
      return task.daysOfWeek.includes(DAY_LETTERS[date.getDay()]);
    case 'monthly': {
      const dayOfMonthNow = date.getDate();
      if (task.daysOfMonth?.length) return task.daysOfMonth.includes(dayOfMonthNow);
      if (task.dayOfMonth) return task.dayOfMonth === dayOfMonthNow;
      return true;
    }
    default:
      return false;
  }
}

/** Most recent scheduled day strictly before `today`, or null. */
export function lastScheduledBefore(task: AnchorTask, today: Date): Date | null {
  const start = startOfDay(today);
  for (let offset = 1; offset <= MAX_LOOKBACK_DAYS; offset += 1) {
    const candidate = addDays(start, -offset);
    if (isScheduledOn(task, candidate)) return candidate;
  }
  return null;
}

/**
 * Outstanding, not scheduled today, but with a scheduled day in the past —
 * i.e. work carried over from an earlier day. Completed commitments are never
 * overdue, and anything due today is "today", not "overdue".
 */
export function isOverdue(task: AnchorTask, now: Date): boolean {
  if (task.completed) return false;
  if (isScheduledOn(task, now)) return false;
  return lastScheduledBefore(task, now) !== null;
}

/** Next scheduled day on/after `now`, or null when it never recurs again. */
export function nextScheduledOnOrAfter(task: AnchorTask, now: Date): Date | null {
  const start = startOfDay(now);
  for (let offset = 0; offset <= MAX_LOOKAHEAD_DAYS; offset += 1) {
    const candidate = addDays(start, offset);
    if (isScheduledOn(task, candidate)) return candidate;
  }
  return null;
}

/**
 * Everything the user owes attention to today: scheduled today, or overdue.
 * This is the single definition of "today" used by the assistant, the badge and
 * the Today card.
 */
export function getDueToday(commitments: AnchorTask[], now: Date): AnchorTask[] {
  return commitments.filter((task) => isScheduledOn(task, now) || isOverdue(task, now));
}

/**
 * Deterministic label for the next due day ("today", "tomorrow", "Mon", …).
 * Locale-free so tests and the UI agree everywhere.
 */
export function describeNextDue(next: Date, now: Date): string {
  const days = Math.round((startOfDay(next).getTime() - startOfDay(now).getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days < 7) return WEEKDAY_LABELS[next.getDay()];
  return `${next.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][next.getMonth()]}`;
}

/** Earliest future occurrence across the outstanding commitments, or null. */
export function getNextDue(commitments: AnchorTask[], now: Date): Date | null {
  let best: Date | null = null;
  for (const task of commitments) {
    if (task.completed) continue;
    const next = nextScheduledOnOrAfter(task, now);
    if (next && (!best || next.getTime() < best.getTime())) best = next;
  }
  return best;
}
