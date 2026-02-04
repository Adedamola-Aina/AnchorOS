/**
 * Animations - Anchor OS Design System
 * 
 * Complete animation system with Framer Motion.
 * 
 * Usage:
 *   // Import variants and transitions
 *   import { fadeScale, springSnappy } from '@anchor-os/design-system/animations';
 *   
 *   // Import hooks
 *   import { useReducedMotion, useInViewAnimation } from '@anchor-os/design-system/animations';
 *   
 *   // Import animated primitives
 *   import { AnimatedPage, AnimatedList, AnimatedModal } from '@anchor-os/design-system/animations';
 */

// ============================================================
// VARIANTS
// ============================================================
export {
    // Fade
    fade,
    fadeScale,
    fadeBlur,
    // Slide
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    pageSlideRight,
    // Scale
    scaleUp,
    popIn,
    bounceIn,
    // Stagger
    staggerContainer,
    staggerFast,
    staggerSlow,
    // List
    listItem,
    listItemScale,
    // Feedback
    successCheck,
    shake,
    pulse,
    // Interactions
    tap,
    hoverLift,
    hoverScale,
    // Combined
    variants,
    interactions,
} from './variants';

// ============================================================
// TRANSITIONS
// ============================================================
export {
    // Springs
    springSnappy,
    springBouncy,
    springGentle,
    springStiff,
    // Tweens
    tweenSmooth,
    tweenQuick,
    tweenSlow,
    tweenLinear,
    // Specialized
    pageTransition,
    modalTransition,
    listTransition,
    layoutTransition,
    exitTransition,
    // Configs
    staggerTiming,
    delays,
    // Combined
    transitions,
    type TransitionPreset,
} from './transitions';

// ============================================================
// HOOKS
// ============================================================
export {
    useReducedMotion,
    useInViewAnimation,
    useStaggerChildren,
    useMounted,
    useAnimationSequence,
    useScrollProgress,
    useHoverAnimation,
} from './hooks';

// ============================================================
// ANIMATED PRIMITIVES
// ============================================================
export {
    // Page
    AnimatedPage,
    // List
    AnimatedList,
    AnimatedListItem,
    VirtualizedAnimatedItem,
    // Modal
    AnimatedModal,
    AnimatedModalContent,
    AnimatedModalHeader,
    AnimatedModalFooter,
    // Button
    AnimatedButton,
    AnimatedIconButton,
    // Card
    AnimatedCard,
    AnimatedRevealCard,
    AnimatedExpandCard,
    // Skeleton
    AnimatedSkeleton,
    SkeletonList,
    SkeletonCardGrid,
    // Tabs
    AnimatedTabs,
    AnimatedTabContent,
    // Feedback
    AnimatedCheckmark,
    AnimatedShake,
    AnimatedPulse,
    AnimatedCounter,
} from './primitives';

// Re-export motion for convenience
export { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
