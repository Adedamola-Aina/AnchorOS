/**
 * BottomNavigation - Mobile bottom tab navigation with micro-animations
 * 
 * Per MOBILE_OPTIMIZATION_DIRECTIVE.md Article M3.1
 * Per DESIGN_PHILOSOPHY.md: "Remain visually stable and emotionally calm"
 * 
 * Features subtle tap animations on each icon that bring delight without being intrusive.
 */

import { useState, useCallback, useEffect } from 'react';
import { LayoutDashboard, CheckCircle2, CreditCard, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useHaptic } from '../../hooks/useHaptic';
import { navAnimationStyles, getRandomColor, CELEBRATION_COLORS } from './NavIconAnimations';

interface BottomNavigationProps {
    accountNotifications: string[];
}

// Static nav items
const NAV_ITEMS = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/commitments', icon: CheckCircle2, label: 'Tasks' },
    { to: '/finance', icon: CreditCard, label: 'Finance' },
    { to: '/settings', icon: Settings, label: 'Settings' },
] as const;

// Animation config per route
const ANIMATIONS = {
    '/dashboard': 'animate-[nav-pulse_200ms_ease-out]',
    '/commitments': 'animate-[nav-bounce_200ms_ease-out]',
    '/finance': 'animate-[nav-swipe_200ms_ease-out]',
    '/settings': 'animate-[nav-rotate_200ms_ease-out]',
} as const;

export const BottomNavigation = ({
    accountNotifications
}: BottomNavigationProps) => {
    const [animatingRoute, setAnimatingRoute] = useState<string | null>(null);
    const [celebrationColor, setCelebrationColor] = useState(CELEBRATION_COLORS[0]);
    const { trigger } = useHaptic();
    const hasSettingsNotification = accountNotifications.length > 0;

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
        // Trigger haptic feedback
        trigger('light');

        // Set random color for Tasks icon
        if (route === '/commitments') {
            setCelebrationColor(getRandomColor());
        }

        // Start animation
        setAnimatingRoute(route);

        // Clear animation after duration
        setTimeout(() => setAnimatingRoute(null), 200);
    }, [trigger]);

    // Get dynamic color class for Tasks icon during animation
    const getIconColorClass = (route: string, isActive: boolean) => {
        if (animatingRoute === route && route === '/commitments') {
            return `${celebrationColor.light} ${celebrationColor.dark}`;
        }
        return isActive
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-400 dark:text-slate-500';
    };

    return (
        <nav
            role="navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe z-40"
            aria-label="Mobile navigation"
        >
            <div className="grid grid-cols-4 h-16">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={() => handleTap(to)}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 relative transition-colors min-h-[44px] ${getIconColorClass(to, isActive)}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''
                                        } ${animatingRoute === to
                                            ? ANIMATIONS[to as keyof typeof ANIMATIONS] || ''
                                            : ''
                                        }`}
                                />
                                <span className="text-[10px] font-medium">{label}</span>
                                {to === '/settings' && hasSettingsNotification && (
                                    <span
                                        className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                        role="status"
                                        aria-label="Notification indicator"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

// Backward compatibility exports
export const BottomNav = BottomNavigation;
export default BottomNavigation;
