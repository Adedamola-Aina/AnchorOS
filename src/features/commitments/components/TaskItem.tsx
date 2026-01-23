import React from 'react';
import { Circle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Badge, TaskContextBadge } from '../../../components/shared';
import type { AnchorTask } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface TaskItemProps {
    task: AnchorTask;
    hasFamilyActive: boolean;
    isEditing: boolean;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onConfirmFinancial?: (title: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    hasFamilyActive,
    isEditing,
    onToggle,
    onStartEdit,
    onDelete,
    onConfirmFinancial,
}) => {
    const handleToggle = async () => {
        await onToggle(task.id, task.completed);
        if (!task.completed && onConfirmFinancial) {
            const keywords = ['pay', 'buy', 'bill', 'rent', 'subscription', 'lease', 'insurance', 'tax'];
            if (keywords.some(k => task.title.toLowerCase().includes(k))) {
                onConfirmFinancial(task.title);
            }
        }
    };

    return (
        <Card
            className={`group p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    <button
                        onClick={handleToggle}
                        className={`p-2 rounded-full transition-all duration-300 shrink-0 ${task.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500'}`}
                    >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                        <h4 className={`font-bold text-sm tracking-tight transition-all ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                            {task.title}
                        </h4>
                        {!task.completed && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <Badge type={task.type}>{task.type}</Badge>
                                <TaskContextBadge task={task} />
                                {hasFamilyActive && task.category === 'family' && (
                                    <Badge type="family">Family</Badge>
                                )}
                                {(task.currentStreak || 0) > 0 && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                        🔥 {task.currentStreak}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStartEdit(task.id)}
                        className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
