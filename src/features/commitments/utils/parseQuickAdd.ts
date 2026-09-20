/**
 * CM-16 — instant add.
 *
 * "Pay rent Fri 9am" or "Read 15m daily" should become a commitment without
 * three taps through a composer. This parses the line into a draft; the caller
 * either saves it or hands it to the composer to adjust. Parsing is deliberately
 * conservative: anything it does not recognise stays in the title rather than
 * being silently dropped.
 */

import type { TaskType } from '../../../types';
import { parseWeekdays, toDateOnly } from '../../../services/fabric/commitmentSchedule';

export interface QuickAddDraft {
    title: string;
    type: TaskType;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    reminderTime?: string;
    interval?: number;
    dueDate?: string;
}

const CADENCE_PATTERNS: Array<{ pattern: RegExp; type: TaskType }> = [
    { pattern: /\bevery\s+day\b|\bdaily\b/i, type: 'daily' },
    { pattern: /\bevery\s+week\b|\bweekly\b/i, type: 'weekly' },
    { pattern: /\bevery\s+month\b|\bmonthly\b/i, type: 'monthly' },
];

/** "every 2 weeks" / "every 3 days" → cadence + interval. */
const INTERVAL_PATTERN = /\bevery\s+(\d{1,2})\s+(day|week|month)s?\b/i;

const WEEKDAY_PATTERN = /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat)\b/gi;

const MONTH_DAY_PATTERN = /\bon\s+the\s+(\d{1,2})(?:st|nd|rd|th)?\b|\bthe\s+(\d{1,2})(?:st|nd|rd|th)\b/i;

/** 9am, 9:30 am, 21:00, 9 pm — anchored so "15m" is not read as a time. The
 *  optional "at" is consumed with it, so no dangling connector is left behind. */
const TIME_PATTERN = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\b(?:at\s+)?([01]?\d|2[0-3]):([0-5]\d)\b/i;

function normaliseTime(hour: string, minute: string | undefined, meridiem: string | undefined): string | null {
    let h = Number(hour);
    const m = minute ? Number(minute) : 0;
    if (Number.isNaN(h) || h > 23 || m > 59) return null;
    if (meridiem) {
        if (h < 1 || h > 12) return null;
        const isPm = meridiem.toLowerCase() === 'pm';
        if (isPm && h !== 12) h += 12;
        if (!isPm && h === 12) h = 0;
    }
    return `${`${h}`.padStart(2, '0')}:${`${m}`.padStart(2, '0')}`;
}

function capitalise(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function parseQuickAdd(input: string, now: Date): QuickAddDraft | null {
    const raw = input.trim();
    if (!raw) return null;

    let working = ` ${raw} `;
    const draft: QuickAddDraft = { title: raw, type: 'todo' };

    // Interval first: it also implies the cadence.
    const intervalMatch = working.match(INTERVAL_PATTERN);
    if (intervalMatch) {
        const amount = Number(intervalMatch[1]);
        const unit = intervalMatch[2].toLowerCase();
        draft.type = unit === 'day' ? 'daily' : unit === 'week' ? 'weekly' : 'monthly';
        if (amount > 1) draft.interval = amount;
        working = working.replace(intervalMatch[0], ' ');
    } else {
        for (const { pattern, type } of CADENCE_PATTERNS) {
            if (pattern.test(working)) {
                draft.type = type;
                working = working.replace(pattern, ' ');
                break;
            }
        }
    }

    // Weekdays → indexes. A weekday without a cadence makes it weekly.
    const weekdayMatches = working.match(WEEKDAY_PATTERN);
    if (weekdayMatches) {
        const days = parseWeekdays(weekdayMatches);
        if (days.length) {
            draft.daysOfWeek = days;
            if (draft.type === 'todo') draft.type = 'weekly';
        }
        working = working.replace(WEEKDAY_PATTERN, ' ');
    }

    // "on the 1st" → monthly on that day.
    const monthDayMatch = working.match(MONTH_DAY_PATTERN);
    if (monthDayMatch) {
        const day = Number(monthDayMatch[1] ?? monthDayMatch[2]);
        if (day >= 1 && day <= 31) {
            draft.dayOfMonth = day;
            if (draft.type === 'todo') draft.type = 'monthly';
        }
        working = working.replace(monthDayMatch[0], ' ');
    }

    // Exact day words → a one-off due date (the connector is consumed with it).
    if (/\b(?:due\s+|by\s+|on\s+)?tomorrow\b/i.test(working)) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        draft.dueDate = toDateOnly(tomorrow);
        working = working.replace(/\b(?:due\s+|by\s+|on\s+)?tomorrow\b/i, ' ');
    } else if (/\b(?:due\s+|by\s+|on\s+)?today\b/i.test(working)) {
        draft.dueDate = toDateOnly(now);
        working = working.replace(/\b(?:due\s+|by\s+|on\s+)?today\b/i, ' ');
    }

    const timeMatch = working.match(TIME_PATTERN);
    if (timeMatch) {
        const normalised = timeMatch[3] !== undefined
            ? normaliseTime(timeMatch[1], timeMatch[2], timeMatch[3])
            : normaliseTime(timeMatch[4], timeMatch[5], undefined);
        if (normalised) draft.reminderTime = normalised;
        working = working.replace(timeMatch[0], ' ');
    }

    // Whatever is left is the name. Punctuation left behind by removals is tidied.
    const title = capitalise(working.replace(/\s+/g, ' ').replace(/^[\s,·-]+|[\s,·-]+$/g, '').trim());
    if (!title) return null;
    draft.title = title;

    return draft;
}

/** One-line summary of a parsed draft, for the confirmation the user sees. */
export function describeQuickAdd(draft: QuickAddDraft): string {
    const parts: string[] = [];
    if (draft.interval && draft.interval > 1) parts.push(`every ${draft.interval} ${draft.type === 'daily' ? 'days' : draft.type === 'weekly' ? 'weeks' : 'months'}`);
    else if (draft.type !== 'todo') parts.push(draft.type);
    if (draft.daysOfWeek?.length) {
        const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        parts.push(draft.daysOfWeek.map((day) => labels[day]).join(', '));
    }
    if (draft.dayOfMonth) parts.push(`day ${draft.dayOfMonth}`);
    if (draft.dueDate) parts.push(`due ${draft.dueDate}`);
    if (draft.reminderTime) parts.push(`at ${draft.reminderTime}`);
    return parts.join(' · ');
}
