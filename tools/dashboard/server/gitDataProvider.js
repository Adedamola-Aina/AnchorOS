/**
 * gitDataProvider.js
 * 
 * Central data provider - ALL dashboard data comes from git.
 * This eliminates dependency on manual markdown files.
 * 
 * Data Sources:
 * - Git commits for bugs, features, regressions, enhancements
 * - Git tags/markers for deployment status
 * - roadmap.json for initiative titles/descriptions
 */

const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

const git = simpleGit(path.join(__dirname, '../../..'));

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
 * Returns bugs, features, regressions, etc. with deployment status
 */
async function getAllTrackedItems(limit = 200) {
    try {
        const log = await git.log({ maxCount: limit });
        const items = new Map(); // Use Map for deduplication

        // Get current deploy status
        const deployStatus = await getDeployStatus();

        for (const commit of log.all) {
            if (isDashboardCommit(commit.message)) continue;

            const ids = extractIds(commit.message);
            const shortHash = commit.hash.substring(0, 7);

            for (const idInfo of ids) {
                const existing = items.get(idInfo.id);
                if (!existing) {
                    // Determine environment status
                    const inStaging = isInEnvironment(commit, deployStatus.staging);
                    const inProd = isInEnvironment(commit, deployStatus.production);

                    // Get title from roadmap if available, otherwise use commit message
                    const roadmapTitle = getInitiativeTitle(idInfo.id);
                    const commitTitle = commit.message.split('\n')[0].substring(0, 100);

                    items.set(idInfo.id, {
                        id: idInfo.id,
                        type: idInfo.type,
                        title: roadmapTitle || commitTitle,
                        commitMessage: commitTitle,
                        hash: shortHash,
                        date: commit.date,
                        author: commit.author_name,
                        status: inProd ? 'deployed' : inStaging ? 'staging' : 'dev',
                        environments: {
                            dev: true,
                            staging: inStaging,
                            production: inProd
                        }
                    });
                }
            }

            // Also track commits without explicit IDs
            if (ids.length === 0) {
                const type = detectType(commit.message);
                if (type !== 'docs' && type !== 'chore' && type !== 'other') {
                    const inStaging = isInEnvironment(commit, deployStatus.staging);
                    const inProd = isInEnvironment(commit, deployStatus.production);

                    items.set(shortHash, {
                        id: shortHash,
                        type: type,
                        title: commit.message.split('\n')[0].substring(0, 100),
                        hash: shortHash,
                        date: commit.date,
                        author: commit.author_name,
                        status: inProd ? 'deployed' : inStaging ? 'staging' : 'dev',
                        environments: {
                            dev: true,
                            staging: inStaging,
                            production: inProd
                        }
                    });
                }
            }
        }

        return Array.from(items.values());
    } catch (error) {
        console.error('Error getting tracked items:', error.message);
        return [];
    }
}

// Check if a commit is in a specific environment
function isInEnvironment(commit, envMarker) {
    if (!envMarker || !envMarker.date) return false;
    // Commit is in environment if it's older than the deploy marker
    return new Date(commit.date) <= new Date(envMarker.date);
}

/**
 * Get deployment status from git markers
 * Uses SAME logic as envChecker.js for consistency
 */
async function getDeployStatus() {
    try {
        const log = await git.log({ maxCount: 300 });

        const status = {
            production: null,
            staging: null,
            development: { version: 'HEAD', date: new Date().toISOString() }
        };

        // First, look for standardized deploy markers
        const deployPatterns = {
            production: /deploy\(production\):\s*v?(\d+\.\d+\.\d+)/i,
            staging: /deploy\(staging\):\s*v?(\d+\.\d+\.\d+)/i
        };

        // Also look for version patterns as fallback (v1.5.5, v1.5.7, etc.)
        const prodVersion = '1.5.5';
        const stagingVersion = '1.5.7';
        let foundProdCommit = null;
        let foundStagingCommit = null;

        for (const commit of log.all) {
            const msg = commit.message;

            // Check for standardized markers first
            for (const [env, pattern] of Object.entries(deployPatterns)) {
                if (!status[env]) {
                    const match = msg.match(pattern);
                    if (match) {
                        status[env] = {
                            version: `v${match[1]}`,
                            hash: commit.hash.substring(0, 7),
                            date: commit.date,
                            message: msg.split('\n')[0]
                        };
                    }
                }
            }

            // Also look for version patterns as fallbacks
            if (!foundProdCommit && msg.includes(prodVersion)) {
                foundProdCommit = commit;
            }
            if (!foundStagingCommit && msg.includes(stagingVersion)) {
                foundStagingCommit = commit;
            }

            if (status.production && status.staging) break;
        }

        // Use fallbacks if standardized markers not found
        if (!status.production && foundProdCommit) {
            status.production = {
                version: `v${prodVersion}`,
                hash: foundProdCommit.hash.substring(0, 7),
                date: foundProdCommit.date,
                message: 'Version milestone (fallback)'
            };
        } else if (!status.production) {
            // Hardcoded fallback - use a date in the past
            status.production = { version: 'v1.5.5', date: '2026-01-15T00:00:00Z', hash: 'unknown' };
        }

        if (!status.staging && foundStagingCommit) {
            status.staging = {
                version: `v${stagingVersion}`,
                hash: foundStagingCommit.hash.substring(0, 7),
                date: foundStagingCommit.date,
                message: 'Version milestone (fallback)'
            };
        } else if (!status.staging) {
            // Hardcoded fallback
            status.staging = { version: 'v1.5.7', date: '2026-01-20T00:00:00Z', hash: 'unknown' };
        }

        return status;
    } catch (error) {
        console.error('Error getting deploy status:', error.message);
        return {
            production: { version: 'unknown', date: '1970-01-01T00:00:00Z' },
            staging: { version: 'unknown', date: '1970-01-01T00:00:00Z' },
            development: { version: 'HEAD', date: new Date().toISOString() }
        };
    }
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

module.exports = {
    getAllTrackedItems,
    getDeployStatus,
    getBugs,
    getFeatures,
    getKanbanData,
    getCommandCenterData,
    getFeatureBacklog,
    extractIds,
    detectType,
    isDashboardCommit
};
