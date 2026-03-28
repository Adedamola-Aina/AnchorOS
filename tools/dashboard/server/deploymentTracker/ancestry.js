// @ts-nocheck
/** Git ancestry checks and batch deployment status resolution. */

const { execSync } = require('child_process');
const { ancestryCache, checkCacheValidity } = require('./cache');
const { parseDeployMarkers, REPO_PATH } = require('./parser');

async function isAncestorOf(commitHash, deployedHash) {
    if (!commitHash || !deployedHash) return false;
    checkCacheValidity();
    const cacheKey = `${commitHash}:${deployedHash}`;
    if (ancestryCache.has(cacheKey)) return ancestryCache.get(cacheKey);
    try {
        execSync(`git merge-base --is-ancestor ${commitHash} ${deployedHash}`, { cwd: REPO_PATH, stdio: 'ignore' });
        ancestryCache.set(cacheKey, true);
        return true;
    } catch {
        ancestryCache.set(cacheKey, false);
        return false;
    }
}

async function isCommitInEnvironment(commitHash, envDeployment) {
    if (!envDeployment?.fullDeployedHash) return false;
    return isAncestorOf(commitHash, envDeployment.fullDeployedHash);
}

async function getCommitDeploymentStatus(commitHash, deployments) {
    const [inProd, inStaging, inDev] = await Promise.all([
        isCommitInEnvironment(commitHash, deployments.production),
        isCommitInEnvironment(commitHash, deployments.staging),
        isCommitInEnvironment(commitHash, deployments.development)
    ]);
    return { production: inProd, staging: inStaging, development: inDev };
}

async function batchCheckDeploymentStatus(commitHashes, deployments) {
    const results = new Map();
    const BATCH_SIZE = 10;
    for (let i = 0; i < commitHashes.length; i += BATCH_SIZE) {
        const batch = commitHashes.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map(async hash => [hash, await getCommitDeploymentStatus(hash, deployments)])
        );
        batchResults.forEach(([hash, status]) => results.set(hash, status));
    }
    return results;
}

async function getDeploymentSummary() {
    const deployments = await parseDeployMarkers();
    return {
        production:  { version: deployments.production.version,  hash: deployments.production.deployedHash,  date: deployments.production.date,  source: deployments.production.source },
        staging:     { version: deployments.staging.version,     hash: deployments.staging.deployedHash,     date: deployments.staging.date,     source: deployments.staging.source },
        development: { version: deployments.development.version, hash: deployments.development.deployedHash, date: deployments.development.date, source: deployments.development.source }
    };
}

module.exports = { isAncestorOf, isCommitInEnvironment, getCommitDeploymentStatus, batchCheckDeploymentStatus, getDeploymentSummary };
