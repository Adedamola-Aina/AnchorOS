// @ts-nocheck
/**
 * kanbanHelpers.js
 *
 * Helper functions for building the enhanced Kanban board.
 * Extracted from kanban.js to keep files ≤200 lines (ARCH-001).
 */

/**
 * Helper to extract ID from text like "[BUG-001]" or "**ARCH-001**"
 */
function extractId(text) {
    if (!text || typeof text !== 'string') return null;
    const match = text.match(/\[([A-Z]+-\d+)\]|\*\*([A-Z]+-\d+)\*\*/);
    return match ? (match[1] || match[2]) : null;
}

/**
 * Helper to extract a clean title from markdown text
 */
function extractTitle(text) {
    if (!text || typeof text !== 'string') return 'Untitled';
    const boldMatch = text.match(/\*\*([^*]+)\*\*/);
    if (boldMatch) {
        return boldMatch[1].trim();
    }
    return text.split('\n')[0].replace(/\[.*?\]/g, '').replace(/^-\s*\[.\]\s*/, '').trim();
}

/**
 * Helper to extract date from text (e.g., "2026-01-28" or "Jan 28")
 */
function extractDate(text) {
    if (!text || typeof text !== 'string') return null;
    const isoMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) return isoMatch[1];
    const monthMatch = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})/i);
    if (monthMatch) {
        const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
                         jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
        const month = months[monthMatch[1].toLowerCase()];
        const day = monthMatch[2].padStart(2, '0');
        return `2026-${month}-${day}`;
    }
    return null;
}

/**
 * Helper to get text content from bug object (handles both formats)
 */
function getBugText(bug) {
    if (!bug) return null;
    if (bug.content) return `[${bug.id}] ${bug.title}\n${bug.content}`;
    if (bug.text) return bug.text;
    return null;
}

/**
 * Helper to extract priority from bug section
 */
function getPriorityFromSection(section) {
    if (section === 'critical') return 'P0';
    if (section === 'high') return 'P1';
    if (section === 'low') return 'P2';
    return 'P2';
}

/**
 * Helper to extract assignee from bug text
 */
function extractAssignee(text) {
    if (!text || typeof text !== 'string') return 'Unassigned';
    const match = text.match(/\*\*Assigned\*\*[:\s]+([^\n-]+)/i) ||
                  text.match(/Assigned[:\s]+([^\n-]+)/i);
    if (match) {
        const assignee = match[1].trim();
        return assignee === 'Unassigned' || assignee.startsWith('**') ? 'Unassigned' : assignee;
    }
    return 'Unassigned';
}

/**
 * Helper to extract status from bug text
 */
function extractStatus(text) {
    if (!text || typeof text !== 'string') return 'Not Started';
    const match = text.match(/\*\*Status\*\*[:\s]+([^\n-]+)/i) ||
                  text.match(/Status[:\s]+([^\n-]+)/i);
    if (match) {
        const status = match[1].trim();
        return status.startsWith('**') ? 'Not Started' : status;
    }
    return 'Not Started';
}

/**
 * Helper to determine column from status
 */
function getColumnFromStatus(status, isCompleted) {
    if (isCompleted) return 'done';
    if (status.toLowerCase().includes('in progress')) return 'inProgress';
    if (status.toLowerCase().includes('investigating')) return 'inProgress';
    if (status.toLowerCase().includes('not started')) return 'todo';
    if (status.toLowerCase().includes('backlog')) return 'backlog';
    return 'todo';
}

/**
 * Helper to extract label/category from text
 */
function extractLabel(text) {
    if (!text || typeof text !== 'string') return 'General';
    const categories = ['Auth', 'Finance', 'UI', 'UX', 'Security', 'Performance', 'Testing', 'Architecture'];
    for (const cat of categories) {
        if (text.toLowerCase().includes(cat.toLowerCase())) {
            return cat;
        }
    }
    return 'General';
}

module.exports = {
    extractId,
    extractTitle,
    extractDate,
    getBugText,
    getPriorityFromSection,
    extractAssignee,
    extractStatus,
    getColumnFromStatus,
    extractLabel
};
