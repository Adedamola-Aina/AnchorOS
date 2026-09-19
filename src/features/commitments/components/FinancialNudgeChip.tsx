/**
 * UX-CM-08: the transaction offer shown on a just-completed commitment.
 *
 * Extracted from TaskItem per CLAUDE.md §3.2 (200-line rule).
 *
 * This replaced a blocking cross-domain "Financial Transaction?" modal: the same
 * offer, but inline, dismissible, and without moving the user off the page.
 */
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface FinancialNudgeChipProps {
    onRecord: () => void;
    onDismiss: () => void;
}

export const FinancialNudgeChip: React.FC<FinancialNudgeChipProps> = ({ onRecord, onDismiss }) => (
    <div
        className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-2.5 py-2"
        data-testid="financial-nudge"
    >
        <span className="text-xs text-slate-600 dark:text-slate-300 min-w-0 truncate">
            Record a transaction for this?
        </span>
        <Button variant="primary" size="sm" onClick={onRecord} className="shrink-0 text-xs min-h-[32px]">
            Record
        </Button>
        <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss transaction prompt"
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
    </div>
);