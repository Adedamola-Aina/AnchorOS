/**
 * Text - Semantic typography primitive
 * 
 * Replaces raw text-* Tailwind classes with semantic variants.
 * Automatically handles light/dark mode text colors.
 * 
 * Usage:
 *   <Text>Default body text</Text>
 *   <Text variant="heading">H1-style heading</Text>
 *   <Text variant="muted">Secondary text</Text>
 *   <Text variant="success">Positive feedback</Text>
 */
import React from 'react';

type TextVariant =
    | 'body'      // Default body text
    | 'heading'   // Large heading (h1-style)
    | 'subheading'// Medium heading (h2-style)
    | 'label'     // Form labels, small headers
    | 'caption'   // Small descriptive text
    | 'muted'     // Secondary/subdued text
    | 'subtle'    // Tertiary/disabled text
    | 'success'   // Positive feedback
    | 'danger'    // Error/destructive
    | 'warning'   // Warning/caution
    | 'info'      // Informational
    | 'primary'   // Primary accent
    | 'finance'   // Financial positive (income)
    | 'task'      // Task/commitment accent
    | 'family';   // Family mode accent

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

interface TextProps {
    children: React.ReactNode;
    variant?: TextVariant;
    size?: TextSize;
    weight?: TextWeight;
    as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
    className?: string;
    truncate?: boolean | number; // true for single line, number for max lines
    mono?: boolean; // Monospace (for financial figures)
}

const variantClasses: Record<TextVariant, string> = {
    body: 'text-foreground dark:text-foreground-dark',
    heading: 'text-foreground dark:text-foreground-dark font-bold',
    subheading: 'text-foreground dark:text-foreground-dark font-semibold',
    label: 'text-foreground dark:text-foreground-dark font-medium',
    caption: 'text-muted dark:text-muted-dark text-sm',
    muted: 'text-muted dark:text-muted-dark',
    subtle: 'text-muted dark:text-muted-dark',
    success: 'text-success dark:text-success-dark',
    danger: 'text-danger dark:text-danger-dark',
    warning: 'text-warning dark:text-warning-dark',
    info: 'text-info dark:text-info-dark',
    primary: 'text-primary-500 dark:text-primary-400',
    finance: 'text-finance-500 dark:text-finance-400',
    task: 'text-task-500 dark:text-task-400',
    family: 'text-family-500 dark:text-family-400',
};

const sizeClasses: Record<TextSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
};

const weightClasses: Record<TextWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
};

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'body',
    size,
    weight,
    as: Component = 'span',
    className = '',
    truncate = false,
    mono = false,
}) => {
    const truncateClass = truncate === true
        ? 'truncate'
        : typeof truncate === 'number'
            ? `line-clamp-${truncate}`
            : '';

    const classes = [
        variantClasses[variant],
        size && sizeClasses[size],
        weight && weightClasses[weight],
        truncateClass,
        mono && 'font-financial tabular-nums',
        className,
    ].filter(Boolean).join(' ');

    return <Component className={classes}>{children}</Component>;
};

export default Text;
