/**
 * kanban.js
 * 
 * Kanban board processing logic.
 * Merges ROADMAP.md and KNOWN_ISSUES.md into unified Kanban structure.
 */

const fs = require('fs').promises;
const path = require('path');
const { parseRoadmap, parseKnownIssues, extractCheckboxItems } = require('./parsers');

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

    // Extract Backlog
    const backlogMatch = markdown.match(/## 🟥 Backlog[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (backlogMatch) result.backlog = extractCheckboxItems(backlogMatch[1]);

    // Extract To Do
    const todoMatch = markdown.match(/## 🟧 To Do[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (todoMatch) result.todo = extractCheckboxItems(todoMatch[1]);

    // Extract In Progress
    const inProgressMatch = markdown.match(/## 🟨 In Progress[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (inProgressMatch) result.inProgress = extractCheckboxItems(inProgressMatch[1]);

    // Extract Done
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
        // Read both source files
        const roadmapPath = path.join(DOCS_PATH, 'ROADMAP.md');
        const bugsPath = path.join(DOCS_PATH, 'KNOWN_ISSUES.md');

        const [roadmapContent, bugsContent] = await Promise.all([
            fs.readFile(roadmapPath, 'utf-8'),
            fs.readFile(bugsPath, 'utf-8')
        ]);

        const roadmap = parseRoadmap(roadmapContent);
        const bugs = parseKnownIssues(bugsContent);

        // Helper to extract ID from text like "[BUG-001]" or "**ARCH-001**"
        const extractId = (text) => {
            if (!text || typeof text !== 'string') return null;
            const match = text.match(/\[([A-Z]+-\d+)\]|\*\*([A-Z]+-\d+)\*\*/);
            return match ? (match[1] || match[2]) : null;
        };

        // Helper to extract priority from bug section
        const getPriorityFromSection = (section) => {
            if (section === 'critical') return 'P0';
            if (section === 'high') return 'P1';
            if (section === 'low') return 'P2';
            return 'P2';
        };

        // Helper to extract assignee from bug text
        const extractAssignee = (text) => {
            if (!text || typeof text !== 'string') return 'Unassigned';
            const match = text.match(/Assigned[:\s]+([^\n]+)/i);
            return match ? match[1].trim() : 'Unassigned';
        };

        // Helper to extract status from bug text
        const extractStatus = (text) => {
            if (!text || typeof text !== 'string') return 'Not Started';
            const match = text.match(/Status[:\s]+([^\n]+)/i);
            return match ? match[1].trim() : 'Not Started';
        };

        // Helper to determine column from status
        const getColumnFromStatus = (status, isCompleted) => {
            if (isCompleted) return 'done';
            if (status.toLowerCase().includes('in progress')) return 'inProgress';
            if (status.toLowerCase().includes('investigating')) return 'inProgress';
            if (status.toLowerCase().includes('not started')) return 'todo';
            if (status.toLowerCase().includes('backlog')) return 'backlog';
            return 'todo';
        };

        // Helper to extract label/category from text
        const extractLabel = (text) => {
            if (!text || typeof text !== 'string') return 'General';
            // Look for common patterns like "Auth", "Finance", "UI", etc.
            const categories = ['Auth', 'Finance', 'UI', 'UX', 'Security', 'Performance', 'Testing', 'Architecture'];
            for (const cat of categories) {
                if (text.toLowerCase().includes(cat.toLowerCase())) {
                    return cat;
                }
            }
            return 'General';
        };

        const items = {};
        const columns = {
            backlog: [],
            todo: [],
            inProgress: [],
            done: []
        };

        // Process bugs from KNOWN_ISSUES.md
        ['critical', 'high', 'low'].forEach(section => {
            if (!bugs[section] || !Array.isArray(bugs[section])) return;

            bugs[section].forEach(bug => {
                if (!bug || !bug.text || typeof bug.text !== 'string') return;

                const id = extractId(bug.text) || `BUG-${Date.now()}`;
                const priority = getPriorityFromSection(section);
                const assignee = extractAssignee(bug.text);
                const status = extractStatus(bug.text);
                const column = getColumnFromStatus(status, false);
                const label = extractLabel(bug.text);

                const item = {
                    id,
                    title: bug.text.split('\n')[0].replace(/\[.*?\]/, '').replace(/###/, '').trim(),
                    type: id.startsWith('BUG') ? 'bug' : id.startsWith('GAP') ? 'gap' : id.startsWith('REG') ? 'regression' : 'task',
                    priority,
                    assignee,
                    status,
                    label,
                    description: bug.text,
                    createdDate: null, // Could parse from "Reported" field
                    dueDate: null      // Could parse from "Target" field
                };

                items[id] = item;
                columns[column].push(id);
            });
        });

        // Process completed bugs
        if (bugs.recentlyFixed && Array.isArray(bugs.recentlyFixed)) {
            bugs.recentlyFixed.forEach(bug => {
                if (!bug || !bug.text || typeof bug.text !== 'string') return;

                const id = extractId(bug.text) || `FIXED-${Date.now()}`;
                const item = {
                    id,
                    title: bug.text.split('\n')[0].replace(/\[.*?\]/, '').replace(/###/, '').trim(),
                    type: 'bug',
                    priority: 'P2',
                    assignee: 'Agent',
                    status: 'Fixed',
                    label: extractLabel(bug.text),
                    description: bug.text,
                    createdDate: null,
                    dueDate: null
                };
                items[id] = item;
                columns.done.push(id);
            });
        }

        // Process ROADMAP items
        if (roadmap.completed && Array.isArray(roadmap.completed)) {
            roadmap.completed.forEach(item => {
                if (!item || !item.text || typeof item.text !== 'string') return;

                const id = extractId(item.text) || `FEAT-${Date.now()}`;
                items[id] = {
                    id,
                    title: item.text.replace(/\[.*?\]/, '').replace(/\*\*.*?\*\*/, '').trim(),
                    type: 'feature',
                    priority: 'P1',
                    assignee: 'Teeto',
                    status: 'Completed',
                    label: extractLabel(item.text),
                    description: item.text,
                    createdDate: null,
                    dueDate: null
                };
                columns.done.push(id);
            });
        }

        if (roadmap.inProgress && Array.isArray(roadmap.inProgress)) {
            roadmap.inProgress.forEach(item => {
                if (!item || !item.text || typeof item.text !== 'string') return;

                const id = extractId(item.text) || `TASK-${Date.now()}`;
                items[id] = {
                    id,
                    title: item.text.replace(/\[.*?\]/, '').replace(/\*\*.*?\*\*/, '').trim(),
                    type: 'task',
                    priority: 'P1',
                    assignee: 'Teeto',
                    status: 'In Progress',
                    label: extractLabel(item.text),
                    description: item.text,
                    createdDate: null,
                    dueDate: null
                };
                columns.inProgress.push(id);
            });
        }

        if (roadmap.planned && Array.isArray(roadmap.planned)) {
            roadmap.planned.forEach(item => {
                if (!item || !item.text || typeof item.text !== 'string') return;

                const id = extractId(item.text) || `PLAN-${Date.now()}`;
                items[id] = {
                    id,
                    title: item.text.replace(/\[.*?\]/, '').replace(/\*\*.*?\*\*/, '').trim(),
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

        // Calculate stats
        const stats = {
            totalItems: Object.keys(items).length,
            totalBugs: Object.values(items).filter(i => i.type === 'bug' || i.type === 'regression').length,
            criticalBugs: Object.values(items).filter(i => i.priority === 'P0' && (i.type === 'bug' || i.type === 'regression')).length,
            totalFeatures: Object.values(items).filter(i => i.type === 'feature').length,
            completedThisWeek: columns.done.length,
            inProgressCount: columns.inProgress.length,
            wipLimit: 5,
            wipExceeded: columns.inProgress.length > 5
        };

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
