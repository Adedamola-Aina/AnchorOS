'use strict';

/**
 * Focused tests for the PR CI bounded-smoke gate (PR #122).
 * Run: node --test scripts/ci/pr-ci-gate.node-suite.mjs
 *
 * Locks in the replacement of the legacy PR E2E bottleneck with ONE bounded
 * Chromium smoke path, and the preservation of the weekly full regression,
 * the staging post-deploy full E2E, and the release-smoke deployment gate.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const CI_WORKFLOW = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
const SMOKE_CONFIG = fs.readFileSync('config/playwright.release-smoke.config.ts', 'utf8');

const ciSmokeJob = () => CI_WORKFLOW.slice(CI_WORKFLOW.indexOf('  e2e-tests:'));

test('PR CI contains no legacy --project=smoke invocation', () => {
    assert.doesNotMatch(CI_WORKFLOW, /--project=smoke/);
});

test('no 45-minute PR E2E job remains', () => {
    assert.doesNotMatch(CI_WORKFLOW, /timeout-minutes:\s*45/);
    const job = ciSmokeJob();
    assert.match(job, /timeout-minutes:\s*\d+/);
    const bounded = Number(job.match(/timeout-minutes:\s*(\d+)/)[1]);
    assert.ok(bounded <= 15, `smoke job timeout ${bounded} must be bounded`);
});

test('PR CI installs Chromium only for the bounded smoke (no WebKit anywhere)', () => {
    assert.doesNotMatch(CI_WORKFLOW, /webkit/i);
    const installs = CI_WORKFLOW.match(/npx playwright install[^\n]*/g) || [];
    assert.ok(installs.length >= 1, 'chromium install for the bounded smoke must exist');
    for (const line of installs) {
        assert.match(line, /chromium/);
        assert.doesNotMatch(line, /webkit|firefox/i);
    }
    // The install lives inside the gated smoke job only.
    const job = ciSmokeJob();
    assert.match(job, /npx playwright install --with-deps chromium/);
});

test('bounded smoke runs only for product-runtime PRs (additive frontend_changed gate)', () => {
    const job = ciSmokeJob();
    assert.match(job, /github\.event_name == 'pull_request'/);
    assert.match(job, /needs\.classify\.outputs\.frontend_changed == 'true'/);
});

test('bounded smoke runs ONE bounded Chromium path via test:release-smoke', () => {
    const job = ciSmokeJob();
    assert.match(job, /npm run test:release-smoke/);
    assert.doesNotMatch(job, /test:e2e/);
    assert.doesNotMatch(job, /npm run test:e2e/);
});

test('bounded smoke config: retries 0, 20s/test, 3-min global, chromium only, no signup heuristic', () => {
    assert.match(SMOKE_CONFIG, /retries:\s*0/);
    assert.match(SMOKE_CONFIG, /timeout:\s*20000/);
    assert.match(SMOKE_CONFIG, /globalTimeout:\s*3\s*\*\s*60\s*\*\s*1000/);
    assert.doesNotMatch(SMOKE_CONFIG, /webkit|Desktop Firefox|iPhone/);
    assert.doesNotMatch(SMOKE_CONFIG, /loginOrSignup/);
    // Deterministic single login (never signup) via the release-auth project.
    assert.match(SMOKE_CONFIG, /release-auth/);
    assert.match(SMOKE_CONFIG, /storageState/);
});

test('weekly full regression schedule is preserved', () => {
    assert.match(CI_WORKFLOW, /cron: '0 22 \* \* 0'/);
    assert.match(CI_WORKFLOW, /scheduled-full-regression/);
    assert.match(CI_WORKFLOW, /github\.event_name == 'schedule'/);
});

test('staging post-deploy full E2E and release-smoke deployment gates are preserved', () => {
    const staging = fs.readFileSync('.github/workflows/staging.yml', 'utf8');
    const production = fs.readFileSync('.github/workflows/production.yml', 'utf8');
    assert.match(staging, /post-deploy-e2e/);
    assert.match(staging, /playwright\.release-smoke\.config\.ts/);
    assert.match(production, /playwright\.release-smoke\.config\.ts/);
});

test('classifier emits the additive frontend_changed output for the workflow gate', () => {
    const src = fs.readFileSync('scripts/ci/classify-changes.js', 'utf8');
    assert.match(src, /frontend_changed=/);
    assert.match(src, /backend_changed=/);
    // Mixed backend+frontend keeps frontend_changed=true (additive, not precedence).
    assert.match(src, /frontend_changed: categories\.includes\('PRODUCT_RUNTIME'\)/);
});