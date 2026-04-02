/**
 * ENG-006 — Tailwind config ESM migration guard.
 * Verifies the config is valid ESM and exports all required design tokens
 * so a future CommonJS regression is caught immediately.
 *
 * BUG-127 — glass-card @apply conflict guard.
 * In Tailwind v4, when @apply generates a CSS property AND an explicit
 * identical property exists in the same @layer rule, v4's optimizer drops
 * the explicit one. .glass-card must NOT have bg-[var(--glass-bg)] in @apply
 * or it silently overwrites the background-color: var(--surface-2) solid fill,
 * making cards invisible against the page background in light mode.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import tailwindConfig from '../../config/tailwind.config.js';

describe('tailwind.config ESM integrity (ENG-006)', () => {
  it('exports a default object (not a CommonJS module.exports stub)', () => {
    expect(tailwindConfig).toBeDefined();
    expect(typeof tailwindConfig).toBe('object');
  });

  it('preserves darkMode class strategy', () => {
    expect(tailwindConfig.darkMode).toBe('class');
  });

  it('exports all semantic brand color palettes', () => {
    const { colors } = tailwindConfig.theme.extend;
    expect(colors.primary).toBeDefined();
    expect(colors.finance).toBeDefined();
    expect(colors.task).toBeDefined();
    expect(colors.family).toBeDefined();
    // Spot-check key shades used across the codebase
    expect(colors.primary[600]).toBe('#2563eb');
    expect(colors.finance[600]).toBe('#16a34a');
    expect(colors.task[600]).toBe('#9333ea');
    expect(colors.family[600]).toBe('#ea580c');
  });

  it('exports all semantic font size tokens', () => {
    const { fontSize } = tailwindConfig.theme.extend;
    expect(fontSize.h1).toBeDefined();
    expect(fontSize.h2).toBeDefined();
    expect(fontSize.h3).toBeDefined();
    expect(fontSize.display).toBeDefined();
    expect(fontSize.body).toBeDefined();
    expect(fontSize.small).toBeDefined();
  });

  it('exports native system font stack', () => {
    const { fontFamily } = tailwindConfig.theme.extend;
    expect(fontFamily.sans).toContain('-apple-system');
    expect(fontFamily.sans).toContain('Roboto');
  });

  it('does not include CommonJS plugin entries (tailwindcss-animate moved to @plugin in CSS)', () => {
    // The plugins array should be absent; tailwindcss-animate is now in src/index.css via @plugin
    expect(tailwindConfig.plugins).toBeUndefined();
  });
});

describe('index.css component layer integrity (BUG-127)', () => {
  const indexCss = readFileSync(resolve(__dirname, '../../src/index.css'), 'utf-8');

  it('.glass-card @apply must not include bg-[var(--glass-bg)] — causes v4 optimizer to drop background-color:var(--surface-2)', () => {
    // Extract the .glass-card rule block from the CSS source
    const glasscardMatch = indexCss.match(/\.glass-card\s*\{([^}]*)\}/);
    expect(glasscardMatch).not.toBeNull();
    const glasscardRule = glasscardMatch![1];
    // bg-[var(--glass-bg)] in @apply conflicts with the explicit background-color: var(--surface-2)
    // override and causes v4 to silently drop the surface-2 value, making cards invisible.
    expect(glasscardRule).not.toContain('bg-[var(--glass-bg)]');
  });

  it('.glass-card rule has explicit background-color: var(--surface-2)', () => {
    const glasscardMatch = indexCss.match(/\.glass-card\s*\{([^}]*)\}/);
    expect(glasscardMatch).not.toBeNull();
    const glasscardRule = glasscardMatch![1];
    expect(glasscardRule).toContain('background-color: var(--surface-2)');
  });
});
