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
import type { TaskType, TimeOfDay } from '../../../types';
import { WEEKDAY_COMPACT_LABELS, WEEKDAY_FULL_LABELS } from '../../../services/fabric/commitmentSchedule';
import { InlineDatePicker } from '../../../components/shared';

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

interface WeeklyDaysFieldProps { value: number[]; onChange: (days: number[]) => void; }
/**
 * CM-18: weekday indexes with two-letter labels. This control used to render
 * "S M T W T F S", where T and S each stood for two different days.
 */
export const WeeklyDaysField: React.FC<WeeklyDaysFieldProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">On which days?</label>
        <div className="flex justify-between gap-1">
            {WEEKDAY_FULL_LABELS.map((day, index) => (
                <button key={day} type="button" onClick={() => onChange(value.includes(index) ? value.filter(d => d !== index) : [...value, index])}
                    aria-pressed={value.includes(index)} aria-label={day}
                    className={`w-10 h-10 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${value.includes(index) ? 'bg-purple-600 text-white border-transparent' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-purple-300'}`}>{WEEKDAY_COMPACT_LABELS[index]}</button>
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

/** CM-17: the recurrence unit an interval multiplies. */
const INTERVAL_UNITS: Record<string, { singular: string; plural: string }> = {
    daily: { singular: 'day', plural: 'days' },
    weekly: { singular: 'week', plural: 'weeks' },
    monthly: { singular: 'month', plural: 'months' },
};

interface RepeatFieldsProps {
    type: TaskType;
    interval: number;
    onIntervalChange: (value: number) => void;
    startDate: string;
    onStartDateChange: (value: string) => void;
    endDate: string;
    onEndDateChange: (value: string) => void;
    dueDate?: string;
    onDueDateChange?: (value: string) => void;
}

/**
 * CM-17 — the real schedule model in the composer.
 *
 * "Pay rent on the 1st at 9am, until December" is a promise, and promises have
 * dates. This adds the recurrence interval ("every 2 weeks"), the date the
 * recurrence counts from, and the date it retires — plus an exact due date for a
 * one-off. All optional: leaving them alone keeps the plain preset, so the
 * composer does not get heavier for the common case.
 */
export const RepeatFields: React.FC<RepeatFieldsProps> = ({
    type, interval, onIntervalChange, startDate, onStartDateChange, endDate, onEndDateChange, dueDate, onDueDateChange,
}) => {
    const unit = INTERVAL_UNITS[type];

    return (
        <div className="flex flex-col gap-3">
            {unit && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400" id="repeat-interval-label">Repeats</label>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="repeat-interval-label">
                        {[1, 2, 3, 4].map((n) => (
                            <Button key={n} type="button" onClick={() => onIntervalChange(n)}
                                aria-pressed={interval === n}
                                variant={interval === n ? 'primary' : 'secondary'}
                                className="min-h-[44px] text-xs">
                                {n === 1 ? `Every ${unit.singular}` : `Every ${n} ${unit.plural}`}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">{type === 'todo' ? 'Due date' : 'Starts'}</label>
                <InlineDatePicker
                    value={type === 'todo' ? (dueDate || '') : startDate}
                    onChange={type === 'todo' ? (v) => onDueDateChange?.(v) : onStartDateChange}
                    label={type === 'todo' ? 'Due date' : 'Start date'}
                    testId={type === 'todo' ? 'due-date-input' : 'start-date-input'}
                />
            </div>
            {type !== 'todo' && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Ends <span className="normal-case font-medium">(optional)</span></label>
                    <div className="flex items-center gap-2">
                        <InlineDatePicker value={endDate} onChange={onEndDateChange} label="End date" testId="end-date-input" />
                        {endDate && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => onEndDateChange('')} className="text-xs">
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
