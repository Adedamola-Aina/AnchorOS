// @ts-nocheck
/**
 * stats.js
 *
 * Repository status and statistics.
 */

const { git } = require('./commits');

/**
 * Get repo stats
 */
async function getRepoStats() {
    try {
        const [status, log] = await Promise.all([
            git.status(),
            git.log({ maxCount: 1 })
        ]);

        // Filter to count only Anchor OS production files (not dashboard/tooling)
        const anchorOsModified = status.modified.filter(file =>
            !file.startsWith('tools/dashboard/') &&
            !file.startsWith('.agent/') &&
            !file.startsWith('scripts/') &&
            !file.startsWith('.husky/') &&
            !file.startsWith('.firebase/')
        );

        return {
            branch: status.current,
            isClean: status.isClean(),
            modifiedFiles: anchorOsModified.length,
            stagedFiles: status.staged.length,
            lastCommit: log.latest ? {
                hash: log.latest.hash.substring(0, 7),
                message: log.latest.message,
                date: log.latest.date,
                author: log.latest.author_name
            } : null
        };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    getRepoStats
};
