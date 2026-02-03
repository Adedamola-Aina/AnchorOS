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

interface AnimatedFinanceIconProps {
    className?: string;
    isAnimating?: boolean;
}

// Cash flow emerald green - represents financial health
const FINANCE_COLOR = '#10b981';

/**
 * AnimatedFinanceIcon - Credit card icon that flashes emerald on tap
 * Represents positive cash flow and financial health.
 */
export const AnimatedFinanceIcon: React.FC<AnimatedFinanceIconProps> = ({
    className = '',
    isAnimating = false,
}) => {
    if (!isAnimating) {
        // Default CreditCard from lucide
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
        );
    }

    // When animating, flash with emerald cash flow color
    return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" fill={FINANCE_COLOR} fillOpacity="0.2" stroke={FINANCE_COLOR} />
            <line x1="2" x2="22" y1="10" y2="10" stroke={FINANCE_COLOR} />
        </svg>
    );
};

interface AnimatedSettingsIconProps {
    className?: string;
    isAnimating?: boolean;
    isDarkMode?: boolean;
}

// Theme accent colors - blue for light mode, slate for dark mode
const SETTINGS_COLOR_LIGHT = '#6366f1'; // Indigo
const SETTINGS_COLOR_DARK = '#94a3b8';  // Slate-400

/**
 * AnimatedSettingsIcon - Gear icon that glows with theme accent color
 * Reflects the user's current theme preference.
 */
export const AnimatedSettingsIcon: React.FC<AnimatedSettingsIconProps> = ({
    className = '',
    isAnimating = false,
    isDarkMode = false,
}) => {
    const accentColor = isDarkMode ? SETTINGS_COLOR_DARK : SETTINGS_COLOR_LIGHT;

    if (!isAnimating) {
        // Default Settings gear from lucide
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        );
    }

    // When animating, glow with theme accent color
    return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke={accentColor} />
            <circle cx="12" cy="12" r="3" fill={accentColor} fillOpacity="0.3" stroke={accentColor} />
        </svg>
    );
};
