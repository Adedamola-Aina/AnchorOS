import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFabric } from './useFabric';

const mockLearnFrom = vi.fn();
const mockDismissPattern = vi.fn();
const mockDeletePattern = vi.fn();
const mockDismissPrediction = vi.fn();
const mockRunQuery = vi.fn(async () => ({ summary: 'ok' }));
const mockGenerateWeeklyReport = vi.fn(async () => ({ weekStart: 'a' }));
const mockSaveMood = vi.fn(async () => undefined);
const mockClearAllData = vi.fn(async () => undefined);
const mockMarkQuestionShown = vi.fn();

vi.mock('../context/FabricContext', () => ({
  useFabricContext: () => ({
    isEnabled: true,
    isReady: true,
    context: {
      timeOfDay: 'morning',
      dayOfWeek: 1,
      isWeekend: false,
      isFirstOfMonth: false,
      isEndOfMonth: false,
      dayOfMonth: 1,
      hour: 8,
      specialContext: null,
    },
    patterns: [],
    confirmedPatterns: [],
    predictions: [],
    insights: [],
    lastQueryResult: null,
    weeklyReport: null,
    briefing: null,
    moodToday: null,
    learnFrom: mockLearnFrom,
    dismissPattern: mockDismissPattern,
    deletePattern: mockDeletePattern,
    dismissPrediction: mockDismissPrediction,
    runQuery: mockRunQuery,
    generateWeeklyReport: mockGenerateWeeklyReport,
    saveMood: mockSaveMood,
    clearAllData: mockClearAllData,
    proactiveQuestion: null,
    markQuestionShown: mockMarkQuestionShown,
    refresh: vi.fn(),
  }),
}));

describe('useFabric enabled behavior', () => {
  it('forwards mutating operations when enabled', () => {
    const { result } = renderHook(() => useFabric());

    result.current.learnFrom({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
    result.current.dismissPattern('p-1');
    result.current.deletePattern('p-1');
    result.current.dismissPrediction('pred-1');
    result.current.markQuestionShown('Question?');

    expect(mockLearnFrom).toHaveBeenCalledTimes(1);
    expect(mockDismissPattern).toHaveBeenCalledWith('p-1');
    expect(mockDeletePattern).toHaveBeenCalledWith('p-1');
    expect(mockDismissPrediction).toHaveBeenCalledWith('pred-1');
    expect(mockMarkQuestionShown).toHaveBeenCalledWith('Question?');
  });

  it('forwards async operations when enabled', async () => {
    const { result } = renderHook(() => useFabric());

    const queryResult = await result.current.runQuery('hello');
    const reportResult = await result.current.generateWeeklyReport();
    await result.current.saveMood(5, 'Good day');
    await result.current.clearAllData();

    expect(mockRunQuery).toHaveBeenCalledWith('hello');
    expect(mockGenerateWeeklyReport).toHaveBeenCalledTimes(1);
    expect(mockSaveMood).toHaveBeenCalledWith(5, 'Good day');
    expect(mockClearAllData).toHaveBeenCalledTimes(1);
    expect(queryResult).toEqual({ summary: 'ok' });
    expect(reportResult).toEqual({ weekStart: 'a' });
  });
});