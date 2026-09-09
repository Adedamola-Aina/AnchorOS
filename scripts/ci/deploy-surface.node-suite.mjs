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
    const r = classifySurfaces(['.github/workflows/ci-cd.yml', 'scripts/ci/deploy-surface-classifier.js'], null);
    assert.equal(r.ciOnly, true);
});

test('unknown/empty changed set fails safe to deploying all surfaces', () => {
    const r = classifySurfaces([], null);
    assert.equal(r.hosting, true);
    assert.equal(r.rules, true);
    assert.equal(r.indexes, true);
    assert.equal(r.functions, true);
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

test('a previously failed deployment yields no SHA, forcing a full-surface deploy', () => {
    const sha = pickLastDeployedSha([
        { conclusion: 'failure', headSha: 'aaaa1111', createdAt: '2026-09-09T10:00:00Z' },
        { conclusion: 'cancelled', headSha: 'bbbb2222', createdAt: '2026-09-09T11:00:00Z' },
    ]);
    assert.equal(sha, '');
});

// ---------------------------------------------------------------------------
// Workflow guardrails (static assertions on the workflow YAML text)
// ---------------------------------------------------------------------------

const STAGING_WORKFLOW = fs.readFileSync('.github/workflows/staging-deploy.yml', 'utf8');
const CI_CD_WORKFLOW = fs.readFileSync('.github/workflows/ci-cd.yml', 'utf8');

test('staging deploy waits for CI validation of the same SHA before deploying', () => {
    assert.match(STAGING_WORKFLOW, /await-validation/);
    assert.match(STAGING_WORKFLOW, /CI\/CD Pipeline/);
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
    const deployBlock = CI_CD_WORKFLOW.slice(CI_CD_WORKFLOW.indexOf('deploy-production'));
    assert.match(deployBlock, /environment:\s*production/);
    assert.match(deployBlock, /needs:/);
});

test('backend-only changes are not blocked by Lighthouse', () => {
    const lighthouseBlock = CI_CD_WORKFLOW.slice(
        CI_CD_WORKFLOW.indexOf('lighthouse:'),
        CI_CD_WORKFLOW.indexOf('deploy-production'),
    );
    assert.match(lighthouseBlock, /category/);
    assert.match(lighthouseBlock, /BACKEND_RUNTIME/);
});

test('production pipeline skips rerunning CI validation inside deployment', () => {
    const deployBlock = CI_CD_WORKFLOW.slice(CI_CD_WORKFLOW.indexOf('deploy-production'));
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

test('ci-cd workflow has no dev-cloud deploy job', () => {
    assert.doesNotMatch(CI_CD_WORKFLOW, /anchor-os-dev-1c6ec/);
    assert.doesNotMatch(CI_CD_WORKFLOW, /FIREBASE_SERVICE_ACCOUNT_DEV/);
    assert.doesNotMatch(CI_CD_WORKFLOW, /build-dev|deploy-dev/);
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

