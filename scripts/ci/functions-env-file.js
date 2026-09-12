#!/usr/bin/env node
'use strict';

/**
 * Single source of truth for the Functions environment file that
 * firebase-tools actually consumes for a deploy target.
 *
 * Why this exists
 * ---------------
 * firebase-tools resolves dotenv files for Cloud Functions in
 * lib/functions/env.js `findEnvfiles`:
 *
 *     .env  ->  .env.<projectId>  ->  .env.<projectAlias>
 *
 * and REFUSES to deploy when both `.env.<projectId>` and `.env.<alias>`
 * exist (FirebaseError: "Can't have both dotenv files with projectId ...
 * and projectAlias ... as extensions").
 *
 * AnchorOS deploys with `--project <projectId>` (see DEPLOY_PIPELINE.sh), so
 * the deterministic, collision-free file Firebase loads is
 * `functions/.env.<projectId>`.
 *
 * The deploy guard and the CI workflows MUST both resolve the path through
 * this module so the guard validates exactly the file Firebase will deploy.
 * A guard that reads a different file (e.g. the alias-style
 * `functions/.env.staging`) can pass while the real deployment stays
 * unenforced — the exact staging App Check drift this module fixes.
 *
 * Usage:
 *   node scripts/ci/functions-env-file.js --env staging       # functions/.env.anchor-os-staging
 *   node scripts/ci/functions-env-file.js --env production --project-id
 *   node scripts/ci/functions-env-file.js --env staging --file-name
 */

/** Canonical environment -> Firebase project IDs (mirrors .firebaserc). */
export const ENV_PROJECT_IDS = Object.freeze({
    development: 'demo-anchor-os',
    staging: 'anchor-os-staging',
    production: 'anchor-os',
});

/** Directory holding the Functions source (firebase.json functions.source). */
export const FUNCTIONS_SOURCE_DIR = 'functions';

/**
 * Resolve the Firebase project ID for a canonical environment.
 * Unknown environments fail closed.
 *
 * @param {string} env
 * @returns {string}
 */
export function resolveProjectId(env) {
    const key = String(env || '').trim();
    const projectId = ENV_PROJECT_IDS[key];
    if (!projectId) {
        throw new Error(
            `Unknown environment '${key}'. Allowed: ${Object.keys(ENV_PROJECT_IDS).join(', ')}`,
        );
    }
    return projectId;
}

/**
 * The dotenv filename firebase-tools loads for this environment:
 * `.env.<projectId>`.
 *
 * @param {string} env
 * @returns {string}
 */
export function functionsEnvFileName(env) {
    return `.env.${resolveProjectId(env)}`;
}

/**
 * Repo-relative path the deploy guard validates and the CI workflows write.
 *
 * @param {string} env
 * @returns {string}
 */
export function functionsEnvFilePath(env) {
    return `${FUNCTIONS_SOURCE_DIR}/${functionsEnvFileName(env)}`;
}

function parseArgs(argv) {
    const args = argv.slice(2);
    let env = '';
    let output = 'file';
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--env') env = args[++i] || '';
        else if (arg.startsWith('--env=')) env = arg.slice('--env='.length);
        else if (arg === '--project-id') output = 'project-id';
        else if (arg === '--file-name') output = 'file-name';
    }
    return { env, output };
}

function main(argv) {
    const { env, output } = parseArgs(argv);
    if (output === 'project-id') process.stdout.write(resolveProjectId(env));
    else if (output === 'file-name') process.stdout.write(functionsEnvFileName(env));
    else process.stdout.write(functionsEnvFilePath(env));
}

const invokedDirectly = process.argv[1] &&
    process.argv[1].endsWith('functions-env-file.js');

if (invokedDirectly) {
    try {
        main(process.argv);
    } catch (err) {
        process.stderr.write(`${err.message}\n`);
        process.exit(1);
    }
}
