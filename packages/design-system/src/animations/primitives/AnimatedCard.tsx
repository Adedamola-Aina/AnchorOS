/**
 * AnimatedCard - Card with hover lift and press effects
 * 
 * Interactive card component with smooth animations.
 * 
 * Usage:
 *   <AnimatedCard onClick={handleClick}>
 *     <CardContent />
 *   </AnimatedCard>
 */

import React from 'react';
import { motion } from 'framer-motion';
import { springSnappy, layoutTransition } from '../transitions';
import { useReducedMotion } from '../hooks';

interface AnimatedCardProps {
    children: React.ReactNode;
    /** Click handler (makes card interactive) */
    onClick?: () => void;
    /** Additional className */
    className?: string;
    /** Enable hover lift effect */
    hoverLift?: boolean;
    /** Enable layout animations */
    layout?: boolean | 'position' | 'size';
    /** HTML tag to render */
    as?: 'div' | 'article' | 'section' | 'li';
    /** Card padding */
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export function AnimatedCard({
    children,
    onClick,
    className = '',
    hoverLift = true,
    layout = false,
    as = 'div',
    padding = 'md',
}: AnimatedCardProps) {
    const prefersReducedMotion = useReducedMotion();
    const Component = motion[as];
    const isInteractive = !!onClick;

    const baseClasses = `bg-surface-2 dark:bg-surface-2-dark rounded-xl border border-border-subtle dark:border-border ${paddingClasses[padding]}`;
    const interactiveClasses = isInteractive ? 'cursor-pointer' : '';

    // Hover animation values
    const hoverY = prefersReducedMotion ? 0 : (hoverLift ? -4 : 0);
    const tapScale = prefersReducedMotion ? 1 : 0.98;

    return (
        <Component
            onClick={onClick}
            className={`${baseClasses} ${interactiveClasses} ${className}`}
            layout={prefersReducedMotion ? false : layout}
            transition={layoutTransition}
            whileHover={isInteractive && !prefersReducedMotion ? {
                y: hoverY,
                boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
                transition: { duration: 0.2 },
            } : undefined}
            whileTap={isInteractive && !prefersReducedMotion ? {
                scale: tapScale,
                transition: springSnappy,
            } : undefined}
        >
            {children}
        </Component>
    );
}

// ============================================================
// ANIMATED CARD VARIANTS
// ============================================================

interface AnimatedRevealCardProps extends Omit<AnimatedCardProps, 'layout'> {
    /** Delay before revealing (for stagger) */
    delay?: number;
}

/** Card that animates in on mount */
export function AnimatedRevealCard({
    children,
    delay = 0,
    className = '',
    ...props
}: AnimatedRevealCardProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, ...springSnappy }}
        >
            <AnimatedCard className={className} {...props}>
                {children}
            </AnimatedCard>
        </motion.div>
    );
}

interface AnimatedExpandCardProps extends AnimatedCardProps {
    /** Whether card is expanded */
    isExpanded: boolean;
    /** Collapsed height */
    collapsedHeight?: number | string;
}

/** Card with expand/collapse animation */
export function AnimatedExpandCard({
    children,
    isExpanded,
    collapsedHeight = 'auto',
    className = '',
    ...props
}: AnimatedExpandCardProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <AnimatedCard className={className} {...props}>
            <motion.div
                initial={false}
                animate={{
                    height: isExpanded ? 'auto' : collapsedHeight,
                    opacity: 1,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
                style={{ overflow: 'hidden' }}
            >
                {children}
            </motion.div>
        </AnimatedCard>
    );
}

export default AnimatedCard;
