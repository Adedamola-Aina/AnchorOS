// @ts-nocheck
/**
 * commits.js
 *
 * Commit retrieval, extraction helpers, and search utilities.
 */

const simpleGit = require('simple-git');
const path = require('path');

const REPO_PATH = path.join(__dirname, '../../../..');
const git = simpleGit(REPO_PATH);

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
 * Get commits filtered by category (anchorOS, dashboard, docs, infra, or all)
 * @param {string} category - 'anchorOS', 'dashboard', 'docs', 'infra', or 'all'
 * @param {number} limit - Max commits to return
 */
async function getRecentCommitsFiltered(category = 'all', limit = 50) {
    const { classifyCommit } = require('./classification');
    try {
        // Fetch more commits to account for filtering
        const log = await git.log({ maxCount: limit * 3 });
        const commits = [];

        for (const commit of log.all) {
            if (commits.length >= limit) break;

            const commitCategory = await classifyCommit(commit.hash);

            // Filter based on category
            if (category === 'dashboard' && commitCategory !== 'dashboard') continue;
            if (category === 'anchorOS' && commitCategory !== 'anchorOS') continue;
            if (category === 'docs' && commitCategory !== 'docs') continue;
            if (category === 'infra' && commitCategory !== 'infra') continue;

            commits.push({
                hash: commit.hash.substring(0, 7),
                fullHash: commit.hash,
                message: commit.message,
                date: commit.date,
                author: commit.author_name,
                feature: extractFeature(commit.message),
                type: extractCommitType(commit.message),
                category: commitCategory
            });
        }

        return commits;
    } catch (error) {
        console.error('Git log filtered error:', error);
        return [];
    }
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

module.exports = {
    git,
    REPO_PATH,
    extractFeature,
    extractCommitType,
    getRecentCommits,
    getRecentCommitsFiltered,
    getCommitsBetweenVersions,
    getTags,
    searchBugInCommits
};
