// @ts-nocheck
/**
 * kanban.js
 *
 * Kanban board processing logic.
 * Merges ROADMAP.md and KNOWN_ISSUES.md into unified Kanban structure.
 */

const fs = require('fs').promises;
const path = require('path');
const { parseRoadmap, parseKnownIssues, extractCheckboxItems } = require('./parsers');
const { processBugs, processRoadmap, calcStats } = require('./kanbanItems');

const DOCS_PATH = path.join(__dirname, '../../../../docs');
const ROOT_PATH = path.join(__dirname, '../../../..');

/**
 * Get PROJECT_BOARD.md from root
 */
async function getProjectBoard() {
    try {
        const filePath = path.join(ROOT_PATH, 'PROJECT_BOARD.md');
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);

        return {
            filename: 'PROJECT_BOARD.md',
            content,
            lastModified: stats.mtime,
            parsed: parseKanbanBoard(content)
        };
    } catch (error) {
        return { filename: 'PROJECT_BOARD.md', error: error.message };
    }
}

function parseKanbanBoard(markdown) {
    const result = {
        backlog: [],
        todo: [],
        inProgress: [],
        done: []
    };

    const backlogMatch = markdown.match(/## 🟥 Backlog[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (backlogMatch) result.backlog = extractCheckboxItems(backlogMatch[1]);

    const todoMatch = markdown.match(/## 🟧 To Do[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (todoMatch) result.todo = extractCheckboxItems(todoMatch[1]);

    const inProgressMatch = markdown.match(/## 🟨 In Progress[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (inProgressMatch) result.inProgress = extractCheckboxItems(inProgressMatch[1]);

    const doneMatch = markdown.match(/## ✅ Done[\s\S]*?\n([\s\S]*?)(?=---|\n## |$)/);
    if (doneMatch) result.done = extractCheckboxItems(doneMatch[1]);

    return result;
}

/**
 * Get Enhanced Kanban Board
 * Merges ROADMAP.md and KNOWN_ISSUES.md into unified Kanban structure
 * with rich metadata (IDs, types, priorities, assignees, labels)
 */
async function getEnhancedKanbanBoard() {
    try {
        const roadmapPath = path.join(DOCS_PATH, 'ROADMAP.md');
        const bugsPath = path.join(DOCS_PATH, 'KNOWN_ISSUES.md');

        const [roadmapContent, bugsContent] = await Promise.all([
            fs.readFile(roadmapPath, 'utf-8'),
            fs.readFile(bugsPath, 'utf-8')
        ]);

        const roadmap = parseRoadmap(roadmapContent);
        const bugs = parseKnownIssues(bugsContent);

        let idCounter = 1;
        const generateId = (prefix) => `${prefix}-GEN-${idCounter++}`;

        const items = {};
        const columns = { backlog: [], todo: [], inProgress: [], done: [] };

        processBugs(bugs, items, columns, generateId);
        processRoadmap(roadmap, items, columns, generateId);

        const stats = calcStats(items, columns);

        return {
            columns,
            items,
            stats,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    getProjectBoard,
    parseKanbanBoard,
    getEnhancedKanbanBoard
};
