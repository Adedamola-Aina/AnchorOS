/**
 * Animation Hooks - Custom Framer Motion Hooks
 * 
 * Reusable hooks for common animation patterns.
 * 
 * Usage:
 *   import { useStaggerChildren, useReducedMotion } from '@anchor-os/design-system/animations';
 */

import { useEffect, useState, useRef } from 'react';
import { useReducedMotion as useFramerReducedMotion, useInView } from 'framer-motion';

// ============================================================
// REDUCED MOTION HOOK
// ============================================================

/**
 * Check if user prefers reduced motion
 * Returns true if animations should be disabled/simplified
 */
export function useReducedMotion(): boolean {
    const prefersReduced = useFramerReducedMotion();
    return prefersReduced ?? false;
}

// ============================================================
// IN VIEW ANIMATION HOOK
// ============================================================

interface UseInViewAnimationOptions {
    /** Only animate once when coming into view */
    once?: boolean;
    /** Margin around the element for triggering */
    margin?: string;
    /** Amount of element that must be visible (0-1) */
    amount?: number | 'some' | 'all';
}

/**
 * Animate elements when they come into view
 * Returns controls and ref to apply to element
 */
export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
    const { once = true, margin = '-50px', amount = 0.3 } = options;
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin, amount });

    return {
        ref,
        isInView,
        animationState: isInView ? 'visible' : 'hidden',
    };
}

// ============================================================
// STAGGER CHILDREN HOOK
// ============================================================

interface UseStaggerChildrenOptions {
    /** Number of children to stagger */
    count: number;
    /** Delay between each child (seconds) */
    staggerDelay?: number;
    /** Initial delay before first child (seconds) */
    initialDelay?: number;
    /** Whether animation has started */
    enabled?: boolean;
}

/**
 * Get stagger delay for each child index
 * Useful for manual stagger control
 */
export function useStaggerChildren(options: UseStaggerChildrenOptions) {
    const { count, staggerDelay = 0.05, initialDelay = 0, enabled = true } = options;

    const getDelay = (index: number): number => {
        if (!enabled) return 0;
        return initialDelay + (index * staggerDelay);
    };

    const getTransition = (index: number) => ({
        delay: getDelay(index),
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
    });

    return {
        count,
        getDelay,
        getTransition,
        totalDuration: initialDelay + (count * staggerDelay),
    };
}

// ============================================================
// MOUNTED ANIMATION HOOK
// ============================================================

/**
 * Track mount state for exit animations
 * Returns true after first render
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    return mounted;
}

// ============================================================
// ANIMATION SEQUENCE HOOK
// ============================================================

interface AnimationStep {
    id: string;
    delay?: number;
    duration?: number;
}

/**
 * Orchestrate a sequence of animations
 */
export function useAnimationSequence(steps: AnimationStep[]) {
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    const startSequence = () => {
        let cumulativeDelay = 0;

        steps.forEach((step, index) => {
            const delay = step.delay ?? 0;
            cumulativeDelay += delay;

            setTimeout(() => {
                setCurrentStep(step.id);
                setCompletedSteps(prev => new Set([...prev, step.id]));
            }, cumulativeDelay * 1000);

            cumulativeDelay += step.duration ?? 0.3;
        });
    };

    const reset = () => {
        setCurrentStep(null);
        setCompletedSteps(new Set());
    };

    const isStepActive = (id: string) => currentStep === id;
    const isStepComplete = (id: string) => completedSteps.has(id);

    return {
        currentStep,
        completedSteps,
        startSequence,
        reset,
        isStepActive,
        isStepComplete,
    };
}

// ============================================================
// SCROLL PROGRESS HOOK
// ============================================================

/**
 * Track scroll progress of an element
 * Returns 0-1 value representing scroll position
 */
export function useScrollProgress() {
    const [progress, setProgress] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = rect.top;
            const elementHeight = rect.height;

            // Calculate progress (0 when entering view, 1 when fully passed)
            const startOffset = windowHeight;
            const endOffset = -elementHeight;
            const totalDistance = startOffset - endOffset;
            const currentPosition = startOffset - elementTop;

            const newProgress = Math.min(Math.max(currentPosition / totalDistance, 0), 1);
            setProgress(newProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { ref, progress };
}

// ============================================================
// HOVER ANIMATION HOOK
// ============================================================

/**
 * Track hover state with animation-friendly values
 */
export function useHoverAnimation() {
    const [isHovered, setIsHovered] = useState(false);

    const hoverProps = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    return {
        isHovered,
        hoverProps,
        animationState: isHovered ? 'hover' : 'idle',
    };
}
