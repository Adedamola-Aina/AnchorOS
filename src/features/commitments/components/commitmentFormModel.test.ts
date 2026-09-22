// @ts-nocheck
/**
 * The persisted contract of the commitment form.
 *
 * These are the tests that keep "create" and "edit" honest about what they write:
 * the same values must produce the same document shape they always did, and a
 * value the user never touched must not be written at all.
 */
import { describe, expect, it } from 'vitest';
import type { AnchorTask } from '../../../types';
import {
    buildCreatePayload, buildEditPatch, commitmentValuesFromDraft, commitmentValuesFromTask,
    emptyCommitmentValues, hasRefinements, validateCommitmentForm,
} from './commitmentFormModel';

const baseTask = (overrides: Partial<AnchorTask> = {}): AnchorTask => ({
    id: 't1',
    title: 'Read Bible',
    type: 'daily',
    completed: false,
    category: 'personal',
    createdAt: new Date(),
    ...overrides,
} as AnchorTask);

describe('create payload', () => {
    it('writes a one-off with a due date and nothing recurrence-shaped', () => {
        const payload = buildCreatePayload(emptyCommitmentValues({
            title: 'Renew passport', type: 'todo', dueDate: '2026-10-01',
        }));

        expect(payload).toMatchObject({ title: 'Renew passport', type: 'todo', completed: false, category: 'personal', domain: 'Personal Development', priority: 'medium' });
        expect(payload.dueDate).toBe('2026-10-01');
        expect(payload.timeOfDay).toBeUndefined();
        expect(payload.daysOfWeek).toBeUndefined();
        expect(payload.daysOfMonth).toBeUndefined();
        expect(payload.interval).toBeUndefined();
        expect(payload.startDate).toBeUndefined();
    });

    it('writes a daily commitment with its part of day and start date', () => {
        const payload = buildCreatePayload(emptyCommitmentValues({ title: 'Gym', type: 'daily', timeOfDay: 'evening', startDate: '2026-09-22' }));

        expect(payload.timeOfDay).toBe('evening');
        expect(payload.startDate).toBe('2026-09-22');
        expect(payload.daysOfWeek).toBeUndefined();
        expect(payload.daysOfMonth).toBeUndefined();
    });

    it('writes a weekly commitment with the selected weekdays', () => {
        const payload = buildCreatePayload(emptyCommitmentValues({ title: 'Bins', type: 'weekly', daysOfWeek: [1, 4] }));

        expect(payload.daysOfWeek).toEqual([1, 4]);
        expect(payload.timeOfDay).toBeUndefined();
    });

    it('writes a monthly commitment with the selected dates of the month', () => {
        const payload = buildCreatePayload(emptyCommitmentValues({ title: 'Rent', type: 'monthly', daysOfMonth: [1, 15] }));

        expect(payload.daysOfMonth).toEqual([1, 15]);
        expect(payload.daysOfWeek).toBeUndefined();
    });

    it('carries every refinement, and trims notes', () => {
        const payload = buildCreatePayload(emptyCommitmentValues({
            title: 'Therapy', domain: 'Health', priority: 'high', scope: 'family',
            notes: '  weekly session  ', reminderTime: '09:30', interval: 2, startDate: '2026-09-22', endDate: '2026-12-01',
        }));

        expect(payload).toMatchObject({ domain: 'Health', priority: 'high', category: 'family', notes: 'weekly session', reminderTime: '09:30', interval: 2, endDate: '2026-12-01' });
    });

    it('leaves untouched refinements out of the document entirely', () => {
        const payload = buildCreatePayload(emptyCommitmentValues({ title: 'Water', notes: '   ', reminderTime: '' }));

        expect(payload.notes).toBeUndefined();
        expect(payload.reminderTime).toBeUndefined();
        expect(payload.interval).toBeUndefined();
    });
});

describe('edit patch', () => {
    it('never rewrites the cadence — it is part of the stored document', () => {
        const patch = buildEditPatch(baseTask({ type: 'weekly', daysOfWeek: [2] }), emptyCommitmentValues({
            title: 'Bins', type: 'monthly', daysOfMonth: [1], daysOfWeek: [2],
        }));

        expect(patch.type).toBeUndefined();
        expect(patch.daysOfWeek).toEqual([2]);
        expect(patch.daysOfMonth).toBeUndefined();
    });

    it('patches the daily part of day', () => {
        const patch = buildEditPatch(baseTask(), emptyCommitmentValues({ title: 'Read Bible', timeOfDay: 'afternoon' }));
        expect(patch.timeOfDay).toBe('afternoon');
    });

    it('patches the weekly days and the monthly dates', () => {
        expect(buildEditPatch(baseTask({ type: 'weekly' }), emptyCommitmentValues({ title: 'x', daysOfWeek: [0, 6] })).daysOfWeek).toEqual([0, 6]);
        expect(buildEditPatch(baseTask({ type: 'monthly' }), emptyCommitmentValues({ title: 'x', daysOfMonth: [28] })).daysOfMonth).toEqual([28]);
    });

    it('clears a removed bound instead of leaving it behind', () => {
        const patch = buildEditPatch(baseTask({ type: 'daily', endDate: '2026-12-01', interval: 3 }), emptyCommitmentValues({ title: 'x', endDate: '', interval: 1 }));

        expect(patch.endDate).toBeUndefined();
        expect(patch.interval).toBeUndefined();
    });

    it('patches a one-off due date', () => {
        const patch = buildEditPatch(baseTask({ type: 'todo' }), emptyCommitmentValues({ title: 'x', dueDate: '2026-11-05' }));
        expect(patch.dueDate).toBe('2026-11-05');
    });

    it('patches the refinements, trimming notes', () => {
        const patch = buildEditPatch(baseTask(), emptyCommitmentValues({
            title: 'Read Bible', domain: 'Bible', priority: 'low', scope: 'family', notes: '  one chapter  ',
        }));

        expect(patch).toMatchObject({ domain: 'Bible', priority: 'low', category: 'family', notes: 'one chapter' });
    });
});

describe('validation', () => {
    it('requires a name in both modes', () => {
        expect(validateCommitmentForm(emptyCommitmentValues({ title: '   ' })).title).toBeTruthy();
        expect(validateCommitmentForm(emptyCommitmentValues({ title: 'Named' })).title).toBeUndefined();
    });

    /**
     * A weekly commitment with no weekday and a monthly one with no date can never
     * come round: the schedule engine would simply never fire them.
     */
    it('refuses a recurrence that could never come round', () => {
        expect(validateCommitmentForm(emptyCommitmentValues({ title: 'x', type: 'weekly', daysOfWeek: [] })).recurrence).toMatch(/one day/i);
        expect(validateCommitmentForm(emptyCommitmentValues({ title: 'x', type: 'monthly', daysOfMonth: [] })).recurrence).toMatch(/one date/i);
        expect(validateCommitmentForm(emptyCommitmentValues({ title: 'x', type: 'weekly', daysOfWeek: [3] })).recurrence).toBeUndefined();
        expect(validateCommitmentForm(emptyCommitmentValues({ title: 'x', type: 'monthly', daysOfMonth: [3] })).recurrence).toBeUndefined();
    });

    it('does not demand a recurrence config where there is none to give', () => {
        expect(validateCommitmentForm(emptyCommitmentValues({ title: 'x', type: 'daily' })).recurrence).toBeUndefined();
        expect(validateCommitmentForm(emptyCommitmentValues({ title: 'x', type: 'todo' })).recurrence).toBeUndefined();
    });
});

describe('values from an existing commitment', () => {
    it('normalises legacy weekday names to canonical indexes', () => {
        const values = commitmentValuesFromTask(baseTask({ type: 'weekly', daysOfWeek: ['Mon', 'Thu'] }));
        expect(values.daysOfWeek).toEqual([1, 4]);
    });

    /**
     * The ambiguous-letter case that forced two-letter labels (CM-18): a legacy "T"
     * means both Tuesday and Thursday, so the parser keeps both rather than guessing.
     */
    it('keeps both readings of an ambiguous legacy letter', () => {
        const values = commitmentValuesFromTask(baseTask({ type: 'weekly', daysOfWeek: ['T'] }));
        expect(values.daysOfWeek).toEqual([2, 4]);
    });

    it('normalises a legacy single day-of-month', () => {
        const values = commitmentValuesFromTask(baseTask({ type: 'monthly', dayOfMonth: 15 }));
        expect(values.daysOfMonth).toEqual([15]);
    });

    it('reads the stored defaults back without inventing refinements', () => {
        const values = commitmentValuesFromTask(baseTask());
        expect(values).toMatchObject({ title: 'Read Bible', type: 'daily', timeOfDay: 'morning', domain: 'Personal Development', priority: 'medium', scope: 'personal' });
        expect(hasRefinements(values)).toBe(false);
    });
});

describe('values from a quick-add draft', () => {
    it('seeds what the line already said', () => {
        const values = emptyCommitmentValues(commitmentValuesFromDraft({
            title: 'Gym', type: 'weekly', daysOfWeek: [1, 3], interval: 2, reminderTime: '07:00',
        } as any));

        expect(values).toMatchObject({ title: 'Gym', type: 'weekly', daysOfWeek: [1, 3], interval: 2, reminderTime: '07:00' });
    });

    it('seeds nothing when there is no draft', () => {
        expect(commitmentValuesFromDraft(null)).toEqual({});
    });
});

