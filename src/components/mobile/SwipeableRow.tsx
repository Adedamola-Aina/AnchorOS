/**
 * SwipeableRow Component
 * 
 * A touch-enabled row component that reveals actions when swiped.
 * - Swipe left to reveal right action (e.g., delete)
 * - Swipe right to reveal left action (e.g., edit)
 * 
 * Uses native touch events for optimal mobile performance.
 * No external library dependencies (per AD-2 in mob_opt_phase2_plan.md).
 * 
 * @module components/mobile/SwipeableRow
 */
// @ts-nocheck


import { useState, useRef, useCallback, type ReactNode } from 'react';

export interface SwipeAction {
  label: string;
  color: 'blue' | 'red' | 'green' | 'gray';
  icon?: ReactNode;
}

export interface SwipeableRowProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

const ACTION_WIDTH = 80;
const DEFAULT_THRESHOLD = 60;

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500 text-white',
  red: 'bg-red-500 text-white',
  green: 'bg-green-500 text-white',
  gray: 'bg-gray-500 text-white',
};

/**
 * Vertical movement threshold (px) — if the user's finger moves more than
 * this vertically before establishing a clear horizontal intent, we treat
 * it as a scroll and cancel the swipe gesture entirely.
 */
const VERTICAL_LOCK_THRESHOLD = 12;

export function SwipeableRow({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  threshold = DEFAULT_THRESHOLD,
  disabled = false,
  className = '',
}: SwipeableRowProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  /** Once set to true for a gesture, horizontal swiping is suppressed. */
  const isVerticalScrollRef = useRef(false);
  /** Whether the axis has been decided for this gesture (prevents flip-flopping). */
  const axisLockedRef = useRef(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      
      // Ignore touch events from interactive elements (inputs, buttons, etc.)
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
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isDragging) return;

      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = e.touches[0].clientY - startYRef.current;

      // Determine dominant axis on first significant movement
      if (!axisLockedRef.current) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        // Wait until there's enough movement to decide
        if (absX < 4 && absY < 4) return;
        axisLockedRef.current = true;
        if (absY > absX || absY > VERTICAL_LOCK_THRESHOLD) {
          // Vertical scroll wins — cancel swipe for this gesture
          isVerticalScrollRef.current = true;
          setTranslateX(0);
          setIsDragging(false);
          return;
        }
      }

      if (isVerticalScrollRef.current) return;

      currentXRef.current = deltaX;
      
      // Limit swipe distance
      const maxSwipe = ACTION_WIDTH;
      const clampedX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
      
      setTranslateX(clampedX);
    },
    [disabled, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;
    
    setIsDragging(false);
    
    // If the gesture was a vertical scroll, do nothing
    if (isVerticalScrollRef.current) {
      isVerticalScrollRef.current = false;
      setTranslateX(0);
      return;
    }

    const deltaX = currentXRef.current;
    
    // Check if swipe exceeded threshold
    if (Math.abs(deltaX) >= threshold) {
      if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
    
    // Reset position with animation
    setTranslateX(0);
  }, [disabled, threshold, onSwipeLeft, onSwipeRight]);

  return (
    <div
      data-testid="swipeable-row"
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* Left action (revealed when swiping right) */}
      {leftAction && (
        <div
          data-testid="left-action"
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 flex items-center justify-center ${colorClasses[leftAction.color]}`}
          style={{ width: ACTION_WIDTH }}
        >
          {leftAction.icon}
          <span className="text-sm font-medium">{leftAction.label}</span>
        </div>
      )}

      {/* Right action (revealed when swiping left) */}
      {rightAction && (
        <div
          data-testid="right-action"
          aria-hidden="true"
          className={`absolute inset-y-0 right-0 flex items-center justify-center ${colorClasses[rightAction.color]}`}
          style={{ width: ACTION_WIDTH }}
        >
          {rightAction.icon}
          <span className="text-sm font-medium">{rightAction.label}</span>
        </div>
      )}

      {/* Content wrapper - matches Card background to hide action buttons when not swiping */}
      <div
        data-testid="swipeable-content"
        className={`relative bg-white dark:bg-slate-900 rounded-2xl transition-transform ${isDragging ? 'duration-0' : 'duration-200'}`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
