// @ts-nocheck
/**
 * kanbanItems.js
 *
 * Item-building logic for the enhanced Kanban board.
 * Processes bugs and roadmap entries into kanban items/columns.
 * Extracted from kanban.js to keep files ≤200 lines (ARCH-001).
 */

const {
    extractId,
    extractTitle,
    extractDate,
    getBugText,
    getPriorityFromSection,
    extractAssignee,
    extractStatus,
    getColumnFromStatus,
    extractLabel
} = require('./kanbanHelpers');

/**
 * Process bugs from KNOWN_ISSUES.md into items/columns
 */
function processBugs(bugs, items, columns, generateId) {
    ['critical', 'high', 'low'].forEach(section => {
        if (!bugs[section] || !Array.isArray(bugs[section])) return;

        bugs[section].forEach(bug => {
            const bugText = getBugText(bug);
            if (!bugText) return;

            const id = bug.id || extractId(bugText) || generateId('BUG');
            const priority = getPriorityFromSection(section);
            const assignee = extractAssignee(bugText);
            const status = extractStatus(bugText);
            const column = getColumnFromStatus(status, false);
            const label = extractLabel(bugText);
            const createdDate = extractDate(bugText);

            items[id] = {
                id,
                title: bug.title || extractTitle(bugText),
                type: id.startsWith('BUG') ? 'bug' : id.startsWith('GAP') ? 'gap' : id.startsWith('REG') ? 'regression' : 'task',
                priority,
                assignee,
                status,
                label,
                description: bugText,
                createdDate,
                dueDate: null
            };
            columns[column].push(id);
        });
    });

    if (bugs.recentlyFixed && Array.isArray(bugs.recentlyFixed)) {
        bugs.recentlyFixed.forEach(bug => {
            const bugText = getBugText(bug);
            if (!bugText) return;

            const id = bug.id || extractId(bugText) || generateId('FIXED');
            items[id] = {
                id,
                title: bug.title || extractTitle(bugText),
                type: id.startsWith('GAP') ? 'gap' : 'bug',
                priority: 'P2',
                assignee: 'Agent',
                status: 'Fixed',
                label: extractLabel(bugText),
                description: bugText,
                createdDate: extractDate(bugText),
                dueDate: null
            };
            columns.done.push(id);
        });
    }
}

/**
 * Process ROADMAP items into items/columns
 */
function processRoadmap(roadmap, items, columns, generateId) {
    if (roadmap.completed && Array.isArray(roadmap.completed)) {
        roadmap.completed.forEach(item => {
            if (!item || !item.text || typeof item.text !== 'string') return;
            const id = extractId(item.text) || generateId('FEAT');
            items[id] = {
                id,
                title: extractTitle(item.text),
                type: 'feature',
                priority: 'P1',
                assignee: 'Teeto',
                status: 'Completed',
                label: extractLabel(item.text),
                description: item.text,
                createdDate: extractDate(item.text),
                dueDate: null
            };
            columns.done.push(id);
        });
    }

    if (roadmap.inProgress && Array.isArray(roadmap.inProgress)) {
        roadmap.inProgress.forEach(item => {
            if (!item || !item.text || typeof item.text !== 'string') return;
            const id = extractId(item.text) || generateId('TASK');
            items[id] = {
                id,
                title: extractTitle(item.text),
                type: 'task',
                priority: 'P1',
                assignee: 'Teeto',
                status: 'In Progress',
                label: extractLabel(item.text),
                description: item.text,
                createdDate: extractDate(item.text),
                dueDate: null
            };
            columns.inProgress.push(id);
        });
    }

    if (roadmap.planned && Array.isArray(roadmap.planned)) {
        roadmap.planned.forEach(item => {
            if (!item || !item.text || typeof item.text !== 'string') return;
            const id = extractId(item.text) || generateId('PLAN');
            items[id] = {
                id,
                title: extractTitle(item.text),
                type: 'task',
                priority: 'P2',
                assignee: 'Unassigned',
                status: 'Planned',
                label: extractLabel(item.text),
                description: item.text,
                createdDate: null,
                dueDate: null
            };
            columns.backlog.push(id);
        });
    }
}

/**
 * Calculate kanban stats from items/columns
 */
function calcStats(items, columns) {
    return {
        totalItems: Object.keys(items).length,
        totalBugs: Object.values(items).filter(i => i.type === 'bug' || i.type === 'regression').length,
        criticalBugs: Object.values(items).filter(i => i.priority === 'P0' && (i.type === 'bug' || i.type === 'regression')).length,
        totalFeatures: Object.values(items).filter(i => i.type === 'feature').length,
        completedThisWeek: columns.done.length,
        inProgressCount: columns.inProgress.length,
        wipLimit: 5,
        wipExceeded: columns.inProgress.length > 5
    };
}

module.exports = { processBugs, processRoadmap, calcStats };
