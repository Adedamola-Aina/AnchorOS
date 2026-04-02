/**
 * ENG-006 — Tailwind config ESM migration guard.
 * Verifies the config is valid ESM and exports all required design tokens
 * so a future CommonJS regression is caught immediately.
 */
import { describe, it, expect } from 'vitest';
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
