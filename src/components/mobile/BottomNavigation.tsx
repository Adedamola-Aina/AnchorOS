/**
 * BottomNavigation - Mobile bottom tab navigation with micro-animations
 * 
 * Per MOBILE_OPTIMIZATION_DIRECTIVE.md Article M3.1
 * Per DESIGN_PHILOSOPHY.md: "Remain visually stable and emotionally calm"
 * 
 * Features subtle tap animations on each icon that bring delight without being intrusive.
 * Home icon shows account colors, Tasks icon has celebration animation.
 */
// @ts-nocheck


import { useState, useCallback, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useHaptic } from '../../hooks/useHaptic';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChanges';
import { navAnimationStyles, getRandomColor, CELEBRATION_COLORS } from './NavIconAnimations';
import { AnimatedHomeIcon, AnimatedTasksIcon, AnimatedFinanceIcon, AnimatedSettingsIcon } from './AnimatedNavIcons';

interface BottomNavigationProps {
    accountColors?: string[]; // Colors from user's accounts for Home animation
}

// Animation config per route
const ANIMATIONS = {
    '/dashboard': 'animate-[nav-pulse_200ms_ease-out]',
    '/commitments': 'animate-[nav-bounce_200ms_ease-out]',
    '/finance': 'animate-[nav-swipe_200ms_ease-out]',
    '/settings': 'animate-[nav-rotate_200ms_ease-out]',
} as const;

export const BottomNavigation = ({
    accountColors = []
}: BottomNavigationProps) => {
    const [animatingRoute, setAnimatingRoute] = useState<string | null>(null);
    const [celebrationColor, setCelebrationColor] = useState(CELEBRATION_COLORS[0]);
    const { trigger } = useHaptic();

    // PERF-004: Reactive dark mode detection via MutationObserver
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

    // Inject animation styles once
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
        // Block navigation if form has unsaved changes
        if (isDirty && !confirmDiscard()) {
            e.preventDefault();
            return;
        }
        trigger('light');
        if (route === '/commitments') {
            setCelebrationColor(getRandomColor());
        }
        setAnimatingRoute(route);
        setTimeout(() => setAnimatingRoute(null), 200);
    }, [trigger, isDirty, confirmDiscard]);

    // Get dynamic color class for icons during animation
    const getIconColorClass = useCallback((route: string, isActive: boolean) => {
        if (animatingRoute === route && route === '/commitments') {
            return `${celebrationColor.light} ${celebrationColor.dark}`;
        }
        return isActive
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-400 dark:text-slate-500';
    }, [animatingRoute, celebrationColor]);

    // Navigation items with custom icon renderers
    const navItems = useMemo(() => [
        {
            to: '/dashboard',
            label: 'Home',
            renderIcon: (isAnimating: boolean, className: string) => (
                <AnimatedHomeIcon
                    className={className}
                    accountColors={accountColors}
                    isAnimating={isAnimating}
                />
            )
        },
        {
            to: '/commitments',
            label: 'Tasks',
            renderIcon: (isAnimating: boolean, className: string) => (
                <AnimatedTasksIcon
                    className={className}
                    isAnimating={isAnimating}
                />
            )
        },
        {
            to: '/finance',
            label: 'Finance',
            renderIcon: (isAnimating: boolean, className: string) => (
                <AnimatedFinanceIcon
                    className={className}
                    isAnimating={isAnimating}
                />
            )
        },
        {
            to: '/settings',
            label: 'Settings',
            renderIcon: (isAnimating: boolean, className: string) => (
                <AnimatedSettingsIcon
                    className={className}
                    isAnimating={isAnimating}
                    isDarkMode={isDarkMode}
                />
            )
        },
    ], [accountColors, isDarkMode]);

    return (
        <nav
            role="navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe-nav z-40"
            aria-label="Mobile navigation"
        >
            <div className="grid grid-cols-4 h-16">
                {navItems.map(({ to, label, renderIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={(e) => handleTap(to, e)}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 relative transition-colors min-h-[44px] ${getIconColorClass(to, isActive)}`
                        }
                    >
                        {({ isActive }) => {
                            const isAnimating = animatingRoute === to;
                            const animClass = isAnimating ? ANIMATIONS[to as keyof typeof ANIMATIONS] || '' : '';
                            const iconClass = `w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''} ${animClass}`;

                            return (
                                <>
                                    {renderIcon(isAnimating, iconClass)}
                                    <span className="text-[10px] font-medium">{label}</span>
                                </>
                            );
                        }}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

// Backward compatibility exports
export const BottomNav = BottomNavigation;
export default BottomNavigation;
