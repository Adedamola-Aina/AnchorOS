// @ts-nocheck
/**
 * timeline.js
 *
 * Deployment timeline — commits grouped by day with work-intelligence enrichment.
 */

const { classifyWorkItem } = require('../workIntelligence');
const { git } = require('./commits');
const { getRecentCommits, extractCommitType } = require('./commits');
const { classifyCommit } = require('./classification');

const timelineFilesCache = new Map();

async function getChangedFilesForCommit(commitHash) {
    if (timelineFilesCache.has(commitHash)) {
        return timelineFilesCache.get(commitHash);
    }

    try {
        const diff = await git.show([commitHash, '--name-only', '--format=']);
        const files = diff.split('\n').map((line) => line.trim()).filter(Boolean);
        timelineFilesCache.set(commitHash, files);
        return files;
    } catch {
        timelineFilesCache.set(commitHash, []);
        return [];
    }
}

/**
 * Get deployment timeline (commits grouped by day)
 */
async function getDeploymentTimeline(days = 14) {
    const commits = await getRecentCommits(200);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const timeline = {};
    for (const commit of commits) {
        const date = new Date(commit.date);
        if (date < cutoff) continue;
        if (commit.message.toLowerCase().includes('deploy(')) continue;

        const category = await classifyCommit(commit.fullHash || commit.hash);

        const commitHash = commit.fullHash || commit.hash;
        const files = await getChangedFilesForCommit(commitHash);
        const intelligence = classifyWorkItem({
            id: commit.feature,
            type: commit.type,
            message: commit.message,
            files,
            category
        });

        const commitType = extractCommitType(commit.message);

        const dateKey = date.toISOString().split('T')[0];
        if (!timeline[dateKey]) {
            timeline[dateKey] = {
                date: dateKey,
                commits: [],
                features: new Set(),
                byType: {
                    feature: 0,
                    bugfix: 0,
                    hotfix: 0,
                    docs: 0,
                    refactor: 0,
                    chore: 0,
                    test: 0,
                    other: 0
                },
                byDomain: {}
            };
        }

        const enrichedCommit = {
            ...commit,
            category,
            workKind: intelligence.workKind,
            domains: intelligence.domains,
            confidence: intelligence.confidence
        };

        timeline[dateKey].commits.push(enrichedCommit);
        if (commit.feature) {
            timeline[dateKey].features.add(commit.feature);
        }
        if (timeline[dateKey].byType[commitType] === undefined) {
            timeline[dateKey].byType.other += 1;
        } else {
            timeline[dateKey].byType[commitType] += 1;
        }

        for (const domain of intelligence.domains || []) {
            timeline[dateKey].byDomain[domain] = (timeline[dateKey].byDomain[domain] || 0) + 1;
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

module.exports = {
    getDeploymentTimeline
};
