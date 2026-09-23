/**
 * Motion contract — ONE source of truth (UX-DS-04).
 *
 * Sourced rules from the research (NN/g "The Role of Animation and Motion in UX"):
 * motion "must be unobtrusive, brief, and subtle"; it is appropriate as *feedback*
 * for microinteractions "rather than to induce delight or entertain users"; and
 * motion used to hijack attention or create fear of loss is a **dark pattern**.
 *
 * Therefore this module allows exactly three purposes and bans the rest:
 *   - `feedback`            the system registered an action
 *   - `stateChange`         something is now different (done ⇄ not done)
 *   - `spatialContinuity`   a sheet/panel comes from where it belongs
 *
 * Anything else — entrance animations that delay reading, looping decoration,
 * urgency pulses — is out of contract. Durations must stay inside the budget,
 * which the invariant test enforces against `src/index.css`.
 */

/** Durations in ms. Keep in sync with the `--duration-*` tokens in index.css. */
export const MOTION = {
    /** Button/row/checkbox feedback. */
    micro: 140,
    /** Sheets, panels, expanding rows. */
    sheet: 200,
    /** A balance or number changing. */
    balance: 250,
    /** Hard ceiling — nothing in the product may animate longer. */
    max: 300,
} as const;

export const EASING = {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

type MotionPurpose = 'feedback' | 'stateChange' | 'spatialContinuity';

const ALLOWED_PURPOSES: readonly MotionPurpose[] = ['feedback', 'stateChange', 'spatialContinuity'];

/** True when the purpose is inside the contract (used by tests and reviews). */
export function isAllowedPurpose(purpose: string): purpose is MotionPurpose {
    return (ALLOWED_PURPOSES as readonly string[]).includes(purpose);
}

/**
 * Reduced motion is honoured from BOTH sources:
 *   - the OS/browser preference `prefers-reduced-motion: reduce`
 *   - the in-app accessibility switch (`.a11y-reduced-motion` on the root)
 */
function prefersReducedMotion(doc: Document | undefined = typeof document === 'undefined' ? undefined : document): boolean {
    if (!doc) return false;
    try {
        if (typeof doc.defaultView?.matchMedia === 'function'
            && doc.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return true;
        }
    } catch {
        /* matchMedia can throw in exotic webviews — fall through to the class check */
    }
    return doc.documentElement?.classList.contains('a11y-reduced-motion') ?? false;
}

/** The duration to actually use: the budget, or 0 when motion is reduced. */
export function durationFor(reason: keyof typeof MOTION, doc?: Document): number {
    if (prefersReducedMotion(doc)) return 0;
    return MOTION[reason];
}

/** Guard for reviews/tests: is this duration inside the ceiling? */
export function withinBudget(ms: number): boolean {
    return Number.isFinite(ms) && ms >= 0 && ms <= MOTION.max;
}
