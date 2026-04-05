/**
 * useCardDrag — Pointer-based drag logic for card stack.
 * UX-041 Phase 2 §5.5. All values are refs (no state re-renders).
 */
import { useRef, useCallback } from 'react';
import { haptic } from '../utils/haptic';

const LONG_PRESS_MS = 500;

interface UseCardDragOptions {
  cardHeight: number;
  commitThresholdRatio: number;
  enabled: boolean;
  onTap: () => void;
  onCommit: () => void;
  onSpringBack: () => void;
  onDragUpdate: (offset: number) => void;
}

export function useCardDrag({
  cardHeight, commitThresholdRatio, enabled,
  onTap, onCommit, onSpringBack, onDragUpdate,
}: UseCardDragOptions) {
  const pointerStartY = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isLongPressRef = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  const commitThreshold = cardHeight * commitThresholdRatio;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!enabled) return;
    pointerStartY.current = e.clientY;
    dragOffsetRef.current = 0;
    isDraggingRef.current = false;
    isLongPressRef.current = false;

    longPressTimer.current = setTimeout(() => {
      isLongPressRef.current = true;
      haptic.lift();
      // TODO: enter reorder mode (long-press drag-to-reorder)
    }, LONG_PRESS_MS);
  }, [enabled]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!enabled) return;
    const dy = pointerStartY.current - e.clientY;

    if (Math.abs(dy) > 10 && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    if (dy > 0 && !isLongPressRef.current) {
      isDraggingRef.current = true;
      dragOffsetRef.current = dy;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => onDragUpdate(dy));
    }
  }, [enabled, onDragUpdate]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!enabled) return;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    isLongPressRef.current = false;

    const dy = pointerStartY.current - e.clientY;

    // Clean tap
    if (!isDraggingRef.current && Math.abs(dy) < 10) {
      haptic.selection();
      onTap();
      return;
    }

    // Drag release
    if (dragOffsetRef.current > commitThreshold) {
      haptic.success();
      onCommit();
    } else {
      onSpringBack();
    }

    isDraggingRef.current = false;
    dragOffsetRef.current = 0;
  }, [enabled, commitThreshold, onTap, onCommit, onSpringBack]);

  return { onPointerDown, onPointerMove, onPointerUp };
}
