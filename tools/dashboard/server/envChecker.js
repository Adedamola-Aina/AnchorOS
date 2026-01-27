/**
 * envChecker.js
 * 
 * Checks environment parity across Dev, Staging, and Production.
 * Compares versions, features, and deployment status.
 */

const { readDoc } = require('./docReader');
const { getCommitsBetweenVersions, getTags, getRecentCommits } = require('./gitAnalyzer');

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

    // Build features list from pending changes
    const features = [];

    // Items only in dev (pending staging)
    for (const item of devToStagingItems) {
        features.push({
            name: item.name,
            type: item.name.startsWith('BUG-') || item.name.startsWith('REG-') ? 'bugfix' : 'feature',
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
            type: item.name.startsWith('BUG-') || item.name.startsWith('REG-') ? 'bugfix' : 'feature',
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

module.exports = {
    getEnvironmentVersions,
    checkEnvParity,
    checkEnvironmentHealth,
    getEnvironmentStatus
};
