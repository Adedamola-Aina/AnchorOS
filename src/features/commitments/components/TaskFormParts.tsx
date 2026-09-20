/**
 * TaskForm field components
 * Extracted from TaskForm.tsx per CLAUDE.md §3.2
 *
 * The old `FrequencyStep` ("Choose Frequency") and `DetailsHeader` are gone:
 * UX-CM-01 removed the classification-first step, so the composer opens on the
 * name with the cadence adjustable in place.
 */
// @ts-nocheck


import React from 'react';
import { Button } from '@anchor-os/ui';
import type { TimeOfDay } from '../../../types';

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
                    className={`w-11 h-11 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${value.includes(d) ? 'bg-task-600 text-white border-transparent' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-task-300'}`}>{d}</button>
            ))}
        </div>
    </div>
);
