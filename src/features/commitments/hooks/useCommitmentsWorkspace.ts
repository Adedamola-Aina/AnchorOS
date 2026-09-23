/**
 * CM-21 / CM-23 / CM-25 — the Commitments workspace.
 *
 * Keeps the view's derived state (smart view, search, selection, undo) out of the
 * component so CommitmentsView stays a layout, and so the behaviour is unit
 * testable without rendering the page.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AnchorTask } from '../../../types';
import {
    filterBySmartView,
    groupCompletedByPeriod,
    searchCommitments,
    type CompletedGroup,
    type SmartViewId,
} from '../utils/smartViews';

type TypeFilter = 'all' | 'daily' | 'weekly' | 'monthly' | 'todo';

/**
 * How long an undo affordance stays on screen.
 *
 * The bar used to live until the user pressed Undo or Dismiss — measured still
 * present nine seconds after the completion — so an action chip became permanent
 * furniture over the list. An undo is a *window*, not a state: long enough to
 * notice and act on (6s clears the ~1s it takes to read the message and react),
 * after which the action simply stands. The window is owned here, next to the
 * state it governs, so a consumer cannot accidentally make it immortal by passing
 * a fresh callback on every render.
 */
export const UNDO_WINDOW_MS = 6000;

interface UndoState {
    message: string;
    run: () => void | Promise<void>;
}

interface WorkspaceArgs {
    tasks: AnchorTask[];
    addTask: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>;
    toggleTask: (id: string, completed: boolean) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    /** The field's value, owned by the page so the intent can be parsed from it first. */
    query: string;
    setQuery: (query: string) => void;
    /**
     * What the list actually filters by. The raw text, unless the page has read it as
     * a commitment (`"Gym Mon Wed Fri"` → `Gym`) — schedule words must not stop a user
     * finding the commitment those words describe.
     */
    searchText?: string;
    /** Injectable clock so tests and screenshots are deterministic. */
    now?: Date;
}

export function useCommitmentsWorkspace({ tasks, addTask, toggleTask, deleteTask, query, setQuery, searchText, now }: WorkspaceArgs) {
    /**
     * 'all', not 'today'.
     *
     * The default used to be 'today', which meant a user with commitments but
     * nothing scheduled *today* landed on an empty page and could reasonably
     * conclude their data was gone. The list shows everything unless the user
     * narrows it themselves.
     */
    const [smartView, setSmartView] = useState<SmartViewId>('all');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [undo, setUndo] = useState<UndoState | null>(null);
    const dismissUndo = useCallback(() => setUndo(null), []);

    /**
     * The undo window closes by itself. Keyed on the undo *state*, not on a
     * callback: `dismissUndo` is stable, so a re-render cannot restart the clock.
     */
    useEffect(() => {
        if (!undo) return;
        const timer = window.setTimeout(() => setUndo(null), UNDO_WINDOW_MS);
        return () => window.clearTimeout(timer);
    }, [undo]);

    const reference = useMemo(() => now ?? new Date(), [now]);

    /** Search → type filter. Every view and count derives from this. */
    const scoped = useMemo(() => {
        const searched = searchCommitments(tasks, searchText ?? query);
        return searched.filter((task) => typeFilter === 'all' || task.type === typeFilter);
    }, [tasks, query, searchText, typeFilter]);

    const visible = useMemo(
        () => filterBySmartView(scoped, smartView, reference),
        [scoped, smartView, reference],
    );

    const doneGroups: CompletedGroup[] = useMemo(
        () => groupCompletedByPeriod(visible, reference),
        [visible, reference],
    );

    const selectable = selectionMode || selectedIds.size > 0;
    const toggleSelect = useCallback((id: string) => {
        setSelectedIds((previous) => {
            const next = new Set(previous);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);
    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
        setSelectionMode(false);
    }, []);
    const startSelection = useCallback(() => setSelectionMode(true), []);

    /** CM-23: completing is undoable, and the message says what happened. */
    const completeWithUndo = useCallback(async (id: string, title: string, completed: boolean) => {
        await toggleTask(id, completed);
        if (!completed) {
            setUndo({ message: `Completed “${title}”.`, run: () => toggleTask(id, true) });
        }
    }, [toggleTask]);

    /** CM-23: deleting is undoable — the commitment is restored, not resurrected by hand. */
    const deleteWithUndo = useCallback(async (task: AnchorTask) => {
        await deleteTask(task.id);
        const { id: _id, createdAt: _createdAt, ...restorable } = task;
        setUndo({ message: `Deleted “${task.title}”.`, run: () => addTask(restorable) });
    }, [addTask, deleteTask]);

    const bulkComplete = useCallback(async () => {
        const ids = [...selectedIds];
        const titles = scoped.filter((task) => selectedIds.has(task.id)).map((task) => task.title);
        await Promise.all(ids.map((id) => toggleTask(id, false)));
        clearSelection();
        setUndo({
            message: `Completed ${ids.length} ${ids.length === 1 ? 'commitment' : 'commitments'}.`,
            run: async () => { await Promise.all(ids.map((id) => toggleTask(id, true))); },
        });
        void titles;
    }, [selectedIds, scoped, toggleTask, clearSelection]);

    const bulkDelete = useCallback(async () => {
        const targets = scoped.filter((task) => selectedIds.has(task.id));
        await Promise.all(targets.map((task) => deleteTask(task.id)));
        clearSelection();
        setUndo({
            message: `Deleted ${targets.length} ${targets.length === 1 ? 'commitment' : 'commitments'}.`,
            run: async () => {
                for (const task of targets) {
                    const { id: _id, createdAt: _createdAt, ...restorable } = task;
                    await addTask(restorable);
                }
            },
        });
    }, [selectedIds, scoped, deleteTask, addTask, clearSelection]);

    return {
        smartView, setSmartView,
        typeFilter, setTypeFilter,
        query, setQuery,
        visible,
        doneGroups,
        selectable, selectedIds, toggleSelect, clearSelection, startSelection,
        completeWithUndo, deleteWithUndo, bulkComplete, bulkDelete,
        undo, setUndo, dismissUndo,
    };
}
