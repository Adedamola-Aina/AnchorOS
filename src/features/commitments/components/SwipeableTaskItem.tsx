/**
 * SwipeableTaskItem - Mobile-optimized task row with swipe-to-delete
 * 
 * Like Apple Reminders:
 * - Swipe left to delete
 * - Tap title to edit
 * - Clean design without visible action buttons
 * 
 * @module features/commitments/components/SwipeableTaskItem
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
    /** CM-08: inline transaction chip, never a blocking modal. */
    onFinancialNudge?: (taskId: string) => void;
    isFinancialNudge?: boolean;
    onRecordTransaction?: () => void;
    onDismissFinancialNudge?: () => void;
    /** CM-23: selection mode — the leading control selects instead of completing. */
    selectable?: boolean;
    selected?: boolean;
    onSelect?: (id: string) => void;
}

export const SwipeableTaskItem: React.FC<SwipeableTaskItemProps> = ({
    task,
    hasFamilyActive,
    isEditing,
    onToggle,
    onStartEdit,
    onDelete,
    onFinancialNudge,
    isFinancialNudge,
    onRecordTransaction,
    onDismissFinancialNudge,
    selectable,
    selected,
    onSelect,
}) => {
    const { isMobile } = useResponsive();

    // On mobile, wrap with SwipeableRow for swipe-to-delete gesture
    if (isMobile) {
        return (
            <SwipeableRow
                onSwipeLeft={() => onDelete(task.id)}
                rightAction={{
                    label: 'Delete',
                    color: 'red',
                    icon: <Trash2 className="w-4 h-4 mr-1" />,
                }}
                // CM-23: swiping is meaningless while selecting rows.
                disabled={isEditing || selectable}
            >
                <TaskItem
                    task={task}
                    hasFamilyActive={hasFamilyActive}
                    isEditing={isEditing}
                    onToggle={onToggle}
                    onStartEdit={onStartEdit}
                    onDelete={onDelete}
                    onFinancialNudge={onFinancialNudge}
                    isFinancialNudge={isFinancialNudge}
                    onRecordTransaction={onRecordTransaction}
                    onDismissFinancialNudge={onDismissFinancialNudge}
                    selectable={selectable}
                    selected={selected}
                    onSelect={onSelect}
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
            onFinancialNudge={onFinancialNudge}
            isFinancialNudge={isFinancialNudge}
            onRecordTransaction={onRecordTransaction}
            onDismissFinancialNudge={onDismissFinancialNudge}
            selectable={selectable}
            selected={selected}
            onSelect={onSelect}
        />
    );
};
