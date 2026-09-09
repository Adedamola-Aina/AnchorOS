'use strict';

/**
 * Focused tests for the deployment-surface classifier and release pipeline
 * guardrails. Run: node --test scripts/ci/deploy-surface.node-suite.mjs
 *
 * Covers (release-infra PR "make release pipeline incremental and fail-fast"):
 *  - change classification per deployment surface
 *  - backend-only B1 surfaces (rules first, then 5 named functions)
 *  - frontend-only surfaces
 *  - docs/CI-only → no product deployment
 *  - fail-safe behaviors (empty changed set)
 *  - release smoke config is fail-fast
 *  - production remains approval-gated (environment: production)
 *  - staging deploy is validation-gated (awaits CI/CD Pipeline success)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { classifySurfaces, FUNCTIONS_ALLOW_LIST_DEFAULT } from './deploy-surface-classifier.js';
import { pickLastDeployedSha } from './last-deployed-sha.js';

const B1_ALLOW_LIST = [...FUNCTIONS_ALLOW_LIST_DEFAULT];

// ---------------------------------------------------------------------------
// Surface classification
// ---------------------------------------------------------------------------

test('rules-only change deploys the rules surface only', () => {
    const r = classifySurfaces(['config/firestore.rules'], null);
    assert.deepEqual(
        { hosting: r.hosting, rules: r.rules, indexes: r.indexes, functions: r.functions },
        { hosting: false, rules: true, indexes: false, functions: false },
    );
    assert.equal(r.ciOnly, false);
});

test('storage rules change is classified with the rules surface', () => {
    const r = classifySurfaces(['config/storage.rules'], null);
    assert.equal(r.rules, true);
    assert.equal(r.hosting, false);
});

test('functions-only change deploys the functions surface only', () => {
    const r = classifySurfaces(['functions/src/index.ts'], null);
    assert.equal(r.functions, true);
    assert.equal(r.hosting, false);
    assert.equal(r.rules, false);
});

test('frontend-only change deploys hosting only (no Functions/rules)', () => {
    const r = classifySurfaces(['src/App.tsx', 'index.html'], null);
    assert.deepEqual(
        { hosting: r.hosting, rules: r.rules, indexes: r.indexes, functions: r.functions },
        { hosting: true, rules: false, indexes: false, functions: false },
    );
});

test('backend-only B1 change deploys rules first, then only the 5 named functions', () => {
    const files = [
        'config/firestore.rules',
        'functions/src/familyInvitations.ts',
        'functions/src/migrations.ts',
    ];
    const r = classifySurfaces(files, B1_ALLOW_LIST);
    assert.equal(r.rules, true);
    assert.equal(r.hosting, false);
    assert.equal(r.indexes, false);
    assert.equal(r.functions, true);
    assert.deepEqual(r.functionsToDeploy, [
        'disconnectFamily', 'getMigrationStatus', 'listMigrations', 'runMigration', 'shareAccount',
    ]);
});

test('mixed change deploys the union of touched surfaces', () => {
    const r = classifySurfaces(['src/App.tsx', 'config/firestore.rules', 'functions/src/index.ts'], null);
    assert.equal(r.hosting, true);
    assert.equal(r.rules, true);
    assert.equal(r.functions, true);
    assert.equal(r.ciOnly, false);
});

test('docs-only change deploys nothing (ciOnly)', () => {
    const r = classifySurfaces(['docs/README.md', 'AGENTS.md'], null);
    assert.equal(r.ciOnly, true);
    assert.equal(r.hosting, false);
    assert.equal(r.rules, false);
    assert.equal(r.functions, false);
});

test('CI-only change deploys nothing (ciOnly)', () => {
    const r = classifySurfaces(['.github/workflows/ci.yml', 'scripts/ci/deploy-surface-classifier.js'], null);
    assert.equal(r.ciOnly, true);
});

test('missing/undeterminable changed set FAILS CLOSED (never an automatic mutation plan)', () => {
    const r = classifySurfaces([], null);
    assert.equal(r.failClosed, true);
    assert.deepEqual(
        { hosting: r.hosting, rules: r.rules, indexes: r.indexes, functions: r.functions },
        { hosting: false, rules: false, indexes: false, functions: false },
    );
    assert.equal(r.ciOnly, false);
});

test('functions allow-list is respected and sorted deterministically', () => {
    const r = classifySurfaces(['functions/src/index.ts'], ['shareAccount', 'disconnectFamily']);
    assert.deepEqual(r.functionsToDeploy, ['disconnectFamily', 'shareAccount']);
    assert.deepEqual([...FUNCTIONS_ALLOW_LIST_DEFAULT].sort(), [
        'disconnectFamily', 'getMigrationStatus', 'listMigrations', 'runMigration', 'shareAccount',
    ]);
});

test('firebase.json deployment-config change fails safe to the full backend set', () => {
    const r = classifySurfaces(['firebase.json'], null);
    assert.equal(r.rules, true);
    assert.equal(r.indexes, true);
    assert.equal(r.functions, true);
    assert.equal(r.hosting, false);
});

// ---------------------------------------------------------------------------
// Last-deployed-SHA selection
// ---------------------------------------------------------------------------

test('last successful run wins regardless of list order', () => {
    const sha = pickLastDeployedSha([
        { conclusion: 'failure', headSha: 'aaaa1111', createdAt: '2026-09-09T10:00:00Z' },
        { conclusion: 'success', headSha: 'bbbb2222', createdAt: '2026-09-09T09:00:00Z' },
        { conclusion: 'success', headSha: 'cccc3333', createdAt: '2026-09-09T11:00:00Z' },
    ]);
    assert.equal(sha, 'cccc3333');
});

test('a previously failed deployment yields no SHA, forcing FAIL CLOSED (bootstrap_required)', () => {
    const sha = pickLastDeployedSha([
        { conclusion: 'failure', headSha: 'aaaa1111', createdAt: '2026-09-09T10:00:00Z' },
        { conclusion: 'cancelled', headSha: 'bbbb2222', createdAt: '2026-09-09T11:00:00Z' },
    ]);
    assert.equal(sha, '');
});

// ---------------------------------------------------------------------------
// Workflow guardrails (static assertions on the workflow YAML text)
// ---------------------------------------------------------------------------

const STAGING_WORKFLOW = fs.readFileSync('.github/workflows/staging.yml', 'utf8');
const CI_WORKFLOW = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
const PRODUCTION_WORKFLOW = fs.readFileSync('.github/workflows/production.yml', 'utf8');

test('staging deploy waits for CI validation of the same SHA before deploying', () => {
    assert.match(STAGING_WORKFLOW, /await-validation/);
    assert.match(STAGING_WORKFLOW, /--workflow ci\.yml/);
    assert.match(STAGING_WORKFLOW, /workflow_run\.head_sha|headSha/);
});

test('staging deploy does not rerun the full validation suite inside the pipeline', () => {
    assert.match(STAGING_WORKFLOW, /--skip-lint/);
    assert.match(STAGING_WORKFLOW, /--skip-audit/);
    assert.match(STAGING_WORKFLOW, /--skip-tests/);
    assert.match(STAGING_WORKFLOW, /--skip-version-bump/);
    assert.match(STAGING_WORKFLOW, /--no-deploy-marker/);
});

test('staging deploy is surface-aware (classifier wired in)', () => {
    assert.match(STAGING_WORKFLOW, /deploy-surface-classifier\.js/);
    assert.match(STAGING_WORKFLOW, /--surfaces=/);
});

test('staging deploy always uploads failure diagnostics', () => {
    assert.match(STAGING_WORKFLOW, /release-smoke-artifacts/);
});

test('release smoke config is fail-fast: 0 retries, 20s tests, 3-minute bound, chromium only', () => {
    const cfg = fs.readFileSync('config/playwright.release-smoke.config.ts', 'utf8');
    assert.match(cfg, /retries:\s*0/);
    assert.match(cfg, /timeout:\s*20000/);
    assert.match(cfg, /globalTimeout:\s*3\s*\*\s*60\s*\*\s*1000/);
    assert.match(cfg, /release-auth/);
    // Chromium only: the config must not declare other device projects.
    assert.doesNotMatch(cfg, /devices\['iPhone|devices\['Desktop Firefox|webkit/);
    // Storage state must carry IndexedDB (Firebase Auth persistence).
    assert.match(cfg, /storageState/);
    const setup = fs.readFileSync('e2e/release-auth.setup.ts', 'utf8');
    assert.match(setup, /indexedDB:\s*true/);
});

test('release smoke never signs up automatically', () => {
    const setup = fs.readFileSync('e2e/release-auth.setup.ts', 'utf8');
    assert.doesNotMatch(setup, /Create Account/);
    assert.match(setup, /NO automatic signup/);
});

test('production remains approval-gated via the GitHub production environment', () => {
    const deployBlock = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('deploy-production'));
    assert.match(deployBlock, /environment:\s*production/);
    assert.match(deployBlock, /needs:/);
});

test('backend-only normal production: no Hosting build and no Lighthouse', () => {
    const buildBlock = PRODUCTION_WORKFLOW.slice(
        PRODUCTION_WORKFLOW.indexOf('  build-production:'),
        PRODUCTION_WORKFLOW.indexOf('  lighthouse:'),
    );
    assert.match(buildBlock, /deploy_hosting == 'true'/);
    const lighthouseBlock = PRODUCTION_WORKFLOW.slice(
        PRODUCTION_WORKFLOW.indexOf('  lighthouse:'),
        PRODUCTION_WORKFLOW.indexOf('  deploy-production:'),
    );
    assert.match(lighthouseBlock, /deploy_hosting == 'true'/);
    assert.match(lighthouseBlock, /needs.build-production.result == 'success'/);
});

test('backend-only normal production still reaches deploy-production when build/lighthouse are skipped', () => {
    const deployBlock = PRODUCTION_WORKFLOW.slice(
        PRODUCTION_WORKFLOW.indexOf('  deploy-production:'),
        PRODUCTION_WORKFLOW.indexOf('  deploy-b1:'),
    );
    const gate = deployBlock.slice(deployBlock.indexOf('if: >-'), deployBlock.indexOf('environment:'));

    // Plan must have succeeded and the run must not be CI-only.
    assert.match(gate, /needs\.plan\.result == 'success'/);
    assert.match(gate, /ci_only != 'true'/);

    // THE FIX: a skipped Hosting build (backend-only plan) must not block the
    // normal production deploy — success OR skipped is accepted.
    assert.match(
        gate,
        /\(needs\.build-production\.result == 'success' \|\| needs\.build-production\.result == 'skipped'\)/,
    );
    assert.match(
        gate,
        /\(needs\.lighthouse\.result == 'success' \|\| needs\.lighthouse\.result == 'skipped'\)/,
    );
    // No regression: build/lighthouse must remain skipped (not run) for
    // backend-only changes — the fix only opens the deploy gate.
    const buildBlock = PRODUCTION_WORKFLOW.slice(
        PRODUCTION_WORKFLOW.indexOf('  build-production:'),
        PRODUCTION_WORKFLOW.indexOf('  lighthouse:'),
    );
    assert.match(buildBlock, /deploy_hosting == 'true'/);
    const lighthouseBlock = PRODUCTION_WORKFLOW.slice(
        PRODUCTION_WORKFLOW.indexOf('  lighthouse:'),
        PRODUCTION_WORKFLOW.indexOf('  deploy-production:'),
    );
    assert.match(lighthouseBlock, /deploy_hosting == 'true'/);
    assert.match(lighthouseBlock, /needs\.build-production\.result == 'success'/);
});

test('both production smoke paths install Chromium before invoking the release-smoke config', () => {
    // Exactly two production release-smoke invocations (normal + B1).
    const smokeInvocations = PRODUCTION_WORKFLOW.match(
        /npx playwright test --config config\/playwright\.release-smoke\.config\.ts/g,
    ) || [];
    assert.equal(smokeInvocations.length, 2, 'expected exactly two production release-smoke invocations');

    // Each invocation must be immediately preceded by an explicit Chromium
    // install (matches staging's deterministic behavior).
    const pairs = PRODUCTION_WORKFLOW.match(
        /npx playwright install chromium --with-deps[\s\S]*?npx playwright test --config config\/playwright\.release-smoke\.config\.ts/g,
    ) || [];
    assert.equal(pairs.length, 2, 'each production release-smoke invocation must be preceded by a Chromium install');

    // Chromium only — no browser expansion.
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /webkit|firefox/i);
});

test('production pipeline skips rerunning CI validation inside deployment', () => {
    const deployBlock = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('deploy-production'));
    assert.match(deployBlock, /--skip-tests/);
    assert.match(deployBlock, /--skip-lint/);
    assert.match(deployBlock, /--skip-e2e/);
    assert.match(deployBlock, /--skip-version-bump/);
    assert.match(deployBlock, /--no-deploy-marker/);
});

// ---------------------------------------------------------------------------
// Environment retirement guardrails
// ---------------------------------------------------------------------------

test('indexes-only change deploys the indexes surface only', () => {
    const r = classifySurfaces(['config/firestore.indexes.json'], null);
    assert.deepEqual(
        { hosting: r.hosting, rules: r.rules, indexes: r.indexes, functions: r.functions },
        { hosting: false, rules: false, indexes: true, functions: false },
    );
    assert.equal(r.ciOnly, false);
});

test('failed deploys after the last success do not hide missed surfaces (gap resolves to older success)', () => {
    const sha = pickLastDeployedSha([
        { conclusion: 'success', headSha: 'old-good', createdAt: '2026-09-01T09:00:00Z' },
        { conclusion: 'failure', headSha: 'bad-1', createdAt: '2026-09-08T10:00:00Z' },
        { conclusion: 'failure', headSha: 'bad-2', createdAt: '2026-09-08T11:00:00Z' },
    ]);
    assert.equal(sha, 'old-good');
});

test('deploy pipeline has no development cloud references', () => {
    const pipeline = fs.readFileSync('scripts/DEPLOY_PIPELINE.sh', 'utf8');
    assert.doesNotMatch(pipeline, /anchor-os-dev-1c6ec/);
    assert.doesNotMatch(pipeline, /--env=development/);
    assert.doesNotMatch(pipeline, /localhost:3001/);
    assert.match(pipeline, /no deployable development cloud/i);
});

test('firebaserc and package.json have no deployable dev cloud', () => {
    const rc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
    assert.deepEqual(Object.keys(rc.projects).sort(), ['default', 'production', 'staging']);
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    assert.equal(pkg.scripts['deploy:dev'], undefined);
    // A local development build remains (LOCAL development, not a cloud target).
    assert.ok(pkg.scripts['build:dev']);
});

test('seed script is hard-gated to the local emulators', () => {
    const seed = fs.readFileSync('scripts/seed-dev-data.cjs', 'utf8');
    assert.doesNotMatch(seed, /anchor-os-dev-1c6ec/);
    assert.match(seed, /FIRESTORE_EMULATOR_HOST/);
    assert.match(seed, /FIREBASE_AUTH_EMULATOR_HOST/);
    assert.match(seed, /Refusing to seed/);
});

test('ci workflow has no dev-cloud deploy job', () => {
    assert.doesNotMatch(CI_WORKFLOW, /anchor-os-dev-1c6ec/);
    assert.doesNotMatch(CI_WORKFLOW, /FIREBASE_SERVICE_ACCOUNT_DEV/);
    assert.doesNotMatch(CI_WORKFLOW, /build-dev|deploy-dev/);
});

test('functions resolve CORS/RP origins without the retired dev cloud', () => {
    const callable = fs.readFileSync('functions/src/callable.ts', 'utf8');
    const passkey = fs.readFileSync('functions/src/passkeyAuthHelpers.ts', 'utf8');
    const config = fs.readFileSync('functions/src/config.ts', 'utf8');
    for (const src of [callable, passkey, config]) {
        assert.doesNotMatch(src, /anchor-os-dev-1c6ec/);
    }
    // Local emulator origins remain allowed.
    assert.match(callable, /http:\/\/localhost:5173/);
    assert.match(passkey, /http:\/\/localhost:5173/);
});

// ---------------------------------------------------------------------------
// Staging authorization model
// ---------------------------------------------------------------------------

test('staging deploy is triggered ONLY by explicit operator dispatch (push/merge cannot mutate staging)', () => {
    const trigger = STAGING_WORKFLOW.slice(0, STAGING_WORKFLOW.indexOf('permissions:'));
    assert.match(STAGING_WORKFLOW, /workflow_dispatch:/);
    assert.doesNotMatch(trigger, /push:/);
    assert.match(STAGING_WORKFLOW, /required: true/); // exact SHA input is mandatory
    assert.match(STAGING_WORKFLOW, /authorize_bootstrap/);
});

test('requested SHA must be authorized master history and CI-validated for that exact SHA', () => {
    assert.match(STAGING_WORKFLOW, /resolve-sha/);
    assert.match(STAGING_WORKFLOW, /merge-base --is-ancestor/);
    assert.match(STAGING_WORKFLOW, /is not the current master tip/);
    assert.match(STAGING_WORKFLOW, /needs: \[resolve-sha\]/);
    assert.match(STAGING_WORKFLOW, /needs\.resolve-sha\.outputs\.sha/);
    assert.match(STAGING_WORKFLOW, /--workflow ci\.yml/);
});

test('missing staging baseline FAILS CLOSED with bootstrap_required (never ALL surfaces)', () => {
    assert.match(STAGING_WORKFLOW, /bootstrap_required/);
    assert.match(STAGING_WORKFLOW, /inputs\.authorize_bootstrap/);
    assert.match(STAGING_WORKFLOW, /An unknown baseline is NEVER treated as/);
    // No hidden baseline guessing remains (only the documented "never HEAD~1" contract).
    assert.doesNotMatch(STAGING_WORKFLOW, /rev-parse HEAD~|rev-list --max-parents=0/);
    assert.doesNotMatch(STAGING_WORKFLOW, /failing safe to ALL surfaces/);
});

test('Functions deployments are always bounded by the exact B1 allow-list', () => {
    const list = /disconnectFamily,shareAccount,runMigration,listMigrations,getMigrationStatus/;
    assert.match(STAGING_WORKFLOW, list);
    assert.match(PRODUCTION_WORKFLOW, list);
    assert.match(STAGING_WORKFLOW, /functions_to_deploy=\$FN_ALLOW/);
    for (const wf of [STAGING_WORKFLOW, PRODUCTION_WORKFLOW]) {
        assert.match(wf, /--functions="\$FN_ALLOW"/);
    }
});

test('classifier emits fail_closed and treats it as no-deployment for workflow gating', () => {
    const classifierSrc = fs.readFileSync('scripts/ci/deploy-surface-classifier.js', 'utf8');
    assert.match(classifierSrc, /failClosed: true/);
    assert.match(classifierSrc, /ci_only=\$\{result\.failClosed \|\| result\.ciOnly\}/);
});

test('general E2E config excludes release-smoke specs (they need the release config auth state)', () => {
    const cfg = fs.readFileSync('config/playwright.config.ts', 'utf8');
    assert.match(cfg, /testIgnore:\s*\/release-\//);
    // The release config still owns them.
    const releaseCfg = fs.readFileSync('config/playwright.release-smoke.config.ts', 'utf8');
    assert.match(releaseCfg, /release-smoke/);
    assert.match(releaseCfg, /storageState/);
});


// ---------------------------------------------------------------------------
// Workflow topology (lean core)
// ---------------------------------------------------------------------------

const WORKFLOW_DIR = '.github/workflows';

function workflowFiles() {
    return fs.readdirSync(WORKFLOW_DIR).filter((f) => f.endsWith('.yml')).sort();
}

test('exactly three normal workflows: ci.yml, staging.yml, production.yml', () => {
    assert.deepEqual(workflowFiles(), ['ci.yml', 'production.yml', 'staging.yml']);
});

test('merge gate, weekly health and failure-email workflows are deleted (no duplicate executors)', () => {
    for (const gone of ['merge-gate.yml', 'weekly-health.yml', 'ci-failure-email.yml']) {
        assert.ok(!fs.existsSync(`${WORKFLOW_DIR}/${gone}`), `${gone} must not exist`);
    }
});

test('PR CI runs no deployments and no emulators for docs/CI-only changes', () => {
    assert.doesNotMatch(CI_WORKFLOW, /firebase deploy|npm run deploy:|deploy-production|deploy-staging/);
    assert.match(CI_WORKFLOW, /governance-gates/);
    assert.match(CI_WORKFLOW, /scheduled-full-regression/);
    assert.match(CI_WORKFLOW, /github.event_name == 'schedule'/);
});

test('production remains approval-gated and fail-closed on missing baseline', () => {
    assert.match(PRODUCTION_WORKFLOW, /environment:\s*production/);
    assert.match(PRODUCTION_WORKFLOW, /bootstrap_required/);
    assert.match(PRODUCTION_WORKFLOW, /authorize_bootstrap/);
    assert.match(PRODUCTION_WORKFLOW, /--workflow production\.yml/);
    assert.match(PRODUCTION_WORKFLOW, /--title-prefix "Production normal"/);
});

// ---------------------------------------------------------------------------
// Release-safety correction: phased B1 + manual production
// ---------------------------------------------------------------------------

test('production is manual only: no push trigger', () => {
    const trigger = PRODUCTION_WORKFLOW.slice(0, PRODUCTION_WORKFLOW.indexOf('permissions:'));
    assert.match(PRODUCTION_WORKFLOW, /workflow_dispatch:/);
    assert.doesNotMatch(trigger, /push:/);
    assert.match(PRODUCTION_WORKFLOW, /run-name: 'Production/);
});

test('production workflow can never push, commit, or version-bump master', () => {
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /git push origin master/);
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /npm version/);
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /version-bump:/);
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /git commit/);
    assert.match(PRODUCTION_WORKFLOW, /permissions:/);
    assert.match(PRODUCTION_WORKFLOW.slice(0, PRODUCTION_WORKFLOW.indexOf('jobs:')), /contents: read/);
});

test('staging B1 is ONE mutation job: rules invocation before the exact-five Functions invocation', () => {
    assert.match(STAGING_WORKFLOW, /\n  deploy-b1:\n/);
    assert.doesNotMatch(STAGING_WORKFLOW, /deploy-b1-rules|deploy-b1-functions/);
    const b1Block = STAGING_WORKFLOW.slice(STAGING_WORKFLOW.indexOf('  deploy-b1:'));
    const rulesIdx = b1Block.indexOf('--surfaces=rules');
    const fnIdx = b1Block.indexOf('--surfaces=functions');
    assert.ok(rulesIdx !== -1 && fnIdx !== -1, 'both B1 invocations must exist');
    assert.ok(rulesIdx < fnIdx, 'rules must be deployed before Functions');
    assert.match(b1Block, /--functions="\$FN_ALLOW"/);
    assert.match(b1Block, /disconnectFamily,shareAccount,runMigration,listMigrations,getMigrationStatus/);
});

test('production B1 is ONE mutation job: rules invocation before the exact-five Functions invocation', () => {
    assert.match(PRODUCTION_WORKFLOW, /\n  deploy-b1:\n/);
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /deploy-b1-rules|deploy-b1-functions/);
    const b1Block = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('  deploy-b1:'));
    const rulesIdx = b1Block.indexOf('--surfaces=rules');
    const fnIdx = b1Block.indexOf('--surfaces=functions');
    assert.ok(rulesIdx !== -1 && fnIdx !== -1, 'both B1 invocations must exist');
    assert.ok(rulesIdx < fnIdx, 'rules must be deployed before Functions');
    assert.match(b1Block, /--functions="\$FN_ALLOW"/);
    assert.match(b1Block, /disconnectFamily,shareAccount,runMigration,listMigrations,getMigrationStatus/);
});

test('B1 mode never deploys Hosting or indexes', () => {
    const stagingB1 = STAGING_WORKFLOW.slice(
        STAGING_WORKFLOW.indexOf('  deploy-b1:'),
        STAGING_WORKFLOW.indexOf('  release-smoke-b1:'),
    );
    // The only B1 firebase invocations are rules-only and functions-only.
    assert.match(stagingB1, /--surfaces=rules/);
    assert.match(stagingB1, /--surfaces=functions/);
    assert.doesNotMatch(stagingB1, /--surfaces=hosting|--surfaces=.*indexes/);
    const productionB1 = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('  deploy-b1:'));
    assert.match(productionB1, /--surfaces=rules/);
    assert.match(productionB1, /--surfaces=functions/);
    assert.doesNotMatch(productionB1, /--surfaces=hosting|--surfaces=.*indexes/);
    // The B1 plan explicitly disables the Hosting and index surfaces.
    const stagingB1Plan = STAGING_WORKFLOW.slice(
        STAGING_WORKFLOW.indexOf('Compute deployment plan'),
        STAGING_WORKFLOW.indexOf('deploy-surface-classifier.js'),
    );
    assert.match(stagingB1Plan, /deploy_hosting=false/);
    assert.match(stagingB1Plan, /deploy_indexes=false/);
    const productionB1Plan = PRODUCTION_WORKFLOW.slice(
        PRODUCTION_WORKFLOW.indexOf('Compute deployment plan'),
        PRODUCTION_WORKFLOW.indexOf('deploy-surface-classifier.js'),
    );
    assert.match(productionB1Plan, /deploy_hosting=false/);
    assert.match(productionB1Plan, /deploy_indexes=false/);
});

test('B1 successful runs never become normal deployment baselines (unit)', () => {
    const sha = pickLastDeployedSha([
        { conclusion: 'success', headSha: 'b1partial', createdAt: '2026-09-10T12:00:00Z', displayTitle: 'Staging b1 abc1234' },
        { conclusion: 'success', headSha: 'normgood', createdAt: '2026-09-09T09:00:00Z', displayTitle: 'Staging normal def5678' },
    ], { titlePrefix: 'Staging normal' });
    assert.equal(sha, 'normgood');
    // Without the prefix filter the newer B1 run would (incorrectly) win.
    assert.equal(pickLastDeployedSha([
        { conclusion: 'success', headSha: 'b1partial', createdAt: '2026-09-10T12:00:00Z', displayTitle: 'Staging b1 abc1234' },
        { conclusion: 'success', headSha: 'normgood', createdAt: '2026-09-09T09:00:00Z', displayTitle: 'Staging normal def5678' },
    ]), 'b1partial');
});

test('normal baseline lookups filter by run-name prefix in both workflows', () => {
    assert.match(STAGING_WORKFLOW, /--title-prefix "Staging normal"/);
    assert.match(PRODUCTION_WORKFLOW, /--title-prefix "Production normal"/);
    const lds = fs.readFileSync('scripts/ci/last-deployed-sha.js', 'utf8');
    assert.match(lds, /--title-prefix/);
    assert.match(lds, /displayTitle/);
});

test('run names carry mode + SHA for provenance', () => {
    assert.match(STAGING_WORKFLOW, /run-name: 'Staging \$\{\{ inputs\.mode \}\} \$\{\{ inputs\.sha \}\}'/);
    assert.match(PRODUCTION_WORKFLOW, /run-name: 'Production \$\{\{ inputs\.mode \}\} \$\{\{ inputs\.sha \}\}'/);
});

test('production exact SHA requires same-mode staging success for the same SHA', () => {
    assert.match(PRODUCTION_WORKFLOW, /--workflow staging\.yml/);
    assert.match(PRODUCTION_WORKFLOW, /Staging \$\{MODE\} \$\{SHA\}/);
    assert.match(PRODUCTION_WORKFLOW, /same-mode staging success|same-SHA, same-mode staging success/);
    assert.match(PRODUCTION_WORKFLOW, /needs: \[resolve-sha, await-validation\]/);
});

test('every production mutation enters the production approval environment', () => {
    const deployBlock = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('  deploy-production:'));
    assert.match(deployBlock, /environment:\s*production/);
    const b1Block = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('  deploy-b1:'));
    assert.match(b1Block, /environment:\s*production/);
});

test('production normal bootstrap still fails closed with bootstrap_required', () => {
    assert.match(PRODUCTION_WORKFLOW, /bootstrap_required/);
    assert.match(PRODUCTION_WORKFLOW, /inputs\.authorize_bootstrap/);
    assert.match(PRODUCTION_WORKFLOW, /An unknown baseline is NEVER treated as/);
});

// ---------------------------------------------------------------------------
// Final release-orchestration invariants (exact-SHA execution)
// ---------------------------------------------------------------------------

test('dispatch is rejected for non-master workflow refs (both deploy workflows)', () => {
    for (const wf of [STAGING_WORKFLOW, PRODUCTION_WORKFLOW]) {
        assert.match(wf, /!= "refs\/heads\/master"/);
        assert.match(wf, /may only run from refs\/heads\/master/);
    }
});

test('all deployment jobs check out the authorized exact SHA explicitly', () => {
    for (const wf of [STAGING_WORKFLOW, PRODUCTION_WORKFLOW]) {
        const refs = wf.match(/ref: \$\{\{ needs\.plan\.outputs\.sha \}\}/g) || [];
        assert.ok(refs.length >= 4, `expected >=4 exact-SHA checkouts, got ${refs.length}`);
    }
});

test('normal mode never passes the B1 allow-list to the classifier', () => {
    const stagingClassifier = STAGING_WORKFLOW.match(/node scripts\/ci\/deploy-surface-classifier\.js --from "\$BASE".*/);
    assert.ok(stagingClassifier, 'staging normal classifier invocation must exist');
    assert.doesNotMatch(stagingClassifier[0], /--functions|FN_ALLOW/);
    const productionClassifier = PRODUCTION_WORKFLOW.match(/node scripts\/ci\/deploy-surface-classifier\.js --from "\$BASE".*/);
    assert.ok(productionClassifier, 'production normal classifier invocation must exist');
    assert.doesNotMatch(productionClassifier[0], /--functions|FN_ALLOW/);
});

test('authorized normal staging bootstrap selects all four surfaces with an unfiltered Functions surface', () => {
    const bootstrap = STAGING_WORKFLOW.slice(
        STAGING_WORKFLOW.indexOf('Authorized normal bootstrap plan'),
        STAGING_WORKFLOW.indexOf('  build-hosting:'),
    );
    assert.match(bootstrap, /deploy_hosting=true/);
    assert.match(bootstrap, /deploy_rules=true/);
    assert.match(bootstrap, /deploy_indexes=true/);
    assert.match(bootstrap, /deploy_functions=true/);
    // Empty functions filter == the NORMAL Functions surface, never the B1 five.
    assert.match(bootstrap, /functions_to_deploy="/);
    assert.doesNotMatch(bootstrap, /FN_ALLOW/);
});

test('baseline lookup fetches bounded multi-run history, never --limit 1', () => {
    const lds = fs.readFileSync('scripts/ci/last-deployed-sha.js', 'utf8');
    assert.match(lds, /'--limit', '1000'/);
    assert.doesNotMatch(lds, /'--limit', '1'/);
});

test('B1 mutation job writes BOTH env files before the first deploy invocation', () => {
    const stagingB1 = STAGING_WORKFLOW.slice(STAGING_WORKFLOW.indexOf('  deploy-b1:'));
    const rulesIdx = stagingB1.indexOf('--surfaces=rules');
    assert.ok(stagingB1.indexOf('> .env.staging') !== -1, 'app env file must be written');
    const fnEnvIdx = stagingB1.indexOf('functions/.env.staging');
    assert.ok(fnEnvIdx !== -1, 'functions env file must be written');
    assert.ok(stagingB1.indexOf('> .env.staging') < rulesIdx && fnEnvIdx < rulesIdx, 'env files must precede deployment');
    const productionB1 = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('  deploy-b1:'));
    const pRulesIdx = productionB1.indexOf('--surfaces=rules');
    assert.ok(productionB1.indexOf('> .env.production') !== -1, 'app env file must be written');
    const pFnEnvIdx = productionB1.indexOf('functions/.env.production');
    assert.ok(pFnEnvIdx !== -1, 'functions env file must be written');
    assert.ok(productionB1.indexOf('> .env.production') < pRulesIdx && pFnEnvIdx < pRulesIdx, 'env files must precede deployment');
});

test('production normal plan classifies from the normal baseline, never requested-SHA-vs-HEAD', () => {
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /--from "\$\{\{ needs\.resolve-sha/);
    const planStep = PRODUCTION_WORKFLOW.slice(PRODUCTION_WORKFLOW.indexOf('Compute deployment plan'));
    assert.match(planStep, /deploy-surface-classifier\.js --from "\$BASE"/);
    // The baseline itself is resolved from the normal production run titles.
    assert.match(PRODUCTION_WORKFLOW, /--title-prefix "Production normal"/);
});
