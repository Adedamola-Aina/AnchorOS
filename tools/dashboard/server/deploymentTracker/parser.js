// @ts-nocheck
/** Parse deploy markers from git history. */

const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');

const REPO_PATH = path.join(__dirname, '../../../..');
const git = simpleGit(REPO_PATH);

const MARKER_PATTERNS = {
    production: /deploy\(production\):\s*v?(\d+\.\d+\.\d+(?:-[\w.]+)?)/i,
    staging:    /deploy\(staging\):\s*v?(\d+\.\d+\.\d+(?:-[\w.]+)?)/i,
    development:/deploy\(dev(?:elopment)?\):\s*v?(\d+\.\d+\.\d+(?:-[\w.]+)?)/i
};
const DEPLOYED_HASH_PATTERN = /@\s*([a-f0-9]{7,40})/i;

async function parseDeployMarkers() {
    try {
        const log = await git.log({ maxCount: 300 });
        const deployments = { production: null, staging: null, development: null };

        for (const commit of log.all) {
            const msg = commit.message;
            const markerHash = commit.hash.substring(0, 7);
            for (const [env, pattern] of Object.entries(MARKER_PATTERNS)) {
                if (!deployments[env]) {
                    const match = msg.match(pattern);
                    if (match) {
                        const hashMatch = msg.match(DEPLOYED_HASH_PATTERN);
                        const deployedHash = hashMatch ? hashMatch[1] : markerHash;
                        deployments[env] = {
                            version: `v${match[1]}`, markerHash, deployedHash,
                            fullDeployedHash: null, date: commit.date,
                            message: msg.split('\n')[0], source: 'deploy-marker'
                        };
                    }
                }
            }
            if (deployments.production && deployments.staging && deployments.development) break;
        }

        // Resolve short hashes to full hashes
        for (const env of Object.keys(deployments)) {
            if (deployments[env]?.deployedHash) {
                try {
                    const result = await git.revparse([deployments[env].deployedHash]);
                    deployments[env].fullDeployedHash = result.trim();
                } catch {
                    deployments[env].fullDeployedHash = deployments[env].deployedHash;
                }
            }
        }

        if (!deployments.production) {
            deployments.production = { version: 'unknown', markerHash: null, deployedHash: null, fullDeployedHash: null, date: null, message: 'No production deploy marker found', source: 'missing' };
        }
        if (!deployments.staging) {
            deployments.staging = { version: 'unknown', markerHash: null, deployedHash: null, fullDeployedHash: null, date: null, message: 'No staging deploy marker found', source: 'missing' };
        }

        // Development always tracks HEAD
        const headHash = await git.revparse(['HEAD']);
        const headShort = headHash.trim().substring(0, 7);
        let pkgVersion = 'HEAD';
        try {
            const pkg = JSON.parse(fs.readFileSync(path.join(REPO_PATH, 'package.json'), 'utf-8'));
            pkgVersion = `v${pkg.version}`;
        } catch { /* ignore */ }

        deployments.development = {
            version: pkgVersion, markerHash: headShort, deployedHash: headShort,
            fullDeployedHash: headHash.trim(), date: new Date().toISOString(),
            message: `Current HEAD (${headShort})`, source: 'head'
        };

        return deployments;
    } catch (error) {
        console.error('Error parsing deploy markers:', error.message);
        return {
            production:  { version: 'error', source: 'error', deployedHash: null },
            staging:     { version: 'error', source: 'error', deployedHash: null },
            development: { version: 'error', source: 'error', deployedHash: null }
        };
    }
}

module.exports = { parseDeployMarkers, REPO_PATH };
