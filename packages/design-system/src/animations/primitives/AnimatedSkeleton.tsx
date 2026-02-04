/**
 * AnimatedSkeleton - Loading placeholder with shimmer
 * 
 * Provides smooth loading states with animated shimmer effect.
 * Respects reduced motion preferences.
 * 
 * Usage:
 *   <AnimatedSkeleton variant="text" lines={3} />
 *   <AnimatedSkeleton variant="card" />
 *   <AnimatedSkeleton variant="avatar" />
 */

import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks';

type SkeletonVariant = 'text' | 'card' | 'avatar' | 'button' | 'custom';

interface AnimatedSkeletonProps {
    /** Shape variant */
    variant?: SkeletonVariant;
    /** Number of text lines (for text variant) */
    lines?: number;
    /** Width (for custom) */
    width?: string | number;
    /** Height (for custom) */
    height?: string | number;
    /** Additional className */
    className?: string;
    /** Whether to animate */
    animate?: boolean;
}

// Shimmer animation
const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
        x: '100%',
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear' as const,
        },
    },
};

export function AnimatedSkeleton({
    variant = 'text',
    lines = 1,
    width,
    height,
    className = '',
    animate = true,
}: AnimatedSkeletonProps) {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animate && !prefersReducedMotion;

    const baseClasses = 'bg-surface-3 dark:bg-surface-3-dark rounded-lg overflow-hidden relative';

    // Variant-specific sizing
    const variantClasses: Record<SkeletonVariant, string> = {
        text: 'h-4 w-full',
        card: 'h-32 w-full rounded-xl',
        avatar: 'h-10 w-10 rounded-full',
        button: 'h-10 w-24 rounded-xl',
        custom: '',
    };

    const renderSkeleton = (key: number | string, customClass?: string) => (
        <div
            key={key}
            className={`${baseClasses} ${variantClasses[variant]} ${customClass ?? ''} ${className}`}
            style={{ width, height }}
        >
            {shouldAnimate && (
                <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                />
            )}
        </div>
    );

    // Multi-line text skeleton
    if (variant === 'text' && lines > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    renderSkeleton(i, i === lines - 1 ? 'w-3/4' : undefined)
                ))}
            </div>
        );
    }

    return renderSkeleton(0);
}

// ============================================================
// SKELETON GROUPS
// ============================================================

interface SkeletonListProps {
    /** Number of items */
    count?: number;
    /** Additional className for each item */
    className?: string;
}

/** Skeleton list items */
export function SkeletonList({ count = 3, className = '' }: SkeletonListProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 ${className}`}
                >
                    <AnimatedSkeleton variant="avatar" />
                    <div className="flex-1 space-y-2">
                        <AnimatedSkeleton variant="text" />
                        <AnimatedSkeleton variant="text" className="w-2/3" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

interface SkeletonCardGridProps {
    /** Number of cards */
    count?: number;
    /** Grid columns */
    columns?: 1 | 2 | 3 | 4;
}

/** Skeleton card grid */
export function SkeletonCardGrid({ count = 4, columns = 2 }: SkeletonCardGridProps) {
    const prefersReducedMotion = useReducedMotion();
    const gridColsMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

    return (
        <div className={`grid ${gridColsMap[columns]} gap-4`}>
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <AnimatedSkeleton variant="card" />
                </motion.div>
            ))}
        </div>
    );
}

export default AnimatedSkeleton;
