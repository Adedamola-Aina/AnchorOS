```typescript
import React from 'react';
import { useTasks } from '../../../context/TaskContext';
import type { AnchorTask } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Play, Check, Circle, Clock } from 'lucide-react';
import { Badge } from '../../../components/shared';

interface TimelineViewProps {
    tasks: AnchorTask[];
    onToggle: (id: string, completed: boolean) => void;
    onStartFocus: (id: string) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onToggle, onStartFocus, onStartEdit, onDelete }) => {
    // Sort tasks by time of day for the visual timeline
    const sortedTasks = [...tasks].sort((a, b) => {
        const timeWeights = { morning: 1, afternoon: 2, evening: 3, anytime: 4 };
        return (timeWeights[a.timeOfDay as keyof typeof timeWeights] || 4) -
            (timeWeights[b.timeOfDay as keyof typeof timeWeights] || 4);
    });

    const getDomainColor = (domain?: string) => {
        switch (domain) {
            case 'Health': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
            case 'Fitness': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            case 'Work': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'Bible': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
            case 'Financial': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="relative pl-6 sm:pl-8 py-4 space-y-6">
            {/* Native Vertical Timeline Line */}
            <div className="absolute left-[15px] sm:left-[23px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full" />

            {sortedTasks.map((task) => {
                const colors = getDomainColor(task.domain);
                const isUpcoming = !task.completed;

                return (
                    <div key={task.id} className="relative w-full">
                        {/* Timeline Dot Node */}
                        <div className={`absolute - left - [30px] sm: -left - [38px] w - 4 h - 4 rounded - full border - 2 ${ task.completed ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700' } shadow - sm z - 10 flex items - center justify - center top - 4`}>
                            {task.completed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                        </div>

                        {/* Task Visual Time Block */}
                        <Card className={`p - 0 overflow - hidden border transition - all ${ task.completed ? 'opacity-60 grayscale-[50%]' : 'hover:shadow-md' } ${ colors } `}>
                            <div className="p-4 sm:p-5 flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-3.5 h-3.5 opacity-70" />
                                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                                            {task.timeOfDay || 'Anytime'}
                                        </span>
                                    </div>
                                    <h4 className={`text - base sm: text - lg font - bold truncate ${ task.completed ? 'line-through opacity-70' : '' } `}>
                                        {task.title}
                                    </h4>

                                    <div className="flex items-center gap-2 mt-2">
                                        {task.domain && (
                                            <span className="text-xs font-bold opacity-80">{task.domain}</span>
                                        )}
                                        <Badge type={task.type}>{task.type}</Badge>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                    {isUpcoming && (
                                        <button
                                            onClick={() => onStartFocus(task.id)}
                                            className="w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 flex items-center justify-center gap-2 rounded-xl bg-white/50 hover:bg-white dark:bg-black/20 dark:hover:bg-black/40 transition-colors"
                                            title="Start Task Focus Timer"
                                        >
                                            <Play className="w-4 h-4" />
                                            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Start</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onToggle(task.id, task.completed)}
                                        className={`w - 10 h - 10 flex items - center justify - center rounded - xl transition - all ${ task.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/50 hover:bg-emerald-500 hover:text-white dark:bg-black/20 dark:hover:bg-emerald-500' } `}
                                    >
                                        {task.completed ? <Check className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                );
            })}

            {sortedTasks.length === 0 && (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                    No timeline events available.
                </div>
            )}
        </div>
    );
};
