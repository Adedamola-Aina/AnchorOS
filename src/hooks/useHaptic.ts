/**
 * useHaptic - Centralized haptic feedback hook
 * 
 * Provides consistent haptic patterns across the app for key interactions.
 * Uses the Navigator Vibration API with graceful fallback.
 * 
 * Patterns are designed following Calm Computing philosophy:
 * - Light: subtle confirmation (e.g., button press)
 * - Medium: standard feedback (e.g., selection change)
 * - Heavy: important action (e.g., destructive action)
 * - Error: failure notification
 * - Success: completion confirmation
 * 
 * @module hooks/useHaptic
 */
// @ts-nocheck


import { useCallback, useMemo } from 'react';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'error' | 'success';

interface HapticOptions {
    /** Whether haptic feedback is enabled. Default: true */
    enabled?: boolean;
}

interface HapticResult {
    /** Trigger a haptic pattern */
    trigger: (pattern: HapticPattern) => void;
    /** Whether haptic is enabled */
    isEnabled: boolean;
    /** Whether the device supports vibration */
    isSupported: boolean;
}

// Pattern definitions (in milliseconds)
const PATTERNS: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 25,
    heavy: 50,
    error: [50, 50, 50, 50, 50], // Triple pulse for error
    success: [15, 50, 15], // Double tap for success
};

export function useHaptic(options: HapticOptions = {}): HapticResult {
    const { enabled = true } = options;

    const isSupported = useMemo(() => {
        return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
    }, []);

    const trigger = useCallback(
        (pattern: HapticPattern) => {
            if (!enabled || !isSupported) return;

            try {
                navigator.vibrate(PATTERNS[pattern]);
            } catch {
                // Silently fail if vibration fails
                // This can happen on some browsers/devices
            }
        },
        [enabled, isSupported]
    );

    return useMemo(() => ({
        trigger,
        isEnabled: enabled,
        isSupported,
    }), [trigger, enabled, isSupported]);
}
