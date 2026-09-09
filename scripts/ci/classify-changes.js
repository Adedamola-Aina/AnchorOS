#!/usr/bin/env node
/**
 * AnchorOS change classifier (deterministic, repository-owned).
 *
 * Classifies a changed-file set into exactly one category:
 *
 *   BACKEND_RUNTIME    - Firebase Functions, security rules, indexes,
 *                        Firebase deployment configuration.
 *   PRODUCT_RUNTIME    - Application runtime surfaces (src, public, app
 *                        shell, build config, shipped dependencies, native
 *                        app code, workspace libraries).
 *   CI_INFRA           - CI/CD implementation only (workflows, ci scripts,
 *                        classifier itself). Validates CI without releasing.
 *   ENGINEERING_ONLY   - Engineering platform surfaces (agent contracts,
 *                        docs, Engineering Console, MCP, tooling scripts,
 *                        test configuration/documentation).
 *
 * Rules:
 *  - `category` is a single conservative label used by release logic: any
 *    BACKEND_RUNTIME file -> backend; else any PRODUCT_RUNTIME file ->
 *    product; else any CI_INFRA file -> ci_infra; else engineering_only.
 *  - In addition, `frontend_changed` / `backend_changed` /
 *    `ci_infra_changed` / `engineering_only_changed` are ADDITIVE surface
 *    booleans (not precedence-based). A mixed backend + frontend PR keeps
 *    frontend_changed=true so the PR bounded-smoke gate still runs.
 *  - Unknown/ambiguous paths default to PRODUCT_RUNTIME (fail safe: prefer
 *    normal release validation over silently skipping release work).
 *
 * Release eligibility (`release: true`) is true only for PRODUCT_RUNTIME and
 * BACKEND_RUNTIME. CI-only changes validate CI but never deploy AnchorOS.
 *
 * Usage:
 *   node scripts/ci/classify-changes.js --from <git-rev> [--repo <path>]
 *   node scripts/ci/classify-changes.js --files <file> [<file> ...]
 *
 * Emits a JSON object to stdout:
 *   { "category": "...", "release": true|false,
 *     "frontend_changed": bool, "backend_changed": bool,
 *     "ci_infra_changed": bool, "engineering_only_changed": bool }
 * When GITHUB_OUTPUT is set, also writes `category=`, `release=` and the
 * four `*_changed=` outputs.
 */

'use strict';

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

/**
 * @param {string} file Posix-style repo-relative path.
 * @returns {"BACKEND_RUNTIME"|"PRODUCT_RUNTIME"|"CI_INFRA"|"ENGINEERING_ONLY"}
 */
function classifyPath(file) {
    const f = file.replace(/\\/g, '/');

    // --- Backend runtime -------------------------------------------------
    if (
        f.startsWith('functions/') ||
        f === 'firestore.rules' || f === 'storage.rules' ||
        f === 'firestore.indexes.json' ||
        f === 'firebase.json' ||
        f === 'config/firestore.rules' || f === 'config/storage.rules' ||
        f === 'config/firestore.indexes.json'
    ) {
        return 'BACKEND_RUNTIME';
    }

    // --- CI infrastructure -----------------------------------------------
    if (
        f.startsWith('.github/workflows/') ||
        f.startsWith('.github/actions/') ||
        f.startsWith('scripts/ci/')
    ) {
        return 'CI_INFRA';
    }

    // --- Engineering-only (checked before product manifest basename rules,
    //     so engineering-tool package manifests never count as runtime) ------
    if (
        f === 'AGENTS.md' || f === 'CLAUDE.md' || f === 'CONTRIBUTING.md' ||
        f === '.clineignore' ||
        f.startsWith('.clinerules/') || f.startsWith('.claude/') ||
        f.startsWith('.cline/') ||
        // Playwright/vitest test configuration is test infra, not runtime:
        // CI-only PRs touching these must run zero Playwright.
        f.startsWith('config/playwright.') ||
        // Retired legacy engineering-system paths (PR #110 deletions).
        f.startsWith('.anchor/') ||
        f.startsWith('.github/.agent/') ||
        f.startsWith('.github/agents/') ||
        f.startsWith('.github/instructions/') ||
        f === '.github/copilot-instructions.md' ||
        f.startsWith('.github/ISSUE_TEMPLATE/') ||
        f === '.github/PULL_REQUEST_TEMPLATE.md' ||
        f.startsWith('docs/') ||
        f.startsWith('tools/') ||
        f.startsWith('reports/') ||
        f.startsWith('e2e/') ||
        f.startsWith('scripts/') ||
        f === 'knip.json' ||
        f === 'vitest.config.ts' ||
        f === 'config/eslint.config.js' ||
        f === 'config/tsconfig.node.json' ||
        f.startsWith('stryker-setup') ||
        f.startsWith('LICENSE') || f === 'COPYRIGHT' || f === 'README.md'
    ) {
        return 'ENGINEERING_ONLY';
    }

    // --- Product runtime ---------------------------------------------------
    if (
        f.startsWith('src/') ||
        f.startsWith('public/') ||
        f.startsWith('packages/') ||
        f.startsWith('android/') ||
        f.startsWith('ios/') ||
        f === 'index.html' ||
        f === 'vite.config.ts' ||
        f === 'capacitor.config.ts' ||
        f === 'config/tsconfig.app.json' ||
        // Root application dependency manifests only. Engineering-tool
        // manifests (tools/...) are matched above as ENGINEERING_ONLY.
        f === 'package.json' || f === 'package-lock.json' ||
        f === '.npmrc' ||
        f === '.env.production' || f === '.env.staging'
    ) {
        return 'PRODUCT_RUNTIME';
    }

    // Fail safe: unknown paths prefer normal release validation.
    return 'PRODUCT_RUNTIME';
}

export { classifyPath };

/**
 * @param {string[]} files
 * @returns {{ category: string, release: boolean,
 *            frontend_changed: boolean, backend_changed: boolean,
 *            ci_infra_changed: boolean, engineering_only_changed: boolean }}
 */
function classifyFiles(files) {
    // Fail safe: an empty/undeterminable changed-file set must never be
    // silently treated as engineering-only (which would skip release work).
    // Mirrors the workflow behavior of failing safe to release validation,
    // including running the bounded PR smoke gate.
    if (!Array.isArray(files) || files.length === 0) {
        return {
            category: 'PRODUCT_RUNTIME',
            release: true,
            frontend_changed: true,
            backend_changed: true,
            ci_infra_changed: false,
            engineering_only_changed: false,
        };
    }
    const categories = files.map(classifyPath);
    // Additive surface booleans: never collapse via category precedence, so a
    // mixed backend + frontend change still sets frontend_changed=true.
    const surfaces = {
        frontend_changed: categories.includes('PRODUCT_RUNTIME'),
        backend_changed: categories.includes('BACKEND_RUNTIME'),
        ci_infra_changed: categories.includes('CI_INFRA'),
        engineering_only_changed: categories.includes('ENGINEERING_ONLY'),
    };
    if (categories.includes('BACKEND_RUNTIME')) {
        return { category: 'BACKEND_RUNTIME', release: true, ...surfaces };
    }
    if (categories.includes('PRODUCT_RUNTIME')) {
        return { category: 'PRODUCT_RUNTIME', release: true, ...surfaces };
    }
    if (categories.includes('CI_INFRA')) {
        return { category: 'CI_INFRA', release: false, ...surfaces };
    }
    return { category: 'ENGINEERING_ONLY', release: false, ...surfaces };
}
export { classifyFiles };

function listChangedFiles(fromRev, repoPath) {
    const git = (gitArgs) =>
        execFileSync('git', gitArgs, { cwd: repoPath, encoding: 'utf8' }).trim();
    let out = git(['diff', '--name-only', fromRev, 'HEAD']);
    if (!out) {
        // Fall back to merge-base comparison (e.g. squash-merge pushes).
        out = git(['diff', '--name-only', `${fromRev}...HEAD`]);
    }
    return out ? out.split('\n').filter(Boolean) : [];
}

function main(argv) {
    const args = argv.slice(2);
    let files;
    if (args[0] === '--files') {
        files = args.slice(1);
    } else if (args[0] === '--from') {
        const repoIdx = args.indexOf('--repo');
        const repoPath = repoIdx >= 0 ? args[repoIdx + 1] : process.cwd();
        files = listChangedFiles(args[1], repoPath);
    } else {
        console.error('Usage: classify-changes.js --from <rev> [--repo <path>] | --files <file...>');
        process.exit(2);
    }

    const result = classifyFiles(files);
    result.files = files;
    console.log(JSON.stringify(result, null, 2));

    if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(
            process.env.GITHUB_OUTPUT,
            `category=${result.category}\n` +
            `release=${String(result.release)}\n` +
            `frontend_changed=${String(result.frontend_changed)}\n` +
            `backend_changed=${String(result.backend_changed)}\n` +
            `ci_infra_changed=${String(result.ci_infra_changed)}\n` +
            `engineering_only_changed=${String(result.engineering_only_changed)}\n`
        );
    }
}

const invokedDirectly = process.argv[1] &&
    (process.argv[1].endsWith('classify-changes.js') ||
     process.argv[1].endsWith('classify-changes'));

if (invokedDirectly) {
    main(process.argv);
}
