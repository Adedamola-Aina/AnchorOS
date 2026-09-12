'use strict';

/**
 * Focused tests for the Functions deployment environment file.
 * Run: node --test scripts/ci/functions-env-file.node-suite.mjs
 *
 * Locks in the single source of truth for the dotenv file firebase-tools
 * actually loads for Cloud Functions:
 *
 *   firebase-tools lib/functions/env.js `findEnvfiles` loads
 *   .env -> .env.<projectId> -> .env.<projectAlias> and REFUSES to deploy when
 *   both the projectId and alias files exist.
 *
 * AnchorOS deploys with `--project <projectId>`, so the deterministic file is
 * `functions/.env.<projectId>`. The deploy guard and both CI workflows must
 * resolve that exact path through scripts/ci/functions-env-file.js, and the
 * guard must validate the same file Firebase consumes.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

import {
    resolveProjectId,
    functionsEnvFileName,
    functionsEnvFilePath,
} from './functions-env-file.js';

const PIPELINE = fs.readFileSync('scripts/DEPLOY_PIPELINE.sh', 'utf8');
const STAGING_WORKFLOW = fs.readFileSync('.github/workflows/staging.yml', 'utf8');
const PRODUCTION_WORKFLOW = fs.readFileSync('.github/workflows/production.yml', 'utf8');
const FIREBASERC = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));

function cli(args) {
    return execFileSync(process.execPath, ['scripts/ci/functions-env-file.js', ...args], { encoding: 'utf8' });
}

test('project IDs match .firebaserc for every deployable environment', () => {
    for (const env of ['staging', 'production']) {
        assert.equal(resolveProjectId(env), FIREBASERC.projects[env], `${env} project ID must match .firebaserc`);
    }
});

test('the resolved file is exactly .env.<projectId> (the file firebase-tools loads)', () => {
    for (const env of ['staging', 'production']) {
        const projectId = resolveProjectId(env);
        assert.equal(functionsEnvFileName(env), `.env.${projectId}`);
        assert.equal(functionsEnvFilePath(env), `functions/.env.${projectId}`);
    }
    assert.equal(functionsEnvFilePath('staging'), 'functions/.env.anchor-os-staging');
    assert.equal(functionsEnvFilePath('production'), 'functions/.env.anchor-os');
});

test('development resolves to the emulator demo project, never a cloud project', () => {
    assert.equal(resolveProjectId('development'), 'demo-anchor-os');
    assert.equal(functionsEnvFilePath('development'), 'functions/.env.demo-anchor-os');
});

test('unknown environments fail closed (CLI exits non-zero)', () => {
    assert.throws(() => cli(['--env', 'staging-typo']));
});

test('CLI prints the repo-relative path, file name and project ID', () => {
    assert.equal(cli(['--env', 'staging']).trim(), 'functions/.env.anchor-os-staging');
    assert.equal(cli(['--env', 'production', '--file-name']).trim(), '.env.anchor-os');
    assert.equal(cli(['--env', 'production', '--project-id']).trim(), 'anchor-os');
});

test('the deploy guard resolves the Functions env file through the shared module', () => {
    assert.match(PIPELINE, /FUNCTIONS_ENV_FILE="\$\(node scripts\/ci\/functions-env-file\.js --env "\$ENV"\)"/);
    // The App Check guard reads ENFORCE_APPCHECK from that exact resolved file.
    assert.match(PIPELINE, /read_env_value "\$FUNCTIONS_ENV_FILE" "ENFORCE_APPCHECK"/);
});

test('the deploy guard refuses a conflicting alias-style Functions env file', () => {
    assert.match(PIPELINE, /LEGACY_FUNCTIONS_ENV_FILE="functions\/\.env\.\$\{ENV\}"/);
    assert.match(PIPELINE, /Conflicting legacy Functions env file/);
});

test('staging workflow writes the Functions env file resolved by the shared module', () => {
    assert.match(
        STAGING_WORKFLOW,
        /"\$STAGING_FUNCTIONS_ENV" > "\$\(node scripts\/ci\/functions-env-file\.js --env staging\)"/,
    );
    assert.doesNotMatch(STAGING_WORKFLOW, /functions\/\.env\.staging/);
});

test('production workflow writes the Functions env file resolved by the shared module', () => {
    assert.match(
        PRODUCTION_WORKFLOW,
        /"\$PRODUCTION_FUNCTIONS_ENV" > "\$\(node scripts\/ci\/functions-env-file\.js --env production\)"/,
    );
    assert.doesNotMatch(PRODUCTION_WORKFLOW, /functions\/\.env\.production/);
});

test('frontend env files keep the Vite mode convention (.env.<env>)', () => {
    assert.match(STAGING_WORKFLOW, /> \.env\.staging/);
    assert.match(PRODUCTION_WORKFLOW, /> \.env\.production/);
});

test('no Functions alias-style env file is tracked', () => {
    const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    for (const file of tracked) {
        assert.doesNotMatch(file, /^functions\/\.env\.(staging|production)$/);
    }
});
