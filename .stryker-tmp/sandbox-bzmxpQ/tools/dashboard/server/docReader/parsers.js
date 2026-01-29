/**
 * parsers.js
 * 
 * Core markdown parsing logic for documentation files.
 * Extracts structured data from PROJECT_STATUS.md, KNOWN_ISSUES.md, ROADMAP.md, etc.
 */
// @ts-nocheck


/**
 * Parse PROJECT_STATUS.md
 */
function parseProjectStatus(markdown) {
    const result = {
        inProgress: [],
        completed: [],
        blocked: [],
        priorities: [],
        criticalBugs: []
    };

    // Extract In Progress items
    const inProgressMatch = markdown.match(/### 🏗️ In Progress([\s\S]*?)(?=###|---|\n## )/);
    if (inProgressMatch) {
        result.inProgress = extractCheckboxItems(inProgressMatch[1]);
    }

    // Extract Recently Completed
    const completedMatch = markdown.match(/### ✅ Recently Completed[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (completedMatch) {
        result.completed = extractCheckboxItems(completedMatch[1]);
    }

    // Extract Critical Bugs table
    const bugsMatch = markdown.match(/## 🐛 CRITICAL BUGS[\s\S]*?\|([\s\S]*?)(?=_See|---|\n## )/);
    if (bugsMatch) {
        result.criticalBugs = parseTable(bugsMatch[0]);
    }

    return result;
}

/**
 * Parse KNOWN_ISSUES.md
 */
function parseKnownIssues(markdown) {
    const result = {
        critical: [],
        high: [],
        low: [],
        recentlyFixed: [],
        statistics: {}
    };

    // Extract Critical (P0) issues
    const criticalMatch = markdown.match(/## 🔴 CRITICAL \(P0\)([\s\S]*?)(?=## 🟡|---)/);
    if (criticalMatch) {
        result.critical = extractIssues(criticalMatch[1]);
    }

    // Extract High (P1) issues
    const highMatch = markdown.match(/## 🟡 HIGH \(P1\)([\s\S]*?)(?=## 🟢|---)/);
    if (highMatch) {
        result.high = extractIssues(highMatch[1]);
    }

    // Extract Low (P2) issues
    const lowMatch = markdown.match(/## 🟢 LOW \(P2\)([\s\S]*?)(?=## 🔵|---)/);
    if (lowMatch) {
        result.low = extractIssues(lowMatch[1]);
    }

    // Extract Recently Fixed
    const fixedMatch = markdown.match(/## ✅ RECENTLY FIXED([\s\S]*?)(?=## 📊|---)/);
    if (fixedMatch) {
        result.recentlyFixed = extractIssues(fixedMatch[1]);
    }

    // Extract Statistics
    const statsMatch = markdown.match(/## 📊 BUG STATISTICS([\s\S]*?)(?=---|\n## |$)/);
    if (statsMatch) {
        const stats = statsMatch[1];
        result.statistics = {
            totalActive: extractStat(stats, 'Total Active'),
            critical: extractStat(stats, 'Critical'),
            high: extractStat(stats, 'High'),
            low: extractStat(stats, 'Low'),
            fixedThisMonth: extractStat(stats, 'Fixed This Month')
        };
    }

    return result;
}

/**
 * Parse ROADMAP.md - Single Source of Truth
 * Generates both strategic view AND kanban structure
 */
function parseRoadmap(markdown) {
    const result = {
        currentFocus: '',
        focusStatus: '',
        successCriteria: [],
        completed: [],
        inProgress: [],
        planned: [],
        willNotBuild: [],
        // Kanban structure (generated from roadmap data)
        kanban: {
            backlog: [],
            todo: [],
            inProgress: [],
            done: []
        }
    };

    // Extract current focus
    const focusMatch = markdown.match(/## 🎯 CURRENT FOCUS: ([^\n]+)/);
    if (focusMatch) {
        result.currentFocus = focusMatch[1].trim();
    }

    // Extract focus status if present
    const statusMatch = markdown.match(/\*\*Status\*\*:\s*([^\n]+)/);
    if (statusMatch) {
        result.focusStatus = statusMatch[1].trim();
    }

    // Extract success criteria
    const criteriaMatch = markdown.match(/\*\*Success Criteria\*\*:([\s\S]*?)(?=\*\*Timeline|\*\*Status|---|\n## )/);
    if (criteriaMatch) {
        result.successCriteria = extractCheckboxItems(criteriaMatch[1]);
    }

    // Extract completed items (Q1 completed section)
    const completedMatch = markdown.match(/### ✅ Completed([\s\S]*?)(?=### 🚧|---|\n## )/);
    if (completedMatch) {
        result.completed = extractCheckboxItems(completedMatch[1]);
    }

    // Extract in progress items
    const inProgressMatch = markdown.match(/### 🚧 In Progress([\s\S]*?)(?=### 📋|---|\n## )/);
    if (inProgressMatch) {
        result.inProgress = extractCheckboxItems(inProgressMatch[1]);
    }

    // Extract planned items
    const plannedMatch = markdown.match(/### 📋 Planned([\s\S]*?)(?=---|\n## )/);
    if (plannedMatch) {
        result.planned = extractCheckboxItems(plannedMatch[1]);
    }

    // Extract Q2 candidates as backlog
    const q2Match = markdown.match(/## 📅 Q2 2026[\s\S]*?### Candidates([\s\S]*?)(?=---|\n## )/);
    if (q2Match) {
        result.kanban.backlog = extractCheckboxItems(q2Match[1]);
    }

    // Extract will not build
    const willNotMatch = markdown.match(/## 🚫 WILL NOT BUILD([\s\S]*?)(?=---|\n## |$)/);
    if (willNotMatch) {
        result.willNotBuild = extractListItems(willNotMatch[1]);
    }

    // Build Kanban from roadmap data
    result.kanban.done = result.completed.map(item => ({
        ...item,
        status: 'done'
    }));

    result.kanban.inProgress = result.inProgress.map(item => ({
        ...item,
        status: 'in-progress'
    }));

    result.kanban.todo = result.planned.map(item => ({
        ...item,
        status: 'todo'
    }));

    return result;
}

/**
 * Parse DEPLOYMENT_STATUS.md
 */
function parseDeploymentStatus(markdown) {
    const result = {
        environments: {
            production: { version: 'unknown', lastDeploy: null, health: 'unknown' },
            staging: { version: 'unknown', lastDeploy: null, health: 'unknown' },
            development: { version: 'unknown', lastDeploy: null, health: 'unknown' }
        },
        recentDeployments: []
    };

    // Try to extract version info from tables or text
    const prodMatch = markdown.match(/Production[^\n]*v([\d.]+[^\s|]*)/i);
    if (prodMatch) result.environments.production.version = `v${prodMatch[1]}`;

    const stagingMatch = markdown.match(/Staging[^\n]*v([\d.]+[^\s|]*)/i);
    if (stagingMatch) result.environments.staging.version = `v${stagingMatch[1]}`;

    const devMatch = markdown.match(/Development[^\n]*v([\d.]+[^\s|]*)/i);
    if (devMatch) result.environments.development.version = `v${devMatch[1]}`;

    return result;
}

// Helper functions
function extractCheckboxItems(text) {
    const items = [];
    const regex = /- \[([ x\/])\] (.+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        items.push({
            status: match[1] === 'x' ? 'done' : match[1] === '/' ? 'in-progress' : 'todo',
            text: match[2].trim()
        });
    }
    return items;
}

function extractIssues(text) {
    const issues = [];
    const issueBlocks = text.split(/### \[([A-Z]+-\d+)\]/);
    for (let i = 1; i < issueBlocks.length; i += 2) {
        const id = issueBlocks[i];
        const content = issueBlocks[i + 1] || '';
        const titleMatch = content.match(/^([^\n]+)/);
        issues.push({
            id,
            title: titleMatch ? titleMatch[1].trim() : 'Unknown',
            content: content.trim()
        });
    }
    return issues;
}

function extractStat(text, label) {
    const match = text.match(new RegExp(`${label}[^:]*:\\s*([^\\n]+)`));
    return match ? match[1].trim() : null;
}

function parseTable(tableText) {
    const rows = [];
    const lines = tableText.split('\n').filter(l => l.includes('|') && !l.includes('---'));
    if (lines.length < 2) return rows;

    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
        if (cells.length >= headers.length) {
            const row = {};
            headers.forEach((h, idx) => row[h.toLowerCase().replace(/\s+/g, '_')] = cells[idx]);
            rows.push(row);
        }
    }
    return rows;
}

function extractListItems(text) {
    const items = [];
    const regex = /- \*\*([^*]+)\*\*/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        items.push(match[1].trim());
    }
    return items;
}

module.exports = {
    parseProjectStatus,
    parseKnownIssues,
    parseRoadmap,
    parseDeploymentStatus,
    extractCheckboxItems,
    extractIssues,
    extractStat,
    parseTable,
    extractListItems
};
