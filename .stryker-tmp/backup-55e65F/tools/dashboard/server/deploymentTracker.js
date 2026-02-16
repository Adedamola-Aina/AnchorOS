/**
 * deploymentTracker.js
 * 
 * UNIFIED DEPLOYMENT TRACKING - SINGLE SOURCE OF TRUTH
 * 
 * This module provides accurate deployment status using GIT ANCESTRY,
 * not date comparison or version string matching.
 * 
 * Key concept:
 * - A commit is "in" an environment if it's an ancestor of the deployed hash
 * - Deploy markers with "@ HASH" format specify the actual deployed code
 * - Without "@ HASH", the marker commit itself is the deployed code
 * 
 * Used by: envChecker.js, gitDataProvider.js
 */

const path = require('path');
const simpleGit = require('simple-git');

const REPO_PATH = path.join(__dirname, '../../..');
const git = simpleGit(REPO_PATH);

// Cache for ancestry checks (expensive git operations)
const ancestryCache = new Map();
const CACHE_TTL = 60000; // 1 minute cache
let cacheTimestamp = Date.now();

/**
 * Clear cache when stale
 */
function checkCacheValidity() {
    if (Date.now() - cacheTimestamp > CACHE_TTL) {
        ancestryCache.clear();
        cacheTimestamp = Date.now();
    }
}

/**
 * Parse deploy markers from git history
 * 
 * Supported formats:
 * - deploy(production): v1.5.12
 * - deploy(staging): v1.5.11-revert @ 82e3d43
 * - deploy(development): v1.5.12 @ abc1234
 * 
 * Returns the ACTUAL deployed code hash (from @ HASH or the marker commit itself)
 */
async function parseDeployMarkers() {
    try {
        const log = await git.log({ maxCount: 300 });
        
        const deployments = {
            production: null,
            staging: null,
            development: null
        };

        // Regex patterns for deploy markers
        // Supports version suffixes like -revert, -hotfix, -dev
        const markerPatterns = {
            production: /deploy\(production\):\s*v?(\d+\.\d+\.\d+(?:-[\w]+)?)/i,
            staging: /deploy\(staging\):\s*v?(\d+\.\d+\.\d+(?:-[\w]+)?)/i,
            development: /deploy\(dev(?:elopment)?\):\s*v?(\d+\.\d+\.\d+(?:-[\w]+)?)/i
        };

        // Pattern to extract actual deployed hash from marker
        // Matches: "@ 82e3d43" or "@ abc1234def"
        const deployedHashPattern = /@\s*([a-f0-9]{7,40})/i;

        for (const commit of log.all) {
            const msg = commit.message;
            const markerHash = commit.hash.substring(0, 7);
            const fullMarkerHash = commit.hash;

            for (const [env, pattern] of Object.entries(markerPatterns)) {
                if (!deployments[env]) {
                    const match = msg.match(pattern);
                    if (match) {
                        // Check if there's an explicit deployed hash
                        const hashMatch = msg.match(deployedHashPattern);
                        
                        // The deployed code is either the explicit @ HASH or the marker commit
                        const deployedHash = hashMatch ? hashMatch[1] : markerHash;
                        
                        deployments[env] = {
                            version: `v${match[1]}`,
                            markerHash: markerHash,           // The commit containing the deploy marker
                            deployedHash: deployedHash,       // The actual code that was deployed
                            fullDeployedHash: null,          // Will be resolved to full hash
                            date: commit.date,
                            message: msg.split('\n')[0],
                            source: 'deploy-marker'
                        };
                    }
                }
            }

            // Early exit if all found
            if (deployments.production && deployments.staging && deployments.development) {
                break;
            }
        }

        // Resolve short hashes to full hashes for ancestry checks
        for (const env of Object.keys(deployments)) {
            if (deployments[env] && deployments[env].deployedHash) {
                try {
                    const result = await git.revparse([deployments[env].deployedHash]);
                    deployments[env].fullDeployedHash = result.trim();
                } catch {
                    // Keep short hash as fallback
                    deployments[env].fullDeployedHash = deployments[env].deployedHash;
                }
            }
        }

        // Fallback for missing markers
        if (!deployments.production) {
            deployments.production = {
                version: 'unknown',
                markerHash: null,
                deployedHash: null,
                fullDeployedHash: null,
                date: null,
                message: 'No production deploy marker found',
                source: 'missing'
            };
        }
        if (!deployments.staging) {
            deployments.staging = {
                version: 'unknown',
                markerHash: null,
                deployedHash: null,
                fullDeployedHash: null,
                date: null,
                message: 'No staging deploy marker found',
                source: 'missing'
            };
        }

        // Development ALWAYS tracks HEAD — the local dev server runs
        // whatever is checked out, so a stale deploy(dev) marker should
        // never make dev appear older than production/staging.
        const headHash = await git.revparse(['HEAD']);
        const headShort = headHash.trim().substring(0, 7);
        const pkgVersion = (() => {
            try {
                const pkg = JSON.parse(require('fs').readFileSync(
                    require('path').join(REPO_PATH, 'package.json'), 'utf-8'));
                return `v${pkg.version}`;
            } catch { return 'HEAD'; }
        })();

        deployments.development = {
            version: pkgVersion,
            markerHash: headShort,
            deployedHash: headShort,
            fullDeployedHash: headHash.trim(),
            date: new Date().toISOString(),
            message: `Current HEAD (${headShort})`,
            source: 'head'
        };

        return deployments;
    } catch (error) {
        console.error('Error parsing deploy markers:', error.message);
        return {
            production: { version: 'error', source: 'error', deployedHash: null },
            staging: { version: 'error', source: 'error', deployedHash: null },
            development: { version: 'error', source: 'error', deployedHash: null }
        };
    }
}

/**
 * Check if a commit is an ancestor of another commit
 * Uses git merge-base --is-ancestor for accurate containment check
 * 
 * NOTE: simple-git's raw() doesn't throw on exit code 1, so we need
 * to use child_process.execSync to properly detect the exit code.
 * 
 * @param {string} commitHash - The commit to check
 * @param {string} deployedHash - The deployed code hash
 * @returns {boolean} - True if commitHash is an ancestor of deployedHash
 */
async function isAncestorOf(commitHash, deployedHash) {
    if (!commitHash || !deployedHash) return false;
    
    checkCacheValidity();
    const cacheKey = `${commitHash}:${deployedHash}`;
    
    if (ancestryCache.has(cacheKey)) {
        return ancestryCache.get(cacheKey);
    }

    try {
        // Use child_process.execSync to properly detect exit code
        const { execSync } = require('child_process');
        execSync(`git merge-base --is-ancestor ${commitHash} ${deployedHash}`, {
            cwd: REPO_PATH,
            stdio: 'ignore'  // Suppress output
        });
        // If we get here, exit code was 0 (is an ancestor)
        ancestryCache.set(cacheKey, true);
        return true;
    } catch (error) {
        // Exit code 1 means not an ancestor (not an error condition)
        // Exit code > 1 means actual error
        ancestryCache.set(cacheKey, false);
        return false;
    }
}

/**
 * Check if a commit is deployed to an environment
 * 
 * @param {string} commitHash - The commit to check
 * @param {object} envDeployment - The deployment info for the environment
 * @returns {boolean} - True if commit is in the environment
 */
async function isCommitInEnvironment(commitHash, envDeployment) {
    if (!envDeployment || !envDeployment.fullDeployedHash) {
        return false;
    }
    return isAncestorOf(commitHash, envDeployment.fullDeployedHash);
}

/**
 * Get deployment status for a commit across all environments
 * 
 * @param {string} commitHash - The commit to check
 * @param {object} deployments - Result from parseDeployMarkers()
 * @returns {object} - { production: bool, staging: bool, development: bool }
 */
async function getCommitDeploymentStatus(commitHash, deployments) {
    const [inProd, inStaging, inDev] = await Promise.all([
        isCommitInEnvironment(commitHash, deployments.production),
        isCommitInEnvironment(commitHash, deployments.staging),
        isCommitInEnvironment(commitHash, deployments.development)
    ]);

    return {
        production: inProd,
        staging: inStaging,
        development: inDev
    };
}

/**
 * Batch check multiple commits for efficiency
 * 
 * @param {string[]} commitHashes - Array of commit hashes to check
 * @param {object} deployments - Result from parseDeployMarkers()
 * @returns {Map} - Map of commitHash -> { production, staging, development }
 */
async function batchCheckDeploymentStatus(commitHashes, deployments) {
    const results = new Map();
    
    // Process in parallel batches to avoid overwhelming git
    const BATCH_SIZE = 10;
    
    for (let i = 0; i < commitHashes.length; i += BATCH_SIZE) {
        const batch = commitHashes.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (hash) => {
            const status = await getCommitDeploymentStatus(hash, deployments);
            return [hash, status];
        });
        
        const batchResults = await Promise.all(promises);
        batchResults.forEach(([hash, status]) => {
            results.set(hash, status);
        });
    }
    
    return results;
}

/**
 * Clear the ancestry cache (call after deployments change)
 */
function clearCache() {
    ancestryCache.clear();
    cacheTimestamp = Date.now();
}

/**
 * Get a summary of current deployments
 */
async function getDeploymentSummary() {
    const deployments = await parseDeployMarkers();
    
    return {
        production: {
            version: deployments.production.version,
            hash: deployments.production.deployedHash,
            date: deployments.production.date,
            source: deployments.production.source
        },
        staging: {
            version: deployments.staging.version,
            hash: deployments.staging.deployedHash,
            date: deployments.staging.date,
            source: deployments.staging.source
        },
        development: {
            version: deployments.development.version,
            hash: deployments.development.deployedHash,
            date: deployments.development.date,
            source: deployments.development.source
        }
    };
}

module.exports = {
    parseDeployMarkers,
    isAncestorOf,
    isCommitInEnvironment,
    getCommitDeploymentStatus,
    batchCheckDeploymentStatus,
    clearCache,
    getDeploymentSummary
};
