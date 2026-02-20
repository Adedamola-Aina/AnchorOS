/**
 * Centralized version module for Anchor OS.
 *
 * __APP_VERSION__ and __APP_ENV__ are injected at build time by Vite's
 * `define` block in config/vite.config.ts. This replaces the old pattern
 * of importing package.json at runtime, which returned the same static
 * value regardless of environment.
 */

declare global {
    var __APP_VERSION__: string;
    var __APP_ENV__: string;
}

export const APP_VERSION: string = __APP_VERSION__;
export const APP_ENV: string = __APP_ENV__;

/**
 * Human-readable version string for display in the UI.
 * @returns Format: "v1.8.0-dev.3 (development)" or "v1.8.0 (production)"
 */
export function getDisplayVersion(): string {
    return `v${APP_VERSION} (${APP_ENV})`;
}
