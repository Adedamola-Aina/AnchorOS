/** Mobile bottom tab navigation with optional center Anchor AI icon. */
// @ts-nocheck


import { useState, useCallback, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useHaptic } from '../../hooks/useHaptic';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChanges';
import { navAnimationStyles, getRandomColor, CELEBRATION_COLORS } from './NavIconAnimations';
import { AnimatedHomeIcon, AnimatedTasksIcon, AnimatedFinanceIcon, AnimatedSettingsIcon, AnimatedAnchorAIIcon } from './AnimatedNavIcons';

interface BottomNavigationProps {
    accountColors?: string[];
    anchorAIEnabled?: boolean;
}

const ANIMATIONS = {
    '/dashboard': 'animate-[nav-pulse_200ms_ease-out]',
    '/commitments': 'animate-[nav-bounce_200ms_ease-out]',
    '/fabric': 'animate-[fabric-breathe_3s_ease-in-out_infinite]',
    '/finance': 'animate-[nav-swipe_200ms_ease-out]',
    '/settings': 'animate-[nav-rotate_200ms_ease-out]',
} as const;

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

    const navItems = useMemo(() => {
        const items = [
            {
                to: '/dashboard',
                label: 'Home',
                isIconOnly: false,
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
                isIconOnly: false,
                renderIcon: (isAnimating: boolean, className: string) => (
                    <AnimatedTasksIcon
                        className={className}
                        isAnimating={isAnimating}
                    />
                )
            },
        ];

        if (anchorAIEnabled) {
            items.push({
                to: '/fabric',
                label: 'Anchor AI',
                isIconOnly: true,
                renderIcon: (isAnimating: boolean, className: string) => (
                    <AnimatedAnchorAIIcon
                        className={`${className} w-6 h-6`}
                        isAnimating={isAnimating}
                        isBreathing={true}
                        isDisabled={false}
                    />
                )
            });
        }

        items.push(
            {
                to: '/finance',
                label: 'Finance',
                isIconOnly: false,
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
                isIconOnly: false,
                renderIcon: (isAnimating: boolean, className: string) => (
                    <AnimatedSettingsIcon
                        className={className}
                        isAnimating={isAnimating}
                        isDarkMode={isDarkMode}
                    />
                )
            }
        );

        return items;
    }, [accountColors, anchorAIEnabled, isDarkMode]);

    return (
        <nav
            role="navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40"
            aria-label="Mobile navigation"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)', WebkitTapHighlightColor: 'transparent' }}
        >
            <div className={`grid ${anchorAIEnabled ? 'grid-cols-5' : 'grid-cols-4'} h-16`}>
                {navItems.map(({ to, label, isIconOnly, renderIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        aria-label={label}
                        onClick={(e) => handleTap(to, e)}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 relative transition-colors duration-100 h-full min-h-[56px] will-change-transform ${isIconOnly ? '-mt-1' : ''} ${getIconColorClass(to, isActive)}`
                        }
                    >
                        {({ isActive }) => {
                            const isAnimating = animatingRoute === to;
                            const animClass = isAnimating ? ANIMATIONS[to as keyof typeof ANIMATIONS] || '' : '';
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
