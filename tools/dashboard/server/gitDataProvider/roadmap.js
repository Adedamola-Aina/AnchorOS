// @ts-nocheck
/** Roadmap.json helpers for gitDataProvider. */

const fs = require('fs');
const path = require('path');

function loadRoadmap() {
    try {
        const roadmapPath = path.join(__dirname, '../roadmap.json');
        return JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
    } catch {
        return { initiatives: [] };
    }
}

function getInitiativeTitle(id) {
    const roadmap = loadRoadmap();
    const initiative = roadmap.initiatives.find(i => i.id.toUpperCase() === id.toUpperCase());
    return initiative ? initiative.title : null;
}

function mapRoadmapInitiativeToType(initiative) {
    const idPrefix = (initiative.id || '').split('-')[0].toLowerCase();
    if (idPrefix === 'bug' || idPrefix === 'reg') return 'bug';
    if (idPrefix === 'gap') return 'gap';
    if (idPrefix === 'ux' || idPrefix === 'des' || idPrefix === 'brand') return 'ux';
    if (idPrefix === 'sec') return 'sec';
    if (idPrefix === 'arch') return 'architecture';
    return 'feature';
}

function normalizeStatus(status) {
    if (!status) return 'planned';
    if (status === 'inProgress') return 'in-progress';
    if (status === 'todo') return 'planned';
    return status;
}

function deriveStatusFromTrackedItem(item) {
    if (!item) return null;
    if (item.status === 'deployed') return 'completed';
    if (item.status === 'staging' || item.status === 'dev') return 'in-progress';
    return null;
}

function enrichRoadmapInitiativesWithTrackedStatus(roadmapData, trackedItems) {
    const trackedById = new Map((trackedItems || []).map(item => [String(item.id || '').toUpperCase(), item]));

    return (roadmapData.initiatives || []).map(initiative => {
        const id = String(initiative.id || '').toUpperCase();
        const trackedItem = trackedById.get(id);
        const currentStatus = normalizeStatus(initiative.status);

        if (currentStatus === 'deferred') {
            return { ...initiative, status: 'deferred', detectedFromGit: false };
        }

        const trackedStatus = deriveStatusFromTrackedItem(trackedItem);
        if (!trackedStatus) {
            return { ...initiative, status: currentStatus, detectedFromGit: false };
        }

        return {
            ...initiative,
            status: trackedStatus,
            detectedFromGit: trackedStatus !== currentStatus,
            matchedCommits: trackedItem.relatedCommits || (trackedItem.hash ? [trackedItem.hash] : []),
            trackedStatus: trackedItem.status
        };
    });
}

function roadmapBacklogItems(roadmapData, activeItems, deferredIds) {
    const activeIds = new Set(activeItems.map(item => item.id.toUpperCase()));
    return (roadmapData.initiatives || [])
        .filter(i => i.status === 'planned')
        .filter(i => !deferredIds.has(i.id))
        .filter(i => !activeIds.has((i.id || '').toUpperCase()))
        .map(initiative => ({
            id: initiative.id,
            type: mapRoadmapInitiativeToType(initiative),
            title: initiative.title,
            commitMessage: initiative.title,
            hash: 'roadmap', fullHash: null,
            date: initiative.createdAt || null,
            author: initiative.team || 'Product',
            priority: initiative.priority || 'P2',
            assignee: initiative.team || 'Unassigned',
            status: 'backlog', lifecycle: 'backlog',
            lifecycleReason: 'Planned in roadmap.json but not yet observed in git commits',
            environments: { dev: false, staging: false, production: false },
            confidence: 0.95, source: 'roadmap'
        }));
}

module.exports = {
    loadRoadmap,
    getInitiativeTitle,
    mapRoadmapInitiativeToType,
    enrichRoadmapInitiativesWithTrackedStatus,
    roadmapBacklogItems
};
