/**
 * AnimatedProgress - Progress indicators with smooth animations
 * WEB-003: Phase 7 loading animations
 * 
 * Usage:
 *   <AnimatedProgressBar progress={75} />
 *   <AnimatedProgressCircle progress={50} />
 *   <AnimatedSpinner />
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks';
import { springSnappy } from '../transitions';

// ============================================================
// ANIMATED PROGRESS BAR
// ============================================================

interface AnimatedProgressBarProps {
    /** Progress value 0-100 */
    progress: number;
    /** Height in pixels */
    height?: number;
    /** Show label */
    showLabel?: boolean;
    /** Color variant */
    variant?: 'primary' | 'success' | 'warning' | 'danger';
    /** Additional className */
    className?: string;
}

const variantColors = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
} as const;

export function AnimatedProgressBar({
    progress,
    height = 8,
    showLabel = false,
    variant = 'primary',
    className = '',
}: AnimatedProgressBarProps) {
    const prefersReducedMotion = useReducedMotion();
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className={`w-full ${className}`}>
            <div
                className="w-full bg-surface-3 dark:bg-surface-3-dark rounded-full overflow-hidden"
                style={{ height }}
            >
                <motion.div
                    className={`h-full ${variantColors[variant]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
                />
            </div>
            {showLabel && (
                <div className="mt-1 text-xs text-muted text-right">
                    {Math.round(clampedProgress)}%
                </div>
            )}
        </div>
    );
}

// ============================================================
// ANIMATED PROGRESS CIRCLE
// ============================================================

interface AnimatedProgressCircleProps {
    /** Progress value 0-100 */
    progress: number;
    /** Size in pixels */
    size?: number;
    /** Stroke width */
    strokeWidth?: number;
    /** Show percentage label */
    showLabel?: boolean;
    /** Color variant */
    variant?: 'primary' | 'success' | 'warning' | 'danger';
    /** Additional className */
    className?: string;
}

const variantStrokeColors = {
    primary: '#6366f1', // primary-500
    success: '#10b981', // success-500
    warning: '#f59e0b', // warning-500
    danger: '#ef4444',  // danger-500
} as const;

export function AnimatedProgressCircle({
    progress,
    size = 48,
    strokeWidth = 4,
    showLabel = true,
    variant = 'primary',
    className = '',
}: AnimatedProgressCircleProps) {
    const prefersReducedMotion = useReducedMotion();
    const clampedProgress = Math.max(0, Math.min(100, progress));

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (clampedProgress / 100) * circumference;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-surface-3 dark:text-surface-3-dark"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={variantStrokeColors[variant]}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
                />
            </svg>
            {showLabel && (
                <span className="absolute text-xs font-bold text-foreground dark:text-foreground-dark">
                    {Math.round(clampedProgress)}%
                </span>
            )}
        </div>
    );
}

// ============================================================
// ANIMATED SPINNER
// ============================================================

interface AnimatedSpinnerProps {
    /** Size in pixels */
    size?: number;
    /** Color */
    color?: string;
    /** Additional className */
    className?: string;
}

export function AnimatedSpinner({
    size = 24,
    color = 'currentColor',
    className = '',
}: AnimatedSpinnerProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div
                className={`border-2 border-current border-t-transparent rounded-full ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <motion.div
            className={`border-2 border-t-transparent rounded-full ${className}`}
            style={{
                width: size,
                height: size,
                borderColor: color,
                borderTopColor: 'transparent',
            }}
            animate={{ rotate: 360 }}
            transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    );
}

// ============================================================
// ANIMATED COPY CONFIRMATION
// ============================================================

interface AnimatedCopyConfirmationProps {
    /** Show confirmation */
    show: boolean;
    /** Position */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Additional className */
    className?: string;
}

export function AnimatedCopyConfirmation({
    show,
    position = 'top',
    className = '',
}: AnimatedCopyConfirmationProps) {
    const prefersReducedMotion = useReducedMotion();

    const positionClasses = {
        top: '-top-8 left-1/2 -translate-x-1/2',
        bottom: '-bottom-8 left-1/2 -translate-x-1/2',
        left: 'top-1/2 -translate-y-1/2 -left-16',
        right: 'top-1/2 -translate-y-1/2 -right-16',
    } as const;

    const motionProps = {
        top: { y: 10 },
        bottom: { y: -10 },
        left: { x: 10 },
        right: { x: -10 },
    } as const;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={`absolute ${positionClasses[position]} px-2 py-1 bg-foreground dark:bg-surface-3-dark text-white dark:text-foreground-dark text-xs font-medium rounded-lg shadow-lg ${className}`}
                    initial={prefersReducedMotion ? {} : { opacity: 0, ...motionProps[position] }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    Copied!
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default AnimatedProgressBar;
