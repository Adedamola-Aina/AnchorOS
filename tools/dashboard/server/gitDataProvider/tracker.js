// @ts-nocheck
/**
 * tracker.js — getAllTrackedItems + commit-level cache.
 * Core function that reads git log and resolves deployment status.
 */

const simpleGit = require('simple-git');
const path = require('path');
const deploymentTracker = require('../deploymentTracker');
const { classifyCommit } = require('../gitAnalyzer');
const { classifyWorkItem, deriveLifecycle } = require('../workIntelligence');
const { extractIds, detectType } = require('./constants');
const { getInitiativeTitle } = require('./roadmap');

const git = simpleGit(path.join(__dirname, '../../../..'));

let itemsCache = null;
let itemsCacheTime = 0;
const ITEMS_CACHE_TTL = 120_000; // 2 minutes
const commitFilesCache = new Map();

function clearItemsCache() {
    itemsCache = null;
    itemsCacheTime = 0;
    commitFilesCache.clear();
}

async function getChangedFilesForCommit(commitHash) {
    if (commitFilesCache.has(commitHash)) return commitFilesCache.get(commitHash);
    try {
        const diff = await git.show([commitHash, '--name-only', '--format=']);
        const files = diff.split('\n').map(l => l.trim()).filter(Boolean);
        commitFilesCache.set(commitHash, files);
        return files;
    } catch {
        commitFilesCache.set(commitHash, []);
        return [];
    }
}

async function getAllTrackedItems(limit = 200) {
    const now = Date.now();
    if (itemsCache && (now - itemsCacheTime) < ITEMS_CACHE_TTL && limit <= 200) return itemsCache;

    try {
        const log = await git.log({ maxCount: limit });
        const items = new Map();
        const deployments = await deploymentTracker.parseDeployMarkers();
        const commitsToCheck = [];

        for (const commit of log.all) {
            const category = await classifyCommit(commit.hash);
            if (category !== 'anchorOS') continue;

            const changedFiles = await getChangedFilesForCommit(commit.hash);
            const fullMessage = commit.body ? `${commit.message}\n${commit.body}` : commit.message;
            const ids = extractIds(fullMessage);
            const shortHash = commit.hash.substring(0, 7);

            const bodyLines = (commit.body || '').split('\n').filter(l => l.trim());
            const idTitleMap = {};
            for (const line of bodyLines) {
                const m = line.match(/^([A-Z]+-\d+)[:\s]+(.+)/);
                if (m) idTitleMap[m[1].toUpperCase()] = m[2].trim();
            }

            for (const idInfo of ids) {
                if (!items.has(idInfo.id)) {
                    const roadmapTitle = getInitiativeTitle(idInfo.id);
                    const bodyTitle = idTitleMap[idInfo.id.toUpperCase()];
                    const commitTitle = commit.message.split('\n')[0].substring(0, 100);
                    const intelligence = classifyWorkItem({ id: idInfo.id, type: idInfo.type, message: fullMessage, files: changedFiles, category });
                    items.set(idInfo.id, {
                        id: idInfo.id, type: idInfo.type,
                        title: roadmapTitle || bodyTitle || commitTitle,
                        commitMessage: commitTitle, hash: shortHash, fullHash: commit.hash,
                        date: commit.date, author: commit.author_name, commitCount: 1,
                        relatedCommits: [shortHash],
                        workKind: intelligence.workKind, domains: intelligence.domains,
                        confidence: intelligence.confidence, evidence: intelligence.evidence,
                        status: 'dev', environments: { dev: true, staging: false, production: false }
                    });
                    commitsToCheck.push(commit.hash);
                } else {
                    const existing = items.get(idInfo.id);
                    existing.commitCount = (existing.commitCount || 1) + 1;
                    if (!existing.relatedCommits) existing.relatedCommits = [];
                    if (existing.relatedCommits.length < 10) existing.relatedCommits.push(shortHash);
                }
            }

            if (ids.length === 0) {
                const type = detectType(commit.message);
                if (type !== 'docs' && type !== 'chore' && type !== 'refactor' && type !== 'other') {
                    if (!items.has(shortHash)) {
                        const intelligence = classifyWorkItem({ id: shortHash, type, message: fullMessage, files: changedFiles, category });
                        items.set(shortHash, {
                            id: shortHash, type, title: commit.message.split('\n')[0].substring(0, 100),
                            hash: shortHash, fullHash: commit.hash, date: commit.date,
                            author: commit.author_name, commitCount: 1, relatedCommits: [shortHash],
                            workKind: intelligence.workKind, domains: intelligence.domains,
                            confidence: intelligence.confidence, evidence: intelligence.evidence,
                            status: 'dev', environments: { dev: true, staging: false, production: false }
                        });
                        commitsToCheck.push(commit.hash);
                    }
                }
            }
        }

        const deploymentStatus = await deploymentTracker.batchCheckDeploymentStatus(commitsToCheck, deployments);
        for (const item of items.values()) {
            const status = deploymentStatus.get(item.fullHash);
            if (status) {
                item.environments = { dev: status.development, staging: status.staging, production: status.production };
                // Kanban stage: maps directly to Jira/Asana-style columns
                // backlog    → never reached dev
                // todo       → tracked (has ID) but not yet in dev
                // in-progress → on dev, not yet staging
                // in-review  → on staging, not yet production
                // done       → on production
                item.status = status.production ? 'deployed'
                    : status.staging ? 'staging'
                    : status.development ? 'dev'
                    : 'pending';
                item.kanbanStage = status.production ? 'done'
                    : status.staging ? 'in-review'
                    : status.development ? 'in-progress'
                    : 'todo';
                item.lifecycle = deriveLifecycle(item.status);
            } else {
                item.kanbanStage = 'todo';
            }

            // Enrich with roadmap metadata if available (priority, team, effort)
            try {
                const roadmap = require('./roadmap');
                const roadmapEntry = roadmap.getRoadmapEntry ? roadmap.getRoadmapEntry(item.id) : null;
                if (roadmapEntry) {
                    item.priority = roadmapEntry.priority || item.priority || 'P3';
                    item.team = roadmapEntry.team || item.team;
                    item.effort = roadmapEntry.effort || item.effort;
                    item.impact = roadmapEntry.impact || item.impact;
                    // Use roadmap title if richer than commit subject
                    if (roadmapEntry.title && roadmapEntry.title.length > item.title.length) {
                        item.title = roadmapEntry.title;
                    }
                }
            } catch { /* roadmap enrichment is best-effort */ }
        }

        const result = Array.from(items.values());
        if (limit <= 200) { itemsCache = result; itemsCacheTime = Date.now(); }
        return result;
    } catch (error) {
        console.error('Error getting tracked items:', error.message);
        return [];
    }
}

module.exports = { getAllTrackedItems, clearItemsCache, getChangedFilesForCommit };
