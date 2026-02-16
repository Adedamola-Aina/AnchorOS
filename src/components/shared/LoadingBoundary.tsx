/**
 * LoadingBoundary - Combines Suspense with skeleton fallbacks
 * 
 * Provides consistent loading UX across the app by:
 * 1. Using Suspense for lazy-loaded components
 * 2. Showing skeleton loaders for perceived performance
 * 3. Preventing layout shift during load
 * 
 * @module components/shared/LoadingBoundary
 */
// @ts-nocheck


import React, { Suspense } from 'react';
import { SkeletonDashboard, SkeletonFinance, SkeletonCommitments, SkeletonSettings } from './Skeleton';
import { AnchorLoadingSpinner } from './AnchorLoadingSpinner';

type SkeletonType = 'dashboard' | 'finance' | 'commitments' | 'settings' | 'spinner' | 'minimal';

interface LoadingBoundaryProps {
  children: React.ReactNode;
  /** Which skeleton to show while loading */
  skeleton?: SkeletonType;
  /** Custom fallback component (overrides skeleton) */
  fallback?: React.ReactNode;
  /** Optional loading message */
  message?: string;
}

const skeletonComponents: Record<SkeletonType, React.FC<{ message?: string }>> = {
  dashboard: ({ message }) => (
    <div>
      <SkeletonDashboard />
      {message && <p className="sr-only">{message}</p>}
    </div>
  ),
  finance: ({ message }) => (
    <div>
      <SkeletonFinance />
      {message && <p className="sr-only">{message}</p>}
    </div>
  ),
  commitments: ({ message }) => (
    <div>
      <SkeletonCommitments />
      {message && <p className="sr-only">{message}</p>}
    </div>
  ),
  settings: ({ message }) => (
    <div>
      <SkeletonSettings />
      {message && <p className="sr-only">{message}</p>}
    </div>
  ),
  spinner: ({ message }) => (
    <div className="min-h-[200px] flex items-center justify-center">
      <AnchorLoadingSpinner size="md" message={message} />
    </div>
  ),
  minimal: ({ message }) => (
    <div className="min-h-[100px] flex items-center justify-center">
      <AnchorLoadingSpinner size="sm" message={message} />
    </div>
  ),
};

/**
 * LoadingBoundary wraps components with Suspense and skeleton fallbacks
 * 
 * @example
 * // With preset skeleton
 * <LoadingBoundary skeleton="dashboard">
 *   <DashboardView />
 * </LoadingBoundary>
 * 
 * @example
 * // With custom fallback
 * <LoadingBoundary fallback={<CustomLoader />}>
 *   <MyComponent />
 * </LoadingBoundary>
 */
export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  children,
  skeleton = 'spinner',
  fallback,
  message,
}) => {
  const SkeletonComponent = skeletonComponents[skeleton];
  const loadingFallback = fallback || <SkeletonComponent message={message} />;

  return (
    <Suspense fallback={loadingFallback}>
      {children}
    </Suspense>
  );
};

/**
 * Inline loading state for smaller sections
 * Uses minimal skeleton with optional message
 */
export const InlineLoading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div 
    className="flex items-center justify-center gap-2 py-4 text-slate-500 dark:text-slate-400 animate-in fade-in duration-300"
    role="status"
    aria-label={message}
  >
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <span className="text-sm">{message}</span>
  </div>
);

/**
 * Full page loading state
 * Centers loading indicator in viewport
 */
export const PageLoading: React.FC<{ message?: string }> = ({ message }) => (
  <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <AnchorLoadingSpinner size="lg" message={message} />
  </div>
);
