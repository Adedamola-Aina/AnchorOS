/**
 * TaskForm — the capture sheet ("New Commitment").
 *
 * UX-CM-01: the composer used to OPEN on "Choose Frequency", so a user had to
 * classify before they could capture. It opens on the name, with the cadence
 * defaulted and adjustable in place.
 *
 * UX-CM-02: it also rendered inline in the page flow — no sheet context, no
 * visible Save on the first step. It is a Modal: one sheet, one dismiss, and Save
 * pinned in the footer (outside the scroll body) so it can never sit on top of a
 * field.
 *
 * The form itself now comes from `CommitmentForm`, which the editor shares, so the
 * two can no longer disagree about labels, spacing, validation or accessibility.
 */
// @ts-nocheck


import React, { useState } from 'react';
import type { AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Modal } from '../../../components/shared/Modal';
import { CommitmentForm } from './CommitmentForm';
import type { QuickAddDraft } from '../utils/parseQuickAdd';

/**
 * The composer's form id. The submit button lives in the modal's footer — outside
 * the form element — so it names the form it belongs to.
 */
const FORM_ID = 'commitment-composer-form';

interface TaskFormProps {
    onClose: () => void;
    onAdd: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>;
    hasFamilyActive: boolean;
    /** CM-16: a draft parsed from the quick-add line, pre-filled for adjustment. */
    initialDraft?: QuickAddDraft | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, onAdd, hasFamilyActive, initialDraft }) => {
    const [isSaving, setIsSaving] = useState(false);

    return (
        <Modal
            isOpen
            onClose={onClose}
            title="New Commitment"
            maxWidth="max-w-2xl"
            footer={
                <div className="flex justify-end">
                    {/* The button names its form, because the footer lives outside it. */}
                    <Button type="submit" form={FORM_ID} isLoading={isSaving} className="px-8">Save Commitment</Button>
                </div>
            }
        >
            <CommitmentForm
                mode="create"
                formId={FORM_ID}
                hasFamilyActive={hasFamilyActive}
                initialDraft={initialDraft}
                onCreate={onAdd}
                onSavingChange={setIsSaving}
            />
        </Modal>
    );
};
