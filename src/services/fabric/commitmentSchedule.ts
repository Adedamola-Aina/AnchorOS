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

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAY_FULL_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
/**
 * Two-letter labels. A single letter cannot distinguish Tuesday from Thursday or
 * Saturday from Sunday — the visual half of the CM-18 collision.
 */
export const WEEKDAY_COMPACT_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/**
 * CM-18 — the day-letter collision, and the worse bug behind it.
 *
 * `daysOfWeek` used to be stored as single letters ('S','M','T','W','T','F','S'),
 * so `T` meant Tuesday AND Thursday and `S` meant Saturday AND Sunday: a
 * commitment that fires on the wrong day. Worse, the composer stored FULL day
 * names ('Monday') while this module compared letters, so a weekly commitment
 * created in the UI matched *nothing* — the Commitments page listed it as due
 * (WeeklyView compares names) while the assistant, the badge and the Today card
 * saw no scheduled day at all. That is the UX-AI-06 disagreement again.
 *
 * The canonical form is now a weekday index (0 = Sunday … 6 = Saturday).
 * Everything else is parsed here, tolerantly, so no consumer has to guess:
 *   - an ambiguous legacy letter expands to the days it already matched
 *     ('T' → [2, 4], 'S' → [0, 6]) so nothing silently stops firing;
 *   - full and short names both resolve ('Monday', 'mon', 'MONDAY').
 */
const LETTER_TO_INDEXES: Record<string, number[]> = {
    S: [0, 6], M: [1], T: [2, 4], W: [3], F: [5],
};

const NAME_TO_INDEX = new Map<string, number>();
WEEKDAY_FULL_LABELS.forEach((name, index) => {
    NAME_TO_INDEX.set(name.toLowerCase(), index);
    NAME_TO_INDEX.set(name.slice(0, 3).toLowerCase(), index);
});
// Spellings that are not a prefix of the full name but are unambiguous.
NAME_TO_INDEX.set('tues', 2);
NAME_TO_INDEX.set('thur', 4);
NAME_TO_INDEX.set('thurs', 4);

/** Tolerant parser: weekday indexes, legacy letters, short or full day names. */
export function parseWeekdays(raw: unknown): number[] {
    if (raw == null) return [];
    const values = Array.isArray(raw) ? raw : [raw];
    const found = new Set<number>();
    for (const value of values) {
        if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6) {
            found.add(value);
            continue;
        }
        if (typeof value !== 'string') continue;
        const text = value.trim();
        if (!text) continue;
        if (/^[0-6]$/.test(text)) { found.add(Number(text)); continue; }
        const byName = NAME_TO_INDEX.get(text.toLowerCase());
        if (byName !== undefined) { found.add(byName); continue; }
        const byLetter = LETTER_TO_INDEXES[text.toUpperCase()];
        if (byLetter) byLetter.forEach((index) => found.add(index));
    }
    return [...found].sort((a, b) => a - b);
}

/** Canonical, deduped, ordered weekday indexes for a task. */
export function getWeekdays(task: AnchorTask): number[] {
    return parseWeekdays(task.daysOfWeek);
}

/** Human list for a schedule row: "Mon, Wed, Fri". */
export function formatWeekdays(raw: unknown): string {
    return parseWeekdays(raw).map((index) => WEEKDAY_LABELS[index]).join(', ');
}

/** True when the stored value still needs the CM-18 migration to indexes. */
export function needsWeekdayMigration(raw: unknown): boolean {
    if (raw == null) return false;
    const values = Array.isArray(raw) ? raw : [raw];
    return values.some((value) => typeof value !== 'number');
}

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

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** ISO date (YYYY-MM-DD) → local start of day. */
function parseDateOnly(value?: string | null): Date | null {
    if (!value) return null;
    const text = value.trim();
    if (!text) return null;
    const parsed = new Date(text.length <= 10 ? `${text}T00:00:00` : text);
    return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

/** ISO date string for a Date, in the user's local day. */
export function toDateOnly(date: Date): string {
    const copy = startOfDay(date);
    const month = `${copy.getMonth() + 1}`.padStart(2, '0');
    const day = `${copy.getDate()}`.padStart(2, '0');
    return `${copy.getFullYear()}-${month}-${day}`;
}

/** Sunday-start week containing `date`. */
function startOfWeek(date: Date): Date {
    return addDays(startOfDay(date), -startOfDay(date).getDay());
}

/**
 * CM-17 — the schedule model's bounds and interval.
 *
 * "Pay rent on the 1st at 9am, until December" is a promise, and promises have
 * dates. `startDate` anchors the recurrence (so "every 2 weeks" has something to
 * count from), `endDate` retires it, and `interval` turns the presets into real
 * recurrence ("every 2 weeks", "every 3 days"). All three are optional: with
 * none of them set the presets behave exactly as before, so existing data and
 * the daily/weekly/monthly presets are untouched.
 */
function withinScheduleBounds(task: AnchorTask, date: Date): boolean {
    const target = startOfDay(date);
    const start = parseDateOnly(task.startDate);
    if (start && target.getTime() < start.getTime()) return false;
    const end = parseDateOnly(task.endDate);
    if (end && target.getTime() > end.getTime()) return false;
    return true;
}

function matchesInterval(task: AnchorTask, date: Date): boolean {
    const interval = Math.floor(task.interval ?? 1);
    if (!Number.isFinite(interval) || interval <= 1) return true;
    const start = parseDateOnly(task.startDate);
    // Without an anchor there is nothing to count from; keep the preset
    // behaviour rather than guessing.
    if (!start) return true;
    const target = startOfDay(date);
    if (target.getTime() < start.getTime()) return false;

    switch (task.type) {
        case 'daily': {
            const days = Math.round((target.getTime() - start.getTime()) / 86400000);
            return days % interval === 0;
        }
        case 'weekly': {
            const weeks = Math.round(
                (startOfWeek(target).getTime() - startOfWeek(start).getTime()) / (7 * 86400000),
            );
            return weeks % interval === 0;
        }
        case 'monthly': {
            const months =
                (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
            return months % interval === 0;
        }
        default:
            return true;
    }
}

/** The day a one-off to-do is promised for, or null. */
export function getDueDate(task: AnchorTask): Date | null {
    return parseDateOnly(task.dueDate);
}

function completedOn(task: AnchorTask, date: Date): boolean {
  if (!task.completed || !task.lastCompletedAt) return false;
  const done = new Date(task.lastCompletedAt);
  return !Number.isNaN(done.getTime()) && isSameDay(done, date);
}

/** True when the commitment has a scheduled occurrence on `date`. */
export function isScheduledOn(task: AnchorTask, date: Date): boolean {
    // CM-17: nothing fires before its start date or after its end date, and an
    // interval ("every 2 weeks") is honoured.
    if (!withinScheduleBounds(task, date)) return false;
    if (!matchesInterval(task, date)) return false;

    switch (task.type) {
        case 'daily':
            return true;
        case 'todo': {
            // CM-17: a one-off with an exact due date is scheduled that day, and
            // stays visible while it is still owed.
            const due = parseDateOnly(task.dueDate);
            if (due) return isSameDay(due, date) || (!task.completed && startOfDay(date).getTime() > due.getTime());
            return !task.completed || completedOn(task, date);
        }
        case 'weekly': {
            // CM-18: weekday INDEXES, so Tue ≠ Thu and Sat ≠ Sun, and a value
            // stored as a full day name still resolves.
            const days = getWeekdays(task);
            if (!days.length) return true;
            return days.includes(date.getDay());
        }
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

/**
 * CM-18 migration. Legacy tasks store weekday letters or full day names; this
 * returns the same task with canonical indexes so the migration can be applied
 * on read (and persisted on the next write) without a destructive script.
 * Returns the SAME object when nothing needs migrating, so React memoisation
 * and query caches are not churned.
 */
export function migrateTaskSchedule(task: AnchorTask): AnchorTask {
    if (!needsWeekdayMigration(task.daysOfWeek)) return task;
    const migrated = parseWeekdays(task.daysOfWeek);
    return { ...task, daysOfWeek: migrated };
}

/** Applies {@link migrateTaskSchedule} across a list. */
export function migrateTasksSchedule(tasks: AnchorTask[]): AnchorTask[] {
    let changed = false;
    const next = tasks.map((task) => {
        const migrated = migrateTaskSchedule(task);
        if (migrated !== task) changed = true;
        return migrated;
    });
    return changed ? next : tasks;
}

/** Most recent scheduled day strictly before `today`, or null. */
function lastScheduledBefore(task: AnchorTask, today: Date): Date | null {
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
  // CM-17: a commitment past its end date is finished, not carried over. Without
  // this it would be reported as overdue forever, because the backward scan
  // still finds days inside the window it used to run on.
  const end = parseDateOnly(task.endDate);
  if (end && startOfDay(now).getTime() > end.getTime()) return false;
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
  return `${next.getDate()} ${MONTH_LABELS[next.getMonth()]}`;
}

/**
 * CM-17 — how the schedule reads back to the user, e.g. "every 2 weeks until
 * 5 Oct". Empty when the commitment is on its plain preset, so the row stays
 * quiet unless there is something real to say.
 */
export function describeSchedule(task: AnchorTask): string {
    const parts: string[] = [];
    const interval = Math.floor(task.interval ?? 1);
    const unit = task.type === 'daily' ? 'day' : task.type === 'weekly' ? 'week' : task.type === 'monthly' ? 'month' : null;
    if (unit && interval > 1) parts.push(`every ${interval} ${unit}s`);
    const end = parseDateOnly(task.endDate);
    if (end) parts.push(`until ${end.getDate()} ${MONTH_LABELS[end.getMonth()]}`);
    return parts.join(' ');
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

/**
 * How many times this commitment was *expected* between `from` and `to`
 * (UX-AI-08). This is the honest denominator: "0 of 4" used to mean "0 of the 4
 * commitments you track are flagged complete right now", which says nothing
 * about the last 30 days and reads as failure even for a daily habit the user
 * has kept 30 times.
 *
 * The count is clamped to the commitment's creation date, so a habit added
 * yesterday is not blamed for the previous four weeks. A one-off to-do carries
 * a single expectation.
 */
export function countScheduledOccurrences(task: AnchorTask, from: Date, to: Date): number {
  const start = startOfDay(from);
  const end = startOfDay(to);
  if (end.getTime() < start.getTime()) return 0;

  const createdAt = task.createdAt instanceof Date ? startOfDay(task.createdAt) : null;
  const effectiveStart = createdAt && createdAt.getTime() > start.getTime() ? createdAt : start;
  if (effectiveStart.getTime() > end.getTime()) return 0;

  if (task.type === 'todo') return 1;

  let count = 0;
  for (let cursor = new Date(effectiveStart); cursor.getTime() <= end.getTime(); cursor = addDays(cursor, 1)) {
    if (isScheduledOn(task, cursor)) count += 1;
  }
  return count;
}
