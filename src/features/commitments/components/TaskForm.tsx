import React, { useState } from 'react';
import { X, Sunrise, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import type { TaskType, TimeOfDay, AnchorTask } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface TaskFormProps {
    onClose: () => void;
    onAdd: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>;
    hasFamilyActive: boolean;
}

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
            const taskPayload = {
                title: newTaskTitle,
                type: newTaskType,
                completed: false,
                category: newTaskScope,
                domain: newTaskDomain,
                reminderTime: newTaskReminder || null,
            } as any;

            if (newTaskType === 'daily') taskPayload.timeOfDay = newTaskTime;
            if (newTaskType === 'weekly') taskPayload.daysOfWeek = newTaskDays;
            if (newTaskType === 'monthly') taskPayload.daysOfMonth = newTaskDates;

            await onAdd(taskPayload);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="p-6 mb-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {creationStep === 'frequency' ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Frequency</h3>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'daily', label: 'Daily', desc: 'Every single day', icon: <Sunrise className="w-6 h-6 text-blue-500" /> },
                            { id: 'weekly', label: 'Weekly', desc: 'On specific days', icon: <Calendar className="w-6 h-6 text-purple-500" /> },
                            { id: 'monthly', label: 'Monthly', desc: 'On a specific date', icon: <CheckCircle2 className="w-6 h-6 text-indigo-500" /> },
                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    setNewTaskType(option.id as TaskType);
                                    setCreationStep('details');
                                }}
                                className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-center group"
                            >
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                    {option.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{option.label}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setCreationStep('frequency')}
                                className="text-slate-400"
                            >
                                <ChevronDown className="w-5 h-5 rotate-90" />
                            </Button>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{newTaskType} Commitment</h3>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Morning Prayer, Gym, Rent Payment"
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Domain</label>
                                <select
                                    value={newTaskDomain}
                                    onChange={(e) => setNewTaskDomain(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                                >
                                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            {hasFamilyActive && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Context</label>
                                    <div className="flex gap-2">
                                        {['personal', 'family'].map((s) => (
                                            <Button
                                                key={s}
                                                type="button"
                                                onClick={() => setNewTaskScope(s as 'personal' | 'family')}
                                                variant={newTaskScope === s ? 'primary' : 'secondary'}
                                                className="flex-1 capitalize"
                                            >
                                                {s}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {newTaskType === 'daily' && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Time</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['morning', 'afternoon', 'evening', 'any'].map((t) => (
                                            <Button
                                                key={t}
                                                type="button"
                                                onClick={() => setNewTaskTime(t as TimeOfDay)}
                                                variant={newTaskTime === t ? 'secondary' : 'ghost'}
                                                className={`p-2.5 capitalize ${newTaskTime === t ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : ''}`}
                                            >
                                                {t}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {newTaskType === 'weekly' && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">On which days?</label>
                                    <div className="flex justify-between gap-1">
                                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => {
                                                    setNewTaskDays(prev =>
                                                        prev.includes(d) ? prev.filter(day => day !== d) : [...prev, d]
                                                    );
                                                }}
                                                className={`w-10 h-10 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${newTaskDays.includes(d)
                                                    ? 'bg-purple-600 text-white border-transparent'
                                                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                                                    }`}
                                            >
                                                {d[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {newTaskType === 'monthly' && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Which date(s)?</label>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => {
                                                    setNewTaskDates(prev =>
                                                        prev.includes(d) ? prev.filter(day => day !== d) : [...prev, d]
                                                    );
                                                }}
                                                className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${newTaskDates.includes(d)
                                                    ? 'bg-indigo-600 text-white border-transparent'
                                                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5 pt-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Reminder (Optional)</label>
                                <input
                                    type="time"
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={newTaskReminder}
                                    onChange={(e) => setNewTaskReminder(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={() => setCreationStep('frequency')}>
                            Back
                        </Button>
                        <Button type="submit" isLoading={isSaving} className="px-8">
                            Save Commitment
                        </Button>
                    </div>
                </form>
            )}
        </Card>
    );
};
