#!/usr/bin/env node
/**
 * AnchorOS CI change classifier.
 *
 * One conservative category is retained for release eligibility, while
 * additive booleans drive risk-based CI jobs. Unknown paths fail safe to the
 * product runtime surface.
 */
'use strict';

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const normalize = (file) => file.replace(/\\\\/g, '/');
const isTestFile = (f) =>
    /(^|\/)(__tests__\/|[^/]+\.(test|spec)\.[^/]+$)/.test(f);

const isRulesPath = (f) =>
    f === 'firestore.rules' ||
    f === 'storage.rules' ||
    f === 'firestore.indexes.json' ||
    f === 'config/firestore.rules' ||
    f === 'config/storage.rules' ||
    f === 'config/firestore.indexes.json' ||
    f === 'firebase.json';

const isFunctionsPath = (f) =>
    f.startsWith('functions/') || f === 'firebase.json';

const isCiPath = (f) =>
    f.startsWith('.github/workflows/') ||
    f.startsWith('.github/actions/') ||
    f.startsWith('scripts/ci/');

const isEngineeringCodePath = (f) =>
    (f.startsWith('scripts/') && !f.startsWith('scripts/ci/')) ||
    f.startsWith('tools/') ||
    f.startsWith('e2e/') ||
    f.startsWith('config/playwright.') ||
    f === 'config/eslint.config.js' ||
    f === 'config/tsconfig.node.json' ||
    f === 'config/vitest.config.ts' ||
    f === 'config/vitest.rules.config.ts' ||
    f === 'knip.json' ||
    f.startsWith('.husky/');

const isEngineeringOnlyPath = (f) =>
    f === 'AGENTS.md' ||
    f === 'CLAUDE.md' ||
    f === 'CONTRIBUTING.md' ||
    f === '.clineignore' ||
    f.startsWith('.clinerules/') ||
    f.startsWith('.claude/') ||
    f.startsWith('.cline/') ||
    f.startsWith('.anchor/') ||
    f.startsWith('.github/.agent/') ||
    f.startsWith('.github/agents/') ||
    f.startsWith('.github/instructions/') ||
    f === '.github/copilot-instructions.md' ||
    f.startsWith('.github/ISSUE_TEMPLATE/') ||
    f === '.github/PULL_REQUEST_TEMPLATE.md' ||
    f.startsWith('docs/') ||
    f.startsWith('reports/') ||
    isEngineeringCodePath(f) ||
    f.startsWith('stryker-setup') ||
    f.startsWith('LICENSE') ||
    f === 'COPYRIGHT' ||
    f === 'README.md';

const isProductPath = (f) =>
    f.startsWith('src/') ||
    f.startsWith('public/') ||
    f.startsWith('packages/') ||
    f.startsWith('android/') ||
    f.startsWith('ios/') ||
    f === 'index.html' ||
    f === 'vite.config.ts' ||
    f === 'capacitor.config.ts' ||
    f === 'config/tsconfig.app.json' ||
    f === 'package.json' ||
    f === 'package-lock.json' ||
    f === '.npmrc' ||
    f === '.env.production' ||
    f === '.env.staging';

function classifyPath(file) {
    const f = normalize(file);
    if (isFunctionsPath(f) || isRulesPath(f)) return 'BACKEND_RUNTIME';
    if (isCiPath(f)) return 'CI_INFRA';
    if (isEngineeringOnlyPath(f)) return 'ENGINEERING_ONLY';
    if (isProductPath(f)) return 'PRODUCT_RUNTIME';
    return 'PRODUCT_RUNTIME';
}

export { classifyPath };

function classifyFiles(files) {
    if (!Array.isArray(files) || files.length === 0) {
        return {
            category: 'PRODUCT_RUNTIME',
            release: true,
            frontend_changed: true,
            backend_changed: true,
            functions_changed: true,
            rules_changed: true,
            query_changed: true,
            smoke_required: true,
            ci_infra_changed: false,
            engineering_only_changed: false,
            engineering_code_changed: false,
        };
    }

    const normalized = files.map(normalize);
    const categories = normalized.map(classifyPath);

    const functionsChanged = normalized.some(isFunctionsPath);
    const rulesChanged = normalized.some(isRulesPath);
    // Unknown paths classify as PRODUCT_RUNTIME by design. Treat them as a
    // frontend/runtime surface too so fail-safe classification cannot select
    // release eligibility while accidentally skipping runtime validation.
    const unknownRuntimeChanged = normalized.some((f) =>
        classifyPath(f) === 'PRODUCT_RUNTIME' &&
        !isProductPath(f) &&
        !isFunctionsPath(f) &&
        !isRulesPath(f)
    );
    const frontendChanged =
        normalized.some((f) => isProductPath(f) && !isFunctionsPath(f) && !isRulesPath(f)) ||
        unknownRuntimeChanged;
    const ciChanged = normalized.some(isCiPath);
    const engineeringOnlyChanged = normalized.some(isEngineeringOnlyPath);
    const engineeringCodeChanged = normalized.some(isEngineeringCodePath);
    const queryChanged = normalized.some((f) =>
        f.startsWith('src/services/fabric/query/') ||
        /^src\/services\/fabric\/QueryEngine(?:\.|\/)/.test(f)
    );
    const smokeRequired = normalized.some((f) => {
        if (f === 'package.json' || f === 'package-lock.json' || f === 'index.html' || f === 'vite.config.ts' || f === 'capacitor.config.ts') return true;
        if (f.startsWith('public/')) return true;
        if (f.startsWith('src/') && !isTestFile(f)) return true;
        if (f === 'config/playwright.release-smoke.config.ts') return true;
        if (/^e2e\/release-(auth|smoke)\./.test(f)) return true;
        if (unknownRuntimeChanged) return true;
        return false;
    });

    const surfaces = {
        frontend_changed: frontendChanged,
        backend_changed: functionsChanged || rulesChanged,
        functions_changed: functionsChanged,
        rules_changed: rulesChanged,
        query_changed: queryChanged,
        smoke_required: smokeRequired,
        ci_infra_changed: ciChanged,
        engineering_only_changed: engineeringOnlyChanged,
        engineering_code_changed: engineeringCodeChanged,
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
    const git = (args) => execFileSync('git', args, { cwd: repoPath, encoding: 'utf8' }).trim();
    let out = git(['diff', '--name-only', fromRev, 'HEAD']);
    if (!out) out = git(['diff', '--name-only', `${fromRev}...HEAD`]);
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

    const result = { ...classifyFiles(files), files };
    console.log(JSON.stringify(result, null, 2));

    if (process.env.GITHUB_OUTPUT) {
        const outputs = [
            'category',
            'release',
            'frontend_changed',
            'backend_changed',
            'functions_changed',
            'rules_changed',
            'query_changed',
            'smoke_required',
            'ci_infra_changed',
            'engineering_only_changed',
            'engineering_code_changed',
        ];
        fs.appendFileSync(
            process.env.GITHUB_OUTPUT,
            outputs.map((key) => `${key}=${String(result[key])}`).join('\n') + '\n'
        );
    }
}

const invokedDirectly = process.argv[1] &&
    (process.argv[1].endsWith('classify-changes.js') || process.argv[1].endsWith('classify-changes'));
if (invokedDirectly) main(process.argv);
