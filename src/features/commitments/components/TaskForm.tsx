/**
 * TaskForm - Multi-step commitment creation form
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Wizard steps and field components extracted to TaskFormParts.tsx
 */

import React, { useState } from 'react';
import type { TaskType, TimeOfDay, AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { FrequencyStep, DetailsHeader, DailyTimeField, WeeklyDaysField, MonthlyDatesField } from './TaskFormParts';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const taskPayload = { title: newTaskTitle, type: newTaskType, completed: false, category: newTaskScope, domain: newTaskDomain, reminderTime: newTaskReminder || null } as any;
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
                                <select value={newTaskDomain} onChange={(e) => setNewTaskDomain(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all appearance-none">
                                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
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
                        <div className="space-y-4">
                            {newTaskType === 'daily' && <DailyTimeField value={newTaskTime} onChange={setNewTaskTime} />}
                            {newTaskType === 'weekly' && <WeeklyDaysField value={newTaskDays} onChange={setNewTaskDays} />}
                            {newTaskType === 'monthly' && <MonthlyDatesField value={newTaskDates} onChange={setNewTaskDates} />}
                            <div className="flex flex-col gap-1.5 pt-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Reminder (Optional)</label>
                                <input type="time" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 transition-all" value={newTaskReminder} onChange={(e) => setNewTaskReminder(e.target.value)} />
                            </div>
                        </div>
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
