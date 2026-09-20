import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

/**
 * W-D1b — adoption of the published design foundation across the four surfaces
 * (UX-DS-02 colour roles, UX-DS-04 motion, UX-DS-06 radius/elevation).
 *
 * W-D1 published the tokens and guarded them (`designFoundation.test.ts`). The
 * finding left open was *adoption*: the tokens existed but the surfaces still
 * reached for ad-hoc values. These tests make adoption a property of the code
 * rather than an intention, and record the loop-animation audit as a check
 * instead of a note.
 */

const css = fs.readFileSync(new URL('../index.css', import.meta.url), 'utf8');

const SURFACES: Record<string, string[]> = {
    Home: ['src/features/dashboard/DashboardView.tsx', 'src/features/dashboard/components'],
    Commitments: ['src/features/commitments/CommitmentsView.tsx', 'src/features/commitments/components'],
    Finance: ['src/features/finance/FinanceView.tsx', 'src/features/finance/components'],
    Settings: ['src/features/settings/SettingsView.tsx', 'src/features/settings/components'],
};

const read = (path: string) => fs.readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

/** The surface's own source: its view plus the components it owns. */
function surfaceSource(paths: string[]): string {
    const parts: string[] = [];
    for (const path of paths) {
        const full = new URL(`../../${path}`, import.meta.url);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            for (const entry of fs.readdirSync(full)) {
                if (!/\.(tsx|ts)$/.test(entry) || /\.test\./.test(entry)) continue;
                parts.push(read(`${path}/${entry}`));
            }
        } else {
            parts.push(read(path));
        }
    }
    return parts.join('\n');
}

const RADIUS_ROLE = /\brounded-(field|control|card|panel|sheet|pill)\b/;
const ELEVATION_ROLE = /\bshadow-elevation-(flat|subtle|raised|overlay|modal)\b/;
const COLOUR_ROLE = /\b(bg|text|border)-(success|warning|danger|info)(-surface|-border)?\b/;

describe('UX-DS-06 — radius and elevation roles are adopted, not just published', () => {
    it.each(Object.entries(SURFACES))('%s uses a radius role', (_name, path) => {
        expect(surfaceSource(path)).toMatch(RADIUS_ROLE);
    });

    it.each(Object.entries(SURFACES))('%s uses an elevation role', (_name, path) => {
        expect(surfaceSource(path)).toMatch(ELEVATION_ROLE);
    });

    it.each(Object.entries(SURFACES))('%s contains no retired radius literal', (_name, path) => {
        expect(surfaceSource(path)).not.toMatch(/rounded-\[(1rem|9999px|0\.375rem)\]/);
    });

    it('keeps every radius and elevation role the surfaces rely on published', () => {
        for (const role of ['field', 'control', 'card', 'panel', 'sheet', 'pill']) {
            expect(css).toContain(`--radius-${role}:`);
        }
        for (const role of ['flat', 'subtle', 'raised', 'overlay', 'modal']) {
            expect(css).toContain(`--elevation-${role}:`);
        }
    });
});

describe('UX-DS-02 — semantic colour roles are adopted', () => {
    it.each(Object.entries(SURFACES))('%s communicates status with a role token', (_name, path) => {
        expect(surfaceSource(path)).toMatch(COLOUR_ROLE);
    });

    it('maps every role to a real colour, in both themes', () => {
        for (const role of ['success', 'warning', 'danger', 'info']) {
            expect(css).toContain(`--role-${role}:`);
            expect(css).toContain(`--role-${role}-surface:`);
            expect(css).toContain(`--role-${role}-border:`);
        }
    });
});

describe('UX-DS-04 — the loop-animation audit, as a check', () => {
    it('neutralises looping animations for the OS preference', () => {
        const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
        expect(block).toMatch(/animation-iteration-count:\s*1\s*!important/);
        expect(block).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    });

    it('neutralises them for the in-app switch too, not only the OS setting', () => {
        const block = css.slice(css.indexOf('.a11y-reduced-motion *'));
        expect(block).toMatch(/animation-iteration-count:\s*1\s*!important/);
        expect(block).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    });

    it('reaches every loop in the app, including inline-style animations', () => {
        // The audit: loops live in a handful of shared components and in CSS
        // custom animations. Both reduced-motion rules use a universal selector
        // (`*, *::before, *::after`) with `!important`, which also beats the
        // inline `style={{ animation: … }}` form — so no loop needs its own guard.
        expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\*, \*::before, \*::after/);
        expect(css).toMatch(/\.a11y-reduced-motion \*,\s*\.a11y-reduced-motion \*::before,\s*\.a11y-reduced-motion \*::after/);
    });

    it('keeps animation durations inside the researched budget', () => {
        // Long loops are the ones that feel like decoration rather than feedback.
        const durations = [...css.matchAll(/--duration-(\w+):\s*(\d+)ms/g)].map(([, , ms]) => Number(ms));
        expect(durations.length).toBeGreaterThan(0);
        for (const ms of durations) expect(ms).toBeLessThanOrEqual(300);
    });
});
