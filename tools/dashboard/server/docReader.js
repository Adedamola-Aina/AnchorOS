/**
 * docReader.js
 * 
 * Reads and parses documentation files from the docs/ folder.
 * Extracts structured data from PROJECT_STATUS.md, KNOWN_ISSUES.md, ROADMAP.md, etc.
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const DOCS_PATH = path.join(__dirname, '../../../docs');
const ROOT_PATH = path.join(__dirname, '../../..');

/**
 * Read and parse a documentation file
 */
async function readDoc(filename) {
    try {
        const filePath = path.join(DOCS_PATH, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);
        const { data: frontmatter, content: markdown } = matter(content);

        return {
            filename,
            frontmatter,
            content: markdown,
            lastModified: stats.mtime,
            freshness: calculateFreshness(stats.mtime),
            parsed: parseByType(filename, markdown)
        };
    } catch (error) {
        return { filename, error: error.message, exists: false };
    }
}

/**
 * Calculate document freshness
 */
function calculateFreshness(mtime) {
    const ageHours = (Date.now() - new Date(mtime).getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) return { status: 'fresh', label: `${Math.round(ageHours)} hours ago`, color: 'green' };
    if (ageHours < 168) return { status: 'recent', label: `${Math.round(ageHours / 24)} days ago`, color: 'yellow' };
    return { status: 'stale', label: `${Math.round(ageHours / 24)} days ago`, color: 'red' };
}

/**
 * Parse content based on document type
 */
function parseByType(filename, markdown) {
    switch (filename) {
        case 'PROJECT_STATUS.md':
            return parseProjectStatus(markdown);
        case 'KNOWN_ISSUES.md':
            return parseKnownIssues(markdown);
        case 'ROADMAP.md':
            return parseRoadmap(markdown);
        case 'DEPLOYMENT_STATUS.md':
            return parseDeploymentStatus(markdown);
        default:
            return { raw: markdown };
    }
}

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
    const bugsMatch = markdown.match(/## 🐛 CRITICAL BUGS[\s\S]*?\|[\s\S]*?\|([\s\S]*?)(?=_See|---|\n## )/);
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

// Helper to extract simple list items (for will not build)
function extractListItems(text) {
    const items = [];
    const regex = /- \*\*([^*]+)\*\*/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        items.push(match[1].trim());
    }
    return items;
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

/**
 * Get all documentation files status
 */
async function getAllDocs() {
    const docFiles = ['PROJECT_STATUS.md', 'KNOWN_ISSUES.md', 'ROADMAP.md', 'DEPLOYMENT_STATUS.md'];
    const results = await Promise.all(docFiles.map(readDoc));
    return results;
}

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
 * Parse FEATURE_SUGGESTIONS.md
 */
function parseFeatureSuggestions(markdown) {
    const categories = [];

    // Match category headers (## 🏗️ 1. ARCHITECTURE, etc.)
    const categoryRegex = /## [🏗🔐🎨💰✅👨‍👩‍👧‍👦⚙🚪🎯🆘].+\d+\. (.+)\n/g;
    const categoryMatches = [...markdown.matchAll(categoryRegex)];

    // Get all feature items with IDs like [ARCH-001], [AUTH-002], etc.
    const featureRegex = /#### \[([A-Z]+-\d+)\] (.+)\n([\s\S]*?)(?=####|\n## |\n---|\n### |$)/g;
    const features = [];
    let match;

    while ((match = featureRegex.exec(markdown)) !== null) {
        const id = match[1];
        const title = match[2].trim();
        const content = match[3];

        // Determine category from ID prefix
        const prefix = id.split('-')[0];
        const categoryMap = {
            'ARCH': 'Architecture & Code',
            'AUTH': 'Authentication & Security',
            'UX': 'UI/UX & Design',
            'FIN': 'Finance Module',
            'TASK': 'Commitments (Todo)',
            'FAM': 'Family Mode',
            'SET': 'Settings & Account',
            'ONB': 'Onboarding',
            'BRAND': 'Brand & Marketing',
            'HELP': 'Support & Help'
        };

        // Extract priority from section header (HIGH/MEDIUM/LOW)
        let priority = 'medium';
        const priorityMatch = markdown.substring(0, match.index).match(/### (HIGH|MEDIUM|LOW) Priority[^#]*$/i);
        if (priorityMatch) {
            priority = priorityMatch[1].toLowerCase();
        }

        // Extract effort
        const effortMatch = content.match(/\*\*Effort\*\*:\s*([^\n]+)/);
        const effort = effortMatch ? effortMatch[1].trim() : 'Unknown';

        // Extract impact
        const impactMatch = content.match(/\*\*Impact\*\*:\s*([^\n]+)/);
        const impact = impactMatch ? impactMatch[1].trim() : '';

        features.push({
            id,
            title,
            category: categoryMap[prefix] || 'Other',
            priority,
            effort,
            impact,
            description: content.trim().substring(0, 200) + '...'
        });
    }

    // Group by category
    const grouped = {};
    features.forEach(f => {
        if (!grouped[f.category]) grouped[f.category] = [];
        grouped[f.category].push(f);
    });

    // Calculate summary stats
    const summary = {
        total: features.length,
        byPriority: {
            high: features.filter(f => f.priority === 'high').length,
            medium: features.filter(f => f.priority === 'medium').length,
            low: features.filter(f => f.priority === 'low').length
        },
        byCategory: Object.entries(grouped).map(([cat, items]) => ({
            category: cat,
            count: items.length
        }))
    };

    return {
        features,
        grouped,
        summary
    };
}

/**
 * Get Feature Suggestions
 */
async function getFeatureSuggestions() {
    try {
        const filePath = path.join(DOCS_PATH, 'FEATURE_SUGGESTIONS.md');
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);

        return {
            filename: 'FEATURE_SUGGESTIONS.md',
            content,
            lastModified: stats.mtime,
            freshness: calculateFreshness(stats.mtime),
            parsed: parseFeatureSuggestions(content)
        };
    } catch (error) {
        return { filename: 'FEATURE_SUGGESTIONS.md', error: error.message, exists: false };
    }
}

module.exports = { readDoc, getAllDocs, getProjectBoard, getFeatureSuggestions };

