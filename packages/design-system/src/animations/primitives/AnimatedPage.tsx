/**
 * AnimatedPage - Page transition wrapper
 * 
 * Wraps page content with enter/exit animations.
 * Use with AnimatePresence in router.
 * 
 * Usage:
 *   <AnimatedPage variant="slideUp">
 *     <YourPageContent />
 *   </AnimatedPage>
 */

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { fade, slideUp, slideRight, fadeScale, pageSlideRight } from '../variants';
import { pageTransition } from '../transitions';
import { useReducedMotion } from '../hooks';

type PageVariant = 'fade' | 'slideUp' | 'slideRight' | 'fadeScale' | 'pageSlide';

interface AnimatedPageProps {
    children: React.ReactNode;
    /** Animation variant to use */
    variant?: PageVariant;
    /** Custom variants (overrides preset) */
    customVariants?: Variants;
    /** Additional className */
    className?: string;
    /** HTML tag to render */
    as?: 'div' | 'main' | 'section' | 'article';
}

const variantMap: Record<PageVariant, Variants> = {
    fade,
    slideUp,
    slideRight,
    fadeScale,
    pageSlide: pageSlideRight,
};

export function AnimatedPage({
    children,
    variant = 'fadeScale',
    customVariants,
    className = '',
    as = 'div',
}: AnimatedPageProps) {
    const prefersReducedMotion = useReducedMotion();
    const Component = motion[as];

    // Use fade-only for reduced motion preference
    const variants = prefersReducedMotion ? fade : (customVariants ?? variantMap[variant]);

    return (
        <Component
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={pageTransition}
            className={className}
        >
            {children}
        </Component>
    );
}

export default AnimatedPage;
