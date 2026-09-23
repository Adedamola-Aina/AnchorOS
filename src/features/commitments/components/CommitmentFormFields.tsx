/**
 * The commitment form's fields — one implementation of each, shared by create and
 * edit.
 *
 * These used to exist twice: `TaskForm` built its own Name/Cadence/Area/Priority/
 * Scope/Notes/Reminder, and `EditTaskForm` + `EditTaskFormFields` built a second
 * set of the same controls with different labels ("Title" vs "Name"), different
 * layouts (a `justify-between` weekday strip vs a wrapping one) and different
 * accessibility (an associated label in one, an orphan label in the other).
 *
 * Field rules, applied here once:
 *   - every label is associated with its control (htmlFor/id or aria-labelledby);
 *   - every control is at least 44px tall;
 *   - a selected state is carried by `aria-pressed`/`aria-checked` as well as colour;
 *   - a field that cannot be changed says so instead of offering a dead control.
 */



import React from 'react';
import { ChevronDown, Repeat } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import type { TaskPriority, TaskType, TimeOfDay } from '../../../types';
import { PopoverMenu, SegmentedControl, TimeWheelPicker } from '../../../components/shared';
import { DailyTimeField, MonthlyDatesField, RepeatFields, WeeklyDaysField, reminderOutsidePreferredWindow } from './TaskFormParts';
import { PriorityIndicator } from './PriorityIndicator';
import { CADENCE_OPTIONS, COMMITMENT_AREAS, type CommitmentFieldSetter, type CommitmentFormValues } from './commitmentFormModel';

const FIELD_LABEL = 'text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400';

interface NameFieldProps { value: string; onChange: (value: string) => void; error?: string }
export const CommitmentNameField: React.FC<NameFieldProps> = ({ value, onChange, error }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor="commitment-name" className={FIELD_LABEL}>Name</label>
        {/*
          * Deliberately NOT `autoFocus`.
          *
          * On iOS a programmatic focus is not tied to a user gesture, so the
          * keyboard never opens — and because the field is then already
          * `document.activeElement`, the tap that should open it fires no `focus`
          * event, leaving it untypeable. The user's tap does the focusing.
          */}
        <input
            id="commitment-name"
            type="text"
            placeholder="e.g. Morning Prayer, Gym, Rent Payment"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            data-testid="task-name"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'commitment-name-error' : undefined}
            className={`w-full min-h-[44px] px-3 py-2.5 rounded-card border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 ${error ? 'border-danger' : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'}`}
        />
        {error && <p id="commitment-name-error" role="alert" data-testid="commitment-name-error" className="text-xs text-danger">{error}</p>}
    </div>
);

interface CadenceFieldProps { value: TaskType; onChange: (value: TaskType) => void; /** Edit mode: the cadence is part of the stored document. */ locked?: boolean }
export const CadenceField: React.FC<CadenceFieldProps> = ({ value, onChange, locked = false }) => {
    const current = CADENCE_OPTIONS.find((option) => option.value === value);

    if (locked) {
        return (
            <div className="flex flex-col gap-1.5">
                <span className={FIELD_LABEL}>Repeats</span>
                <div data-testid="cadence-locked" className="flex items-center gap-2 min-h-[44px] px-3 rounded-card border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Repeat className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    {current?.label ?? value}
                    <span className="sr-only">— the cadence is fixed after creation; its schedule below is editable.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1.5">
            <span id="cadence-label" className={FIELD_LABEL}>How often?</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="cadence-label" data-testid="cadence-selector">
                {CADENCE_OPTIONS.map(({ value: option, label }) => (
                    <Button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        variant={value === option ? 'primary' : 'secondary'}
                        aria-pressed={value === option}
                        className="flex-1 capitalize text-xs"
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

interface AreaFieldProps { value: string; onChange: (value: string) => void }
export const AreaField: React.FC<AreaFieldProps> = ({ value, onChange }) => (
    <PopoverMenu
        label="Area"
        items={COMMITMENT_AREAS.map((area) => ({ value: area, label: area }))}
        value={value}
        onChange={onChange}
        testId="domain-select"
    />
);

interface PriorityFieldProps { value: TaskPriority; onChange: (value: TaskPriority) => void }
export const PriorityField: React.FC<PriorityFieldProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <span id="priority-label" className={FIELD_LABEL}>Priority</span>
        <div className="flex gap-2" role="group" aria-labelledby="priority-label" data-testid="priority-selector">
            {(['high', 'medium', 'low'] as const).map((priority) => (
                <Button
                    key={priority}
                    type="button"
                    onClick={() => onChange(priority)}
                    variant={value === priority ? 'primary' : 'secondary'}
                    aria-pressed={value === priority}
                    className="flex-1 text-xs"
                >
                    {/* The indicator carries `data-testid="priority-<level>"` itself. */}
                    <PriorityIndicator priority={priority} tone={value === priority ? 'inherit' : 'auto'} />
                </Button>
            ))}
        </div>
    </div>
);

interface ScopeFieldProps { value: 'personal' | 'family'; onChange: (value: 'personal' | 'family') => void }
export const ScopeField: React.FC<ScopeFieldProps> = ({ value, onChange }) => (
    <SegmentedControl
        label="Who is this for?"
        options={[{ value: 'personal', label: 'Personal' }, { value: 'family', label: 'Family' }]}
        value={value}
        onChange={(next) => onChange(next as 'personal' | 'family')}
        testId="scope-selector"
    />
);

interface NotesFieldProps { value: string; onChange: (value: string) => void }
export const NotesField: React.FC<NotesFieldProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor="commitment-notes" className={FIELD_LABEL}>Notes</label>
        <textarea
            id="commitment-notes"
            placeholder="Add details, motivation, or context (optional)"
            maxLength={500}
            rows={2}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            data-testid="task-notes"
            className="w-full min-h-[44px] px-3 py-2.5 rounded-card border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
        />
    </div>
);

interface ReminderFieldProps { value: string; onChange: (value: string) => void; timeOfDay: TimeOfDay; showWindowNote?: boolean }
export const ReminderField: React.FC<ReminderFieldProps> = ({ value, onChange, timeOfDay, showWindowNote = false }) => (
    <div className="flex flex-col gap-1.5">
        <div data-testid="reminder-field" className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-card bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <TimeWheelPicker label="Reminder" value={value} onChange={onChange} placeholder="Optional" testId="reminder-input" />
        </div>
        {/*
          * The two time controls were reported as competing: "Preferred time:
          * Afternoon" beside "Reminder: 9:00 AM" with nothing explaining how they
          * relate. The reminder is a notification; the preferred time only orders
          * the day. When they disagree, say so instead of leaving the user to notice.
          */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Sends a notification at this exact time — separate from your preferred time of day.
        </p>
        {showWindowNote && reminderOutsidePreferredWindow(timeOfDay, value) && (
            <p data-testid="reminder-window-note" className="text-[11px] text-amber-600 dark:text-amber-400">
                This reminder is at {value}, outside your preferred {timeOfDay}.
            </p>
        )}
    </div>
);

interface RecurrenceFieldsProps {
    values: CommitmentFormValues;
    onChange: CommitmentFieldSetter;
    /** Create hides the interval picker: "Every day" under "Daily" asked the same question twice. */
    showInterval?: boolean;
    error?: string;
}

/**
 * The cadence's own configuration — the one control that defines the cadence, and
 * nothing else. The schedule bounds (interval, start, end, due) live under "More
 * options" with the other refinements, so a plain daily commitment never has to be
 * read past them.
 */
export const RecurrenceFields: React.FC<RecurrenceFieldsProps> = ({ values, onChange, error }) => (
    <div className="space-y-3 min-w-0">
        {values.type === 'daily' && <DailyTimeField value={values.timeOfDay} onChange={(next) => onChange('timeOfDay', next)} />}
        {values.type === 'weekly' && <WeeklyDaysField value={values.daysOfWeek} onChange={(next) => onChange('daysOfWeek', next)} />}
        {values.type === 'monthly' && <MonthlyDatesField value={values.daysOfMonth} onChange={(next) => onChange('daysOfMonth', next)} />}
        {error && <p role="alert" data-testid="recurrence-error" className="text-xs text-danger">{error}</p>}
    </div>
);

interface ScheduleBoundsProps {
    values: CommitmentFormValues;
    onChange: CommitmentFieldSetter;
    /** Create hides the interval picker: "Every day" under "Daily" asked the same question twice. */
    showInterval?: boolean;
}

/** CM-17's schedule model: how often it repeats, when it starts, when it retires. */
export const ScheduleBoundsFields: React.FC<ScheduleBoundsProps> = ({ values, onChange, showInterval = false }) => (
    <RepeatFields
        type={values.type}
        interval={values.interval}
        onIntervalChange={showInterval ? (next) => onChange('interval', next) : undefined}
        startDate={values.startDate}
        onStartDateChange={(next) => onChange('startDate', next)}
        endDate={values.endDate}
        onEndDateChange={(next) => onChange('endDate', next)}
        dueDate={values.dueDate}
        onDueDateChange={(next) => onChange('dueDate', next)}
    />
);



interface MoreOptionsToggleProps { open: boolean; onToggle: () => void; hasRefinements: boolean }
/** One disclosure control, so a collapsed panel can never hide a value the user set. */
export const MoreOptionsToggle: React.FC<MoreOptionsToggleProps> = ({ open, onToggle, hasRefinements }) => (
    <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="composer-more-options"
        data-testid="composer-more-toggle"
        className="flex w-full items-center justify-between gap-2 min-h-11 px-3 py-2.5 rounded-card border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
    >
        <span className="flex items-center gap-2">
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            {open ? 'Fewer options' : 'More options'}
        </span>
        {hasRefinements && !open && (
            <span data-testid="composer-more-set" className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Set
            </span>
        )}
    </button>
);

