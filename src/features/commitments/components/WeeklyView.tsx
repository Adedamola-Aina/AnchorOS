import React from 'react';
import type { AnchorTask } from '../../../types';
import { Circle, CheckCircle2 } from 'lucide-react';

interface WeeklyViewProps {
    tasks: AnchorTask[];
    onToggle: (id: string, status: boolean) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ tasks, onToggle }) => {
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
                    const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const dayNum = date.getDate();
                    const isToday = idx === 0;

                    // Filter tasks for this day
                    const dayTasks = tasks.filter(t => {
                        if (t.type === 'daily') return true;
                        if (t.type === 'weekly') return t.daysOfWeek?.includes(fullDayName);
                        if (t.type === 'monthly') return t.daysOfMonth?.includes(dayNum) || t.dayOfMonth === dayNum;
                        return false;
                    });

                    return (
                        <div key={idx} className={`flex flex-col gap-2 rounded-xl border transition-colors ${isToday ? 'bg-task-50/50 border-task-100 dark:bg-task-900/10 dark:border-task-900/30 p-2' : 'border-transparent p-2'}`}>
                            <div className="text-center mb-1">
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-task-600 dark:text-task-400' : 'text-slate-400'}`}>{dayName}</div>
                                <div className={`text-xl font-bold ${isToday ? 'text-task-700 dark:text-task-300' : 'text-slate-700 dark:text-slate-300'}`}>{dayNum}</div>
                            </div>

                            <div className="space-y-2 flex-1">
                                {dayTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`p-2 rounded-lg border shadow-sm flex flex-col items-center text-center gap-1 transition-all ${isToday ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-70'
                                            }`}
                                    >
                                        <div className="text-xs font-medium truncate w-full" title={task.title}>
                                            {task.title}
                                        </div>

                                        {isToday ? (
                                            <button
                                                onClick={() => onToggle(task.id, task.completed)}
                                                className={`mt-1 p-1 rounded-full transition-colors ${task.completed ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-300 hover:text-emerald-500'}`}
                                            >
                                                {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                            </button>
                                        ) : (
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        )}
                                    </div>
                                ))}
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
