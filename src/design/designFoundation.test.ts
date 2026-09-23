import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { MOTION, EASING, isAllowedPurpose, durationFor, withinBudget } from './motion';
import { HAPTIC_INTENTS, patternForIntent, FORBIDDEN_HAPTIC_MOMENTS, SOUND_DEFAULT_ENABLED } from './haptics';

const css = fs.readFileSync(new URL('../index.css', import.meta.url), 'utf8');

/** Minimal Document stand-in for the reduced-motion helper. */
function fakeDoc(osPrefersReduced: boolean, rootClasses = ''): Document {
    return {
        defaultView: { matchMedia: () => ({ matches: osPrefersReduced }) },
        documentElement: { classList: { contains: (c: string) => rootClasses.includes(c) } },
    } as unknown as Document;
}

describe('motion budget (UX-DS-04)', () => {
    it('keeps every duration inside the researched ceiling', () => {
        expect(MOTION.max).toBeLessThanOrEqual(300);
        for (const duration of [MOTION.micro, MOTION.sheet, MOTION.balance]) {
            expect(withinBudget(duration)).toBe(true);
            expect(duration).toBeLessThanOrEqual(MOTION.max);
        }
        expect(withinBudget(900)).toBe(false);
    });

    it('allows exactly the three contract purposes and rejects delight/entrance/urgency', () => {
        expect(isAllowedPurpose('feedback')).toBe(true);
        expect(isAllowedPurpose('stateChange')).toBe(true);
        expect(isAllowedPurpose('spatialContinuity')).toBe(true);
        expect(isAllowedPurpose('delight')).toBe(false);
        expect(isAllowedPurpose('entrance')).toBe(false);
        expect(isAllowedPurpose('urgency')).toBe(false);
    });

    it('returns zero duration when the OS preference OR the in-app switch asks for less motion', () => {
        expect(durationFor('sheet', fakeDoc(true))).toBe(0);
        expect(durationFor('sheet', fakeDoc(false, 'a11y-reduced-motion'))).toBe(0);
        expect(durationFor('sheet', fakeDoc(false))).toBe(MOTION.sheet);
    });

    it('keeps the CSS tokens in step with the module (one source of truth, enforced)', () => {
        expect(css).toMatch(new RegExp(`--duration-micro:\\s*${MOTION.micro}ms`));
        expect(css).toMatch(new RegExp(`--duration-sheet:\\s*${MOTION.sheet}ms`));
        expect(css).toMatch(new RegExp(`--duration-balance:\\s*${MOTION.balance}ms`));
        expect(css).toContain(EASING.standard);
    });

    it('honours the OS preference in CSS, not only the in-app switch', () => {
        expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    });
});

describe('sensory intents (UX-DS-05)', () => {
    it('maps intents to patterns so callers never pass raw patterns', () => {
        expect(patternForIntent('taskComplete')).toBe('success');
        expect(patternForIntent('taskUncomplete')).toBe('light');
        expect(patternForIntent('recordSaved')).toBe('success');
        expect(patternForIntent('destructiveConfirm')).toBe('heavy');
        expect(patternForIntent('validationError')).toBe('error');
    });

    it('covers every declared intent and keeps sound off by default', () => {
        for (const intent of Object.keys(HAPTIC_INTENTS)) {
            expect(patternForIntent(intent as keyof typeof HAPTIC_INTENTS)).toBeTruthy();
        }
        expect(SOUND_DEFAULT_ENABLED).toBe(false);
        expect(FORBIDDEN_HAPTIC_MOMENTS).toContain('navigation');
        expect(FORBIDDEN_HAPTIC_MOMENTS).toContain('decoration');
    });
});

describe('semantic role tokens (UX-DS-02 / UX-DS-03)', () => {
    const ROLES = ['success', 'warning', 'danger', 'info'] as const;

    it('defines every role for light AND dark, so dark parity cannot be forgotten', () => {
        const occurrences = (token: string) => (css.match(new RegExp(token, 'g')) ?? []).length;
        for (const role of ROLES) {
            for (const suffix of ['', '-surface', '-border']) {
                // Declared at least twice: once on :root (light), once on .dark.
                // Counting beats slice-based block matching, which is brittle
                // because the file contains earlier `.dark` selectors.
                expect(occurrences(`--role-${role}${suffix}:`), `--role-${role}${suffix}`).toBeGreaterThanOrEqual(2);
            }
        }
        for (const token of [
            // Radix-style 12-step aliases: every role must exist in
            // BOTH themes, so a new alias cannot be added light-only.
            '--surface-base', '--surface-raised', '--surface-hover', '--surface-active',
            '--surface-sunken', '--surface-border',
            '--border-subtle', '--border-interactive', '--focus-ring',
            '--solid', '--solid-hover',
            '--text-primary', '--text-secondary', '--text-muted',
        ]) {
            expect(occurrences(`${token}:`), token).toBeGreaterThanOrEqual(2);
        }
    });

    it('exposes every alias as a utility, so components never need raw palette classes', () => {
        for (const [utility, source] of [
            ['--color-surface-hover', '--surface-hover'],
            ['--color-surface-active', '--surface-active'],
            ['--color-border-subtle', '--border-subtle'],
            ['--color-border-interactive', '--border-interactive'],
            ['--color-focus-ring', '--focus-ring'],
            ['--color-solid', '--solid'],
            ['--color-solid-hover', '--solid-hover'],
        ]) {
            expect(css).toMatch(new RegExp(`${utility}:\\s*var\\(${source}\\)`));
        }
    });

    it('exposes roles and surfaces as utilities through @theme', () => {
        expect(css).toMatch(/--color-success:\s*var\(--role-success\)/);
        expect(css).toMatch(/--color-danger-surface:\s*var\(--role-danger-surface\)/);
        expect(css).toMatch(/--color-surface-base:\s*var\(--surface-base\)/);
        expect(css).toMatch(/--color-text-muted:\s*var\(--text-muted\)/);
    });

    it('provides exactly one money-numeral utility (UX-DS-03)', () => {
        expect(css).toMatch(/\.money\s*\{[^}]*font-variant-numeric:\s*tabular-nums/);
    });
});
describe('geometry, elevation and spacing scale (UX-DS-06)', () => {
    const RADIUS_ROLES = ['field', 'control', 'card', 'panel', 'sheet', 'pill'];
    const ELEVATION_ROLES = ['flat', 'subtle', 'raised', 'overlay', 'modal'];
    const SPACING_ROLES = [
        // inset = padding inside a container
        'inset-tight', 'inset', 'inset-roomy',
        // stack = vertical rhythm between blocks
        'stack-tight', 'stack', 'stack-roomy', 'stack-section',
        // inline = horizontal gap
        'inline-tight', 'inline', 'inline-roomy',
        // row heights, from reference rule R1
        'row-compact', 'row-standard', 'row-comfortable',
    ];

    const occurrences = (token: string) => (css.match(new RegExp(token, 'g')) ?? []).length;

    it('publishes one radius family, so no component invents its own corner', () => {
        for (const role of RADIUS_ROLES) {
            expect(css, `--radius-${role}`).toMatch(new RegExp(`--radius-${role}:\\s*[\\d.]+(rem|px)`));
        }
    });

    it('publishes one spacing rhythm on three axes of at least three steps each', () => {
        for (const role of SPACING_ROLES) {
            expect(css, `--spacing-${role}`).toMatch(new RegExp(`--spacing-${role}:\\s*[\\d.]+(rem|px)`));
        }
        // A fourth step per axis is a decision nobody owns, so the rhythm stays short.
        for (const axis of ['inset', 'stack', 'inline']) {
            const steps = SPACING_ROLES.filter((role) => role === axis || role.startsWith(`${axis}-`));
            expect(steps.length, axis).toBeGreaterThanOrEqual(3);
        }
    });

    it('keeps the R1 row heights inside the 44–56px band the references show', () => {
        for (const [role, expected] of [['row-compact', 44], ['row-standard', 48], ['row-comfortable', 56]] as const) {
            expect(css, role).toMatch(new RegExp(`--spacing-${role}:\\s*${expected}px`));
            expect(expected).toBeGreaterThanOrEqual(44);
            expect(expected).toBeLessThanOrEqual(56);
        }
    });

    it('defines every elevation role for light AND dark, so dark parity cannot be forgotten', () => {
        for (const role of ELEVATION_ROLES) {
            // Declared at least twice: once on :root (light), once on .dark.
            expect(occurrences(`--elevation-${role}:`), role).toBeGreaterThanOrEqual(2);
        }
    });

    it('exposes every elevation role as a utility through @theme', () => {
        for (const role of ELEVATION_ROLES) {
            expect(css).toMatch(new RegExp(`--shadow-elevation-${role}:\\s*var\\(--elevation-${role}\\)`));
        }
    });

    it('retires the ad-hoc radius literals the scale replaces', () => {
        // A literal 1rem card corner next to a 0.375rem field fallback was
        // the original evidence for UX-DS-06 — neither may come back.
        expect(css).not.toMatch(/border-radius:\s*1rem\b/);
        expect(css).not.toMatch(/border-radius:\s*9999px\b/);
        expect(css).not.toMatch(/var\(--radius-md,\s*0\.375rem\)/);
    });
});
