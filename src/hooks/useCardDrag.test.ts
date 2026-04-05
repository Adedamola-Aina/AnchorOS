// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardDrag } from './useCardDrag';

vi.mock('../utils/haptic', () => ({
  haptic: {
    selection: vi.fn(),
    lift: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('useCardDrag', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const makeOptions = (overrides = {}) => ({
    cardHeight: 200,
    commitThresholdRatio: 0.4,
    enabled: true,
    onTap: vi.fn(),
    onCommit: vi.fn(),
    onSpringBack: vi.fn(),
    onDragUpdate: vi.fn(),
    onReorderStart: vi.fn(),
    onReorderMove: vi.fn(),
    onReorderEnd: vi.fn(),
    ...overrides,
  });

  it('returns pointer event handlers', () => {
    const { result } = renderHook(() => useCardDrag(makeOptions()));
    expect(typeof result.current.onPointerDown).toBe('function');
    expect(typeof result.current.onPointerMove).toBe('function');
    expect(typeof result.current.onPointerUp).toBe('function');
  });

  it('calls onTap on clean tap (no drag)', () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useCardDrag(opts));

    act(() => {
      result.current.onPointerDown({ clientY: 500 } as React.PointerEvent);
      result.current.onPointerUp({ clientY: 498 } as React.PointerEvent);
      vi.runAllTimers();
    });

    expect(opts.onTap).toHaveBeenCalled();
  });

  it('does not call onTap when disabled', () => {
    const opts = makeOptions({ enabled: false });
    const { result } = renderHook(() => useCardDrag(opts));

    act(() => {
      result.current.onPointerDown({ clientY: 500 } as React.PointerEvent);
      result.current.onPointerUp({ clientY: 500 } as React.PointerEvent);
      vi.runAllTimers();
    });

    expect(opts.onTap).not.toHaveBeenCalled();
  });

  it('calls onSpringBack when drag is below commit threshold', () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useCardDrag(opts));

    act(() => {
      result.current.onPointerDown({ clientY: 500 } as React.PointerEvent);
      // Move up 30px (below threshold of 200*0.4=80)
      result.current.onPointerMove({ clientY: 470 } as React.PointerEvent);
      result.current.onPointerUp({ clientY: 470 } as React.PointerEvent);
      vi.runAllTimers();
    });

    expect(opts.onSpringBack).toHaveBeenCalled();
    expect(opts.onCommit).not.toHaveBeenCalled();
  });

  it('calls onCommit when drag exceeds commit threshold', () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useCardDrag(opts));

    act(() => {
      result.current.onPointerDown({ clientY: 500 } as React.PointerEvent);
      // Move up 100px (above threshold of 80)
      result.current.onPointerMove({ clientY: 400 } as React.PointerEvent);
      result.current.onPointerUp({ clientY: 400 } as React.PointerEvent);
      vi.runAllTimers();
    });

    expect(opts.onCommit).toHaveBeenCalled();
    expect(opts.onSpringBack).not.toHaveBeenCalled();
  });

  it('starts reorder mode after a long press', () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useCardDrag(opts));

    act(() => {
      result.current.onPointerDown({ clientY: 500 } as React.PointerEvent);
      vi.advanceTimersByTime(500);
    });

    expect(opts.onReorderStart).toHaveBeenCalledTimes(1);
  });

  it('emits reorder movement and completion after long press', () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useCardDrag(opts));

    act(() => {
      result.current.onPointerDown({ clientY: 500 } as React.PointerEvent);
      vi.advanceTimersByTime(500);
      result.current.onPointerMove({ clientY: 620 } as React.PointerEvent);
      vi.advanceTimersByTime(16);
      result.current.onPointerUp({ clientY: 620 } as React.PointerEvent);
    });

    expect(opts.onReorderMove).toHaveBeenCalledWith(120);
    expect(opts.onReorderEnd).toHaveBeenCalledWith(120);
    expect(opts.onCommit).not.toHaveBeenCalled();
    expect(opts.onTap).not.toHaveBeenCalled();
  });
});
