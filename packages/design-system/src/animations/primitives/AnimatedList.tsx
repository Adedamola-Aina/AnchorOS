/**
 * AnimatedList - Staggered list animations
 * 
 * Wraps list items with staggered enter/exit animations.
 * Supports virtualized lists and dynamic items.
 * 
 * Usage:
 *   <AnimatedList>
 *     {items.map(item => (
 *       <AnimatedListItem key={item.id}>
 *         <ItemContent />
 *       </AnimatedListItem>
 *     ))}
 *   </AnimatedList>
 */

import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { staggerContainer, listItem, listItemScale } from '../variants';
import { listTransition, exitTransition } from '../transitions';
import { useReducedMotion } from '../hooks';

// ============================================================
// ANIMATED LIST CONTAINER
// ============================================================

interface AnimatedListProps {
    children: React.ReactNode;
    /** Custom stagger delay (seconds) */
    staggerDelay?: number;
    /** Animation style */
    variant?: 'default' | 'scale';
    /** Additional className */
    className?: string;
    /** HTML tag to render */
    as?: 'ul' | 'ol' | 'div';
}

export function AnimatedList({
    children,
    staggerDelay = 0.05,
    variant = 'default',
    className = '',
    as = 'div',
}: AnimatedListProps) {
    const prefersReducedMotion = useReducedMotion();
    const Component = motion[as];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.15 },
        },
    };

    return (
        <Component
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={className}
        >
            <AnimatePresence mode="popLayout">
                {children}
            </AnimatePresence>
        </Component>
    );
}

// ============================================================
// ANIMATED LIST ITEM
// ============================================================

interface AnimatedListItemProps {
    children: React.ReactNode;
    /** Unique key for AnimatePresence */
    itemKey: string | number;
    /** Animation style */
    variant?: 'default' | 'scale';
    /** Additional className */
    className?: string;
    /** Layout animation for reordering */
    layout?: boolean | 'position' | 'size';
    /** Click handler */
    onClick?: () => void;
}

export function AnimatedListItem({
    children,
    itemKey,
    variant = 'default',
    className = '',
    layout = true,
    onClick,
}: AnimatedListItemProps) {
    const prefersReducedMotion = useReducedMotion();
    const variants = variant === 'scale' ? listItemScale : listItem;

    return (
        <motion.div
            key={itemKey}
            variants={prefersReducedMotion ? { hidden: {}, visible: {}, exit: {} } : variants}
            layout={prefersReducedMotion ? false : layout}
            transition={listTransition}
            exit="exit"
            className={className}
            onClick={onClick}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
        >
            {children}
        </motion.div>
    );
}

// ============================================================
// VIRTUALIZED LIST ITEM (for react-virtual)
// ============================================================

interface VirtualizedAnimatedItemProps {
    children: React.ReactNode;
    /** Index for stagger calculation */
    index: number;
    /** Total visible items (for stagger reset) */
    visibleCount?: number;
    /** Additional className */
    className?: string;
    /** Style from virtualizer */
    style?: React.CSSProperties;
}

export function VirtualizedAnimatedItem({
    children,
    index,
    visibleCount = 10,
    className = '',
    style,
}: VirtualizedAnimatedItemProps) {
    const prefersReducedMotion = useReducedMotion();

    // Only animate first visible batch
    const shouldAnimate = !prefersReducedMotion && index < visibleCount;
    const delay = shouldAnimate ? index * 0.03 : 0;

    return (
        <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, ...listTransition }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}

export default AnimatedList;
