/**
 * AnimatedTabs - Tab navigation with sliding indicator
 * 
 * Smooth tab transitions with animated indicator.
 * 
 * Usage:
 *   <AnimatedTabs
 *     tabs={['Overview', 'Transactions', 'Settings']}
 *     activeTab={activeTab}
 *     onTabChange={setActiveTab}
 *   />
 */

import React, { useRef, useState, useEffect, useId } from 'react';
import { motion } from 'framer-motion';
import { springSnappy } from '../transitions';
import { useReducedMotion } from '../hooks';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

interface AnimatedTabsProps {
    /** Tab definitions */
    tabs: Tab[];
    /** Active tab ID */
    activeTab: string;
    /** Tab change handler */
    onTabChange: (tabId: string) => void;
    /** Additional className */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Full width tabs */
    fullWidth?: boolean;
}

const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
};

export function AnimatedTabs({
    tabs,
    activeTab,
    onTabChange,
    className = '',
    size = 'md',
    fullWidth = false,
}: AnimatedTabsProps) {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const layoutId = useId();

    // Update indicator position when active tab changes
    useEffect(() => {
        if (!containerRef.current) return;

        const activeElement = containerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
        if (activeElement) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const activeRect = activeElement.getBoundingClientRect();

            setIndicatorStyle({
                left: activeRect.left - containerRect.left,
                width: activeRect.width,
            });
        }
    }, [activeTab]);

    return (
        <div
            ref={containerRef}
            className={`relative flex ${fullWidth ? 'w-full' : ''} bg-surface-3 dark:bg-surface-3-dark rounded-xl p-1 ${className}`}
            role="tablist"
        >
            {/* Animated indicator */}
            <motion.div
                layoutId={prefersReducedMotion ? undefined : `${layoutId}-indicator`}
                className="absolute inset-y-1 bg-surface-2 dark:bg-surface-2-dark rounded-lg shadow-sm"
                style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
            />

            {/* Tab buttons */}
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;

                return (
                    <button
                        key={tab.id}
                        data-tab-id={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        aria-disabled={tab.disabled}
                        onClick={() => !tab.disabled && onTabChange(tab.id)}
                        disabled={tab.disabled}
                        className={`
              relative z-10 flex items-center justify-center gap-2
              ${sizeClasses[size]}
              ${fullWidth ? 'flex-1' : ''}
              font-medium transition-colors duration-200
              ${isActive
                                ? 'text-foreground dark:text-foreground-dark'
                                : 'text-muted hover:text-foreground dark:hover:text-foreground-dark'}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

// ============================================================
// ANIMATED TAB CONTENT
// ============================================================

interface AnimatedTabContentProps {
    children: React.ReactNode;
    /** Active tab ID */
    activeTab: string;
    /** Additional className */
    className?: string;
}

/** Container for tab content with crossfade */
export function AnimatedTabContent({
    children,
    activeTab,
    className = '',
}: AnimatedTabContentProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            key={activeTab}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={springSnappy}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default AnimatedTabs;
