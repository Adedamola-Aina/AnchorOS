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
 */
async function checkEnvParity() {
    const versions = await getEnvironmentVersions();
    const recentCommits = await getRecentCommits(50);

    // Group commits by feature
    const featureMap = new Map();
    for (const commit of recentCommits) {
        const feature = commit.feature || commit.message.substring(0, 40);
        if (!featureMap.has(feature)) {
            featureMap.set(feature, {
                name: feature,
                type: commit.type,
                commits: [],
                firstDate: commit.date,
                lastDate: commit.date
            });
        }
        featureMap.get(feature).commits.push(commit);
        featureMap.get(feature).lastDate = commit.date;
    }

    // Determine deployment status for each feature
    const features = Array.from(featureMap.values()).map(feature => {
        // Simple heuristic: if feature commit is recent (< 7 days), it's only in dev
        // This is a simplified version - real implementation would compare git history
        const featureDate = new Date(feature.firstDate);
        const now = new Date();
        const daysOld = (now - featureDate) / (1000 * 60 * 60 * 24);

        return {
            name: feature.name,
            type: feature.type,
            commitCount: feature.commits.length,
            latestCommit: feature.commits[0]?.hash,
            dev: { deployed: true, hash: feature.commits[0]?.hash },
            staging: {
                deployed: daysOld > 2,  // Assume staging gets updates after 2 days
                hash: daysOld > 2 ? feature.commits[0]?.hash : null
            },
            production: {
                deployed: daysOld > 7,  // Assume production after 7 days
                hash: daysOld > 7 ? feature.commits[0]?.hash : null
            }
        };
    });

    return {
        versions,
        features: features.slice(0, 20), // Top 20 features
        summary: {
            total: features.length,
            devOnly: features.filter(f => f.dev.deployed && !f.staging.deployed).length,
            stagingPending: features.filter(f => f.staging.deployed && !f.production.deployed).length,
            fullyDeployed: features.filter(f => f.production.deployed).length
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
