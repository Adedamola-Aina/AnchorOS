/**
 * progressTracker.js
 * 
 * Tracks project progress using roadmap.json + git-based data.
 * Replaced old ROADMAP.md parsing with automated git-based tracking.
 */

const fs = require('fs');
const path = require('path');
const gitData = require('./gitDataProvider');

const ROADMAP_PATH = path.join(__dirname, 'roadmap.json');

/**
 * Load roadmap.json data
 */
function loadRoadmap() {
    try {
        return JSON.parse(fs.readFileSync(ROADMAP_PATH, 'utf8'));
    } catch {
        return { initiatives: [], lastUpdated: null };
    }
}

/**
 * Get progress from roadmap.json + git data
 */
async function getRoadmapProgress() {
    try {
        const roadmap = loadRoadmap();
        const items = await gitData.getAllTrackedItems(200);

        // Build a set of deployed IDs from git
        const deployedIds = new Set(
            items.filter(i => i.status === 'deployed').map(i => i.id.toUpperCase())
        );
        const stagingIds = new Set(
            items.filter(i => i.status === 'staging').map(i => i.id.toUpperCase())
        );

        // Enrich roadmap initiatives with git status
        const enriched = roadmap.initiatives.map(init => {
            const id = init.id.toUpperCase();
            let status = init.status;
            if (deployedIds.has(id)) status = 'completed';
            else if (stagingIds.has(id)) status = 'in-progress';
            return { ...init, status, gitDetected: status !== init.status };
        });

        const completed = enriched.filter(i => i.status === 'completed');
        const inProgress = enriched.filter(i => i.status === 'in-progress');
        const planned = enriched.filter(i => i.status === 'planned');

        return {
            progress: {
                completed: completed.length,
                inProgress: inProgress.length,
                todo: planned.length,
                total: enriched.length,
                percentComplete: enriched.length > 0
                    ? Math.round((completed.length / enriched.length) * 100)
                    : 0
            },
            byPriority: {
                P0: enriched.filter(i => i.priority === 'P0'),
                P1: enriched.filter(i => i.priority === 'P1'),
                P2: enriched.filter(i => i.priority === 'P2'),
                P3: enriched.filter(i => i.priority === 'P3')
            },
            byTeam: groupByTeam(enriched),
            source: 'roadmap.json + git-automated'
        };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Group initiatives by team
 */
function groupByTeam(initiatives) {
    const teams = {};
    for (const init of initiatives) {
        const team = init.team || 'Unknown';
        if (!teams[team]) teams[team] = { completed: 0, inProgress: 0, planned: 0 };
        if (init.status === 'completed') teams[team].completed++;
        else if (init.status === 'in-progress') teams[team].inProgress++;
        else teams[team].planned++;
    }
    return teams;
}

/**
 * Detect stale items (in-progress for extended periods)
 */
async function detectStaleTasks() {
    try {
        const items = await gitData.getAllTrackedItems(200);
        const alerts = [];

        // Check items in staging for more than 7 days
        const now = new Date();
        const stagingItems = items.filter(i => i.status === 'staging');
        const oldStagingItems = stagingItems.filter(i => {
            const itemDate = new Date(i.date);
            const daysSince = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
            return daysSince > 7;
        });

        if (oldStagingItems.length > 0) {
            alerts.push({
                type: 'stale_staging',
                message: `${oldStagingItems.length} items in staging for 7+ days`,
                severity: 'warning',
                items: oldStagingItems.slice(0, 5).map(i => i.id)
            });
        }

        // Check for too many in-progress items
        const devItems = items.filter(i => i.status === 'dev');
        if (devItems.length > 5) {
            alerts.push({
                type: 'too_many_wip',
                message: `${devItems.length} items in dev only (limit: 5)`,
                severity: 'warning'
            });
        }

        return {
            alerts,
            stagingCount: stagingItems.length,
            devOnlyCount: devItems.length,
            lastChecked: now.toISOString()
        };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Get combined progress report
 */
async function getProgressReport() {
    const [roadmap, stale] = await Promise.all([
        getRoadmapProgress(),
        detectStaleTasks()
    ]);

    return {
        roadmap,
        stale,
        source: 'git-automated',
        lastChecked: new Date().toISOString()
    };
}

module.exports = {
    getRoadmapProgress,
    detectStaleTasks,
    getProgressReport
};
