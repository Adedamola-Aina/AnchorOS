/**
 * TaskItem - Individual task display with completion animation
 * DES-002: Migrated to semantic tokens and primitives
 */

import React, { useState } from 'react';
import { Circle, Check, Pencil, Trash2 } from 'lucide-react';
import { Badge, TaskContextBadge } from '../../../components/shared';
import type { AnchorTask } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, HStack, VStack } from '../../../components/primitives';
import { useHaptic } from '../../../hooks/useHaptic';

interface TaskItemProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    isEditing: boolean;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onConfirmFinancial?: (title: string) => void;
    hideActions?: boolean;
    onTitleClick?: () => void;
}

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
        if (!task.completed) {
            setIsAnimating(true);
            trigger('success');
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsAnimating(false);
            await onToggle(task.id, task.completed);

            if (onConfirmFinancial) {
                const keywords = ['pay', 'buy', 'bill', 'rent', 'subscription', 'lease', 'insurance', 'tax'];
                if (keywords.some(k => task.title.toLowerCase().includes(k))) {
                    onConfirmFinancial(task.title);
                }
            }
        } else {
            await onToggle(task.id, task.completed);
        }
    };

    return (
        <Card
            className={`group p-3 transition-all hover:border-[var(--border)] ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <HStack justify="between" gap="sm" align="center">
                <HStack gap="sm" align="center" className="min-w-0 flex-1">
                    {/* Checkbox Button with Animation */}
                    <button
                        onClick={handleToggle}
                        disabled={isAnimating}
                        className={`relative p-2 rounded-full shrink-0 ${isAnimating
                            ? 'bg-finance-500 text-white scale-150 ring-4 ring-finance-300 dark:ring-finance-700 shadow-lg shadow-finance-500/50'
                            : task.completed
                                ? 'bg-finance-500 text-white'
                                : 'bg-surface-3 dark:bg-surface-3-dark text-muted hover:bg-finance-500/10 hover:text-finance-500'
                            }`}
                        style={{
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                    >
                        {isAnimating ? (
                            <Check className="w-5 h-5" strokeWidth={3} />
                        ) : task.completed ? (
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </button>
                    <VStack gap="none" className="min-w-0 flex-1">
                        {/* Title row with streak inline */}
                        <HStack gap="sm" align="center">
                            {onTitleClick ? (
                                <button
                                    onClick={onTitleClick}
                                    disabled={isAnimating || task.completed}
                                    className={`font-semibold text-sm tracking-tight transition-all duration-300 truncate text-left ${isAnimating
                                        ? 'text-finance-600 dark:text-finance-400'
                                        : task.completed
                                            ? 'line-through text-muted'
                                            : 'text-foreground dark:text-foreground-dark hover:text-task-600 dark:hover:text-task-400'
                                        }`}
                                >
                                    {task.title}
                                </button>
                            ) : (
                                <Text
                                    variant={isAnimating ? 'finance' : task.completed ? 'muted' : 'heading'}
                                    size="sm"
                                    weight="semibold"
                                    truncate
                                    className={`tracking-tight transition-all duration-300 ${task.completed ? 'line-through' : ''}`}
                                >
                                    {task.title}
                                </Text>
                            )}
                            {!task.completed && !isAnimating && (task.currentStreak || 0) > 0 && (
                                <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-warning-bg text-warning dark:bg-warning-bgDark dark:text-warning-dark">
                                    🔥{task.currentStreak}
                                </span>
                            )}
                            {isAnimating && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-finance-100 text-finance-700 dark:bg-finance-900/50 dark:text-finance-300">
                                    ✓ Done!
                                </span>
                            )}
                        </HStack>
                        {/* Badges row */}
                        {!task.completed && !isAnimating && (
                            <HStack gap="xs" align="center" className="mt-1 overflow-hidden">
                                <Badge type={task.type}>{task.type}</Badge>
                                <TaskContextBadge task={task} />
                                {hasFamilyActive && task.category === 'family' && (
                                    <Badge type="family">Family</Badge>
                                )}
                            </HStack>
                        )}
                    </VStack>
                </HStack>
                {!hideActions && (
                    <HStack gap="none" className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onStartEdit(task.id)}
                            className="text-muted hover:text-task-500 hover:bg-task-50 dark:hover:bg-task-900/20"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(task.id)}
                            className="text-muted hover:text-danger hover:bg-danger-bg dark:hover:bg-danger-bgDark"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </HStack>
                )}
            </HStack>
        </Card>
    );
};

