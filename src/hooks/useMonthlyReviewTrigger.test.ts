import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMonthlyReviewTrigger } from './useMonthlyReviewTrigger';

const mockLoadReflection = vi.hoisted(() => vi.fn());

vi.mock('../services/fabric/fabricPersistence', () => ({
  loadMonthlyReflection: mockLoadReflection,
}));

describe('useMonthlyReviewTrigger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockLoadReflection.mockResolvedValue(null);
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows review when in first 5 days and no reflection exists', async () => {
    vi.setSystemTime(new Date('2026-03-03T12:00:00Z'));
    const { result } = renderHook(() => useMonthlyReviewTrigger('user-1'));
    await waitFor(() => expect(result.current.shouldShow).toBe(true));
    expect(result.current.reviewMonth).toBe('2026-02');
  });

  it('hides review when reflection already saved', async () => {
    vi.setSystemTime(new Date('2026-03-03T12:00:00Z'));
    mockLoadReflection.mockResolvedValue({ month: '2026-02' });
    const { result } = renderHook(() => useMonthlyReviewTrigger('user-1'));
    await waitFor(() => expect(mockLoadReflection).toHaveBeenCalled());
    expect(result.current.shouldShow).toBe(false);
  });

  it('hides review when past day 5', () => {
    vi.setSystemTime(new Date('2026-03-10T12:00:00Z'));
    const { result } = renderHook(() => useMonthlyReviewTrigger('user-1'));
    expect(result.current.shouldShow).toBe(false);
  });

  it('hides review when no userId', () => {
    vi.setSystemTime(new Date('2026-03-03T12:00:00Z'));
    const { result } = renderHook(() => useMonthlyReviewTrigger(undefined));
    expect(result.current.shouldShow).toBe(false);
  });
});
