/**
 * AnimatedButton - Button with press/hover animations
 * 
 * Provides consistent micro-interactions for all buttons.
 * Supports variants matching design system.
 * 
 * Usage:
 *   <AnimatedButton variant="primary" onClick={handleClick}>
 *     Click me
 *   </AnimatedButton>
 */

import React from 'react';
import { motion } from 'framer-motion';
import { springSnappy } from '../transitions';
import { useReducedMotion } from '../hooks';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AnimatedButtonProps {
    children: React.ReactNode;
    /** Visual variant */
    variant?: ButtonVariant;
    /** Size */
    size?: ButtonSize;
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Additional className */
    className?: string;
    /** Button type */
    type?: 'button' | 'submit' | 'reset';
    /** Icon only (circular) */
    iconOnly?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm',
    secondary: 'bg-surface-3 dark:bg-surface-3-dark hover:bg-surface-hover dark:hover:bg-surface-hover-dark text-foreground dark:text-foreground-dark',
    ghost: 'bg-transparent hover:bg-surface-3 dark:hover:bg-surface-3-dark text-foreground dark:text-foreground-dark',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-sm',
    success: 'bg-success-500 hover:bg-success-600 text-white shadow-sm',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
    lg: 'p-3 rounded-xl',
};

export function AnimatedButton({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
    type = 'button',
    iconOnly = false,
}: AnimatedButtonProps) {
    const prefersReducedMotion = useReducedMotion();

    const baseClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed';
    const sizeClass = iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size];
    const widthClass = fullWidth ? 'w-full' : '';

    // Animation values
    const tapScale = prefersReducedMotion ? 1 : 0.97;
    const hoverScale = prefersReducedMotion ? 1 : 1.02;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClass} ${widthClass} ${className}`}
            whileHover={{ scale: disabled ? 1 : hoverScale }}
            whileTap={{ scale: disabled ? 1 : tapScale }}
            transition={springSnappy}
        >
            {loading ? (
                <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
            ) : (
                children
            )}
        </motion.button>
    );
}

// ============================================================
// ANIMATED ICON BUTTON
// ============================================================

interface AnimatedIconButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    'aria-label': string;
    size?: ButtonSize;
}

export function AnimatedIconButton({
    children,
    onClick,
    disabled = false,
    className = '',
    'aria-label': ariaLabel,
    size = 'md',
}: AnimatedIconButtonProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${iconOnlySizeClasses[size]} text-muted hover:text-foreground dark:hover:text-foreground-dark hover:bg-surface-3 dark:hover:bg-surface-3-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 ${className}`}
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
            transition={springSnappy}
            aria-label={ariaLabel}
        >
            {children}
        </motion.button>
    );
}

export default AnimatedButton;
