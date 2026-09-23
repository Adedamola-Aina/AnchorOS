'use strict';

/**
 * Focused tests for the Lighthouse release gate.
 * Run: node --test scripts/ci/lighthouse-auth.node-suite.mjs
 *
 * The gate could not pass, and the reason was that it was not measuring what it claimed:
 * every budgeted route is authenticated, and the audit ran with no session, so each route
 * rendered the boot splash and redirected. These tests lock in the two rules that keep the
 * audit honest once a session exists:
 *
 *   1. a **cloud** target is audited with a dedicated canary from secrets and NEVER with
 *      the disposable local fixture identity (and fails closed when it has neither);
 *   2. a **cloud** release path never starts local emulators or seeds a local identity —
 *      the artifact being audited is the real production bundle.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

// lighthouse-auth.cjs is a CommonJS LHCI entry point; load it from this ESM suite.
const require = createRequire(import.meta.url);
const { credentialsFor } = require('./lighthouse-auth.cjs');

const PRODUCTION_WORKFLOW = fs.readFileSync('.github/workflows/production.yml', 'utf8');
const FIXTURE = { email: 'test@anchor-os.com', password: 'TestPass123!' };

const lighthouseBlock = () =>
    PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('  lighthouse:'), PRODUCTION_WORKFLOW.indexOf('  deploy-production:'));

const withEnv = (vars, fn) => {
    const previous = {};
    for (const [key, value] of Object.entries(vars)) {
        previous[key] = process.env[key];
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
    try {
        return fn();
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
};

// --- the identity policy ----------------------------------------------------

test('a loopback target signs in with the disposable fixture identity', () => {
    withEnv({ LIGHTHOUSE_CANARY_EMAIL: undefined, LIGHTHOUSE_CANARY_PASSWORD: undefined }, () => {
        for (const origin of ['http://127.0.0.1:4173', 'http://localhost:5173', 'http://[::1]:4173']) {
            assert.deepEqual(credentialsFor(origin), FIXTURE, `${origin} should use the local fixture`);
        }
    });
});

test('a deployed target signs in with the canary, never the fixture', () => {
    withEnv({ LIGHTHOUSE_CANARY_EMAIL: 'canary@anchor-os.com', LIGHTHOUSE_CANARY_PASSWORD: 'canary-secret' }, () => {
        const credentials = credentialsFor('https://anchor-os.web.app');
        assert.deepEqual(credentials, { email: 'canary@anchor-os.com', password: 'canary-secret' });
        assert.notDeepEqual(credentials, FIXTURE, 'the local fixture identity must never be used against a cloud project');
    });
});

test('a deployed target with no canary credentials fails closed', () => {
    withEnv({ LIGHTHOUSE_CANARY_EMAIL: undefined, LIGHTHOUSE_CANARY_PASSWORD: undefined }, () => {
        assert.throws(() => credentialsFor('https://anchor-os.web.app'), /REFUSED/);
        assert.throws(() => credentialsFor('https://staging-anchor-os.web.app'), /REFUSED/);
    });
});

test('a half-configured canary fails closed rather than falling back to the fixture', () => {
    withEnv({ LIGHTHOUSE_CANARY_EMAIL: 'canary@anchor-os.com', LIGHTHOUSE_CANARY_PASSWORD: undefined }, () => {
        assert.throws(() => credentialsFor('https://anchor-os.web.app'), /REFUSED/);
    });
});

// --- the cloud release path -------------------------------------------------

test('the Lighthouse job audits the real production artifact', () => {
    const block = lighthouseBlock();
    assert.match(block, /download-artifact@v\d+/, 'the audit must use the production artifact');
    assert.match(block, /name: production-build/, 'and the artifact it downloads must be the production build');
    assert.match(block, /LIGHTHOUSE_USE_PREBUILT: '1'/, 'and must serve it as-is rather than rebuilding');
    assert.match(block, /LIGHTHOUSE_CANARY_EMAIL: \$\{\{ secrets\.PRODUCTION_SMOKE_EMAIL \}\}/);
    assert.match(block, /LIGHTHOUSE_CANARY_PASSWORD: \$\{\{ secrets\.PRODUCTION_SMOKE_PASSWORD \}\}/);
});

test('the Lighthouse job fails early and clearly when the canary is unconfigured', () => {
    const block = lighthouseBlock();
    assert.match(block, /Require the production canary credentials/);
    assert.match(block, /::error::PRODUCTION_SMOKE_EMAIL \/ PRODUCTION_SMOKE_PASSWORD are not configured/);
    assert.match(block, /exit 1/);
});

test('the Lighthouse job reads the canary from the same environment as the smoke', () => {
    // Secret scope, not cosmetics: the post-deploy smoke and deploy-production both
    // declare `environment: production`. If the audit does not, it reads only repository
    // secrets while the smoke reads environment secrets, and a canary provisioned in the
    // documented place is invisible to the audit.
    const block = lighthouseBlock();
    assert.match(block, /^ {4}environment: production$/m);
});

test('the Lighthouse job still gates deploy-production on success-or-skipped', () => {
    assert.match(
        PRODUCTION_WORKFLOW,
        /\(needs\.lighthouse\.result == 'success' \|\| needs\.lighthouse\.result == 'skipped'\)/,
        'a failing audit must keep blocking the deploy',
    );
});