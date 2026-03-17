import React from 'react';

interface AnimatedTasksIconProps {
  className?: string;
  isAnimating?: boolean;
}

export const AnimatedTasksIcon: React.FC<AnimatedTasksIconProps> = ({
  className = '',
  isAnimating = false,
}) => {
  if (!isAnimating) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg className={`${className} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" opacity="0.2" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
};
