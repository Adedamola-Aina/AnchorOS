// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { AnchorTask, TimeOfDay, TaskPriority } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { PopoverMenu, SegmentedControl } from '../../../components/shared';
import { DailyFields, WeeklyFields, MonthlyFields } from './EditTaskFormFields';

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
    const formRef = useRef<HTMLDivElement>(null);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDomain, setEditDomain] = useState(task.domain || 'Personal Development');
    const [editScope, setEditScope] = useState<'personal' | 'family'>(task.category === 'family' ? 'family' : 'personal');
    const [editTime, setEditTime] = useState<TimeOfDay>(task.timeOfDay || 'morning');
    const [editDays, setEditDays] = useState<string[]>(task.daysOfWeek || []);
    const [editDaysOfMonth, setEditDaysOfMonth] = useState<number[]>(task.daysOfMonth || (task.dayOfMonth ? [task.dayOfMonth] : []));
    const [editNotes, setEditNotes] = useState(task.notes || '');
    const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority || 'medium');
    const [isSaving, setIsSaving] = useState(false);

    // EDIT-001: Scroll form into view when opened on mobile
    useEffect(() => {
        if (formRef.current && typeof formRef.current.scrollIntoView === 'function') {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

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

            await onSave(task.id, updates);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card ref={formRef} className="space-y-4 p-5 border-task-500/20 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Editing {task.type} Commitment</span>
                <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 h-8 w-8">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Title</label>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Commitment title"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <PopoverMenu
                            label="Domain"
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

                {/* Priority selector (COMM-007) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Priority</label>
                    <div className="flex gap-2" data-testid="edit-priority-selector">
                        {(['high', 'medium', 'low'] as const).map(p => (
                            <Button key={p} type="button" onClick={() => setEditPriority(p)} variant={editPriority === p ? 'primary' : 'secondary'} size="sm" className="flex-1 capitalize text-xs">{p === 'high' ? '🔴 High' : p === 'medium' ? '🟡 Medium' : '🟢 Low'}</Button>
                        ))}
                    </div>
                </div>
                {/* Notes field (COMM-006) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Notes</label>
                    <textarea
                        placeholder="Add details, motivation, or context (optional)"
                        maxLength={500}
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        data-testid="edit-task-notes"
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-slate-400 resize-none text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    isLoading={isSaving}
                    size="sm"
                    className="px-6"
                >
                    Save Changes
                </Button>
            </div>
        </Card>
    );
};
