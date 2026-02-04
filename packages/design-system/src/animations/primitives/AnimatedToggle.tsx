/**
 * AnimatedToggle - Toggle switch with spring physics
 * WEB-003: Phase 5 micro-interaction
 * 
 * Usage:
 *   <AnimatedToggle enabled={isEnabled} onChange={setIsEnabled} />
 */

import React from 'react';
import { motion } from 'framer-motion';
import { springBouncy } from '../transitions';
import { useReducedMotion } from '../hooks';

interface AnimatedToggleProps {
    /** Toggle state */
    enabled: boolean;
    /** Change handler */
    onChange: (enabled: boolean) => void;
    /** Label text */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional className */
    className?: string;
    /** ID for form association */
    id?: string;
}

const sizeMap = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 16, text: 'text-sm' },
    md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 20, text: 'text-sm' },
    lg: { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 24, text: 'text-base' },
} as const;

export function AnimatedToggle({
    enabled,
    onChange,
    label,
    disabled = false,
    size = 'md',
    className = '',
    id,
}: AnimatedToggleProps) {
    const prefersReducedMotion = useReducedMotion();
    const sizes = sizeMap[size];
    // eslint-disable-next-line react-hooks/purity
    const toggleId = React.useMemo(() => id || `toggle-${Math.random().toString(36).slice(2)}`, [id]);

    const handleToggle = () => {
        if (!disabled) {
            onChange(!enabled);
        }
    };

    return (
        <label
            htmlFor={toggleId}
            className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <motion.button
                type="button"
                role="switch"
                aria-checked={enabled}
                id={toggleId}
                onClick={handleToggle}
                disabled={disabled}
                className={`
                    ${sizes.track} rounded-full relative p-0.5
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50
                    ${enabled
                        ? 'bg-primary-500'
                        : 'bg-surface-3 dark:bg-surface-3-dark'}
                `}
                whileTap={!disabled && !prefersReducedMotion ? { scale: 0.95 } : undefined}
            >
                <motion.div
                    className={`
                        ${sizes.thumb} rounded-full bg-white shadow-sm
                    `}
                    initial={false}
                    animate={{
                        x: enabled ? sizes.translate : 0,
                    }}
                    transition={prefersReducedMotion ? { duration: 0 } : springBouncy}
                />
            </motion.button>
            {label && (
                <span className={`${sizes.text} text-foreground dark:text-foreground-dark`}>
                    {label}
                </span>
            )}
        </label>
    );
}

// ============================================================
// ICON TOGGLE VARIANT
// ============================================================

interface AnimatedIconToggleProps extends Omit<AnimatedToggleProps, 'label'> {
    /** Icon when enabled */
    enabledIcon: React.ReactNode;
    /** Icon when disabled */
    disabledIcon: React.ReactNode;
}

export function AnimatedIconToggle({
    enabled,
    onChange,
    enabledIcon,
    disabledIcon,
    disabled = false,
    size = 'md',
    className = '',
    id,
}: AnimatedIconToggleProps) {
    const prefersReducedMotion = useReducedMotion();
    const sizes = sizeMap[size];
    // eslint-disable-next-line react-hooks/purity
    const toggleId = React.useMemo(() => id || `icon-toggle-${Math.random().toString(36).slice(2)}`, [id]);

    const handleToggle = () => {
        if (!disabled) {
            onChange(!enabled);
        }
    };

    return (
        <motion.button
            type="button"
            role="switch"
            aria-checked={enabled}
            id={toggleId}
            onClick={handleToggle}
            disabled={disabled}
            className={`
                ${sizes.track} rounded-full relative p-0.5
                transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${enabled
                    ? 'bg-primary-500'
                    : 'bg-surface-3 dark:bg-surface-3-dark'}
                ${className}
            `}
            whileTap={!disabled && !prefersReducedMotion ? { scale: 0.95 } : undefined}
        >
            <motion.div
                className={`
                    ${sizes.thumb} rounded-full bg-white shadow-sm
                    flex items-center justify-center
                `}
                initial={false}
                animate={{
                    x: enabled ? sizes.translate : 0,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : springBouncy}
            >
                <motion.div
                    className="w-2/3 h-2/3 text-primary-500"
                    initial={false}
                    animate={{ rotate: enabled ? 0 : 180 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                >
                    {enabled ? enabledIcon : disabledIcon}
                </motion.div>
            </motion.div>
        </motion.button>
    );
}

export default AnimatedToggle;
