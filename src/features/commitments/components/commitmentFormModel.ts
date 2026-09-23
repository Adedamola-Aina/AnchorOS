/**
 * The commitment form's model — one definition of its values, its defaults, its
 * validation, and the two payloads it produces.
 *
 * Why this file exists: create and edit were two independent implementations of
 * the same eight fields, so they drifted — "Name" vs "Title", a required name in
 * one and none in the other, an `htmlFor`-associated label in one and not the
 * other, an interval picker shown in one and deliberately hidden in the other.
 * Neither drifted *intentionally*; there was simply no single place that said what
 * the form is.
 *
 * The payload builders below are the persisted contract and are deliberately
 * explicit: `buildCreatePayload` writes the document, `buildEditPatch` updates it,
 * and both keep the original rule that a value the user never touched is not
 * written at all — so a plain daily commitment still stores the plain shape it
 * always did.
 */


import type { AnchorTask, TaskPriority, TaskType, TimeOfDay } from '../../../types';
import { parseWeekdays, toDateOnly } from '../../../services/fabric/commitmentSchedule';
import type { QuickAddDraft } from '../utils/parseQuickAdd';

export interface CommitmentFormValues {
    title: string;
    type: TaskType;
    timeOfDay: TimeOfDay;
    daysOfWeek: number[];
    daysOfMonth: number[];
    /** The Area. Stored as `domain` in the document. */
    domain: string;
    priority: TaskPriority;
    scope: 'personal' | 'family';
    notes: string;
    /** `HH:MM`, or empty for no reminder. */
    reminderTime: string;
    interval: number;
    startDate: string;
    endDate: string;
    dueDate: string;
}

const DEFAULT_AREA = 'Personal Development';

/** The Areas the product offers. One list, so create and edit cannot disagree. */
export const COMMITMENT_AREAS = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'] as const;

export const CADENCE_OPTIONS: { value: TaskType; label: string }[] = [
    { value: 'todo', label: 'One-off' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

export function emptyCommitmentValues(overrides: Partial<CommitmentFormValues> = {}): CommitmentFormValues {
    return {
        title: '',
        type: 'daily',
        timeOfDay: 'morning',
        daysOfWeek: [],
        daysOfMonth: [],
        domain: DEFAULT_AREA,
        priority: 'medium',
        scope: 'personal',
        notes: '',
        reminderTime: '',
        interval: 1,
        // CM-17: an anchor date, defaulted to today, so a recurring commitment
        // starts now instead of at an unspecified point.
        startDate: toDateOnly(new Date()),
        endDate: '',
        dueDate: '',
        ...overrides,
    };
}

/** An existing commitment → form values. Legacy weekday/day-of-month shapes are normalised. */
export function commitmentValuesFromTask(task: AnchorTask): CommitmentFormValues {
    return emptyCommitmentValues({
        title: task.title,
        type: task.type,
        timeOfDay: task.timeOfDay || 'morning',
        // CM-18: parse, so a legacy commitment (letters or full day names) opens
        // with the right days selected and is written back as canonical indexes.
        daysOfWeek: parseWeekdays(task.daysOfWeek),
        daysOfMonth: task.daysOfMonth || (task.dayOfMonth ? [task.dayOfMonth] : []),
        domain: task.domain || DEFAULT_AREA,
        priority: task.priority || 'medium',
        scope: task.category === 'family' ? 'family' : 'personal',
        notes: task.notes || '',
        reminderTime: task.reminderTime || '',
        interval: task.interval ?? 1,
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        dueDate: task.dueDate || '',
    });
}

/** A parsed quick-add draft → the values it already knows (CM-16). */
export function commitmentValuesFromDraft(draft?: QuickAddDraft | null): Partial<CommitmentFormValues> {
    if (!draft) return {};
    return {
        title: draft.title ?? '',
        type: draft.type ?? 'daily',
        daysOfWeek: draft.daysOfWeek ?? [],
        daysOfMonth: draft.dayOfMonth ? [draft.dayOfMonth] : [],
        reminderTime: draft.reminderTime ?? '',
        interval: draft.interval ?? 1,
        dueDate: draft.dueDate ?? '',
    };
}

export interface CommitmentFormErrors { title?: string; recurrence?: string }

/**
 * Set one field of the form.
 *
 * Deliberately not written as a generic arrow type (`<K extends keyof …>`): inside
 * a `.tsx` module that syntax is ambiguous with a JSX element, and the build's
 * parser rejects it. A named, non-generic signature keeps every call site
 * type-checked without the ambiguity.
 */
export type CommitmentFieldSetter = (
    key: keyof CommitmentFormValues,
    value: CommitmentFormValues[keyof CommitmentFormValues],
) => void;

/**
 * Validation, shared by both modes.
 *
 * Edit had none: a commitment could be saved with an empty name, which then
 * rendered as a nameless row. A weekly commitment with no weekday and a monthly
 * one with no date are refused here too — both can never come round, so they are
 * commitments in name only and the schedule engine would never fire them.
 */
export function validateCommitmentForm(values: CommitmentFormValues): CommitmentFormErrors {
    const errors: CommitmentFormErrors = {};
    if (!values.title.trim()) errors.title = 'Give this commitment a name.';
    if (values.type === 'weekly' && values.daysOfWeek.length === 0) errors.recurrence = 'Pick at least one day.';
    if (values.type === 'monthly' && values.daysOfMonth.length === 0) errors.recurrence = 'Pick at least one date.';
    return errors;
}

/** The document a new commitment is created from. */
export function buildCreatePayload(values: CommitmentFormValues): Omit<AnchorTask, 'id' | 'createdAt'> {
    const payload: Omit<AnchorTask, 'id' | 'createdAt'> = {
        title: values.title,
        type: values.type,
        completed: false,
        category: values.scope,
        domain: values.domain,
        reminderTime: values.reminderTime || undefined,
        notes: values.notes.trim() || undefined,
        priority: values.priority,
    };
    if (values.type === 'daily') payload.timeOfDay = values.timeOfDay;
    if (values.type === 'weekly') payload.daysOfWeek = values.daysOfWeek;
    if (values.type === 'monthly') payload.daysOfMonth = values.daysOfMonth;
    // CM-17: only written when the user actually set it, so the stored document
    // stays clean and the presets keep their old shape.
    if (values.interval > 1) payload.interval = values.interval;
    if (values.type === 'todo') {
        if (values.dueDate) payload.dueDate = values.dueDate;
    } else {
        if (values.startDate) payload.startDate = values.startDate;
        if (values.endDate) payload.endDate = values.endDate;
    }
    return payload;
}

/** The patch an existing commitment is updated with. `undefined` clears a removed value. */
export function buildEditPatch(
    task: AnchorTask,
    values: CommitmentFormValues,
): Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>> {
    const updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>> = {
        title: values.title,
        domain: values.domain,
        category: values.scope,
        notes: values.notes.trim() || undefined,
        priority: values.priority,
    };

    if (task.type === 'daily') updates.timeOfDay = values.timeOfDay;
    else if (task.type === 'weekly') updates.daysOfWeek = values.daysOfWeek;
    else if (task.type === 'monthly') updates.daysOfMonth = values.daysOfMonth;

    if (task.type === 'todo') {
        updates.dueDate = values.dueDate || undefined;
    } else {
        updates.interval = values.interval > 1 ? values.interval : undefined;
        updates.startDate = values.startDate || undefined;
        updates.endDate = values.endDate || undefined;
    }

    return updates;
}

/**
 * Does the user's input carry a refinement beyond the presets? Drives the "Set"
 * badge on the collapsed panel, so a collapsed option can never hide itself.
 */
export function hasRefinements(values: CommitmentFormValues): boolean {
    return values.domain !== DEFAULT_AREA
        || values.priority !== 'medium'
        || values.scope !== 'personal'
        || !!values.notes.trim()
        || !!values.reminderTime
        || values.interval > 1
        // An empty start date is "no bound", not a refinement — otherwise every
        // commitment stored without one would show the "Set" badge in the editor.
        || (!!values.startDate && values.startDate !== toDateOnly(new Date()))
        || !!values.endDate
        || !!values.dueDate;
}

