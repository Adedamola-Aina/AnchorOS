import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFabric } from './useFabric';

const mockLearnFrom = vi.fn();
const mockDismissPattern = vi.fn();
const mockDeletePattern = vi.fn();
const mockClearAllData = vi.fn(async () => undefined);

vi.mock('../context/FabricContext', () => ({
  useFabricContext: () => ({
    isEnabled: false,
    isReady: false,
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
    learnFrom: mockLearnFrom,
    dismissPattern: mockDismissPattern,
    deletePattern: mockDeletePattern,
    clearAllData: mockClearAllData,
    refresh: vi.fn(),
  }),
}));

describe('useFabric', () => {
  it('no-ops mutating operations when disabled', async () => {
    const { result } = renderHook(() => useFabric());

    result.current.learnFrom({ type: 'app_opened' }, { type: 'view_page', page: 'dashboard' });
    result.current.dismissPattern('p-1');
    result.current.deletePattern('p-1');
    await result.current.clearAllData();

    expect(mockLearnFrom).not.toHaveBeenCalled();
    expect(mockDismissPattern).not.toHaveBeenCalled();
    expect(mockDeletePattern).not.toHaveBeenCalled();
    expect(mockClearAllData).not.toHaveBeenCalled();
  });
});
