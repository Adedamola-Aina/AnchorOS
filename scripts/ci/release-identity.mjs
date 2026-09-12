#!/usr/bin/env node
'use strict';

/**
 * Release-smoke identity selection — ONE source of truth.
 *
 * The bounded release smoke (config/playwright.release-smoke.config.ts) runs in
 * two very different modes and each mode needs a different identity:
 *
 *   LOCAL / PR EMULATOR  (E2E_BASE_URL unset)
 *     The disposable repository fixture identity (e2e/fixtures/test-data.ts)
 *     seeded into demo-anchor-os. Throwing it away is free, so committing it
 *     is fine.
 *
 *   DEPLOYED CLOUD TARGET  (E2E_BASE_URL set)
 *     A dedicated per-environment canary identity supplied ONLY as secrets:
 *       staging    -> STAGING_SMOKE_EMAIL / STAGING_SMOKE_PASSWORD
 *       production -> PRODUCTION_SMOKE_EMAIL / PRODUCTION_SMOKE_PASSWORD
 *     The repository fixture identity is NEVER used against a cloud project,
 *     and missing canary credentials FAIL CLOSED. A cloud release smoke must
 *     never silently "pass" or "fail" against the wrong identity.
 *
 * The deployed target is chosen explicitly via E2E_SMOKE_TARGET, so a
 * production smoke can never accidentally consume staging credentials.
 *
 * This module is intentionally tiny, dependency-free, and unit-tested by
 * scripts/ci/release-identity.node-suite.mjs. Never log the returned password.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

export const CANONICAL_FIXTURE = 'e2e/fixtures/test-data.ts';
export const CLOUD_TARGETS = Object.freeze(['staging', 'production']);

/**
 * Read the canonical repository fixture identity. Used ONLY for the local/PR
 * emulator smoke. Credentials are never logged by this module.
 *
 * @param {string} [fixturePath] Override for tests.
 * @returns {{email: string, password: string, name: string, source: 'repository-fixture'}}
 */
export function readFixtureIdentity(fixturePath = path.join(repoRoot, CANONICAL_FIXTURE)) {
    const source = fs.readFileSync(fixturePath, 'utf8');
    const block = source.match(/export const TEST_USER = \{([\s\S]*?)\}/);
    if (!block) {
        throw new Error(`release-identity: could not find TEST_USER in ${CANONICAL_FIXTURE}`);
    }
    const field = (name) => {
        const match = block[1].match(new RegExp(`${name}\\s*:\\s*'([^']*)'`));
        if (!match) {
            throw new Error(`release-identity: could not read TEST_USER.${name} from ${CANONICAL_FIXTURE}`);
        }
        return match[1];
    };
    return {
        email: field('email'),
        password: field('password'),
        name: field('name'),
        source: 'repository-fixture',
    };
}

/**
 * Resolve the release-smoke identity for the current run.
 *
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {{email: string, password: string, source: string}}
 */
export function resolveReleaseIdentity(env = process.env) {
    const baseUrl = (env.E2E_BASE_URL || '').trim();

    // Local / PR emulator smoke: the disposable fixture identity is correct.
    if (!baseUrl) {
        return readFixtureIdentity();
    }

    // Deployed cloud smoke: a dedicated canary identity is mandatory.
    const target = (env.E2E_SMOKE_TARGET || '').trim().toLowerCase();
    if (!CLOUD_TARGETS.includes(target)) {
        throw new Error(
            `release-identity: E2E_BASE_URL="${baseUrl}" is a deployed target, so ` +
            `E2E_SMOKE_TARGET must be one of ${CLOUD_TARGETS.join('|')} ` +
            `(got "${env.E2E_SMOKE_TARGET || ''}"). Refusing to guess the canary identity.`,
        );
    }

    const prefix = target.toUpperCase();
    const email = (env[`${prefix}_SMOKE_EMAIL`] || '').trim();
    const password = env[`${prefix}_SMOKE_PASSWORD`] || '';
    if (!email || !password) {
        throw new Error(
            `release-identity: missing ${prefix}_SMOKE_EMAIL / ${prefix}_SMOKE_PASSWORD for the ` +
            `deployed ${target} release smoke. The repository fixture identity is never used ` +
            `against a cloud project. Provision the dedicated ${target} canary account and set ` +
            `those secrets (see docs/OPERATIONS.md).`,
        );
    }

    return { email, password, source: `${target}-canary` };
}
