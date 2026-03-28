// @ts-nocheck
const fs = require('fs');
const {
    extractCompletionDate,
    getWeekRange,
    getMonthYear,
    getWeekNumber,
    isOldEnough,
    initializeArchive,
    getArchivedItems,
    restoreItem,
    ROADMAP_PATH,
    ARCHIVE_PATH
} = require('./archiveManagerHelpers');

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

module.exports = {
    archiveOldItems,
    getArchivedItems,
    restoreItem,
    detectCompletedItems
};
