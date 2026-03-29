/**
 * useAnchorAISettings — data logic for AnchorAISettings component
 * Extracted per ARCH-001 (200-line rule).
 */
import { useCallback, useEffect, useState } from 'react';
import { secureDb } from '../../../utils/secureDb';
import type { FabricSettings } from '../../../types';
import { clearAllAnchorAIData, clearPatternKnowledge, loadPatternKnowledge } from './anchorAIKnowledgeUtils';

type ToastType = 'success' | 'error' | 'info';

const DEFAULT_SETTINGS: FabricSettings = { enabled: false, dataCollectionEnabled: false };

export function useAnchorAISettings(userId: string | undefined, showToast: (msg: string, type: ToastType) => void) {
    const [settings, setSettings] = useState<FabricSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showKnowledge, setShowKnowledge] = useState(false);
    const [patternCount, setPatternCount] = useState(0);
    const [patternGroups, setPatternGroups] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (!userId) { if (isMounted) setIsLoading(false); return; }
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
        return () => { isMounted = false; };
    }, [showToast, userId]);

    const persistSettings = useCallback(async (next: FabricSettings) => {
        if (!userId) return;
        await secureDb.setDocument(userId, ['fabric_settings', 'state'], { ...next } as Record<string, unknown>);
        setSettings(next);
    }, [userId]);

    const onToggle = useCallback(async () => {
        if (!userId || isSaving) return;
        const next = { ...settings, enabled: !settings.enabled, dataCollectionEnabled: !settings.enabled };
        setIsSaving(true);
        try {
            await persistSettings(next);
            showToast(next.enabled ? 'Anchor AI enabled.' : 'Anchor AI disabled.', 'success');
        } catch (error) {
            showToast(`Unable to update Anchor AI: ${(error as Error).message}`, 'error');
        } finally { setIsSaving(false); }
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
        } finally { setIsSaving(false); }
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
        } finally { setIsSaving(false); }
    }, [isSaving, showToast, userId]);

    return {
        settings, isLoading, isSaving,
        showKnowledge, setShowKnowledge,
        patternCount, patternGroups,
        onToggle, clearData, loadKnowledge, clearLearnedPatterns,
    };
}
