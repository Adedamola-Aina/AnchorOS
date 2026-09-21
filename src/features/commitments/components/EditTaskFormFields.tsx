/**
 * Edit Task Form - Type-Specific Field Components
 *
 * Extracted from EditTaskForm.tsx to keep components under 200 lines.
 *
 * These mirror the composer's controls rather than re-inventing them: the same
 * time-of-day pull-down, the same weekday strip, and the same day-of-month half
 * sheet. Two different controls for the same field in two forms was exactly the
 * drift being reported.
 */
// @ts-nocheck


import React from 'react';
import { Button } from '@anchor-os/ui';
import type { TimeOfDay } from '../../../types';
import { WEEKDAY_COMPACT_LABELS, WEEKDAY_FULL_LABELS } from '../../../services/fabric/commitmentSchedule';
import { PopoverMenu } from '../../../components/shared';
import { MonthlyDatesField } from './TaskFormParts';

interface DailyFieldsProps {
    editTime: TimeOfDay;
    setEditTime: (time: TimeOfDay) => void;
}

const TIME_OF_DAY_OPTIONS = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'any', label: 'Anytime' },
];

/** The same pull-down the composer uses — one value out of four. */
export const DailyFields: React.FC<DailyFieldsProps> = ({ editTime, setEditTime }) => (
    <PopoverMenu
        label="Time of day"
        items={TIME_OF_DAY_OPTIONS}
        value={editTime}
        onChange={(next) => setEditTime(next as TimeOfDay)}
        testId="edit-time-of-day-select"
    />
);

interface WeeklyFieldsProps {
    editDays: number[];
    setEditDays: React.Dispatch<React.SetStateAction<number[]>>;
}

/**
 * CM-18: weekday indexes, and two-letter labels — a single letter cannot
 * distinguish Tue/Thu or Sat/Sun. 44px targets, and the task accent rather than
 * a raw `purple-600`.
 */
export const WeeklyFields: React.FC<WeeklyFieldsProps> = ({ editDays, setEditDays }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Days</label>
        <div className="flex flex-wrap gap-1.5">
            {WEEKDAY_FULL_LABELS.map((day, index) => (
                <Button
                    key={day}
                    type="button"
                    aria-pressed={editDays.includes(index)}
                    aria-label={day}
                    onClick={() => setEditDays(prev => prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index])}
                    variant={editDays.includes(index) ? 'primary' : 'secondary'}
                    className={`h-11 min-w-11 px-3 text-[10px] ${editDays.includes(index) ? 'bg-primary-600 hover:bg-primary-700' : ''}`}
                >
                    {WEEKDAY_COMPACT_LABELS[index]}
                </Button>
            ))}
        </div>
    </div>
);

interface MonthlyFieldsProps {
    editDaysOfMonth: number[];
    setEditDaysOfMonth: React.Dispatch<React.SetStateAction<number[]>>;
}

/**
 * The composer's half sheet, reused. This used to be a second inline 7x5 grid of
 * 31 buttons inside the editor — a full calendar in a form, in two places.
 */
export const MonthlyFields: React.FC<MonthlyFieldsProps> = ({ editDaysOfMonth, setEditDaysOfMonth }) => (
    <MonthlyDatesField value={editDaysOfMonth} onChange={setEditDaysOfMonth} />
);
