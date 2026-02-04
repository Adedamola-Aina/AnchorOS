/**
 * AnimatedBadge - Badge with pulse and scale animations
 * WEB-003: Phase 5 micro-interaction
 * 
 * Usage:
 *   <AnimatedBadge variant="primary" count={5} />
 *   <AnimatedBadge variant="dot" pulse />
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springBouncy, springSnappy } from '../transitions';
import { useReducedMotion } from '../hooks';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'muted';
type BadgeSize = 'sm' | 'md' | 'lg';

interface AnimatedBadgeProps {
    /** Visual variant */
    variant?: BadgeVariant;
    /** Counter value (optional) */
    count?: number;
    /** Maximum count to display (shows max+) */
    maxCount?: number;
    /** Size */
    size?: BadgeSize;
    /** Dot-only variant (no text) */
    dot?: boolean;
    /** Pulse animation */
    pulse?: boolean;
    /** Show badge (for AnimatePresence) */
    visible?: boolean;
    /** Additional className */
    className?: string;
    /** Children content (overrides count) */
    children?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-surface-3 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark',
    success: 'bg-success-500 text-white',
    danger: 'bg-danger-500 text-white',
    warning: 'bg-warning-500 text-foreground',
    muted: 'bg-surface-3 dark:bg-surface-3-dark text-muted',
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-[10px] min-w-4 h-4 px-1',
    md: 'text-xs min-w-5 h-5 px-1.5',
    lg: 'text-sm min-w-6 h-6 px-2',
};

const dotSizeClasses: Record<BadgeSize, string> = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
};

export function AnimatedBadge({
    variant = 'primary',
    count,
    maxCount = 99,
    size = 'md',
    dot = false,
    pulse = false,
    visible = true,
    className = '',
    children,
}: AnimatedBadgeProps) {
    const prefersReducedMotion = useReducedMotion();

    // Calculate display value
    const displayValue = count !== undefined
        ? count > maxCount ? `${maxCount}+` : count.toString()
        : children;

    // Dot variant
    if (dot) {
        return (
            <AnimatePresence>
                {visible && (
                    <motion.span
                        className={`
                            ${dotSizeClasses[size]} ${variantClasses[variant]} rounded-full
                            ${className}
                        `}
                        initial={prefersReducedMotion ? false : { scale: 0 }}
                        animate={pulse && !prefersReducedMotion ? {
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1],
                        } : { scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={pulse ? {
                            duration: 1,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        } : springBouncy}
                    />
                )}
            </AnimatePresence>
        );
    }

    // Counter/text variant
    return (
        <AnimatePresence mode="wait">
            {visible && (
                <motion.span
                    key={displayValue?.toString()}
                    className={`
                        ${sizeClasses[size]} ${variantClasses[variant]}
                        rounded-full font-bold flex items-center justify-center
                        ${className}
                    `}
                    initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={springBouncy}
                >
                    <motion.span
                        key={displayValue?.toString()}
                        initial={prefersReducedMotion ? false : { y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={springSnappy}
                    >
                        {displayValue}
                    </motion.span>
                </motion.span>
            )}
        </AnimatePresence>
    );
}

// ============================================================
// NOTIFICATION BADGE (positioned variant)
// ============================================================

interface NotificationBadgeProps extends Omit<AnimatedBadgeProps, 'dot'> {
    /** Position relative to parent */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const positionClasses: Record<NotificationBadgeProps['position'] & string, string> = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
};

export function NotificationBadge({
    position = 'top-right',
    ...props
}: NotificationBadgeProps) {
    return (
        <span className={`absolute ${positionClasses[position]}`}>
            <AnimatedBadge {...props} />
        </span>
    );
}

export default AnimatedBadge;
