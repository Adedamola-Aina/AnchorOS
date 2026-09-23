/**
 * UX-GL-07 — developer surfaces must be provably non-shippable.
 *
 * Three things were only *probably* absent from a production build: the
 * environment banner, the Developer Tools settings section, and the React Query
 * devtools. Each was guarded by a different expression, and one of them
 * (`VITE_APP_ENV === 'development'`) is a runtime string comparison, so the code
 * and its labels still shipped inside the bundle.
 *
 * There is now one rule: every developer surface asks this module, so the gate
 * cannot drift. `DEV_SURFACE_MARKERS` below names the strings that must never
 * reach a production bundle.
 */

interface DevSurfaceEnv {
    DEV?: boolean;
    PROD?: boolean;
    MODE?: string;
    VITE_APP_ENV?: string;
}

/** The environment as Vite exposes it at build time. */
function currentEnv(): DevSurfaceEnv {
    return import.meta.env as unknown as DevSurfaceEnv;
}

/**
 * True only in a development build, or in an explicitly non-production
 * environment. A production build reports `PROD === true` and
 * `VITE_APP_ENV === 'production'`, so this is false there — and because it reads
 * build-time constants, a production bundle can eliminate the callers entirely.
 */
export function isDevSurfaceEnabled(env: DevSurfaceEnv = currentEnv()): boolean {
    if (env.PROD === true && env.VITE_APP_ENV === 'production') return false;
    if (env.DEV === true) return true;
    return env.VITE_APP_ENV !== undefined && env.VITE_APP_ENV !== 'production';
}

/**
 * Developer Tools is narrower: an explicit development environment, or a local
 * dev build with no environment named. Staging is deployed, so it must not show
 * the section either — staging is labelled, not instrumented.
 *
 * The *import* of that section is gated separately, inline in SettingsView, with
 * `import.meta.env.DEV`. That is deliberate: only a condition Vite substitutes in
 * the same file lets the bundler drop the dynamic import, so the section's code
 * is absent from a production bundle rather than merely never rendered. A value
 * imported from another module is not folded, which the production-build check
 * caught the hard way.
 */
export function isDeveloperToolsEnabled(env: DevSurfaceEnv = currentEnv()): boolean {
    if (env.VITE_APP_ENV === 'production' || env.VITE_APP_ENV === 'staging') return false;
    if (env.VITE_APP_ENV === 'development') return true;
    return env.DEV === true;
}

/**
 * Strings that must never appear in a production bundle. The checker greps the
 * built assets for these, so a gate that silently stops working is caught by CI
 * rather than by a user.
 */
export const DEV_SURFACE_MARKERS = [
    'DEVELOPMENT ENVIRONMENT',
    'STAGING — TEST DATA',
    'Developer Tools',
    'react-query-devtools',
] as const;
