// @ts-nocheck
const fs = require('fs');
const path = require('path');

const ROADMAP_PATH = path.join(__dirname, '../../../docs/ROADMAP.md');
const ARCHIVE_PATH = path.join(__dirname, '../../../docs/ROADMAP_ARCHIVE.md');

// Parse completion date from item text
function extractCompletionDate(itemText) {
    // Look for patterns like "Completed: 2026-01-15" or "(2026-01-15)"
    const dateMatch = itemText.match(/(?:Completed|Done|Finished):\s*(\d{4}-\d{2}-\d{2})|(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        return dateMatch[1] || dateMatch[2];
    }
    return null;
}

// Get week range for a date
function getWeekRange(dateStr) {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (d) => d.toISOString().split('T')[0];
    return `${formatDate(monday)} to ${formatDate(sunday)}`;
}

// Get month and year for grouping
function getMonthYear(dateStr) {
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Get week number
function getWeekNumber(dateStr) {
    const date = new Date(dateStr);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

// Create archive file if it doesn't exist
function initializeArchive() {
    if (!fs.existsSync(ARCHIVE_PATH)) {
        const initialContent = `# ROADMAP Archive

This file contains completed items that have been automatically archived from the main ROADMAP.md.

---

`;
        fs.writeFileSync(ARCHIVE_PATH, initialContent);
    }
}

// Detect completed items from ROADMAP.md
function detectCompletedItems() {
    if (!fs.existsSync(ROADMAP_PATH)) {
        return [];
    }

    const content = fs.readFileSync(ROADMAP_PATH, 'utf8');
    const lines = content.split('\n');
    const completedItems = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Look for completed items: - [x] or * [x]
        if (line.match(/^\s*[-*]\s*\[x\]/i)) {
            const completionDate = extractCompletionDate(line);
            completedItems.push({
                text: line,
                lineNumber: i + 1,
                completionDate: completionDate || new Date().toISOString().split('T')[0]
            });
        }
    }

    return completedItems;
}

// Check if item is old enough to archive (default 30 days)
function isOldEnough(completionDate, daysThreshold = 30) {
    const completed = new Date(completionDate);
    const now = new Date();
    const daysDiff = Math.floor((now - completed) / (1000 * 60 * 60 * 24));
    return daysDiff >= daysThreshold;
}

// Archive old items
function archiveOldItems(daysThreshold = 30, dryRun = false) {
    initializeArchive();

    const completedItems = detectCompletedItems();
    const itemsToArchive = completedItems.filter(item => isOldEnough(item.completionDate, daysThreshold));

    if (itemsToArchive.length === 0) {
        return {
            success: true,
            archivedCount: 0,
            message: 'No items old enough to archive'
        };
    }

    if (dryRun) {
        return {
            success: true,
            archivedCount: itemsToArchive.length,
            items: itemsToArchive,
            message: `Would archive ${itemsToArchive.length} items (dry run)`
        };
    }

    // Group items by month and week
    const groupedItems = {};
    itemsToArchive.forEach(item => {
        const monthYear = getMonthYear(item.completionDate);
        const weekNum = getWeekNumber(item.completionDate);
        const weekRange = getWeekRange(item.completionDate);

        if (!groupedItems[monthYear]) {
            groupedItems[monthYear] = {};
        }
        if (!groupedItems[monthYear][weekNum]) {
            groupedItems[monthYear][weekNum] = {
                range: weekRange,
                items: []
            };
        }
        groupedItems[monthYear][weekNum].items.push(item);
    });

    // Read current archive
    let archiveContent = fs.readFileSync(ARCHIVE_PATH, 'utf8');

    // Append new archived items
    const months = Object.keys(groupedItems).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA; // Most recent first
    });

    for (const month of months) {
        // Add month header if not exists
        if (!archiveContent.includes(`## ${month}`)) {
            archiveContent += `\n## ${month}\n`;
        }

        const weeks = Object.keys(groupedItems[month]).sort((a, b) => b - a);
        for (const weekNum of weeks) {
            const weekData = groupedItems[month][weekNum];
            const weekHeader = `### Week ${weekNum} (${weekData.range})`;

            if (!archiveContent.includes(weekHeader)) {
                archiveContent += `\n${weekHeader}\n`;
            }

            weekData.items.forEach(item => {
                const archivedLine = `${item.text} (Archived: ${new Date().toISOString().split('T')[0]})`;
                if (!archiveContent.includes(item.text)) {
                    archiveContent += `${archivedLine}\n`;
                }
            });
        }
    }

    // Write updated archive
    fs.writeFileSync(ARCHIVE_PATH, archiveContent);

    // Remove archived items from ROADMAP.md
    let roadmapContent = fs.readFileSync(ROADMAP_PATH, 'utf8');
    itemsToArchive.forEach(item => {
        roadmapContent = roadmapContent.replace(item.text + '\n', '');
    });
    fs.writeFileSync(ROADMAP_PATH, roadmapContent);

    return {
        success: true,
        archivedCount: itemsToArchive.length,
        items: itemsToArchive,
        message: `Successfully archived ${itemsToArchive.length} items`
    };
}

// Get archived items (for viewing)
function getArchivedItems() {
    initializeArchive();

    if (!fs.existsSync(ARCHIVE_PATH)) {
        return [];
    }

    const content = fs.readFileSync(ARCHIVE_PATH, 'utf8');
    const lines = content.split('\n');
    const archivedItems = [];

    let currentMonth = null;
    let currentWeek = null;

    for (const line of lines) {
        if (line.startsWith('## ')) {
            currentMonth = line.replace('## ', '').trim();
        } else if (line.startsWith('### ')) {
            currentWeek = line.replace('### ', '').trim();
        } else if (line.match(/^\s*[-*]\s*\[x\]/i)) {
            archivedItems.push({
                text: line,
                month: currentMonth,
                week: currentWeek
            });
        }
    }

    return archivedItems;
}

// Restore item from archive to ROADMAP
function restoreItem(itemText) {
    if (!fs.existsSync(ARCHIVE_PATH) || !fs.existsSync(ROADMAP_PATH)) {
        return {
            success: false,
            message: 'Archive or roadmap file not found'
        };
    }

    // Remove from archive
    let archiveContent = fs.readFileSync(ARCHIVE_PATH, 'utf8');
    const itemLine = archiveContent.split('\n').find(line => line.includes(itemText));

    if (!itemLine) {
        return {
            success: false,
            message: 'Item not found in archive'
        };
    }

    archiveContent = archiveContent.replace(itemLine + '\n', '');
    fs.writeFileSync(ARCHIVE_PATH, archiveContent);

    // Add back to ROADMAP (in completed section)
    let roadmapContent = fs.readFileSync(ROADMAP_PATH, 'utf8');

    // Find the "Completed" section
    const completedSectionMatch = roadmapContent.match(/^## [^\n]*Completed[^\n]*/im);
    if (completedSectionMatch) {
        const insertIndex = roadmapContent.indexOf(completedSectionMatch[0]) + completedSectionMatch[0].length;
        const restoredLine = itemText.replace(/\(Archived:[^)]*\)/, '').trim();
        roadmapContent = roadmapContent.slice(0, insertIndex) + '\n' + restoredLine + roadmapContent.slice(insertIndex);
    } else {
        // No completed section, add at end
        roadmapContent += '\n\n## Completed\n' + itemText.replace(/\(Archived:[^)]*\)/, '').trim() + '\n';
    }

    fs.writeFileSync(ROADMAP_PATH, roadmapContent);

    return {
        success: true,
        message: 'Item restored to ROADMAP.md'
    };
}

module.exports = {
    archiveOldItems,
    getArchivedItems,
    restoreItem,
    detectCompletedItems
};
