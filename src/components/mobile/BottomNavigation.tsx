/** Mobile bottom tab navigation with optional center Anchor AI icon. */
// @ts-nocheck

// 

// 

// 


import { useState, useCallback, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useHaptic } from '../../hooks/useHaptic';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChanges';
import { navAnimationStyles, getAnimationClass, getRandomColor, CELEBRATION_COLORS } from './NavIconAnimations';
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
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-400 dark:text-slate-500';
    }, [animatingRoute, celebrationColor]);

    const navItems = useMemo(() => buildBottomNavItems({
        accountColors,
        anchorAIEnabled,
        isDarkMode,
    }), [accountColors, anchorAIEnabled, isDarkMode]);

    return (
        <nav
            role="navigation"
            data-bottom-nav
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white/88 dark:bg-slate-900/82 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-700/80 z-40"
            aria-label="Mobile navigation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            <div data-bottom-nav-items className={`grid ${anchorAIEnabled ? 'grid-cols-5' : 'grid-cols-4'} h-[49px]`}>
                {navItems.map(({ to, label, isIconOnly, renderIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        aria-label={label}
                        onClick={(e) => handleTap(to, e)}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 relative transition-colors duration-100 h-full will-change-transform ${isIconOnly ? '-mt-1' : ''} ${getIconColorClass(to, isActive)}`
                        }
                    >
                        {({ isActive }) => {
                            const isAnimating = animatingRoute === to;
                            const animClass = isAnimating ? getAnimationClass(to) : '';
                            const iconClass = `w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''} ${animClass}`;

                            return (
                                <>
                                    {renderIcon(isAnimating, iconClass)}
                                    {isIconOnly ? (
                                        <span className="sr-only">{label}</span>
                                    ) : (
                                        <span className="text-[10px] font-medium">{label}</span>
                                    )}
                                </>
                            );
                        }}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
export const BottomNav = BottomNavigation;
export default BottomNavigation;
