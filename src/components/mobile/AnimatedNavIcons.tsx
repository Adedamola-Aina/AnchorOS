/**
 * AnimatedNavIcons - Custom animated icons for bottom navigation
 * 
 * Per DESIGN_PHILOSOPHY.md: "Remain visually stable and emotionally calm"
 * These icons provide personalized, delightful animations that reflect user data.
 */

import React, { useMemo } from 'react';

interface AnimatedHomeIconProps {
    className?: string;
    accountColors?: string[]; // Hex colors from user's accounts
    isAnimating?: boolean;
}

/**
 * AnimatedHomeIcon - Dashboard grid icon that shows account colors
 * When animating, each square briefly flashes with a user's account color.
 * Falls back to default colors if no accounts.
 */
export const AnimatedHomeIcon: React.FC<AnimatedHomeIconProps> = ({
    className = '',
    accountColors = [],
    isAnimating = false,
}) => {
    // Default colors if user has no accounts (matching ACCOUNT_COLORS from seederData)
    const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

    // Pick first 4 colors from accounts (or defaults) - stable selection for React purity
    const gridColors = useMemo(() => {
        const source = accountColors.length > 0 ? accountColors : DEFAULT_COLORS;
        // Take first 4, or cycle if less than 4
        return [0, 1, 2, 3].map(i => source[i % source.length]);
    }, [accountColors]);

    // When not animating, show currentColor (inherits from parent)
    if (!isAnimating) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        );
    }

    // When animating, fill squares with account colors
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" fill={gridColors[0]} stroke={gridColors[0]} />
            <rect x="14" y="3" width="7" height="7" rx="1" fill={gridColors[1]} stroke={gridColors[1]} />
            <rect x="3" y="14" width="7" height="7" rx="1" fill={gridColors[2]} stroke={gridColors[2]} />
            <rect x="14" y="14" width="7" height="7" rx="1" fill={gridColors[3]} stroke={gridColors[3]} />
        </svg>
    );
};

interface AnimatedTasksIconProps {
    className?: string;
    isAnimating?: boolean;
}

/**
 * AnimatedTasksIcon - Checkmark circle icon with celebration animation
 * When animating, shows a filled checkmark with glow effect.
 */
export const AnimatedTasksIcon: React.FC<AnimatedTasksIconProps> = ({
    className = '',
    isAnimating = false,
}) => {
    if (!isAnimating) {
        // Default CheckCircle2 from lucide
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        );
    }

    // When animating, show filled checkmark with glow
    return (
        <svg className={`${className} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" opacity="0.2" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" />
            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="3" />
        </svg>
    );
};
