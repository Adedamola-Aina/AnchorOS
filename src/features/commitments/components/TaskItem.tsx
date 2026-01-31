import React, { useState } from 'react';
import { Circle, Check, Pencil, Trash2 } from 'lucide-react';
import { Badge, TaskContextBadge } from '../../../components/shared';
import type { AnchorTask } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';

interface TaskItemProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    isEditing: boolean;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onConfirmFinancial?: (title: string) => void;
}

/**
 * Trigger haptic feedback on mobile devices (PWA).
 * Uses the Navigator Vibration API for a subtle, satisfying "success" vibration.
 */
const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
        // Short, subtle vibration pattern: two quick pulses
        // [vibrate 30ms, pause 50ms, vibrate 30ms] feels like a "tick tick" confirmation
        navigator.vibrate([30, 50, 30]);
    }
};

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    hasFamilyActive,
    isEditing,
    onToggle,
    onStartEdit,
    onDelete,
    onConfirmFinancial,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = async () => {
        // Only animate when completing (not uncompleting)
        if (!task.completed) {
            setIsAnimating(true);

            // Trigger haptic feedback immediately on click
            triggerHapticFeedback();

            // Wait 800ms to show the checkmark animation (reassuring duration)
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsAnimating(false);

            // Now trigger the actual completion
            await onToggle(task.id, task.completed);

            if (onConfirmFinancial) {
                const keywords = ['pay', 'buy', 'bill', 'rent', 'subscription', 'lease', 'insurance', 'tax'];
                if (keywords.some(k => task.title.toLowerCase().includes(k))) {
                    onConfirmFinancial(task.title);
                }
            }
        } else {
            // Uncompleting - no animation needed
            await onToggle(task.id, task.completed);
        }
    };

    return (
        <Card
            className={`group p-3 transition-all hover:border-slate-300 dark:hover:border-slate-700 ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Checkbox Button with Animation */}
                    <button
                        onClick={handleToggle}
                        disabled={isAnimating}
                        className={`relative p-2 rounded-full shrink-0 ${isAnimating
                                ? 'bg-emerald-500 text-white scale-150 ring-4 ring-emerald-300 dark:ring-emerald-700 shadow-lg shadow-emerald-500/50'
                                : task.completed
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500'
                            }`}
                        style={{
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                    >
                        {isAnimating ? (
                            // Animated checkmark with bounce effect
                            <Check
                                className="w-5 h-5"
                                strokeWidth={3}
                            />
                        ) : task.completed ? (
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </button>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-bold text-sm tracking-tight transition-all duration-300 ${isAnimating
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : task.completed
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-800 dark:text-white'
                                }`}>
                                {task.title}
                            </h4>
                            {!task.completed && !isAnimating && (
                                <div className="flex gap-1.5 flex-wrap">
                                    <Badge type={task.type}>{task.type}</Badge>
                                    <TaskContextBadge task={task} />
                                    {hasFamilyActive && task.category === 'family' && (
                                        <Badge type="family">Family</Badge>
                                    )}
                                    {(task.currentStreak || 0) > 0 && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                            🔥 {task.currentStreak}
                                        </span>
                                    )}
                                </div>
                            )}
                            {isAnimating && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    ✓ Complete!
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStartEdit(task.id)}
                        className="text-slate-400 hover:text-task-500 hover:bg-task-50 dark:hover:bg-task-900/20"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(task.id)}
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};
