/**
 * gitAnalyzer.js
 * 
 * Analyzes git history to extract commit timeline, feature deployments,
 * and compare code between environments.
 */

const simpleGit = require('simple-git');
const path = require('path');

const REPO_PATH = path.join(__dirname, '../../..');
const git = simpleGit(REPO_PATH);

/**
 * Get recent commits with parsed feature info
 */
async function getRecentCommits(limit = 50) {
    try {
        const log = await git.log({ maxCount: limit });
        return log.all.map(commit => ({
            hash: commit.hash.substring(0, 7),
            fullHash: commit.hash,
            message: commit.message,
            date: commit.date,
            author: commit.author_name,
            feature: extractFeature(commit.message),
            type: extractCommitType(commit.message)
        }));
    } catch (error) {
        console.error('Git log error:', error);
        return [];
    }
}

/**
 * Extract feature name from commit message
 */
function extractFeature(message) {
    // Match patterns like "feat: Mobile Navigation" or "[Feature] Mobile Nav"
    const patterns = [
        /feat(?:\(([^)]+)\))?:\s*(.+)/i,
        /fix(?:\(([^)]+)\))?:\s*(.+)/i,
        /\[([A-Z]+-\d+)\]\s*(.+)/i,
        /^(Mobile|Family|Fabric|Dashboard|Auth|Finance|Settings)[:\s]+(.+)/i
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
            return match[2] || match[1] || message.split('\n')[0];
        }
    }
    return message.split('\n')[0].substring(0, 50);
}

/**
 * Extract commit type (feat, fix, docs, etc.)
 */
function extractCommitType(message) {
    const msg = message.toLowerCase();
    if (msg.startsWith('feat')) return 'feature';
    if (msg.startsWith('fix')) return 'bugfix';
    if (msg.startsWith('docs')) return 'docs';
    if (msg.startsWith('refactor')) return 'refactor';
    if (msg.startsWith('test')) return 'test';
    if (msg.startsWith('chore')) return 'chore';
    if (msg.includes('hotfix')) return 'hotfix';
    return 'other';
}

/**
 * Get commits between two tags/versions
 */
async function getCommitsBetweenVersions(fromVersion, toVersion) {
    try {
        const log = await git.log({ from: fromVersion, to: toVersion });
        return log.all.map(commit => ({
            hash: commit.hash.substring(0, 7),
            message: commit.message,
            date: commit.date,
            feature: extractFeature(commit.message),
            type: extractCommitType(commit.message)
        }));
    } catch (error) {
        console.error(`Error getting commits between ${fromVersion} and ${toVersion}:`, error.message);
        return [];
    }
}

/**
 * Get all tags (versions)
 */
async function getTags() {
    try {
        const tags = await git.tags();
        return tags.all.sort().reverse();
    } catch (error) {
        console.error('Error getting tags:', error);
        return [];
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

/**
 * Get deployment timeline (commits grouped by day)
 */
async function getDeploymentTimeline(days = 14) {
    const commits = await getRecentCommits(100);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const timeline = {};
    for (const commit of commits) {
        const date = new Date(commit.date);
        if (date < cutoff) continue;

        const dateKey = date.toISOString().split('T')[0];
        if (!timeline[dateKey]) {
            timeline[dateKey] = { date: dateKey, commits: [], features: new Set() };
        }
        timeline[dateKey].commits.push(commit);
        if (commit.feature) {
            timeline[dateKey].features.add(commit.feature);
        }
    }

    // Convert to array and add features as array
    return Object.values(timeline)
        .map(day => ({
            ...day,
            features: Array.from(day.features),
            commitCount: day.commits.length
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Search for bug ID in commit history
 */
async function searchBugInCommits(bugId) {
    try {
        const log = await git.log({ maxCount: 200 });
        const matches = log.all.filter(c =>
            c.message.toLowerCase().includes(bugId.toLowerCase())
        );
        return matches.map(c => ({
            hash: c.hash.substring(0, 7),
            message: c.message,
            date: c.date
        }));
    } catch (error) {
        return [];
    }
}

/**
 * Get repo stats
 */
async function getRepoStats() {
    try {
        const [status, log] = await Promise.all([
            git.status(),
            git.log({ maxCount: 1 })
        ]);

        return {
            branch: status.current,
            isClean: status.isClean(),
            modifiedFiles: status.modified.length,
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
    getRecentCommits,
    getCommitsBetweenVersions,
    getTags,
    getCurrentBranch,
    getDeploymentTimeline,
    searchBugInCommits,
    getRepoStats
};
