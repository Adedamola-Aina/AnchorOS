/**
 * Surface - Semantic background container primitive
 * 
 * Replaces raw bg-* Tailwind classes with semantic surface levels.
 * Automatically handles light/dark mode backgrounds and borders.
 * 
 * Usage:
 *   <Surface>Page-level background</Surface>
 *   <Surface level={2}>Card container</Surface>
 *   <Surface level={3}>Input/modal background</Surface>
 *   <Surface variant="glass">Glassmorphism effect</Surface>
 */
import React from 'react';

type SurfaceLevel = 1 | 2 | 3 | 'hover';
type SurfaceVariant = 'solid' | 'glass' | 'gradient';

interface SurfaceProps {
    children: React.ReactNode;
    level?: SurfaceLevel;
    variant?: SurfaceVariant;
    as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer';
    className?: string;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    border?: boolean;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    interactive?: boolean; // Adds hover effects
}

const levelClasses: Record<SurfaceLevel, string> = {
    1: 'bg-surface-1 dark:bg-surface-1-dark',
    2: 'bg-surface-2 dark:bg-surface-2-dark',
    3: 'bg-surface-3 dark:bg-surface-3-dark',
    hover: 'bg-surface-hover dark:bg-surface-hover-dark',
};

const roundedClasses: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
};

const shadowClasses: Record<string, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
};

const paddingClasses: Record<string, string> = {
    none: '',
    xs: 'p-xs',
    sm: 'p-sm',
    md: 'p-md',
    lg: 'p-lg',
    xl: 'p-xl',
};

export const Surface: React.FC<SurfaceProps> = ({
    children,
    level = 2,
    variant = 'solid',
    as: Component = 'div',
    className = '',
    rounded = 'lg',
    border = false,
    shadow = 'none',
    padding = 'none',
    interactive = false,
}) => {
    const baseClasses = variant === 'glass'
        ? 'glass'
        : variant === 'gradient'
            ? 'premium-gradient'
            : levelClasses[level];

    const classes = [
        baseClasses,
        roundedClasses[rounded],
        shadowClasses[shadow],
        paddingClasses[padding],
        border && 'border border-[var(--border)] dark:border-[var(--border)]',
        interactive && 'hover:bg-surface-hover dark:hover:bg-surface-hover-dark transition-colors cursor-pointer',
        className,
    ].filter(Boolean).join(' ');

    return <Component className={classes}>{children}</Component>;
};

export default Surface;
