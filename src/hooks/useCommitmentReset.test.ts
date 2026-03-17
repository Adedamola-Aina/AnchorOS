// @ts-nocheck
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const resetCompletion = vi.fn().mockResolvedValue(undefined);
const resetStreak = vi.fn().mockResolvedValue(undefined);

vi.mock('../api/CommitmentResetApi', () => ({
  resetCommitmentCompletion: (...args: unknown[]) => resetCompletion(...args),
  resetCommitmentStreak: (...args: unknown[]) => resetStreak(...args),
}));

import { useCommitmentResetEffect } from './useCommitmentReset';

// Fixed reference: Monday 2024-01-15 12:00:00 UTC
const NOW = new Date('2024-01-15T12:00:00.000Z');
const TODAY = NOW.toLocaleDateString('en-CA'); // '2024-01-15'
const YESTERDAY = '2024-01-14';
const EIGHT_DAYS_AGO = '2024-01-07';
const LAST_MONTH = '2023-12-15';

const fakeUser = { uid: 'user-1' };

describe('useCommitmentResetEffect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does nothing when user is null', () => {
    const task = { id: 't1', type: 'daily', completed: true, lastCompletedAt: YESTERDAY, currentStreak: 1 };
    renderHook(() => useCommitmentResetEffect(null, [task]));
    expect(resetCompletion).not.toHaveBeenCalled();
  });

  it('does nothing when rawTasks is empty', () => {
    renderHook(() => useCommitmentResetEffect(fakeUser, []));
    expect(resetCompletion).not.toHaveBeenCalled();
  });

  // ── Daily ────────────────────────────────────────────────────────────────

  it('resets daily task when lastCompletedAt is a different day', () => {
    const task = { id: 't1', type: 'daily', completed: true, lastCompletedAt: YESTERDAY, currentStreak: 1 };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).toHaveBeenCalledWith('user-1', 't1');
  });

  it('does NOT reset daily task when lastCompletedAt is today', () => {
    const task = { id: 't1', type: 'daily', completed: true, lastCompletedAt: TODAY, currentStreak: 1 };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).not.toHaveBeenCalled();
  });

  it('does NOT reset daily task that is not yet completed', () => {
    const task = { id: 't1', type: 'daily', completed: false, lastCompletedAt: YESTERDAY, currentStreak: 0 };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).not.toHaveBeenCalled();
  });

  // ── Weekly ───────────────────────────────────────────────────────────────

  it('resets weekly task when today matches daysOfWeek', () => {
    // NOW is a Monday — include 'Monday' in daysOfWeek
    const task = {
      id: 't2', type: 'weekly', completed: true,
      lastCompletedAt: YESTERDAY, // different day
      daysOfWeek: ['Monday'],
      currentStreak: 2,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).toHaveBeenCalledWith('user-1', 't2');
  });

  it('resets weekly task when 7+ days have elapsed regardless of daysOfWeek', () => {
    const task = {
      id: 't2', type: 'weekly', completed: true,
      lastCompletedAt: EIGHT_DAYS_AGO, // 8 days ago
      daysOfWeek: ['Saturday'], // today is Monday — won't match
      currentStreak: 2,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).toHaveBeenCalledWith('user-1', 't2');
  });

  it('does NOT reset weekly task completed this cycle before 7 days', () => {
    const task = {
      id: 't2', type: 'weekly', completed: true,
      lastCompletedAt: '2024-01-13', // 2 days ago, Saturday
      daysOfWeek: ['Saturday'], // doesn't match Monday
      currentStreak: 2,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).not.toHaveBeenCalled();
  });

  // ── Monthly ──────────────────────────────────────────────────────────────

  it('resets monthly task when today is in daysOfMonth', () => {
    // NOW is the 15th — include 15 in daysOfMonth
    const task = {
      id: 't3', type: 'monthly', completed: true,
      lastCompletedAt: YESTERDAY,
      daysOfMonth: [15],
      currentStreak: 3,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).toHaveBeenCalledWith('user-1', 't3');
  });

  it('resets monthly task when dayOfMonth matches today', () => {
    const task = {
      id: 't3', type: 'monthly', completed: true,
      lastCompletedAt: YESTERDAY,
      dayOfMonth: 15,
      currentStreak: 3,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).toHaveBeenCalledWith('user-1', 't3');
  });

  it('resets monthly task when month has changed', () => {
    const task = {
      id: 't3', type: 'monthly', completed: true,
      lastCompletedAt: LAST_MONTH, // December vs January
      daysOfMonth: [20], // today is 15, not 20
      currentStreak: 3,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).toHaveBeenCalledWith('user-1', 't3');
  });

  it('does NOT reset monthly task within same month before commitment day', () => {
    const task = {
      id: 't3', type: 'monthly', completed: true,
      lastCompletedAt: '2024-01-10', // same month, different day
      daysOfMonth: [20], // today is the 15th, not the 20th
      currentStreak: 3,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetCompletion).not.toHaveBeenCalled();
  });

  // ── Streak breaking ──────────────────────────────────────────────────────

  it('breaks streak for daily task missed for more than 1.5 days', () => {
    // NOW is Jan 15 — lastCompletedAt Jan 13 = > 1.5 days
    const task = {
      id: 't4', type: 'daily', completed: false,
      lastCompletedAt: '2024-01-13T00:00:00.000Z',
      currentStreak: 5,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetStreak).toHaveBeenCalledWith('user-1', 't4');
  });

  it('does NOT break streak for daily task missed less than 1.5 days', () => {
    // NOW is Jan 15 12:00 — lastCompletedAt Jan 14 20:00 = ~16 hours = < 1.5 days
    const task = {
      id: 't4', type: 'daily', completed: false,
      lastCompletedAt: '2024-01-14T20:00:00.000Z',
      currentStreak: 5,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetStreak).not.toHaveBeenCalled();
  });

  it('breaks streak for weekly task missed for more than 8 days', () => {
    const task = {
      id: 't5', type: 'weekly', completed: false,
      lastCompletedAt: '2024-01-05T00:00:00.000Z', // 10 days ago
      currentStreak: 3,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetStreak).toHaveBeenCalledWith('user-1', 't5');
  });

  it('breaks streak for monthly task missed for more than 32 days', () => {
    const task = {
      id: 't6', type: 'monthly', completed: false,
      lastCompletedAt: '2023-12-10T00:00:00.000Z', // 36 days ago
      currentStreak: 2,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetStreak).toHaveBeenCalledWith('user-1', 't6');
  });

  it('does NOT break streak when currentStreak is 0', () => {
    const task = {
      id: 't7', type: 'daily', completed: false,
      lastCompletedAt: '2024-01-10T00:00:00.000Z',
      currentStreak: 0,
    };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetStreak).not.toHaveBeenCalled();
  });

  it('does NOT break streak when lastCompletedAt is absent', () => {
    const task = { id: 't8', type: 'daily', completed: false, currentStreak: 5 };
    renderHook(() => useCommitmentResetEffect(fakeUser, [task]));
    expect(resetStreak).not.toHaveBeenCalled();
  });

  it('processes multiple tasks independently', () => {
    const tasks = [
      { id: 't-daily', type: 'daily', completed: true, lastCompletedAt: YESTERDAY, currentStreak: 1 },
      { id: 't-missed', type: 'daily', completed: false, lastCompletedAt: '2024-01-12T00:00:00.000Z', currentStreak: 4 },
    ];
    renderHook(() => useCommitmentResetEffect(fakeUser, tasks));
    expect(resetCompletion).toHaveBeenCalledWith('user-1', 't-daily');
    expect(resetStreak).toHaveBeenCalledWith('user-1', 't-missed');
  });
});
