import React from 'react';

const RELOAD_KEY = 'chunk_reload_ts';
const RELOAD_COOLDOWN_MS = 15_000; // don't reload more than once per 15s

/**
 * Lazy-load wrapper that auto-reloads on chunk load failures.
 * After a deploy, browsers may cache stale chunk filenames. When the SPA
 * tries to load the old filename, Firebase returns index.html (rewrite),
 * which fails with a MIME type error. This detects that and reloads once.
 *
 * Uses a timestamp in sessionStorage so the cooldown resets after 15s
 * (survives a normal page reload), preventing infinite reload loops while
 * still allowing a second attempt if the first reload didn't fix things.
 */
export function lazyWithRetry(factory: () => Promise<{ default: React.ComponentType<object> }>) {
  return React.lazy(() =>
    factory().catch((error: Error) => {
      const lastReload = parseInt(sessionStorage.getItem(RELOAD_KEY) ?? '0', 10);
      const cooldownExpired = Date.now() - lastReload > RELOAD_COOLDOWN_MS;

      if (cooldownExpired) {
        sessionStorage.setItem(RELOAD_KEY, Date.now().toString());
        // Return a never-resolving promise so Suspense keeps the spinner
        // visible while the reload fires — the ErrorBoundary never sees this.
        window.location.reload();
        return new Promise<never>(() => {/* reloading */});
      }

      throw error;
    })
  );
}
