import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useAccessibility } from './useAccessibility';

describe('useAccessibility', () => {
  const root = document.documentElement;

  afterEach(() => {
    root.className = '';
  });

  it('adds the large font class when fontSize is "large"', () => {
    renderHook(() => useAccessibility({ fontSize: 'large', highContrast: false, reducedMotion: false }));
    expect(root.classList.contains('a11y-font-large')).toBe(true);
  });

  it('adds the xl font class when fontSize is "xl"', () => {
    renderHook(() => useAccessibility({ fontSize: 'xl', highContrast: false, reducedMotion: false }));
    expect(root.classList.contains('a11y-font-xl')).toBe(true);
  });

  it('does not add any font class when fontSize is "default"', () => {
    renderHook(() => useAccessibility({ fontSize: 'default', highContrast: false, reducedMotion: false }));
    expect(root.classList.contains('a11y-font-large')).toBe(false);
    expect(root.classList.contains('a11y-font-xl')).toBe(false);
  });

  it('adds the high-contrast class when highContrast is true', () => {
    renderHook(() => useAccessibility({ fontSize: 'default', highContrast: true, reducedMotion: false }));
    expect(root.classList.contains('a11y-high-contrast')).toBe(true);
  });

  it('does not add the high-contrast class when highContrast is false', () => {
    renderHook(() => useAccessibility({ fontSize: 'default', highContrast: false, reducedMotion: false }));
    expect(root.classList.contains('a11y-high-contrast')).toBe(false);
  });

  it('adds the reduced-motion class when reducedMotion is true', () => {
    renderHook(() => useAccessibility({ fontSize: 'default', highContrast: false, reducedMotion: true }));
    expect(root.classList.contains('a11y-reduced-motion')).toBe(true);
  });

  it('does not add the reduced-motion class when reducedMotion is false', () => {
    renderHook(() => useAccessibility({ fontSize: 'default', highContrast: false, reducedMotion: false }));
    expect(root.classList.contains('a11y-reduced-motion')).toBe(false);
  });

  it('removes previous font class when font size changes', () => {
    root.classList.add('a11y-font-large');
    renderHook(() => useAccessibility({ fontSize: 'xl', highContrast: false, reducedMotion: false }));
    expect(root.classList.contains('a11y-font-large')).toBe(false);
    expect(root.classList.contains('a11y-font-xl')).toBe(true);
  });

  it('removes all classes on cleanup', () => {
    const { unmount } = renderHook(() =>
      useAccessibility({ fontSize: 'large', highContrast: true, reducedMotion: true }),
    );

    unmount();

    expect(root.classList.contains('a11y-font-large')).toBe(false);
    expect(root.classList.contains('a11y-high-contrast')).toBe(false);
    expect(root.classList.contains('a11y-reduced-motion')).toBe(false);
  });

  it('applies no classes when prefs is undefined', () => {
    renderHook(() => useAccessibility(undefined));
    expect(root.classList.contains('a11y-font-large')).toBe(false);
    expect(root.classList.contains('a11y-font-xl')).toBe(false);
    expect(root.classList.contains('a11y-high-contrast')).toBe(false);
    expect(root.classList.contains('a11y-reduced-motion')).toBe(false);
  });
});
