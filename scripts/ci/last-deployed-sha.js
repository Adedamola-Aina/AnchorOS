#!/usr/bin/env node
/**
 * Resolve the last SHA successfully deployed to an environment.
 *
 * The deployment workflows (staging.yml / production.yml)
 * are the single source of truth for "what is deployed": the most recent
 * *successful* run of the environment's deploy workflow on master carries
 * the last deployed head SHA.
 *
 * Mode-aware baselines: B1 runs (run titles "Staging b1 <sha>" /
 * "Production b1 <sha>") are PARTIAL phased rollouts. A successful B1 run
 * must never be treated as a whole-SHA normal baseline, so callers pass
 * --title-prefix (e.g. "Staging normal" / "Production normal") and only runs
 * whose display title starts with that prefix are eligible baselines.
 *
 * Known limitation (documented in the release-infra PR): deploy history
 * before this workflow topology existed is not recorded as workflow runs;
 * when no successful run exists the caller must fail closed
 * (bootstrap_required) rather than deploying ALL surfaces.
 *
 * Usage:
 *   node scripts/ci/last-deployed-sha.js --workflow staging.yml
 *        [--title-prefix 'Staging normal']
 *       [--runs '<json array of {conclusion, headSha, createdAt, displayTitle}>']
 *
 * Prints the SHA, or an empty line when none is known.
 */

'use strict';

import { execFileSync } from 'node:child_process';

/**
 * Pure selection logic (unit-testable without gh/network).
 * @param {Array<{conclusion?: string|null, headSha?: string|null, createdAt?: string, displayTitle?: string|null}>} runs
 * @param {{titlePrefix?: string}} [options] When titlePrefix is set, only runs
 *        whose displayTitle starts with it are eligible baselines. This keeps
 *        partial B1 rollouts from becoming whole-SHA normal baselines.
 * @returns {string} head SHA of the most recent successful run, or ''
 */
export function pickLastDeployedSha(runs, options = {}) {
    if (!Array.isArray(runs)) return '';
    let pool = runs;
    const prefix = options.titlePrefix;
    if (prefix) {
        pool = pool.filter(
            (r) => typeof r.displayTitle === 'string' && r.displayTitle.startsWith(prefix),
        );
    }
    const successful = pool
        .filter((r) => r && r.conclusion === 'success' && typeof r.headSha === 'string' && r.headSha.length >= 7)
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    return successful.length > 0 ? successful[0].headSha : '';
}

function main(argv) {
    const args = argv.slice(2);
    const wfIdx = args.indexOf('--workflow');
    const workflow = wfIdx >= 0 ? args[wfIdx + 1] : null;
    const prefixIdx = args.indexOf('--title-prefix');
    const titlePrefix = prefixIdx >= 0 ? args[prefixIdx + 1] : undefined;
    const runsIdx = args.indexOf('--runs');
    if (runsIdx >= 0) {
        // Injected run list (used by tests).
        process.stdout.write(pickLastDeployedSha(JSON.parse(args[runsIdx + 1]), { titlePrefix }) + '\n');
        return;
    }
    if (!workflow) {
        console.error('Usage: last-deployed-sha.js --workflow <file> [--title-prefix <prefix>] | --runs <json>');
        process.exit(2);
    }
    const out = execFileSync('gh', [
        'run', 'list',
        '--workflow', workflow,
        '--branch', 'master',
        '--status', 'success',
        '--limit', '1',
        '--json', 'conclusion,headSha,createdAt,displayTitle',
    ], { encoding: 'utf8' });
    process.stdout.write(pickLastDeployedSha(JSON.parse(out || '[]'), { titlePrefix }) + '\n');
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith('last-deployed-sha.js');
if (invokedDirectly) main(process.argv);
