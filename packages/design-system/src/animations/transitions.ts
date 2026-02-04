/**
 * Animation Transitions - Framer Motion Timing Presets
 * 
 * Predefined transition configurations for consistent timing.
 * 
 * Usage:
 *   import { springSnappy, tweenSmooth } from '@anchor-os/design-system/animations';
 *   
 *   <motion.div transition={springSnappy}>
 */

import type { Transition } from 'framer-motion';

// ============================================================
// SPRING TRANSITIONS
// ============================================================

/** Snappy spring - quick and responsive */
export const springSnappy: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

/** Bouncy spring - playful with overshoot */
export const springBouncy: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 15,
};

/** Gentle spring - soft and smooth */
export const springGentle: Transition = {
    type: 'spring',
    stiffness: 200,
    damping: 25,
};

/** Stiff spring - minimal overshoot */
export const springStiff: Transition = {
    type: 'spring',
    stiffness: 500,
    damping: 35,
};

// ============================================================
// TWEEN TRANSITIONS
// ============================================================

/** Smooth ease - default animation */
export const tweenSmooth: Transition = {
    type: 'tween',
    duration: 0.3,
    ease: 'easeInOut',
};

/** Quick tween - fast interactions */
export const tweenQuick: Transition = {
    type: 'tween',
    duration: 0.15,
    ease: 'easeOut',
};

/** Slow tween - dramatic reveals */
export const tweenSlow: Transition = {
    type: 'tween',
    duration: 0.5,
    ease: 'easeInOut',
};

/** Linear - constant speed */
export const tweenLinear: Transition = {
    type: 'tween',
    duration: 0.3,
    ease: 'linear',
};

// ============================================================
// SPECIALIZED TRANSITIONS
// ============================================================

/** Page transition - for route changes */
export const pageTransition: Transition = {
    type: 'tween',
    duration: 0.25,
    ease: [0.25, 0.1, 0.25, 1], // Custom bezier
};

/** Modal transition - scale and fade */
export const modalTransition: Transition = {
    type: 'spring',
    stiffness: 350,
    damping: 28,
};

/** List item transition */
export const listTransition: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 25,
};

/** Layout transition - for layout changes */
export const layoutTransition: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
};

/** Exit transition - quick fade out */
export const exitTransition: Transition = {
    type: 'tween',
    duration: 0.15,
    ease: 'easeIn',
};

// ============================================================
// STAGGER CONFIGURATIONS
// ============================================================

/** Stagger timing for containers */
export const staggerTiming = {
    fast: 0.03,
    normal: 0.05,
    slow: 0.1,
} as const;

/** Delay configurations */
export const delays = {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.4,
} as const;

// ============================================================
// COMBINED EXPORTS
// ============================================================

export const transitions = {
    springSnappy,
    springBouncy,
    springGentle,
    springStiff,
    tweenSmooth,
    tweenQuick,
    tweenSlow,
    tweenLinear,
    pageTransition,
    modalTransition,
    listTransition,
    layoutTransition,
    exitTransition,
} as const;

export type TransitionPreset = keyof typeof transitions;
