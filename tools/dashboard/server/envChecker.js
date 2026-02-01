/**
 * envChecker.js
 * 
 * Checks environment parity across Dev, Staging, and Production.
 * Compares versions, features, and deployment status.
 */

const { readDoc } = require('./docReader');
const { getCommitsBetweenVersions, getTags, getRecentCommits, getActualDeployments, getPendingChangesByGit } = require('./gitAnalyzer');

// Environment URLs (for health checks)
const ENVIRONMENTS = {
    production: {
        name: 'Production',
        url: 'https://anchor.tail2fa2e.ts.net',
        version: 'v1.4.0'  // Will be read from docs
    },
    staging: {
        name: 'Staging',
        url: 'https://anchor-staging.tail2fa2e.ts.net',
        version: 'v1.4.0'
    },
    development: {
        name: 'Development',
        url: 'http://localhost:5173',
        version: 'v1.5.0-dev'
    }
};

/**
 * Get environment versions from DEPLOYMENT_STATUS.md
 */
async function getEnvironmentVersions() {
    try {
        const status = await readDoc('DEPLOYMENT_STATUS.md');
        const content = status.content || '';

        // Parse environment table from DEPLOYMENT_STATUS.md
        // Format: | **Production** | v1.4.0 | anchor-os | ...
        const prodMatch = content.match(/\*\*Production\*\*\s*\|\s*(v[\d.]+[^\s|]*)/i);
        const stagingMatch = content.match(/\*\*Staging\*\*\s*\|\s*(v[\d.]+[^\s|]*)/i);
        const devMatch = content.match(/\*\*Dev\*\*\s*\|\s*(v[\d.]+[^\s|]*)/i);

        return {
            production: prodMatch ? prodMatch[1] : 'unknown',
            staging: stagingMatch ? stagingMatch[1] : 'unknown',
            development: devMatch ? devMatch[1] : 'unknown'
        };
    } catch (error) {
        console.error('Error reading DEPLOYMENT_STATUS.md:', error.message);
        return {
            production: 'unknown',
            staging: 'unknown',
            development: 'unknown'
        };
    }
}

/**
 * Check environment parity - what features are where
 * Reads from DEPLOYMENT_STATUS.md for accurate parity data
 */
async function checkEnvParity() {
    const versions = await getEnvironmentVersions();

    // Read DEPLOYMENT_STATUS.md for pending changes
    let devToStagingItems = [];
    let stagingToProductionItems = [];

    try {
        const status = await readDoc('DEPLOYMENT_STATUS.md');
        const content = status.content || '';

        // Parse "Dev → Staging" section (ends at --- or next ## section)
        const devToStagingMatch = content.match(/## ⏳ PENDING CHANGES \(Dev → Staging\)([\s\S]*?)(?=\n---|\n## )/);
        if (devToStagingMatch) {
            const section = devToStagingMatch[1];
            // Check if it's "No pending changes" or empty
            if (!section.includes('No pending changes') && !section.includes('in sync')) {
                const items = section.match(/- \[[ x\/]\] .+/g) || [];
                devToStagingItems = items.map(item => ({
                    name: item.replace(/- \[[ x\/]\] /, '').trim(),
                    completed: item.includes('[x]')
                }));
            }
        }

        // Parse "Staging → Production" section (ends at --- or next ## section)
        const stagingToProdMatch = content.match(/## ⏳ PENDING CHANGES \(Staging → Production\)([\s\S]*?)(?=\n---|\n## )/);
        if (stagingToProdMatch) {
            const section = stagingToProdMatch[1];
            // Check if it's "No pending changes" or empty
            if (!section.includes('No pending changes') && !section.includes('in sync')) {
                const items = section.match(/- \[[ x\/]\] .+/g) || [];
                stagingToProductionItems = items.map(item => ({
                    name: item.replace(/- \[[ x\/]\] /, '').trim(),
                    completed: item.includes('[x]')
                }));
            }
        }
    } catch (error) {
        console.error('Error parsing DEPLOYMENT_STATUS.md:', error.message);
    }

    // Helper to detect item type from name
    const detectType = (name) => {
        // Handle both "BUG-023" and "**BUG-023**" formats
        if (name.includes('BUG-')) return 'bug';
        if (name.includes('REG-')) return 'regression';
        if (name.includes('GAP-')) return 'gap';
        if (name.includes('UX-')) return 'enhancement';
        if (name.includes('TASK-')) return 'task';
        if (name.includes('ARCH-')) return 'architecture';
        return 'feature';
    };

    // Build features list from pending changes
    const features = [];

    // Items only in dev (pending staging)
    for (const item of devToStagingItems) {
        features.push({
            name: item.name,
            type: detectType(item.name),
            commitCount: 1,
            latestCommit: null,
            dev: { deployed: true, hash: null },
            staging: { deployed: false, hash: null },
            production: { deployed: false, hash: null }
        });
    }

    // Items in staging (pending production)
    for (const item of stagingToProductionItems) {
        features.push({
            name: item.name,
            type: detectType(item.name),
            commitCount: 1,
            latestCommit: null,
            dev: { deployed: true, hash: null },
            staging: { deployed: true, hash: null },
            production: { deployed: false, hash: null }
        });
    }

    // Count parity stats
    const devOnly = devToStagingItems.filter(i => !i.completed).length;
    const stagingPending = stagingToProductionItems.filter(i => !i.completed).length;
    const fullyDeployed = stagingToProductionItems.filter(i => i.completed).length;

    return {
        versions,
        features: features.slice(0, 20),
        summary: {
            total: features.length,
            devOnly,
            stagingPending,
            fullyDeployed
        }
    };
}

/**
 * Check environment health (HTTP ping)
 */
async function checkEnvironmentHealth() {
    const results = {};

    for (const [key, env] of Object.entries(ENVIRONMENTS)) {
        try {
            const start = Date.now();
            const response = await fetch(env.url, {
                method: 'HEAD',
                signal: AbortSignal.timeout(5000)
            });
            const responseTime = Date.now() - start;

            results[key] = {
                name: env.name,
                url: env.url,
                status: response.ok ? 'online' : 'error',
                statusCode: response.status,
                responseTime,
                version: env.version
            };
        } catch (error) {
            results[key] = {
                name: env.name,
                url: env.url,
                status: 'offline',
                error: error.message,
                version: env.version
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
        versions,
        parity: parity.features,
        paritySummary: parity.summary,
        health
    };
}

/**
 * Check environment parity using GIT HISTORY as source of truth
 * This is more accurate than markdown parsing as it reads actual commits
 */
async function checkEnvParityByGit() {
    try {
        const pendingChanges = await getPendingChangesByGit();
        const deployments = await getActualDeployments();

        // Helper to detect item type from commit message
        const detectType = (msg) => {
            if (msg.includes('BUG-')) return 'bug';
            if (msg.includes('REG-')) return 'regression';
            if (msg.includes('GAP-')) return 'gap';
            if (msg.includes('UX-')) return 'enhancement';
            if (msg.includes('TASK-')) return 'task';
            if (msg.includes('ARCH-')) return 'architecture';
            if (msg.includes('feat')) return 'feature';
            if (msg.includes('fix')) return 'bugfix';
            return 'other';
        };

        // Build features list from git commits
        const features = [];
        const seenIds = new Set(); // Deduplication

        // Dev-only commits (pending staging)
        for (const commit of pendingChanges.devToStaging || []) {
            const id = commit.id || commit.hash;
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            features.push({
                name: commit.title,
                type: commit.type || detectType(commit.title),
                commitCount: 1,
                latestCommit: commit.hash,
                dev: { deployed: true, hash: commit.hash },
                staging: { deployed: false, hash: null },
                production: { deployed: false, hash: null }
            });
        }

        // Staging-only commits (pending production)
        for (const commit of pendingChanges.stagingToProduction || []) {
            const id = commit.id || commit.hash;
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            features.push({
                name: commit.title,
                type: commit.type || detectType(commit.title),
                commitCount: 1,
                latestCommit: commit.hash,
                dev: { deployed: true, hash: commit.hash },
                staging: { deployed: true, hash: commit.hash },
                production: { deployed: false, hash: null }
            });
        }

        // Count stats
        const devOnly = features.filter(f => !f.staging.deployed).length;
        const stagingPending = features.filter(f => f.staging.deployed && !f.production.deployed).length;
        const fullyDeployed = features.filter(f => f.production.deployed).length;

        return {
            source: 'git',
            versions: {
                production: deployments.production?.version || 'unknown',
                staging: deployments.staging?.version || 'unknown',
                development: deployments.development?.version || 'unknown',
                current: deployments.currentVersion
            },
            deployments: {
                production: {
                    version: deployments.production?.version,
                    date: deployments.production?.date,
                    hash: deployments.production?.hash
                },
                staging: {
                    version: deployments.staging?.version,
                    date: deployments.staging?.date,
                    hash: deployments.staging?.hash
                },
                development: {
                    version: deployments.development?.version,
                    date: deployments.development?.date,
                    hash: deployments.development?.hash
                }
            },
            features,
            summary: {
                total: features.length,
                devOnly,
                stagingPending,
                fullyDeployed
            }
        };
    } catch (error) {
        console.error('Error checking git-based parity:', error.message);
        return {
            source: 'git',
            error: error.message,
            versions: {},
            features: [],
            summary: { total: 0, devOnly: 0, stagingPending: 0, fullyDeployed: 0 }
        };
    }
}

module.exports = {
    getEnvironmentVersions,
    checkEnvParity,
    checkEnvParityByGit,
    checkEnvironmentHealth,
    getEnvironmentStatus
};
