import React from 'react';

interface AnimatedAnchorAIIconProps {
  className?: string;
  isAnimating?: boolean;
  isBreathing?: boolean;
  isDisabled?: boolean;
}

export const AnimatedAnchorAIIcon: React.FC<AnimatedAnchorAIIconProps> = ({
  className = '',
  isAnimating = false,
  isBreathing = false,
  isDisabled = false,
}) => {
  const iconClass = `${className} ${isBreathing ? 'animate-[fabric-breathe_3s_ease-in-out_infinite]' : ''}`;
  const color = isDisabled ? 'currentColor' : (isAnimating ? '#14b8a6' : 'currentColor');

  return (
    <svg className={iconClass} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="22" r="10" />
      <line x1="50" y1="32" x2="50" y2="85" />
      <path d="M20 58 C20 85 80 85 80 58" fill="none" />
      <line x1="20" y1="58" x2="20" y2="48" />
      <line x1="80" y1="58" x2="80" y2="48" />
    </svg>
  );
};
