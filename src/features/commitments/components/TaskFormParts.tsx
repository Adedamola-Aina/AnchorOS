/**
 * TaskForm Wizard Steps & Field Components
 * Extracted from TaskForm.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { X, Sunrise, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { TaskType, TimeOfDay } from '../../../types';

interface FrequencyStepProps { onSelectType: (type: TaskType) => void; onClose: () => void; }
export const FrequencyStep: React.FC<FrequencyStepProps> = ({ onSelectType, onClose }) => {
    const options = [
        { id: 'todo', label: 'Todo', desc: 'One-time task', icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" /> },
        { id: 'daily', label: 'Daily', desc: 'Every single day', icon: <Sunrise className="w-6 h-6 text-task-500" /> },
        { id: 'weekly', label: 'Weekly', desc: 'On specific days', icon: <Calendar className="w-6 h-6 text-purple-500" /> },
        { id: 'monthly', label: 'Monthly', desc: 'On a specific date', icon: <CheckCircle2 className="w-6 h-6 text-task-500" /> },
    ];
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Frequency</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400"><X className="w-5 h-5" /></Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((option) => (
                    <button key={option.id} onClick={() => onSelectType(option.id as TaskType)} className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-task-500/50 hover:bg-task-50/50 dark:hover:bg-task-900/10 transition-all text-center group">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">{option.icon}</div>
                        <div><h4 className="font-bold text-slate-900 dark:text-white">{option.label}</h4><p className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</p></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

interface DetailsHeaderProps { taskType: TaskType; onBack: () => void; onClose: () => void; }
export const DetailsHeader: React.FC<DetailsHeaderProps> = ({ taskType, onBack, onClose }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" onClick={onBack} className="text-slate-400"><ChevronDown className="w-5 h-5 rotate-90" /></Button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{taskType} Commitment</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400"><X className="w-5 h-5" /></Button>
    </div>
);

interface DailyTimeFieldProps { value: TimeOfDay; onChange: (v: TimeOfDay) => void; }
export const DailyTimeField: React.FC<DailyTimeFieldProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Time</label>
        <div className="grid grid-cols-2 gap-2">
            {['morning', 'afternoon', 'evening', 'any'].map((t) => (
                <Button key={t} type="button" onClick={() => onChange(t as TimeOfDay)} variant={value === t ? 'secondary' : 'ghost'}
                    className={`p-2.5 capitalize ${value === t ? 'bg-task-50 text-task-600 border-task-200 dark:bg-task-900/20 dark:border-task-800' : ''}`}>{t}</Button>
            ))}
        </div>
    </div>
);

interface WeeklyDaysFieldProps { value: string[]; onChange: (days: string[]) => void; }
export const WeeklyDaysField: React.FC<WeeklyDaysFieldProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">On which days?</label>
        <div className="flex justify-between gap-1">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                <button key={d} type="button" onClick={() => onChange(value.includes(d) ? value.filter(day => day !== d) : [...value, d])}
                    className={`w-10 h-10 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${value.includes(d) ? 'bg-purple-600 text-white border-transparent' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-purple-300'}`}>{d[0]}</button>
            ))}
        </div>
    </div>
);

interface MonthlyDatesFieldProps { value: number[]; onChange: (dates: number[]) => void; }
export const MonthlyDatesField: React.FC<MonthlyDatesFieldProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Which date(s)?</label>
        <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button key={d} type="button" onClick={() => onChange(value.includes(d) ? value.filter(day => day !== d) : [...value, d])}
                    className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${value.includes(d) ? 'bg-task-600 text-white border-transparent' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-task-300'}`}>{d}</button>
            ))}
        </div>
    </div>
);
