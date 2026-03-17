// @ts-nocheck
/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FabricContextValue } from './fabric/fabricContext.types';

const mockState = vi.hoisted(() => {
  const useAuth = vi.fn();
  const getDocument = vi.fn();
  const setDocument = vi.fn();
  const service = {
    initialize: vi.fn().mockResolvedValue(undefined),
    dispose: vi.fn(),
    getContext: vi.fn(),
    getPatterns: vi.fn(),
    getConfirmedPatterns: vi.fn(),
    getPredictions: vi.fn(),
    getInsightsFor: vi.fn(),
    isEnabled: vi.fn(),
    getBriefing: vi.fn(),
    getProactiveQuestion: vi.fn(),
    learnFrom: vi.fn(),
    dismissPattern: vi.fn(),
    deletePattern: vi.fn(),
    dismissPrediction: vi.fn(),
    query: vi.fn(),
    generateWeeklyReport: vi.fn(),
    clearAllData: vi.fn().mockResolvedValue(undefined),
    markQuestionShown: vi.fn(),
    updateActivity: vi.fn(),
  };
  return {
    useAuth,
    getDocument,
    setDocument,
    service,
  };
});

vi.mock('./AuthContext', () => ({
  useAuth: () => mockState.useAuth(),
}));

vi.mock('../services/fabric/FabricService', () => ({
  FabricService: {
    getInstance: () => mockState.service,
  },
}));

vi.mock('../utils/secureDb', () => ({
  secureDb: {
    getDocument: (...args: unknown[]) => mockState.getDocument(...args),
    setDocument: (...args: unknown[]) => mockState.setDocument(...args),
  },
}));

vi.mock('./fabric/useFabricInitialization', () => ({
  useFabricInitialization: () => undefined,
}));

vi.mock('./fabric/useFabricLiveSync', () => ({
  useFabricLiveSync: () => undefined,
}));

import { FabricProvider, useFabricContext } from './FabricContext';

const latestContextRef: { current: FabricContextValue | null } = { current: null };

function CaptureContext() {
  const value = useFabricContext();
  React.useEffect(() => {
    latestContextRef.current = value;
  }, [value]);
  return null;
}

describe('FabricContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockState.useAuth.mockReturnValue({ user: { uid: 'user-1' } });
    mockState.getDocument.mockResolvedValue(null);
    mockState.setDocument.mockResolvedValue(undefined);

    mockState.service.getContext.mockReturnValue({
      timeOfDay: 'morning',
      dayOfWeek: 1,
      isWeekend: false,
      isFirstOfMonth: false,
      isEndOfMonth: false,
      dayOfMonth: 16,
      hour: 10,
      specialContext: null,
    });
    mockState.service.getPatterns.mockReturnValue([]);
    mockState.service.getConfirmedPatterns.mockReturnValue([]);
    mockState.service.getPredictions.mockReturnValue([]);
    mockState.service.getInsightsFor.mockImplementation((feature: string) => {
      if (feature === 'dashboard') {
        return [{ id: 'i1', headline: 'A', detail: 'A', trend: 'up', severity: 'neutral', category: 'patterns', createdAt: 'now' }];
      }
      return [
        { id: 'i1', headline: 'A', detail: 'A', trend: 'up', severity: 'neutral', category: 'patterns', createdAt: 'now' },
        { id: 'i2', headline: 'B', detail: 'B', trend: 'stable', severity: 'positive', category: 'household', createdAt: 'now' },
      ];
    });
    mockState.service.isEnabled.mockReturnValue(true);
    mockState.service.getBriefing.mockReturnValue({ greeting: 'Hello', subtitle: 'Test', todayStats: { totalTasks: 0, completedTasks: 0, pendingTasks: 0 }, upcoming: [], spendingThisWeek: 0, currency: 'USD', generatedAt: '2026-03-16T12:00:00.000Z' });
    mockState.service.getProactiveQuestion.mockReturnValue('Should we plan your week?');
    mockState.service.query.mockResolvedValue({ data: null, summary: 'Query result', visualizable: false });
    mockState.service.generateWeeklyReport.mockResolvedValue({ weekStart: '2026-03-09', weekEnd: '2026-03-15', insights: [], commitmentSummary: { completed: 0, skipped: 0, missed: 0, completionRate: 0, bestCategory: '', worstCategory: '', longestStreak: { name: '', days: 0 } }, financeSummary: { totalSpent: 0, totalIncome: 0, netCashFlow: 0, topCategory: { name: '', amount: 0 }, vsLastWeek: 0 }, generatedAt: '2026-03-16T12:00:00.000Z' });
    latestContextRef.current = null;
  });

  it('throws when useFabricContext is used outside provider', () => {
    const Broken = () => {
      useFabricContext();
      return null;
    };

    expect(() => render(<Broken />)).toThrow('useFabricContext must be used within FabricProvider');
  });

  it('refreshes context data and de-duplicates family insights', async () => {
    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    act(() => {
        latestContextRef.current?.refresh();
    });

    await waitFor(() => {
        expect(latestContextRef.current?.isEnabled).toBe(true);
        expect(latestContextRef.current?.insights.map((i) => i.id)).toEqual(['i1', 'i2']);
        expect(latestContextRef.current?.proactiveQuestion).toBe('Should we plan your week?');
    });
  });

  it('runs query and stores last query result', async () => {
    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    await act(async () => {
      await latestContextRef.current?.runQuery('How much did I spend?');
    });

    expect(mockState.service.query).toHaveBeenCalledWith('How much did I spend?');
    expect(latestContextRef.current?.lastQueryResult?.summary).toBe('Query result');
  });

  it('forwards mutation actions to service methods', async () => {
    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    act(() => {
      latestContextRef.current?.learnFrom({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
      latestContextRef.current?.dismissPattern('pattern-1');
      latestContextRef.current?.deletePattern('pattern-2');
      latestContextRef.current?.dismissPrediction('pred-1');
    });

    expect(mockState.service.learnFrom).toHaveBeenCalledWith(
      { type: 'app_opened' },
      { type: 'view_page', page: 'dashboard' },
    );
    expect(mockState.service.dismissPattern).toHaveBeenCalledWith('pattern-1');
    expect(mockState.service.deletePattern).toHaveBeenCalledWith('pattern-2');
    expect(mockState.service.dismissPrediction).toHaveBeenCalledWith('pred-1');
  });

  it('returns null weekly report when service is disabled', async () => {
    mockState.service.isEnabled.mockReturnValue(false);

    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    let result: unknown;
    await act(async () => {
      result = await latestContextRef.current?.generateWeeklyReport();
    });

    expect(result).toBeNull();
    expect(mockState.service.generateWeeklyReport).not.toHaveBeenCalled();
  });

  it('generates and stores weekly report when service is enabled', async () => {
    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    let result: unknown;
    await act(async () => {
      result = await latestContextRef.current?.generateWeeklyReport();
    });

    expect(mockState.service.generateWeeklyReport).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expect.objectContaining({ weekStart: '2026-03-09' }));
    expect(latestContextRef.current?.weeklyReport).toEqual(expect.objectContaining({ weekStart: '2026-03-09' }));
  });

  it('saves mood through secureDb and updates local mood state', async () => {
    const today = new Date().toISOString().slice(0, 10);

    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    await act(async () => {
      await latestContextRef.current?.saveMood(4, 'Focused');
    });

    expect(mockState.setDocument).toHaveBeenCalledWith(
      'user-1',
      ['mood_entries', today],
      expect.objectContaining({ mood: 4, note: 'Focused' }),
    );
    expect(latestContextRef.current?.moodToday?.mood).toBe(4);
  });

  it('does not save mood when user is not available', async () => {
    mockState.useAuth.mockReturnValue({ user: null });

    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    await act(async () => {
      await latestContextRef.current?.saveMood(3, 'No user');
    });

    expect(mockState.setDocument).not.toHaveBeenCalled();
  });

  it('loads today mood when user is enabled', async () => {
    const today = new Date().toISOString().slice(0, 10);
    mockState.getDocument.mockResolvedValue({ date: today, mood: 5, createdAt: `${today}T07:00:00.000Z` });

    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    act(() => {
      latestContextRef.current?.refresh();
    });

    await waitFor(() => {
      expect(mockState.getDocument).toHaveBeenCalledWith('user-1', ['mood_entries', today]);
      expect(latestContextRef.current?.moodToday?.mood).toBe(5);
    });
  });

  it('clears proactive question when marked as shown', async () => {
    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    act(() => {
      latestContextRef.current?.refresh();
    });

    await waitFor(() => {
      expect(latestContextRef.current?.proactiveQuestion).toBe('Should we plan your week?');
    });

    act(() => {
      latestContextRef.current?.markQuestionShown('Should we plan your week?');
    });

    expect(mockState.service.markQuestionShown).toHaveBeenCalledWith('Should we plan your week?');
    expect(latestContextRef.current?.proactiveQuestion).toBeNull();
  });

  it('clears all data and refreshes state', async () => {
    render(
      <FabricProvider>
        <CaptureContext />
      </FabricProvider>,
    );

    await act(async () => {
      await latestContextRef.current?.clearAllData();
    });

    expect(mockState.service.clearAllData).toHaveBeenCalledTimes(1);
    expect(mockState.service.getContext).toHaveBeenCalled();
  });
});
