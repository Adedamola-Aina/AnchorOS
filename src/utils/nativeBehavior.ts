/**
 * App-shell behaviour guards for the installed PWA.
 *
 * CSS handles the visual layer (see src/styles/app-shell.css). This file handles
 * the runtime events the browser still fires by default — the ones that make an
 * installed app feel "web-y":
 *
 *   - Long-press → iOS share sheet / copy-link menu
 *   - Right-click / two-finger-tap → context menu
 *   - Drag an image / selected text out of the app
 *   - Pinch-zoom the document
 *   - Double-tap zoom
 *
 * Only active when installed as a PWA. A normal browser tab keeps normal
 * behaviour.
 */

import { isPWA, getPlatformClasses } from './platform';

/**
 * Apply the platform-{pwa,app,web} classes to BOTH <html> and <body>.
 * `app-shell.css` uses the html-level class to suppress document-level overscroll
 * / pinch-zoom reliably.
 */
export function applyPlatformClasses(): void {
  const classes = getPlatformClasses();
  if (document.documentElement) {
    document.documentElement.className = [
      document.documentElement.className,
      classes,
    ].filter(Boolean).join(' ').trim();
  }
  if (document.body) {
    document.body.className = [
      document.body.className,
      classes,
    ].filter(Boolean).join(' ').trim();
  }
}

/**
 * Initialise app-shell-only event guards. Safe to call in a browser tab
 * (no-ops).
 */
export function initAppShellBehavior(): void {
  applyPlatformClasses();

  if (!isPWA()) return;

  // 1) Context menu (iOS long-press share sheet, Android long-press selection
  //    menu, desktop right-click).
  document.addEventListener(
    'contextmenu',
    (e) => {
      const target = e.target as HTMLElement | null;
      // Allow the context menu inside real editable fields.
      if (target && isEditable(target)) return;
      e.preventDefault();
    },
    { capture: true },
  );

  // 2) Drag-out (images, selected text, links).
  document.addEventListener(
    'dragstart',
    (e) => e.preventDefault(),
    { capture: true },
  );

  // 3) Pinch-zoom the document. Touchmove with >1 touch = pinch.
  //    Needs passive:false to call preventDefault().
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false, capture: true },
  );

  // 4) Double-tap zoom (iOS Safari). Suppress if two taps land within 300ms.
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    },
    { passive: false, capture: true },
  );

  // 5) Pinch-zoom via the gesturestart event (iOS WebKit specific).
  document.addEventListener(
    'gesturestart',
    (e) => e.preventDefault() as void,
    { capture: true } as AddEventListenerOptions,
  );
}

function isEditable(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
  if (el.isContentEditable) return true;
  // Opt-in selectable regions should allow the system menu (copy balance, etc.)
  if (el.closest('.selectable')) return true;
  return false;
}