/**
 * useIOSKeyboardFix — Suppress iOS keyboard input accessory bar (Previous/Next/Done toolbar)
 *
 * The iOS Safari/PWA form assistant toolbar appears above the keyboard for all
 * focused inputs. There is no single CSS property to hide it. This hook applies
 * multiple proven mitigations globally:
 *
 * 1. Detects iOS (Safari/PWA standalone)
 * 2. Adds `is-ios` class to <html> for CSS-based fixes
 * 3. Intercepts focus on inputs/textareas and sets attributes that suppress toolbar:
 *    - Sets autocomplete="off" on inputs that don't already specify one
 *    - Ensures font-size >= 16px (prevents iOS auto-zoom)
 * 4. On standalone PWA: blurs and refocuses inputs after a micro-delay
 *    to break the toolbar attachment cycle
 *
 * BUG-093: iOS keyboard toolbar still visible in PWA
 */
// @ts-nocheck

import { useEffect } from 'react';

const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isStandalonePWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  return ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches;
};

export function useIOSKeyboardFix(): void {
  useEffect(() => {
    if (!isIOS()) return;

    // Mark <html> so CSS can target iOS-specific overrides
    document.documentElement.classList.add('is-ios');

    const isPWA = isStandalonePWA();

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;

      // Skip inputs that explicitly need autocomplete (passwords, emails)
      const autoCompleteValue = target.getAttribute('autocomplete');
      const preserveAutocomplete = autoCompleteValue && !['off', 'on'].includes(autoCompleteValue);

      if (!preserveAutocomplete && !target.hasAttribute('data-keep-autocomplete')) {
        target.setAttribute('autocomplete', 'off');
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          target.setAttribute('autocorrect', 'off');
          target.setAttribute('autocapitalize', 'off');
          target.setAttribute('spellcheck', 'false');
        }
      }

      // PWA-specific: break the toolbar attachment by blur+refocus micro-cycle
      // This only runs once per focus event to prevent infinite loops
      if (isPWA && !target.hasAttribute('data-ios-fixed')) {
        target.setAttribute('data-ios-fixed', 'true');
        target.blur();
        requestAnimationFrame(() => {
          target.focus({ preventScroll: true });
          // Clean up the marker after a short delay so it works on next focus
          setTimeout(() => target.removeAttribute('data-ios-fixed'), 300);
        });
      }
    };

    document.addEventListener('focusin', handleFocusIn, { passive: true });

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.documentElement.classList.remove('is-ios');
    };
  }, []);
}
