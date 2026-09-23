
import React from 'react';
import type { AnchorTask } from '../../../types';
import { Circle, CheckCircle2 } from 'lucide-react';
import { isScheduledOn } from '../../../services/fabric/commitmentSchedule';

interface WeeklyViewProps {
    tasks: AnchorTask[];
    onToggle: (id: string, status: boolean) => void;
    /** Opens an occurrence on a day other than today, where toggling would be ambiguous. */
    onOpen?: (id: string) => void;
}

/**
 * The next seven days, one column each.
 *
 * Two defects lived here:
 *
 * 1. Only TODAY's column had a control; every other day rendered a dead grey dot,
 *    so the grid read as inert and gave no feedback anywhere. Each occurrence is
 *    now a real control — today's toggles completion, any other day opens the
 *    commitment (toggling from a future column would complete an occurrence the
 *    user has not reached).
 *
 * 2. Completion was read off the whole task, so a daily commitment marked done
 *    today also appeared "done" in tomorrow's column. The completion flag refers
 *    to the occurrence in TODAY's column, so only that column renders it as done;
 *    the other columns are the next occurrence, which is still pending.
 *
 * The grid therefore gives the same acknowledgement the list does — a filled green
 * check and a struck title — exactly where the user acted.
 */
export const WeeklyView: React.FC<WeeklyViewProps> = ({ tasks, onToggle, onOpen }) => {
    // Generate next 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <div className="overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory">
            {/* BUG-040 Fix: Remove min-w-800px, make grid responsive */}
            {/* Mobile: 2 cols (visible w/scroll) | sm: 3 cols | md: 4 cols | lg: 7 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 min-w-0">
                {days.map((date, idx) => {
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = date.getDate();
                    const isToday = idx === 0;

                    // CM-18: one definition of "scheduled" for the whole app. This
                    // grid compared full day names ('Monday') while the schedule
                    // engine compared letters ('M'), so the calendar and the
                    // assistant disagreed about the same commitment. Both now ask
                    // commitmentSchedule, which also honours CM-17's start/end
                    // dates and interval.
                    const dayTasks = tasks.filter(t => t.type !== 'todo' && isScheduledOn(t, date));
                    const doneCount = isToday ? dayTasks.filter(t => t.completed).length : 0;

                    return (
                        <div key={idx} className={`flex flex-col gap-2 rounded-card border transition-colors ${isToday ? 'bg-task-50/50 border-task-100 dark:bg-task-900/10 dark:border-task-900/30 p-2' : 'border-transparent p-2'}`}>
                            <div className="text-center mb-1">
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-task-600 dark:text-task-400' : 'text-slate-400'}`}>{dayName}</div>
                                <div className={`text-xl font-bold ${isToday ? 'text-task-700 dark:text-task-300' : 'text-slate-700 dark:text-slate-300'}`}>{dayNum}</div>
                                {isToday && dayTasks.length > 0 && (
                                    <div className="text-[10px] font-medium text-slate-400" data-testid="week-today-progress">
                                        {doneCount}/{dayTasks.length} done
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 flex-1">
                                {dayTasks.map(task => {
                                    const done = isToday && task.completed;
                                    const label = done
                                        ? `Mark ${task.title} as not done`
                                        : isToday
                                            ? `Mark ${task.title} as done`
                                            : `Open ${task.title}`;
                                    return (
                                        <button
                                            key={task.id}
                                            type="button"
                                            aria-pressed={isToday ? !!task.completed : undefined}
                                            aria-label={label}
                                            onClick={() => (isToday ? onToggle(task.id, task.completed) : onOpen?.(task.id))}
                                            className={`w-full min-h-11 p-2 rounded-lg border shadow-elevation-subtle flex flex-col items-center text-center gap-1 transition-all ${isToday
                                                ? done
                                                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/40'
                                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                                                : 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <span className={`text-xs font-medium truncate w-full ${done ? 'line-through text-slate-400 dark:text-slate-500' : ''}`} title={task.title}>
                                                {task.title}
                                            </span>
                                            {isToday ? (
                                                done
                                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                                                    : <Circle className="w-5 h-5 text-slate-300" aria-hidden="true" />
                                            ) : (
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
                                            )}
                                        </button>
                                    );
                                })}
                                {dayTasks.length === 0 && (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
