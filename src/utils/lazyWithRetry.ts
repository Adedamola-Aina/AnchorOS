import React from 'react';

/**
 * Lazy-load wrapper that auto-reloads on chunk load failures.
 * After a deploy, browsers may cache stale chunk filenames. When the SPA
 * tries to load the old filename, Firebase returns index.html (rewrite),
 * which fails with a MIME type error. This detects that and reloads once.
 */
export function lazyWithRetry(factory: () => Promise<{ default: React.ComponentType<any> }>) {
  return React.lazy(() =>
    factory().catch((error: Error) => {
      const key = 'chunk_reload_' + factory.toString().slice(0, 60);
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
      }
      throw error;
    })
  );
}
