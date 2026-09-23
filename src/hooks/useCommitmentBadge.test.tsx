import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildTask } from '../test/factories';

const mockState = vi.hoisted(() => ({
  setAppBadgeCount: vi.fn((..._args: unknown[]) => Promise.resolve()),
  clearAppBadge: vi.fn((..._args: unknown[]) => Promise.resolve()),
}));

vi.mock('../utils/appBadge', () => ({
  setAppBadgeCount: (...args: unknown[]) => mockState.setAppBadgeCount(...args),
  clearAppBadge: (...args: unknown[]) => mockState.clearAppBadge(...args),
}));

import { getPendingCountForToday, useCommitmentBadge } from './useCommitmentBadge';

describe('useCommitmentBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('computes pending work due today: scheduled today plus anything carried over (UX-AI-06)', () => {
    // P1b: "today" = scheduled today OR carried over from an earlier scheduled
    // day. Previously the weekly-Friday task on a Friday counted, but Monday's
    // outstanding weekly and the 12th's monthly silently read 0 on the badge —
    // the audit's "the nav signals nothing" finding. 4 scheduled + 2 carried
    // over = 6, and the completed daily is excluded.
    const now = new Date('2026-04-10T09:00:00.000Z');
    const tasks = [
      buildTask({ type: 'daily', completed: false }),
      buildTask({ type: 'daily', completed: true }),
      buildTask({ type: 'weekly', completed: false, daysOfWeek: [5] }),
      buildTask({ type: 'weekly', completed: false, daysOfWeek: [1] }),
      buildTask({ type: 'monthly', completed: false, dayOfMonth: 10 }),
      buildTask({ type: 'monthly', completed: false, dayOfMonth: 12 }),
      buildTask({ type: 'todo', completed: false }),
    ];

    expect(getPendingCountForToday(tasks, now)).toBe(6);
  });

  it('syncs badge count for signed-in users', async () => {
    const tasks = [
      buildTask({ type: 'daily', completed: false }),
      buildTask({ type: 'daily', completed: true }),
    ];

    renderHook(() => useCommitmentBadge({ userId: 'user-1', tasks }));

    await waitFor(() => {
      expect(mockState.setAppBadgeCount).toHaveBeenCalledWith(1);
    });
  });

  it('clears badge for signed-out users', async () => {
    const tasks = [buildTask({ type: 'daily', completed: false })];

    renderHook(() => useCommitmentBadge({ userId: undefined, tasks }));

    await waitFor(() => {
      expect(mockState.clearAppBadge).toHaveBeenCalledTimes(1);
    });
  });

  it('re-syncs the badge when the app becomes visible again', async () => {
    const tasks = [buildTask({ type: 'daily', completed: false })];

    renderHook(() => useCommitmentBadge({ userId: 'user-1', tasks }));

    await waitFor(() => {
      expect(mockState.setAppBadgeCount).toHaveBeenCalledWith(1);
    });

    mockState.setAppBadgeCount.mockClear();

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expect(mockState.setAppBadgeCount).toHaveBeenCalledWith(1);
    });
  });
});