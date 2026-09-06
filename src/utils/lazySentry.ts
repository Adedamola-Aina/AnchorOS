/**
 * Lazy Sentry loader — PERFORMANCE
 *
 * Keeps the Sentry SDK (~450 KB) out of the eagerly-loaded startup bundle.
 * `main.tsx` initializes Sentry on idle; consumers (error reporting, telemetry,
 * web vitals, error boundaries) request the SDK on demand. If Sentry was never
 * configured (no DSN) or fails to load, calls resolve to `null` and are
 * silently skipped — error reporting degrades to console-only.
 */
import type * as SentryTypes from '@sentry/react';

let sentryPromise: Promise<typeof SentryTypes | null> | null = null;

export function getSentry(): Promise<typeof SentryTypes | null> {
    if (!sentryPromise) {
        sentryPromise = import.meta.env.VITE_SENTRY_DSN
            ? import('@sentry/react')
                  .then((mod) => mod as typeof SentryTypes)
                  .catch((err: unknown) => {
                      console.warn('[Sentry] SDK failed to load:', err);
                      return null;
                  })
            : Promise.resolve(null);
    }
    return sentryPromise;
}
