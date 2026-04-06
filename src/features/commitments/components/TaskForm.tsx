/**
 * TaskForm - Multi-step commitment creation form
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Wizard steps and field components extracted to TaskFormParts.tsx
 */
// @ts-nocheck


import React, { useState, useMemo } from 'react';
import type { TaskType, TimeOfDay, TaskPriority, AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { PopoverMenu, TimeWheelPicker } from '../../../components/shared';
import { FrequencyStep, DetailsHeader, DailyTimeField, WeeklyDaysField, MonthlyDatesField } from './TaskFormParts';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';

interface TaskFormProps { onClose: () => void; onAdd: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>; hasFamilyActive: boolean; }

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, onAdd, hasFamilyActive }) => {
    const [creationStep, setCreationStep] = useState<'frequency' | 'details'>('frequency');
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

    const handleSelectType = (type: TaskType) => { setNewTaskType(type); setCreationStep('details'); };

    return (
        <Card className="p-4 sm:p-5 mb-6 max-w-2xl mx-auto shadow-xl animate-in zoom-in-95 duration-200">
            {creationStep === 'frequency' ? (
                <FrequencyStep onSelectType={handleSelectType} onClose={onClose} />
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DetailsHeader taskType={newTaskType} onBack={() => setCreationStep('frequency')} onClose={onClose} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Name</label>
                                <input autoFocus type="text" placeholder="e.g. Morning Prayer, Gym, Rent Payment" className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-slate-400" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <PopoverMenu
                                    label="Domain"
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
                                        <Button key={p} type="button" onClick={() => setNewTaskPriority(p)} variant={newTaskPriority === p ? 'primary' : 'secondary'} className="flex-1 capitalize text-xs">{p === 'high' ? '🔴 High' : p === 'medium' ? '🟡 Medium' : '🟢 Low'}</Button>
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
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={() => setCreationStep('frequency')}>Back</Button>
                        <Button type="submit" isLoading={isSaving} className="px-8">Save Commitment</Button>
                    </div>
                </form>
            )}
        </Card>
    );
};
