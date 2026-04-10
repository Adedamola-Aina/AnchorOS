import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildTask } from '../test/factories';

const mockState = vi.hoisted(() => ({
  addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
  isAppPluginAvailable: false,
  setAppBadgeCount: vi.fn(() => Promise.resolve()),
  clearAppBadge: vi.fn(() => Promise.resolve()),
}));

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: (...args: unknown[]) => mockState.addListener(...args),
  },
}));

vi.mock('../utils/platform', () => ({
  isPluginAvailable: (name: string) => name === 'App' && mockState.isAppPluginAvailable,
}));

vi.mock('../utils/appBadge', () => ({
  setAppBadgeCount: (...args: unknown[]) => mockState.setAppBadgeCount(...args),
  clearAppBadge: (...args: unknown[]) => mockState.clearAppBadge(...args),
}));

import { getPendingCountForToday, useCommitmentBadge } from './useCommitmentBadge';

describe('useCommitmentBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.isAppPluginAvailable = false;
  });

  it('computes pending tasks scheduled for today', () => {
    const now = new Date('2026-04-10T09:00:00.000Z');
    const tasks = [
      buildTask({ type: 'daily', completed: false }),
      buildTask({ type: 'daily', completed: true }),
      buildTask({ type: 'weekly', completed: false, daysOfWeek: ['F'] }),
      buildTask({ type: 'weekly', completed: false, daysOfWeek: ['M'] }),
      buildTask({ type: 'monthly', completed: false, dayOfMonth: 10 }),
      buildTask({ type: 'monthly', completed: false, dayOfMonth: 12 }),
      buildTask({ type: 'todo', completed: false }),
    ];

    expect(getPendingCountForToday(tasks, now)).toBe(4);
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

  it('registers app resume listener when App plugin is available', async () => {
    mockState.isAppPluginAvailable = true;

    renderHook(() => useCommitmentBadge({ userId: 'user-1', tasks: [] }));

    await waitFor(() => {
      expect(mockState.addListener).toHaveBeenCalledWith('appStateChange', expect.any(Function));
    });
  });
});
