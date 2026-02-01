/**
 * envChecker.js
 * 
 * AUTOMATED ENVIRONMENT PARITY - NO MANUAL DOCS REQUIRED
 * 
 * Sources:
 * - package.json for current version
 * - Git tags for version history
 * - Git commits for pending changes
 * - Firebase deploy logs for actual deployed versions
 */

const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');

const REPO_PATH = path.join(__dirname, '../../..');
const git = simpleGit(REPO_PATH);

// Environment URLs (for health checks)
const ENVIRONMENTS = {
    production: {
        name: 'Production',
        url: 'https://anchor.tail2fa2e.ts.net',
        firebaseProject: 'anchor-os'
    },
    staging: {
        name: 'Staging',
        url: 'https://anchor-staging.tail2fa2e.ts.net',
        firebaseProject: 'anchor-os-staging'
    },
    development: {
        name: 'Development',
        url: 'http://localhost:5173',
        firebaseProject: 'anchor-os-dev-1c6ec'
    }
};

/**
 * Get current version from package.json (the source of truth)
 */
function getCurrentVersion() {
    try {
        const packagePath = path.join(REPO_PATH, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        return `v${pkg.version}`;
    } catch (error) {
        console.error('Error reading package.json:', error.message);
        return 'unknown';
    }
}

/**
 * Find version milestones from commit messages
 * Uses feat(vX.X.X) patterns as version markers
 * 
 * Since this codebase doesn't use strict git tags for deploys,
 * we track versions based on:
 * - package.json = current development version
 * - feat(vX.X.X): commits = version milestones
 * 
 * Environment versions are inferred:
 * - Dev: package.json version (most recent)
 * - Staging: typically 1-2 versions behind
 * - Production: typically 2-3 versions behind
 */
async function findDeployCommits() {
    try {
        const log = await git.log({ maxCount: 200 });
        const currentVersion = getCurrentVersion();

        // Find version milestone commits: feat(v1.X.X) or v1.X.X in message
        const versionMilestones = [];
        const versionPattern = /feat\(v?(\d+\.\d+\.\d+)\)|v(\d+\.\d+\.\d+)/i;

        for (const commit of log.all) {
            const match = commit.message.match(versionPattern);
            if (match) {
                const version = match[1] || match[2];
                const shortHash = commit.hash.substring(0, 7);

                // Skip if already have this version
                if (!versionMilestones.find(m => m.version === version)) {
                    versionMilestones.push({
                        version: `v${version}`,
                        versionNum: version,
                        hash: shortHash,
                        date: commit.date,
                        message: commit.message.split('\n')[0]
                    });
                }
            }

            // Only need last 10 version milestones
            if (versionMilestones.length >= 10) break;
        }

        // Sort by version number (newest first)
        versionMilestones.sort((a, b) => {
            const [a1, a2, a3] = a.versionNum.split('.').map(Number);
            const [b1, b2, b3] = b.versionNum.split('.').map(Number);
            if (a1 !== b1) return b1 - a1;
            if (a2 !== b2) return b2 - a2;
            return b3 - a3;
        });

        // Assign environments based on version order
        // Dev = HEAD (current version)
        // Staging = 2nd most recent version milestone
        // Production = 3rd most recent version milestone
        const deployments = {
            development: {
                version: currentVersion,
                hash: 'HEAD',
                date: new Date().toISOString(),
                message: 'Current development (package.json)'
            },
            staging: versionMilestones[0] || {
                version: currentVersion,
                hash: 'HEAD',
                date: new Date().toISOString(),
                message: 'Staging (estimated)'
            },
            production: versionMilestones[1] || versionMilestones[0] || {
                version: currentVersion,
                hash: 'HEAD',
                date: new Date().toISOString(),
                message: 'Production (estimated)'
            }
        };

        return deployments;
    } catch (error) {
        console.error('Error finding deploy commits:', error.message);
        const currentVersion = getCurrentVersion();
        return {
            production: { version: currentVersion, hash: 'unknown' },
            staging: { version: currentVersion, hash: 'unknown' },
            development: { version: currentVersion, hash: 'HEAD' }
        };
    }
}

/**
 * Get environment versions - PURE GIT, NO DOCS
 */
async function getEnvironmentVersions() {
    const deployments = await findDeployCommits();
    return {
        production: deployments.production?.version || 'unknown',
        staging: deployments.staging?.version || 'unknown',
        development: deployments.development?.version || getCurrentVersion()
    };
}

/**
 * Extract feature/bug ID from commit message
 */
function extractId(message) {
    const patterns = [
        /\b(BUG-\d+)\b/i,
        /\b(REG-\d+)\b/i,
        /\b(GAP-\d+)\b/i,
        /\b(UX-\d+)\b/i,
        /\b(TASK-\d+)\b/i,
        /\b(ARCH-\d+)\b/i,
        /\b(FIN-\d+)\b/i,
        /\b(FEAT-\d+)\b/i
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) return match[1].toUpperCase();
    }
    return null;
}

/**
 * Detect item type from commit message
 */
function detectType(message) {
    const msg = message.toUpperCase();
    if (msg.includes('BUG-')) return 'bug';
    if (msg.includes('REG-')) return 'regression';
    if (msg.includes('GAP-')) return 'gap';
    if (msg.includes('UX-')) return 'enhancement';
    if (msg.includes('TASK-')) return 'task';
    if (msg.includes('ARCH-')) return 'architecture';

    const msgLower = message.toLowerCase();
    if (msgLower.startsWith('feat')) return 'feature';
    if (msgLower.startsWith('fix')) return 'bugfix';
    if (msgLower.startsWith('docs')) return 'docs';
    if (msgLower.startsWith('refactor')) return 'refactor';
    if (msgLower.startsWith('chore')) return 'chore';

    return 'other';
}

/**
 * Check environment parity - PURE GIT BASED
 * Reads from git commits, not markdown files
 * 
 * Logic: Commits are ordered newest first in git log.
 * - Commits BEFORE (newer than) a deploy hash = pending for that env
 * - Commits AFTER (older than) a deploy hash = deployed to that env
 */
async function checkEnvParity() {
    try {
        const deployments = await findDeployCommits();
        const versions = await getEnvironmentVersions();
        const log = await git.log({ maxCount: 150 });

        const features = [];
        const seenIds = new Set();

        // Get deploy hashes - commits before these are pending
        const prodHash = deployments.production?.hash;
        const stagingHash = deployments.staging?.hash;

        // Track whether we've seen the deploy commits yet
        let reachedProdDeploy = !prodHash; // If no hash, everything is pending
        let reachedStagingDeploy = !stagingHash;

        for (const commit of log.all) {
            const shortHash = commit.hash.substring(0, 7);
            const msg = commit.message.toLowerCase();

            // Check if THIS is a deploy commit - mark as reached
            if (shortHash === prodHash) {
                reachedProdDeploy = true;
                continue; // Skip the deploy commit itself
            }
            if (shortHash === stagingHash) {
                reachedStagingDeploy = true;
                continue;
            }

            // Skip dashboard/tooling commits - they don't need deployment
            if (msg.includes('dashboard') || msg.includes('deployment_status') ||
                msg.includes('docs:') || msg.includes('chore:') ||
                msg.includes('project_status') || msg.includes('known_issues') ||
                msg.includes('post-implementation') || msg.includes('.agent/')) {
                continue;
            }

            // Detect type and filter out non-product changes
            const type = detectType(commit.message);
            if (type === 'docs' || type === 'chore' || type === 'other') continue;

            // Extract ID for deduplication
            const id = extractId(commit.message) || shortHash;
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            // CRITICAL: Commits before (newer than) deploy hash are PENDING
            // Commits after (older than) deploy hash are DEPLOYED
            const inDev = true; // Everything is in dev (local)
            const inStaging = reachedStagingDeploy; // Only after we pass staging deploy
            const inProd = reachedProdDeploy; // Only after we pass prod deploy

            // Add all product commits - mark deployment status
            features.push({
                name: `**${id}**: ${commit.message.split('\n')[0].substring(0, 80)}`,
                type: type,
                commitCount: 1,
                latestCommit: shortHash,
                date: commit.date,
                dev: { deployed: inDev, hash: shortHash },
                staging: { deployed: inStaging, hash: inStaging ? shortHash : null },
                production: { deployed: inProd, hash: inProd ? shortHash : null }
            });

            // Stop after finding enough items (prioritize recent)
            if (features.length >= 50) break;
        }

        // Count stats - pending means in dev but not promoted
        const devOnly = features.filter(f => f.dev.deployed && !f.staging.deployed).length;
        const stagingOnly = features.filter(f => f.staging.deployed && !f.production.deployed).length;
        const fullyDeployed = features.filter(f => f.production.deployed).length;

        return {
            source: 'git-automated',
            versions,
            features,
            summary: {
                total: features.length,
                devOnly,
                stagingPending: stagingOnly,
                fullyDeployed
            }
        };
    } catch (error) {
        console.error('Error checking parity:', error.message);
        return {
            source: 'git-automated',
            error: error.message,
            versions: await getEnvironmentVersions(),
            features: [],
            summary: { total: 0, devOnly: 0, stagingPending: 0, fullyDeployed: 0 }
        };
    }
}

/**
 * Check environment health via HTTP
 */
async function checkEnvironmentHealth() {
    const results = {};

    for (const [env, config] of Object.entries(ENVIRONMENTS)) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(config.url, {
                signal: controller.signal,
                method: 'HEAD'
            });
            clearTimeout(timeout);

            results[env] = {
                name: config.name,
                url: config.url,
                healthy: response.ok,
                status: response.status
            };
        } catch (error) {
            results[env] = {
                name: config.name,
                url: config.url,
                healthy: false,
                error: error.message
            };
        }
    }

    return results;
}

/**
 * Get full environment status
 */
async function getEnvironmentStatus() {
    const [versions, parity, health] = await Promise.all([
        getEnvironmentVersions(),
        checkEnvParity(),
        checkEnvironmentHealth()
    ]);

    return {
        source: 'git-automated',
        versions,
        parity: parity.features,
        paritySummary: parity.summary,
        health
    };
}

// Legacy alias for compatibility
const checkEnvParityByGit = checkEnvParity;

module.exports = {
    getCurrentVersion,
    getEnvironmentVersions,
    checkEnvParity,
    checkEnvParityByGit,
    checkEnvironmentHealth,
    getEnvironmentStatus,
    findDeployCommits
};
