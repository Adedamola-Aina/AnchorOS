/**
 * BottomNavigation — iOS 26 "Liquid Glass" floating tab bar.
 *
 * Floats above content with horizontal margin and clears the home indicator
 * via safe-area insets. Anchor AI is integrated as the center tab (when
 * enabled) — never a separate floating button.
 *
 * Visual model:
 *   ┌──────────────── safe area / page edge ────────────────┐
 *   │                                                       │
 *   │      ╭──────────── floating pill ───────────╮         │
 *   │      │  Home   Tasks   AI   Finance  Settings│         │
 *   │      ╰────────────────────────────────────╯           │
 *   │                                                       │
 *   └────────── home indicator / safe inset bottom ─────────┘
 *
 * Active tab gets a sliding pill indicator (framer-motion `layoutId`).
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

  const { isDirty, confirmDiscard } = useUnsavedChangesGuard();

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

  const getIconColorClass = useCallback((route: string, isActive: boolean) => {
    if (animatingRoute === route && route === '/commitments') {
      return `${celebrationColor.light} ${celebrationColor.dark}`;
    }
    return isActive
      ? 'text-primary-600 dark:text-primary-300'
      : 'text-slate-500 dark:text-slate-400';
  }, [animatingRoute, celebrationColor]);

  const navItems = useMemo(() => buildBottomNavItems({
    accountColors,
    anchorAIEnabled,
    isDarkMode,
  }), [accountColors, anchorAIEnabled, isDarkMode]);

  const cols = anchorAIEnabled ? 'grid-cols-5' : 'grid-cols-4';

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      data-bottom-nav
      /* Outer wrapper: full-bleed, pointer-events disabled so taps fall
         through the gutters to content. The pill inside re-enables them.
         Anchored close to the screen bottom — the pill itself absorbs the
         home-indicator safe-area internally so no "strip" of body bg is
         visible beneath the pill. */
      className="md:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none"
      style={{
        paddingLeft: 'max(env(safe-area-inset-left), 12px)',
        paddingRight: 'max(env(safe-area-inset-right), 12px)',
        paddingBottom: '8px',
        paddingTop: '8px',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Floating pill — the liquid glass surface itself */}
      <div
        data-bottom-nav-items
        className={[
          'pointer-events-auto mx-auto max-w-md',
          'rounded-full relative overflow-hidden',
          /* Liquid glass material: translucent base + heavy blur + saturation */
          'bg-white/70 dark:bg-slate-900/65',
          'backdrop-blur-2xl backdrop-saturate-150',
          /* Hairline border gives the "lensed" edge */
          'border border-white/40 dark:border-white/10',
          /* Soft elevation — two-layer shadow for crispness */
          'shadow-[0_8px_30px_rgba(2,6,23,0.18),0_2px_6px_rgba(2,6,23,0.10)]',
          'transition-colors',
        ].join(' ')}
        style={{
          /* Reserve home-indicator clearance INSIDE the pill, so the pill
             itself extends down to where the strip used to be. */
          paddingBottom: 'max(calc(env(safe-area-inset-bottom) - 6px), 0px)',
        }}
      >
        {/* Top-edge gloss highlight (the "wet glass" sheen) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-full pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.06) 70%, rgba(255,255,255,0) 100%)',
          }}
        />

        <div className={`relative grid ${cols} h-14`}>
          {navItems.map(({ to, label, isIconOnly, renderIcon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              onClick={(e) => handleTap(to, e)}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center relative',
                  'transition-colors duration-150 h-full will-change-transform',
                  'gap-0.5',
                  isIconOnly ? '-mt-0.5' : '',
                  getIconColorClass(to, isActive),
                ].join(' ')
              }
            >
              {({ isActive }) => {
                const isAnimating = animatingRoute === to;
                const animClass = isAnimating ? getAnimationClass(to) : '';
                const iconClass = `${isIconOnly ? 'w-6 h-6' : 'w-[22px] h-[22px]'} transition-transform ${isActive ? 'scale-105' : ''} ${animClass}`;

                return (
                  <>
                    {/* Sliding pill indicator behind the active tab. */}
                    {isActive && (
                      <motion.span
                        layoutId="bottom-nav-active-pill"
                        className="absolute inset-1.5 rounded-full bg-primary-500/15 dark:bg-primary-400/20 ring-1 ring-inset ring-primary-500/10 dark:ring-primary-400/10"
                        transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center gap-0.5">
                      {renderIcon(isAnimating, iconClass)}
                      {isIconOnly ? (
                        <span className="sr-only">{label}</span>
                      ) : (
                        <span className="text-[10px] font-medium leading-none">{label}</span>
                      )}
                    </span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export const BottomNav = BottomNavigation;
export default BottomNavigation;
