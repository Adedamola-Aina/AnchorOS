/**
 * gitAnalyzer.js
 * 
 * Analyzes git history to extract commit timeline, feature deployments,
 * and compare code between environments.
 */
// @ts-nocheck


const simpleGit = require('simple-git');
const path = require('path');

const REPO_PATH = path.join(__dirname, '../../..');
const git = simpleGit(REPO_PATH);

/**
 * Get recent commits with parsed feature info
 */
async function getRecentCommits(limit = 50) {
    try {
        const log = await git.log({ maxCount: limit });
        return log.all.map(commit => ({
            hash: commit.hash.substring(0, 7),
            fullHash: commit.hash,
            message: commit.message,
            date: commit.date,
            author: commit.author_name,
            feature: extractFeature(commit.message),
            type: extractCommitType(commit.message)
        }));
    } catch (error) {
        console.error('Git log error:', error);
        return [];
    }
}

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
    'public/',
    'e2e/',
    'index.html'
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

/**
 * Get commits filtered by category (anchorOS, dashboard, docs, infra, or all)
 * @param {string} category - 'anchorOS', 'dashboard', 'docs', 'infra', or 'all'
 * @param {number} limit - Max commits to return
 */
async function getRecentCommitsFiltered(category = 'all', limit = 50) {
    try {
        // Fetch more commits to account for filtering
        const log = await git.log({ maxCount: limit * 3 });
        const commits = [];

        for (const commit of log.all) {
            if (commits.length >= limit) break;

            const commitCategory = await classifyCommit(commit.hash);

            // Filter based on category
            if (category === 'dashboard' && commitCategory !== 'dashboard') continue;
            if (category === 'anchorOS' && commitCategory !== 'anchorOS') continue;
            if (category === 'docs' && commitCategory !== 'docs') continue;
            if (category === 'infra' && commitCategory !== 'infra') continue;

            commits.push({
                hash: commit.hash.substring(0, 7),
                fullHash: commit.hash,
                message: commit.message,
                date: commit.date,
                author: commit.author_name,
                feature: extractFeature(commit.message),
                type: extractCommitType(commit.message),
                category: commitCategory
            });
        }

        return commits;
    } catch (error) {
        console.error('Git log filtered error:', error);
        return [];
    }
}

/**
 * Extract feature name from commit message
 */
function extractFeature(message) {
    // Match patterns like "feat: Mobile Navigation" or "[Feature] Mobile Nav"
    const patterns = [
        /feat(?:\(([^)]+)\))?:\s*(.+)/i,
        /fix(?:\(([^)]+)\))?:\s*(.+)/i,
        /\[([A-Z]+-\d+)\]\s*(.+)/i,
        /^(Mobile|Family|Fabric|Dashboard|Auth|Finance|Settings)[:\s]+(.+)/i
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
            return match[2] || match[1] || message.split('\n')[0];
        }
    }
    return message.split('\n')[0].substring(0, 50);
}

/**
 * Extract commit type (feat, fix, docs, etc.)
 */
function extractCommitType(message) {
    const msg = message.toLowerCase();
    if (msg.startsWith('feat')) return 'feature';
    if (msg.startsWith('fix')) return 'bugfix';
    if (msg.startsWith('docs')) return 'docs';
    if (msg.startsWith('refactor')) return 'refactor';
    if (msg.startsWith('test')) return 'test';
    if (msg.startsWith('chore')) return 'chore';
    if (msg.includes('hotfix')) return 'hotfix';
    return 'other';
}

/**
 * Get commits between two tags/versions
 */
async function getCommitsBetweenVersions(fromVersion, toVersion) {
    try {
        const log = await git.log({ from: fromVersion, to: toVersion });
        return log.all.map(commit => ({
            hash: commit.hash.substring(0, 7),
            message: commit.message,
            date: commit.date,
            feature: extractFeature(commit.message),
            type: extractCommitType(commit.message)
        }));
    } catch (error) {
        console.error(`Error getting commits between ${fromVersion} and ${toVersion}:`, error.message);
        return [];
    }
}

/**
 * Get all tags (versions)
 */
async function getTags() {
    try {
        const tags = await git.tags();
        return tags.all.sort().reverse();
    } catch (error) {
        console.error('Error getting tags:', error);
        return [];
    }
}

/**
 * Get actual deployments from git commit history
 * Parses Firebase deploy commits to determine which version is on each environment
 */
async function getActualDeployments() {
    try {
        const log = await git.log({ maxCount: 200 });
        const deployments = {
            production: { version: null, hash: null, date: null, commits: [] },
            staging: { version: null, hash: null, date: null, commits: [] },
            development: { version: null, hash: null, date: null, commits: [] }
        };

        // Patterns to detect deploy commits
        const deployPatterns = [
            /deploy.*:.*production|deploy:production|npm run deploy:production/i,
            /deploy.*:.*staging|deploy:staging|npm run deploy:staging/i,
            /deploy.*:.*dev|deploy:dev|npm run deploy:dev|anchor-os-dev/i,
            /firebase deploy --only hosting:(anchor-os|staging|dev)/i
        ];

        // Version extraction pattern
        const versionPattern = /v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/;

        // Track commits since last deploy to each env
        const commitsSinceDeploy = {
            production: [],
            staging: [],
            development: []
        };

        let foundProd = false, foundStaging = false, foundDev = false;

        for (const commit of log.all) {
            const msg = commit.message.toLowerCase();
            const fullMsg = commit.message;

            // Check for production deploy
            if (!foundProd && (msg.includes('production') || msg.includes('anchor-os.web.app')) &&
                (msg.includes('deploy') || msg.includes('release'))) {
                const vMatch = fullMsg.match(versionPattern);
                deployments.production = {
                    version: vMatch ? `v${vMatch[1]}` : 'unknown',
                    hash: commit.hash.substring(0, 7),
                    date: commit.date,
                    message: commit.message.split('\n')[0]
                };
                deployments.production.commits = [...commitsSinceDeploy.production];
                foundProd = true;
            } else if (!foundProd) {
                commitsSinceDeploy.production.push({
                    hash: commit.hash.substring(0, 7),
                    message: commit.message.split('\n')[0],
                    type: extractCommitType(commit.message)
                });
            }

            // Check for staging deploy
            if (!foundStaging && (msg.includes('staging') || msg.includes('anchor-os-staging')) &&
                msg.includes('deploy')) {
                const vMatch = fullMsg.match(versionPattern);
                deployments.staging = {
                    version: vMatch ? `v${vMatch[1]}` : 'unknown',
                    hash: commit.hash.substring(0, 7),
                    date: commit.date,
                    message: commit.message.split('\n')[0]
                };
                deployments.staging.commits = [...commitsSinceDeploy.staging];
                foundStaging = true;
            } else if (!foundStaging) {
                commitsSinceDeploy.staging.push({
                    hash: commit.hash.substring(0, 7),
                    message: commit.message.split('\n')[0],
                    type: extractCommitType(commit.message)
                });
            }

            // Check for dev deploy
            if (!foundDev && (msg.includes('dev') || msg.includes('anchor-os-dev') || msg.includes('development')) &&
                msg.includes('deploy')) {
                const vMatch = fullMsg.match(versionPattern);
                deployments.development = {
                    version: vMatch ? `v${vMatch[1]}` : 'unknown',
                    hash: commit.hash.substring(0, 7),
                    date: commit.date,
                    message: commit.message.split('\n')[0]
                };
                deployments.development.commits = [...commitsSinceDeploy.development];
                foundDev = true;
            } else if (!foundDev) {
                commitsSinceDeploy.development.push({
                    hash: commit.hash.substring(0, 7),
                    message: commit.message.split('\n')[0],
                    type: extractCommitType(commit.message)
                });
            }

            // Stop if we found all three
            if (foundProd && foundStaging && foundDev) break;
        }

        // Also check package.json for current version
        try {
            const packageJson = require(path.join(REPO_PATH, 'package.json'));
            deployments.currentVersion = `v${packageJson.version}`;
        } catch (e) {
            deployments.currentVersion = 'unknown';
        }

        return deployments;
    } catch (error) {
        console.error('Error getting actual deployments:', error.message);
        return {
            production: { version: 'unknown' },
            staging: { version: 'unknown' },
            development: { version: 'unknown' },
            error: error.message
        };
    }
}

/**
 * Extract pending changes from git history by comparing commits
 * Returns features/bugs that are in dev but not staging, or staging but not prod
 */
async function getPendingChangesByGit() {
    try {
        const deployments = await getActualDeployments();

        // Commits in dev but not staging
        const devOnlyCommits = deployments.development.commits || [];

        // Commits in staging but not production
        const stagingOnlyCommits = deployments.staging.commits || [];

        // Parse commit messages to extract IDs and types
        const parseCommit = (commit) => {
            const msg = commit.message;
            const patterns = {
                bug: /\bBUG-(\d+)\b/i,
                reg: /\bREG-(\d+)\b/i,
                gap: /\bGAP-(\d+)\b/i,
                ux: /\bUX-(\d+)\b/i,
                task: /\bTASK-(\d+)\b/i,
                arch: /\bARCH-(\d+)\b/i,
                feat: /^feat(?:\([^)]+\))?:\s*(.+)/i,
                fix: /^fix(?:\([^)]+\))?:\s*(.+)/i
            };

            for (const [type, pattern] of Object.entries(patterns)) {
                const match = msg.match(pattern);
                if (match) {
                    return {
                        id: match[0].toUpperCase(),
                        type: type === 'feat' ? 'feature' : type === 'fix' ? 'bugfix' : type,
                        title: msg.split('\n')[0],
                        hash: commit.hash
                    };
                }
            }

            return {
                id: commit.hash,
                type: commit.type || 'other',
                title: msg.split('\n')[0],
                hash: commit.hash
            };
        };

        return {
            devToStaging: devOnlyCommits.map(parseCommit),
            stagingToProduction: stagingOnlyCommits.map(parseCommit),
            versions: {
                production: deployments.production?.version,
                staging: deployments.staging?.version,
                development: deployments.development?.version,
                current: deployments.currentVersion
            }
        };
    } catch (error) {
        console.error('Error getting pending changes:', error.message);
        return { devToStaging: [], stagingToProduction: [], versions: {}, error: error.message };
    }
}

/**
 * Get current branch
 */
async function getCurrentBranch() {
    try {
        const status = await git.status();
        return status.current;
    } catch (error) {
        return 'unknown';
    }
}

/**
 * Get deployment timeline (commits grouped by day)
 */
async function getDeploymentTimeline(days = 14) {
    const commits = await getRecentCommits(100);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const timeline = {};
    for (const commit of commits) {
        const date = new Date(commit.date);
        if (date < cutoff) continue;

        // Exclude infra/refactor/chore commits from the product timeline
        const commitType = extractCommitType(commit.message);
        if (commitType === 'refactor' || commitType === 'chore') continue;

        const dateKey = date.toISOString().split('T')[0];
        if (!timeline[dateKey]) {
            timeline[dateKey] = { date: dateKey, commits: [], features: new Set() };
        }
        timeline[dateKey].commits.push(commit);
        if (commit.feature) {
            timeline[dateKey].features.add(commit.feature);
        }
    }

    // Convert to array and add features as array
    return Object.values(timeline)
        .map(day => ({
            ...day,
            features: Array.from(day.features),
            commitCount: day.commits.length
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Search for bug ID in commit history
 */
async function searchBugInCommits(bugId) {
    try {
        const log = await git.log({ maxCount: 200 });
        const matches = log.all.filter(c =>
            c.message.toLowerCase().includes(bugId.toLowerCase())
        );
        return matches.map(c => ({
            hash: c.hash.substring(0, 7),
            message: c.message,
            date: c.date
        }));
    } catch (error) {
        return [];
    }
}

/**
 * Get repo stats
 */
async function getRepoStats() {
    try {
        const [status, log] = await Promise.all([
            git.status(),
            git.log({ maxCount: 1 })
        ]);

        // Filter to count only Anchor OS production files (not dashboard/tooling)
        const anchorOsModified = status.modified.filter(file =>
            !file.startsWith('tools/dashboard/') &&
            !file.startsWith('.agent/') &&
            !file.startsWith('scripts/') &&
            !file.startsWith('.husky/') &&
            !file.startsWith('.firebase/')
        );

        return {
            branch: status.current,
            isClean: status.isClean(),
            modifiedFiles: anchorOsModified.length,
            stagedFiles: status.staged.length,
            lastCommit: log.latest ? {
                hash: log.latest.hash.substring(0, 7),
                message: log.latest.message,
                date: log.latest.date,
                author: log.latest.author_name
            } : null
        };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Component dependency map - tracks what depends on what
 */
const COMPONENT_DEPS = {
    'src/context/AnchorContext.tsx': {
        dependents: ['All views', 'Navigation', 'State management'],
        impactLevel: 'critical',
        areas: ['navigation', 'finance', 'tasks', 'settings']
    },
    'src/context/AuthContext.tsx': {
        dependents: ['Login', 'Protected routes', 'User data'],
        impactLevel: 'critical',
        areas: ['auth', 'security']
    },
    'src/context/FinanceContext.tsx': {
        dependents: ['FinanceView', 'TransactionForm', 'AccountDetails'],
        impactLevel: 'high',
        areas: ['finance']
    },
    'src/context/FamilyContext.tsx': {
        dependents: ['FamilySettings', 'Shared accounts', 'Invites'],
        impactLevel: 'high',
        areas: ['family']
    },
    'src/layouts/MainLayout.tsx': {
        dependents: ['All views', 'Navigation', 'Mobile responsiveness'],
        impactLevel: 'high',
        areas: ['ui', 'mobile', 'navigation']
    },
    'src/components/ui/Button.tsx': {
        dependents: ['All UI', '100+ components'],
        impactLevel: 'high',
        areas: ['ui']
    },
    'src/components/shared/Modal.tsx': {
        dependents: ['ConfirmationModal', 'Forms', 'Dialogs'],
        impactLevel: 'medium',
        areas: ['ui', 'mobile']
    },
    'src/index.css': {
        dependents: ['Global styles', 'All components'],
        impactLevel: 'high',
        areas: ['ui', 'styling']
    }
};

/**
 * Get impact analysis for recently changed files
 */
async function getImpactAnalysis() {
    try {
        const status = await git.status();
        const modifiedFiles = [...status.modified, ...status.not_added, ...status.created];

        // Get recent commit files too
        const log = await git.log({ maxCount: 5 });
        const recentCommitFiles = [];
        for (const commit of log.all) {
            try {
                const diff = await git.show([commit.hash, '--name-only', '--format=']);
                const files = diff.split('\n').filter(f => f.trim());
                recentCommitFiles.push(...files);
            } catch (e) {
                // Ignore errors
            }
        }

        const allChangedFiles = [...new Set([...modifiedFiles, ...recentCommitFiles])];

        const impacts = [];
        const affectedAreas = new Set();
        let maxImpactLevel = 'low';

        for (const file of allChangedFiles) {
            const dep = COMPONENT_DEPS[file];
            if (dep) {
                impacts.push({
                    file,
                    ...dep
                });
                dep.areas.forEach(a => affectedAreas.add(a));
                if (dep.impactLevel === 'critical') maxImpactLevel = 'critical';
                else if (dep.impactLevel === 'high' && maxImpactLevel !== 'critical') maxImpactLevel = 'high';
                else if (dep.impactLevel === 'medium' && maxImpactLevel === 'low') maxImpactLevel = 'medium';
            } else {
                // Infer from file path
                const area = inferAreaFromPath(file);
                if (area) affectedAreas.add(area);
            }
        }

        return {
            totalChanges: allChangedFiles.length,
            knownImpacts: impacts,
            affectedAreas: Array.from(affectedAreas),
            overallRisk: maxImpactLevel,
            recommendedTests: generateRecommendedTests(Array.from(affectedAreas)),
            changedFiles: allChangedFiles.slice(0, 20) // Show first 20
        };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Infer affected area from file path
 */
function inferAreaFromPath(filePath) {
    if (filePath.includes('/finance/')) return 'finance';
    if (filePath.includes('/settings/')) return 'settings';
    if (filePath.includes('/family/')) return 'family';
    if (filePath.includes('/auth/')) return 'auth';
    if (filePath.includes('/dashboard/')) return 'dashboard';
    if (filePath.includes('/tasks/') || filePath.includes('/commitments/')) return 'tasks';
    if (filePath.includes('/mobile/')) return 'mobile';
    if (filePath.includes('/ui/') || filePath.includes('/shared/')) return 'ui';
    if (filePath.includes('Context')) return 'state';
    return null;
}

/**
 * Generate recommended tests based on affected areas
 */
function generateRecommendedTests(areas) {
    const tests = [];
    if (areas.includes('finance')) tests.push('npm test -- --grep Finance', 'E2E: Transaction CRUD');
    if (areas.includes('auth')) tests.push('npm test -- --grep Auth', 'E2E: Login/Signup flow');
    if (areas.includes('mobile')) tests.push('Run on real iPhone', 'Lighthouse mobile audit');
    if (areas.includes('ui')) tests.push('Visual regression check', 'Dark mode test');
    if (areas.includes('navigation')) tests.push('E2E: Navigation flows');
    if (areas.includes('family')) tests.push('E2E: Family invite flow');
    return tests.length > 0 ? tests : ['npm test', 'Manual smoke test'];
}

module.exports = {
    getRecentCommits,
    getRecentCommitsFiltered,
    classifyCommit,
    getCommitsBetweenVersions,
    getTags,
    getActualDeployments,
    getPendingChangesByGit,
    getCurrentBranch,
    getDeploymentTimeline,
    searchBugInCommits,
    getRepoStats,
    getImpactAnalysis
};
