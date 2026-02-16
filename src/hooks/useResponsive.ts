/**
 * useResponsive - Single source of truth for device detection
 * 
 * This hook provides reactive breakpoint detection for adaptive UI patterns.
 * Use this instead of CSS-only media queries when you need JS-driven layout decisions.
 * 
 * Breakpoints align with Tailwind defaults:
 * - mobile: < 768px (md breakpoint)
 * - tablet: 768px - 1023px
 * - desktop: >= 1024px (lg breakpoint)
 */
// @ts-nocheck


import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveState {
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    /** True for both mobile and tablet (< 1024px) */
    isTouchDevice: boolean;
}

export function useResponsive(): ResponsiveState {
    const [state, setState] = useState<ResponsiveState>(() => getResponsiveState());

    useEffect(() => {
        const handleResize = () => {
            setState(getResponsiveState());
        };

        // Use matchMedia for better performance than resize events
        const mobileQuery = window.matchMedia('(max-width: 767px)');
        const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

        // Modern browsers support addEventListener on matchMedia
        mobileQuery.addEventListener('change', handleResize);
        tabletQuery.addEventListener('change', handleResize);

        return () => {
            mobileQuery.removeEventListener('change', handleResize);
            tabletQuery.removeEventListener('change', handleResize);
        };
    }, []);

    return state;
}

/**
 * Calculates current responsive state based on window width.
 * SSR-safe: defaults to desktop when window is undefined.
 * 
 * @returns ResponsiveState object with breakpoint flags
 */
function getResponsiveState(): ResponsiveState {
    // SSR safety - default to desktop
    if (typeof window === 'undefined') {
        return {
            breakpoint: 'desktop',
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            isTouchDevice: false,
        };
    }

    const width = window.innerWidth;

    if (width < 768) {
        return {
            breakpoint: 'mobile',
            isMobile: true,
            isTablet: false,
            isDesktop: false,
            isTouchDevice: true,
        };
    }

    if (width < 1024) {
        return {
            breakpoint: 'tablet',
            isMobile: false,
            isTablet: true,
            isDesktop: false,
            isTouchDevice: true,
        };
    }

    return {
        breakpoint: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
    };
}

export default useResponsive;
