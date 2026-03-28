// @ts-nocheck
/**
 * gitAnalyzer/index.js
 *
 * Re-exports all public functions from sub-modules.
 * Drop-in replacement for the original gitAnalyzer.js.
 */

const { getRecentCommits, getRecentCommitsFiltered, getCommitsBetweenVersions, getTags, searchBugInCommits } = require('./commits');
const { classifyCommit } = require('./classification');
const { getActualDeployments, getPendingChangesByGit, getCurrentBranch } = require('./deployments');
const { getDeploymentTimeline } = require('./timeline');
const { getImpactAnalysis } = require('./analysis');
const { getRepoStats } = require('./stats');

module.exports = {
    getRecentCommits,
    getRecentCommitsFiltered,
    classifyCommit,
    getCommitsBetweenVersions,
    getTags,
    getActualDeployments,
    getPendingChangesByGit,
    getCurrentBranch,
    getDeploymentTimeline,
    searchBugInCommits,
    getRepoStats,
    getImpactAnalysis
};
