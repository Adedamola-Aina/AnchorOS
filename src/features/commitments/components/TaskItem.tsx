// @ts-nocheck
import React, { useState } from 'react';
import { Circle, Check, Pencil, Trash2 } from 'lucide-react';
import { Badge, TaskContextBadge } from '../../../components/shared';
import type { AnchorTask } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { getStreakMilestone, getStreakNudge } from '../utils/streakUtils';

interface TaskItemProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    isEditing: boolean;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onConfirmFinancial?: (title: string) => void;
    /** Hide action buttons (for mobile swipe-to-delete) */
    hideActions?: boolean;
    /** Callback when title is tapped (for mobile tap-to-edit) */
    onTitleClick?: () => void;
}

import { useHaptic } from '../../../hooks/useHaptic';

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    hasFamilyActive,
    isEditing,
    onToggle,
    onStartEdit,
    onDelete,
    onConfirmFinancial,
    hideActions = false,
    onTitleClick,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const { trigger } = useHaptic();

    const handleToggle = async () => {
        // Only animate when completing (not uncompleting)
        if (!task.completed) {
            setIsAnimating(true);

            // Trigger haptic feedback immediately on click
            trigger('success');

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
                        className={`relative min-w-11 min-h-11 flex items-center justify-center rounded-full shrink-0 ${isAnimating
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
                        {/* Title row with streak inline */}
                        <div className="flex items-center gap-2">
                            {onTitleClick ? (
                                <button
                                    onClick={onTitleClick}
                                    disabled={isAnimating || task.completed}
                                    className={`font-semibold text-sm tracking-tight transition-all duration-300 truncate text-left ${isAnimating
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : task.completed
                                            ? 'line-through text-slate-400 dark:text-slate-500'
                                            : 'text-slate-800 dark:text-white hover:text-task-600 dark:hover:text-task-400'
                                        }`}
                                >
                                    {task.title}
                                </button>
                            ) : (
                                <h4 className={`font-semibold text-sm tracking-tight transition-all duration-300 truncate ${isAnimating
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : task.completed
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-800 dark:text-white'
                                    }`}>
                                    {task.title}
                                </h4>
                            )}
                            {!task.completed && !isAnimating && (task.currentStreak || 0) > 0 && (() => {
                                const milestone = getStreakMilestone(task.currentStreak || 0);
                                return (
                                    <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" data-testid="streak-badge">
                                        {milestone ? `${milestone.emoji} ${task.currentStreak}` : `🔥${task.currentStreak}`}
                                    </span>
                                );
                            })()}
                            {isAnimating && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    ✓ Done!
                                </span>
                            )}
                        </div>
                        {/* Badges row - compact, single line with overflow hidden */}
                        {!task.completed && !isAnimating && (
                            <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                <Badge type={task.type}>{task.type}</Badge>
                                {task.priority && task.priority !== 'medium' && (
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${task.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                        {task.priority === 'high' ? '🔴 High' : '🟢 Low'}
                                    </span>
                                )}
                                <TaskContextBadge task={task} />
                                {hasFamilyActive && task.category === 'family' && (
                                    <Badge type="family">Family</Badge>
                                )}
                            </div>
                        )}
                        {/* Notes preview (COMM-006) */}
                        {task.notes && !isAnimating && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate" data-testid="task-notes-preview">
                                {task.notes}
                            </p>
                        )}
                        {/* Gentle nudge (COMM-001) */}
                        {!task.completed && !isAnimating && (() => {
                            const nudge = getStreakNudge(task.currentStreak || 0, task.longestStreak || 0);
                            return nudge ? <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 truncate" data-testid="streak-nudge">{nudge}</p> : null;
                        })()}
                    </div>
                </div>
                {!hideActions && (
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
                )}
            </div>
        </Card>
    );
};
