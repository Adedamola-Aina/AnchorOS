/**
 * useAnchorAISettings — ARCH-001
 * Tests: settings load, toggle, and error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../../../utils/secureDb', () => ({
    secureDb: {
        getDocument: vi.fn(),
        setDocument: vi.fn(),
    },
}));

vi.mock('./anchorAIKnowledgeUtils', () => ({
    clearAllAnchorAIData: vi.fn(),
    clearPatternKnowledge: vi.fn(),
    loadPatternKnowledge: vi.fn().mockResolvedValue({ patternCount: 5, patternGroups: 2 }),
}));

import { secureDb } from '../../../utils/secureDb';
import { loadPatternKnowledge, clearAllAnchorAIData } from './anchorAIKnowledgeUtils';
import { useAnchorAISettings } from './useAnchorAISettings';

describe('useAnchorAISettings', () => {
    const showToast = vi.fn();
    const userId = 'user-abc';

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(secureDb.getDocument).mockResolvedValue(null);
        vi.mocked(secureDb.setDocument).mockResolvedValue(undefined);
    });

    it('loads saved settings on mount', async () => {
        vi.mocked(secureDb.getDocument).mockResolvedValue({ enabled: true, dataCollectionEnabled: true });
        const { result } = renderHook(() => useAnchorAISettings(userId, showToast));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.settings.enabled).toBe(true);
    });

    it('uses DEFAULT_SETTINGS when no stored document', async () => {
        const { result } = renderHook(() => useAnchorAISettings(userId, showToast));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.settings.enabled).toBe(false);
    });

    it('skips loading and sets isLoading false when userId is undefined', async () => {
        const { result } = renderHook(() => useAnchorAISettings(undefined, showToast));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(secureDb.getDocument).not.toHaveBeenCalled();
    });

    it('shows error toast when settings load fails', async () => {
        vi.mocked(secureDb.getDocument).mockRejectedValue(new Error('Firestore error'));
        const { result } = renderHook(() => useAnchorAISettings(userId, showToast));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Firestore error'), 'error');
    });

    it('toggles enabled state and persists to secureDb', async () => {
        const { result } = renderHook(() => useAnchorAISettings(userId, showToast));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        await act(async () => { await result.current.onToggle(); });
        expect(secureDb.setDocument).toHaveBeenCalledWith(
            userId,
            ['fabric_settings', 'state'],
            expect.objectContaining({ enabled: true }),
        );
        expect(result.current.settings.enabled).toBe(true);
    });

    it('loadKnowledge fetches pattern summary', async () => {
        const { result } = renderHook(() => useAnchorAISettings(userId, showToast));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        await act(async () => { await result.current.loadKnowledge(); });
        expect(loadPatternKnowledge).toHaveBeenCalledWith(userId);
        expect(result.current.patternCount).toBe(5);
        expect(result.current.patternGroups).toBe(2);
    });

    it('clearLearnedPatterns resets counts and calls clearAllAnchorAIData', async () => {
        vi.mocked(loadPatternKnowledge).mockResolvedValue({ patternCount: 3, patternGroups: 1 });
        const { result } = renderHook(() => useAnchorAISettings(userId, showToast));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        await act(async () => { await result.current.loadKnowledge(); });
        await act(async () => { await result.current.clearLearnedPatterns(); });
        expect(clearAllAnchorAIData).toHaveBeenCalledWith(userId, expect.any(String), false);
        expect(result.current.patternCount).toBe(0);
        expect(result.current.patternGroups).toBe(0);
    });
});
