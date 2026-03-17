import React from 'react';
import {
  AnimatedAnchorAIIcon,
  AnimatedFinanceIcon,
  AnimatedHomeIcon,
  AnimatedSettingsIcon,
  AnimatedTasksIcon,
} from './AnimatedNavIcons';

export interface BottomNavItem {
  to: string;
  label: string;
  isIconOnly: boolean;
  renderIcon: (isAnimating: boolean, className: string) => React.ReactNode;
}

interface BuildBottomNavItemsInput {
  accountColors: string[];
  anchorAIEnabled: boolean;
  isDarkMode: boolean;
}

export function buildBottomNavItems({
  accountColors,
  anchorAIEnabled,
  isDarkMode,
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
      label: 'Anchor AI',
      isIconOnly: true,
      renderIcon: (isAnimating, className) => (
        <AnimatedAnchorAIIcon
          className={`${className} w-6 h-6`}
          isAnimating={isAnimating}
          isBreathing={true}
          isDisabled={false}
        />
      ),
    });
  }

  items.push(
    {
      to: '/finance',
      label: 'Finance',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedFinanceIcon className={className} isAnimating={isAnimating} />
      ),
    },
    {
      to: '/settings',
      label: 'Settings',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedSettingsIcon className={className} isAnimating={isAnimating} isDarkMode={isDarkMode} />
      ),
    },
  );

  return items;
}
