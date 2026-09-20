import { describe, it, expect } from 'vitest';
import { DEV_SURFACE_MARKERS, isDeveloperToolsEnabled, isDevSurfaceEnabled } from './devSurface';
import { readFileSync } from 'node:fs';

describe('UX-GL-07 — developer surfaces are gated, and the gate is proved', () => {
    it('is off in a production build', () => {
        expect(isDevSurfaceEnabled({ DEV: false, PROD: true, MODE: 'production', VITE_APP_ENV: 'production' })).toBe(false);
        expect(isDeveloperToolsEnabled({ DEV: false, PROD: true, VITE_APP_ENV: 'production' })).toBe(false);
    });

    it('is off even if only the environment name says production', () => {
        // A build that forgets to set DEV but names the environment correctly
        // must still not expose the surfaces.
        expect(isDevSurfaceEnabled({ PROD: true, VITE_APP_ENV: 'production' })).toBe(false);
    });

    it('is on for a development build', () => {
        expect(isDevSurfaceEnabled({ DEV: true, PROD: false, VITE_APP_ENV: 'development' })).toBe(true);
        expect(isDeveloperToolsEnabled({ DEV: true, VITE_APP_ENV: 'development' })).toBe(true);
    });

    it('is on for staging, which is deployed but must be labelled', () => {
        expect(isDevSurfaceEnabled({ DEV: false, PROD: true, VITE_APP_ENV: 'staging' })).toBe(true);
        // The banner belongs on staging; Developer Tools does not.
        expect(isDeveloperToolsEnabled({ DEV: false, PROD: true, VITE_APP_ENV: 'staging' })).toBe(false);
    });

    it('is off when the environment is unknown and the build is not a dev build', () => {
        expect(isDevSurfaceEnabled({ DEV: false, PROD: true })).toBe(false);
    });

    it('keeps the checker and the module in step, so the gate cannot go vacuous', () => {
        // The CI checker hard-codes the markers it greps for; if this list grows
        // without the checker, the proof would silently stop covering a surface.
        const checker = readFileSync('scripts/ci/check-dev-surface.mjs', 'utf8');
        for (const marker of DEV_SURFACE_MARKERS) {
            expect(checker).toContain(marker);
        }
    });

    it('names every developer surface it guards', () => {
        expect(DEV_SURFACE_MARKERS.length).toBeGreaterThanOrEqual(4);
    });

    it('keeps the Developer Tools import inside a folded build-time condition', () => {
        // The gate only *works* if the bundler can drop the import. A static
        // import (or a condition read from another module) leaves the section's
        // code in the production bundle even though it can never render — which
        // is exactly what the production build caught. This guards the shape.
        const view = readFileSync('src/features/settings/SettingsView.tsx', 'utf8');
        expect(view).toMatch(/import\.meta\.env\.DEV[\s\S]{0,200}import\(['"]\.\/components\/DeveloperTools['"]\)/);
        expect(view).not.toMatch(/^import \{ DeveloperTools \} from/m);
    });
});
