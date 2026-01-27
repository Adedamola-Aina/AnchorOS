/**
 * BottomNavigation - Mobile bottom tab navigation
 * 
 * Per MOBILE_OPTIMIZATION_DIRECTIVE.md Article M3.1
 * Replaces hamburger drawer for primary navigation on mobile devices.
 * Fixed to bottom with safe area padding for notched devices.
 */

import { LayoutDashboard, CheckCircle2, CreditCard, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface BottomNavigationProps {
    accountNotifications: string[];
}

// Static nav items moved outside component for performance (Virtual Board 8.3)
const NAV_ITEMS = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/commitments', icon: CheckCircle2, label: 'Tasks' },
    { to: '/finance', icon: CreditCard, label: 'Finance' },
    { to: '/settings', icon: Settings, label: 'Settings' },
] as const;

export const BottomNavigation = ({ accountNotifications }: BottomNavigationProps) => {
    const hasSettingsNotification = accountNotifications.length > 0;

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
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 relative transition-all min-h-[44px] ${isActive
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-slate-400 dark:text-slate-500'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
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

// Also export as BottomNav for backward compatibility
export const BottomNav = BottomNavigation;
export default BottomNavigation;

