// @ts-nocheck
/**
 * commandCenterWork.js
 * Work summary and deployment history for the command center.
 */

const fs = require('fs');
const path = require('path');
const gitData = require('./gitDataProvider');
const { getDeploymentTimeline } = require('./gitAnalyzer');

async function getDeploymentHistory() {
    try {
        const timeline = await getDeploymentTimeline();
        const history = timeline.slice(0, 20).map(item => ({
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown',
            version: item.version || item.message?.match(/v?(\d+\.\d+\.\d+)/)?.[0] || 'Unknown',
            environment: item.environment || 'dev',
            changes: item.message?.substring(0, 100) || ''
        }));
        return { lastUpdated: new Date().toISOString(), history };
    } catch (error) {
        console.error('Error getting deployment history:', error.message);
        return { lastUpdated: null, history: [] };
    }
}

async function getWorkSummary() {
    try {
        const kanbanData = await gitData.getKanbanData();
        const doneThisWeek = [];
        const inProgress = [];
        const upcoming = [];
        const now = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        for (const item of kanbanData.done || []) {
            const itemDate = item.date ? new Date(item.date) : null;
            if (itemDate && itemDate >= weekAgo) {
                doneThisWeek.push({ id: item.id, title: item.title, type: item.type, date: item.date });
            }
        }

        const todoItems = kanbanData.todo || kanbanData.inProgress || [];
        const stagingItems = kanbanData.inProgress || kanbanData.staging || [];

        for (const item of todoItems) {
            inProgress.push({ id: item.id, title: item.title, type: item.type, priority: 'medium', status: 'dev' });
        }
        for (const item of stagingItems) {
            inProgress.push({ id: item.id, title: item.title, type: item.type, priority: 'high', status: 'staging' });
        }

        try {
            const roadmapPath = path.join(__dirname, 'roadmap.json');
            const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
            const pOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
            const planned = roadmapData.initiatives
                .filter(i => i.status === 'planned')
                .sort((a, b) => (pOrder[a.priority] ?? 4) - (pOrder[b.priority] ?? 4));
            for (const item of planned.slice(0, 10)) {
                upcoming.push({ id: item.id, title: item.title, type: item.team || 'planned', priority: item.priority || 'P2' });
            }
        } catch {
            // roadmap.json unavailable — upcoming stays empty
        }

        return {
            doneThisWeek: doneThisWeek.slice(0, 10),
            inProgress: inProgress.slice(0, 10),
            upcoming: upcoming.slice(0, 5),
            stats: kanbanData.summary
        };
    } catch (error) {
        console.error('Error getting work summary:', error.message);
        return { doneThisWeek: [], inProgress: [], upcoming: [], stats: {} };
    }
}

module.exports = { getDeploymentHistory, getWorkSummary };
