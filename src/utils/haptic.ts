/**
 * Haptic feedback utility — UX-041
 * Silent no-op on iOS Safari (navigator.vibrate unsupported).
 * Never show UI related to haptics. Never polyfill.
 */
const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

export const haptic = {
  selection: () => supported && navigator.vibrate(10),
  lift: () => supported && navigator.vibrate([5, 10, 5]),
  success: () => supported && navigator.vibrate(20),
  warning: () => supported && navigator.vibrate([15, 30, 15]),
};
