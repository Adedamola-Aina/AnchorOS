import React from 'react';

interface SkeletonProps {
  className?: string;
  /** Width of skeleton. Use Tailwind classes like 'w-24' or CSS values */
  width?: string;
  /** Height of skeleton. Use Tailwind classes like 'h-4' or CSS values */
  height?: string;
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'text',
}) => {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-700';
  
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width?.startsWith('w-') ? undefined : width,
    height: height?.startsWith('h-') ? undefined : height,
  };

  const widthClass = width?.startsWith('w-') ? width : '';
  const heightClass = height?.startsWith('h-') ? height : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${heightClass} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 ${className}`}>
    <Skeleton variant="text" className="w-24 h-4 mb-3" />
    <Skeleton variant="text" className="w-full h-8 mb-2" />
    <Skeleton variant="text" className="w-3/4 h-3" />
  </div>
);

export const SkeletonListItem: React.FC<{ className?: string; hasAvatar?: boolean }> = ({ 
  className = '',
  hasAvatar = false 
}) => (
  <div className={`flex items-center gap-3 p-3 ${className}`}>
    {hasAvatar && <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />}
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" className="w-3/4 h-4" />
      <Skeleton variant="text" className="w-1/2 h-3" />
    </div>
  </div>
);

export {
  SkeletonDashboard,
  SkeletonFinance,
  SkeletonCommitments,
  SkeletonSettings,
} from './SkeletonPages';
