/**
 * useIOSKeyboardFix — iOS keyboard input hints.
 *
 * BUG-093 originally chased the iOS input accessory bar (the Previous/Next/Done
 * strip above the keyboard). Two of the mitigations it shipped traded the
 * keyboard away to hide a cosmetic strip:
 *
 *   1. It set `readOnly = true` on the focused field, then cleared it in a
 *      requestAnimationFrame and refocused. On iOS, making a focused field
 *      readOnly dismisses the keyboard, and the refocus that follows is not tied
 *      to a user gesture — so the keyboard does not come back. Tapping the field
 *      again fires no `focus` event (it is already `document.activeElement`), so
 *      the field is simply untypeable. Reported from iOS as "the keyboard doesn't
 *      come up for typing".
 *   2. It demoted every other input on the page to `tabindex="-1"`, which broke
 *      moving between fields and fought the modal's own focus trap.
 *
 * Both are removed. What remains is the part that is safe and useful: the
 * `is-ios` marker for CSS and the autocorrect/autocapitalise hints.
 *
 * `enterkeyhint` is only set when the field has not declared one — a caller that
 * needs the key to submit sets it explicitly (see `CommitmentFindOrAdd`).
 */
// @ts-nocheck

import { useEffect } from 'react';

const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export function useIOSKeyboardFix(): void {
  useEffect(() => {
    if (!isIOS()) return;

    // Mark <html> so CSS can target iOS-specific overrides
    document.documentElement.classList.add('is-ios');

    const isTextControl = (element: Element): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
      element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;

    /**
     * Focus hints only. Nothing here touches `readOnly`, `tabindex` or focus, so
     * the field the user tapped keeps the keyboard it opened.
     */
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!isTextControl(target)) return;

      // Skip inputs that explicitly need autocomplete (passwords, emails)
      const autoCompleteValue = target.getAttribute('autocomplete');
      const preserveAutocomplete = autoCompleteValue && !['off', 'on'].includes(autoCompleteValue);
      if (preserveAutocomplete || target.hasAttribute('data-keep-autocomplete')) return;

      target.setAttribute('autocomplete', 'off');
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        target.setAttribute('autocorrect', 'off');
        target.setAttribute('autocapitalize', 'off');
        target.setAttribute('spellcheck', 'false');
        if (!target.hasAttribute('enterkeyhint')) {
          target.setAttribute('enterkeyhint', 'done');
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn, { passive: true });

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.documentElement.classList.remove('is-ios');
    };
  }, []);
}
