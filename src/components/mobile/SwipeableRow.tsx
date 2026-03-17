import { type ReactNode } from 'react';
import { useSwipeGesture } from './useSwipeGesture';

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
  const { translateX, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold, disabled });

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
