/**
 * PullToRefresh - Mobile pull-to-refresh gesture component
 * 
 * Implements native pull-to-refresh behavior for mobile devices.
 * Uses touch events for gesture detection.
 * 
 * @module components/mobile/PullToRefresh
 */

import React, { useState, useRef, useCallback, type ReactNode, type RefObject } from 'react';
import { Loader2 } from 'lucide-react';

export interface PullToRefreshProps {
  /** Callback triggered when refresh gesture completes */
  onRefresh: () => Promise<void>;
  /** Content to wrap with pull-to-refresh behavior */
  children: ReactNode;
  /** Pull distance threshold in pixels before refresh triggers (default: 60) */
  threshold?: number;
  /** Reference to scrollable element to check scroll position */
  scrollRef?: RefObject<HTMLElement>;
  /** Whether pull-to-refresh is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * PullToRefresh wrapper component
 * 
 * @example
 * ```tsx
 * <PullToRefresh onRefresh={async () => await refetchData()}>
 *   <TransactionList transactions={transactions} />
 * </PullToRefresh>
 * ```
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 60,
  scrollRef,
  disabled = false,
  className = '',
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if we're at the top of the scroll container
  const isAtTop = useCallback(() => {
    if (scrollRef?.current) {
      return scrollRef.current.scrollTop <= 0;
    }
    // If no scrollRef, check window scroll
    if (typeof window !== 'undefined') {
      return window.scrollY <= 0;
    }
    return true;
  }, [scrollRef]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    if (!isAtTop()) return;
    
    // Ignore touch events from interactive elements (inputs, buttons, etc.)
    const target = e.target as HTMLElement;
    const interactiveElements = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'];
    if (interactiveElements.includes(target.tagName) || target.closest('input, textarea, select, button, a, [role="button"]')) {
      return;
    }
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [disabled, isRefreshing, isAtTop]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;
    if (!isAtTop()) {
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    // PULL-001: Prevent Chrome's native pull-to-refresh when we're handling it
    if (distance > 10) {
      e.preventDefault();
    }
    
    // Apply resistance - pulling gets harder as you pull more
    const resistedDistance = Math.min(distance * 0.5, threshold * 2);
    setPullDistance(resistedDistance);
  }, [isPulling, disabled, isRefreshing, isAtTop, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold && !isRefreshing && !disabled) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, disabled, onRefresh]);

  // Calculate progress percentage (0-100)
  const progress = Math.min(100, Math.round((pullDistance / threshold) * 100));
  const showIndicator = pullDistance > 10 || isRefreshing;

  return (
    <div
      ref={containerRef}
      data-testid="pull-to-refresh-container"
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {showIndicator && (
        <div
          role="status"
          aria-label={isRefreshing ? 'Refreshing content' : 'Pull to refresh'}
          aria-busy={isRefreshing}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="absolute left-0 right-0 flex justify-center transition-all duration-200 z-10"
          style={{
            top: Math.min(pullDistance - 40, 20),
            opacity: Math.min(1, pullDistance / (threshold * 0.5)),
          }}
        >
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full 
            bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700
            ${isRefreshing ? 'animate-pulse' : ''}
          `}>
            <Loader2 
              className={`w-5 h-5 text-primary-500 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: isRefreshing ? 'none' : `rotate(${progress * 3.6}deg)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Content with pull offset */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
