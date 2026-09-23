
/**
 * The undo window and the completion message.
 *
 * Reported: the "Completed …" chip stayed on screen until the user pressed Undo or
 * Dismiss (measured still present nine seconds later). It is now a window that
 * closes itself; these tests pin the window, and pin that a re-render cannot
 * extend it.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { UNDO_WINDOW_MS, useCommitmentsWorkspace } from './useCommitmentsWorkspace';
import type { AnchorTask } from '../../../types';

const task = (overrides: Partial<AnchorTask> = {}): AnchorTask => ({
  id: 't1', title: 'Gym', type: 'daily', completed: false, category: 'personal', createdAt: new Date('2026-09-01'), ...overrides,
} as AnchorTask);

const setup = (tasks: AnchorTask[] = [task()]) => {
  const addTask = vi.fn().mockResolvedValue(undefined);
  const toggleTask = vi.fn().mockResolvedValue(undefined);
  const deleteTask = vi.fn().mockResolvedValue(undefined);
  // The field's value is owned by the page (CM-29) and passed in.
  const hook = renderHook(({ query = '' }: { query?: string } = {}) => useCommitmentsWorkspace({
    tasks, addTask, toggleTask, deleteTask, query, setQuery: () => {}, now: new Date('2026-09-22T09:00:00'),
  }));
  return { ...hook, addTask, toggleTask, deleteTask };
};

describe('completing a commitment', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('writes the toggle and names the commitment in the message', async () => {
    const { result, toggleTask } = setup();

    await act(async () => { await result.current.completeWithUndo('t1', 'Gym', false); });

    expect(toggleTask).toHaveBeenCalledWith('t1', false);
    expect(result.current.undo?.message).toContain('Gym');
  });

  it('offers no undo when the action was un-completing', async () => {
    const { result, toggleTask } = setup();

    await act(async () => { await result.current.completeWithUndo('t1', 'Gym', true); });

    expect(toggleTask).toHaveBeenCalledWith('t1', true);
    expect(result.current.undo).toBeNull();
  });
});

describe('the undo window', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('stays actionable for the whole window, then closes itself', async () => {
    const { result } = setup();
    await act(async () => { await result.current.completeWithUndo('t1', 'Gym', false); });

    await act(async () => { vi.advanceTimersByTime(UNDO_WINDOW_MS - 250); });
    expect(result.current.undo).not.toBeNull();

    await act(async () => { vi.advanceTimersByTime(300); });
    expect(result.current.undo).toBeNull();
  });

  it('does not restart the countdown on re-render', async () => {
    const { result, rerender } = setup();
    await act(async () => { await result.current.completeWithUndo('t1', 'Gym', false); });

    // A view that re-renders repeatedly (a ticking clock, a streaming list) must
    // not be able to keep the chip alive: the window is keyed on the undo state.
    for (let i = 0; i < 5; i += 1) {
      await act(async () => { vi.advanceTimersByTime(UNDO_WINDOW_MS / 3); });
      rerender();
    }

    expect(result.current.undo).toBeNull();
  });

  it('closes immediately when dismissed', async () => {
    const { result } = setup();
    await act(async () => { await result.current.completeWithUndo('t1', 'Gym', false); });

    act(() => { result.current.dismissUndo(); });

    expect(result.current.undo).toBeNull();
  });

  it('exposes a stable dismiss function, so consumers cannot extend the window', () => {
    const { result, rerender } = setup();
    const before = result.current.dismissUndo;
    rerender();
    expect(result.current.dismissUndo).toBe(before);
  });
});