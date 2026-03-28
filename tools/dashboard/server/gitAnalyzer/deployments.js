// @ts-nocheck
const path = require('path');
const { git, REPO_PATH, extractCommitType } = require('./commits');

async function getActualDeployments() {
    try {
        const log = await git.log({ maxCount: 200 });
        const deployments = {
            production: { version: null, hash: null, date: null, commits: [] },
            staging: { version: null, hash: null, date: null, commits: [] },
            development: { version: null, hash: null, date: null, commits: [] }
        };

        // Version extraction pattern
        const versionPattern = /v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/;

        // Track commits since last deploy to each env
        const commitsSinceDeploy = {
            production: [],
            staging: [],
            development: []
        };

        let foundProd = false, foundStaging = false, foundDev = false;

        for (const commit of log.all) {
            const msg = commit.message.toLowerCase();
            const fullMsg = commit.message;

            // Check for production deploy
            if (!foundProd && (msg.includes('production') || msg.includes('anchor-os.web.app')) &&
                (msg.includes('deploy') || msg.includes('release'))) {
                const vMatch = fullMsg.match(versionPattern);
                deployments.production = {
                    version: vMatch ? `v${vMatch[1]}` : 'unknown',
                    hash: commit.hash.substring(0, 7),
                    date: commit.date,
                    message: commit.message.split('\n')[0]
                };
                deployments.production.commits = [...commitsSinceDeploy.production];
                foundProd = true;
            } else if (!foundProd) {
                commitsSinceDeploy.production.push({
                    hash: commit.hash.substring(0, 7),
                    message: commit.message.split('\n')[0],
                    type: extractCommitType(commit.message)
                });
            }

            // Check for staging deploy
            if (!foundStaging && (msg.includes('staging') || msg.includes('anchor-os-staging')) &&
                msg.includes('deploy')) {
                const vMatch = fullMsg.match(versionPattern);
                deployments.staging = {
                    version: vMatch ? `v${vMatch[1]}` : 'unknown',
                    hash: commit.hash.substring(0, 7),
                    date: commit.date,
                    message: commit.message.split('\n')[0]
                };
                deployments.staging.commits = [...commitsSinceDeploy.staging];
                foundStaging = true;
            } else if (!foundStaging) {
                commitsSinceDeploy.staging.push({
                    hash: commit.hash.substring(0, 7),
                    message: commit.message.split('\n')[0],
                    type: extractCommitType(commit.message)
                });
            }

            // Check for dev deploy
            if (!foundDev && (msg.includes('dev') || msg.includes('anchor-os-dev') || msg.includes('development')) &&
                msg.includes('deploy')) {
                const vMatch = fullMsg.match(versionPattern);
                deployments.development = {
                    version: vMatch ? `v${vMatch[1]}` : 'unknown',
                    hash: commit.hash.substring(0, 7),
                    date: commit.date,
                    message: commit.message.split('\n')[0]
                };
                deployments.development.commits = [...commitsSinceDeploy.development];
                foundDev = true;
            } else if (!foundDev) {
                commitsSinceDeploy.development.push({
                    hash: commit.hash.substring(0, 7),
                    message: commit.message.split('\n')[0],
                    type: extractCommitType(commit.message)
                });
            }

            // Stop if we found all three
            if (foundProd && foundStaging && foundDev) break;
        }

        // Also check package.json for current version
        try {
            const packageJson = require(path.join(REPO_PATH, 'package.json'));
            deployments.currentVersion = `v${packageJson.version}`;
        } catch (e) {
            deployments.currentVersion = 'unknown';
        }

        return deployments;
    } catch (error) {
        console.error('Error getting actual deployments:', error.message);
        return {
            production: { version: 'unknown' },
            staging: { version: 'unknown' },
            development: { version: 'unknown' },
            error: error.message
        };
    }
}

/**
 * Extract pending changes from git history by comparing commits
 * Returns features/bugs that are in dev but not staging, or staging but not prod
 */
async function getPendingChangesByGit() {
    try {
        const deployments = await getActualDeployments();

        // Commits in dev but not staging
        const devOnlyCommits = deployments.development.commits || [];

        // Commits in staging but not production
        const stagingOnlyCommits = deployments.staging.commits || [];

        // Parse commit messages to extract IDs and types
        const parseCommit = (commit) => {
            const msg = commit.message;
            const patterns = {
                bug: /\bBUG-(\d+)\b/i,
                reg: /\bREG-(\d+)\b/i,
                gap: /\bGAP-(\d+)\b/i,
                ux: /\bUX-(\d+)\b/i,
                task: /\bTASK-(\d+)\b/i,
                arch: /\bARCH-(\d+)\b/i,
                feat: /^feat(?:\([^)]+\))?:\s*(.+)/i,
                fix: /^fix(?:\([^)]+\))?:\s*(.+)/i
            };

            for (const [type, pattern] of Object.entries(patterns)) {
                const match = msg.match(pattern);
                if (match) {
                    return {
                        id: match[0].toUpperCase(),
                        type: type === 'feat' ? 'feature' : type === 'fix' ? 'bugfix' : type,
                        title: msg.split('\n')[0],
                        hash: commit.hash
                    };
                }
            }

            return {
                id: commit.hash,
                type: commit.type || 'other',
                title: msg.split('\n')[0],
                hash: commit.hash
            };
        };

        return {
            devToStaging: devOnlyCommits.map(parseCommit),
            stagingToProduction: stagingOnlyCommits.map(parseCommit),
            versions: {
                production: deployments.production?.version,
                staging: deployments.staging?.version,
                development: deployments.development?.version,
                current: deployments.currentVersion
            }
        };
    } catch (error) {
        console.error('Error getting pending changes:', error.message);
        return { devToStaging: [], stagingToProduction: [], versions: {}, error: error.message };
    }
}

/**
 * Get current branch
 */
async function getCurrentBranch() {
    try {
        const status = await git.status();
        return status.current;
    } catch (error) {
        return 'unknown';
    }
}

module.exports = {
    getActualDeployments,
    getPendingChangesByGit,
    getCurrentBranch
};
