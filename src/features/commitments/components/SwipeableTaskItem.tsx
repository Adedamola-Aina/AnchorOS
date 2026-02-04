/**
 * SwipeableTaskItem - Mobile-optimized task row with swipe-to-delete
 * DES-002: Uses semantic icon colors (red for delete)
 */


import React from 'react';
import { Trash2 } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { SwipeableRow } from '../../../components/mobile/SwipeableRow';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTask } from '../../../types';

interface SwipeableTaskItemProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    isEditing: boolean;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onConfirmFinancial?: (title: string) => void;
}

export const SwipeableTaskItem: React.FC<SwipeableTaskItemProps> = ({
    task,
    hasFamilyActive,
    isEditing,
    onToggle,
    onStartEdit,
    onDelete,
    onConfirmFinancial,
}) => {
    const { isMobile } = useResponsive();

    // On mobile, wrap with SwipeableRow for swipe-to-delete gesture
    if (isMobile) {
        return (
            <SwipeableRow
                onSwipeLeft={() => onDelete(task.id)}
                rightAction={{
                    label: 'Delete',
                    color: 'danger',
                    icon: <Trash2 className="w-4 h-4 mr-1" />,
                }}
                disabled={isEditing}
            >
                <TaskItem
                    task={task}
                    hasFamilyActive={hasFamilyActive}
                    isEditing={isEditing}
                    onToggle={onToggle}
                    onStartEdit={onStartEdit}
                    onDelete={onDelete}
                    onConfirmFinancial={onConfirmFinancial}
                    hideActions // Hide action buttons on mobile - use swipe instead
                    onTitleClick={() => onStartEdit(task.id)} // Tap title to edit
                />
            </SwipeableRow>
        );
    }

    // On desktop, render TaskItem directly (uses hover-based actions)
    return (
        <TaskItem
            task={task}
            hasFamilyActive={hasFamilyActive}
            isEditing={isEditing}
            onToggle={onToggle}
            onStartEdit={onStartEdit}
            onDelete={onDelete}
            onConfirmFinancial={onConfirmFinancial}
        />
    );
};
