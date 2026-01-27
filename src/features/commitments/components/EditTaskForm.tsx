import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AnchorTask, TimeOfDay } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

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
        <Card className="space-y-4 p-5 border-task-500/20 shadow-xl animate-in slide-in-from-top-2 duration-200">
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
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Time of Day</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['morning', 'afternoon', 'evening', 'any'] as TimeOfDay[]).map((t) => (
                                <Button
                                    key={t}
                                    type="button"
                                    onClick={() => setEditTime(t)}
                                    variant={editTime === t ? 'secondary' : 'ghost'}
                                    className={`px-0 text-[10px] capitalize h-9 ${editTime === t ? 'bg-task-50 text-task-600 border-task-200 dark:bg-task-900/20 dark:border-task-800' : ''}`}
                                >
                                    {t}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {task.type === 'weekly' && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Days</label>
                        <div className="flex flex-wrap gap-1.5">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <Button
                                    key={day}
                                    type="button"
                                    onClick={() => setEditDays(editDays.includes(day) ? editDays.filter(d => d !== day) : [...editDays, day])}
                                    variant={editDays.includes(day) ? 'primary' : 'secondary'}
                                    className={`h-8 px-3 text-[10px] ${editDays.includes(day) ? 'bg-purple-600' : ''}`}
                                >
                                    {day.slice(0, 3)}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {task.type === 'monthly' && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Day(s) of Month</label>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => {
                                        setEditDaysOfMonth(prev =>
                                            prev.includes(d) ? prev.filter(day => day !== d) : [...prev, d]
                                        );
                                    }}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${editDaysOfMonth.includes(d)
                                        ? 'bg-task-600 text-white border-transparent shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-task-300'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
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
