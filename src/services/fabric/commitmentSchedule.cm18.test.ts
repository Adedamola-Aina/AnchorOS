import { describe, it, expect } from 'vitest';
import type { AnchorTask } from '../../types';
import {
    formatWeekdays,
    getDueToday,
    getWeekdays,
    isOverdue,
    isScheduledOn,
    migrateTaskSchedule,
    migrateTasksSchedule,
    needsWeekdayMigration,
    parseWeekdays,
} from './commitmentSchedule';

/**
 * CM-18 — the day-letter collision.
 *
 * `daysOfWeek` was stored as 'S','M','T','W','T','F','S', so T matched Tuesday
 * AND Thursday and S matched Saturday AND Sunday. The composer stored FULL day
 * names while the engine compared letters, so a weekly commitment created in the
 * UI matched nothing at all.
 */

function task(overrides: Partial<AnchorTask>): AnchorTask {
    return {
        id: 't1',
        title: 'Commitment',
        type: 'weekly',
        completed: false,
        category: 'personal',
        createdAt: null,
        ...overrides,
    };
}

// 2026-09-20 is a Sunday, so these are the real weekdays around it.
const SUNDAY = new Date(2026, 8, 20, 9, 0, 0);
const MONDAY = new Date(2026, 8, 21, 9, 0, 0);
const TUESDAY = new Date(2026, 8, 22, 9, 0, 0);
const WEDNESDAY = new Date(2026, 8, 23, 9, 0, 0);
const THURSDAY = new Date(2026, 8, 24, 9, 0, 0);
const FRIDAY = new Date(2026, 8, 25, 9, 0, 0);
const SATURDAY = new Date(2026, 8, 26, 9, 0, 0);

describe('CM-18 — weekday indexes replace colliding letters', () => {
    it('keeps Tuesday and Thursday distinct (the "T" collision)', () => {
        const tuesday = task({ daysOfWeek: [2] });
        expect(isScheduledOn(tuesday, TUESDAY)).toBe(true);
        expect(isScheduledOn(tuesday, THURSDAY)).toBe(false);

        const thursday = task({ daysOfWeek: [4] });
        expect(isScheduledOn(thursday, THURSDAY)).toBe(true);
        expect(isScheduledOn(thursday, TUESDAY)).toBe(false);
    });

    it('keeps Saturday and Sunday distinct (the "S" collision)', () => {
        const sunday = task({ daysOfWeek: [0] });
        expect(isScheduledOn(sunday, SUNDAY)).toBe(true);
        expect(isScheduledOn(sunday, SATURDAY)).toBe(false);

        const saturday = task({ daysOfWeek: [6] });
        expect(isScheduledOn(saturday, SATURDAY)).toBe(true);
        expect(isScheduledOn(saturday, SUNDAY)).toBe(false);
    });

    it('reads a commitment saved by the composer (full day name) — it used to match nothing', () => {
        // The real defect: WeeklyView compared 'Monday' and rendered it as due,
        // while this engine compared 'M' and saw no scheduled day, so the
        // assistant and the badge reported nothing for work the page showed.
        const legacy = task({ daysOfWeek: ['Monday', 'Wednesday', 'Friday'] as unknown as number[] });
        expect(isScheduledOn(legacy, MONDAY)).toBe(true);
        expect(isScheduledOn(legacy, WEDNESDAY)).toBe(true);
        expect(isScheduledOn(legacy, TUESDAY)).toBe(false);
        // And it is visible to the surfaces that were blind to it.
        expect(getDueToday([legacy], MONDAY)).toHaveLength(1);
    });

    it('expands a legacy ambiguous letter to the days it already matched', () => {
        // 'T' must not silently stop firing on Thursday.
        const legacy = task({ daysOfWeek: ['T'] as unknown as number[] });
        expect(isScheduledOn(legacy, TUESDAY)).toBe(true);
        expect(isScheduledOn(legacy, THURSDAY)).toBe(true);

        const legacyS = task({ daysOfWeek: ['S'] as unknown as number[] });
        expect(isScheduledOn(legacyS, SUNDAY)).toBe(true);
        expect(isScheduledOn(legacyS, SATURDAY)).toBe(true);
    });

    it('parses indexes, letters, numeric strings, short and full names', () => {
        expect(parseWeekdays([1, 3])).toEqual([1, 3]);
        expect(parseWeekdays(['M', 'F'])).toEqual([1, 5]);
        expect(parseWeekdays(['1', '5'])).toEqual([1, 5]);
        expect(parseWeekdays(['Mon', 'fri'])).toEqual([1, 5]);
        expect(parseWeekdays(['Monday', 'FRIDAY'])).toEqual([1, 5]);
        expect(parseWeekdays(['tues', 'thurs'])).toEqual([2, 4]);
    });

    it('dedupes, orders and ignores junk', () => {
        expect(parseWeekdays(['Friday', 'Monday', 1, 'nonsense', null, 9, -1])).toEqual([1, 5]);
        expect(parseWeekdays(undefined)).toEqual([]);
        expect(parseWeekdays('Monday')).toEqual([1]);
    });

    it('formats weekdays for display with distinct labels', () => {
        expect(formatWeekdays([1, 3, 5])).toBe('Mon, Wed, Fri');
        expect(formatWeekdays(['Tuesday'])).toBe('Tue');
        expect(formatWeekdays(['T'])).toBe('Tue, Thu');
    });

    it('migrates a legacy task to canonical indexes', () => {
        const legacy = task({ daysOfWeek: ['Monday', 'Wednesday'] as unknown as number[] });
        expect(needsWeekdayMigration(legacy.daysOfWeek)).toBe(true);

        const migrated = migrateTaskSchedule(legacy);
        expect(migrated.daysOfWeek).toEqual([1, 3]);
        expect(needsWeekdayMigration(migrated.daysOfWeek)).toBe(false);
        // The schedule is unchanged by the migration.
        expect(isScheduledOn(migrated, MONDAY)).toBe(true);
        expect(isScheduledOn(migrated, WEDNESDAY)).toBe(true);
    });

    it('is a no-op for an already-canonical task, so caches are not churned', () => {
        const canonical = task({ daysOfWeek: [1, 3] });
        expect(migrateTaskSchedule(canonical)).toBe(canonical);

        const list = [canonical];
        expect(migrateTasksSchedule(list)).toBe(list);
    });

    it('migrates a whole list and leaves undated tasks untouched', () => {
        const legacyList = [task({ id: 'a', daysOfWeek: ['Monday'] as unknown as number[] }), task({ id: 'b' })];
        const migratedList = migrateTasksSchedule(legacyList);
        expect(migratedList).not.toBe(legacyList);
        expect(migratedList[0]?.daysOfWeek).toEqual([1]);
        // A task with no days configured is left alone (means "every day").
        expect(migratedList[1]).toBe(legacyList[1]);
    });

    it('never calls a migrated commitment overdue on its own scheduled day', () => {
        const legacy = task({ daysOfWeek: ['Monday'] as unknown as number[] });
        expect(isOverdue(legacy, MONDAY)).toBe(false);
        expect(getDueToday([legacy], MONDAY)).toHaveLength(1);
    });

    it('agrees with the composer preset (Mon/Wed/Fri)', () => {
        const seeded = task({ daysOfWeek: [1, 3, 5] });
        expect(getWeekdays(seeded)).toEqual([1, 3, 5]);
        expect(isScheduledOn(seeded, MONDAY)).toBe(true);
        expect(isScheduledOn(seeded, TUESDAY)).toBe(false);
        expect(isScheduledOn(seeded, FRIDAY)).toBe(true);
    });
});
