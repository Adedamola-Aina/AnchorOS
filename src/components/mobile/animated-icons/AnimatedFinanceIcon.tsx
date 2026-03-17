import React from 'react';

interface AnimatedFinanceIconProps {
  className?: string;
  isAnimating?: boolean;
}

const FINANCE_COLOR = '#10b981';

export const AnimatedFinanceIcon: React.FC<AnimatedFinanceIconProps> = ({
  className = '',
  isAnimating = false,
}) => {
  if (!isAnimating) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    );
  }

  return (
    <svg className={`${className} drop-shadow-md`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" fill={FINANCE_COLOR} fillOpacity="0.2" stroke={FINANCE_COLOR} />
      <line x1="2" x2="22" y1="10" y2="10" stroke={FINANCE_COLOR} />
    </svg>
  );
};
