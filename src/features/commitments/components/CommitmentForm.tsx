/**
 * CommitmentForm — the one form behind "New Commitment" and "Edit commitment".
 *
 * Create and edit keep their own presentation (a sheet for capture, a route for
 * change) because they are different jobs: one is "get this out of my head", the
 * other is "come back and adjust it". What they no longer do is invent their own
 * field language, spacing, validation or accessibility — that all lives here and
 * in `CommitmentFormFields`, so the two cannot drift again.
 *
 * Hierarchy (both modes):
 *   Essential   name → cadence → the cadence's own configuration
 *   More        Area · Priority · Scope · Notes · Reminder, one deliberate tap away
 *
 * Create opens collapsed, because a commitment that needs none of the refinements
 * should not have to be read past all of them. Edit opens expanded, because the
 * user came here to change something and a hidden field is a field they will not
 * find.
 */
// @ts-nocheck


import React, { useCallback, useMemo, useState } from 'react';
import type { AnchorTask } from '../../../types';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';
import {
    AreaField, CadenceField, CommitmentNameField, MoreOptionsToggle, NotesField,
    PriorityField, RecurrenceFields, ReminderField, ScheduleBoundsFields, ScopeField,
} from './CommitmentFormFields';
import {
    buildCreatePayload, buildEditPatch, commitmentValuesFromDraft, commitmentValuesFromTask,
    emptyCommitmentValues, hasRefinements, validateCommitmentForm,
    type CommitmentFormErrors, type CommitmentFormValues,
} from './commitmentFormModel';
import type { QuickAddDraft } from '../utils/parseQuickAdd';

interface CommitmentFormProps {
    mode: 'create' | 'edit';
    /**
     * The form's id. A footer button rendered outside the form (the sheet's pinned
     * footer) submits it with `form={formId}`, so Save works from anywhere.
     */
    formId: string;
    hasFamilyActive: boolean;
    /** Edit: the commitment being changed. */
    task?: AnchorTask;
    /** Create: a parsed quick-add draft, pre-filled for adjustment (CM-16). */
    initialDraft?: QuickAddDraft | null;
    onCreate?: (payload: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>;
    onSave?: (taskId: string, patch: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => Promise<void>;
    /** Reports busy state so the pinned footer can reflect it. */
    onSavingChange?: (saving: boolean) => void;
}

export const CommitmentForm: React.FC<CommitmentFormProps> = ({
    mode, formId, hasFamilyActive, task, initialDraft, onCreate, onSave, onSavingChange,
}) => {
    const initialValues = useMemo<CommitmentFormValues>(
        () => (mode === 'edit' && task
            ? commitmentValuesFromTask(task)
            : emptyCommitmentValues(commitmentValuesFromDraft(initialDraft))),
        [mode, task, initialDraft],
    );

    const [values, setValues] = useState<CommitmentFormValues>(initialValues);
    const [errors, setErrors] = useState<CommitmentFormErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    // Edit opens expanded: nothing a user came here to change should be hidden.
    const [showMore, setShowMore] = useState(mode === 'edit');

    const set = useCallback((key: keyof CommitmentFormValues, value: CommitmentFormValues[keyof CommitmentFormValues]) => {
        setValues((previous) => ({ ...previous, [key]: value }));
        setErrors((previous) => (previous.title || previous.recurrence ? {} : previous));
    }, []);

    /**
     * Unsaved-change guard, both modes. Create had one and edit did not, so leaving
     * the editor mid-change was silent.
     */
    const isDirty = useMemo(() => {
        if (mode === 'create') return !!(values.title.trim() || values.reminderTime || values.notes.trim());
        return JSON.stringify(values) !== JSON.stringify(initialValues);
    }, [mode, values, initialValues]);
    useUnsavedChanges(isDirty);

    const handleSubmit = useCallback(async (event?: React.FormEvent) => {
        event?.preventDefault();
        if (isSaving) return;

        const nextErrors = validateCommitmentForm(values);
        setErrors(nextErrors);
        if (nextErrors.title || nextErrors.recurrence) {
            // Say what is wrong where the user is looking, not in a toast.
            setShowMore(true);
            document.getElementById('commitment-name')?.focus();
            return;
        }

        setIsSaving(true);
        onSavingChange?.(true);
        setSubmitError(null);
        try {
            if (mode === 'create' && onCreate) {
                await onCreate(buildCreatePayload(values));
            } else if (mode === 'edit' && task && onSave) {
                await onSave(task.id, buildEditPatch(task, values));
            }
        } catch (error: unknown) {
            setSubmitError(error instanceof Error ? error.message : 'Could not save this commitment.');
        } finally {
            setIsSaving(false);
            onSavingChange?.(false);
        }
    }, [isSaving, values, mode, onCreate, onSave, task, onSavingChange]);

    return (
        <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Essential: name → cadence → the cadence's own configuration. */}
            <CommitmentNameField value={values.title} onChange={(next) => set('title', next)} error={errors.title} />
            <CadenceField value={values.type} onChange={(next) => set('type', next)} locked={mode === 'edit'} />
            <RecurrenceFields values={values} onChange={set} error={errors.recurrence} />

            {/* Refinements, one deliberate tap away. */}
            <MoreOptionsToggle open={showMore} onToggle={() => setShowMore((open) => !open)} hasRefinements={hasRefinements(values)} />
            {showMore && (
                <div id="composer-more-options" data-testid="composer-more-options" className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <AreaField value={values.domain} onChange={(next) => set('domain', next)} />
                    <PriorityField value={values.priority} onChange={(next) => set('priority', next)} />
                    {hasFamilyActive && <ScopeField value={values.scope} onChange={(next) => set('scope', next)} />}
                    {/* CM-17's schedule bounds sit here with the other refinements. */}
                    <ScheduleBoundsFields values={values} onChange={set} showInterval={mode === 'edit'} />
                    <NotesField value={values.notes} onChange={(next) => set('notes', next)} />
                    <ReminderField
                        value={values.reminderTime}
                        onChange={(next) => set('reminderTime', next)}
                        timeOfDay={values.timeOfDay}
                        showWindowNote={values.type === 'daily'}
                    />
                </div>
            )}

            {submitError && <p role="alert" data-testid="commitment-submit-error" className="text-xs text-danger">{submitError}</p>}
        </form>
    );
};

