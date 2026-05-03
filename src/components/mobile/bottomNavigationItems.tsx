import React from 'react';
import {
  AnimatedAnchorAIIcon,
  AnimatedFinanceIcon,
  AnimatedHomeIcon,
  AnimatedTasksIcon,
} from './AnimatedNavIcons';

export interface BottomNavItem {
  to: string;
  label: string;
  /**
   * Kept for backward compatibility with existing tests / callers. Always
   * `false` in the iOS 26 design — every tab carries a label.
   */
  isIconOnly: boolean;
  renderIcon: (isAnimating: boolean, className: string) => React.ReactNode;
}

interface BuildBottomNavItemsInput {
  accountColors: string[];
  anchorAIEnabled: boolean;
  isDarkMode?: boolean;
}

export function buildBottomNavItems({
  accountColors,
  anchorAIEnabled,
}: BuildBottomNavItemsInput): BottomNavItem[] {
  const items: BottomNavItem[] = [
    {
      to: '/dashboard',
      label: 'Home',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedHomeIcon className={className} accountColors={accountColors} isAnimating={isAnimating} />
      ),
    },
    {
      to: '/commitments',
      label: 'Tasks',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedTasksIcon className={className} isAnimating={isAnimating} />
      ),
    },
  ];

  if (anchorAIEnabled) {
    items.push({
      to: '/fabric',
      label: 'Anchor',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedAnchorAIIcon
          className={className}
          isAnimating={isAnimating}
          isBreathing={true}
          isDisabled={false}
        />
      ),
    });
  }

  items.push({
    to: '/finance',
    label: 'Finance',
    isIconOnly: false,
    renderIcon: (isAnimating, className) => (
      <AnimatedFinanceIcon className={className} isAnimating={isAnimating} />
    ),
  });

  return items;
}
