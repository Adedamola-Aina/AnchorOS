/**
 * TaskForm field components
 * Extracted from TaskForm.tsx per CLAUDE.md §3.2
 *
 * The old `FrequencyStep` ("Choose Frequency") and `DetailsHeader` are gone:
 * UX-CM-01 removed the classification-first step, so the composer opens on the
 * name with the cadence adjustable in place.
 *
 * The controls themselves are now OS-shaped rather than form-shaped. A specific
 * value — a time of day, a repeat interval, which dates of the month — is a *row*
 * that opens a pull-down menu or a half sheet over the screen, the way Apple
 * Reminders and the platform pickers do it, instead of a grid of buttons sitting
 * inside the composer. Nothing became less reachable; the form simply stopped
 * rendering a calendar in the middle of itself.
 */
// @ts-nocheck


import React, { useState } from 'react';
import { ChevronRight, Repeat } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import type { TaskType, TimeOfDay } from '../../../types';
import { WEEKDAY_COMPACT_LABELS, WEEKDAY_FULL_LABELS } from '../../../services/fabric/commitmentSchedule';
import { InlineDatePicker, PopoverMenu } from '../../../components/shared';
import { MonthDaysSheet } from './MonthDaysSheet';

interface DailyTimeFieldProps { value: TimeOfDay; onChange: (v: TimeOfDay) => void; }

const TIME_OF_DAY_OPTIONS = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'any', label: 'Anytime' },
];

/**
 * A pull-down menu, not four buttons: it is one value out of four. This is the
 * Apple Reminders pattern for a short closed set, and it stops the composer
 * spending a whole grid row on a single choice.
 */
export const DailyTimeField: React.FC<DailyTimeFieldProps> = ({ value, onChange }) => (
    <PopoverMenu
        label="Preferred time"
        items={TIME_OF_DAY_OPTIONS}
        value={value}
        onChange={(next) => onChange(next as TimeOfDay)}
        testId="time-of-day-select"
    />
);

interface WeeklyDaysFieldProps { value: number[]; onChange: (days: number[]) => void; }
/**
 * CM-18: weekday indexes with two-letter labels. This control used to render
 * "S M T W T F S", where T and S each stood for two different days.
 */
export const WeeklyDaysField: React.FC<WeeklyDaysFieldProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">On which days?</label>
        <div className="flex justify-between gap-1">
            {WEEKDAY_FULL_LABELS.map((day, index) => (
                <button key={day} type="button" onClick={() => onChange(value.includes(index) ? value.filter(d => d !== index) : [...value, index])}
                    aria-pressed={value.includes(index)} aria-label={day}
                    className={`w-11 h-11 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${value.includes(index) ? 'bg-purple-600 text-white border-transparent' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-purple-300'}`}>{WEEKDAY_COMPACT_LABELS[index]}</button>
            ))}
        </div>
    </div>
);

interface MonthlyDatesFieldProps { value: number[]; onChange: (dates: number[]) => void; }

/** "1, 15" · "3 dates" · "Not set" — the row has to say what it holds. */
function describeDays(days: number[]): string {
    if (days.length === 0) return 'Not set';
    if (days.length <= 3) return days.join(', ');
    return `${days.length} dates`;
}

/**
 * A row that opens a half sheet. This used to be a 7×5 grid of 31 buttons
 * rendered inline — a full calendar inside the composer, which is exactly what
 * the platform pickers exist to avoid. The row states the current selection, so
 * collapsing it hides nothing.
 */
export const MonthlyDatesField: React.FC<MonthlyDatesFieldProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-1.5">
                <label id="month-days-label" className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">On which dates?</label>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-labelledby="month-days-label"
                    aria-haspopup="dialog"
                    data-testid="month-days-row"
                    className="flex w-full items-center justify-between gap-2 min-h-[44px] px-3 py-2.5 rounded-card border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white hover:border-task-300 dark:hover:border-task-700 transition-colors"
                >
                    <span className={value.length ? 'font-medium' : 'text-slate-400'}>{describeDays(value)}</span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
                </button>
            </div>
            <MonthDaysSheet isOpen={isOpen} value={value} onChange={onChange} onClose={() => setIsOpen(false)} />
        </>
    );
};

/** CM-17: the recurrence unit an interval multiplies. */
const INTERVAL_UNITS: Record<string, { singular: string; plural: string }> = {
    daily: { singular: 'day', plural: 'days' },
    weekly: { singular: 'week', plural: 'weeks' },
    monthly: { singular: 'month', plural: 'months' },
};

interface RepeatFieldsProps {
    type: TaskType;
    interval: number;
    /**
     * Optional. The interval is only offered where the cadence is already fixed —
     * i.e. in the edit form. In the composer the "How often?" control is the
     * single frequency picker, and a second one reading "Every day" beneath
     * "Daily" was pure duplication.
     */
    onIntervalChange?: (value: number) => void;
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
            {unit && onIntervalChange && (
                <PopoverMenu
                    label="Repeats"
                    icon={<Repeat className="w-4 h-4 text-slate-400" aria-hidden="true" />}
                    items={[1, 2, 3, 4].map((n) => ({
                        value: String(n),
                        label: n === 1 ? `Every ${unit.singular}` : `Every ${n} ${unit.plural}`,
                    }))}
                    value={String(interval)}
                    onChange={(next) => onIntervalChange(Number(next))}
                    testId="repeat-interval-select"
                />
            )}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{type === 'todo' ? 'Due date (optional)' : 'Starts'}</label>
                <InlineDatePicker
                    value={type === 'todo' ? (dueDate || '') : startDate}
                    onChange={type === 'todo' ? (v) => onDueDateChange?.(v) : onStartDateChange}
                    label={type === 'todo' ? 'Due date' : 'Start date'}
                    testId={type === 'todo' ? 'due-date-input' : 'start-date-input'}
                />
            </div>
            {type !== 'todo' && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Ends <span className="normal-case font-medium">(optional)</span></label>
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
