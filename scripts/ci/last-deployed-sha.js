#!/usr/bin/env node
/**
 * Resolve the last SHA successfully deployed to an environment.
 *
 * The deployment workflows (staging.yml / production.yml)
 * are the single source of truth for "what is deployed": the most recent
 * *successful* run of the environment's deploy workflow on master carries
 * the last deployed head SHA.
 *
 * Known limitation (documented in the release-infra PR): deploy history
 * before this workflow topology existed is not recorded as workflow runs;
 * when no successful run exists the caller must fail safe to deploying ALL
 * surfaces.
 *
 * Usage:
 *   node scripts/ci/last-deployed-sha.js --workflow staging.yml
 *       [--runs '<json array of {conclusion, headSha, createdAt}>']
 *
 * Prints the SHA, or an empty line when none is known.
 */

'use strict';

import { execFileSync } from 'node:child_process';

/**
 * Pure selection logic (unit-testable without gh/network).
 * @param {Array<{conclusion?: string|null, headSha?: string|null, createdAt?: string}>} runs
 * @returns {string} head SHA of the most recent successful run, or ''
 */
export function pickLastDeployedSha(runs) {
    if (!Array.isArray(runs)) return '';
    const successful = runs
        .filter((r) => r && r.conclusion === 'success' && typeof r.headSha === 'string' && r.headSha.length >= 7)
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    return successful.length > 0 ? successful[0].headSha : '';
}

function main(argv) {
    const args = argv.slice(2);
    const wfIdx = args.indexOf('--workflow');
    const workflow = wfIdx >= 0 ? args[wfIdx + 1] : null;
    const runsIdx = args.indexOf('--runs');
    if (runsIdx >= 0) {
        // Injected run list (used by tests).
        process.stdout.write(pickLastDeployedSha(JSON.parse(args[runsIdx + 1])) + '\n');
        return;
    }
    if (!workflow) {
        console.error('Usage: last-deployed-sha.js --workflow <file> | --runs <json>');
        process.exit(2);
    }
    const out = execFileSync('gh', [
        'run', 'list',
        '--workflow', workflow,
        '--branch', 'master',
        '--status', 'success',
        '--limit', '1',
        '--json', 'conclusion,headSha,createdAt',
    ], { encoding: 'utf8' });
    process.stdout.write(pickLastDeployedSha(JSON.parse(out || '[]')) + '\n');
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith('last-deployed-sha.js');
if (invokedDirectly) main(process.argv);
