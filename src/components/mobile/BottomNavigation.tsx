/**
 * BottomNavigation — iOS 26 floating glass tab bar.
 *
 * Design intent (matches Bitwarden / Tiimo / Bevel iOS 26 patterns):
 *   - Pill floats above content. Content scrolls visibly *through* the
 *     glass — no solid strip painting, no safe-area blocker box.
 *   - Active tab gets a soft NEUTRAL pill highlight (not branded blue).
 *   - Glass = translucent + heavy blur + saturation + 1px hairline border.
 *     No drop shadow stack, no top-edge gloss.
 *   - Pill sits low — its body absorbs the home-indicator clearance so
 *     there is no visible gap of body background beneath it.
 *   - Anchor AI is just another tab inside the pill. Never a FAB.
 */
// @ts-nocheck

import { useState, useCallback, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHaptic } from '../../hooks/useHaptic';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChanges';
import {
  navAnimationStyles, getAnimationClass, getRandomColor, CELEBRATION_COLORS,
} from './NavIconAnimations';
import { buildBottomNavItems } from './bottomNavigationItems';

interface BottomNavigationProps {
  accountColors?: string[];
  anchorAIEnabled?: boolean;
}

export const BottomNavigation = ({
  accountColors = [],
  anchorAIEnabled = false,
}: BottomNavigationProps) => {
  const [animatingRoute, setAnimatingRoute] = useState<string | null>(null);
  const [celebrationColor, setCelebrationColor] = useState(CELEBRATION_COLORS[0]);
  const { trigger } = useHaptic();
  const { isDirty, confirmDiscard } = useUnsavedChangesGuard();

  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const target = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDarkMode(target.classList.contains('dark'));
    });
    observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const styleId = 'nav-animation-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = navAnimationStyles;
      document.head.appendChild(style);
    }
  }, []);

  const handleTap = useCallback((route: string, e: React.MouseEvent) => {
    if (isDirty && !confirmDiscard()) {
      e.preventDefault();
      return;
    }
    trigger('light');
    if (route === '/commitments') {
      setCelebrationColor(getRandomColor());
    }
    setAnimatingRoute(route);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimatingRoute(null));
    });
  }, [trigger, isDirty, confirmDiscard]);

  const navItems = useMemo(() => buildBottomNavItems({
    accountColors,
    anchorAIEnabled,
    isDarkMode,
  }), [accountColors, anchorAIEnabled, isDarkMode]);

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      data-bottom-nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none flex justify-center"
      style={{
        /* Full safe-area clearance on the wrapper so the pill never
           overlaps the home indicator — avoids iOS pushing the view up
           and creating the visible blank strip below the bar. */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        data-bottom-nav-items
        className={[
          'pointer-events-auto',
          /* Float with a small gap above the home-indicator zone. */
          'mx-3 mb-2 w-[calc(100%-1.5rem)] max-w-md',
          /* Glass material — translucent, blurred, hairline border. */
          'rounded-full',
          'bg-white/55 dark:bg-slate-900/45',
          'backdrop-blur-2xl backdrop-saturate-[1.8]',
          'border border-white/50 dark:border-white/10',
          /* One soft shadow only — no stacked layers, no gloss. */
          'shadow-[0_6px_24px_-8px_rgba(2,6,23,0.18)]',
        ].join(' ')}
      >
        <ul className="flex items-stretch h-14 list-none m-0 p-1">
          {navItems.map(({ to, label, renderIcon }) => (
            <li key={to} className="flex-1 flex">
              <NavLink
                to={to}
                aria-label={label}
                onClick={(e) => handleTap(to, e)}
                className="relative flex-1 flex flex-col items-center justify-center gap-0.5 rounded-full transition-colors duration-150"
              >
                {({ isActive }) => {
                  const isAnimating = animatingRoute === to;
                  const animClass = isAnimating ? getAnimationClass(to) : '';
                  const isCelebrate = isAnimating && to === '/commitments';
                  const colorClass = isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400';
                  const iconClass = `w-[22px] h-[22px] transition-transform ${animClass} ${
                    isCelebrate ? `${celebrationColor.light} ${celebrationColor.dark}` : ''
                  }`;

                  return (
                    <>
                      {/* Soft neutral pill behind the active tab. */}
                      {isActive && (
                        <motion.span
                          layoutId="bottom-nav-active-pill"
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-slate-900/[0.06] dark:bg-white/[0.10]"
                          transition={{ type: 'spring', stiffness: 460, damping: 36, mass: 0.7 }}
                        />
                      )}
                      <span className={`relative z-10 flex flex-col items-center gap-0.5 ${colorClass}`}>
                        {renderIcon(isAnimating, iconClass)}
                        <span className="text-[10px] font-medium leading-none tracking-tight">
                          {label}
                        </span>
                      </span>
                    </>
                  );
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export const BottomNav = BottomNavigation;
export default BottomNavigation;
