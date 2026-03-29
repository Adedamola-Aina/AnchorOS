import React from 'react';
import { Sparkles, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@anchor-os/ui';
import { ToggleSwitch } from '../../../components/shared';
import { AnchorAIKnowledgePanel } from './AnchorAIKnowledgePanel';
import { useAnchorAISettings } from './useAnchorAISettings';

type ToastType = 'success' | 'error' | 'info';

interface AnchorAISettingsProps {
    userId?: string;
    showToast: (message: string, type: ToastType) => void;
}

export const AnchorAISettings: React.FC<AnchorAISettingsProps> = ({ userId, showToast }) => {
    const {
        settings, isLoading, isSaving,
        showKnowledge, setShowKnowledge,
        patternCount, patternGroups,
        onToggle, clearData, loadKnowledge, clearLearnedPatterns,
    } = useAnchorAISettings(userId, showToast);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                    </div>
                    Anchor AI
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Enable Anchor AI</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your personal intelligence assistant for commitments and finance.</p>
                    </div>
                    <ToggleSwitch
                        enabled={settings.enabled}
                        onToggle={onToggle}
                        disabled={!userId || isLoading || isSaving}
                        label="Toggle Anchor AI"
                    />
                </div>

                {settings.enabled && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        Anchor AI is active and learning from your activity.
                    </p>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <div className="space-y-3">
                    <Button variant="secondary" size="sm" className="min-h-11" onClick={clearData} disabled={!userId || isSaving}>
                        <Database className="w-4 h-4 mr-2" />
                        Clear Anchor AI Data
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-11"
                        onClick={() => {
                            const next = !showKnowledge;
                            setShowKnowledge(next);
                            if (next) void loadKnowledge();
                        }}
                        disabled={!userId || isLoading}
                    >
                        {showKnowledge ? 'Hide Anchor AI Knowledge' : 'What Anchor AI Knows'}
                    </Button>
                </div>
                {showKnowledge && (
                    <AnchorAIKnowledgePanel
                        patternCount={patternCount}
                        patternGroups={patternGroups}
                        userId={userId}
                        isSaving={isSaving}
                        onClearLearnedPatterns={clearLearnedPatterns}
                    />
                )}
            </CardContent>
        </Card>
    );
};
