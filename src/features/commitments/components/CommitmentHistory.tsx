/**
 * CM-23 — the commitment undo bar.
 *
 * Completing or deleting a commitment is emotionally loaded, so the action offers
 * an Undo affordance. This is the safety net for that window.
 */

import React from 'react';
import { Undo2, X } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface UndoState {
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
            className="sticky bottom-4 z-20 mx-auto flex items-center justify-between gap-3 max-w-lg px-4 py-3 rounded-card bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-elevation-overlay backdrop-blur"
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
                <Button variant="ghost" size="icon" onClick={onDismiss} aria-label="Dismiss" className="text-white/70 hover:text-white min-h-11 min-w-11">
                    <X className="w-4 h-4" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
};
