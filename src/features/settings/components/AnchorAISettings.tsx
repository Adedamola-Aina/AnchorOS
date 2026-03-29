import React, { useCallback, useEffect, useState } from 'react';
import { Sparkles, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@anchor-os/ui';
import { ToggleSwitch } from '../../../components/shared';
import { secureDb } from '../../../utils/secureDb';
import type { FabricSettings } from '../../../types';
import { AnchorAIKnowledgePanel } from './AnchorAIKnowledgePanel';
import { clearAllAnchorAIData, clearPatternKnowledge, loadPatternKnowledge } from './anchorAIKnowledgeUtils';
type ToastType = 'success' | 'error' | 'info';

interface AnchorAISettingsProps {
    userId?: string;
    showToast: (message: string, type: ToastType) => void;
}

const DEFAULT_SETTINGS: FabricSettings = {
    enabled: false,
    dataCollectionEnabled: false,
};
export const AnchorAISettings: React.FC<AnchorAISettingsProps> = ({
    userId,
    showToast,
}) => {
    const [settings, setSettings] = useState<FabricSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showKnowledge, setShowKnowledge] = useState(false);
    const [patternCount, setPatternCount] = useState(0);
    const [patternGroups, setPatternGroups] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            if (!userId) {
                if (isMounted) setIsLoading(false);
                return;
            }

            try {
                const persisted = await secureDb.getDocument<FabricSettings>(userId, ['fabric_settings', 'state']);
                if (!isMounted) return;
                setSettings(persisted ?? DEFAULT_SETTINGS);
            } catch (error) {
                if (!isMounted) return;
                showToast(`Failed to load Anchor AI settings: ${(error as Error).message}`, 'error');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [showToast, userId]);

    const persistSettings = useCallback(async (next: FabricSettings) => {
        if (!userId) return;
        await secureDb.setDocument(userId, ['fabric_settings', 'state'], { ...next } as Record<string, unknown>);
        setSettings(next);
    }, [userId]);

    const onToggle = useCallback(async () => {
        if (!userId || isSaving) return;

        const next = {
            ...settings,
            enabled: !settings.enabled,
            dataCollectionEnabled: !settings.enabled,
        };

        setIsSaving(true);
        try {
            await persistSettings(next);
            showToast(next.enabled ? 'Anchor AI enabled.' : 'Anchor AI disabled.', 'success');
        } catch (error) {
            showToast(`Unable to update Anchor AI: ${(error as Error).message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, persistSettings, settings, showToast, userId]);

    const clearData = useCallback(async () => {
        if (!userId || isSaving) return;
        if (!window.confirm('Clear all learned Anchor AI data and patterns?')) return;

        setIsSaving(true);
        try {
            const now = new Date().toISOString();
            await clearAllAnchorAIData(userId, now, settings.enabled);

            setSettings(prev => ({ ...prev, lastCleared: now }));
            showToast('Anchor AI data cleared.', 'success');
        } catch (error) {
            showToast(`Unable to clear Anchor AI data: ${(error as Error).message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, settings, showToast, userId]);

    const loadKnowledge = useCallback(async () => {
        if (!userId) return;
        try {
            const summary = await loadPatternKnowledge(userId);
            setPatternCount(summary.patternCount);
            setPatternGroups(summary.patternGroups);
        } catch (error) {
            showToast(`Unable to load Anchor AI knowledge: ${(error as Error).message}`, 'error');
        }
    }, [showToast, userId]);

    const clearLearnedPatterns = useCallback(async () => {
        if (!userId || isSaving) return;
        setIsSaving(true);
        try {
            const now = new Date().toISOString();
            await clearPatternKnowledge(userId, now);
            setPatternCount(0);
            setPatternGroups(0);
            showToast('Learned Anchor AI patterns deleted.', 'success');
        } catch (error) {
            showToast(`Unable to delete learned patterns: ${(error as Error).message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, showToast, userId]);

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
                    <Button
                        variant="secondary"
                        size="sm"
                        className="min-h-11"
                        onClick={clearData}
                        disabled={!userId || isSaving}
                    >
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
