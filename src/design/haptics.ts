/**
 * Sensory contract — haptics by INTENT, never by raw pattern (UX-DS-05).
 *
 * Research basis: Apple praised Denim for "custom haptics" and CapWords for a
 * sound that "helps the word stick" — sensory detail earns its place by
 * **informing**, not by entertaining. So:
 *   - haptics fire on state change and confirmation only;
 *   - NEVER on navigation, scroll or hover (that is noise, not information);
 *   - sound is off by default and must aid comprehension to be offered at all.
 *
 * Callers ask for an intent; the mapping to a physical pattern lives here, so a
 * change of feel is one edit rather than thirty.
 */

import type { HapticPattern } from '../hooks/useHaptic';

type HapticIntent =
    | 'taskComplete'
    | 'taskUncomplete'
    | 'recordSaved'
    | 'streakMilestone'
    | 'destructiveConfirm'
    | 'validationError';

/** Intent → pattern. Chosen so related actions feel related. */
export const HAPTIC_INTENTS: Record<HapticIntent, HapticPattern> = {
    taskComplete: 'success',
    taskUncomplete: 'light',
    recordSaved: 'success',
    streakMilestone: 'success',
    destructiveConfirm: 'heavy',
    validationError: 'error',
};

/** Intents that must never exist — kept as a test target, documented for reviews. */
export const FORBIDDEN_HAPTIC_MOMENTS: readonly string[] = [
    'navigation',
    'scroll',
    'hover',
    'idle',
    'decoration',
];

export function patternForIntent(intent: HapticIntent): HapticPattern {
    return HAPTIC_INTENTS[intent];
}

/** Sound is off by default. Nothing in the product plays audio today. */
export const SOUND_DEFAULT_ENABLED = false;
