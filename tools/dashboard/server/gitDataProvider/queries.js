// @ts-nocheck
/** High-level query functions built on top of getAllTrackedItems. */

const deploymentTracker = require('../deploymentTracker');
const { getAllTrackedItems } = require('./tracker');
const { isInitiativeType, sortKanbanLane, partitionFeatureBacklog } = require('./constants');
const { loadRoadmap, roadmapBacklogItems } = require('./roadmap');

async function getDeployStatus() {
    return deploymentTracker.getDeploymentSummary();
}

async function getBugs() {
    const items = await getAllTrackedItems();
    return items.filter(i => i.type === 'bug' || i.type === 'regression');
}

async function getFeatures() {
    const items = await getAllTrackedItems();
    return items.filter(i => isInitiativeType(i.type));
}

// Raw commit hashes (7-char hex) are commits with no named ID — keep them out of named lanes
const RAW_HASH_RE = /^[a-f0-9]{7}$/i;
const isNamedItem = i => !RAW_HASH_RE.test(i.id);

async function getKanbanData() {
    const items = await getAllTrackedItems();
    const roadmapData = loadRoadmap();
    const deferredIds = new Set(roadmapData.initiatives.filter(i => i.status === 'deferred').map(i => i.id));
    const activeItems = items.filter(i => !deferredIds.has(i.id));
    const namedItems = activeItems.filter(isNamedItem);
    const backlog = roadmapBacklogItems(roadmapData, namedItems, deferredIds);

    const todo = sortKanbanLane(namedItems.filter(i => i.status === 'dev')
        .map(item => ({ ...item, lifecycle: item.lifecycle || 'todo', lifecycleReason: 'Commit detected in development branch ancestry' })));
    const inProgress = sortKanbanLane(namedItems.filter(i => i.status === 'staging')
        .map(item => ({ ...item, lifecycle: item.lifecycle || 'inProgress', lifecycleReason: 'Commit reached staging deployment ancestry' })));
    const done = sortKanbanLane(namedItems.filter(i => i.status === 'deployed')
        .map(item => ({ ...item, lifecycle: item.lifecycle || 'done', lifecycleReason: 'Commit reached production deployment ancestry' })));
    const untracked = activeItems.filter(i => !isNamedItem(i));

    return {
        backlog: sortKanbanLane(backlog), todo, inProgress,
        staging: inProgress, // backward compatibility
        done, untracked,
        deferred: items.filter(i => deferredIds.has(i.id)),
        summary: {
            total: namedItems.length + backlog.length,
            backlog: backlog.length,
            devOnly: todo.length,
            stagingOnly: inProgress.length,
            deployed: done.length,
            untracked: untracked.length,
            deferred: items.filter(i => deferredIds.has(i.id)).length
        }
    };
}

async function getCommandCenterData() {
    const items = await getAllTrackedItems(100);
    const deployStatus = await getDeployStatus();
    const alerts = [];
    const devOnlyItems = items.filter(i => i.status === 'dev');
    if (devOnlyItems.length > 5) {
        alerts.push({ type: 'warning', message: `${devOnlyItems.length} items pending staging/production deploy`, items: devOnlyItems.slice(0, 5).map(i => i.id) });
    }
    const recentBugs = items.filter(i => i.type === 'bug').slice(0, 5);
    const recentFeatures = items.filter(i => isInitiativeType(i.type)).slice(0, 5);
    return {
        source: 'git-automated',
        environments: { production: deployStatus.production.version, staging: deployStatus.staging.version, development: 'HEAD' },
        alerts,
        summary: { totalTrackedItems: items.length, pendingDeploy: devOnlyItems.length, recentBugs: recentBugs.length, recentFeatures: recentFeatures.length },
        recentBugs, recentFeatures, recentActivity: items.slice(0, 10)
    };
}

async function getFeatureBacklog() {
    const items = await getAllTrackedItems();
    const partitioned = partitionFeatureBacklog(items);
    return { source: 'git-automated', ...partitioned };
}

module.exports = { getDeployStatus, getBugs, getFeatures, getKanbanData, getCommandCenterData, getFeatureBacklog };
