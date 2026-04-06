/**
 * useCardCycle — Swipe-to-advance cycling logic for wallet card stack.
 * Extracted from CardStack to keep component under 200 lines (ARCH-001).
 */
import { useState, useCallback, useRef } from 'react';
import type { PanInfo } from 'framer-motion';
import { haptic } from '../../utils/haptic';

const SWIPE_THRESHOLD_RATIO = 0.32;
const SWIPE_EXIT_DISTANCE = 120;

export { SWIPE_EXIT_DISTANCE };

export function useCardCycle(accountCount: number, cardHeight: number) {
  const suppressTapRef = useRef(false);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [dragPreviewOffset, setDragPreviewOffset] = useState(0);
  const [cyclingDirection, setCyclingDirection] = useState<'next' | 'previous' | null>(null);

  const finishCycle = useCallback((direction: 'next' | 'previous') => {
    setTimeout(() => {
      setRotationOffset((prev) => {
        if (accountCount === 0) return prev;
        if (direction === 'next') return prev + 1;
        return (prev - 1 + accountCount) % accountCount;
      });
      setCyclingDirection(null);
      setDragPreviewOffset(0);
    }, 220);
  }, [accountCount]);

  const handleDrag = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.y) > 6) {
      suppressTapRef.current = true;
    }
    setDragPreviewOffset(info.offset.y);
  }, []);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardHeight * SWIPE_THRESHOLD_RATIO;
    if (info.offset.y <= -threshold) {
      haptic.selection();
      setCyclingDirection('next');
      setDragPreviewOffset(0);
      finishCycle('next');
      return;
    }
    if (info.offset.y >= threshold) {
      haptic.selection();
      setCyclingDirection('previous');
      setDragPreviewOffset(0);
      finishCycle('previous');
      return;
    }
    setDragPreviewOffset(0);
  }, [cardHeight, finishCycle]);

  const resetRotation = useCallback(() => setRotationOffset(0), []);

  return {
    suppressTapRef,
    rotationOffset,
    dragPreviewOffset,
    cyclingDirection,
    handleDrag,
    handleDragEnd,
    resetRotation,
  };
}
