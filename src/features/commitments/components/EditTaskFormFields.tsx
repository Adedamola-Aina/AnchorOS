/**
 * Edit Task Form - Type-Specific Field Components
 * 
 * Extracted from EditTaskForm.tsx to keep components under 200 lines.
 */
// @ts-nocheck


import React from 'react';
import { Button } from '@anchor-os/ui';
import type { TimeOfDay } from '../../../types';

interface DailyFieldsProps {
    editTime: TimeOfDay;
    setEditTime: (time: TimeOfDay) => void;
}

export const DailyFields: React.FC<DailyFieldsProps> = ({ editTime, setEditTime }) => (
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
);

interface WeeklyFieldsProps {
    editDays: string[];
    setEditDays: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WeeklyFields: React.FC<WeeklyFieldsProps> = ({ editDays, setEditDays }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Days</label>
        <div className="flex flex-wrap gap-1.5">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <Button
                    key={day}
                    type="button"
                    onClick={() => setEditDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                    variant={editDays.includes(day) ? 'primary' : 'secondary'}
                    className={`h-11 px-3 text-[10px] ${editDays.includes(day) ? 'bg-purple-600' : ''}`}
                >
                    {day.slice(0, 3)}
                </Button>
            ))}
        </div>
    </div>
);

interface MonthlyFieldsProps {
    editDaysOfMonth: number[];
    setEditDaysOfMonth: React.Dispatch<React.SetStateAction<number[]>>;
}

export const MonthlyFields: React.FC<MonthlyFieldsProps> = ({ editDaysOfMonth, setEditDaysOfMonth }) => (
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
                    className={`w-11 h-11 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${editDaysOfMonth.includes(d)
                        ? 'bg-task-600 text-white border-transparent shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-task-300'
                        }`}
                >
                    {d}
                </button>
            ))}
        </div>
    </div>
);
