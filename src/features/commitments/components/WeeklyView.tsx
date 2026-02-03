/**
 * WeeklyView - 7-day task calendar grid
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import type { AnchorTask } from '../../../types';
import { Circle, CheckCircle2 } from 'lucide-react';
import { Text, VStack } from '../../../components/primitives';

interface WeeklyViewProps {
    tasks: AnchorTask[];
    onToggle: (id: string, status: boolean) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ tasks, onToggle }) => {
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <div className="overflow-x-auto pb-4">
            <div className="grid grid-cols-7 gap-2 min-w-[800px]">
                {days.map((date, idx) => {
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const dayNum = date.getDate();
                    const isToday = idx === 0;

                    const dayTasks = tasks.filter(t => {
                        if (t.type === 'daily') return true;
                        if (t.type === 'weekly') return t.daysOfWeek?.includes(fullDayName);
                        if (t.type === 'monthly') return t.daysOfMonth?.includes(dayNum) || t.dayOfMonth === dayNum;
                        return false;
                    });

                    return (
                        <VStack key={idx} gap="sm" className={`rounded-xl border transition-colors p-2 ${isToday ? 'bg-task-50/50 border-task-100 dark:bg-task-900/10 dark:border-task-900/30' : 'border-transparent'}`}>
                            <div className="text-center mb-1">
                                <Text variant={isToday ? 'task' : 'subtle'} size="xs" weight="bold" className="uppercase tracking-wider">
                                    {dayName}
                                </Text>
                                <Text variant={isToday ? 'task' : 'muted'} size="xl" weight="bold">
                                    {dayNum}
                                </Text>
                            </div>

                            <VStack gap="sm" className="flex-1">
                                {dayTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`p-2 rounded-lg border shadow-sm flex flex-col items-center text-center gap-1 transition-all ${isToday ? 'bg-surface-2 dark:bg-surface-2-dark border-[var(--border-subtle)]' : 'bg-surface-3 dark:bg-surface-3-dark border-transparent opacity-70'
                                            }`}
                                    >
                                        <div className="w-full" title={task.title}>
                                            <Text variant="body" size="xs" weight="medium" truncate>
                                                {task.title}
                                            </Text>
                                        </div>

                                        {isToday ? (
                                            <button
                                                onClick={() => onToggle(task.id, task.completed)}
                                                className={`mt-1 p-1 rounded-full transition-colors ${task.completed ? 'text-finance-500 bg-finance-50 dark:bg-finance-900/20' : 'text-muted hover:text-finance-500'}`}
                                            >
                                                {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                            </button>
                                        ) : (
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-subtle dark:bg-subtle-dark" />
                                        )}
                                    </div>
                                ))}
                                {dayTasks.length === 0 && (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="w-1 h-1 rounded-full bg-surface-3 dark:bg-surface-3-dark" />
                                    </div>
                                )}
                            </VStack>
                        </VStack>
                    );
                })}
            </div>
        </div>
    );
};

