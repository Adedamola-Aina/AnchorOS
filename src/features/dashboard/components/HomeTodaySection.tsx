/**
 * HomeTodaySection — the deterministic half of Home (CM-30).
 *
 * This is product logic, not assistant output: it renders whether or not Anchor AI is
 * enabled, because "what do I have today" does not depend on a model.
 *
 * It exists because four numbers for one day were being computed in three places:
 *   15 tasks remaining · 8 daily commitments still pending · 3 priorities · 7 carried over
 * None of them were wrong, and together they were unreadable. The brief now states the
 * arithmetic — `due = scheduled today + carried over` — and Today's Focus says out loud
 * that it is a *shortlist drawn from* that work, not a second total.
 */
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { TodayCommitmentsView } from '../../../services/fabric/todayCommitments';
import { describeCadence } from '../../commitments/utils/parseQuickAdd';

interface HomeTodaySectionProps {
    today: TodayCommitmentsView;
    /** Commitments the user tracks at all — lets an empty day say *why* it is empty. */
    trackedCommitments: number;
    nextDueLabel?: string;
    onOpenCommitments: () => void;
}

export const HomeTodaySection: React.FC<HomeTodaySectionProps> = ({
    today,
    trackedCommitments,
    nextDueLabel,
    onOpenCommitments,
}) => {
    const hasWork = today.dueTotal > 0;

    const emptyMessage = trackedCommitments === 0
        ? 'You have no commitments yet.'
        : nextDueLabel
            ? `Nothing due today — next up ${nextDueLabel}.`
            : 'Nothing due today.';

    return (
        <section aria-labelledby="home-today-heading" data-testid="home-today" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <h2 id="home-today-heading" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    Today
                </h2>
                {hasWork && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400" data-testid="home-today-progress">
                        {today.completedToday} of {today.dueTotal} done
                    </span>
                )}
            </div>

            {!hasWork ? (
                <p className="text-sm text-slate-600 dark:text-slate-300" data-testid="home-today-empty">{emptyMessage}</p>
            ) : (
                <>
                    {/*
                      * One sentence, one relationship. This is the line that replaces the
                      * three competing totals: everything the user needs to reconcile
                      * what they are about to read.
                      */}
                    <p className="text-sm text-slate-700 dark:text-slate-200" data-testid="home-today-brief">
                        <strong className="font-semibold">{today.remaining} still to do</strong>
                        {' — '}
                        {today.dueTotal} due today, {today.scheduledToday} scheduled for today
                        {today.carriedOver > 0 && ` and ${today.carriedOver} carried over`}.
                    </p>

                    {today.focusCount > 0 && (
                        <div data-testid="home-focus">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Today's Focus — {today.focusCount} of {today.remaining} priorities
                            </p>
                            <ul className="mt-1.5 space-y-1">
                                {today.focus.map((task) => (
                                    <li key={task.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                                        <span className="truncate">{task.title}</span>
                                        <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider text-slate-400">
                                            {describeCadence(task.type)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onOpenCommitments}
                        data-testid="home-today-open"
                        className="inline-flex items-center gap-1 min-h-11 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
                    >
                        Open commitments
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                </>
            )}
        </section>
    );
};