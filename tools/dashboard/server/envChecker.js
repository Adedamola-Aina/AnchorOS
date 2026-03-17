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
const deploymentTracker = require('./deploymentTracker');
const gitDataProvider = require('./gitDataProvider');

const REPO_PATH = path.join(__dirname, '../../..');

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
 * Check environment parity using GIT ANCESTRY
 * 
 * This is the CORRECT approach:
 * - A commit is "in" an environment if it's an ancestor of the deployed hash
 * - Uses `git merge-base --is-ancestor` for accuracy
 * - Handles reverts correctly (new marker -> old code)
 */
async function checkEnvParity() {
    try {
        const versions = await getEnvironmentVersions();
        const trackedItems = await gitDataProvider.getAllTrackedItems(200);
        const productItems = trackedItems
            .filter((item) => item.workKind !== 'infra' && item.workKind !== 'docs')
            .slice(0, 50);

        const features = productItems.map((item) => {
            const status = item.environments || {
                production: false,
                staging: false,
                dev: false
            };

            return {
                name: `**${item.id}**: ${item.title}`,
                type: item.type,
                workKind: item.workKind || item.type,
                domains: item.domains || ['unknown'],
                confidence: item.confidence || 0.5,
                commitCount: item.commitCount || 1,
                latestCommit: item.hash,
                date: item.date,
                dev: { deployed: Boolean(status.dev), hash: status.dev ? item.hash : null },
                staging: { deployed: Boolean(status.staging), hash: status.staging ? item.hash : null },
                production: { deployed: Boolean(status.production), hash: status.production ? item.hash : null }
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
