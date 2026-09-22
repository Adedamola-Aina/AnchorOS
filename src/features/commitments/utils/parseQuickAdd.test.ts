import { describe, it, expect } from 'vitest';
import { describeQuickAdd, isDirectlyCreatable, parseQuickAdd } from './parseQuickAdd';

/** 2026-09-20 is a Sunday. */
const NOW = new Date(2026, 8, 20, 9, 0, 0);

describe('CM-16 — instant add parses a line into a draft', () => {
    it('parses a weekday and a time out of a promise', () => {
        const draft = parseQuickAdd('Pay rent Fri 9am', NOW);
        expect(draft).toMatchObject({
            title: 'Pay rent',
            type: 'weekly',
            daysOfWeek: [5],
            reminderTime: '09:00',
            confidence: 'exact',
        });
    });

    it('parses a cadence word and leaves the duration in the title', () => {
        const draft = parseQuickAdd('Read 15m daily', NOW);
        expect(draft?.type).toBe('daily');
        expect(draft?.title).toBe('Read 15m');
    });

    it('parses "every 2 weeks" as an interval, not a title word', () => {
        const draft = parseQuickAdd('Call Mum every 2 weeks', NOW);
        // Weekly, and still short of a weekday — so it is not yet creatable.
        expect(draft).toMatchObject({ title: 'Call Mum', type: 'weekly', interval: 2, confidence: 'partial' });
        expect(draft?.missing).toEqual(['dayOfWeek']);
    });

    it('parses an ordinal date as a monthly commitment', () => {
        const draft = parseQuickAdd('Pay rent on the 1st at 09:00', NOW);
        expect(draft).toMatchObject({ title: 'Pay rent', type: 'monthly', dayOfMonth: 1, reminderTime: '09:00', confidence: 'exact' });
    });

    it('parses 24-hour and meridiem times, including 12am and 12pm', () => {
        expect(parseQuickAdd('Standup 9:30pm', NOW)?.reminderTime).toBe('21:30');
        expect(parseQuickAdd('Standup at 14:05', NOW)?.reminderTime).toBe('14:05');
        expect(parseQuickAdd('Night feed 12am', NOW)?.reminderTime).toBe('00:00');
        expect(parseQuickAdd('Lunch 12pm', NOW)?.reminderTime).toBe('12:00');
    });

    it('does not mistake a duration for a time', () => {
        const draft = parseQuickAdd('Run 30m daily', NOW);
        expect(draft?.reminderTime).toBeUndefined();
        expect(draft?.title).toBe('Run 30m');
    });

    it('turns "tomorrow" into an exact due date for a one-off', () => {
        const draft = parseQuickAdd('Submit form tomorrow', NOW);
        expect(draft).toMatchObject({ title: 'Submit form', type: 'todo', dueDate: '2026-09-21' });
    });

    it('keeps everything it cannot parse in the title', () => {
        expect(parseQuickAdd('Call the plumber about the boiler', NOW)).toMatchObject({
            title: 'Call the plumber about the boiler',
            type: 'todo',
            confidence: 'exact',
            parsedTokens: [],
        });
    });

    it('returns null for an empty or whitespace-only line', () => {
        expect(parseQuickAdd('', NOW)).toBeNull();
        expect(parseQuickAdd('   ', NOW)).toBeNull();
        expect(parseQuickAdd('daily', NOW)).toBeNull();
    });

    it('reads multiple weekdays as a set', () => {
        const draft = parseQuickAdd('Gym Mon Wed Fri', NOW);
        expect(draft?.type).toBe('weekly');
        expect(draft?.daysOfWeek).toEqual([1, 3, 5]);
        expect(draft?.title).toBe('Gym');
    });

    it('summarises a draft so the user can see what was understood', () => {
        expect(describeQuickAdd(parseQuickAdd('Pay rent Fri 9am', NOW)!)).toBe('weekly · Fri · at 09:00');
        expect(describeQuickAdd(parseQuickAdd('Call Mum every 2 weeks', NOW)!)).toBe('every 2 weeks · Choose day');
        expect(describeQuickAdd(parseQuickAdd('Submit form tomorrow', NOW)!)).toBe('due 2026-09-21');
    });
});
/**
 * Commitment Intent Parser v1 (CM-29).
 *
 * The grammar the product promises, case by case. Each test states the *domain*
 * reading, so a later change to the grammar has to argue with these.
 */
describe('CM-29 — intent parser v1 grammar', () => {
    const parse = (input: string) => parseQuickAdd(input, NOW);

    it('plain text is a one-off titled with the whole line', () => {
        expect(parse('Buy milk')).toMatchObject({ title: 'Buy milk', type: 'todo', confidence: 'exact' });
        expect(parse('Buy milk')?.dueDate).toBeUndefined();
    });

    it('explicit commands are not part of the name', () => {
        for (const input of ['todo buy milk', 'add buy milk', 'create buy milk']) {
            expect(parse(input)).toMatchObject({ title: 'Buy milk', type: 'todo', confidence: 'exact' });
        }
        expect(parse('create buy milk')?.parsedTokens).toContain('command:create');
    });

    it('every day / daily → daily', () => {
        for (const input of ['Stretch every day', 'Stretch daily']) {
            expect(parse(input)).toMatchObject({ title: 'Stretch', type: 'daily', confidence: 'exact' });
        }
    });

    it('a single weekday → weekly on that day', () => {
        expect(parse('Church every Wednesday')).toMatchObject({
            title: 'Church', type: 'weekly', daysOfWeek: [3], confidence: 'exact',
        });
    });

    it('several weekdays → weekly on those days, in both spellings', () => {
        expect(parse('Gym Mon Wed Fri')).toMatchObject({ title: 'Gym', type: 'weekly', daysOfWeek: [1, 3, 5] });
        expect(parse('Gym every Monday Wednesday Friday')).toMatchObject({ title: 'Gym', type: 'weekly', daysOfWeek: [1, 3, 5] });
    });

    it('normalises every common weekday form', () => {
        expect(parse('X Tuesday')?.daysOfWeek).toEqual([2]);
        expect(parse('X Tue')?.daysOfWeek).toEqual([2]);
        expect(parse('X Tues')?.daysOfWeek).toEqual([2]);
        expect(parse('X Thursday')?.daysOfWeek).toEqual([4]);
        expect(parse('X Thurs')?.daysOfWeek).toEqual([4]);
        expect(parse('X Saturday')?.daysOfWeek).toEqual([6]);
        expect(parse('X Sunday')?.daysOfWeek).toEqual([0]);
    });

    it('weekly without a day is partial — no weekday is invented', () => {
        const draft = parse('Review finances weekly');
        expect(draft).toMatchObject({ title: 'Review finances', type: 'weekly', confidence: 'partial' });
        expect(draft?.daysOfWeek).toBeUndefined();
        expect(draft?.missing).toEqual(['dayOfWeek']);
        expect(isDirectlyCreatable(draft)).toBe(false);
    });

    it('monthly without a date is partial — no day is invented', () => {
        const draft = parse('Pay rent monthly');
        expect(draft).toMatchObject({ title: 'Pay rent', type: 'monthly', confidence: 'partial' });
        expect(draft?.dayOfMonth).toBeUndefined();
        expect(draft?.missing).toEqual(['dayOfMonth']);
    });

    it('monthly with an ordinal day is complete, in either word order', () => {
        expect(parse('Pay rent on the 1st every month')).toMatchObject({ title: 'Pay rent', type: 'monthly', dayOfMonth: 1, confidence: 'exact' });
        expect(parse('Pay rent monthly on the 1st')).toMatchObject({ title: 'Pay rent', type: 'monthly', dayOfMonth: 1, confidence: 'exact' });
    });
describe('CM-29 — safety: what v1 refuses to guess', () => {
    const parse = (input: string) => parseQuickAdd(input, NOW);

    /**
     * Each of these says something real about frequency that this domain cannot
     * store — it keeps a set of days or a day of the month, never a count — so the
     * parser claims nothing and the line reaches the composer intact.
     */
    it('refuses to invent a schedule for scheduling-shaped ambiguity', () => {
        for (const input of ['Gym sometimes', 'Exercise more', 'Call John later', 'Work out three times a week']) {
            const draft = parse(input);
            expect(draft?.confidence).toBe('fallback');
            expect(draft?.type).toBe('todo');
            expect(draft?.daysOfWeek).toBeUndefined();
            expect(draft?.dayOfMonth).toBeUndefined();
            expect(draft?.missing).toEqual([]);
            expect(isDirectlyCreatable(draft)).toBe(false);
        }
    });

    it('preserves the user words verbatim when it falls back', () => {
        expect(parse('Work out three times a week')?.title).toBe('Work out three times a week');
        expect(parse('Gym sometimes')?.title).toBe('Gym sometimes');
        // …but a command word is still a verb, not a name, and a name is capitalised.
        expect(parse('add call John later')?.title).toBe('Call John later');
    });

    it('records what it consumed, so the UI can explain itself', () => {
        expect(parse('Gym Mon Wed Fri at 6pm')?.parsedTokens).toEqual([
            'cadence:weekly', 'weekday:Mon', 'weekday:Wed', 'weekday:Fri', 'time:18:00',
        ]);
        expect(parse('Buy groceries tomorrow')?.parsedTokens).toEqual(['date:2026-09-21']);
        expect(parse('Gym sometimes')?.parsedTokens).toEqual(['unsupported:sometimes']);
    });

    it('keeps the original input on the intent', () => {
        expect(parse('  Gym Mon Wed Fri  ')?.originalInput).toBe('Gym Mon Wed Fri');
    });

    it('never persists on its own: a one-character line is not directly creatable', () => {
        const draft = parse('g');
        expect(draft).toMatchObject({ title: 'G', type: 'todo', confidence: 'exact' });
        expect(isDirectlyCreatable(draft)).toBe(false);
        expect(isDirectlyCreatable(parse('Go'))).toBe(true);
    });

    it('is deterministic — same input, same intent', () => {
        expect(parse('Church every Wednesday at 6pm')).toEqual(parse('Church every Wednesday at 6pm'));
    });

    it('does not let a fallback suppress an explicit cadence the user did state', () => {
        // "every other day" has no representation here; nothing is guessed from it.
        expect(parse('Floss every other day')?.confidence).toBe('fallback');
        expect(parse('Floss every other day')?.title).toBe('Floss every other day');
    });
});
});