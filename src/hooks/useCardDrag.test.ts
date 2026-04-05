// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
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
  const makeOptions = (overrides = {}) => ({
    cardHeight: 200,
    commitThresholdRatio: 0.4,
    enabled: true,
    onTap: vi.fn(),
    onCommit: vi.fn(),
    onSpringBack: vi.fn(),
    onDragUpdate: vi.fn(),
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
    });

    expect(opts.onTap).toHaveBeenCalled();
  });

  it('does not call onTap when disabled', () => {
    const opts = makeOptions({ enabled: false });
    const { result } = renderHook(() => useCardDrag(opts));

    act(() => {
      result.current.onPointerDown({ clientY: 500 } as React.PointerEvent);
      result.current.onPointerUp({ clientY: 500 } as React.PointerEvent);
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
    });

    expect(opts.onCommit).toHaveBeenCalled();
    expect(opts.onSpringBack).not.toHaveBeenCalled();
  });
});
