// @ts-nocheck
/**
 * classification.js
 *
 * Classifies commits into categories: anchorOS, dashboard, docs, infra.
 */

const { git, extractCommitType } = require('./commits');

// Paths that indicate dashboard-only changes
const DASHBOARD_PATHS = [
    'tools/dashboard/',
    'tools/mcp-server/',
    'scripts/',
    'docs/DASHBOARD'
];

// Paths that indicate actual Anchor OS product source changes
const PRODUCT_SOURCE_PATHS = [
    'src/',
    'functions/src/',
    'functions/package.json',
    'public/',
    'e2e/',
    'index.html',
    'firebase.json',
    'config/firestore.rules',
    'config/firestore.indexes.json',
    'capacitor.config.ts',
    // Native apps — these are product source, same as src/
    'apps/ios-native/',
    'apps/android-native/',
    'android/app/src/',
    'ios/App/App/',
    'packages/'
];

// Paths that indicate documentation / process governance changes
const DOCS_PATHS = [
    'docs/',
    '.github/',
    'CLAUDE.md',
    'CONTRIBUTING.md',
    'README.md',
    'COPYRIGHT',
    'LICENSE'
];

// Legacy alias — kept for backward compatibility with getRepoStats
const ANCHOR_OS_PATHS = PRODUCT_SOURCE_PATHS;

/**
 * Classify a commit into categories: 'anchorOS', 'dashboard', 'docs', or 'infra'
 *
 * - anchorOS  : product-meaningful commit (feat, fix, test, perf, hotfix)
 *               that touches product source (src/, public/, e2e/, index.html)
 * - dashboard : only touches dashboard / tooling files
 * - docs      : documentation & process governance changes (docs/, .github/,
 *               CLAUDE.md, CONTRIBUTING.md, README.md)
 * - infra     : infrastructure changes — refactor/chore commits, OR commits
 *               touching only config/, root config files
 */
async function classifyCommit(commitHash) {
    try {
        const diff = await git.show([commitHash, '--name-only', '--format=']);
        const files = diff.split('\n').filter(f => f.trim());

        if (files.length === 0) return 'infra';

        // Get commit message for type-based classification
        const commitInfo = await git.show([commitHash, '--format=%s', '--no-patch']);
        const commitType = extractCommitType(commitInfo.trim());

        // Refactor & chore commits are always infra — they never represent
        // product feature changes, even if they touch src/ files
        if (commitType === 'refactor' || commitType === 'chore') {
            return 'infra';
        }

        let touchesProductSource = false;
        let touchesDashboard = false;
        let touchesDocs = false;
        let touchesOther = false;

        for (const file of files) {
            let matched = false;

            // Check product source paths
            for (const prodPath of PRODUCT_SOURCE_PATHS) {
                if (file.startsWith(prodPath) || file === prodPath) {
                    touchesProductSource = true;
                    matched = true;
                    break;
                }
            }
            if (matched) continue;

            // Check dashboard paths
            for (const dashPath of DASHBOARD_PATHS) {
                if (file.startsWith(dashPath) || file.includes(dashPath)) {
                    touchesDashboard = true;
                    matched = true;
                    break;
                }
            }
            if (matched) continue;

            // Check docs/governance paths
            for (const docPath of DOCS_PATHS) {
                if (file.startsWith(docPath) || file === docPath) {
                    touchesDocs = true;
                    matched = true;
                    break;
                }
            }
            if (matched) continue;

            touchesOther = true;
        }

        // Product source touched → anchorOS (even if config also changed)
        if (touchesProductSource) return 'anchorOS';

        // Dashboard-only files
        if (touchesDashboard && !touchesDocs && !touchesOther) return 'dashboard';

        // Docs-only commits (also matches docs prefix in commit message)
        if (touchesDocs && !touchesDashboard && !touchesOther) return 'docs';
        if (commitType === 'docs') return 'docs';

        // Everything else: config/, root-level files → infra
        return 'infra';
    } catch (error) {
        return 'infra';
    }
}

/**
 * Backward-compatible wrapper
 */
async function isDashboardOnlyCommit(commitHash) {
    return (await classifyCommit(commitHash)) === 'dashboard';
}

module.exports = {
    DASHBOARD_PATHS,
    PRODUCT_SOURCE_PATHS,
    DOCS_PATHS,
    ANCHOR_OS_PATHS,
    classifyCommit,
    isDashboardOnlyCommit
};
