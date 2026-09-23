#!/usr/bin/env node
'use strict';

/**
 * Retire Cloud Functions that no longer exist in source.
 *
 * Why this exists: `firebase deploy` refuses to delete, in non-interactive mode, any
 * function that is deployed but absent from the local source. It does not fail early —
 * it aborts *after* it has already released Firestore rules and uploaded hosting: the
 * first production deployment attempt released rules, uploaded hosting, uploaded the
 * functions source and then died with
 *
 *     The following functions are found in your project but do not exist in your local
 *     source code:
 *         anchor-os-functions:resetRateLimit(us-central1)
 *     Aborting because deletion cannot proceed in non-interactive mode.
 *
 * leaving production in a partially updated state and the release blocked.
 *
 * So retirements are listed here explicitly instead of handing `firebase deploy` a blanket
 * `--force` (which would also auto-confirm unrelated destructive prompts, e.g. deleting
 * Firestore indexes that are missing from the file).
 *
 * This runs BEFORE the deploy, is idempotent (a function that is not deployed is reported
 * and skipped, not an error), and fails loudly for any other reason.
 *
 * Usage: node scripts/ci/retire-functions.mjs --env production
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

/**
 * Every retired function, with the reason it must not be callable. Keep this list short and
 * justified: an entry here means "delete this from the deployed project".
 */
export const RETIRED_FUNCTIONS = Object.freeze([
    {
        name: 'resetRateLimit',
        region: 'us-central1',
        reason: 'RA-01 (issue #147): a client-callable resetRateLimit let any authenticated user clear its own rate-limit bucket, nullifying the checkRateLimit gate. Retired in PR #155; deleting the deployed copy IS the remediation.',
    },
]);

/** Resolve the project id from .firebaserc — one source of truth, no restated ids. */
export function resolveProject(env, firebaserc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'))) {
    const project = firebaserc?.projects?.[env];
    if (!project) {
        throw new Error(`retire-functions: no project mapped for "${env}" in .firebaserc`);
    }
    return project;
}

/** True when the failure just means "nothing to delete". */
export function isAlreadyGone(output) {
    return /does not exist|not found|no functions/i.test(output);
}

function parseEnv(argv) {
    const flag = argv.find((arg) => arg.startsWith('--env='));
    const index = argv.indexOf('--env');
    const env = flag ? flag.slice('--env='.length) : index !== -1 ? argv[index + 1] : '';
    if (!env) throw new Error('retire-functions: --env production|staging is required');
    return env;
}

function main() {
    const env = parseEnv(process.argv.slice(2));
    const project = resolveProject(env);
    console.log(`retire-functions: checking ${RETIRED_FUNCTIONS.length} retired function(s) in ${project} (${env})`);

    for (const fn of RETIRED_FUNCTIONS) {
        console.log(`retire-functions: ${fn.name} (${fn.region}) — ${fn.reason}`);
        try {
            execFileSync(
                'firebase',
                ['functions:delete', fn.name, '--region', fn.region, '--project', project, '--force', '--non-interactive'],
                { stdio: 'pipe', encoding: 'utf8' },
            );
            console.log(`retire-functions: deleted ${fn.name}`);
        } catch (error) {
            const output = `${error.stdout || ''}${error.stderr || ''}`;
            if (isAlreadyGone(output)) {
                console.log(`retire-functions: ${fn.name} is not deployed — nothing to delete`);
                continue;
            }
            console.error(`retire-functions: could not delete ${fn.name}.`);
            console.error(output.trim() || error.message);
            process.exit(1);
        }
    }
    console.log('retire-functions: done');
}

// Only run when invoked directly, so the list stays importable by tests.
if (process.argv[1] && process.argv[1].endsWith('retire-functions.mjs')) {
    main();
}