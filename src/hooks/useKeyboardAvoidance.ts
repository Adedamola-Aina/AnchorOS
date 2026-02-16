/**
 * useKeyboardAvoidance - Hook to handle iOS virtual keyboard covering inputs
 * 
 * BUG-002 Fix: Uses visualViewport API to detect keyboard presence
 * and scroll focused elements into view.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
 */
// @ts-nocheck


import { useState, useEffect, useCallback, useRef } from 'react';

interface KeyboardAvoidanceState {
    /** Whether the virtual keyboard is currently visible */
    isKeyboardVisible: boolean;
    /** Height of the keyboard in pixels */
    keyboardHeight: number;
    /** Scroll the currently focused element into view */
    scrollActiveElementIntoView: () => void;
}

// Minimum height difference to consider as keyboard (100px threshold)
const KEYBOARD_THRESHOLD = 100;

export function useKeyboardAvoidance(): KeyboardAvoidanceState {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const initialHeightRef = useRef<number>(typeof window !== 'undefined' ? window.innerHeight : 0);

    /**
     * Scroll the currently focused element into view
     * Uses smooth scrolling and accounts for keyboard height
     */
    const scrollActiveElementIntoView = useCallback(() => {
        const activeElement = document.activeElement as HTMLElement | null;

        if (activeElement && 'scrollIntoView' in activeElement) {
            // Use scrollIntoView with block: 'center' to ensure visibility
            activeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        }
    }, []);

    useEffect(() => {
        const visualViewport = window.visualViewport;

        // If visualViewport API is not supported, return early
        if (!visualViewport) {
            return;
        }

        const handleResize = () => {
            const currentHeight = visualViewport.height;
            const heightDifference = initialHeightRef.current - currentHeight;

            if (heightDifference > KEYBOARD_THRESHOLD) {
                // Keyboard is visible
                setIsKeyboardVisible(true);
                setKeyboardHeight(heightDifference);

                // Auto-scroll focused element into view
                // Use setTimeout to allow layout to settle
                setTimeout(() => {
                    scrollActiveElementIntoView();
                }, 100);
            } else {
                // Keyboard is hidden or change is too small
                setIsKeyboardVisible(false);
                setKeyboardHeight(0);
            }
        };

        visualViewport.addEventListener('resize', handleResize);

        return () => {
            visualViewport.removeEventListener('resize', handleResize);
        };
    }, [scrollActiveElementIntoView]);

    return {
        isKeyboardVisible,
        keyboardHeight,
        scrollActiveElementIntoView,
    };
}

export default useKeyboardAvoidance;
