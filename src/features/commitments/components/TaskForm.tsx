/**
 * TaskForm - Multi-step commitment creation form
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Wizard steps and field components extracted to TaskFormParts.tsx
 */
// @ts-nocheck


import React, { useState, useMemo } from 'react';
import type { TaskType, TimeOfDay, AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { ChevronDown } from 'lucide-react';
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
    const [isSaving, setIsSaving] = useState(false);

    const domains = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'];

    // Guard against losing unsaved form data on accidental tab switch
    const isDirty = useMemo(() => !!(newTaskTitle.trim() || newTaskReminder), [newTaskTitle, newTaskReminder]);
    useUnsavedChanges(isDirty);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const taskPayload: Omit<AnchorTask, 'id' | 'createdAt'> = { title: newTaskTitle, type: newTaskType, completed: false, category: newTaskScope, domain: newTaskDomain, reminderTime: newTaskReminder || undefined };
            if (newTaskType === 'daily') taskPayload.timeOfDay = newTaskTime;
            if (newTaskType === 'weekly') taskPayload.daysOfWeek = newTaskDays;
            if (newTaskType === 'monthly') taskPayload.daysOfMonth = newTaskDates;
            await onAdd(taskPayload);
        } finally { setIsSaving(false); }
    };

    const handleSelectType = (type: TaskType) => { setNewTaskType(type); setCreationStep('details'); };

    return (
        <Card className="p-6 mb-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {creationStep === 'frequency' ? (
                <FrequencyStep onSelectType={handleSelectType} onClose={onClose} />
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DetailsHeader taskType={newTaskType} onBack={() => setCreationStep('frequency')} onClose={onClose} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Name</label>
                                <input autoFocus type="text" placeholder="e.g. Morning Prayer, Gym, Rent Payment" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-slate-400" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Domain</label>
                                <div className="relative">
                                    <select value={newTaskDomain} onChange={(e) => setNewTaskDomain(e.target.value)} className="w-full p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all min-h-[44px] text-base">
                                        {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
                        <div className="space-y-4 min-w-0">
                            {newTaskType === 'daily' && <DailyTimeField value={newTaskTime} onChange={setNewTaskTime} />}
                            {newTaskType === 'weekly' && <WeeklyDaysField value={newTaskDays} onChange={setNewTaskDays} />}
                            {newTaskType === 'monthly' && <MonthlyDatesField value={newTaskDates} onChange={setNewTaskDates} />}
                        </div>
                    </div>
                    {/* Reminder field: inline compact layout (BUG-092) */}
                    <div data-testid="reminder-field" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Reminder</label>
                        <input type="time" data-testid="reminder-input" className="flex-1 min-w-0 max-w-[140px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 transition-all text-base" value={newTaskReminder} onChange={(e) => setNewTaskReminder(e.target.value)} />
                        <span className="text-[10px] text-slate-400 hidden sm:inline">Optional</span>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={() => setCreationStep('frequency')}>Back</Button>
                        <Button type="submit" isLoading={isSaving} className="px-8">Save Commitment</Button>
                    </div>
                </form>
            )}
        </Card>
    );
};
