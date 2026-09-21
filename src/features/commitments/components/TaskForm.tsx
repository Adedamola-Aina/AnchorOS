/**
 * TaskForm - Multi-step commitment creation form
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Wizard steps and field components extracted to TaskFormParts.tsx
 */
// @ts-nocheck


import React, { useState, useMemo } from 'react';
import type { TaskType, TimeOfDay, TaskPriority, AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { ChevronDown } from 'lucide-react';
import { Modal } from '../../../components/shared/Modal';
import { PopoverMenu, TimeWheelPicker } from '../../../components/shared';
import { DailyTimeField, WeeklyDaysField, MonthlyDatesField, RepeatFields, reminderOutsidePreferredWindow } from './TaskFormParts';
import { PriorityIndicator } from './PriorityIndicator';
import type { QuickAddDraft } from '../utils/parseQuickAdd';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';
import { toDateOnly } from '../../../services/fabric/commitmentSchedule';

interface TaskFormProps { onClose: () => void; onAdd: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>; hasFamilyActive: boolean; /** CM-16: a draft parsed from the quick-add line, pre-filled for adjustment. */ initialDraft?: QuickAddDraft | null; }

/**
 * UX-CM-01: the composer used to OPEN on "Choose Frequency", so a user had to
 * classify before they could capture. It now opens on the name, with the cadence
 * defaulted and adjustable in place.
 *
 * UX-CM-02: it also rendered inline in the page flow — no sheet context, no
 * visible Save on the first step. It is now a Modal: one sheet, one dismiss, and
 * Save pinned in the footer so it is always reachable.
 *
 * UX-CM-09: the "Domain" jargon is gone (it is an Area now) and the priority
 * emoji are Lucide icons.
 */
/**
 * The composer's form id. The submit button lives in the modal's footer — outside
 * the form element — so it names the form it belongs to.
 */
const FORM_ID = 'commitment-composer-form';

const CADENCE_OPTIONS: { value: TaskType; label: string }[] = [
    { value: 'todo', label: 'One-off' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, onAdd, hasFamilyActive, initialDraft }) => {
    // CM-16: a quick-add draft seeds every field, so "Adjust" opens a composer
    // that already knows what the user typed.
    const [newTaskTitle, setNewTaskTitle] = useState(initialDraft?.title ?? '');
    const [newTaskType, setNewTaskType] = useState<TaskType>(initialDraft?.type ?? 'daily');
    const [newTaskScope, setNewTaskScope] = useState<'personal' | 'family'>('personal');
    const [newTaskTime, setNewTaskTime] = useState<TimeOfDay>('morning');
    const [newTaskDays, setNewTaskDays] = useState<number[]>(initialDraft?.daysOfWeek ?? []);
    const [newTaskDates, setNewTaskDates] = useState<number[]>(initialDraft?.dayOfMonth ? [initialDraft.dayOfMonth] : []);
    const [newTaskDomain, setNewTaskDomain] = useState('Personal Development');
    const [newTaskReminder, setNewTaskReminder] = useState(initialDraft?.reminderTime ?? '');
    // CM-17: the real schedule model — interval, anchor date, end date, due date.
    /**
     * CM-17: the anchor date defaults to today, so a recurring commitment starts
     * now instead of at an unspecified point. Reported from iOS: "there is no
     * clear indicator whether a commitment defaults to starting today if left
     * blank, or if START DATE is required".
     */
    const defaultStartDate = useMemo(() => toDateOnly(new Date()), []);
    const [newTaskInterval] = useState(initialDraft?.interval ?? 1);
    const [newTaskStart, setNewTaskStart] = useState(defaultStartDate);
    const [newTaskEnd, setNewTaskEnd] = useState('');
    const [newTaskDue, setNewTaskDue] = useState(initialDraft?.dueDate ?? '');
    const [newTaskNotes, setNewTaskNotes] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
    const [isSaving, setIsSaving] = useState(false);
    /**
     * The composer used to open with every field it owned — Area, Priority,
     * Context, the whole recurrence model, Notes and a reminder — so a
     * commitment that needs none of them still had to be read past all of them
     * ("the options are endless"). Capture is name + cadence + when; everything
     * else is a refinement, so it lives one deliberate tap away. Nothing was
     * removed: every field is reachable, and a non-default value is flagged on
     * the toggle so a collapsed option can never hide itself.
     */
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const domains = ['Health', 'Fitness', 'Work', 'Bible', 'Personal Development', 'Financial'];

    // Guard against losing unsaved form data on accidental tab switch
    const isDirty = useMemo(() => !!(newTaskTitle.trim() || newTaskReminder || newTaskNotes.trim()), [newTaskTitle, newTaskReminder, newTaskNotes]);
    useUnsavedChanges(isDirty);

    /**
     * A refinement the user actually set must never hide behind the toggle, so
     * the toggle states that "More options" is carrying something non-default.
     */
    const hasRefinements = useMemo(
        () => newTaskDomain !== 'Personal Development'
            || newTaskPriority !== 'medium'
            || newTaskScope !== 'personal'
            || !!newTaskNotes.trim()
            || !!newTaskReminder
            || newTaskInterval > 1
            || newTaskStart !== defaultStartDate
            || !!newTaskEnd
            || !!newTaskDue,
        [newTaskDomain, newTaskPriority, newTaskScope, newTaskNotes, newTaskReminder, newTaskInterval, newTaskStart, defaultStartDate, newTaskEnd, newTaskDue],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const taskPayload: Omit<AnchorTask, 'id' | 'createdAt'> = { title: newTaskTitle, type: newTaskType, completed: false, category: newTaskScope, domain: newTaskDomain, reminderTime: newTaskReminder || undefined, notes: newTaskNotes.trim() || undefined, priority: newTaskPriority };
            if (newTaskType === 'daily') taskPayload.timeOfDay = newTaskTime;
            if (newTaskType === 'weekly') taskPayload.daysOfWeek = newTaskDays;
            if (newTaskType === 'monthly') taskPayload.daysOfMonth = newTaskDates;
            // CM-17: only written when the user actually set them, so the stored
            // document stays clean and the presets keep their old shape.
            if (newTaskInterval > 1) taskPayload.interval = newTaskInterval;
            if (newTaskType === 'todo') { if (newTaskDue) taskPayload.dueDate = newTaskDue; }
            else {
                if (newTaskStart) taskPayload.startDate = newTaskStart;
                if (newTaskEnd) taskPayload.endDate = newTaskEnd;
            }
            await onAdd(taskPayload);
        } finally { setIsSaving(false); }
    };

    return (
        <Modal
            isOpen
            onClose={onClose}
            title="New Commitment"
            maxWidth="max-w-2xl"
            footer={
                <div className="flex justify-end">
                    {/* The button names its form, because the footer lives outside it. */}
                    <Button type="submit" form={FORM_ID} isLoading={isSaving} className="px-8">Save Commitment</Button>
                </div>
            }
        >
            <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
                {/* UX-CM-01: capture first — the name is the first control, not a classifier. */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="commitment-name" className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Name</label>
                    {/*
                      * Deliberately NOT `autoFocus`.
                      *
                      * On iOS a programmatic focus is not tied to a user gesture, so
                      * the keyboard never opens — and because the field is then
                      * already `document.activeElement`, the tap that should open it
                      * fires no `focus` event, leaving it untypeable. The user's tap
                      * does the focusing.
                      */}
                    <input
                        id="commitment-name"
                        type="text"
                        placeholder="e.g. Morning Prayer, Gym, Rent Payment"
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-card border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        data-testid="task-name"
                    />
                </div>

                {/* Cadence is adjustable in place, so nothing has to be classified up front. */}
                <div className="flex flex-col gap-1.5">
                    <span id="cadence-label" className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">How often?</span>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="cadence-label" data-testid="cadence-selector">
                        {CADENCE_OPTIONS.map(({ value, label }) => (
                            <Button key={value} type="button" onClick={() => setNewTaskType(value)} variant={newTaskType === value ? 'primary' : 'secondary'} className="flex-1 capitalize text-xs">{label}</Button>
                        ))}
                    </div>
                </div>

                {/*
                    * When. The cadence and its specific day/time define the
                    * commitment, so they stay in the default view.
                    */}
                <div className="space-y-3 min-w-0">
                    {newTaskType === 'daily' && <DailyTimeField value={newTaskTime} onChange={setNewTaskTime} />}
                    {newTaskType === 'weekly' && <WeeklyDaysField value={newTaskDays} onChange={setNewTaskDays} />}
                    {newTaskType === 'monthly' && <MonthlyDatesField value={newTaskDates} onChange={setNewTaskDates} />}
                </div>

                {/*
                  * Everything below is a refinement, not part of capturing the
                  * commitment. It is one tap away rather than permanently in the
                  * way — and the toggle states when it is holding something, so a
                  * collapsed option can never hide itself.
                  */}
                <button
                    type="button"
                    onClick={() => setShowMoreOptions((open) => !open)}
                    aria-expanded={showMoreOptions}
                    aria-controls="composer-more-options"
                    data-testid="composer-more-toggle"
                    className="flex w-full items-center justify-between gap-2 min-h-11 px-3 py-2.5 rounded-card border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        {/*
                          * The glyph reports the state, not the concept: a chevron
                          * that points down when closed and up when open. A sliders
                          * icon said "settings" while the label said "Hide".
                          */}
                        <ChevronDown
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${showMoreOptions ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                        {showMoreOptions ? 'Fewer options' : 'More options'}
                    </span>
                    {hasRefinements && !showMoreOptions && (
                        <span data-testid="composer-more-set" className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                            Set
                        </span>
                    )}
                </button>

                {showMoreOptions && (
                    <div id="composer-more-options" data-testid="composer-more-options" className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-1.5">
                            <PopoverMenu
                                label="Area"
                                items={domains.map(d => ({ value: d, label: d }))}
                                value={newTaskDomain}
                                onChange={setNewTaskDomain}
                                testId="domain-select"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Priority</label>
                            <div className="flex gap-2" data-testid="priority-selector">
                                {(['high', 'medium', 'low'] as const).map(p => (
                                    <Button key={p} type="button" onClick={() => setNewTaskPriority(p)} variant={newTaskPriority === p ? 'primary' : 'secondary'} className="flex-1 text-xs">
                                        <PriorityIndicator priority={p} tone={newTaskPriority === p ? 'inherit' : 'auto'} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                        {hasFamilyActive && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Context</label>
                                <div className="flex gap-2">
                                    {['personal', 'family'].map((s) => (<Button key={s} type="button" onClick={() => setNewTaskScope(s as 'personal' | 'family')} variant={newTaskScope === s ? 'primary' : 'secondary'} className="flex-1 capitalize">{s}</Button>))}
                                </div>
                            </div>
                        )}
                        {/* CM-17: interval, anchor and end date — and the due date
                            for a one-off. Optional; the preset is unchanged if
                            the user ignores them.
                            The interval is deliberately NOT offered here: the
                            "How often?" control above already sets the frequency,
                            and a second picker reading "Every day" under "Daily"
                            was the same question asked twice. "every 2 weeks"
                            typed into Find or add still creates an interval, and
                            the edit form can change it afterwards. */}
                        <RepeatFields
                            type={newTaskType}
                            interval={newTaskInterval}
                            startDate={newTaskStart}
                            onStartDateChange={setNewTaskStart}
                            endDate={newTaskEnd}
                            onEndDateChange={setNewTaskEnd}
                            dueDate={newTaskDue}
                            onDueDateChange={setNewTaskDue}
                        />
                    {/* Notes field (COMM-006) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Notes</label>
                            <textarea
                                placeholder="Add details, motivation, or context (optional)"
                                maxLength={500}
                                rows={2}
                                value={newTaskNotes}
                                onChange={(e) => setNewTaskNotes(e.target.value)}
                                data-testid="task-notes"
                                className="w-full min-h-[44px] px-3 py-2.5 rounded-card border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none text-sm"
                            />
                        </div>
                        {/* Reminder field: full-width row (BUG-092) */}
                        <div className="flex flex-col gap-1.5">
                            <div data-testid="reminder-field" className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-card bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <TimeWheelPicker
                                    label="Reminder"
                                    value={newTaskReminder}
                                    onChange={setNewTaskReminder}
                                    placeholder="Optional"
                                    testId="reminder-input"
                                />
                            </div>
                            {/*
                              * The two time controls were reported as competing:
                              * "Preferred time: Afternoon" beside "Reminder: 9:00 AM"
                              * with nothing explaining how they relate. The reminder
                              * is a notification; the preferred time only orders the
                              * day. When they disagree, say so instead of leaving the
                              * user to notice.
                              */}
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Sends a notification at this exact time — separate from your preferred time of day.
                            </p>
                            {newTaskType === 'daily' && reminderOutsidePreferredWindow(newTaskTime, newTaskReminder) && (
                                <p data-testid="reminder-window-note" className="text-[11px] text-amber-600 dark:text-amber-400">
                                    This reminder is at {newTaskReminder}, outside your preferred {newTaskTime}.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/*
                  * UX-CM-02: one dismiss (the sheet's own close) and a pinned Save.
                  * The Save now lives in the modal's footer (see `footer` above), so
                  * it is always reachable and never scrolls over the fields.
                  */}
            </form>
        </Modal>
    );
};
