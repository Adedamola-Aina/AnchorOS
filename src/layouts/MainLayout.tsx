// @ts-nocheck
import React, { useMemo, useCallback } from 'react';
import { LayoutDashboard, CheckCircle2, CreditCard, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnchorLogo } from '../components/shared';
import { CommandPalette } from '../components/shared/CommandPalette';
import { useResponsive } from '../hooks/useResponsive';
import { useKeyboardAvoidance } from '../hooks/useKeyboardAvoidance';
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChanges';
import { BottomNavigation } from '../components/mobile/BottomNavigation';
import { ContextualFab } from '../components/mobile/ContextualFab';
import { useFab } from '../context/FabContext';
import { useActionBarHeight } from '../context/ActionBarContext';
import { shellBottomClearance, shellScrollPadding } from './shellClearance';
import { useNavScrollVisibility } from '../components/mobile/useNavScrollVisibility';
import { InstallPrompt } from '../components/pwa/InstallPrompt';
import { useFinanceService } from '../hooks/useFinanceService';
import { useFabric } from '../hooks/useFabric';

interface MainLayoutProps {
    children: React.ReactNode;
    version: string;
}

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ElementType;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon: Icon }) => {
    const { isDirty, confirmDiscard } = useUnsavedChangesGuard();
    const handleClick = useCallback((e: React.MouseEvent) => {
        if (isDirty && !confirmDiscard()) e.preventDefault();
    }, [isDirty, confirmDiscard]);

    return (
        <NavLink
            to={to}
            onClick={handleClick}
            className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg shadow-slate-200 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                    <span className="font-medium">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, version }) => {
    const { user, profile, logout } = useAuth();
    // UX-GL-05: the only nav state signal — one dot on Home while the
    // assistant has an unread proactive insight.
    const { proactiveQuestion } = useFabric();
    const { isMobile } = useResponsive();
    // UX-GL-04: hide the bar (and the FAB) while scrolling down.
    const navHidden = useNavScrollVisibility();
    /**
     * Does this page have a floating action? If it does, the shell reserves the
     * FAB's band as well as the navigation — the one place that knows about both.
     * Otherwise the final row of a list can end up underneath the button (the FAB
     * band reaches 121px up; only 73px was reserved).
     */
    const { action: fabAction } = useFab();
    /**
     * CM-28: the shell owns the bottom edge. `--shell-bottom-clearance` is the
     * navigation plus, when the page registered one, the contextual FAB's band.
     *
     * A form's own action bar does NOT need to be added here: `FormActionBar` is
     * sticky *inside* the scrolling content, so it is the last element in the flow
     * and everything before it already ends above it. Adding its height as well
     * double-counted and left ~70px of dead space under the bar at the end of the
     * scroll (measured). The clearance is deliberately the whole of this
     * reservation — see shellClearance.ts.
     */
    const bottomClearance = shellBottomClearance(!!fabAction);
    /**
     * …and the scrollport's own obscured region, which DOES include the action bar:
     * a field scrolled to (or focused) must stop above Save/Cancel, not under it.
     */
    const scrollPadding = shellScrollPadding(!!fabAction, useActionBarHeight());
    const { accounts } = useFinanceService(user);
    const accountColors = useMemo(() => accounts.map(a => a.color).filter(Boolean), [accounts]);

    useKeyboardAvoidance();

    return (
        <div className="adaptive-layout bg-[var(--surface-1)] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 h-full flex-1 w-full min-h-0">
            <CommandPalette />

            {/* Desktop sidebar — hidden on mobile */}
            <aside className={`hidden md:flex flex-col bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 sticky ${import.meta.env.VITE_APP_ENV && import.meta.env.VITE_APP_ENV !== 'production' ? 'top-6 h-[calc(100%-var(--env-banner-height,20px))]' : 'top-0 h-full'} min-h-0`}>
                <div className="mb-8 px-4 py-2 shrink-0">
                    <h1 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <AnchorLogo className="w-8 h-8 text-slate-900 dark:text-white" />
                        Anchor
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 tracking-widest uppercase">Anchor v{version}</p>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                    {/*
                      * UX-GL-03: one destination vocabulary everywhere — the
                      * sidebar, the mobile bar and the page titles all say
                      * Home / Commitments / Finance / Settings. The old
                      * "Dashboard", "System" and "Anchor AI" aliases are gone.
                      *
                      * UX-AI-09: Anchor AI is not a destination in either nav.
                      * It stays addressable at /fabric (deep links, the disabled
                      * state) and Home carries the doorway.
                      */}
                    <NavItem to="/dashboard" label="Home" icon={LayoutDashboard} />
                    <NavItem to="/commitments" label="Commitments" icon={CheckCircle2} />
                    <NavItem to="/finance" label="Finance" icon={CreditCard} />
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <NavItem to="/settings" label="Settings" icon={Settings} />
                    </div>
                </nav>

                <div className="p-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl mt-auto shrink-0">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                {(profile?.name || user?.email || 'U').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{profile?.name || 'User'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-500 truncate font-mono">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={() => logout()} className="text-slate-400 hover:text-rose-500 transition-colors p-1" title="Sign Out">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            <main
                data-scroll
                className="flex flex-col relative w-full flex-1 overflow-y-auto min-h-0"
                style={isMobile ? { paddingBottom: bottomClearance, scrollPaddingBottom: scrollPadding } : undefined}
            >
                {/* On mobile, pad bottom is now handled by parent main container */}
                <div
                    className="p-4 sm:p-6 md:p-8 lg:p-12 w-full max-w-screen-2xl mx-auto"
                    style={isMobile ? undefined : { paddingBottom: '2rem' }}
                >
                    {children}
                </div>
                <InstallPrompt />
            </main>

            {isMobile && <ContextualFab navHidden={navHidden} />}
            {isMobile && <BottomNavigation accountColors={accountColors} hasUnreadInsight={!!proactiveQuestion} hidden={navHidden} />}
        </div>
    );
};

export default MainLayout;
