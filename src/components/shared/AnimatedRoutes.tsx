/**
 * AnimatedRoutes - Page transition wrapper for React Router
 * 
 * WEB-003: Wraps routes with AnimatePresence for smooth page transitions.
 * Uses location key for proper exit animations.
 * 
 * Usage:
 *   <AnimatedRoutes>
 *     <Route path="/dashboard" element={<DashboardView />} />
 *     <Route path="/settings" element={<SettingsView />} />
 *   </AnimatedRoutes>
 */

import React from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface AnimatedRoutesProps {
    children: React.ReactNode;
    /** Animation mode */
    mode?: 'wait' | 'sync' | 'popLayout';
}

/**
 * Wraps Routes with AnimatePresence for page transitions.
 * Must be used with AnimatedPage in each route's element.
 */
export function AnimatedRoutes({ children, mode = 'wait' }: AnimatedRoutesProps) {
    const location = useLocation();

    return (
        <AnimatePresence mode={mode} initial={false}>
            <Routes location={location} key={location.pathname}>
                {children}
            </Routes>
        </AnimatePresence>
    );
}

/**
 * Simple page wrapper with fade animation.
 * Use this to wrap page content for transitions.
 */
interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default AnimatedRoutes;
