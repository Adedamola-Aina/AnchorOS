/**
 * CM-16 / CM-29 — the commitment intent parser ("Commitment Intent Parser v1").
 *
 * "Pay rent Fri 9am" or "Read 15m daily" should become a commitment without three
 * taps through a composer. This parses the line into a draft; the caller either
 * saves it or hands it to the composer to adjust.
 *
 * The parser is **deterministic** — a fixed grammar, no model, no network — and it
 * never persists anything. It reports *how sure it is* rather than a fake
 * percentage, so the UI can decide what to promise:
 *
 *   exact     the text was fully understood; every field the cadence needs is here
 *   partial   a cadence was recognised but the domain still needs a day or a date
 *   fallback  the text looks scheduling-ish in a way v1 cannot represent, so nothing
 *             is claimed and the name is preserved verbatim
 *
 * Two rules keep it honest:
 *   - anything unrecognised stays in the title (never silently dropped),
 *   - a fallback consumes nothing at all, so the user's words survive to the composer.
 *
 * The pipeline this feeds is `text → intent → validation → preview → existing domain
 * creation`, which is also what a future conversational surface would reuse.
 */

import type { TaskType } from '../../../types';
import { parseWeekdays, toDateOnly } from '../../../services/fabric/commitmentSchedule';

/** How sure the parse is. Semantic states, never a fabricated confidence score. */
export type IntentConfidence = 'exact' | 'partial' | 'fallback';

/** Configuration the domain requires that the text did not supply. */
export type MissingField = 'dayOfWeek' | 'dayOfMonth';

export interface QuickAddDraft {
    title: string;
    type: TaskType;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    reminderTime?: string;
    interval?: number;
    dueDate?: string;
    /** The line exactly as typed: the contract every preview is shown against. */
    originalInput: string;
    confidence: IntentConfidence;
    /** What the parser consumed, so the UI can explain the reading. */
    parsedTokens: string[];
    /** Required configuration still missing — drives "Continue setup". */
    missing: MissingField[];
}

/** The intent a parsed line represents. One shape, so nothing downstream branches. */
export type CommitmentIntent = QuickAddDraft;

const CADENCE_PATTERNS: Array<{ pattern: RegExp; type: TaskType; token: string }> = [
    { pattern: /\bevery\s+day\b|\bdaily\b/i, type: 'daily', token: 'cadence:daily' },
    { pattern: /\bevery\s+week\b|\bweekly\b/i, type: 'weekly', token: 'cadence:weekly' },
    { pattern: /\bevery\s+month\b|\bmonthly\b/i, type: 'monthly', token: 'cadence:monthly' },
];

/** "every 2 weeks" / "every 3 days" → cadence + interval. */
const INTERVAL_PATTERN = /\bevery\s+(\d{1,2})\s+(day|week|month)s?\b/i;

const WEEKDAY_PATTERN = /\b(?:every\s+|each\s+|on\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat)\b/gi;

const MONTH_DAY_PATTERN = /\bon\s+the\s+(\d{1,2})(?:st|nd|rd|th)?\b|\bthe\s+(\d{1,2})(?:st|nd|rd|th)\b/i;

/** 9am, 9:30 am, 21:00, 9 pm — anchored so "15m" is not read as a time. The
 *  optional "at" is consumed with it, so no dangling connector is left behind. */
const TIME_PATTERN = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\b(?:at\s+)?([01]?\d|2[0-3]):([0-5]\d)\b/i;

/** Leading "todo buy milk" / "add buy milk" / "create buy milk" — the command is not part of the name. */
const COMMAND_PATTERN = /^\s*(?:to-?do|add|create)\s+(?:a\s+|an\s+)?/i;

/**
 * Scheduling-shaped language v1 deliberately cannot represent.
 *
 * "Gym sometimes", "Exercise more", "Call John later", "Work out three times a week"
 * all mean something, but none of them names *which days*, and this domain stores a
 * set of days or a day of the month — not a frequency count. Inventing a schedule for
 * them would be the parser pretending to understand; matching them at all is how it
 * avoids claiming a cadence the user never stated.
 */
const UNSUPPORTED_INTENT = new RegExp(
    [
        '\\b(?:sometimes|occasionally|whenever|regularly|often|sporadically|eventually)\\b',
        '\\b(?:twice|thrice)\\b',
        '\\b(?:one|two|three|four|five|six|\\d{1,2})\\s+times?\\b',
        '\\bevery\\s+other\\b',
        '\\bevery\\s+few\\b',
        '\\b(?:later|soon|sometime)\\b',
    ].join('|'),
    'i',
);

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

/** Weekday index → the two-letter label the UI uses everywhere (CM-18). */
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * Comparisons that are meaningless without a stated schedule: "Exercise more" says
 * nothing about *when*. Only ever consulted when the line carried no structure at all,
 * so ordinary vocabulary ("Read more books daily") is untouched.
 */
const SOFT_AMBIGUITY = /\b(?:more|less|better|healthier|smarter|harder)\b/i;

/**
 * Parse a line of text into a commitment intent — or `null` when there is nothing to
 * create (empty, whitespace, or a line that is *only* a command word).
 *
 * Pure: the same input and clock always produce the same intent.
 */
export function parseQuickAdd(input: string, now: Date): QuickAddDraft | null {
    const raw = input.trim();
    if (!raw) return null;

    const parsedTokens: string[] = [];
    let working = ` ${raw} `;

    // 1. An explicit command is a verb, not part of the name.
    const commandMatch = working.match(COMMAND_PATTERN);
    if (commandMatch) {
        parsedTokens.push(`command:${commandMatch[0].trim().toLowerCase()}`);
        working = ` ${working.replace(COMMAND_PATTERN, '')} `;
    }

    const draft: QuickAddDraft = {
        title: raw,
        type: 'todo',
        originalInput: raw,
        confidence: 'exact',
        parsedTokens,
        missing: [],
    };

    /*
     * 2. Anything scheduling-shaped that v1 cannot represent stops the parse here.
     *    Nothing is consumed and nothing is claimed, so the composer opens with the
     *    user's own words — which is what "uncertain → preserve the text" means.
     */
    const unsupported = working.match(UNSUPPORTED_INTENT);
    if (unsupported) {
        const title = capitalise(raw.replace(COMMAND_PATTERN, '').replace(/\s+/g, ' ').trim());
        if (!title) return null;
        return {
            ...draft,
            title,
            parsedTokens: [...parsedTokens, `unsupported:${unsupported[0].toLowerCase()}`],
            confidence: 'fallback',
        };
    }

    // 3. Interval first: it also implies the cadence.
    const intervalMatch = working.match(INTERVAL_PATTERN);
    if (intervalMatch) {
        const amount = Number(intervalMatch[1]);
        const unit = intervalMatch[2].toLowerCase();
        draft.type = unit === 'day' ? 'daily' : unit === 'week' ? 'weekly' : 'monthly';
        if (amount > 1) {
            draft.interval = amount;
            parsedTokens.push(`interval:${amount} ${unit}s`);
        }
        working = working.replace(intervalMatch[0], ' ');
    } else {
        for (const { pattern, type, token } of CADENCE_PATTERNS) {
            if (pattern.test(working)) {
                draft.type = type;
                parsedTokens.push(token);
                working = working.replace(pattern, ' ');
                break;
            }
        }
    }

    // 4. Weekdays → indexes. A weekday without a cadence makes it weekly, and the
    //    weekday pattern consumes a preceding "every"/"each"/"on" so no connector is
    //    left stranded in the name ("Church every Wednesday" → "Church", not
    //    "Church every").
    const weekdayMatches = [...working.matchAll(WEEKDAY_PATTERN)].map((match) => match[1]);
    if (weekdayMatches.length) {
        const days = parseWeekdays(weekdayMatches);
        if (days.length) {
            // A weekday without a stated cadence makes it weekly; record that cadence
            // first, so the explanation reads in the order it was inferred.
            if (draft.type === 'todo') {
                draft.type = 'weekly';
                parsedTokens.push('cadence:weekly');
            }
            draft.daysOfWeek = days;
            for (const day of days) parsedTokens.push(`weekday:${WEEKDAY_LABELS[day]}`);
        }
        working = working.replace(WEEKDAY_PATTERN, ' ');
    }

    // 5. "on the 1st" → monthly on that day.
    const monthDayMatch = working.match(MONTH_DAY_PATTERN);
    if (monthDayMatch) {
        const day = Number(monthDayMatch[1] ?? monthDayMatch[2]);
        if (day >= 1 && day <= 31) {
            draft.dayOfMonth = day;
            parsedTokens.push(`dayOfMonth:${day}`);
            if (draft.type === 'todo') draft.type = 'monthly';
        }
        working = working.replace(monthDayMatch[0], ' ');
    }

    // 6. Exact day words → a one-off due date (the connector is consumed with it).
    if (/\b(?:due\s+|by\s+|on\s+)?tomorrow\b/i.test(working)) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        draft.dueDate = toDateOnly(tomorrow);
        parsedTokens.push(`date:${draft.dueDate}`);
        working = working.replace(/\b(?:due\s+|by\s+|on\s+)?tomorrow\b/i, ' ');
    } else if (/\b(?:due\s+|by\s+|on\s+)?today\b/i.test(working)) {
        draft.dueDate = toDateOnly(now);
        parsedTokens.push(`date:${draft.dueDate}`);
        working = working.replace(/\b(?:due\s+|by\s+|on\s+)?today\b/i, ' ');
    }

    const timeMatch = working.match(TIME_PATTERN);
    if (timeMatch) {
        const normalised = timeMatch[3] !== undefined
            ? normaliseTime(timeMatch[1], timeMatch[2], timeMatch[3])
            : normaliseTime(timeMatch[4], timeMatch[5], undefined);
        if (normalised) {
            draft.reminderTime = normalised;
            parsedTokens.push(`time:${normalised}`);
        }
        working = working.replace(timeMatch[0], ' ');
    }

    // 7. Whatever is left is the name. Punctuation left behind by removals is tidied.
    const title = capitalise(working.replace(/\s+/g, ' ').replace(/^[\s,·-]+|[\s,·-]+$/g, '').trim());
    if (!title) return null;
    draft.title = title;

    // 8. How complete is this? The domain needs a day for weekly and a date for
    //    monthly — "Pay rent monthly" is a real intent that is not yet creatable.
    if (draft.type === 'weekly' && !draft.daysOfWeek?.length) draft.missing.push('dayOfWeek');
    if (draft.type === 'monthly' && !draft.dayOfMonth) draft.missing.push('dayOfMonth');

    /*
     * 9. A comparison with no structure at all ("Exercise more") is a statement about
     *    frequency we cannot express. It is not a *partial* parse — nothing is missing,
     *    the text simply is not a schedule — so it falls back, which keeps the words
     *    and hands the decision to the composer. Once any structure IS recognised
     *    ("Read more books daily") the comparison is just vocabulary, not a claim.
     */
    const hasStructure = parsedTokens.some((token) => !token.startsWith('command:'));
    if (draft.missing.length) draft.confidence = 'partial';
    else if (!hasStructure && SOFT_AMBIGUITY.test(raw)) draft.confidence = 'fallback';
    else draft.confidence = 'exact';

    return draft;
}

/**
 * May the UI offer one-tap creation for this intent?
 *
 * Only when the parse is complete, the cadence has everything it needs, and the name
 * is at least two characters — so a stray keystroke can never be persisted by tapping
 * a button the user only meant as "yes, that text".
 */
export function isDirectlyCreatable(draft: QuickAddDraft | null): boolean {
    return Boolean(draft && draft.confidence === 'exact' && draft.missing.length === 0 && draft.title.trim().length >= 2);
}

/**
 * One-line summary of a parsed intent, for the confirmation the user sees.
 *
 * A partial parse says what is missing rather than guessing it ("Weekly · Choose
 * day"), which is the whole difference between a preview and an invention.
 */
export function describeQuickAdd(draft: QuickAddDraft): string {
    const parts: string[] = [];
    if (draft.interval && draft.interval > 1) parts.push(`every ${draft.interval} ${draft.type === 'daily' ? 'days' : draft.type === 'weekly' ? 'weeks' : 'months'}`);
    else if (draft.type !== 'todo') parts.push(draft.type);
    if (draft.daysOfWeek?.length) {
        parts.push(draft.daysOfWeek.map((day) => WEEKDAY_LABELS[day]).join(', '));
    }
    if (draft.dayOfMonth) parts.push(`day ${draft.dayOfMonth}`);
    if (draft.dueDate) parts.push(`due ${draft.dueDate}`);
    if (draft.reminderTime) parts.push(`at ${draft.reminderTime}`);
    if (draft.missing.includes('dayOfWeek')) parts.push('Choose day');
    if (draft.missing.includes('dayOfMonth')) parts.push('Choose date');
    return parts.join(' · ');
}

/**
 * The cadence in words, with no schedule attached — used where the user is choosing
 * what a commitment *is* rather than when it happens.
 */
export function describeCadence(type: TaskType): string {
    if (type === 'todo') return 'One-off';
    return type.charAt(0).toUpperCase() + type.slice(1);
}
