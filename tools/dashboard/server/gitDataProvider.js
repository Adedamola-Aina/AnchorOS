/**
 * gitDataProvider.js
 * 
 * Central data provider - ALL dashboard data comes from git.
 * This eliminates dependency on manual markdown files.
 * 
 * Data Sources:
 * - Git commits for bugs, features, regressions, enhancements
 * - deploymentTracker for accurate deployment status (git ancestry based)
 * - roadmap.json for initiative titles/descriptions
 */

const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const deploymentTracker = require('./deploymentTracker');

const git = simpleGit(path.join(__dirname, '../../..'));

// Cache for getAllTrackedItems - avoids repeated git log + ancestry checks
let itemsCache = null;
let itemsCacheTime = 0;
const ITEMS_CACHE_TTL = 120_000; // 2 minutes

function clearItemsCache() {
    itemsCache = null;
    itemsCacheTime = 0;
}

// Load roadmap for title lookup
function loadRoadmap() {
    try {
        const roadmapPath = path.join(__dirname, 'roadmap.json');
        return JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
    } catch {
        return { initiatives: [] };
    }
}

// Get initiative title from roadmap by ID
function getInitiativeTitle(id) {
    const roadmap = loadRoadmap();
    const initiative = roadmap.initiatives.find(i => i.id.toUpperCase() === id.toUpperCase());
    return initiative ? initiative.title : null;
}

// Patterns for extracting IDs from commit messages
const ID_PATTERNS = {
    bug: /BUG-(\d+)/gi,
    regression: /REG-(\d+)/gi,
    feature: /FEAT-(\d+)/gi,
    ux: /UX-(\d+)/gi,
    task: /TASK-(\d+)/gi,
    gap: /GAP-(\d+)/gi,
    arch: /ARCH-(\d+)/gi,
    fin: /FIN-(\d+)/gi,
    sec: /SEC-(\d+)/gi,
    prd: /PRD-(\d+)/gi,
    sre: /SRE-(\d+)/gi,
    plt: /PLT-(\d+)/gi,
    des: /DES-(\d+)/gi,
    eng: /ENG-(\d+)/gi,
    auth: /AUTH-(\d+)/gi,
    pwa: /PWA-(\d+)/gi,
    db: /DB-(\d+)/gi,
    qa: /QA-(\d+)/gi,
    rnd: /RND-(\d+)/gi,
    data: /DATA-(\d+)/gi,
    brand: /BRAND-(\d+)/gi,
    web: /WEB-(\d+)/gi
};

// Commit type detection
function detectType(message) {
    const msg = message.toLowerCase();
    if (msg.includes('bug-') || msg.includes('fix(bug')) return 'bug';
    if (msg.includes('reg-')) return 'regression';
    if (msg.includes('gap-')) return 'gap';
    if (msg.includes('ux-')) return 'enhancement';
    if (msg.includes('task-')) return 'task';
    if (msg.includes('arch-')) return 'architecture';
    if (msg.includes('feat-') || msg.startsWith('feat')) return 'feature';
    if (msg.startsWith('fix')) return 'fix';
    if (msg.startsWith('docs')) return 'docs';
    if (msg.startsWith('chore')) return 'chore';
    return 'other';
}

// Extract all IDs from a commit message
function extractIds(message) {
    const ids = [];
    for (const [type, pattern] of Object.entries(ID_PATTERNS)) {
        const matches = message.matchAll(pattern);
        for (const match of matches) {
            ids.push({
                type,
                id: `${type.toUpperCase()}-${match[1]}`,
                number: parseInt(match[1])
            });
        }
    }
    return ids;
}

// Check if commit is dashboard/tooling (should be filtered from product view)
function isDashboardCommit(message) {
    const msg = message.toLowerCase();
    return msg.includes('dashboard') ||
        msg.includes('deployment_status') ||
        msg.includes('docs:') ||
        msg.includes('chore:') ||
        msg.includes('project_status') ||
        msg.includes('known_issues') ||
        msg.includes('post-implementation') ||
        msg.includes('.agent/') ||
        msg.includes('tools/dashboard');
}

/**
 * Get all tracked items from git history
 * Returns bugs, features, regressions, etc. with ACCURATE deployment status
 * using git ancestry checks
 */
async function getAllTrackedItems(limit = 200) {
    // Return cached data if fresh
    const now = Date.now();
    if (itemsCache && (now - itemsCacheTime) < ITEMS_CACHE_TTL && limit <= 200) {
        return itemsCache;
    }

    try {
        const log = await git.log({ maxCount: limit });
        const items = new Map(); // Use Map for deduplication

        // Get deployments for git ancestry checks
        const deployments = await deploymentTracker.parseDeployMarkers();

        // First pass: collect all commits
        const commitsToCheck = [];
        
        for (const commit of log.all) {
            if (isDashboardCommit(commit.message)) continue;

            const ids = extractIds(commit.message);
            const shortHash = commit.hash.substring(0, 7);

            for (const idInfo of ids) {
                if (!items.has(idInfo.id)) {
                    const roadmapTitle = getInitiativeTitle(idInfo.id);
                    const commitTitle = commit.message.split('\n')[0].substring(0, 100);

                    items.set(idInfo.id, {
                        id: idInfo.id,
                        type: idInfo.type,
                        title: roadmapTitle || commitTitle,
                        commitMessage: commitTitle,
                        hash: shortHash,
                        fullHash: commit.hash,
                        date: commit.date,
                        author: commit.author_name,
                        status: 'dev', // Will be updated after ancestry check
                        environments: { dev: true, staging: false, production: false }
                    });
                    commitsToCheck.push(commit.hash);
                }
            }

            // Also track commits without explicit IDs
            if (ids.length === 0) {
                const type = detectType(commit.message);
                if (type !== 'docs' && type !== 'chore' && type !== 'other') {
                    if (!items.has(shortHash)) {
                        items.set(shortHash, {
                            id: shortHash,
                            type: type,
                            title: commit.message.split('\n')[0].substring(0, 100),
                            hash: shortHash,
                            fullHash: commit.hash,
                            date: commit.date,
                            author: commit.author_name,
                            status: 'dev',
                            environments: { dev: true, staging: false, production: false }
                        });
                        commitsToCheck.push(commit.hash);
                    }
                }
            }
        }

        // Batch check deployment status using git ancestry
        const deploymentStatus = await deploymentTracker.batchCheckDeploymentStatus(
            commitsToCheck,
            deployments
        );

        // Update items with accurate deployment status
        for (const item of items.values()) {
            const status = deploymentStatus.get(item.fullHash);
            if (status) {
                item.environments = {
                    dev: status.development,
                    staging: status.staging,
                    production: status.production
                };
                item.status = status.production ? 'deployed' : 
                              status.staging ? 'staging' : 
                              status.development ? 'dev' : 'pending';
            }
        }

        const result = Array.from(items.values());
        // Cache the result
        if (limit <= 200) {
            itemsCache = result;
            itemsCacheTime = Date.now();
        }
        return result;
    } catch (error) {
        console.error('Error getting tracked items:', error.message);
        return [];
    }
}

/**
 * Get deployment status from git markers
 * Delegates to deploymentTracker for consistency
 */
async function getDeployStatus() {
    return deploymentTracker.getDeploymentSummary();
}

/**
 * Get bugs from git
 */
async function getBugs() {
    const items = await getAllTrackedItems();
    return items.filter(i => i.type === 'bug' || i.type === 'regression');
}

/**
 * Get features from git
 */
async function getFeatures() {
    const items = await getAllTrackedItems();
    return items.filter(i => ['feature', 'enhancement', 'ux', 'task', 'gap', 'architecture'].includes(i.type));
}

/**
 * Get Kanban board data from git
 */
async function getKanbanData() {
    const items = await getAllTrackedItems();

    return {
        backlog: [], // Items not yet in commits are true backlog - we can't track these from git
        inProgress: items.filter(i => i.status === 'dev'),
        staging: items.filter(i => i.status === 'staging'),
        done: items.filter(i => i.status === 'deployed'),
        summary: {
            total: items.length,
            devOnly: items.filter(i => i.status === 'dev').length,
            stagingOnly: items.filter(i => i.status === 'staging').length,
            deployed: items.filter(i => i.status === 'deployed').length
        }
    };
}

/**
 * Get Command Center data from git
 */
async function getCommandCenterData() {
    const items = await getAllTrackedItems(100);
    const deployStatus = await getDeployStatus();

    // Calculate alerts
    const alerts = [];
    const devOnlyItems = items.filter(i => i.status === 'dev');

    if (devOnlyItems.length > 5) {
        alerts.push({
            type: 'warning',
            message: `${devOnlyItems.length} items pending staging/production deploy`,
            items: devOnlyItems.slice(0, 5).map(i => i.id)
        });
    }

    // Recent activity
    const recentBugs = items.filter(i => i.type === 'bug').slice(0, 5);
    const recentFeatures = items.filter(i => ['feature', 'enhancement', 'ux', 'gap'].includes(i.type)).slice(0, 5);

    return {
        source: 'git-automated',
        environments: {
            production: deployStatus.production.version,
            staging: deployStatus.staging.version,
            development: 'HEAD'
        },
        alerts,
        summary: {
            totalTrackedItems: items.length,
            pendingDeploy: devOnlyItems.length,
            recentBugs: recentBugs.length,
            recentFeatures: recentFeatures.length
        },
        recentBugs,
        recentFeatures,
        recentActivity: items.slice(0, 10)
    };
}

/**
 * Get Feature Backlog from git
 */
async function getFeatureBacklog() {
    const items = await getAllTrackedItems();
    const features = items.filter(i => ['feature', 'enhancement', 'ux', 'task', 'gap', 'architecture'].includes(i.type));

    return {
        source: 'git-automated',
        completed: features.filter(i => i.status === 'deployed'),
        inProgress: features.filter(i => i.status === 'staging'),
        pending: features.filter(i => i.status === 'dev'),
        summary: {
            total: features.length,
            completed: features.filter(i => i.status === 'deployed').length,
            inProgress: features.filter(i => i.status === 'staging').length,
            pending: features.filter(i => i.status === 'dev').length
        }
    };
}

/**
 * Get Changelog from git commits
 * Groups commits by version/date and formats as release notes
 */
async function getChangelog(limit = 100) {
    const items = await getAllTrackedItems(limit);

    // Group by date (YYYY-MM-DD)
    const grouped = {};
    items.forEach(item => {
        const date = item.date ? item.date.split('T')[0] : 'unknown';
        if (!grouped[date]) {
            grouped[date] = {
                date,
                security: [],
                features: [],
                fixes: [],
                improvements: [],
                other: []
            };
        }

        // item.id is a string like "BUG-001", item.type is the category
        const itemId = item.id || null;
        const message = item.title || item.commitMessage || '';
        const entry = { id: itemId, message, hash: item.hash };

        // Categorize by item type or ID prefix
        if (itemId && itemId.startsWith('SEC-')) {
            grouped[date].security.push(entry);
        } else if (item.type === 'bug' || item.type === 'regression') {
            grouped[date].fixes.push(entry);
        } else if (['feature', 'enhancement', 'ux', 'gap'].includes(item.type)) {
            grouped[date].features.push(entry);
        } else if (['architecture', 'task'].includes(item.type)) {
            grouped[date].improvements.push(entry);
        } else if (message) {
            grouped[date].other.push(entry);
        }
    });

    // Convert to sorted array
    const releases = Object.values(grouped)
        .filter(r => r.security.length + r.features.length + r.fixes.length + r.improvements.length > 0)
        .sort((a, b) => b.date.localeCompare(a.date));

    return {
        source: 'git-automated',
        generatedAt: new Date().toISOString(),
        totalReleases: releases.length,
        releases
    };
}

/**
 * Get ALL used IDs across git history AND roadmap.json
 * This is the SINGLE SOURCE OF TRUTH for ID allocation.
 * Used by intake API to prevent duplicate IDs.
 * 
 * Returns: { prefix: Set of used numbers }
 * Example: { 'BUG': Set([1,2,3,15,16,17,...]), 'UX': Set([1,2,3,...]) }
 */
async function getAllUsedIds() {
    const usedIds = {};
    
    // 1. Get IDs from git history (500 commits should cover everything)
    try {
        const log = await git.log({ maxCount: 500 });
        for (const commit of log.all) {
            const message = commit.message;
            for (const [type, pattern] of Object.entries(ID_PATTERNS)) {
                const matches = message.matchAll(pattern);
                for (const match of matches) {
                    const prefix = type.toUpperCase();
                    const num = parseInt(match[1]);
                    if (!usedIds[prefix]) usedIds[prefix] = new Set();
                    usedIds[prefix].add(num);
                }
            }
        }
    } catch (e) {
        console.error('[getAllUsedIds] Error reading git:', e.message);
    }
    
    // 2. Get IDs from roadmap.json
    try {
        const roadmapPath = path.join(__dirname, 'roadmap.json');
        const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
        for (const item of roadmapData.initiatives) {
            const match = item.id.match(/^([A-Z]+)-(\d+)$/);
            if (match) {
                const prefix = match[1];
                const num = parseInt(match[2]);
                if (!usedIds[prefix]) usedIds[prefix] = new Set();
                usedIds[prefix].add(num);
            }
        }
    } catch (e) {
        console.error('[getAllUsedIds] Error reading roadmap:', e.message);
    }
    
    return usedIds;
}

/**
 * Get next available ID for a given prefix
 * Checks BOTH git history AND roadmap.json to prevent collisions
 * Returns max(used numbers) + 1, NOT first gap (keeps IDs sequential)
 * 
 * @param {string} prefix - e.g., 'BUG', 'UX', 'FIN'
 * @returns {Promise<string>} - e.g., 'BUG-057'
 */
async function getNextId(prefix) {
    const usedIds = await getAllUsedIds();
    const usedNumbers = usedIds[prefix.toUpperCase()] || new Set();
    
    // Find max + 1 (not first gap) to keep IDs sequential and predictable
    const maxNum = usedNumbers.size > 0 ? Math.max(...usedNumbers) : 0;
    const nextNum = maxNum + 1;
    
    return `${prefix.toUpperCase()}-${String(nextNum).padStart(3, '0')}`;
}

module.exports = {
    getAllTrackedItems,
    getDeployStatus,
    getBugs,
    getFeatures,
    getKanbanData,
    getCommandCenterData,
    getFeatureBacklog,
    getChangelog,
    extractIds,
    detectType,
    isDashboardCommit,
    clearCache: clearItemsCache,
    getAllUsedIds,
    getNextId
};
