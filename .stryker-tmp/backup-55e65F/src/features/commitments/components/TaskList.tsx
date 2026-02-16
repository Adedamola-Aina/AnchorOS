import React, { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SwipeableTaskItem } from './SwipeableTaskItem';
import type { AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';

const VIRTUALIZE_THRESHOLD = 20;
const ESTIMATED_TASK_HEIGHT = 72; // ~64px card + 8px gap

interface TaskListProps {
    activeTasks: AnchorTask[];
    completedTasks: AnchorTask[];
    hasFamilyActive: boolean;
    editingTaskId: string | null;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onConfirmFinancial: (title: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    activeTasks,
    completedTasks,
    hasFamilyActive,
    editingTaskId,
    onToggle,
    onStartEdit,
    onDelete,
    onConfirmFinancial,
}) => {
    const [showCompleted, setShowCompleted] = useState(false);
    const parentRef = useRef<HTMLDivElement>(null);
    const useVirtual = activeTasks.length > VIRTUALIZE_THRESHOLD;

    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
        count: useVirtual ? activeTasks.length : 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ESTIMATED_TASK_HEIGHT,
        overscan: 5,
        enabled: useVirtual,
    });

    return (
        <div className="space-y-8">
            {/* Active Tasks */}
            <div className="space-y-4">
                {activeTasks.length > 0 && (
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Active Tasks</h3>
                )}
                {useVirtual ? (
                    <div ref={parentRef} className="max-h-[60vh] overflow-y-auto overscroll-contain">
                        <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                            {virtualizer.getVirtualItems().map((virtualRow) => {
                                const task = activeTasks[virtualRow.index];
                                if (!task) return null;
                                return (
                                    <div key={task.id} data-index={virtualRow.index} ref={virtualizer.measureElement}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
                                        className="pb-3">
                                        <SwipeableTaskItem task={task} hasFamilyActive={hasFamilyActive} isEditing={editingTaskId === task.id}
                                            onToggle={onToggle} onStartEdit={onStartEdit} onDelete={onDelete} onConfirmFinancial={onConfirmFinancial} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 transition-all duration-300 ease-out">
                        {activeTasks.map((task) => (
                            <div key={task.id} className="transition-all duration-200 ease-out">
                                <SwipeableTaskItem task={task} hasFamilyActive={hasFamilyActive} isEditing={editingTaskId === task.id}
                                    onToggle={onToggle} onStartEdit={onStartEdit} onDelete={onDelete} onConfirmFinancial={onConfirmFinancial} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Section */}
            {completedTasks.length > 0 && (
                <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="gap-2 text-[10px] font-black uppercase tracking-[0.1em] mb-4"
                    >
                        <span>Completed ({completedTasks.length})</span>
                        {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    {showCompleted && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            {completedTasks.map((task) => (
                                <SwipeableTaskItem
                                    key={task.id}
                                    task={task}
                                    hasFamilyActive={hasFamilyActive}
                                    isEditing={false}
                                    onToggle={onToggle}
                                    onStartEdit={onStartEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
