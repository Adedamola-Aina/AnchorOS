/**
 * AnimatedFeedback - Success/Error/Warning feedback animations
 * 
 * Visual feedback components for user actions.
 * 
 * Usage:
 *   <AnimatedCheckmark show={success} />
 *   <AnimatedShake trigger={error}>Content</AnimatedShake>
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springBouncy } from '../transitions';
import { useReducedMotion } from '../hooks';

// ============================================================
// ANIMATED CHECKMARK (Success)
// ============================================================

interface AnimatedCheckmarkProps {
    /** Show the checkmark */
    show: boolean;
    /** Size in pixels */
    size?: number;
    /** Color */
    color?: string;
    /** Additional className */
    className?: string;
}

export function AnimatedCheckmark({
    show,
    size = 24,
    color = 'currentColor',
    className = '',
}: AnimatedCheckmarkProps) {
    const prefersReducedMotion = useReducedMotion();

    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.4, ease: 'easeOut' as const },
        },
    };

    const circleVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: prefersReducedMotion ? { duration: 0 } : springBouncy,
        },
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    className={className}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Background circle */}
                    <motion.circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="#10b981"
                        variants={circleVariants}
                    />
                    {/* Check path */}
                    <motion.path
                        d="M7 12.5L10.5 16L17 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={pathVariants}
                    />
                </motion.svg>
            )}
        </AnimatePresence>
    );
}

// ============================================================
// ANIMATED SHAKE (Error)
// ============================================================

interface AnimatedShakeProps {
    children: React.ReactNode;
    /** Trigger shake animation */
    trigger: boolean;
    /** Duration in milliseconds */
    duration?: number;
    /** Intensity of shake */
    intensity?: 'light' | 'medium' | 'heavy';
}

const intensityValues = {
    light: [-5, 5, -5, 5, 0],
    medium: [-10, 10, -10, 10, 0],
    heavy: [-15, 15, -15, 15, -10, 10, 0],
};

export function AnimatedShake({
    children,
    trigger,
    duration = 400,
    intensity = 'medium',
}: AnimatedShakeProps) {
    const prefersReducedMotion = useReducedMotion();
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (trigger && !prefersReducedMotion) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), duration);
            return () => clearTimeout(timer);
        }
    }, [trigger, duration, prefersReducedMotion]);

    return (
        <motion.div
            animate={isShaking ? { x: intensityValues[intensity] } : { x: 0 }}
            transition={{ duration: duration / 1000 }}
        >
            {children}
        </motion.div>
    );
}

// ============================================================
// ANIMATED PULSE (Attention)
// ============================================================

interface AnimatedPulseProps {
    children: React.ReactNode;
    /** Enable pulsing */
    pulse: boolean;
    /** Pulse color */
    color?: string;
}

export function AnimatedPulse({
    children,
    pulse,
    color = 'rgba(59, 130, 246, 0.5)',
}: AnimatedPulseProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="relative inline-flex">
            {pulse && !prefersReducedMotion && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{
                        scale: [1, 1.5, 1.5],
                        opacity: [0.5, 0, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            )}
            {children}
        </div>
    );
}

// ============================================================
// ANIMATED COUNTER (Number change)
// ============================================================

interface AnimatedCounterProps {
    /** Target value */
    value: number;
    /** Format function */
    format?: (value: number) => string;
    /** Animation duration */
    duration?: number;
    /** Additional className */
    className?: string;
}

export function AnimatedCounter({
    value,
    format = (v) => v.toLocaleString(),
    duration = 0.5,
    className = '',
}: AnimatedCounterProps) {
    const prefersReducedMotion = useReducedMotion();
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        if (prefersReducedMotion) {
            setDisplayValue(value);
            return;
        }

        // Animate counting from current to target
        const startValue = displayValue;
        const startTime = performance.now();
        const durationMs = duration * 1000;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (value - startValue) * eased;

            setDisplayValue(Math.round(current));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration, prefersReducedMotion]);

    return (
        <span className={className}>
            {format(displayValue)}
        </span>
    );
}

export default AnimatedCheckmark;
