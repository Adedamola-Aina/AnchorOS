import React from 'react';
import {
  AnimatedFinanceIcon,
  AnimatedHomeIcon,
  AnimatedSettingsIcon,
  AnimatedTasksIcon,
} from './AnimatedNavIcons';

interface BottomNavItem {
  to: string;
  label: string;
  /**
   * Kept for backward compatibility with existing tests / callers. Always
   * `false` in the iOS 26 design — every tab carries a label.
   */
  isIconOnly: boolean;
  /**
   * UX-GL-05: at most ONE low-noise state dot on the whole bar, and only on
   * Home. No numeric badges — the pill reports "there is something", never
   * "how many", because a count on a nav item is pressure, not information.
   */
  dot?: boolean;
  renderIcon: (isAnimating: boolean, className: string) => React.ReactNode;
}

interface BuildBottomNavItemsInput {
  accountColors: string[];
  isDarkMode?: boolean;
  /** True when the assistant has an unread proactive insight (UX-GL-05). */
  hasUnreadInsight?: boolean;
}

/**
 * The bar is exactly FOUR destinations, always (UX-AI-09).
 *
 * The labels are the single destination vocabulary (UX-GL-03): the mobile bar,
 * the desktop sidebar and the page titles use the same words — `Home`,
 * `Commitments`, `Finance`, `Settings`. The old `Tasks` / `System` / `Anchor`
 * aliases are retired.
 *
 * Anchor AI is deliberately NOT a tab: "Anchor belongs inside Home, not in the
 * bar" (doc 20 §4.1). The assistant stays addressable at `/fabric` for deep
 * links, and Home carries the doorway.
 */
export function buildBottomNavItems({
  accountColors,
  hasUnreadInsight = false,
}: BuildBottomNavItemsInput): BottomNavItem[] {
  return [
    {
      to: '/dashboard',
      label: 'Home',
      isIconOnly: false,
      dot: hasUnreadInsight,
      renderIcon: (isAnimating, className) => (
        <AnimatedHomeIcon className={className} accountColors={accountColors} isAnimating={isAnimating} />
      ),
    },
    {
      to: '/commitments',
      label: 'Commitments',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedTasksIcon className={className} isAnimating={isAnimating} />
      ),
    },
    {
      to: '/finance',
      label: 'Finance',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedFinanceIcon className={className} isAnimating={isAnimating} />
      ),
    },
    // Settings must stay reachable on mobile: it hosts sign-out, passkeys,
    // security and Family Mode management. Without this tab a phone user has
    // no path to any of them.
    {
      to: '/settings',
      label: 'Settings',
      isIconOnly: false,
      renderIcon: (isAnimating, className) => (
        <AnimatedSettingsIcon className={className} isAnimating={isAnimating} />
      ),
    },
  ];
}
