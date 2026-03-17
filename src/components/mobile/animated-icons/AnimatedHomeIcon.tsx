import React, { useMemo } from 'react';

interface AnimatedHomeIconProps {
  className?: string;
  accountColors?: string[];
  isAnimating?: boolean;
}

export const AnimatedHomeIcon: React.FC<AnimatedHomeIconProps> = ({
  className = '',
  accountColors = [],
  isAnimating = false,
}) => {
  const gridColors = useMemo(() => {
    const defaultColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
    const source = accountColors.length > 0 ? accountColors : defaultColors;
    return [0, 1, 2, 3].map((i) => source[i % source.length]);
  }, [accountColors]);

  if (!isAnimating) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" fill={gridColors[0]} stroke={gridColors[0]} />
      <rect x="14" y="3" width="7" height="7" rx="1" fill={gridColors[1]} stroke={gridColors[1]} />
      <rect x="3" y="14" width="7" height="7" rx="1" fill={gridColors[2]} stroke={gridColors[2]} />
      <rect x="14" y="14" width="7" height="7" rx="1" fill={gridColors[3]} stroke={gridColors[3]} />
    </svg>
  );
};
