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
        for (const token of ['--surface-base', '--surface-raised', '--surface-sunken', '--text-primary', '--text-muted']) {
            expect(occurrences(`${token}:`), token).toBeGreaterThanOrEqual(2);
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
