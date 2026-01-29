/**
 * progressTracker.js
 * 
 * Tracks task progress by parsing [x]/[/]/[ ] markers in markdown files.
 * Also tracks sprint velocity and completion trends.
 */
// @ts-nocheck


const fs = require('fs').promises;
const path = require('path');

const DOCS_PATH = path.join(__dirname, '../../../docs');

/**
 * Parse task markers from markdown content
 */
function parseTaskMarkers(content) {
    const tasks = {
        done: [],
        inProgress: [],
        todo: [],
        total: 0
    };

    const lines = content.split('\n');
    let currentSection = '';

    lines.forEach((line, idx) => {
        // Track section headers
        const headerMatch = line.match(/^#{1,3}\s+(.+)/);
        if (headerMatch) {
            currentSection = headerMatch[1].trim();
        }

        // Match task markers: - [x], - [/], - [ ]
        const taskMatch = line.match(/^(\s*)-\s*\[([ x\/])\]\s+(.+)/);
        if (taskMatch) {
            const indent = taskMatch[1].length;
            const marker = taskMatch[2];
            const text = taskMatch[3].trim();

            const task = {
                text,
                section: currentSection,
                line: idx + 1,
                indent
            };

            if (marker === 'x') {
                tasks.done.push(task);
            } else if (marker === '/') {
                tasks.inProgress.push(task);
            } else {
                tasks.todo.push(task);
            }
            tasks.total++;
        }
    });

    return tasks;
}

/**
 * Get progress from ROADMAP.md
 */
async function getRoadmapProgress() {
    try {
        const content = await fs.readFile(path.join(DOCS_PATH, 'ROADMAP.md'), 'utf-8');
        const tasks = parseTaskMarkers(content);

        const completedCount = tasks.done.length;
        const inProgressCount = tasks.inProgress.length;
        const todoCount = tasks.todo.length;

        return {
            tasks,
            progress: {
                completed: completedCount,
                inProgress: inProgressCount,
                todo: todoCount,
                total: tasks.total,
                percentComplete: tasks.total > 0
                    ? Math.round((completedCount / tasks.total) * 100)
                    : 0
            },
            bySection: groupBySection(tasks)
        };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Group tasks by section
 */
function groupBySection(tasks) {
    const sections = {};

    const addToSection = (task, status) => {
        if (!sections[task.section]) {
            sections[task.section] = { done: 0, inProgress: 0, todo: 0 };
        }
        sections[task.section][status]++;
    };

    tasks.done.forEach(t => addToSection(t, 'done'));
    tasks.inProgress.forEach(t => addToSection(t, 'inProgress'));
    tasks.todo.forEach(t => addToSection(t, 'todo'));

    return sections;
}

/**
 * Detect stale tasks (in-progress for more than 7 days)
 */
async function detectStaleTasks() {
    try {
        const roadmapPath = path.join(DOCS_PATH, 'ROADMAP.md');
        const { mtime } = await fs.stat(roadmapPath);
        const content = await fs.readFile(roadmapPath, 'utf-8');
        const tasks = parseTaskMarkers(content);

        // Check if file hasn't been updated in 7+ days
        const daysSinceUpdate = Math.floor((Date.now() - new Date(mtime)) / (1000 * 60 * 60 * 24));

        const alerts = [];

        if (tasks.inProgress.length > 0 && daysSinceUpdate > 7) {
            alerts.push({
                type: 'stale_tasks',
                message: `${tasks.inProgress.length} tasks in-progress but ROADMAP not updated in ${daysSinceUpdate} days`,
                severity: 'warning'
            });
        }

        if (tasks.inProgress.length > 5) {
            alerts.push({
                type: 'too_many_wip',
                message: `${tasks.inProgress.length} tasks in-progress simultaneously (limit: 5)`,
                severity: 'warning'
            });
        }

        return {
            alerts,
            inProgressCount: tasks.inProgress.length,
            daysSinceUpdate,
            lastUpdated: mtime
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
        lastChecked: new Date().toISOString()
    };
}

module.exports = {
    getRoadmapProgress,
    detectStaleTasks,
    getProgressReport,
    parseTaskMarkers
};
