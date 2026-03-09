import React, { useCallback, useEffect, useState } from 'react';
import { Sparkles, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@anchor-os/ui';
import { ToggleSwitch } from '../../../components/shared';
import { secureDb } from '../../../utils/secureDb';
import type { FabricSettings } from '../../../types';

type ToastType = 'success' | 'error' | 'info';

interface AnchorAISettingsProps {
    userId?: string;
    showToast: (message: string, type: ToastType) => void;
    onOpenTransparency?: () => void;
}

const DEFAULT_SETTINGS: FabricSettings = {
    enabled: false,
    dataCollectionEnabled: false,
};

export const AnchorAISettings: React.FC<AnchorAISettingsProps> = ({
    userId,
    showToast,
    onOpenTransparency,
}) => {
    const [settings, setSettings] = useState<FabricSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
        await secureDb.setDocument(userId, ['fabric_settings', 'state'], next);
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
            await Promise.all([
                secureDb.setDocument(userId, ['fabric_behavior', 'state'], {
                    patterns: [],
                    confirmedPatterns: [],
                    recentActions: [],
                    dismissedPatterns: [],
                    updatedAt: now,
                }),
                secureDb.setDocument(userId, ['fabric_predictions', 'state'], {
                    active: [],
                    updatedAt: now,
                }),
                secureDb.setDocument(userId, ['fabric_settings', 'state'], {
                    ...settings,
                    lastCleared: now,
                }),
            ]);

            setSettings(prev => ({ ...prev, lastCleared: now }));
            showToast('Anchor AI data cleared.', 'success');
        } catch (error) {
            showToast(`Unable to clear Anchor AI data: ${(error as Error).message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, settings, showToast, userId]);

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
                        onClick={() => (onOpenTransparency ? onOpenTransparency() : window.location.assign('/fabric/transparency'))}
                        disabled={!userId || isLoading}
                    >
                        What Anchor AI Knows
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
