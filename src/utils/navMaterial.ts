/**
 * The bottom navigation's surface, as a variable — a STAGING-ONLY experiment.
 *
 * Why this exists: the navigation is 83px tall with a 34px device inset on an
 * iPhone, so 40% of the bar is its own home-indicator padding. The bar's fill is
 * `#ffffff` and the page is `#f8fafc` — a 1.05:1 ratio — so that 33px band reads as
 * empty dead space rather than as part of a bar. Measured with real
 * `Emulation.setSafeAreaInsetsOverride` insets in Chromium 153:
 *
 *   nav            769 → 852  (83px, bottom edge === viewport bottom)
 *   tab strip      770 → 819  (49px, the h-[49px] list)
 *   blank band     33px       (39.8% of the bar)
 *   nav fill       rgb(255,255,255) vs page rgb(248,250,252) = 1.05:1
 *
 * Darkening the divider (the previous attempt) only raises the *edge* to ~1.48:1;
 * it does nothing about the band. No opaque fill light enough to be a tab bar can
 * be distinguished from the page (slate-100 1.05:1, slate-200 1.18:1, slate-300
 * 1.42:1), which is why the two candidates below are "make the bar a material" and
 * "make the bar read as a raised plane" rather than more shade-of-white.
 *
 * This module is the state machine for trying them on a real device; `index.css`
 * owns the variants themselves. Nothing changes until someone chooses: with no
 * `data-nav-material` attribute the bar is exactly as shipped, which is what the
 * production bundle keeps. The probe that drives this is gated on an inline
 * build-time condition in `layouts/MainLayout.tsx` — see `utils/devSurface`.
 */

/** Every state of the experiment, in cycle order. */
export const NAV_MATERIALS = ['current', 'translucent', 'raised'] as const;

export type NavMaterial = (typeof NAV_MATERIALS)[number];

/** What the probe shows for each state. */
export const NAV_MATERIAL_LABELS: Record<NavMaterial, string> = {
    current: 'today: opaque white',
    translucent: 'A: glass',
    raised: 'B: raised',
};

/** Where the choice is remembered, so a reload does not lose it. */
export const NAV_MATERIAL_STORAGE_KEY = 'anchor:nav-material';

/** The attribute `index.css` selects on. */
export const NAV_MATERIAL_ATTRIBUTE = 'data-nav-material';

/** The minimum of the Storage API this module needs (so tests need no DOM). */
interface StorageLike {
    getItem(key: string): string | null;
    setItem?(key: string, value: string): void;
}

/** The minimum of an element this module needs (so tests need no DOM). */
interface AttributeTarget {
    setAttribute(name: string, value: string): void;
}

/** Narrow an arbitrary string (e.g. from storage) to a known state. */
export function isNavMaterial(value: unknown): value is NavMaterial {
    return typeof value === 'string' && (NAV_MATERIALS as readonly string[]).includes(value);
}

/**
 * The remembered state, or `'current'`.
 *
 * Defaulting to `'current'` is the whole safety property: a missing, unreadable or
 * unrecognised value must leave the shipped bar untouched rather than pick a
 * candidate by accident.
 */
export function readNavMaterial(storage?: StorageLike | null): NavMaterial {
    if (!storage) return 'current';
    try {
        const stored = storage.getItem(NAV_MATERIAL_STORAGE_KEY);
        return isNavMaterial(stored) ? stored : 'current';
    } catch {
        // Private mode, disabled storage, a hostile origin: fall back to shipped.
        return 'current';
    }
}

/** Remember a state. Best-effort: a read-only Storage must not break the switch. */
export function writeNavMaterial(material: NavMaterial, storage?: StorageLike | null): void {
    if (!storage?.setItem) return;
    try {
        storage.setItem(NAV_MATERIAL_STORAGE_KEY, material);
    } catch {
        /* nothing to do — the in-memory state is still applied for this session */
    }
}

/**
 * Publish the state where `index.css` can see it.
 *
 * `'current'` is written like any other value and matches NO rule in `index.css` —
 * the shipped bar is the absence of a variant, not a third variant that has to be
 * kept identical to it. That is also why an absent attribute is safe: nothing
 * applies either way.
 */
export function applyNavMaterial(material: NavMaterial, target?: AttributeTarget | null): void {
    target?.setAttribute(NAV_MATERIAL_ATTRIBUTE, material);
}

/** The next state in the cycle. */
export function nextNavMaterial(current: NavMaterial): NavMaterial {
    const index = NAV_MATERIALS.indexOf(current);
    return NAV_MATERIALS[(index + 1) % NAV_MATERIALS.length];
}