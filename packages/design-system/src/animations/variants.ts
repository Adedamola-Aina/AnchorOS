/**
 * Animation Variants - Framer Motion Presets
 * 
 * Reusable animation variants for consistent motion across the app.
 * 
 * Usage:
 *   import { fadeIn, slideUp, staggerContainer } from '@anchor-os/design-system/animations';
 *   
 *   <motion.div variants={fadeIn} initial="hidden" animate="visible">
 */

import type { Variants } from 'framer-motion';

// ============================================================
// FADE VARIANTS
// ============================================================

/** Simple fade in/out */
export const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

/** Fade with slight scale */
export const fadeScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

/** Fade with blur (for modals, overlays) */
export const fadeBlur: Variants = {
    hidden: { opacity: 0, filter: 'blur(4px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(4px)' },
};

// ============================================================
// SLIDE VARIANTS
// ============================================================

/** Slide up from below */
export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
};

/** Slide down from above */
export const slideDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

/** Slide in from left */
export const slideLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

/** Slide in from right */
export const slideRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

/** Full slide from right (for page transitions) */
export const pageSlideRight: Variants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
};

// ============================================================
// SCALE VARIANTS
// ============================================================

/** Scale up from center (for modals) */
export const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

/** Pop in with overshoot */
export const popIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', damping: 15, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.8 },
};

/** Bounce in */
export const bounceIn: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', damping: 10, stiffness: 400 }
    },
    exit: { opacity: 0, scale: 0.3 },
};

// ============================================================
// CONTAINER VARIANTS (for staggered children)
// ============================================================

/** Stagger children with delay */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
        },
    },
};

/** Fast stagger for lists */
export const staggerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
        },
    },
};

/** Slow stagger for dramatic reveals */
export const staggerSlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// ============================================================
// LIST ITEM VARIANTS
// ============================================================

/** Standard list item animation */
export const listItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

/** List item with scale */
export const listItemScale: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

// ============================================================
// INTERACTION VARIANTS
// ============================================================

/** Button/card tap effect */
export const tap = {
    scale: 0.98,
    transition: { duration: 0.1 },
};

/** Hover lift effect */
export const hoverLift = {
    y: -2,
    boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
    transition: { duration: 0.2 },
};

/** Subtle hover scale */
export const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.2 },
};

// ============================================================
// FEEDBACK VARIANTS
// ============================================================

/** Success check animation */
export const successCheck: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.4, ease: 'easeOut' }
    },
};

/** Error shake */
export const shake: Variants = {
    hidden: { x: 0 },
    visible: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
    },
};

/** Pulse attention */
export const pulse: Variants = {
    hidden: { scale: 1 },
    visible: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.3, repeat: 2 }
    },
};

// ============================================================
// COMBINED EXPORTS
// ============================================================

export const variants = {
    fade,
    fadeScale,
    fadeBlur,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    pageSlideRight,
    scaleUp,
    popIn,
    bounceIn,
    staggerContainer,
    staggerFast,
    staggerSlow,
    listItem,
    listItemScale,
    successCheck,
    shake,
    pulse,
} as const;

export const interactions = {
    tap,
    hoverLift,
    hoverScale,
} as const;
