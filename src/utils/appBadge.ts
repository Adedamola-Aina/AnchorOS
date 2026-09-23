/**
 * App badge (the count on the installed PWA's icon).
 *
 * Uses the standard Badging API, which is what an installed PWA exposes. There
 * is no native path to fall back to — Anchor is web/PWA only.
 */

import { captureError } from './error';

type NavigatorWithBadge = Navigator & {
  setAppBadge?: (count?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

export async function setAppBadgeCount(count: number): Promise<void> {
  const safeCount = Math.max(0, Math.floor(count));
  if (typeof navigator === 'undefined') return;
  const nav = navigator as NavigatorWithBadge;

  try {
    if (safeCount > 0 && typeof nav.setAppBadge === 'function') {
      await nav.setAppBadge(safeCount);
    } else if (safeCount <= 0 && typeof nav.clearAppBadge === 'function') {
      await nav.clearAppBadge();
    }
  } catch (error) {
    captureError(error, 'Badge.webUpdate');
  }
}

export async function clearAppBadge(): Promise<void> {
  await setAppBadgeCount(0);
}