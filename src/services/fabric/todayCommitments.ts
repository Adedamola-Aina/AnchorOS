/**
 * The canonical "today" for a user's commitments.
 *
 * Why this module exists: Home said "15 tasks remaining", the assistant's Today card
 * said "8 daily commitments still pending", the Focus card said "3 tasks remaining" and
 * the same card mentioned "7 carried over" — four numbers, three of them computed in
 * different places, and no way for a reader to tell how they relate.
 *
 * One selector now answers the question, for Home, for the assistant's briefing and for
 * Ask Anchor, so no two surfaces can disagree:
 *
 *   due        = scheduled for today, plus what was carried over from an earlier day
 *                (this is `getDueToday` — the definition the assistant and the badge
 *                already used; nothing new is invented here)
 *   remaining  = those not yet completed today
 *   focus      = a prioritised subset of `remaining` (never a second total)
 *
 * The relationship the UI must state plainly: `dueTotal = scheduledToday + carriedOver`,
 * and `focus ⊆ remaining ⊆ dueTotal`.
 */
import type { AnchorTask } from '../../types';
import { getDueToday, isOverdue, isScheduledOn } from './commitmentSchedule';

/** How many commitments Today's Focus offers. A shortlist, not a workload. */
export const FOCUS_LIMIT = 3;

export interface TodayCommitmentsView {
    /** Everything that needs attention today, in the order the list shows it. */
    due: AnchorTask[];
    dueTotal: number;
    /** Due because it falls on today. */
    scheduledToday: number;
    /** Due because it was carried over from an earlier scheduled day. */
    carriedOver: number;
    /** Of `due`, how many are already done (the flag refers to today's occurrence). */
    completedToday: number;
    /** Of `due`, how many are still outstanding. */
    remaining: number;
    /** The prioritised shortlist drawn from `remaining`. */
    focus: AnchorTask[];
    focusCount: number;
}

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

/**
 * Priority first, then whatever has waited longest (a carried-over commitment has), then
 * title — deterministic, so the same data always shortlists the same way and a
 * screenshot can be repeated.
 */
const byFocusRank = (now: Date) => (a: AnchorTask, b: AnchorTask): number => {
    const rank = (PRIORITY_RANK[a.priority ?? 'medium'] ?? 1) - (PRIORITY_RANK[b.priority ?? 'medium'] ?? 1);
    if (rank !== 0) return rank;
    const carried = Number(isOverdue(b, now)) - Number(isOverdue(a, now));
    if (carried !== 0) return carried;
    return a.title.localeCompare(b.title);
};

export function selectTodayCommitments(tasks: AnchorTask[], now: Date): TodayCommitmentsView {
    const due = getDueToday(tasks, now);
    const remainingTasks = due.filter((task) => !task.completed);
    const scheduledToday = due.filter((task) => isScheduledOn(task, now)).length;

    return {
        due,
        dueTotal: due.length,
        scheduledToday,
        carriedOver: due.length - scheduledToday,
        completedToday: due.length - remainingTasks.length,
        remaining: remainingTasks.length,
        focus: [...remainingTasks].sort(byFocusRank(now)).slice(0, FOCUS_LIMIT),
        focusCount: Math.min(remainingTasks.length, FOCUS_LIMIT),
    };
}

interface TodayAlert {
    id: string;
    title: string;
    detail: string;
    /** Where acting on it goes. */
    href: string;
    actionLabel: string;
}

/** Below this, carried-over work is an ordinary day rather than something to flag. */
const ALERT_CARRIED = 3;

/**
 * Alerts render only when they are actionable AND not already said.
 *
 * The overcommitment insight claims carried-over work when the day is heavy, so this
 * alert deliberately stands down in that case — two blocks making the same point is how
 * a dashboard starts to feel like noise. What is left is the complementary condition: a
 * few stragglers on an otherwise ordinary day, which the insight is too restrained to
 * mention.
 */
export function selectTodayAlerts(
    today: TodayCommitmentsView,
    options: { shownInsightId?: string | null } = {},
): TodayAlert[] {
    const alerts: TodayAlert[] = [];

    if (today.carriedOver >= ALERT_CARRIED && options.shownInsightId !== 'home-insight-overcommitment') {
        alerts.push({
            id: 'alert-carried-over',
            title: `${today.carriedOver} commitments carried over`,
            detail: 'They were due on an earlier day and are still outstanding.',
            actionLabel: 'Review them',
            href: '/commitments',
        });
    }
    return alerts;
}
