import React, { useState } from 'react';
import { LayoutDashboard, CheckCircle2, CreditCard, Settings, X, LogOut, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnchorLogo } from '../components/shared';
import { CommandPalette } from '../components/shared/CommandPalette';
import { useResponsive } from '../hooks/useResponsive';
import { useKeyboardAvoidance } from '../hooks/useKeyboardAvoidance';
import { BottomNavigation } from '../components/mobile/BottomNavigation';
import { InstallPrompt } from '../components/pwa/InstallPrompt';

interface MainLayoutProps {
    children: React.ReactNode;
    version: string;
}

// NavItem component moved outside to avoid recreation on every render
interface NavItemProps {
    to: string;
    label: string;
    icon: React.ElementType;
    accountNotifications: string[];
    setMobileMenuOpen: (open: boolean) => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon: Icon, accountNotifications, setMobileMenuOpen }) => {
    const hasAudit = to === '/settings' && accountNotifications.length > 0;

    return (
        <NavLink
            to={to}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
                `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg shadow-slate-200 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`
            }
        >
            {({ isActive }) => (
                <>
                    <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                        <span className="font-medium">{label}</span>
                    </div>
                    {hasAudit && (
                        <span className="text-red-500 text-lg font-black leading-none animate-pulse">*</span>
                    )}
                </>
            )}
        </NavLink>
    );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, version }) => {
    const { user, profile, logout, accountNotifications } = useAuth();
    const { isMobile } = useResponsive(); // ← Per M3.2
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // BUG-002 Fix: Handle iOS keyboard covering inputs
    // Hook auto-scrolls focused inputs into view when keyboard appears
    useKeyboardAvoidance();

    return (
        <div className={`adaptive-layout bg-[var(--surface-1)] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 ${import.meta.env.VITE_APP_ENV && import.meta.env.VITE_APP_ENV !== 'production' ? 'pt-6 min-h-[calc(100vh-24px)]' : 'min-h-screen'}`}>
            <CommandPalette />

            {/* Desktop Sidebar - UNCHANGED per M3.2 */}
            <aside className={`hidden md:flex flex-col bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 sticky ${import.meta.env.VITE_APP_ENV && import.meta.env.VITE_APP_ENV !== 'production' ? 'top-6 h-[calc(100vh-24px)]' : 'top-0 h-screen'}`}>
                <div className="mb-8 px-4 py-2 shrink-0">
                    <h1 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <AnchorLogo className="w-8 h-8 text-slate-900 dark:text-white" />
                        Anchor
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 tracking-widest uppercase">Anchor v{version}</p>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                    <NavItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} accountNotifications={accountNotifications} setMobileMenuOpen={setMobileMenuOpen} />
                    <NavItem to="/commitments" label="Commitments" icon={CheckCircle2} accountNotifications={accountNotifications} setMobileMenuOpen={setMobileMenuOpen} />
                    <NavItem to="/finance" label="Finance" icon={CreditCard} accountNotifications={accountNotifications} setMobileMenuOpen={setMobileMenuOpen} />
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <NavItem to="/settings" label="System" icon={Settings} accountNotifications={accountNotifications} setMobileMenuOpen={setMobileMenuOpen} />
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

            <main className="flex flex-col relative w-full">
                {/* Mobile Header - SIMPLIFIED per M3.2 */}
                <header className="md:hidden sticky top-0 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30">
                    <div className="flex items-center gap-2">
                        <AnchorLogo className="w-6 h-6 text-slate-900 dark:text-white" />
                        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Anchor</span>
                    </div>
                    {/* Optional: Keep hamburger for settings/profile */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Open menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </header>

                {/* Mobile Navigation Drawer (for user profile & logout) */}
                <div className={`fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
                    <div className={`absolute top-0 right-0 h-full w-72 bg-white dark:bg-slate-900 p-6 pt-20 shadow-2xl transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
                        {/* User Profile Section */}
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300">
                                    {(profile?.name || user?.email || 'U').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{profile?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Quick Actions</p>
                        <NavLink
                            to="/settings"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                            {accountNotifications.length > 0 && (
                                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </NavLink>

                        <button onClick={() => logout()} className="mt-4 flex items-center gap-3 text-rose-600 font-bold px-4 py-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors w-full">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>

                        <p className="text-[10px] text-slate-400 text-center mt-8">Anchor v{version}</p>
                    </div>
                </div>

                {/* Main Content - ADJUST padding for bottom nav per M3.2 */}
                <div className={`flex-1 p-4 sm:p-6 md:p-8 lg:p-12 w-full max-w-screen-2xl mx-auto ${isMobile ? 'pb-20' : 'pb-8'  // Extra padding on mobile for bottom nav
                    }`}>
                    {children}
                </div>

                {/* Bottom Navigation - NEW, mobile only per M3.2 */}
                {isMobile && <BottomNavigation accountNotifications={accountNotifications} />}

                {/* PWA Install Prompt */}
                <InstallPrompt />
            </main>
        </div>
    );
};

export default MainLayout;


