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
    /*
     * Full-width bar whose background extends through the entire safe-area
     * zone — same as native iOS tab bars. paddingBottom on the nav element
     * pushes the icon content up while the bg-white/bg-slate covers the
     * home-indicator area, so there is zero visible blank strip below.
     */
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      data-bottom-nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-white/[0.06]"
      style={{
        height: 'calc(49px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <ul
        data-bottom-nav-items
        className="flex items-stretch h-[49px] list-none m-0 px-1"
      >
        {navItems.map(({ to, label, renderIcon }) => (
          <li key={to} className="flex-1 flex">
            <NavLink
              to={to}
              aria-label={label}
              onClick={(e) => handleTap(to, e)}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150"
            >
              {({ isActive }) => {
                const isAnimating = animatingRoute === to;
                const animClass = isAnimating ? getAnimationClass(to) : '';
                const isCelebrate = isAnimating && to === '/commitments';
                const colorClass = isActive
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 dark:text-slate-500';
                const iconClass = `w-[22px] h-[22px] transition-transform ${animClass} ${
                  isCelebrate ? `${celebrationColor.light} ${celebrationColor.dark}` : ''
                }`;

                return (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="bottom-nav-active-pill"
                        aria-hidden
                        className="absolute inset-x-1 top-0.5 bottom-0.5 rounded-xl bg-slate-900/[0.06] dark:bg-white/[0.10]"
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
    </nav>
  );
};

export const BottomNav = BottomNavigation;
export default BottomNavigation;
