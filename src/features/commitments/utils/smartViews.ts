/**
 * CM-21 / CM-25 / CM-15 — smart views, done history and search.
 *
 * The habit lens is "what do I owe right now?", not "browse my backlog". All of
 * this derives from the one schedule model (`commitmentSchedule`), so a view can
 * never disagree with the rows, the badge or the assistant.
 */

import type { AnchorTask } from '../../../types';
import { isOverdue, isScheduledOn, nextScheduledOnOrAfter } from '../../../services/fabric/commitmentSchedule';

export type SmartViewId = 'today' | 'overdue' | 'week' | 'later' | 'done' | 'all';

export interface SmartView {
    id: SmartViewId;
    label: string;
    /** Spoken description, so the view is not just a word. */
    description: string;
}

export const SMART_VIEWS: readonly SmartView[] = [
    { id: 'today', label: 'Today', description: 'Due today or carried over' },
    { id: 'overdue', label: 'Overdue', description: 'Carried over from an earlier day' },
    { id: 'week', label: 'This week', description: 'Due in the next seven days' },
    { id: 'later', label: 'Later', description: 'Due more than a week from now' },
    { id: 'done', label: 'Done', description: 'Completed commitments' },
    { id: 'all', label: 'All', description: 'Every commitment' },
] as const;

function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

/** Whole days from `now` to `date` (negative when in the past). */
export function daysUntil(date: Date, now: Date): number {
    return Math.round((startOfDay(date).getTime() - startOfDay(now).getTime()) / 86400000);
}

/** Next occurrence within `withinDays` days from today (today itself excluded). */
function dueWithin(task: AnchorTask, now: Date, withinDays: number): boolean {
    if (task.completed) return false;
    const next = nextScheduledOnOrAfter(task, now);
    if (!next) return false;
    const days = daysUntil(next, now);
    return days > 0 && days <= withinDays;
}

/**
 * The smart view filter. Views are lenses over the same list — `overdue` is a
 * subset of `today` on purpose (today = "what I owe right now", overdue = "the
 * part of it I carried over"), which is what makes the Overdue view actionable.
 */
export function filterBySmartView(tasks: AnchorTask[], view: SmartViewId, now: Date): AnchorTask[] {
    switch (view) {
        case 'today':
            return tasks.filter((task) => isScheduledOn(task, now) || isOverdue(task, now));
        case 'overdue':
            return tasks.filter((task) => isOverdue(task, now));
        case 'week':
            return tasks.filter((task) => dueWithin(task, now, 7));
        case 'later':
            return tasks.filter((task) => {
                if (task.completed) return false;
                const next = nextScheduledOnOrAfter(task, now);
                return next !== null && daysUntil(next, now) > 7;
            });
        case 'done':
            return tasks.filter((task) => task.completed);
        case 'all':
        default:
            return tasks;
    }
}

/**
 * CM-15 — search across title, notes and area. Empty query returns everything,
 * so the control degrades to "no filter" instead of "no results".
 */
export function searchCommitments(tasks: AnchorTask[], query: string): AnchorTask[] {
    const needle = query.trim().toLowerCase();
    if (!needle) return tasks;
    return tasks.filter((task) => {
        const haystack = [task.title, task.notes ?? '', task.domain ?? ''].join(' ').toLowerCase();
        return haystack.includes(needle);
    });
}

export interface CompletedGroup {
    label: string;
    tasks: AnchorTask[];
}

/**
 * CM-25 — "Done" history by period, instead of erasing the work. Progress you
 * cannot see is not motivation, and it is also the source for streaks.
 */
export function groupCompletedByPeriod(tasks: AnchorTask[], now: Date): CompletedGroup[] {
    const completed = tasks.filter((task) => task.completed);
    const groups: Record<string, AnchorTask[]> = { Today: [], 'This week': [], Earlier: [] };

    for (const task of completed) {
        const done = task.lastCompletedAt ? new Date(task.lastCompletedAt) : null;
        if (!done || Number.isNaN(done.getTime())) {
            groups.Earlier.push(task);
            continue;
        }
        const days = daysUntil(done, now);
        if (days === 0) groups.Today.push(task);
        else if (days >= -6) groups['This week'].push(task);
        else groups.Earlier.push(task);
    }

    return (['Today', 'This week', 'Earlier'] as const)
        .map((label) => ({ label, tasks: groups[label] }))
        .filter((group) => group.tasks.length > 0);
}

/** A one-line summary of what a view holds, for the empty state. */
export function describeSmartView(view: SmartViewId, count: number): string {
    const found = SMART_VIEWS.find((entry) => entry.id === view);
    if (!found) return '';
    if (count === 0) return `Nothing in ${found.label} — ${found.description.toLowerCase()}.`;
    return `${count} ${count === 1 ? 'commitment' : 'commitments'} · ${found.description.toLowerCase()}`;
}
