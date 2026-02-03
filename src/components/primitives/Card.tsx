/**
 * Card - Semantic container primitive
 * 
 * Combines Surface with standard card styling patterns.
 * 
 * Usage:
 *   <Card>Simple card</Card>
 *   <Card header="Title">Card with header</Card>
 *   <Card interactive>Clickable card</Card>
 */
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    variant?: 'default' | 'glass' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
    className?: string;
    onClick?: () => void;
}

const variantClasses: Record<string, string> = {
    default: 'bg-surface-2 dark:bg-surface-2-dark',
    glass: 'glass-card',
    outlined: 'bg-transparent border border-[var(--border)]',
    elevated: 'bg-surface-2 dark:bg-surface-2-dark shadow-lg',
};

const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
    children,
    header,
    footer,
    variant = 'default',
    padding = 'md',
    interactive = false,
    className = '',
    onClick,
}) => {
    const classes = [
        'rounded-xl overflow-hidden',
        variantClasses[variant],
        interactive && 'cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined}>
            {header && (
                <div className="px-4 py-3 border-b border-[var(--border-subtle)] font-semibold text-foreground dark:text-foreground-dark">
                    {header}
                </div>
            )}
            <div className={paddingClasses[padding]}>
                {children}
            </div>
            {footer && (
                <div className="px-4 py-3 border-t border-[var(--border-subtle)] bg-surface-3 dark:bg-surface-3-dark">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
