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

// ---------------------------------------------------------------------------
// Surface-gated emulator jobs (final CI surface-gating fix)
// ---------------------------------------------------------------------------

function ciJob(name) {
    const start = CI_WORKFLOW.indexOf(`  ${name}:`);
    assert.ok(start !== -1, `job ${name} must exist in ci.yml`);
    // A job ends at the next line indented by exactly two spaces followed by
    // a non-space character (deeper indentation belongs to this job's body).
    const after = CI_WORKFLOW.slice(start + 2);
    const rel = after.search(/\n {2}(?=\S)/);
    return CI_WORKFLOW.slice(start, rel === -1 ? undefined : start + 2 + rel);
}

const RULES_JOB = () => ciJob('rules-tests');
const INTEGRATION_JOB = () => ciJob('integration-tests');
const E2E_JOB = () => ciJob('e2e-tests');

test('rules-tests and integration-tests depend on [test, classify]', () => {
    assert.match(RULES_JOB(), /needs:\s*\[test,\s*classify\]/);
    assert.match(INTEGRATION_JOB(), /needs:\s*\[test,\s*classify\]/);
});

test('emulator jobs are surface-gated on backend_changed for PRs, master push keeps validation', () => {
    const expectedCondition =
        /\(github\.event_name == 'push' && github\.ref == 'refs\/heads\/master'\)\s*\|\|\s*\n\s*\(github\.event_name == 'pull_request' &&\s*\n\s*needs\.classify\.outputs\.backend_changed == 'true'\)/;
    assert.match(RULES_JOB(), expectedCondition, 'rules-tests if-condition mismatch');
    assert.match(INTEGRATION_JOB(), expectedCondition, 'integration-tests if-condition mismatch');
});

test('engineering-only PR -> no E2E, no Rules, no Integration (only Test/Governance/Classify)', () => {
    // Each PR-gated job requires its surface boolean; engineering-only sets
    // frontend_changed=false AND backend_changed=false, so all three skip.
    for (const job of [E2E_JOB(), RULES_JOB(), INTEGRATION_JOB()]) {
        assert.match(job, /github\.event_name == 'pull_request'/);
    }
    assert.match(E2E_JOB(), /needs\.classify\.outputs\.frontend_changed == 'true'/);
    assert.match(RULES_JOB(), /needs\.classify\.outputs\.backend_changed == 'true'/);
    assert.match(INTEGRATION_JOB(), /needs\.classify\.outputs\.backend_changed == 'true'/);
});

test('CI-only PR -> no E2E, no Rules, no Integration (same gates as engineering-only)', () => {
    // Structural: the only PR-path E2E/emulator triggers are the surface
    // booleans, so a CI_INFRA PR (both booleans false) runs none of them.
    const prGatedConditions = CI_WORKFLOW.match(
        /github\.event_name == 'pull_request' &&\s*\n\s*needs\.classify\.outputs\.\w+_changed == 'true'/g,
    ) || [];
    assert.equal(prGatedConditions.length, 3, 'exactly three PR surface gates expected');
    assert.match(prGatedConditions.join('\n'), /frontend_changed == 'true'/);
    assert.match(prGatedConditions.join('\n'), /backend_changed == 'true'/);
});

test('backend-only PR -> Rules + Integration run, no E2E', () => {
    assert.match(RULES_JOB(), /needs\.classify\.outputs\.backend_changed == 'true'/);
    assert.match(INTEGRATION_JOB(), /needs\.classify\.outputs\.backend_changed == 'true'/);
    assert.doesNotMatch(E2E_JOB(), /backend_changed == 'true'/);
});

test('frontend-only PR -> bounded E2E runs, no Rules/Integration', () => {
    assert.match(E2E_JOB(), /github\.event_name == 'pull_request' &&\s*\n\s*needs\.classify\.outputs\.frontend_changed == 'true'/);
    // Emulator jobs trigger ONLY on backend_changed, never frontend_changed.
    assert.doesNotMatch(RULES_JOB(), /frontend_changed/);
    assert.doesNotMatch(INTEGRATION_JOB(), /frontend_changed/);
});

test('mixed frontend + backend PR -> Test, Rules, Integration, and bounded smoke all run', () => {
    // Additive booleans: mixed PR sets frontend_changed=true AND
    // backend_changed=true, satisfying all three PR gates simultaneously.
    assert.match(E2E_JOB(), /needs\.classify\.outputs\.frontend_changed == 'true'/);
    assert.match(RULES_JOB(), /needs\.classify\.outputs\.backend_changed == 'true'/);
    assert.match(INTEGRATION_JOB(), /needs\.classify\.outputs\.backend_changed == 'true'/);
});

test('master push preserves required Rules/Integration validation', () => {
    for (const job of [RULES_JOB(), INTEGRATION_JOB()]) {
        assert.match(job, /github\.event_name == 'push' && github\.ref == 'refs\/heads\/master'/);
    }
});

test('weekly scheduled regression remains independent of the surface gates', () => {
    const weekly = ciJob('scheduled-full-regression');
    assert.match(weekly, /if: github\.event_name == 'schedule'/);
    assert.match(weekly, /playwright test --shard/);
    assert.doesNotMatch(weekly, /needs\.classify/);
});

// ---------------------------------------------------------------------------
// Risk-based test execution (test job is surface-aware)
// ---------------------------------------------------------------------------

const TEST_JOB = () => ciJob('test');

test('Test job always lints and depends on classify', () => {
    const job = TEST_JOB();
    assert.match(job, /needs:\s*\[classify\]/);
    assert.match(job, /run: npm run lint/);
});

test('unit tests + query coverage are gated on frontend_changed / schedule', () => {
    const job = TEST_JOB();
    const gated = job.match(/needs\.classify\.outputs\.frontend_changed == 'true'/g) || [];
    // Both the unit-test step and the targeted query-coverage step must be
    // surface-gated so engineering-only/CI-only PRs skip the product suite.
    assert.ok(gated.length >= 2, `expected >=2 frontend_changed gates, found ${gated.length}`);
    assert.match(job, /github\.event_name == 'schedule'/);
});

test('expensive full-repo module coverage runs only on the scheduled regression', () => {
    const job = TEST_JOB();
    const idx = job.indexOf('Generate module coverage report');
    assert.ok(idx !== -1, 'module coverage step must exist');
    const step = job.slice(idx);
    assert.match(step, /if: github\.event_name == 'schedule'/);
    // It must never be an unconditional PR step.
    assert.doesNotMatch(job, /- name: Generate module coverage report\n\s+run:/);
});

test('Test job keeps the shared toolchain (functions deps) available', () => {
    assert.match(TEST_JOB(), /working-directory: functions/);
});