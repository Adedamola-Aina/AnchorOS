'use strict';

/**
 * Focused tests for the release-smoke identity contract (Phase 12).
 * Run: node --test scripts/ci/release-identity.node-suite.mjs
 *
 * Locks in the rule that a DEPLOYED release smoke can never fall back to the
 * committed repository fixture identity, and that a missing cloud canary
 * credential fails closed.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { resolveReleaseIdentity, readFixtureIdentity, CLOUD_TARGETS } from './release-identity.mjs';

const STAGING_YML = fs.readFileSync('.github/workflows/staging.yml', 'utf8');
const PRODUCTION_YML = fs.readFileSync('.github/workflows/production.yml', 'utf8');
const SEED_SCRIPT = fs.readFileSync('scripts/ci/seed-release-emulator.mjs', 'utf8');
const AUTH_SETUP = fs.readFileSync('e2e/release-auth.setup.ts', 'utf8');

// --- Local / PR emulator path -----------------------------------------------

test('local PR emulator smoke uses the disposable repository fixture identity', () => {
    const identity = resolveReleaseIdentity({});
    assert.equal(identity.source, 'repository-fixture');
    assert.equal(identity.email, 'test@anchor-os.com');
    assert.equal(typeof identity.password, 'string');
    assert.ok(identity.password.length > 0);
});

test('an empty E2E_BASE_URL never demands cloud credentials', () => {
    const identity = resolveReleaseIdentity({ E2E_BASE_URL: '   ' });
    assert.equal(identity.source, 'repository-fixture');
});

// --- Deployed cloud path: fail closed ---------------------------------------

test('deployed smoke without E2E_SMOKE_TARGET fails closed', () => {
    assert.throws(
        () => resolveReleaseIdentity({ E2E_BASE_URL: 'https://anchor-os-staging.web.app' }),
        /E2E_SMOKE_TARGET/,
    );
});

test('deployed smoke with an unknown target fails closed', () => {
    assert.throws(
        () => resolveReleaseIdentity({
            E2E_BASE_URL: 'https://example.web.app',
            E2E_SMOKE_TARGET: 'demo',
        }),
        /E2E_SMOKE_TARGET/,
    );
});

test('deployed staging smoke with no canary credentials fails closed (no fixture fallback)', () => {
    assert.throws(
        () => resolveReleaseIdentity({
            E2E_BASE_URL: 'https://anchor-os-staging.web.app',
            E2E_SMOKE_TARGET: 'staging',
        }),
        /STAGING_SMOKE_EMAIL/,
    );
    // Half-configured secrets also fail closed.
    assert.throws(
        () => resolveReleaseIdentity({
            E2E_BASE_URL: 'https://anchor-os-staging.web.app',
            E2E_SMOKE_TARGET: 'staging',
            STAGING_SMOKE_EMAIL: 'canary@example.com',
        }),
        /STAGING_SMOKE_PASSWORD/,
    );
});

// --- Deployed cloud path: explicit target only ------------------------------

test('deployed staging smoke uses the staging canary and never the fixture', () => {
    const identity = resolveReleaseIdentity({
        E2E_BASE_URL: 'https://anchor-os-staging.web.app',
        E2E_SMOKE_TARGET: 'staging',
        STAGING_SMOKE_EMAIL: 'staging-canary@example.test',
        STAGING_SMOKE_PASSWORD: 'staging-secret',
        PRODUCTION_SMOKE_EMAIL: 'prod-canary@example.test',
        PRODUCTION_SMOKE_PASSWORD: 'prod-secret',
    });
    assert.equal(identity.source, 'staging-canary');
    assert.equal(identity.email, 'staging-canary@example.test');
    assert.equal(identity.password, 'staging-secret');
    assert.notEqual(identity.email, 'test@anchor-os.com');
});

test('deployed production smoke uses the production canary (not staging, not fixture)', () => {
    const identity = resolveReleaseIdentity({
        E2E_BASE_URL: 'https://anchor-os.web.app',
        E2E_SMOKE_TARGET: 'production',
        STAGING_SMOKE_EMAIL: 'staging-canary@example.test',
        STAGING_SMOKE_PASSWORD: 'staging-secret',
        PRODUCTION_SMOKE_EMAIL: 'prod-canary@example.test',
        PRODUCTION_SMOKE_PASSWORD: 'prod-secret',
    });
    assert.equal(identity.source, 'production-canary');
    assert.equal(identity.email, 'prod-canary@example.test');
});

test('production smoke missing its own canary fails closed even when staging creds exist', () => {
    assert.throws(
        () => resolveReleaseIdentity({
            E2E_BASE_URL: 'https://anchor-os.web.app',
            E2E_SMOKE_TARGET: 'production',
            STAGING_SMOKE_EMAIL: 'staging-canary@example.test',
            STAGING_SMOKE_PASSWORD: 'staging-secret',
        }),
        /PRODUCTION_SMOKE_EMAIL/,
    );
});

test('CLOUD_TARGETS is exactly staging and production', () => {
    assert.deepEqual([...CLOUD_TARGETS], ['staging', 'production']);
});

// --- Single source of truth -------------------------------------------------

test('fixture parsing lives in exactly one module', () => {
    const identity = readFixtureIdentity();
    assert.equal(identity.name, 'Test User');
    // The seed script must consume the shared reader, not re-parse TEST_USER.
    assert.match(SEED_SCRIPT, /readFixtureIdentity/);
    assert.doesNotMatch(SEED_SCRIPT, /TEST_USER = /);
});

test('the release-auth setup consumes the shared resolver', () => {
    assert.match(AUTH_SETUP, /resolveReleaseIdentity/);
    assert.doesNotMatch(AUTH_SETUP, /TEST_USER/);
});

// --- Workflow wiring --------------------------------------------------------

test('staging release smoke supplies the staging canary target + secrets', () => {
    assert.match(STAGING_YML, /E2E_SMOKE_TARGET:\s*staging/);
    assert.match(STAGING_YML, /STAGING_SMOKE_EMAIL/);
    assert.match(STAGING_YML, /STAGING_SMOKE_PASSWORD/);
});

test('production release smoke supplies the production canary target + secrets', () => {
    assert.match(PRODUCTION_YML, /E2E_SMOKE_TARGET:\s*production/);
    assert.match(PRODUCTION_YML, /PRODUCTION_SMOKE_EMAIL/);
    assert.match(PRODUCTION_YML, /PRODUCTION_SMOKE_PASSWORD/);
});
