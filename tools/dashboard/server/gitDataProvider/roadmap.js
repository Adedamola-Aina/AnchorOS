// @ts-nocheck
// 
/** Roadmap.json helpers for gitDataProvider. */

const fs = require('fs');
const path = require('path');

let roadmapDetectionCache = null;

function loadRoadmap() {
    try {
        const roadmapPath = path.join(__dirname, '../roadmap.json');
        return JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
    } catch {
        return { initiatives: [] };
    }
}

function normalizePattern(pattern) {
    return String(pattern || '').trim().toLowerCase();
}

function isShortAcronym(pattern) {
    return pattern.length <= 4 && /^[a-z]+$/i.test(pattern);
}

function buildRoadmapDetectionIndex() {
    if (roadmapDetectionCache) return roadmapDetectionCache;

    const roadmap = loadRoadmap();
    const initiatives = (roadmap.initiatives || []).map((initiative) => {
        const id = String(initiative.id || '').toUpperCase();
        const rawPatterns = Array.isArray(initiative.detectionPatterns) ? initiative.detectionPatterns : [];
        const patterns = rawPatterns
            .map(normalizePattern)
            .filter(Boolean);
        return {
            id,
            type: mapRoadmapInitiativeToType(initiative),
            patterns
        };
    });

    roadmapDetectionCache = { initiatives };
    return roadmapDetectionCache;
}

function inferRoadmapIdsFromCommitEvidence({ message = '', files = [] } = {}) {
    const { initiatives } = buildRoadmapDetectionIndex();
    const messageText = String(message || '').toLowerCase();
    const fileText = Array.isArray(files) ? files.join('\n').toLowerCase() : '';
    const evidenceText = `${messageText}\n${fileText}`;
    const inferred = [];

    for (const initiative of initiatives) {
        const matchedPatterns = [];
        for (const pattern of initiative.patterns) {
            if (!pattern) continue;

            // Tiny acronyms (e.g. ADR, LLM) are noisy in file paths; restrict to commit text.
            const haystack = isShortAcronym(pattern) ? messageText : evidenceText;
            if (haystack.includes(pattern)) {
                matchedPatterns.push(pattern);
            }
        }

        if (matchedPatterns.length > 0) {
            inferred.push({
                id: initiative.id,
                type: initiative.type,
                matchedPatterns
            });
        }
    }

    return inferred;
}

function getInitiativeTitle(id) {
    const roadmap = loadRoadmap();
    const initiative = roadmap.initiatives.find(i => i.id.toUpperCase() === id.toUpperCase());
    return initiative ? initiative.title : null;
}

function mapRoadmapInitiativeToType(initiative) {
    const idPrefix = (initiative.id || '').split('-')[0].toLowerCase();
    if (idPrefix === 'feat') return 'feature';
    if (idPrefix === 'reg') return 'bug';
    if (idPrefix === 'arch') return 'architecture';
    if (idPrefix === 'ux') return 'ux';
    if (idPrefix === 'task') return 'task';
    if (idPrefix === 'gap') return 'gap';
    if (idPrefix === 'bug') return 'bug';
    if (idPrefix === 'enh') return 'enhancement';
    return idPrefix || 'feature';
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
    inferRoadmapIdsFromCommitEvidence,
    enrichRoadmapInitiativesWithTrackedStatus,
    roadmapBacklogItems
};
