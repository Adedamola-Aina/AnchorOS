// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, Check, Pencil, Trash2, Flame, CalendarClock } from 'lucide-react';
import { Badge, TaskContextBadge } from '../../../components/shared';
import { FinancialNudgeChip } from './FinancialNudgeChip';
import { PriorityIndicator } from './PriorityIndicator';
import type { AnchorTask } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { getStreakMilestone, getStreakNudge } from '../utils/streakUtils';
import { microMotion } from '../../../animations/microInteractions';
import { describeNextDue, describeSchedule, nextScheduledOnOrAfter } from '../../../services/fabric/commitmentSchedule';

interface TaskItemProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    isEditing: boolean;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    /**
     * CM-08: completing a commitment that looks financial no longer interrupts
     * with a cross-domain "Financial Transaction?" modal. The row reports the
     * intent and the parent renders a dismissible chip.
     */
    onFinancialNudge?: (taskId: string) => void;
    /** True when THIS row is the one waiting on the transaction decision. */
    isFinancialNudge?: boolean;
    onRecordTransaction?: () => void;
    onDismissFinancialNudge?: () => void;
    /** Hide action buttons (for mobile swipe-to-delete) */
    hideActions?: boolean;
    /** Callback when title is tapped (for mobile tap-to-edit) */
    onTitleClick?: () => void;
    /**
     * UX-CM-07: the reference "now" for the next-due chip. Injectable so tests
     * and screenshots are deterministic; defaults to the real clock.
     */
    now?: Date;
    /** CM-23: when true the row's leading control selects instead of completing. */
    selectable?: boolean;
    selected?: boolean;
    onSelect?: (id: string) => void;
}

import { useHaptic } from '../../../hooks/useHaptic';

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    hasFamilyActive,
    isEditing,
    onToggle,
    onStartEdit,
    onDelete,
    onFinancialNudge,
    isFinancialNudge = false,
    onRecordTransaction,
    onDismissFinancialNudge,
    hideActions = false,
    onTitleClick,
    now,
    selectable = false,
    selected = false,
    onSelect,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const { trigger } = useHaptic();

    /**
     * UX-CM-07: rows showed cadence, streak, notes and context but never *when*
     * the next occurrence is — the one thing a commitment is actually about.
     * Derived from the shared schedule model, so the chip cannot disagree with
     * the assistant, the badge or the calendar.
     */
    const reference = now ?? new Date();
    const nextDue = task.completed ? null : nextScheduledOnOrAfter(task, reference);
    const nextDueLabel = nextDue ? `Next: ${describeNextDue(nextDue, reference)}` : null;
    const scheduleLabel = describeSchedule(task);

    const handleToggle = async () => {
        // CM-23: in selection mode the leading control selects the row instead of
        // completing it, so a bulk action never depends on a long-press.
        if (selectable && onSelect) {
            onSelect(task.id);
            return;
        }
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

            if (onFinancialNudge) {
                const keywords = ['pay', 'buy', 'bill', 'rent', 'subscription', 'lease', 'insurance', 'tax'];
                if (keywords.some(k => task.title.toLowerCase().includes(k))) {
                    onFinancialNudge(task.id);
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
                    <motion.button
                        onClick={handleToggle}
                        aria-pressed={selectable ? selected : undefined}
                        aria-label={selectable ? `Select ${task.title}` : `Mark ${task.title} as ${task.completed ? 'not done' : 'done'}`}
                        data-testid={selectable ? 'select-task' : 'toggle-task'}
                        disabled={isAnimating}
                        variants={microMotion.completionPop}
                        initial="idle"
                        animate={isAnimating ? 'complete' : 'idle'}
                        className={`relative min-w-11 min-h-11 flex items-center justify-center rounded-full shrink-0 ${isAnimating
                            ? 'bg-emerald-500 text-white scale-150 ring-4 ring-emerald-300 dark:ring-emerald-700 shadow-elevation-raised shadow-emerald-500/50'
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
                        ) : selectable && selected ? (
                            // CM-23: selected reads as a filled check, not colour alone.
                            <Check className="w-4 h-4" strokeWidth={3} />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </motion.button>
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
                                // UX-DS-01: Lucide only. The milestone icon (Sprout, Star,
                                // Flame, Trophy…) replaces the emoji, and `Flame` is the
                                // generic "streak" icon when the count is not a milestone.
                                const StreakIcon = milestone ? milestone.icon : Flame;
                                return (
                                    <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-pill text-[10px] font-semibold bg-warning-surface text-warning border border-warning-border" data-testid="streak-badge">
                                        <StreakIcon className="w-3 h-3" aria-hidden="true" />
                                        {task.currentStreak}
                                        {milestone && <span className="sr-only">{milestone.label}</span>}
                                    </span>
                                );
                            })()}
                            {isAnimating && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <Check className="w-3 h-3" aria-hidden="true" /> Done!
                                </span>
                            )}
                        </div>
                        {/* Badges row — wraps instead of clipping, on a 6px rhythm */}
                        {!task.completed && !isAnimating && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                <Badge type={task.type}>{task.type}</Badge>
                                {task.priority && task.priority !== 'medium' && (
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-pill text-[10px] font-semibold border ${task.priority === 'high' ? 'bg-danger-surface text-danger border-danger-border' : 'bg-success-surface text-success border-success-border'}`}>
                                        <PriorityIndicator priority={task.priority} />
                                    </span>
                                )}
                                <TaskContextBadge task={task} />
                                {/* UX-CM-07: when this commitment next comes round. */}
                                {nextDueLabel && (
                                    <span
                                        data-testid="next-due-badge"
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0"
                                    >
                                        <CalendarClock className="w-3 h-3" aria-hidden="true" />
                                        {nextDueLabel}
                                    </span>
                                )}
                                {/* CM-17: only rendered when a real interval or end date is set. */}
                                {scheduleLabel && (
                                    <span
                                        data-testid="schedule-badge"
                                        className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 shrink-0 capitalize"
                                    >
                                        {scheduleLabel}
                                    </span>
                                )}
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
                        {/*
                          * Streak nudge — only where it adds something.
                          *
                          * It used to render for every state ("3 more days to
                          * One Week", "Incredible 12-day streak!"), so a list of
                          * commitments repeated the same encouragement line on
                          * every card and buried the actual signal. The streak
                          * badge already shows the count, so the nudge is kept for
                          * the one case the badge cannot show: a streak that has
                          * lapsed and can be recovered.
                          */}
                        {!task.completed && !isAnimating && (task.currentStreak || 0) === 0 && (task.longestStreak || 0) > 0 && (() => {
                            const nudge = getStreakNudge(task.currentStreak || 0, task.longestStreak || 0);
                            return nudge ? <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 truncate" data-testid="streak-nudge">{nudge}</p> : null;
                        })()}
                        {/*
                          * CM-08: the transaction offer used to be a blocking
                          * cross-domain modal ("Financial Transaction?"). It is now
                          * an inline chip on the completed row: same offer, no
                          * interruption, and dismissing it costs nothing.
                          */}
                        {isFinancialNudge && (
                            <FinancialNudgeChip
                                onRecord={() => onRecordTransaction?.()}
                                onDismiss={() => onDismissFinancialNudge?.()}
                            />
                        )}
                    </div>
                </div>
                {!hideActions && (
                    <div className="flex items-center gap-0.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onStartEdit(task.id)}
                            className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
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
