/**
 * useAccessibility - Applies accessibility preferences to the document root.
 * Sets CSS classes for font-size scaling, high-contrast, and reduced-motion.
 */

import { useEffect } from 'react';
import type { AccessibilityPreferences } from '../features/settings/components/AccessibilityControls';

const FONT_SIZE_MAP: Record<AccessibilityPreferences['fontSize'], string> = {
  default: '',
  large: 'a11y-font-large',
  xl: 'a11y-font-xl',
};

export function useAccessibility(prefs?: AccessibilityPreferences): void {
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    Object.values(FONT_SIZE_MAP).filter(Boolean).forEach((c) => root.classList.remove(c));
    const fontClass = FONT_SIZE_MAP[prefs?.fontSize || 'default'];
    if (fontClass) root.classList.add(fontClass);

    // High contrast
    root.classList.toggle('a11y-high-contrast', !!prefs?.highContrast);

    // Reduced motion
    root.classList.toggle('a11y-reduced-motion', !!prefs?.reducedMotion);

    return () => {
      Object.values(FONT_SIZE_MAP).filter(Boolean).forEach((c) => root.classList.remove(c));
      root.classList.remove('a11y-high-contrast', 'a11y-reduced-motion');
    };
  }, [prefs?.fontSize, prefs?.highContrast, prefs?.reducedMotion]);
}
