#!/usr/bin/env node
'use strict';

/**
 * Deploy-target builder for the release pipeline (B1 selective Functions).
 *
 * Why this exists
 * ---------------
 * firebase-tools resolves a *bare* `functions:<name>` --only filter against the
 * DEFAULT codebase (`parseFunctionSelector` in firebase-tools). AnchorOS
 * declares a named functions codebase in firebase.json:
 *
 *     "functions": { "codebase": "anchor-os-functions", ... }
 *
 * so an unqualified `functions:disconnectFamily` filter matches NO endpoint and
 * `firebase deploy` aborts with:
 *
 *     Error: No function matches given --only filters. Aborting deployment.
 *
 * This was the exact failure of staging B1 run 34530005849 (Step B), after the
 * rules step had already succeeded. The correct filter form is:
 *
 *     functions:<codebase>:<name>      ->  functions:anchor-os-functions:disconnectFamily
 *
 * This module derives the qualified targets from configuration and is
 * unit-tested so the B1 selective rollout cannot silently regress to an empty
 * or default-codebase plan.
 *
 * Usage:
 *   node scripts/ci/deploy-targets.js --functions "<a>,<b>" [--config firebase.json]
 * Prints a comma-joined list of `functions:...` targets to stdout.
 */

import fs from 'node:fs';

/**
 * Resolve the configured Cloud Functions codebase from firebase.json.
 * Returns '' when no codebase is configured (filters then target the default
 * codebase, which is correct without an explicit codebase).
 *
 * @param {string} configPath
 * @returns {string}
 */
export function resolveFunctionsCodebase(configPath = 'firebase.json') {
    try {
        const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const functions = parsed && parsed.functions;
        if (Array.isArray(functions)) {
            const first = functions.find((entry) => entry && entry.codebase);
            return first ? String(first.codebase).trim() : '';
        }
        return functions && functions.codebase ? String(functions.codebase).trim() : '';
    } catch {
        return '';
    }
}

/**
 * Build firebase `--only` function targets for an allow-list.
 *
 * - Bare names are qualified with the configured codebase when one exists.
 * - Already-qualified names (`codebase:name`) are preserved, only prefixed
 *   with `functions:`.
 * - Empty/blank entries are dropped.
 *
 * @param {string|string[]} functionsFilter comma-separated names or an array
 * @param {string} codebase configured functions codebase ('' when absent)
 * @returns {string[]} e.g. ['functions:anchor-os-functions:disconnectFamily']
 */
export function buildFunctionsTargets(functionsFilter, codebase = '') {
    const raw = Array.isArray(functionsFilter)
        ? functionsFilter
        : String(functionsFilter || '').split(',');

    const names = raw
        .map((name) => String(name).trim())
        .filter(Boolean);

    const cb = String(codebase || '').trim();

    return names.map((name) => {
        if (name.includes(':')) {
            // Already `<codebase>:<name>` — keep the caller's explicit scope.
            return `functions:${name}`;
        }
        return cb ? `functions:${cb}:${name}` : `functions:${name}`;
    });
}

function main(argv) {
    const args = argv.slice(2);
    let functionsFilter = '';
    let configPath = 'firebase.json';

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--functions') {
            functionsFilter = args[++i] || '';
        } else if (arg.startsWith('--functions=')) {
            functionsFilter = arg.slice('--functions='.length);
        } else if (arg === '--config') {
            configPath = args[++i] || configPath;
        } else if (arg.startsWith('--config=')) {
            configPath = arg.slice('--config='.length);
        }
    }

    const codebase = resolveFunctionsCodebase(configPath);
    const targets = buildFunctionsTargets(functionsFilter, codebase);
    process.stdout.write(targets.join(','));
}

const invokedDirectly = process.argv[1] &&
    process.argv[1].endsWith('deploy-targets.js');

if (invokedDirectly) {
    main(process.argv);
}
