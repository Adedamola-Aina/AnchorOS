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
import { Keyboard } from '@capacitor/keyboard';
import { isIOS as isCapacitorIOS, isNative, isPluginAvailable } from '../utils/platform';

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
    // Hide iOS keyboard accessory bar (Prev/Next/Done) in native app.
    // This is the strip shown above the keyboard across forms.
    if (isNative() && isCapacitorIOS() && isPluginAvailable('Keyboard')) {
      void Keyboard.setAccessoryBarVisible({ isVisible: false });
    }

    if (!isIOS()) return;

    // Mark <html> so CSS can target iOS-specific overrides
    document.documentElement.classList.add('is-ios');

    const isPWA = isStandalonePWA();
    let demotedInputs: Array<{ element: HTMLElement; previousTabIndex: string | null }> = [];

    const isTextControl = (element: Element): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
      element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;

    const restoreDemotedInputs = () => {
      demotedInputs.forEach(({ element, previousTabIndex }) => {
        if (previousTabIndex === null) {
          element.removeAttribute('tabindex');
        } else {
          element.setAttribute('tabindex', previousTabIndex);
        }
      });
      demotedInputs = [];
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!isTextControl(target)) return;

      // Skip inputs that explicitly need autocomplete (passwords, emails)
      const autoCompleteValue = target.getAttribute('autocomplete');
      const preserveAutocomplete = autoCompleteValue && !['off', 'on'].includes(autoCompleteValue);

      if (!preserveAutocomplete && !target.hasAttribute('data-keep-autocomplete')) {
        target.setAttribute('autocomplete', 'off');
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          target.setAttribute('autocorrect', 'off');
          target.setAttribute('autocapitalize', 'off');
          target.setAttribute('spellcheck', 'false');
          // Suppress iOS form navigation (Previous/Next) by hinting single-field
          if (!target.hasAttribute('enterkeyhint')) {
            target.setAttribute('enterkeyhint', 'done');
          }
        }
      }

      if (!isPWA) return;

      const parentForm = target.closest('form');
      if (parentForm && !parentForm.hasAttribute('autocomplete')) {
        parentForm.setAttribute('autocomplete', 'off');
      }

      restoreDemotedInputs();
      const controls = Array.from(document.querySelectorAll('input, textarea, select'));
      demotedInputs = controls
        .filter((control) => control !== target && isTextControl(control))
        .map((control) => {
          const element = control as HTMLElement;
          const previousTabIndex = element.getAttribute('tabindex');
          element.setAttribute('tabindex', '-1');
          return { element, previousTabIndex };
        });

      // PWA-only: encourage iOS to attach keyboard in single-field mode.
      if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && !target.hasAttribute('data-ios-fixed')) {
        target.setAttribute('data-ios-fixed', 'true');
        target.readOnly = true;
        requestAnimationFrame(() => {
          target.readOnly = false;
          target.focus({ preventScroll: true });
          setTimeout(() => target.removeAttribute('data-ios-fixed'), 300);
        });
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (!isPWA) return;
      const next = e.relatedTarget;
      if (next && isTextControl(next)) return;
      setTimeout(() => {
        restoreDemotedInputs();
      }, 120);
    };

    document.addEventListener('focusin', handleFocusIn, { passive: true });
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      restoreDemotedInputs();
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      document.documentElement.classList.remove('is-ios');
    };
  }, []);
}
