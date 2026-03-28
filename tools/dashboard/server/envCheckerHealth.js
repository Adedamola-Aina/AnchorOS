// @ts-nocheck
/**
 * envCheckerHealth.js
 *
 * Environment health and full status checks.
 * Extracted from envChecker.js to keep files ≤200 lines (ARCH-001).
 */

const { getEnvironmentVersions, checkEnvParity } = require('./envCheckerCore');

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

module.exports = {
    checkEnvironmentHealth,
    getEnvironmentStatus
};
