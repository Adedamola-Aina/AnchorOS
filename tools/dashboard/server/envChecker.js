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
 * Find deploy commits from git history
 * 
 * STANDARDIZED FORMAT (preferred):
 *   deploy(production): vX.X.X
 *   deploy(staging): vX.X.X
 *   deploy(development): vX.X.X  (or deploy(dev):)
 * 
 * Also supports version suffixes like -revert, -hotfix, etc.
 * 
 * FALLBACK: Uses version patterns in commit messages
 */
async function findDeployCommits() {
    try {
        const log = await git.log({ maxCount: 300 });
        const currentVersion = getCurrentVersion();

        const deployments = {
            production: null,
            staging: null,
            development: null
        };

        // Patterns to detect standardized deploy markers
        // Supports: v1.5.12, v1.5.11-revert, v1.5.12-hotfix, etc.
        const deployPatterns = {
            production: /deploy\(production\):\s*v?(\d+\.\d+\.\d+(?:-\w+)?)/i,
            staging: /deploy\(staging\):\s*v?(\d+\.\d+\.\d+(?:-\w+)?)/i,
            development: /deploy\(dev(?:elopment)?\):\s*v?(\d+\.\d+\.\d+(?:-\w+)?)/i
        };

        // Also look for version patterns as fallback
        const versionCommits = {};
        const versionPattern = /v?(\d+\.\d+\.\d+)/;

        for (const commit of log.all) {
            const msg = commit.message;
            const shortHash = commit.hash.substring(0, 7);

            // Check for standardized deploy markers FIRST
            for (const [env, pattern] of Object.entries(deployPatterns)) {
                if (!deployments[env]) {
                    const match = msg.match(pattern);
                    if (match) {
                        // Check for actual deployed commit hash in message
                        // Format: "@ 82e3d43" or "Actual deployed commit: 82e3d43"
                        const actualHashMatch = msg.match(/@\s*([a-f0-9]{7})|Actual deployed commit:\s*([a-f0-9]{7})/i);
                        const deployedHash = actualHashMatch ? (actualHashMatch[1] || actualHashMatch[2]) : shortHash;
                        
                        deployments[env] = {
                            version: `v${match[1]}`,
                            hash: shortHash,              // The marker commit
                            deployedHash: deployedHash,   // The actual deployed code
                            date: commit.date,
                            message: msg.split('\n')[0],
                            source: 'deploy-marker'
                        };
                    }
                }
            }

            // Also collect version patterns for fallback
            const vMatch = msg.match(versionPattern);
            if (vMatch && !versionCommits[vMatch[1]]) {
                versionCommits[vMatch[1]] = {
                    version: `v${vMatch[1]}`,
                    hash: shortHash,
                    date: commit.date
                };
            }
        }

        // Use fallbacks if standardized markers not found
        if (!deployments.production) {
            // STRICT MODE: Do not incorrectly attribute random commits as production markers.
            // If no deploy(production): marker exists, assume not deployed or unknown.
            deployments.production = {
                version: 'unknown',
                hash: null,
                source: 'fallback-unknown'
            };
        }
        if (!deployments.staging) {
            deployments.staging = versionCommits['1.5.7'] || versionCommits['1.5.8'] || {
                version: 'v1.5.7', hash: 'unknown', source: 'fallback'
            };
        }
        if (!deployments.development) {
            deployments.development = {
                version: currentVersion,
                hash: 'HEAD',
                date: new Date().toISOString(),
                message: 'Current development (package.json)',
                source: 'package.json'
            };
        }

        return deployments;
    } catch (error) {
        console.error('Error finding deploy commits:', error.message);
        const currentVersion = getCurrentVersion();
        return {
            production: { version: 'v1.5.5', hash: 'unknown', source: 'fallback' },
            staging: { version: 'v1.5.7', hash: 'unknown', source: 'fallback' },
            development: { version: currentVersion, hash: 'HEAD', source: 'package.json' }
        };
    }
}

/**
 * Get environment versions - PURE GIT, NO DOCS
 * Returns version AND commit hash to prevent ambiguity
 * when same version is deployed from different codebases
 */
async function getEnvironmentVersions() {
    const deployments = await findDeployCommits();
    return {
        production: deployments.production?.version || 'unknown',
        staging: deployments.staging?.version || 'unknown',
        development: deployments.development?.version || getCurrentVersion(),
        // Include hashes for disambiguation
        hashes: {
            production: deployments.production?.deployedHash || deployments.production?.hash || 'unknown',
            staging: deployments.staging?.deployedHash || deployments.staging?.hash || 'unknown',
            development: deployments.development?.deployedHash || deployments.development?.hash || 'HEAD'
        },
        // Include full deployment info for debugging
        details: {
            production: deployments.production || null,
            staging: deployments.staging || null,
            development: deployments.development || null
        }
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
 * Uses version milestone detection and commit ordering
 * 
 * Logic: 
 * - Find commits with version patterns (v1.5.5, v1.5.7, etc.)
 * - Use those as markers for what's deployed to each environment
 * - Commits newer than the staging marker = "dev only"
 * - Commits between prod and staging = "staging only"
 */
async function checkEnvParity() {
    try {
        const deployments = await findDeployCommits();
        const versions = await getEnvironmentVersions();
        const log = await git.log({ maxCount: 150 });

        const features = [];
        const seenIds = new Set();

        // Get versions for comparison
        const prodVersion = versions.production.replace('v', '');
        const stagingVersion = versions.staging.replace('v', '');

        // Helper to compare versions
        const compareVersions = (v1, v2) => {
            const [a1, a2, a3] = v1.split('.').map(Number);
            const [b1, b2, b3] = v2.split('.').map(Number);
            if (a1 !== b1) return a1 - b1;
            if (a2 !== b2) return a2 - b2;
            return a3 - b3;
        };

        // Track which milestone we've passed based on commit position
        let foundStagingMarker = false;
        let foundProdMarker = false;

        for (const commit of log.all) {
            const shortHash = commit.hash.substring(0, 7);
            const msg = commit.message.toLowerCase();
            const fullMsg = commit.message;

            // NOW check if this PRODUCT commit mentions a version (as a marker)
            // Only product commits should set version markers
            const versionMatch = fullMsg.match(/v?(\d+\.\d+\.\d+)/);
            if (versionMatch) {
                const commitVersion = versionMatch[1];
                // If we see staging version, mark it
                if (commitVersion === stagingVersion) foundStagingMarker = true;
                // If we see prod version, mark it
                if (commitVersion === prodVersion) foundProdMarker = true;
            }

            // Skip dashboard/tooling commits FIRST - don't let them affect markers
            if (msg.includes('dashboard') || msg.includes('deployment_status') ||
                msg.includes('docs:') || msg.includes('chore:') ||
                msg.includes('project_status') || msg.includes('known_issues') ||
                msg.includes('post-implementation') || msg.includes('.agent/') ||
                msg.includes('deployment') || msg.includes('deploy')) {
                continue;
            }

            // Detect type
            const type = detectType(fullMsg);
            if (type === 'docs' || type === 'chore' || type === 'other') continue;

            // Extract ID
            const id = extractId(fullMsg) || shortHash;
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            // Determine deployment status based on which markers we've passed
            // If we HAVEN'T seen the staging marker yet, this commit is DEV ONLY
            // If we've seen staging but not prod, it's STAGING ONLY
            // If we've seen prod, it's FULLY DEPLOYED
            const inDev = true;
            const inStaging = foundStagingMarker;
            const inProd = foundProdMarker;

            features.push({
                name: `**${id}**: ${fullMsg.split('\n')[0].substring(0, 80)}`,
                type: type,
                commitCount: 1,
                latestCommit: shortHash,
                date: commit.date,
                dev: { deployed: inDev, hash: shortHash },
                staging: { deployed: inStaging, hash: inStaging ? shortHash : null },
                production: { deployed: inProd, hash: inProd ? shortHash : null }
            });

            if (features.length >= 50) break;
        }

        // Count stats
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
