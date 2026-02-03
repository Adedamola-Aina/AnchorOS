/**
 * Badge - Semantic status indicator primitive
 * 
 * Replaces inline badge styling with consistent semantic variants.
 * 
 * Usage:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="danger" size="sm">Error</Badge>
 *   <Badge variant="primary" dot>New</Badge>
 */
import React from 'react';

type BadgeVariant =
    | 'default'
    | 'primary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'finance'
    | 'task'
    | 'family';

type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean; // Shows a status dot before text
    pill?: boolean; // Fully rounded
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-surface-3 dark:bg-surface-3-dark text-muted dark:text-muted-dark',
    primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
    success: 'bg-success-bg dark:bg-success-bgDark text-success dark:text-success-dark',
    danger: 'bg-danger-bg dark:bg-danger-bgDark text-danger dark:text-danger-dark',
    warning: 'bg-warning-bg dark:bg-warning-bgDark text-warning dark:text-warning-dark',
    info: 'bg-info-bg dark:bg-info-bgDark text-info dark:text-info-dark',
    finance: 'bg-finance-100 dark:bg-finance-900 text-finance-700 dark:text-finance-300',
    task: 'bg-task-100 dark:bg-task-900 text-task-700 dark:text-task-300',
    family: 'bg-family-100 dark:bg-family-900 text-family-700 dark:text-family-300',
};

const dotVariantClasses: Record<BadgeVariant, string> = {
    default: 'bg-muted dark:bg-muted-dark',
    primary: 'bg-primary-500 dark:bg-primary-400',
    success: 'bg-success dark:bg-success-dark',
    danger: 'bg-danger dark:bg-danger-dark',
    warning: 'bg-warning dark:bg-warning-dark',
    info: 'bg-info dark:bg-info-dark',
    finance: 'bg-finance-500 dark:bg-finance-400',
    task: 'bg-task-500 dark:bg-task-400',
    family: 'bg-family-500 dark:bg-family-400',
};

const sizeClasses: Record<BadgeSize, string> = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
};

const dotSizeClasses: Record<BadgeSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'sm',
    dot = false,
    pill = true,
    className = '',
}) => {
    const classes = [
        'inline-flex items-center gap-1.5 font-medium',
        variantClasses[variant],
        sizeClasses[size],
        pill ? 'rounded-full' : 'rounded-md',
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {dot && (
                <span className={`${dotSizeClasses[size]} ${dotVariantClasses[variant]} rounded-full shrink-0`} />
            )}
            {children}
        </span>
    );
};

export default Badge;
