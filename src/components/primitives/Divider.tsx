/**
 * Divider - Semantic separator primitive
 * 
 * Replaces raw border-* classes with semantic dividers.
 * 
 * Usage:
 *   <Divider />
 *   <Divider label="OR" />
 *   <Divider orientation="vertical" />
 */
import React from 'react';

interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    label?: string;
    variant?: 'default' | 'subtle' | 'strong';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
}

const variantClasses: Record<string, string> = {
    default: 'border-[var(--border)]',
    subtle: 'border-[var(--border-subtle)]',
    strong: 'border-slate-300 dark:border-slate-600',
};

const spacingClasses: Record<string, { horizontal: string; vertical: string }> = {
    none: { horizontal: '', vertical: '' },
    sm: { horizontal: 'my-2', vertical: 'mx-2' },
    md: { horizontal: 'my-4', vertical: 'mx-4' },
    lg: { horizontal: 'my-6', vertical: 'mx-6' },
};

export const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    label,
    variant = 'default',
    spacing = 'md',
    className = '',
}) => {
    const isHorizontal = orientation === 'horizontal';
    const spacingClass = spacingClasses[spacing][orientation];

    if (label && isHorizontal) {
        return (
            <div className={`flex items-center gap-4 ${spacingClass} ${className}`}>
                <div className={`flex-1 border-t ${variantClasses[variant]}`} />
                <span className="text-sm text-muted dark:text-muted-dark font-medium">
                    {label}
                </span>
                <div className={`flex-1 border-t ${variantClasses[variant]}`} />
            </div>
        );
    }

    const classes = [
        isHorizontal ? `border-t w-full` : `border-l h-full`,
        variantClasses[variant],
        spacingClass,
        className,
    ].filter(Boolean).join(' ');

    return <div className={classes} role="separator" aria-orientation={orientation} />;
};

export default Divider;
