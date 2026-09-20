/**
 * CM-25 / CM-23 — done history, undo and bulk actions.
 *
 * CM-25: completed commitments used to vanish into a collapsed "Completed (n)"
 * list. They are now grouped by period, because progress you cannot see is not
 * motivation — and it is the source for streaks.
 *
 * CM-23: completing a commitment is emotionally loaded, so the row offers Undo;
 * and a selection mode makes bulk complete/delete possible without repeating a
 * tap per row.
 */

import React from 'react';
import { Check, Undo2, Trash2, X } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { SwipeableTaskItem } from './SwipeableTaskItem';
import type { CompletedGroup } from '../utils/smartViews';

interface DoneHistoryProps {
    groups: CompletedGroup[];
    hasFamilyActive: boolean;
    onToggle: (id: string, completed: boolean) => void;
    onStartEdit: (id: string) => void;
    onDelete: (id: string) => void;
    /** CM-23: selection mode, so bulk actions are available here too. */
    selectedIds?: Set<string>;
    onSelect?: (id: string) => void;
}

export const DoneHistory: React.FC<DoneHistoryProps> = ({
    groups, hasFamilyActive, onToggle, onStartEdit, onDelete, selectedIds, onSelect,
}) => (
    <div className="space-y-6" data-testid="done-history">
        {groups.map((group) => (
            <section key={group.label} className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    {group.label}
                    <span className="ml-2 text-slate-300 dark:text-slate-600">{group.tasks.length}</span>
                </h3>
                {group.tasks.map((task) => (
                    <SwipeableTaskItem
                        key={task.id}
                        task={task}
                        hasFamilyActive={hasFamilyActive}
                        isEditing={false}
                        onToggle={onToggle}
                        onStartEdit={onStartEdit}
                        onDelete={onDelete}
                        selectable={Boolean(onSelect)}
                        selected={selectedIds?.has(task.id) ?? false}
                        onSelect={onSelect}
                    />
                ))}
            </section>
        ))}
    </div>
);

export interface UndoState {
    message: string;
    run: () => void | Promise<void>;
}

interface UndoBarProps {
    state: UndoState | null;
    onDismiss: () => void;
}

/** CM-23: the safety net after completing or deleting. */
export const CommitmentUndoBar: React.FC<UndoBarProps> = ({ state, onDismiss }) => {
    if (!state) return null;
    return (
        <div
            role="status"
            aria-live="polite"
            data-testid="commitment-undo-bar"
            className="sticky bottom-4 z-20 mx-auto flex items-center justify-between gap-3 max-w-lg px-4 py-3 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-xl backdrop-blur"
        >
            <span className="text-sm">{state.message}</span>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => { await state.run(); onDismiss(); }}
                    className="gap-1.5 text-white hover:text-white/80"
                >
                    <Undo2 className="w-4 h-4" aria-hidden="true" />
                    Undo
                </Button>
                <Button variant="ghost" size="icon" onClick={onDismiss} aria-label="Dismiss" className="text-white/70 hover:text-white h-8 w-8">
                    <X className="w-4 h-4" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
};

interface BulkActionBarProps {
    count: number;
    onComplete: () => void;
    onDelete: () => void;
    onClear: () => void;
}

/** CM-23: multi-select actions, shown only when something is selected. */
export const BulkActionBar: React.FC<BulkActionBarProps> = ({ count, onComplete, onDelete, onClear }) => {
    if (count === 0) return null;
    return (
        <div
            role="region"
            aria-label="Bulk actions"
            data-testid="bulk-action-bar"
            className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {count} selected
            </span>
            <Button variant="secondary" size="sm" onClick={onComplete} className="gap-1.5 min-h-[44px]">
                <Check className="w-4 h-4" aria-hidden="true" />
                Complete
            </Button>
            <Button variant="secondary" size="sm" onClick={onDelete} className="gap-1.5 min-h-[44px] text-rose-600 dark:text-rose-400">
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear} className="min-h-[44px]">
                Cancel
            </Button>
        </div>
    );
};
