/**
 * UX-040 — Native Tailwind v4 CSS-first rewrite integrity guards.
 *
 * Tokens (colors, font family, animations) now live in @theme in src/index.css.
 * Dark mode is configured via @variant dark — no JS config dependency.
 * These tests ensure regressions to the JS-config era are caught immediately.
 *
 * BUG-127 / BUG-128 guards retained:
 * - .glass-card must never use @apply (v4 optimizer dedup risk)
 * - --glass-border in light mode must never be white-on-white
 * - global border-color default (gray-200) must be present
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const css = readFileSync(resolve(__dirname, '../../src/index.css'), 'utf-8');

/* ─── v4 CSS-first structure ────────────────────────────── */

describe('UX-040 — Tailwind v4 CSS-first structure', () => {
  it('uses @import "tailwindcss" as the entry point', () => {
    expect(css).toContain('@import "tailwindcss"');
  });

  it('configures dark mode via @variant, not JS config', () => {
    expect(css).toContain('@variant dark');
    expect(css).not.toContain('@config');
  });

  it('defines design tokens in @theme block', () => {
    expect(css).toContain('@theme {');
  });

  it('specifies content sources via @source directives', () => {
    expect(css).toContain('@source');
  });
});

/* ─── Brand color palette ───────────────────────────────── */

describe('UX-040 — Brand color tokens in @theme', () => {
  it('defines all primary (Anchor Blue) shades', () => {
    expect(css).toContain('--color-primary-600: #2563eb');
    expect(css).toContain('--color-primary-500: #3b82f6');
    expect(css).toContain('--color-primary-50:');
    expect(css).toContain('--color-primary-900: #1e3a8a');
  });

  it('defines all finance (Money Green) shades', () => {
    expect(css).toContain('--color-finance-600: #16a34a');
    expect(css).toContain('--color-finance-500: #22c55e');
  });

  it('defines all task (Action Purple) shades', () => {
    expect(css).toContain('--color-task-600: #9333ea');
    expect(css).toContain('--color-task-500: #a855f7');
  });

  it('defines all family (Warm Coral) shades', () => {
    expect(css).toContain('--color-family-600: #ea580c');
    expect(css).toContain('--color-family-500: #f97316');
  });
});

/* ─── Typography + font ─────────────────────────────────── */

describe('UX-040 — Typography tokens in @layer components', () => {
  it('defines heading sizes with bundled font-weight', () => {
    expect(css).toContain('.text-h1');
    expect(css).toContain('.text-h2');
    expect(css).toContain('.text-h3');
    expect(css).toContain('.text-display');
    expect(css).toContain('.text-body');
    expect(css).toContain('.text-small');
  });

  it('defines native system font family in @theme', () => {
    expect(css).toContain('--font-family-sans:');
    expect(css).toContain('-apple-system');
    expect(css).toContain('Roboto');
  });
});

/* ─── Custom animations ─────────────────────────────────── */

describe('UX-040 — Animation tokens in @theme', () => {
  it('defines nautical loading animation tokens', () => {
    expect(css).toContain('--animate-anchor-bob:');
    expect(css).toContain('--animate-compass-spin:');
    expect(css).toContain('--animate-sonar:');
    expect(css).toContain('--animate-tide-bar:');
  });

  it('defines UI animation tokens', () => {
    expect(css).toContain('--animate-pulse-slow:');
    expect(css).toContain('--animate-ring-glow:');
    expect(css).toContain('--animate-spin-slow:');
    expect(css).toContain('--animate-pulse-fast:');
  });

  it('includes keyframe definitions', () => {
    expect(css).toContain('@keyframes anchor-bob');
    expect(css).toContain('@keyframes sonar-ring');
    expect(css).toContain('@keyframes pulse-slow');
  });
});

/* ─── Glass component integrity (BUG-127 / BUG-128) ────── */

describe('BUG-127 / BUG-128 — Glass card regression guards', () => {
  it('.glass-card must not use @apply — plain CSS only', () => {
    const match = css.match(/\.glass-card\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    expect(match![1]).not.toContain('@apply');
  });

  it('.glass-card has background-color: var(--surface-2)', () => {
    const match = css.match(/\.glass-card\s*\{([^}]*)\}/);
    expect(match).not.toBeNull();
    expect(match![1]).toContain('background-color: var(--surface-2)');
  });

  it('light-mode --glass-border is not white-on-white', () => {
    const rootMatch = css.match(/:root\s*\{([^}]*)\}/s);
    expect(rootMatch).not.toBeNull();
    const borderMatch = rootMatch![1].match(/--glass-border:\s*([^;]+);/);
    expect(borderMatch).not.toBeNull();
    expect(borderMatch![1].trim()).not.toMatch(/rgba\(\s*255\s*,\s*255\s*,\s*255/);
  });

  it('restores Tailwind v3 border-color default (gray-200)', () => {
    expect(css).toContain('#e5e7eb');
  });
});
