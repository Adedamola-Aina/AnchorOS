// @ts-nocheck
/**
 * envCheckerCore.js
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
 *
 * Extracted from envChecker.js to keep files ≤200 lines (ARCH-001).
 */

const path = require('path');
const fs = require('fs');
const deploymentTracker = require('./deploymentTracker');
const gitDataProvider = require('./gitDataProvider');

const REPO_PATH = path.join(__dirname, '../../..');

// Domain → human label mapping
const DOMAIN_LABELS = {
    'ios-native': 'iOS Native',
    'android-native': 'Android Native',
    'mobile': 'Mobile PWA',
    'finance': 'Finance',
    'fabric': 'Anchor AI',
    'auth': 'Auth',
    'family': 'Family Mode',
    'security': 'Security',
    'dashboard': 'Dashboard',
    'infrastructure': 'Infrastructure',
    'docs': 'Docs',
    'unknown': 'General',
    'other': 'General',
};

// WorkKind → human label mapping
const WORK_KIND_LABELS = {
    'bugfix': 'Bug Fix',
    'feature': 'Feature',
    'security': 'Security Fix',
    'architecture': 'Architecture',
    'test': 'Test',
    'docs': 'Docs',
    'infra': 'Infrastructure',
    'other': 'Other',
};

/**
 * Derive a short human-readable label like "Bug Fix · Finance" or "Native Feature · iOS"
 */
function deriveFeatureLabel(workKind, domain, id = '') {
    const kindLabel = WORK_KIND_LABELS[workKind] || 'Feature';
    const domainLabel = DOMAIN_LABELS[domain] || domain;
    // If id prefix gives better context (BUG-, SEC-, ARCH-) use that
    const prefix = (id || '').split('-')[0].toUpperCase();
    if (prefix === 'BUG' || prefix === 'REG') return `Bug Fix · ${domainLabel}`;
    if (prefix === 'SEC') return `Security Fix · ${domainLabel}`;
    if (prefix === 'ARCH') return `Architecture · ${domainLabel}`;
    if (prefix === 'FIN' && (domain === 'ios-native' || domain === 'android-native')) return `Native Feature · ${domainLabel}`;
    return `${kindLabel} · ${domainLabel}`;
}

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

            // Derive a human-readable label from the item type + domain
            const primaryDomain = (item.domains || [])[0] || 'unknown';
            const workKind = item.workKind || item.type || 'feature';
            const featureLabel = deriveFeatureLabel(workKind, primaryDomain, item.id);

            return {
                name: `**${item.id}**: ${item.title}`,
                label: featureLabel,          // e.g. "Bug Fix · Finance", "Native Feature · iOS"
                type: item.type,
                workKind,
                domains: item.domains || ['unknown'],
                primaryDomain,
                kanbanStage: item.kanbanStage || 'todo',
                priority: item.priority || 'P3',
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

// Legacy alias for compatibility
const checkEnvParityByGit = checkEnvParity;

module.exports = {
    getCurrentVersion,
    getEnvironmentVersions,
    checkEnvParity,
    checkEnvParityByGit,
    findDeployCommits
};
