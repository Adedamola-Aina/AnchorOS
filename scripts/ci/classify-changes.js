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
 *  - Mixed sets are conservative: any BACKEND_RUNTIME file -> backend; else
 *    any PRODUCT_RUNTIME file -> product; else any CI_INFRA file -> ci_infra;
 *    else engineering_only.
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
 * Emits a JSON object to stdout: { "category": "...", "release": true|false }
 * When GITHUB_OUTPUT is set, also writes `category=` and `release=` outputs.
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
    const base = f.split('/').pop() || f;

    // --- Backend runtime -------------------------------------------------
    if (
        f.startsWith('functions/') ||
        f === 'firestore.rules' || f === 'storage.rules' ||
        f === 'firestore.indexes.json' ||
        f === 'config/firestore.rules' || f === 'config/storage.rules' ||
        f === 'config/firestore.indexes.json' ||
        f === 'firebase.json'
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
        base === 'package.json' || base === 'package-lock.json' ||
        base === '.npmrc' ||
        base === '.env.production' || base === '.env.staging'
    ) {
        return 'PRODUCT_RUNTIME';
    }

    // --- Engineering-only --------------------------------------------------
    if (
        f === 'AGENTS.md' || f === 'CLAUDE.md' || f === 'CONTRIBUTING.md' ||
        f === '.clineignore' ||
        f.startsWith('.clinerules/') || f.startsWith('.claude/') ||
        f.startsWith('.cline/') ||
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

    // Fail safe: unknown paths prefer normal release validation.
    return 'PRODUCT_RUNTIME';
}

export { classifyPath };

/**
 * @param {string[]} files
 * @returns {{ category: string, release: boolean }}
 */
function classifyFiles(files) {
    const categories = files.map(classifyPath);
    if (categories.includes('BACKEND_RUNTIME')) {
        return { category: 'BACKEND_RUNTIME', release: true };
    }
    if (categories.includes('PRODUCT_RUNTIME')) {
        return { category: 'PRODUCT_RUNTIME', release: true };
    }
    if (categories.includes('CI_INFRA')) {
        return { category: 'CI_INFRA', release: false };
    }
    return { category: 'ENGINEERING_ONLY', release: false };
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
            `category=${result.category}\nrelease=${String(result.release)}\n`
        );
    }
}

const invokedDirectly = process.argv[1] &&
    (process.argv[1].endsWith('classify-changes.js') ||
     process.argv[1].endsWith('classify-changes'));

if (invokedDirectly) {
    main(process.argv);
}
