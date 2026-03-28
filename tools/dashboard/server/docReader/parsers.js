// @ts-nocheck
/**
 * parsers.js
 *
 * Core markdown parsing logic for documentation files.
 * Extracts structured data from PROJECT_STATUS.md, KNOWN_ISSUES.md, ROADMAP.md, etc.
 */

const {
    extractCheckboxItems,
    extractIssues,
    extractStat,
    parseTable,
    extractListItems
} = require('./parserHelpers');

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

    const inProgressMatch = markdown.match(/### 🏗️ In Progress([\s\S]*?)(?=###|---|\n## )/);
    if (inProgressMatch) {
        result.inProgress = extractCheckboxItems(inProgressMatch[1]);
    }

    const completedMatch = markdown.match(/### ✅ Recently Completed[\s\S]*?\n([\s\S]*?)(?=---|\n## )/);
    if (completedMatch) {
        result.completed = extractCheckboxItems(completedMatch[1]);
    }

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

    const criticalMatch = markdown.match(/## 🔴 CRITICAL \(P0\)([\s\S]*?)(?=## 🟡|---)/);
    if (criticalMatch) {
        result.critical = extractIssues(criticalMatch[1]);
    }

    const highMatch = markdown.match(/## 🟡 HIGH \(P1\)([\s\S]*?)(?=## 🟢|---)/);
    if (highMatch) {
        result.high = extractIssues(highMatch[1]);
    }

    const lowMatch = markdown.match(/## 🟢 LOW \(P2\)([\s\S]*?)(?=## 🔵|---)/);
    if (lowMatch) {
        result.low = extractIssues(lowMatch[1]);
    }

    const fixedMatch = markdown.match(/## ✅ RECENTLY FIXED([\s\S]*?)(?=## 📊|---)/);
    if (fixedMatch) {
        result.recentlyFixed = extractIssues(fixedMatch[1]);
    }

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
        kanban: { backlog: [], todo: [], inProgress: [], done: [] }
    };

    const focusMatch = markdown.match(/## 🎯 CURRENT FOCUS: ([^\n]+)/);
    if (focusMatch) result.currentFocus = focusMatch[1].trim();

    const statusMatch = markdown.match(/\*\*Status\*\*:\s*([^\n]+)/);
    if (statusMatch) result.focusStatus = statusMatch[1].trim();

    const criteriaMatch = markdown.match(/\*\*Success Criteria\*\*:([\s\S]*?)(?=\*\*Timeline|\*\*Status|---|\n## )/);
    if (criteriaMatch) result.successCriteria = extractCheckboxItems(criteriaMatch[1]);

    const completedMatch = markdown.match(/### ✅ Completed([\s\S]*?)(?=### 🚧|---|\n## )/);
    if (completedMatch) result.completed = extractCheckboxItems(completedMatch[1]);

    const inProgressMatch = markdown.match(/### 🚧 In Progress([\s\S]*?)(?=### 📋|---|\n## )/);
    if (inProgressMatch) result.inProgress = extractCheckboxItems(inProgressMatch[1]);

    const plannedMatch = markdown.match(/### 📋 Planned([\s\S]*?)(?=---|\n## )/);
    if (plannedMatch) result.planned = extractCheckboxItems(plannedMatch[1]);

    const q2Match = markdown.match(/## 📅 Q2 2026[\s\S]*?### Candidates([\s\S]*?)(?=---|\n## )/);
    if (q2Match) result.kanban.backlog = extractCheckboxItems(q2Match[1]);

    const willNotMatch = markdown.match(/## 🚫 WILL NOT BUILD([\s\S]*?)(?=---|\n## |$)/);
    if (willNotMatch) result.willNotBuild = extractListItems(willNotMatch[1]);

    result.kanban.done = result.completed.map(item => ({ ...item, status: 'done' }));
    result.kanban.inProgress = result.inProgress.map(item => ({ ...item, status: 'in-progress' }));
    result.kanban.todo = result.planned.map(item => ({ ...item, status: 'todo' }));

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

    const prodMatch = markdown.match(/Production[^\n]*v([\d.]+[^\s|]*)/i);
    if (prodMatch) result.environments.production.version = `v${prodMatch[1]}`;

    const stagingMatch = markdown.match(/Staging[^\n]*v([\d.]+[^\s|]*)/i);
    if (stagingMatch) result.environments.staging.version = `v${stagingMatch[1]}`;

    const devMatch = markdown.match(/Development[^\n]*v([\d.]+[^\s|]*)/i);
    if (devMatch) result.environments.development.version = `v${devMatch[1]}`;

    return result;
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
