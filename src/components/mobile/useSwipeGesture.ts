import { useState, useRef, useCallback } from 'react';

const VERTICAL_LOCK_THRESHOLD = 12;

interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold: number;
  disabled: boolean;
}

interface UseSwipeGestureResult {
  translateX: number;
  isDragging: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold,
  disabled,
}: UseSwipeGestureOptions): UseSwipeGestureResult {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const isVerticalScrollRef = useRef(false);
  const axisLockedRef = useRef(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      const target = e.target as HTMLElement;
      const interactiveElements = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'];
      if (interactiveElements.includes(target.tagName) || target.closest('input, textarea, select, button, a, [role="button"]')) {
        return;
      }

      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      currentXRef.current = 0;
      isVerticalScrollRef.current = false;
      axisLockedRef.current = false;
      setIsDragging(true);
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isDragging) return;

      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = e.touches[0].clientY - startYRef.current;

      if (!axisLockedRef.current) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        if (absX < 4 && absY < 4) return;
        axisLockedRef.current = true;
        if (absY > absX || absY > VERTICAL_LOCK_THRESHOLD) {
          isVerticalScrollRef.current = true;
          setTranslateX(0);
          setIsDragging(false);
          return;
        }
      }

      if (isVerticalScrollRef.current) return;

      currentXRef.current = deltaX;
      const ACTION_WIDTH = 80;
      const clampedX = Math.max(-ACTION_WIDTH, Math.min(ACTION_WIDTH, deltaX));
      setTranslateX(clampedX);
    },
    [disabled, isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;

    setIsDragging(false);

    if (isVerticalScrollRef.current) {
      isVerticalScrollRef.current = false;
      setTranslateX(0);
      return;
    }

    const deltaX = currentXRef.current;
    if (Math.abs(deltaX) >= threshold) {
      if (deltaX < 0 && onSwipeLeft) onSwipeLeft();
      else if (deltaX > 0 && onSwipeRight) onSwipeRight();
    }

    setTranslateX(0);
  }, [disabled, threshold, onSwipeLeft, onSwipeRight]);

  return { translateX, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd };
}
