/**
 * TaskForm - Multi-step commitment creation form
 * DES-002: Migrated to semantic tokens and primitives
 */

import React, { useState } from 'react';
import type { TaskType, TimeOfDay, AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { FrequencyStep, DetailsHeader, DailyTimeField, WeeklyDaysField, MonthlyDatesField } from './TaskFormParts';
import { Text, VStack } from '../../../components/primitives';

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

    const inputClass = "w-full p-3 rounded-xl border border-[var(--border)] bg-surface-3 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-muted";

    return (
        <Card className="p-6 mb-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {creationStep === 'frequency' ? (
                <FrequencyStep onSelectType={handleSelectType} onClose={onClose} />
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DetailsHeader taskType={newTaskType} onBack={() => setCreationStep('frequency')} onClose={onClose} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <VStack gap="md">
                            <VStack gap="xs">
                                <Text variant="subtle" size="xs" weight="bold" className="uppercase">Name</Text>
                                <input autoFocus type="text" placeholder="e.g. Morning Prayer, Gym, Rent Payment" className={inputClass} value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
                            </VStack>
                            <VStack gap="xs">
                                <Text variant="subtle" size="xs" weight="bold" className="uppercase">Domain</Text>
                                <select value={newTaskDomain} onChange={(e) => setNewTaskDomain(e.target.value)} className={`${inputClass} appearance-none`}>
                                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </VStack>
                            {hasFamilyActive && (
                                <VStack gap="xs">
                                    <Text variant="subtle" size="xs" weight="bold" className="uppercase">Context</Text>
                                    <div className="flex gap-2">
                                        {['personal', 'family'].map((s) => (<Button key={s} type="button" onClick={() => setNewTaskScope(s as 'personal' | 'family')} variant={newTaskScope === s ? 'primary' : 'secondary'} className="flex-1 capitalize">{s}</Button>))}
                                    </div>
                                </VStack>
                            )}
                        </VStack>
                        <VStack gap="md">
                            {newTaskType === 'daily' && <DailyTimeField value={newTaskTime} onChange={setNewTaskTime} />}
                            {newTaskType === 'weekly' && <WeeklyDaysField value={newTaskDays} onChange={setNewTaskDays} />}
                            {newTaskType === 'monthly' && <MonthlyDatesField value={newTaskDates} onChange={setNewTaskDates} />}
                            <VStack gap="xs" className="pt-2">
                                <Text variant="subtle" size="xs" weight="bold" className="uppercase">Reminder (Optional)</Text>
                                <input type="time" className={inputClass} value={newTaskReminder} onChange={(e) => setNewTaskReminder(e.target.value)} />
                            </VStack>
                        </VStack>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                        <Button type="button" variant="ghost" onClick={() => setCreationStep('frequency')}>Back</Button>
                        <Button type="submit" isLoading={isSaving} className="px-8">Save Commitment</Button>
                    </div>
                </form>
            )}
        </Card>
    );
};

