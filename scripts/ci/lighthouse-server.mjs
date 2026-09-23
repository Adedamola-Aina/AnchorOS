#!/usr/bin/env node
'use strict';

/**
 * The server Lighthouse audits.
 *
 * Two modes, and the difference matters:
 *
 *   **Production bundle (what the release gate audits).** `LIGHTHOUSE_USE_PREBUILT=1`, set
 *   by production.yml, serves the `production-build` artifact it just downloaded — the
 *   exact bundle users download, pointed at the real backend — and signs in with the
 *   dedicated production canary. Nothing is rebuilt, and a missing artifact is an error
 *   rather than a silent fallback. A cloud release path must never run local emulators or
 *   a local fixture identity.
 *
 *   **Local mode (developer convenience, the default).** A production-shaped bundle
 *   (minified, code-split — the payload a user downloads) is built with the pinned
 *   emulator env and served, so `npm run lighthouse` works on a workstation. The auditor
 *   then signs in with the disposable fixture, which is why lighthouse-auth.cjs refuses a
 *   non-loopback target. The env is imported from emulator-harness.mjs so the local audit,
 *   the E2E suite and the PR smoke share one definition of emulator configuration.
 *
 * Why this file exists at all: the gate previously served the production build with **no
 * session**, so every authenticated route rendered the boot splash and redirected to the
 * landing surface. "/settings: LCP <= 2800ms" was asserted against a page that was never
 * /settings — which is why the gate had never passed on any commit.
 */

import { existsSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { PINNED_LOCAL_VITE_ENV } from './emulator-harness.mjs';

const PORT = String(process.env.LIGHTHOUSE_PORT || '4173');
const HOST = '127.0.0.1';
const USE_PREBUILT = process.env.LIGHTHOUSE_USE_PREBUILT === '1';
const env = { ...process.env };

if (USE_PREBUILT) {
    if (!existsSync('dist/index.html')) {
        console.error('lighthouse-server: LIGHTHOUSE_USE_PREBUILT=1 but no dist/ was found — the production artifact is missing.');
        process.exit(1);
    }
    console.log('lighthouse-server: serving the downloaded production artifact as-is (not rebuilding)');
} else {
    console.log('lighthouse-server: building a production-shaped bundle with the pinned emulator env (local mode)');
    const build = spawnSync('npx', ['vite', 'build', '--config', 'config/vite.config.ts'], {
        env: { ...env, ...PINNED_LOCAL_VITE_ENV },
        stdio: 'inherit',
        shell: false,
    });
    if (build.error) {
        console.error(`lighthouse-server: could not run the build — ${build.error.message}`);
        process.exit(1);
    }
    if (build.status !== 0) {
        console.error(`lighthouse-server: the build failed (exit ${build.status})`);
        process.exit(build.status ?? 1);
    }
}

// `vite preview` prints "Local:   http://127.0.0.1:4173/" — the ready pattern
// lighthouserc.cjs waits for.
console.log(`lighthouse-server: serving dist on http://${HOST}:${PORT}`);
const server = spawn('npx', ['vite', 'preview', '--config', 'config/vite.config.ts', '--host', HOST, '--port', PORT, '--strictPort'], {
    env,
    stdio: 'inherit',
    shell: false,
});

const shutdown = (signal) => {
    server.kill(signal);
    process.exit(0);
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
server.on('exit', (code) => process.exit(code ?? 0));
