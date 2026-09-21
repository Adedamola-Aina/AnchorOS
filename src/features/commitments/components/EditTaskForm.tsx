// @ts-nocheck
import React, { useState } from 'react';
import type { AnchorTask, TimeOfDay, TaskPriority } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Modal } from '../../../components/shared/Modal';
import { PopoverMenu, SegmentedControl } from '../../../components/shared';
import { DailyFields, WeeklyFields, MonthlyFields } from './EditTaskFormFields';
import { RepeatFields } from './TaskFormParts';
import { PriorityIndicator } from './PriorityIndicator';
import { parseWeekdays } from '../../../services/fabric/commitmentSchedule';

interface EditTaskFormProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    onSave: (taskId: string, updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => Promise<void>;
    onCancel: () => void;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
    task,
    hasFamilyActive,
    onSave,
    onCancel,
}) => {
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDomain, setEditDomain] = useState(task.domain || 'Personal Development');
    const [editScope, setEditScope] = useState<'personal' | 'family'>(task.category === 'family' ? 'family' : 'personal');
    const [editTime, setEditTime] = useState<TimeOfDay>(task.timeOfDay || 'morning');
    // CM-18: parse, so a legacy task (letters or full day names) opens with the
    // right days selected and is written back as canonical indexes.
    const [editDays, setEditDays] = useState<number[]>(() => parseWeekdays(task.daysOfWeek));
    const [editDaysOfMonth, setEditDaysOfMonth] = useState<number[]>(task.daysOfMonth || (task.dayOfMonth ? [task.dayOfMonth] : []));
    const [editNotes, setEditNotes] = useState(task.notes || '');
    // CM-17: the schedule model is editable, not just settable at creation.
    const [editInterval, setEditInterval] = useState(task.interval ?? 1);
    const [editStart, setEditStart] = useState(task.startDate || '');
    const [editEnd, setEditEnd] = useState(task.endDate || '');
    const [editDue, setEditDue] = useState(task.dueDate || '');
    const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority || 'medium');
    const [isSaving, setIsSaving] = useState(false);

    const domains = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'];

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>> = {
                title: editTitle,
                domain: editDomain,
                category: editScope,
                notes: editNotes.trim() || undefined,
                priority: editPriority,
            };

            if (task.type === 'daily') {
                updates.timeOfDay = editTime;
            } else if (task.type === 'weekly') {
                updates.daysOfWeek = editDays;
            } else if (task.type === 'monthly') {
                updates.daysOfMonth = editDaysOfMonth;
            }

            // CM-17: persist the schedule model. Undefined clears a value that was
            // removed, so "Clear" on the end date really retires the bound.
            if (task.type === 'todo') {
                updates.dueDate = editDue || undefined;
            } else {
                updates.interval = editInterval > 1 ? editInterval : undefined;
                updates.startDate = editStart || undefined;
                updates.endDate = editEnd || undefined;
            }

            await onSave(task.id, updates);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        /*
         * A sheet, not a Card in the page flow.
         *
         * This used to render inline as a <Card> with its own "Editing monthly
         * Commitment" header, so a single task took 2–3 screens of page scroll to
         * reach Cancel / Save, and the floating + New commitment button and the
         * staging banner sat on top of it. As a modal sheet it is bounded, the
         * actions are pinned in the footer, and the shell's FAB stands down.
         */
        <Modal
            isOpen
            onClose={onCancel}
            title="Edit commitment"
            maxWidth="max-w-2xl"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSave} isLoading={isSaving} size="sm" className="px-6">Save Changes</Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Title</label>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Commitment title"
                        className="w-full px-4 py-3 rounded-card bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <PopoverMenu
                            label="Area"
                            items={domains.map(d => ({ value: d, label: d }))}
                            value={editDomain}
                            onChange={setEditDomain}
                            testId="edit-domain-select"
                        />
                    </div>
                    {hasFamilyActive && (
                        <div className="flex flex-col gap-1.5">
                            <SegmentedControl
                                label="Scope"
                                options={[
                                    { value: 'personal', label: 'Personal' },
                                    { value: 'family', label: 'Family' },
                                ]}
                                value={editScope}
                                onChange={(v) => setEditScope(v as 'personal' | 'family')}
                                testId="edit-scope-control"
                            />
                        </div>
                    )}
                </div>

                {/* Type-specific fields */}
                {task.type === 'daily' && (
                    <DailyFields editTime={editTime} setEditTime={setEditTime} />
                )}

                {task.type === 'weekly' && (
                    <WeeklyFields editDays={editDays} setEditDays={setEditDays} />
                )}

                {task.type === 'monthly' && (
                    <MonthlyFields editDaysOfMonth={editDaysOfMonth} setEditDaysOfMonth={setEditDaysOfMonth} />
                )}

                {/* CM-17: the schedule model is editable after creation. */}
                <RepeatFields
                    type={task.type}
                    interval={editInterval}
                    onIntervalChange={setEditInterval}
                    startDate={editStart}
                    onStartDateChange={setEditStart}
                    endDate={editEnd}
                    onEndDateChange={setEditEnd}
                    dueDate={editDue}
                    onDueDateChange={setEditDue}
                />

                {/* Priority selector (COMM-007) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Priority</label>
                    <div className="flex gap-2" data-testid="edit-priority-selector">
                        {(['high', 'medium', 'low'] as const).map(p => (
                            <Button key={p} type="button" onClick={() => setEditPriority(p)} variant={editPriority === p ? 'primary' : 'secondary'} size="sm" className="flex-1 justify-center">
                                {/* UX-DS-01: the label was '🔴 High' / '🟡 Medium' / '🟢 Low'. */}
                                <PriorityIndicator priority={p} tone={editPriority === p ? 'inherit' : 'auto'} />
                            </Button>
                        ))}
                    </div>
                </div>
                {/* Notes field (COMM-006) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Notes</label>
                    <textarea
                        placeholder="Add details, motivation, or context (optional)"
                        maxLength={500}
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        data-testid="edit-task-notes"
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-card border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none text-sm"
                    />
                </div>
            </div>
        </Modal>
    );
};
