/**
 * envChecker.js
 * 
 * AUTOMATED ENVIRONMENT PARITY - NO MANUAL DOCS REQUIRED
 * 
 * Uses GIT ANCESTRY for accurate deployment status.
 * A commit is "deployed" to an environment if it's an ancestor of that
 * environment's deployed hash.
 * 
 * Sources:
 * - package.json for current version
 * - Git history for deploy markers (deploy(env): version @ hash)
 * - Git ancestry for accurate containment checks
 */
// @ts-nocheck


const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');
const deploymentTracker = require('./deploymentTracker');
const { classifyCommit } = require('./gitAnalyzer');

const REPO_PATH = path.join(__dirname, '../../..');
const git = simpleGit(REPO_PATH);

// Environment URLs (for health checks)
const ENVIRONMENTS = {
    production: {
        name: 'Production',
        url: 'https://anchor-os.web.app',
        firebaseProject: 'anchor-os'
    },
    staging: {
        name: 'Staging',
        url: 'https://anchor-os-staging.web.app',
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
 * Find deploy commits from git history
 * Delegates to deploymentTracker for accurate parsing
 */
async function findDeployCommits() {
    return deploymentTracker.parseDeployMarkers();
}

/**
 * Get environment versions with hashes for disambiguation
 */
async function getEnvironmentVersions() {
    const deployments = await deploymentTracker.parseDeployMarkers();
    return {
        production: deployments.production?.version || 'unknown',
        staging: deployments.staging?.version || 'unknown',
        development: deployments.development?.version || getCurrentVersion(),
        hashes: {
            production: deployments.production?.deployedHash || 'unknown',
            staging: deployments.staging?.deployedHash || 'unknown',
            development: deployments.development?.deployedHash || 'HEAD'
        },
        details: deployments
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
        /\b(FEAT-\d+)\b/i,
        /\b(SEC-\d+)\b/i,
        /\b(PLT-\d+)\b/i,
        /\b(DES-\d+)\b/i,
        /\b(WEB-\d+)\b/i,
        /\b(ENG-\d+)\b/i,
        /\b(PWA-\d+)\b/i
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
    if (msg.includes('SEC-')) return 'security';
    if (msg.includes('DES-')) return 'design';
    if (msg.includes('WEB-')) return 'feature';
    if (msg.includes('PLT-')) return 'platform';

    const msgLower = message.toLowerCase();
    if (msgLower.startsWith('feat')) return 'feature';
    if (msgLower.startsWith('fix')) return 'bugfix';
    if (msgLower.startsWith('docs')) return 'docs';
    if (msgLower.startsWith('refactor')) return 'refactor';
    if (msgLower.startsWith('chore')) return 'chore';

    return 'other';
}

// isDashboardCommit() REMOVED — replaced by classifyCommit() from gitAnalyzer.js
// which uses actual file paths instead of fragile message-keyword matching

/**
 * Check environment parity using GIT ANCESTRY
 * 
 * This is the CORRECT approach:
 * - A commit is "in" an environment if it's an ancestor of the deployed hash
 * - Uses `git merge-base --is-ancestor` for accuracy
 * - Handles reverts correctly (new marker -> old code)
 */
async function checkEnvParity() {
    try {
        const deployments = await deploymentTracker.parseDeployMarkers();
        const versions = await getEnvironmentVersions();
        const log = await git.log({ maxCount: 100 });

        // Skip deploy markers, then classify all remaining commits by file paths
        const candidates = log.all.filter(c => !c.message.toLowerCase().includes('deploy('));

        // Batch-classify commits using file-path analysis (not message parsing)
        const classifications = await Promise.all(
            candidates.map(async c => ({
                commit: c,
                category: await classifyCommit(c.hash)
            }))
        );

        // ONLY anchorOS (product) commits belong in environment parity
        const productCommits = [];
        const seenIds = new Set();

        for (const { commit, category } of classifications) {
            if (category !== 'anchorOS') continue;

            const fullMsg = commit.message;
            const type = detectType(fullMsg);
            const id = extractId(fullMsg) || commit.hash.substring(0, 7);
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            productCommits.push({
                id,
                hash: commit.hash.substring(0, 7),
                fullHash: commit.hash,
                message: fullMsg.split('\n')[0].substring(0, 80),
                type,
                date: commit.date
            });

            if (productCommits.length >= 50) break;
        }

        // Batch check deployment status using git ancestry
        const commitHashes = productCommits.map(c => c.fullHash);
        const deploymentStatus = await deploymentTracker.batchCheckDeploymentStatus(
            commitHashes, 
            deployments
        );

        // Build feature list with accurate deployment status
        const features = productCommits.map(commit => {
            const status = deploymentStatus.get(commit.fullHash) || {
                production: false,
                staging: false,
                development: false
            };

            return {
                name: `**${commit.id}**: ${commit.message}`,
                type: commit.type,
                commitCount: 1,
                latestCommit: commit.hash,
                date: commit.date,
                dev: { deployed: status.development, hash: status.development ? commit.hash : null },
                staging: { deployed: status.staging, hash: status.staging ? commit.hash : null },
                production: { deployed: status.production, hash: status.production ? commit.hash : null }
            };
        });

        // Count stats
        const notDeployed = features.filter(f => 
            !f.dev.deployed && !f.staging.deployed && !f.production.deployed
        ).length;
        const devOnly = features.filter(f => 
            f.dev.deployed && !f.staging.deployed && !f.production.deployed
        ).length;
        const stagingOnly = features.filter(f => 
            f.staging.deployed && !f.production.deployed
        ).length;
        const fullyDeployed = features.filter(f => f.production.deployed).length;

        return {
            source: 'git-ancestry',
            versions,
            features,
            summary: {
                total: features.length,
                notDeployed,
                devOnly,
                stagingPending: stagingOnly,
                fullyDeployed
            }
        };
    } catch (error) {
        console.error('Error checking parity:', error.message);
        return {
            source: 'git-ancestry',
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
        source: 'git-ancestry',
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
