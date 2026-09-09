#!/usr/bin/env node
/**
 * AnchorOS deployment surface classifier.
 *
 * Given a base git revision (normally the last SHA successfully deployed to
 * the target environment), classifies the changed files into deployment
 * surfaces so a deployment touches ONLY what changed:
 *
 *   hosting      - frontend product runtime (needs a build + hosting deploy)
 *   rules        - Firestore security rules — deployed with firestore:rules
 *   indexes      - Firestore index definitions
 *   functions    - Cloud Functions sources (deployed selectively when a
 *                  function allow-list is provided)
 *   ciOnly       - CI/docs-only change: no product deployment at all
 *
 * Deterministic rules:
 *  - Surfaces are additive: a mixed change deploys the union of the surfaces
 *    it touched (hosting AND rules AND functions ...).
 *  - Storage rules changes are classified with `rules`.
 *  - Empty/undeterminable input fails safe to "deploy everything".
 *
 * Usage:
 *   node scripts/ci/deploy-surface-classifier.js --from <git-rev> [--repo <path>]
 *        [--functions <name>,<name>...]   optional deploy allow-list filter
 *
 * Emits JSON to stdout and, when GITHUB_OUTPUT is set, deploy_hosting=,
 * deploy_rules=, deploy_indexes=, deploy_functions=, functions_to_deploy=
 * and ci_only= outputs for GitHub Actions.
 */

'use strict';

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { classifyPath } from './classify-changes.js';

const FUNCTIONS_ALLOW_LIST_DEFAULT = Object.freeze([
    'disconnectFamily',
    'shareAccount',
    'runMigration',
    'listMigrations',
    'getMigrationStatus',
]);

/**
 * @param {string[]} files
 * @param {string[]|null} functionsAllowList When non-empty, only these
 *        Cloud Functions may be deployed (B1 ordered rollout guardrail).
 */
function classifySurfaces(files, functionsAllowList) {
    const allow = Array.isArray(functionsAllowList) && functionsAllowList.length > 0
        ? functionsAllowList.slice().sort()
        : null;

    // Fail CLOSED: an undeterminable changed-file set is never an automatic
    // mutation plan. The caller must fail with bootstrap_required instead of
    // deploying everything.
    if (!Array.isArray(files) || files.length === 0) {
        return {
            hosting: false,
            rules: false,
            indexes: false,
            functions: false,
            functionsToDeploy: null,
            ciOnly: false,
            failClosed: true,
        };
    }

    const surfaces = { hosting: false, rules: false, indexes: false, functions: false };
    let sawProductOrBackend = false;

    for (const raw of files) {
        const category = classifyPath(raw);
        const f = raw.replace(/\\/g, '/');

        if (category === 'CI_INFRA' || category === 'ENGINEERING_ONLY') {
            continue; // never a product deployment surface
        }
        sawProductOrBackend = true;

        if (category === 'BACKEND_RUNTIME') {
            if (
                f === 'config/firestore.rules' || f === 'firestore.rules' ||
                f === 'config/storage.rules' || f === 'storage.rules'
            ) {
                surfaces.rules = true;
            } else if (
                f === 'config/firestore.indexes.json' || f === 'firestore.indexes.json'
            ) {
                surfaces.indexes = true;
            } else if (f.startsWith('functions/')) {
                surfaces.functions = true;
            } else {
                // firebase.json / deployment configuration affects every
                // backend surface; fail safe to the full backend set.
                surfaces.rules = true;
                surfaces.indexes = true;
                surfaces.functions = true;
            }
        } else if (category === 'PRODUCT_RUNTIME') {
            surfaces.hosting = true;
        }
    }

    if (!sawProductOrBackend) {
        // CI/docs-only change: nothing product-related to deploy.
        return {
            hosting: false,
            rules: false,
            indexes: false,
            functions: false,
            functionsToDeploy: null,
            ciOnly: true,
        };
    }

    return {
        hosting: surfaces.hosting,
        rules: surfaces.rules,
        indexes: surfaces.indexes,
        functions: surfaces.functions,
        functionsToDeploy: surfaces.functions ? allow : null,
        ciOnly: false,
    };
}

export { classifySurfaces, FUNCTIONS_ALLOW_LIST_DEFAULT };

function listChangedFiles(fromRev, repoPath) {
    const git = (gitArgs) =>
        execFileSync('git', gitArgs, { cwd: repoPath, encoding: 'utf8' }).trim();
    let out = git(['diff', '--name-only', fromRev, 'HEAD']);
    if (!out) {
        // Fall back to merge-base comparison (squash-merge style histories).
        out = git(['diff', '--name-only', `${fromRev}...HEAD`]);
    }
    return out ? out.split('\n').filter(Boolean) : [];
}

function main(argv) {
    const args = argv.slice(2);
    const positional = [];
    let allow = null;
    let fromRev = null;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--functions') {
            allow = String(args[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
        } else if (arg.startsWith('--functions=')) {
            allow = String(arg.slice('--functions='.length)).split(',').map((s) => s.trim()).filter(Boolean);
        } else if (arg === '--from') {
            fromRev = args[++i] || null;
        } else if (arg.startsWith('--from=')) {
            fromRev = arg.slice('--from='.length);
        } else if (arg === '--repo') {
            i++; // skip repo path value
        } else if (arg.startsWith('--repo=')) {
            // value consumed by the --repo= form itself
        } else if (arg === '--files') {
            // marker only; remaining positionals are files
        } else {
            positional.push(arg);
        }
    }

    let files;
    if (fromRev) {
        const repoIdx = args.findIndex((a) => a === '--repo' || a.startsWith('--repo='));
        const repoPath = repoIdx >= 0
            ? (args[repoIdx].startsWith('--repo=') ? args[repoIdx].slice('--repo='.length) : args[repoIdx + 1])
            : process.cwd();
        files = listChangedFiles(fromRev, repoPath);
    } else {
        files = positional;
    }

    const result = classifySurfaces(files, allow);
    result.files = files;
    if (fromRev) result.from = fromRev;
    console.log(JSON.stringify(result, null, 2));

    if (process.env.GITHUB_OUTPUT) {
        const lines = [
            `deploy_hosting=${result.hosting}`,
            `deploy_rules=${result.rules}`,
            `deploy_indexes=${result.indexes}`,
            `deploy_functions=${result.functions}`,
            `functions_to_deploy=${result.functionsToDeploy ? result.functionsToDeploy.join(',') : ''}`,
            `ci_only=${result.failClosed || result.ciOnly}`,
            `fail_closed=${result.failClosed || false}`,
        ];
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
    }
}

const invokedDirectly = process.argv[1] &&
    process.argv[1].endsWith('deploy-surface-classifier.js');

if (invokedDirectly) {
    main(process.argv);
}
