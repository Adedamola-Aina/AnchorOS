/**
 * EditTaskForm — the form half of the `/commitments/:id/edit` route.
 *
 * It renders the same `CommitmentForm` the composer does, in edit mode, so the
 * editor and the composer share one field language. What is deliberately
 * different: the cadence is shown read-only (the recurrence *type* is part of the
 * stored document and changing it would silently rewrite history — the schedule
 * below it, the interval, the days, the dates and the bounds are all editable),
 * and the panel opens expanded, because the user came here to change something.
 */
// @ts-nocheck


import React, { useState } from 'react';
import type { AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { CommitmentForm } from './CommitmentForm';

const FORM_ID = 'commitment-editor-form';

interface EditTaskFormProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    onSave: (taskId: string, updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => Promise<void>;
    onCancel: () => void;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, hasFamilyActive, onSave, onCancel }) => {
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="flex flex-col">
            <CommitmentForm
                mode="edit"
                formId={FORM_ID}
                hasFamilyActive={hasFamilyActive}
                task={task}
                onSave={onSave}
                onSavingChange={setIsSaving}
            />

            {/*
              * The action bar.
              *
              * It used to be a translucent `sticky bottom-0` pill with a backdrop
              * blur AND its own `env(safe-area-inset-bottom)` padding: fields
              * scrolled through it (so NOTES / REMINDER / STARTS read as covered),
              * and the bottom inset was compensated twice — once here and once by
              * the shell's `--bottom-nav-height`, which already contains it. It is
              * opaque now, and the shell stays the single owner of the bottom inset,
              * so the bar settles above the bottom navigation instead of behind it.
              */}
            <div
                data-testid="edit-actions"
                className="sticky bottom-0 z-10 mt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1 pt-3 pb-3"
            >
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                <Button type="submit" form={FORM_ID} isLoading={isSaving} size="sm" className="px-6">Save Changes</Button>
            </div>
        </div>
    );
};
