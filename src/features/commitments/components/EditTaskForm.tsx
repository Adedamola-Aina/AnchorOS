import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { AnchorTask, TimeOfDay } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { DailyFields, WeeklyFields, MonthlyFields } from './EditTaskFormFields';

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
    const formRef = useRef<HTMLDivElement>(null);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDomain, setEditDomain] = useState(task.domain || 'Personal Development');
    const [editScope, setEditScope] = useState<'personal' | 'family'>(task.category === 'family' ? 'family' : 'personal');
    const [editTime, setEditTime] = useState<TimeOfDay>(task.timeOfDay || 'morning');
    const [editDays, setEditDays] = useState<string[]>(task.daysOfWeek || []);
    const [editDaysOfMonth, setEditDaysOfMonth] = useState<number[]>(task.daysOfMonth || (task.dayOfMonth ? [task.dayOfMonth] : []));
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
            const updates: any = {
                title: editTitle,
                domain: editDomain,
                category: editScope,
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
                        <label className="text-[10px] uppercase font-bold text-slate-400">Domain</label>
                        <select
                            value={editDomain}
                            onChange={(e) => setEditDomain(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-task-500/20 appearance-none"
                        >
                            {domains.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    {hasFamilyActive && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Scope</label>
                            <select
                                value={editScope}
                                onChange={(e) => setEditScope(e.target.value as 'personal' | 'family')}
                                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-task-500/20 appearance-none"
                            >
                                <option value="personal">Personal</option>
                                <option value="family">Family</option>
                            </select>
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
