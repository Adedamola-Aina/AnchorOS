/**
 * BottomNavigation - Mobile bottom tab navigation with micro-animations
 * DES-002: Migrated to semantic tokens
 * 
 * Per MOBILE_OPTIMIZATION_DIRECTIVE.md Article M3.1
 * Per DESIGN_PHILOSOPHY.md: "Remain visually stable and emotionally calm"
 * 
 * Features subtle tap animations on each icon that bring delight without being intrusive.
 * Home icon shows account colors, Tasks icon has celebration animation.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useHaptic } from '../../hooks/useHaptic';
import { navAnimationStyles, getRandomColor, CELEBRATION_COLORS } from './NavIconAnimations';
import { AnimatedHomeIcon, AnimatedTasksIcon, AnimatedFinanceIcon, AnimatedSettingsIcon } from './AnimatedNavIcons';

interface BottomNavigationProps {
    accountNotifications: string[];
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
    accountNotifications,
    accountColors = []
}: BottomNavigationProps) => {
    const [animatingRoute, setAnimatingRoute] = useState<string | null>(null);
    const [celebrationColor, setCelebrationColor] = useState(CELEBRATION_COLORS[0]);
    const { trigger } = useHaptic();
    const hasSettingsNotification = accountNotifications.length > 0;

    // Detect dark mode for Settings icon accent color
    const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

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

    const handleTap = useCallback((route: string) => {
        trigger('light');
        if (route === '/commitments') {
            setCelebrationColor(getRandomColor());
        }
        setAnimatingRoute(route);
        setTimeout(() => setAnimatingRoute(null), 200);
    }, [trigger]);

    // Get dynamic color class for icons during animation
    const getIconColorClass = useCallback((route: string, isActive: boolean) => {
        if (animatingRoute === route && route === '/commitments') {
            return `${celebrationColor.light} ${celebrationColor.dark}`;
        }
        return isActive
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-muted';
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
            className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-1/95 dark:bg-surface-1-dark/95 backdrop-blur-xl border-t border-border-subtle pb-safe-nav z-40"
            aria-label="Mobile navigation"
        >
            <div className="grid grid-cols-4 h-16">
                {navItems.map(({ to, label, renderIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={() => handleTap(to)}
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
                                    {to === '/settings' && hasSettingsNotification && (
                                        <span
                                            className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                            role="status"
                                            aria-label="Notification indicator"
                                        />
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

// Backward compatibility exports
export const BottomNav = BottomNavigation;
export default BottomNavigation;
