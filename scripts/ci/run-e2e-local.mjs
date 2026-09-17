#!/usr/bin/env node
'use strict';

/**
 * Canonical local authenticated E2E runner.
 *
 *   npm run test:e2e:local
 *   npm run test:e2e:local -- e2e/finance.spec.ts
 *   npm run test:e2e:local -- e2e/finance.spec.ts -g "rename"
 *
 * ONE documented command that:
 *   1. resolves ONE local origin (default http://127.0.0.1:5273, overridable
 *      with a loopback E2E_BASE_URL) used for server bind host/port, readiness,
 *      browser navigation and the seeded data;
 *   2. ALWAYS starts its own app server from this worktree — a loopback
 *      E2E_BASE_URL only chooses the host/port, it never attaches to a running
 *      server;
 *   3. fails clearly if that origin's port is already occupied, even when the
 *      origin was explicitly configured — it never reuses a server it did not
 *      start;
 *   4. verifies the local Firebase emulator suite serves demo-anchor-os, or
 *      starts its own emulators (auth + firestore) and shuts them down again;
 *   5. seeds the disposable fixture identity plus a run-scoped finance account;
 *   6. runs Playwright, which starts the fresh Vite dev server on the strict
 *      origin host/port with emulator-only configuration pinned inline;
 *   7. cleans up only the processes it started (emulators via
 *      `firebase emulators:exec`, the dev server via Playwright's webServer).
 *
 * It never kills or restarts processes it did not start, never wipes emulator
 * data, and refuses any non-loopback target.
 */

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    DEMO_PROJECT_ID,
    HarnessError,
    describePortOccupant,
    probePort,
    readEmulatorSuite,
    resolveLocalOrigin,
    shellQuote,
} from './emulator-harness.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Unique, filesystem/firestore-safe id for this invocation's fixture data. */
export function createRunId(now = Date.now(), random = crypto.randomBytes(3).toString('hex')) {
    return `e2e-${now.toString(36)}-${random}`;
}

/** Seed command for the run-scoped finance fixture (relative to the repo root). */
export function buildSeedCommand() {
    return `node ${shellQuote('scripts/ci/seed-e2e-finance.mjs')}`;
}

/** Playwright command with the caller's arguments forwarded verbatim. */
export function buildPlaywrightCommand(playwrightArgs = []) {
    const argv = ['npx', 'playwright', 'test', '--config', 'config/playwright.config.ts', ...playwrightArgs];
    return argv.map(shellQuote).join(' ');
}

/** Seed first, then run Playwright (both inside the emulator window). */
export function buildInnerCommand(playwrightArgs = []) {
    return `${buildSeedCommand()} && ${buildPlaywrightCommand(playwrightArgs)}`;
}

/**
 * Detect anything already listening on the resolved origin's port.
 *
 * Applied to the DEFAULT port and to an explicitly configured loopback origin
 * alike: this command always starts its own server, so a pre-occupied port must
 * never be silently reused. Returns a human description, or null when free.
 */
export async function findOriginOccupant(origin) {
    if (!(await probePort(origin.host, Number(origin.port)))) return null;
    return describePortOccupant(origin.port);
}

/** Why a pre-occupied target origin is never reused. */
export function occupiedOriginRefusal() {
    return (
        'Refusing to reuse a server this command did not start: it may be serving a different ' +
        'checkout (a stale dev server without emulator wiring is exactly what produces the ' +
        'misleading auth/api-key-not-valid failure).\n' +
        '  Stop that process, or pass a FREE loopback origin via E2E_BASE_URL.'
    );
}

/** Map the observed emulator state onto what the runner should do. */
export function planEmulatorExecution(state) {
    if (!state) {
        return {
            mode: 'fail',
            message: 'the emulator state could not be determined, so nothing can be seeded or reused safely.',
        };
    }
    if (state.state === 'free') return { mode: 'start' };
    if (state.state === 'verified') return { mode: 'reuse' };
    if (state.state === 'partial') {
        return {
            mode: 'fail',
            message:
                'the auth (9099) and firestore (8080) emulator ports are not both serving — a partial suite ' +
                'cannot support authentication.\n' +
                `  ${state.authOccupant || 'auth port is free'}\n` +
                `  ${state.firestoreOccupant || 'firestore port is free'}`,
        };
    }
    if (state.state === 'foreign') {
        return {
            mode: 'fail',
            message:
                `the local emulator suite at the Hub is NOT serving the demo project "${DEMO_PROJECT_ID}", so ` +
                'the disposable fixture identity must not be seeded into it.\n' +
                `    pid:     ${state.pid}\n    command: ${state.command}\n    cwd:     ${state.cwd}`,
        };
    }
    return {
        mode: 'fail',
        message:
            'the auth (9099) and firestore (8080) ports are busy but no responding Firebase emulator Hub ' +
            'could be identified, so the running services cannot be trusted for seeding. Stop that process ' +
            '(it was not started by this command) or free the ports and run again.',
    };
}

/**
 * Environment for the seed + Playwright child processes.
 * `E2E_BASE_URL` is only passed through when the caller explicitly set a
 * loopback target; otherwise it is removed so config/playwright.config.ts owns
 * the local server startup.
 */
export function buildChildEnv(baseEnv, runId) {
    const env = { ...baseEnv, E2E_RUN_ID: runId, FIREBASE_PROJECT_ID: DEMO_PROJECT_ID };
    if (!String(env.E2E_BASE_URL || '').trim()) delete env.E2E_BASE_URL;
    return env;
}

function fail(message) {
    console.error(`run-e2e-local: REFUSED — ${message}`);
    process.exit(1);
}

async function main() {
    const playwrightArgs = process.argv.slice(2);

    let origin;
    try {
        origin = resolveLocalOrigin(process.env);
    } catch (err) {
        return fail(err instanceof HarnessError ? err.message : String(err));
    }

    const explicitTarget = Boolean(String(process.env.E2E_BASE_URL || '').trim());
    const runId = String(process.env.E2E_RUN_ID || '').trim() || createRunId();

    console.log(`run-e2e-local: worktree ${REPO_ROOT}`);
    console.log(
        `run-e2e-local: origin   ${origin.origin}${explicitTarget ? ' (explicit E2E_BASE_URL)' : ' (dedicated local port)'}`,
    );

    // Never silently share a server with another process (or another checkout).
    // This applies to the default port AND to an explicitly configured loopback
    // origin: the command always starts its own server below.
    const occupant = await findOriginOccupant(origin);
    if (occupant) {
        return fail(`${occupant}\n  ${occupiedOriginRefusal()}`);
    }

    const suite = await readEmulatorSuite();
    const plan = planEmulatorExecution(suite);
    if (plan.mode === 'fail') return fail(plan.message);

    if (plan.mode === 'reuse') {
        console.log(
            `run-e2e-local: emulators reusing the verified demo-anchor-os suite (pid ${suite.pid}, cwd ${suite.cwd || 'n/a'})`,
        );
        console.log('run-e2e-local:           it was not started by this command, so it is left running');
    } else {
        console.log(
            'run-e2e-local: emulators starting a private demo-anchor-os suite (auth, firestore); ' +
                'it is shut down when the run ends',
        );
    }
    console.log(`run-e2e-local: run id   ${runId}`);
    console.log(
        `run-e2e-local: command  npx playwright test --config config/playwright.config.ts ${playwrightArgs.join(' ')}`.trim(),
    );

    const inner = buildInnerCommand(playwrightArgs);
    const env = buildChildEnv(process.env, runId);

    const result =
        plan.mode === 'reuse'
            ? spawnSync('sh', ['-c', inner], { cwd: REPO_ROOT, env, stdio: 'inherit' })
            : spawnSync(
                  'firebase',
                  ['emulators:exec', '--project', DEMO_PROJECT_ID, '--only', 'auth,firestore', inner],
                  { cwd: REPO_ROOT, env, stdio: 'inherit' },
              );

    if (result.error) {
        if (result.error.code === 'ENOENT') {
            return fail(
                'the firebase CLI was not found on PATH (needed to start the local auth/firestore emulators). ' +
                    'Install firebase-tools, or start the emulators yourself and run again.',
            );
        }
        return fail(`failed to launch the test command: ${result.error.message}`);
    }

    process.exit(result.status ?? 1);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
    main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
}
