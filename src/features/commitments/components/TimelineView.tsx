import React from 'react';
import type { AnchorTask } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Check, Circle, Clock } from 'lucide-react';
import { Badge } from '../../../components/shared';
import { describeNextDue, nextScheduledOnOrAfter } from '../../../services/fabric/commitmentSchedule';

interface TimelineViewProps {
    tasks: AnchorTask[];
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    /** Reference "now" for the next-due line. Injectable for deterministic tests. */
    now?: Date;
}

/**
 * Timeline geometry, defined once.
 *
 * The rail and the node are both positioned from the CONTAINER, not from the row:
 * a node offset from the row's own edge lands wherever the container's padding
 * happens to put it, which is how the node drifted off the rail it is supposed to
 * sit on. The rail's centre and the node's centre are the same number below, so
 * they cannot drift apart again.
 */
const RAIL_CLASS = 'absolute left-[11px] sm:left-[15px] top-6 bottom-6 w-0.5 rounded-full bg-slate-200 dark:bg-slate-800';
const NODE_CLASS = 'absolute -left-5 sm:-left-6 top-4 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2';

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onToggle, onStartEdit, now }) => {
    // Sorted by the part of the day the commitment belongs to — the timeline's job.
    const sortedTasks = [...tasks].sort((a, b) => {
        const timeWeights = { morning: 1, afternoon: 2, evening: 3, any: 4, anytime: 4 } as const;
        const weight = (value?: string) => timeWeights[(value ?? 'any') as keyof typeof timeWeights] ?? 4;
        return weight(a.timeOfDay) - weight(b.timeOfDay);
    });

    const reference = now ?? new Date();

    const getDomainColor = (domain?: string) => {
        switch (domain) {
            case 'Health': return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300 border-rose-100 dark:border-rose-900/40';
            case 'Fitness': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border-orange-100 dark:border-orange-900/40';
            case 'Work': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-900/40';
            case 'Bible': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/40';
            case 'Financial': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40';
            default: return 'bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-100 dark:border-slate-800';
        }
    };

    if (sortedTasks.length === 0) {
        return (
            <div className="py-10 text-center" data-testid="timeline-empty">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nothing to lay out yet.</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Commitments appear here in the order of the part of day they belong to.
                </p>
            </div>
        );
    }

    return (
        <div className="relative pl-6 sm:pl-8 py-4 space-y-4">
            {/* The rail every node sits on. Decorative: order is already in the DOM. */}
            <div className={RAIL_CLASS} aria-hidden="true" />

            {sortedTasks.map((task) => {
                const colors = getDomainColor(task.domain);
                const nextDue = task.completed ? null : nextScheduledOnOrAfter(task, reference);
                const nextDueLabel = nextDue ? describeNextDue(nextDue, reference) : null;

                return (
                    <div key={task.id} className="relative w-full">
                        {/* Timeline node */}
                        <div
                            className={`${NODE_CLASS} ${task.completed
                                ? 'border-emerald-500 bg-emerald-500'
                                : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'}`}
                            aria-hidden="true"
                        >
                            {task.completed && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}
                        </div>

                        <Card className={`p-0 overflow-hidden border transition-all ${task.completed ? 'opacity-60' : 'hover:border-slate-300 dark:hover:border-slate-600'} ${colors}`}>
                            <div className="flex items-center gap-3 p-4">
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                                            {task.timeOfDay && task.timeOfDay !== 'any' ? task.timeOfDay : 'Anytime'}
                                        </span>
                                    </div>
                                    <h4 className={`truncate text-base font-semibold tracking-tight ${task.completed ? 'line-through opacity-70' : ''}`}>
                                        {task.title}
                                    </h4>

                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        {task.domain && <span className="text-xs font-medium opacity-80">{task.domain}</span>}
                                        <Badge type={task.type}>{task.type}</Badge>
                                        {nextDueLabel && (
                                            <span className="text-[11px] font-medium opacity-70" data-testid="timeline-next-due">{nextDueLabel}</span>
                                        )}
                                    </div>
                                </div>

                                {/* One action per intent: open the commitment, or complete it. */}
                                <div className="flex shrink-0 items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => onStartEdit(task.id)}
                                        className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-white/60 px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-white dark:bg-black/20 dark:text-slate-300 dark:hover:bg-black/40"
                                        aria-label={`Edit ${task.title}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onToggle(task.id, task.completed)}
                                        aria-pressed={task.completed}
                                        aria-label={task.completed ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
                                        data-testid="timeline-toggle"
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${task.completed
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white/60 hover:bg-emerald-500 hover:text-white dark:bg-black/20 dark:hover:bg-emerald-500'}`}
                                    >
                                        {task.completed ? <Check className="h-5 w-5" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
};

