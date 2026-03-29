import React from 'react';
import { Button } from '@anchor-os/ui';

interface AnchorAIKnowledgePanelProps {
    patternCount: number;
    patternGroups: number;
    userId?: string;
    isSaving: boolean;
    onClearLearnedPatterns: () => void;
}

export const AnchorAIKnowledgePanel: React.FC<AnchorAIKnowledgePanelProps> = ({
    patternCount,
    patternGroups,
    userId,
    isSaving,
    onClearLearnedPatterns,
}) => {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3">
            <p className="text-sm text-slate-700 dark:text-slate-200">
                Anchor AI uses your own account data to personalize insights:
                transactions, commitments, recurring items, app interactions, and optional mood check-ins.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Learned patterns: <span className="font-semibold">{patternCount}</span> records across <span className="font-semibold">{patternGroups}</span> behavior groups.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Privacy: your data stays in your account. We do not use your personal data to train public models.
            </p>
            <Button
                variant="secondary"
                size="sm"
                className="min-h-11"
                onClick={onClearLearnedPatterns}
                disabled={!userId || isSaving}
            >
                Delete Learned Patterns
            </Button>
        </div>
    );
};
