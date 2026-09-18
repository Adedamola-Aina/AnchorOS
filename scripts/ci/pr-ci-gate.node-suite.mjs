'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const CI = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
const RELEASE = fs.readFileSync('config/playwright.release-smoke.config.ts', 'utf8');

function job(name) {
    const start = CI.indexOf(`  ${name}:`);
    assert.ok(start >= 0, `missing CI job ${name}`);
    const rest = CI.slice(start + 2);
    const next = rest.search(/\n {2}(?=\S)/);
    return CI.slice(start, next < 0 ? undefined : start + 2 + next);
}

test('PR concurrency cancels obsolete runs but never cancels master validation', () => {
    assert.match(CI, /concurrency:/);
    assert.match(CI, /github\.event\.pull_request\.number \|\| github\.ref/);
    assert.match(CI, /cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}/);
});

test('CI-only path is cheap and isolated from product jobs', () => {
    const ci = job('ci-infra');
    assert.match(ci, /node --test scripts\/ci\/\*\.node-suite\.mjs/);
    assert.doesNotMatch(ci, /npm ci|playwright|firebase emulators|test:run|test:integration/);
    assert.match(ci, /ci_infra_changed == 'true'/);
});

test('docs-only path requires no dependency install job', () => {
    assert.match(CI, /engineering_code_changed == 'true'/);
    assert.doesNotMatch(job('governance-gates'), /npm ci/);
    assert.doesNotMatch(job('classify'), /npm ci/);
});

test('frontend validation is isolated and query coverage is targeted', () => {
    const frontend = job('frontend-checks');
    assert.match(frontend, /frontend_changed == 'true'/);
    assert.match(frontend, /npm run test:run/);
    assert.match(frontend, /npx tsc -b/);
    assert.match(frontend, /query_changed == 'true'/);
    assert.doesNotMatch(frontend, /working-directory: functions|test:integration/);
});

test('Functions validation runs only for the Functions surface', () => {
    const backend = job('backend-checks');
    assert.match(backend, /functions_changed == 'true'/);
    assert.match(backend, /working-directory: functions/);
    assert.match(backend, /Functions unit tests/);
});

test('rules validation runs only for security-rule surface', () => {
    const rules = job('rules-tests');
    assert.match(rules, /rules_changed == 'true'/);
    assert.match(rules, /test:rules:ci/);
    assert.doesNotMatch(rules, /github\.event_name == 'push'/);
});

test('backend integration runs for Functions or rules changes, not every master push', () => {
    const integration = job('integration-tests');
    assert.match(integration, /functions_changed == 'true'/);
    assert.match(integration, /rules_changed == 'true'/);
    assert.doesNotMatch(integration, /github\.event_name == 'push'/);
});

test('bounded smoke is runtime-risk based and PR-only', () => {
    const smoke = job('e2e-tests');
    assert.match(smoke, /github\.event_name == 'pull_request'/);
    assert.match(smoke, /smoke_required == 'true'/);
    assert.match(smoke, /test:release-smoke/);
    assert.doesNotMatch(smoke, /test:e2e/);
});

test('release smoke remains bounded and Chromium-only', () => {
    assert.match(RELEASE, /retries:\s*0/);
    assert.match(RELEASE, /globalTimeout:\s*3\s*\*\s*60\s*\*\s*1000/);
    assert.doesNotMatch(RELEASE, /Desktop Firefox|webkit|iPhone/);
});

test('full module coverage runs only in scheduled-quality', () => {
    assert.match(job('scheduled-quality'), /test:coverage:modules/);
    for (const name of ['ci-infra','engineering-checks','frontend-checks','backend-checks','rules-tests','integration-tests','e2e-tests']) {
        assert.doesNotMatch(job(name), /test:coverage:modules/);
    }
});

test('weekly full E2E regression remains scheduled', () => {
    const weekly = job('scheduled-full-regression');
    assert.match(weekly, /github\.event_name == 'schedule'/);
    // Hermetic + canonical (issue #143): the local runner always passes the
    // explicit Playwright --config, so the run can never fall back to default
    // discovery and collect the Vitest suites.
    assert.match(weekly, /npm run test:e2e:local -- --shard=/);
    assert.doesNotMatch(weekly, /E2E_BASE_URL/);
});

test('CI contains no deployment command', () => {
    assert.doesNotMatch(CI, /firebase deploy|npm run deploy:staging|npm run deploy:production/);
});
