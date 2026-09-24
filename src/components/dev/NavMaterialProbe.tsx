/**
 * NavMaterialProbe — a temporary, staging-only control for judging the bottom
 * navigation's surface on a real device.
 *
 * Why a control instead of two deploys: the candidates differ in how the bar's
 * 34px home-indicator band reads *while content is moving under it*. Two
 * environments cannot show that — they are two builds, two datasets and two
 * moments, and you cannot flip between them mid-scroll. One build with a switch
 * can, and it keeps production as an untouched control rather than a second
 * experiment.
 *
 * It is mounted behind an inline, build-time-folded condition in
 * `layouts/MainLayout.tsx`, so a production build emits no chunk for it at all —
 * the same rule the Settings → Developer Tools section follows (see
 * `utils/devSurface`). Its label is in `DEV_SURFACE_MARKERS` so the "never in a
 * production bundle" list names it.
 *
 * Delete this file, its test, the CSS block it drives in `index.css` and the two
 * lines in `MainLayout.tsx` once a surface has been chosen.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
    applyNavMaterial, nextNavMaterial, readNavMaterial, writeNavMaterial,
    NAV_MATERIAL_LABELS, type NavMaterial,
} from '../../utils/navMaterial';

/** The visible marker. Also listed in DEV_SURFACE_MARKERS. */
export const NAV_MATERIAL_PROBE_LABEL = 'NAV MATERIAL — STAGING ONLY';

/** Storage, or null where there is none (private mode, disabled storage). */
function browserStorage(): Storage | null {
    try {
        return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
        return null;
    }
}

export const NavMaterialProbe: React.FC = () => {
    const [material, setMaterial] = useState<NavMaterial>(() => readNavMaterial(browserStorage()));

    /*
     * Applied on mount as well as on change: the choice outlives a reload, so the
     * attribute has to be republished from storage before anything paints the bar.
     */
    useEffect(() => {
        applyNavMaterial(material, typeof document === 'undefined' ? null : document.documentElement);
    }, [material]);

    const cycle = useCallback(() => {
        setMaterial((current) => {
            const next = nextNavMaterial(current);
            writeNavMaterial(next, browserStorage());
            return next;
        });
    }, []);

    return (
        <button
            type="button"
            onClick={cycle}
            data-testid="nav-material-probe"
            data-nav-material-state={material}
            /*
             * Above the page, below every overlay: the sheets and dialogs sit at
             * z-50 and up, and this must never cover one.
             */
            className="fixed left-1/2 -translate-x-1/2 z-[45] px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-semibold tracking-wide shadow-lg backdrop-blur-sm max-w-[calc(100%-2rem)] truncate"
            /*
             * Sits just below the environment strip and the status bar — the same
             * two terms the app shell offsets itself by — so it never covers the
             * bar being judged, and never sits under the strip.
             */
            style={{ top: 'calc(var(--env-banner-height, 20px) + env(safe-area-inset-top, 0px) + 0.5rem)' }}
            aria-label={`${NAV_MATERIAL_PROBE_LABEL}. Tap to switch navigation surface. Currently ${NAV_MATERIAL_LABELS[material]}`}
        >
            {NAV_MATERIAL_PROBE_LABEL} · {NAV_MATERIAL_LABELS[material]}
        </button>
    );
};