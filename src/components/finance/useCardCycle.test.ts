import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { PanInfo } from 'framer-motion';
import { useCardCycle } from './useCardCycle';

const { hapticSelection } = vi.hoisted(() => ({
  hapticSelection: vi.fn(),
}));

vi.mock('../../utils/haptic', () => ({
  haptic: {
    selection: hapticSelection,
  },
}));

function makePanInfo(offsetY: number): PanInfo {
  return {
    point: { x: 0, y: 0 },
    delta: { x: 0, y: 0 },
    offset: { x: 0, y: offsetY },
    velocity: { x: 0, y: 0 },
  };
}

describe('useCardCycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('marks tap suppression once drag offset exceeds tap threshold', () => {
    const { result } = renderHook(() => useCardCycle(3, 100));

    expect(result.current.suppressTapRef.current).toBe(false);

    act(() => {
      result.current.handleDrag(new MouseEvent('mousemove'), makePanInfo(7));
    });

    expect(result.current.suppressTapRef.current).toBe(true);
    expect(result.current.dragPreviewOffset).toBe(7);
  });

  it('keeps tap suppression off for small drag offsets', () => {
    const { result } = renderHook(() => useCardCycle(3, 100));

    act(() => {
      result.current.handleDrag(new MouseEvent('mousemove'), makePanInfo(6));
    });

    expect(result.current.suppressTapRef.current).toBe(false);
    expect(result.current.dragPreviewOffset).toBe(6);
  });

  it('does not trigger cycle when drag ends under threshold', () => {
    const { result } = renderHook(() => useCardCycle(3, 100));

    act(() => {
      result.current.handleDragEnd(new MouseEvent('mouseup'), makePanInfo(31));
    });

    expect(hapticSelection).not.toHaveBeenCalled();
    expect(result.current.cyclingDirection).toBeNull();
    expect(result.current.rotationOffset).toBe(0);
    expect(result.current.dragPreviewOffset).toBe(0);
  });

  it('cycles to next card on upward swipe at threshold boundary', () => {
    const { result } = renderHook(() => useCardCycle(4, 100));

    act(() => {
      result.current.handleDragEnd(new MouseEvent('mouseup'), makePanInfo(-32));
    });

    expect(hapticSelection).toHaveBeenCalledTimes(1);
    expect(result.current.cyclingDirection).toBe('next');

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(result.current.rotationOffset).toBe(1);
    expect(result.current.cyclingDirection).toBeNull();
    expect(result.current.dragPreviewOffset).toBe(0);
  });

  it('cycles to previous card on downward swipe and wraps index', () => {
    const { result } = renderHook(() => useCardCycle(3, 100));

    act(() => {
      result.current.handleDragEnd(new MouseEvent('mouseup'), makePanInfo(32));
    });

    expect(hapticSelection).toHaveBeenCalledTimes(1);
    expect(result.current.cyclingDirection).toBe('previous');

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(result.current.rotationOffset).toBe(2);
    expect(result.current.cyclingDirection).toBeNull();
  });

  it('keeps rotation stable when account count is zero', () => {
    const { result } = renderHook(() => useCardCycle(0, 100));

    act(() => {
      result.current.handleDragEnd(new MouseEvent('mouseup'), makePanInfo(-40));
      vi.advanceTimersByTime(220);
    });

    expect(result.current.rotationOffset).toBe(0);
    expect(result.current.cyclingDirection).toBeNull();
  });

  it('resetRotation returns offset to zero after multiple cycles', () => {
    const { result } = renderHook(() => useCardCycle(5, 100));

    act(() => {
      result.current.handleDragEnd(new MouseEvent('mouseup'), makePanInfo(-40));
      vi.advanceTimersByTime(220);
      result.current.handleDragEnd(new MouseEvent('mouseup'), makePanInfo(-40));
      vi.advanceTimersByTime(220);
    });

    expect(result.current.rotationOffset).toBe(2);

    act(() => {
      result.current.resetRotation();
    });

    expect(result.current.rotationOffset).toBe(0);
  });
});
