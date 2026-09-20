/**
 * TaskForm - Multi-step commitment creation form
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Wizard steps and field components extracted to TaskFormParts.tsx
 */
// @ts-nocheck


import React, { useState, useMemo } from 'react';
import type { TaskType, TimeOfDay, TaskPriority, AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Modal } from '../../../components/shared/Modal';
import { PopoverMenu, TimeWheelPicker } from '../../../components/shared';
import { DailyTimeField, WeeklyDaysField, MonthlyDatesField } from './TaskFormParts';
import { PriorityIndicator } from './PriorityIndicator';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';

interface TaskFormProps { onClose: () => void; onAdd: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>; hasFamilyActive: boolean; }

/**
 * UX-CM-01: the composer used to OPEN on "Choose Frequency", so a user had to
 * classify before they could capture. It now opens on the name, with the cadence
 * defaulted and adjustable in place.
 *
 * UX-CM-02: it also rendered inline in the page flow — no sheet context, no
 * visible Save on the first step. It is now a Modal: one sheet, one dismiss, and
 * Save pinned in the footer so it is always reachable.
 *
 * UX-CM-09: the "Domain" jargon is gone (it is an Area now) and the priority
 * emoji are Lucide icons.
 */
const CADENCE_OPTIONS: { value: TaskType; label: string }[] = [
    { value: 'todo', label: 'One-off' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, onAdd, hasFamilyActive }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskType, setNewTaskType] = useState<TaskType>('daily');
    const [newTaskScope, setNewTaskScope] = useState<'personal' | 'family'>('personal');
    const [newTaskTime, setNewTaskTime] = useState<TimeOfDay>('morning');
    const [newTaskDays, setNewTaskDays] = useState<string[]>([]);
    const [newTaskDates, setNewTaskDates] = useState<number[]>([]);
    const [newTaskDomain, setNewTaskDomain] = useState('Personal Development');
    const [newTaskReminder, setNewTaskReminder] = useState('');
    const [newTaskNotes, setNewTaskNotes] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
    const [isSaving, setIsSaving] = useState(false);

    const domains = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'];

    // Guard against losing unsaved form data on accidental tab switch
    const isDirty = useMemo(() => !!(newTaskTitle.trim() || newTaskReminder || newTaskNotes.trim()), [newTaskTitle, newTaskReminder, newTaskNotes]);
    useUnsavedChanges(isDirty);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const taskPayload: Omit<AnchorTask, 'id' | 'createdAt'> = { title: newTaskTitle, type: newTaskType, completed: false, category: newTaskScope, domain: newTaskDomain, reminderTime: newTaskReminder || undefined, notes: newTaskNotes.trim() || undefined, priority: newTaskPriority };
            if (newTaskType === 'daily') taskPayload.timeOfDay = newTaskTime;
            if (newTaskType === 'weekly') taskPayload.daysOfWeek = newTaskDays;
            if (newTaskType === 'monthly') taskPayload.daysOfMonth = newTaskDates;
            await onAdd(taskPayload);
        } finally { setIsSaving(false); }
    };

    return (
        <Modal isOpen onClose={onClose} title="New Commitment" maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* UX-CM-01: capture first — the name is the first control, not a classifier. */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="commitment-name" className="text-[10px] uppercase font-bold text-slate-400">Name</label>
                    <input
                        id="commitment-name"
                        autoFocus
                        type="text"
                        placeholder="e.g. Morning Prayer, Gym, Rent Payment"
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-slate-400"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        data-testid="task-name"
                    />
                </div>

                {/* Cadence is adjustable in place, so nothing has to be classified up front. */}
                <div className="flex flex-col gap-1.5">
                    <span id="cadence-label" className="text-[10px] uppercase font-bold text-slate-400">How often?</span>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="cadence-label" data-testid="cadence-selector">
                        {CADENCE_OPTIONS.map(({ value, label }) => (
                            <Button key={value} type="button" onClick={() => setNewTaskType(value)} variant={newTaskType === value ? 'primary' : 'secondary'} className="flex-1 capitalize text-xs">{label}</Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1.5">
                            <PopoverMenu
                                label="Area"
                                items={domains.map(d => ({ value: d, label: d }))}
                                value={newTaskDomain}
                                onChange={setNewTaskDomain}
                                testId="domain-select"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Priority</label>
                            <div className="flex gap-2" data-testid="priority-selector">
                                {(['high', 'medium', 'low'] as const).map(p => (
                                    <Button key={p} type="button" onClick={() => setNewTaskPriority(p)} variant={newTaskPriority === p ? 'primary' : 'secondary'} className="flex-1 text-xs">
                                        <PriorityIndicator priority={p} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                            {hasFamilyActive && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Context</label>
                                    <div className="flex gap-2">
                                        {['personal', 'family'].map((s) => (<Button key={s} type="button" onClick={() => setNewTaskScope(s as 'personal' | 'family')} variant={newTaskScope === s ? 'primary' : 'secondary'} className="flex-1 capitalize">{s}</Button>))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3 min-w-0">
                            {newTaskType === 'daily' && <DailyTimeField value={newTaskTime} onChange={setNewTaskTime} />}
                            {newTaskType === 'weekly' && <WeeklyDaysField value={newTaskDays} onChange={setNewTaskDays} />}
                            {newTaskType === 'monthly' && <MonthlyDatesField value={newTaskDates} onChange={setNewTaskDates} />}
                        </div>
                    </div>
                    {/* Notes field (COMM-006) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Notes</label>
                        <textarea
                            placeholder="Add details, motivation, or context (optional)"
                            maxLength={500}
                            rows={2}
                            value={newTaskNotes}
                            onChange={(e) => setNewTaskNotes(e.target.value)}
                            data-testid="task-notes"
                            className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-slate-400 resize-none text-sm"
                        />
                    </div>
                    {/* Reminder field: inline compact layout (BUG-092) */}
                    <div data-testid="reminder-field" className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <TimeWheelPicker
                            label="Reminder"
                            value={newTaskReminder}
                            onChange={setNewTaskReminder}
                            placeholder="Optional"
                            testId="reminder-input"
                        />
                    </div>
                    {/* UX-CM-02: one dismiss (the sheet's own close) and a pinned Save,
                        so the primary action is reachable without scrolling. */}
                    <div className="sticky bottom-0 -mx-1 px-1 pt-3 pb-1 flex justify-end bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-100 dark:border-slate-800">
                        <Button type="submit" isLoading={isSaving} className="px-8">Save Commitment</Button>
                    </div>
                </form>
        </Modal>
    );
};
