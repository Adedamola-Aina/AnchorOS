/**
 * EditTaskForm - Form for editing existing tasks
 * DES-002: Migrated to semantic tokens and primitives
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AnchorTask, TimeOfDay } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { DailyFields, WeeklyFields, MonthlyFields } from './EditTaskFormFields';
import { Text, VStack, HStack } from '../../../components/primitives';

interface EditTaskFormProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    onSave: (taskId: string, updates: any) => Promise<void>;
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
    const [editDays, setEditDays] = useState<string[]>(task.daysOfWeek || []);
    const [editDaysOfMonth, setEditDaysOfMonth] = useState<number[]>(task.daysOfMonth || (task.dayOfMonth ? [task.dayOfMonth] : []));
    const [isSaving, setIsSaving] = useState(false);

    const domains = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'];

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const updates: any = { title: editTitle, domain: editDomain, category: editScope };
            if (task.type === 'daily') updates.timeOfDay = editTime;
            else if (task.type === 'weekly') updates.daysOfWeek = editDays;
            else if (task.type === 'monthly') updates.daysOfMonth = editDaysOfMonth;
            await onSave(task.id, updates);
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl bg-surface-3 dark:bg-surface-3-dark border border-[var(--border)] text-foreground dark:text-foreground-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all";
    const selectClass = "w-full px-3 py-2.5 rounded-xl bg-surface-3 dark:bg-surface-3-dark border border-[var(--border)] text-foreground dark:text-foreground-dark text-sm focus:outline-none focus:ring-2 focus:ring-task-500/20 appearance-none";

    return (
        <Card className="space-y-4 p-5 border-task-500/20 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <HStack justify="between" align="center">
                <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-[0.2em]">
                    Editing {task.type} Commitment
                </Text>
                <Button variant="ghost" size="icon" onClick={onCancel} className="text-muted h-8 w-8">
                    <X className="w-4 h-4" />
                </Button>
            </HStack>

            <VStack gap="md">
                <VStack gap="xs">
                    <Text variant="subtle" size="xs" weight="bold" className="uppercase">Title</Text>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Commitment title"
                        className={inputClass}
                        autoFocus
                    />
                </VStack>

                <div className="grid grid-cols-2 gap-4">
                    <VStack gap="xs">
                        <Text variant="subtle" size="xs" weight="bold" className="uppercase">Domain</Text>
                        <select
                            value={editDomain}
                            onChange={(e) => setEditDomain(e.target.value)}
                            className={selectClass}
                        >
                            {domains.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </VStack>
                    {hasFamilyActive && (
                        <VStack gap="xs">
                            <Text variant="subtle" size="xs" weight="bold" className="uppercase">Scope</Text>
                            <select
                                value={editScope}
                                onChange={(e) => setEditScope(e.target.value as 'personal' | 'family')}
                                className={selectClass}
                            >
                                <option value="personal">Personal</option>
                                <option value="family">Family</option>
                            </select>
                        </VStack>
                    )}
                </div>

                {task.type === 'daily' && <DailyFields editTime={editTime} setEditTime={setEditTime} />}
                {task.type === 'weekly' && <WeeklyFields editDays={editDays} setEditDays={setEditDays} />}
                {task.type === 'monthly' && <MonthlyFields editDaysOfMonth={editDaysOfMonth} setEditDaysOfMonth={setEditDaysOfMonth} />}
            </VStack>

            <HStack justify="end" gap="sm" className="pt-4 border-t border-[var(--border-subtle)]">
                <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave} isLoading={isSaving} size="sm" className="px-6">Save Changes</Button>
            </HStack>
        </Card>
    );
};

