/**
 * Platform detection for the installable PWA.
 *
 * Anchor ships as a web app / installable PWA only (there are no native
 * wrappers), so the only distinction that matters is browser tab vs installed
 * app. `isPWA()` answers that; `getPlatformClasses()` exposes it to CSS.
 */

/** True when running as an installed PWA (standalone/fullscreen/minimal-ui). */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  // Standard installed-PWA display modes.
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  if (window.matchMedia?.('(display-mode: fullscreen)').matches) return true;
  if (window.matchMedia?.('(display-mode: minimal-ui)').matches) return true;
  // iOS Safari uses a non-standard property instead of display-mode.
  const navAny = window.navigator as Navigator & { standalone?: boolean };
  return navAny.standalone === true;
}

/** Body/html classes consumed by src/styles/app-shell.css. */
export function getPlatformClasses(): string {
  return isPWA() ? 'platform-pwa platform-app' : 'platform-web';
}