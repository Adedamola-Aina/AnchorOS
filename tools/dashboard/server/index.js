/**
 * index.js
 * 
 * Express server for the Internal PM Dashboard.
 * Provides API endpoints for documentation, git analysis, and environment status.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');

const { readDoc, getAllDocs, getProjectBoard, getFeatureSuggestions, getEnhancedKanbanBoard } = require('./docReader/index');
const { getRecentCommits, getRecentCommitsFiltered, classifyCommit, getDeploymentTimeline, getRepoStats, searchBugInCommits, getImpactAnalysis } = require('./gitAnalyzer');
const { getEnvironmentStatus, checkEnvParity, checkEnvParityByGit } = require('./envChecker');
const { getPrioritySuggestions } = require('./prioritySuggester');
const { getDependencyHealth } = require('./dependencyChecker');
const { getProgressReport } = require('./progressTracker');
const { getHealthReport } = require('./fileHealthMonitor');
const { getVelocityStats, getHistoricalData, recordCompletion, predictCompletionDate, autoDetectCompletions } = require('./velocityTracker');
const { archiveOldItems, getArchivedItems, restoreItem, detectCompletedItems } = require('./archiveManager');
const { analyzeBugsFromKnownIssues, getPrioritySuggestionStats } = require('./bugPrioritizer');
const { runFullSync, getSyncStatus } = require('./docUpdater');
const { startFileWatchers, stopFileWatchers } = require('./fileWatcher');
const { watchMarkerFiles, initializeDashboardDir } = require('./conversationProcessor');
const { getCommandCenterData, getProactiveAlerts } = require('./commandCenter');
const { getDeduplicationStats, findDuplicates, getNextId } = require('./deduplicator');
const gitData = require('./gitDataProvider');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for mutation endpoints (POST/PUT/DELETE)
const mutationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,             // 30 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});
app.use((req, _res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        return mutationLimiter(req, _res, next);
    }
    next();
});

// Serve static files from client build (production)
// Assets use content-hash filenames, so they can be cached forever.
// index.html MUST NOT be cached to ensure fresh builds load immediately.
app.use(express.static(path.join(__dirname, '../client/dist'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

function normalizeForCompare(value = '') {
    return String(value)
        .toLowerCase()
        .replace(/[“”‘’`'".,!?()[\]{}:;\/\\|*_+=~]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokenize(value = '') {
    return new Set(
        normalizeForCompare(value)
            .split(' ')
            .filter((token) => token.length >= 3)
    );
}

function jaccardSimilarity(left, right) {
    if (!left.size || !right.size) return 0;
    let intersection = 0;
    for (const token of left) {
        if (right.has(token)) intersection += 1;
    }
    const union = new Set([...left, ...right]).size;
    return union === 0 ? 0 : intersection / union;
}

function extractWorkIds(text = '') {
    const matches = String(text).toUpperCase().match(/\b[A-Z]{2,6}-\d{3}\b/g);
    return new Set(matches || []);
}

function findPotentialDuplicate(initiatives, title, description) {
    const normalizedTitle = normalizeForCompare(title);
    const normalizedDescription = normalizeForCompare(description);
    const inputTokens = tokenize(title);
    const inputIds = extractWorkIds(`${title} ${description}`);

    let bestMatch = null;

    for (const item of initiatives) {
        const existingTitle = normalizeForCompare(item.title || '');
        const existingDescription = normalizeForCompare(item.description || '');
        const existingIds = extractWorkIds(`${item.id || ''} ${item.title || ''} ${item.description || ''}`);

        if (existingTitle && normalizedTitle === existingTitle) {
            return {
                id: item.id,
                title: item.title,
                reason: 'exact-title-match',
                status: item.status,
                team: item.team,
                priority: item.priority,
            };
        }

        for (const id of inputIds) {
            if (existingIds.has(id)) {
                return {
                    id: item.id,
                    title: item.title,
                    reason: `shared-id:${id}`,
                    status: item.status,
                    team: item.team,
                    priority: item.priority,
                };
            }
        }

        const titleContains = existingTitle && (
            existingTitle.includes(normalizedTitle) || normalizedTitle.includes(existingTitle)
        );

        const semanticScore = jaccardSimilarity(inputTokens, tokenize(item.title || ''));
        const sameDomain = normalizedDescription && existingDescription && (
            existingDescription.includes(normalizedDescription.substring(0, Math.min(40, normalizedDescription.length))) ||
            normalizedDescription.includes(existingDescription.substring(0, Math.min(40, existingDescription.length)))
        );

        if (titleContains || semanticScore >= 0.82 || (semanticScore >= 0.72 && sameDomain)) {
            const candidate = {
                id: item.id,
                title: item.title,
                reason: titleContains ? 'title-overlap' : `semantic-similarity:${semanticScore.toFixed(2)}`,
                score: semanticScore,
                status: item.status,
                team: item.team,
                priority: item.priority,
            };

            if (!bestMatch || candidate.score > (bestMatch.score || 0)) {
                bestMatch = candidate;
            }
        }
    }

    return bestMatch;
}

// ============ API ROUTES ============

/**
 * GET /api/status
 * Returns parsed PROJECT_STATUS.md data
 */
app.get('/api/status', async (req, res) => {
    try {
        // Redirect to Command Center - The new Single Source of Truth
        const data = await getCommandCenterData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/bugs
 * Returns parsed KNOWN_ISSUES.md data
 */
app.get('/api/bugs', async (req, res) => {
    try {
        // Source from Git (BUG-xxx)
        const bugs = await gitData.getBugs();
        res.json({
            source: 'git-automated',
            count: bugs.length,
            bugs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/roadmap
 * Returns parsed ROADMAP.md data
 */
app.get('/api/roadmap', async (req, res) => {
    try {
        // Redirect to safe, parsed git-roadmap
        res.redirect('/api/git/roadmap');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/docs
 * Returns all documentation files with freshness status
 */
app.get('/api/docs', async (req, res) => {
    try {
        const docs = await getAllDocs();
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/board
 * Returns Kanban board generated from ROADMAP.md (Single Source of Truth)
 */
app.get('/api/board', async (req, res) => {
    try {
        // Use Git-derived Kanban
        const data = await gitData.getKanbanData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/features
 * Returns parsed FEATURE_SUGGESTIONS.md (Feature Backlog)
 */
app.get('/api/features', async (req, res) => {
    try {
        const features = await gitData.getFeatures();
        res.json({
            source: 'git-automated',
            count: features.length,
            features
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/parity
 * Returns feature parity across environments
 */
app.get('/api/parity', async (req, res) => {
    try {
        const parity = await checkEnvParity();
        res.json(parity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/parity-git
 * Returns feature parity using GIT HISTORY as source of truth
 * More accurate than markdown-based parity
 */
app.get('/api/parity-git', async (req, res) => {
    try {
        const parity = await checkEnvParityByGit();
        res.json(parity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/environment
 * Returns full environment status (versions, health, parity)
 */
app.get('/api/environment', async (req, res) => {
    try {
        const status = await getEnvironmentStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/commits
 * Returns recent git commits
 */
app.get('/api/git/commits', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommits(limit);
        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/commits/anchorOS
 * Returns only Anchor OS product source commits (excludes dashboard, infra, and config-only changes)
 */
app.get('/api/git/commits/anchorOS', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommitsFiltered('anchorOS', limit);
        res.json({
            category: 'anchorOS',
            description: 'Anchor OS product source changes (src/, e2e/, public/, index.html)',
            count: commits.length,
            commits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/commits/infra
 * Returns infrastructure / config-only commits (config/, docs/, scripts/, root configs)
 */
app.get('/api/git/commits/infra', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommitsFiltered('infra', limit);
        res.json({
            category: 'infra',
            description: 'Infrastructure & config changes (config/, docs/, scripts/, root files)',
            count: commits.length,
            commits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/commits/dashboard
 * Returns only dashboard/tooling commits
 */
app.get('/api/git/commits/dashboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const commits = await getRecentCommitsFiltered('dashboard', limit);
        res.json({
            category: 'dashboard',
            description: 'Internal Dashboard & tooling changes (tools/, docs/, .agent/, etc.)',
            count: commits.length,
            commits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/timeline
 * Returns deployment timeline
 */
app.get('/api/git/timeline', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 14;
        const timeline = await getDeploymentTimeline(days);
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ GIT-BASED DATA ENDPOINTS (100% AUTOMATED) ============

/**
 * GET /api/git/bugs
 * Returns all bugs from git (BUG-XXX, REG-XXX patterns)
 */
app.get('/api/git/bugs', async (req, res) => {
    try {
        const bugs = await gitData.getBugs();
        res.json({
            source: 'git-automated',
            count: bugs.length,
            bugs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/features
 * Returns all features from git (FEAT-XXX, UX-XXX, TASK-XXX, GAP-XXX patterns)
 */
app.get('/api/git/features', async (req, res) => {
    try {
        const features = await gitData.getFeatures();
        res.json({
            source: 'git-automated',
            count: features.length,
            features
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/kanban
 * Returns Kanban board data from git (no markdown dependency)
 */
app.get('/api/git/kanban', async (req, res) => {
    try {
        const data = await gitData.getKanbanData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/command-center
 * Returns Command Center data from git (no markdown dependency)
 */
app.get('/api/git/command-center', async (req, res) => {
    try {
        const data = await gitData.getCommandCenterData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/backlog
 * Returns Feature Backlog from git (no markdown dependency)
 */
app.get('/api/git/backlog', async (req, res) => {
    try {
        const data = await gitData.getFeatureBacklog();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/changelog
 * Returns auto-generated changelog from git commits
 * Replaces manual CHANGELOG.md with git-automated data
 */
app.get('/api/git/changelog', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const data = await gitData.getChangelog(limit);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/roadmap
 * Returns Strategic Roadmap with auto-detection of completed items from git
 */
app.get('/api/git/roadmap', async (req, res) => {
    try {
        const fs = require('fs');
        const roadmapPath = path.join(__dirname, 'roadmap.json');
        const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

        // Get all git commits for pattern matching
        const commits = await getRecentCommits(500);
        const commitMessages = commits.map(c => c.message.toLowerCase());

        // Auto-detect status based on git history
        // IMPORTANT: Only detect completion if the EXACT ID appears in a commit message
        // Generic keyword matching caused massive false positives (e.g., "mobile" matching all mobile commits)
        // Also skip revert/remove commits — those indicate feature was rolled back, not completed
        const enrichedInitiatives = roadmapData.initiatives.map(item => {
            // If already marked completed or deferred, keep it (don't auto-detect)
            if (item.status === 'completed' || item.status === 'deferred') {
                return { ...item, detectedFromGit: false };
            }

            // Only check for the exact ID (first pattern is always the ID)
            // This prevents false positives from generic keywords like "mobile", "error", "transfer"
            const itemId = item.id.toLowerCase();
            const matchedCommits = [];

            for (let i = 0; i < commits.length; i++) {
                const msg = commitMessages[i];
                // Skip revert/remove commits — they indicate rollback, not completion
                if (msg.includes('revert') || msg.includes('remove')) {
                    continue;
                }
                // Require the exact ID to appear in the commit message
                // e.g., "fix: BUG-043 resolve autofill issue" must contain "bug-043"
                if (msg.includes(itemId)) {
                    matchedCommits.push({
                        hash: commits[i].hash,
                        message: commits[i].message,
                        date: commits[i].date
                    });
                    break; // One match is enough
                }
            }

            // If we found a commit with the exact ID, mark as completed
            if (matchedCommits.length > 0) {
                return {
                    ...item,
                    status: 'completed',
                    detectedFromGit: true,
                    matchedCommits: matchedCommits
                };
            }

            return { ...item, detectedFromGit: false };
        });

        // Calculate summary stats
        const completed = enrichedInitiatives.filter(i => i.status === 'completed');
        const inProgress = enrichedInitiatives.filter(i => i.status === 'in-progress');
        const planned = enrichedInitiatives.filter(i => i.status === 'planned');

        // Group by priority
        const byPriority = {
            P0: enrichedInitiatives.filter(i => i.priority === 'P0'),
            P1: enrichedInitiatives.filter(i => i.priority === 'P1'),
            P2: enrichedInitiatives.filter(i => i.priority === 'P2'),
            P3: enrichedInitiatives.filter(i => i.priority === 'P3')
        };

        // Group by team
        const teams = [...new Set(enrichedInitiatives.map(i => i.team))];
        const byTeam = {};
        teams.forEach(team => {
            byTeam[team] = enrichedInitiatives.filter(i => i.team === team);
        });

        res.json({
            source: 'roadmap.json + git-automated',
            lastUpdated: roadmapData.lastUpdated,
            version: roadmapData.version,
            summary: {
                total: enrichedInitiatives.length,
                completed: completed.length,
                inProgress: inProgress.length,
                planned: planned.length,
                autoDetected: enrichedInitiatives.filter(i => i.detectedFromGit).length
            },
            byPriority,
            byTeam,
            teams: teams.sort(),
            initiatives: enrichedInitiatives
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/intake
 * Submit a new bug/feature/enhancement request
 * Auto-generates ticket ID and adds to roadmap.json
 * 
 * SINGLE SOURCE OF TRUTH: ID allocation uses gitData.getNextId() which
 * checks BOTH git history AND roadmap.json to prevent duplicate IDs.
 * This ensures IDs are never reused even if they only appear in git.
 */
app.post('/api/intake', async (req, res) => {
    try {
        const fs = require('fs');
        const { type, title, description, priority, team } = req.body;

        // Validate required fields
        if (!type || !title || !description) {
            return res.status(400).json({
                error: 'Missing required fields: type, title, description'
            });
        }

        // Read current roadmap
        const roadmapPath = path.join(__dirname, 'roadmap.json');
        const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

        // End-to-end duplicate prevention:
        // 1) exact title
        // 2) shared work IDs (e.g., REM-001 / GAP-005)
        // 3) semantic near-duplicate title/description matching
        const duplicate = findPotentialDuplicate(roadmapData.initiatives || [], title, description);
        if (duplicate) {
            return res.status(409).json({
                error: 'Potential duplicate initiative detected',
                duplicate
            });
        }

        // Determine prefix based on type
        const prefixMap = {
            'bug': 'BUG',
            'reg': 'REG',
            'regression': 'REG',
            'feature': 'FIN',
            'gap': 'GAP',
            'ux': 'UX',
            'enhancement': 'UX',
            'architecture': 'ARCH',
            'security': 'SEC',
            'devops': 'SRE',
            'product': 'PRD',
            'design': 'DES',
            'mobile': 'PWA',
            'auth': 'AUTH',
            'database': 'DB',
            'qa': 'QA',
            'other': 'MISC'
        };

        const prefix = prefixMap[type.toLowerCase()] || 'MISC';

        // SINGLE SOURCE OF TRUTH: Get next ID from centralized function
        // This checks BOTH git history AND roadmap.json to prevent collisions
        const newId = await gitData.getNextId(prefix);

        // Determine team based on type if not provided
        const teamMap = {
            'bug': 'Engineering',
            'feature': 'Product',
            'enhancement': 'Design',
            'architecture': 'Architecture',
            'security': 'Security',
            'devops': 'DevOps',
            'product': 'Product',
            'design': 'Design',
            'mobile': 'Mobile',
            'auth': 'Auth',
            'database': 'Database',
            'qa': 'QA',
            'other': 'Engineering'
        };

        const assignedTeam = team || teamMap[type.toLowerCase()] || 'Engineering';
        const assignedPriority = priority || 'P1';

        // Detection pattern: ONLY the exact ID
        // Generic keywords caused massive false positives (53 items falsely marked complete)
        // Auto-detection now requires exact ID match in commit messages
        const detectionPatterns = [newId];

        // Create new initiative
        const newInitiative = {
            id: newId,
            team: assignedTeam,
            priority: assignedPriority,
            title: title,
            description: description,
            status: 'planned',
            detectionPatterns: detectionPatterns,
            effort: 'medium',
            impact: 'medium',
            createdAt: new Date().toISOString().split('T')[0]
        };

        // Add to roadmap
        roadmapData.initiatives.unshift(newInitiative);
        roadmapData.lastUpdated = new Date().toISOString().split('T')[0];

        // Write back to file
        fs.writeFileSync(roadmapPath, JSON.stringify(roadmapData, null, 4));

        res.json({
            success: true,
            message: `Created ${newId}`,
            ticket: newInitiative
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/intake/next-id
 * Preview what the next ID would be for a given type
 * Uses SINGLE SOURCE OF TRUTH: checks both git history AND roadmap.json
 */
app.get('/api/intake/next-id', async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({ error: 'Missing type parameter' });
        }

        const prefixMap = {
            'bug': 'BUG',
            'reg': 'REG',
            'regression': 'REG',
            'feature': 'FIN',
            'gap': 'GAP',
            'ux': 'UX',
            'enhancement': 'UX',
            'architecture': 'ARCH',
            'security': 'SEC',
            'devops': 'SRE',
            'product': 'PRD',
            'design': 'DES',
            'mobile': 'PWA',
            'auth': 'AUTH',
            'database': 'DB',
            'qa': 'QA',
            'other': 'MISC'
        };

        const prefix = prefixMap[type.toLowerCase()] || 'MISC';

        // SINGLE SOURCE OF TRUTH: Uses centralized ID allocation
        const nextId = await gitData.getNextId(prefix);

        res.json({ type, prefix, nextId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/intake/used-ids
 * Returns ALL used IDs across git history AND roadmap.json
 * This is the SINGLE SOURCE OF TRUTH for ID allocation visibility
 */
app.get('/api/intake/used-ids', async (req, res) => {
    try {
        const usedIds = await gitData.getAllUsedIds();
        
        // Convert Sets to sorted arrays for JSON serialization
        const result = {};
        for (const [prefix, numbers] of Object.entries(usedIds)) {
            result[prefix] = Array.from(numbers).sort((a, b) => a - b);
        }
        
        res.json({
            source: 'git + roadmap.json',
            description: 'All IDs used in git history OR roadmap.json - these cannot be reused',
            usedIds: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/all-items
 * Returns all tracked items from git
 */
app.get('/api/git/all-items', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 200;
        const items = await gitData.getAllTrackedItems(limit);
        res.json({
            source: 'git-automated',
            count: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/dedup
 * Returns deduplication statistics and health
 */
app.get('/api/dedup', async (req, res) => {
    try {
        const stats = await getDeduplicationStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/dedup/duplicates
 * Returns all duplicates found
 */
app.get('/api/dedup/duplicates', async (req, res) => {
    try {
        const duplicates = await findDuplicates();
        res.json({ duplicates, count: duplicates.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/dedup/next/:prefix
 * Returns next available ID for a prefix (e.g., /api/dedup/next/BUG -> BUG-025)
 */
app.get('/api/dedup/next/:prefix', async (req, res) => {
    try {
        const prefix = req.params.prefix.toUpperCase();
        const nextId = await getNextId(prefix);
        res.json({ prefix, nextId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/kanban-enhanced
 * Returns enhanced Kanban board with bugs + features merged
 */
app.get('/api/kanban-enhanced', async (req, res) => {
    try {
        const kanban = await getEnhancedKanbanBoard();
        res.json(kanban);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/stats
 * Returns repo stats (branch, status, last commit)
 */
app.get('/api/git/stats', async (req, res) => {
    try {
        const stats = await getRepoStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/git/search/:bugId
 * Search for bug ID in commit history
 */
app.get('/api/git/search/:bugId', async (req, res) => {
    try {
        const commits = await searchBugInCommits(req.params.bugId);
        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/impact
 * Returns impact analysis for recent changes
 */
app.get('/api/impact', async (req, res) => {
    try {
        const analysis = await getImpactAnalysis();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/suggestions
 * Returns prioritized "What to Build Next" suggestions
 */
app.get('/api/suggestions', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const suggestions = await getPrioritySuggestions(limit);
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/dependencies
 * Returns dependency health report (outdated packages + security)
 */
app.get('/api/dependencies', async (req, res) => {
    try {
        const health = await getDependencyHealth();
        res.json(health);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/progress
 * Returns task progress from ROADMAP.md markers
 */
app.get('/api/progress', async (req, res) => {
    try {
        const progress = await getProgressReport();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/health
 * Returns file health report (200-line warnings) and anomaly detection
 */
app.get('/api/health', async (req, res) => {
    try {
        const health = await getHealthReport();
        res.json(health);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/command-center
 * Returns unified dashboard data - single source of truth for everything
 * Like Google's internal dashboards - one view of all project health
 */
app.get('/api/command-center', async (req, res) => {
    try {
        const data = await getCommandCenterData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/alerts
 * Returns proactive alerts - things that need attention
 */
app.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await getProactiveAlerts();
        res.json({
            count: alerts.length,
            critical: alerts.filter(a => a.severity === 'critical').length,
            warning: alerts.filter(a => a.severity === 'warning').length,
            info: alerts.filter(a => a.severity === 'info').length,
            items: alerts,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/velocity/stats
 * Returns current velocity statistics
 */
app.get('/api/velocity/stats', (req, res) => {
    try {
        const stats = getVelocityStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/velocity/history
 * Returns historical velocity data for charts
 */
app.get('/api/velocity/history', (req, res) => {
    try {
        const weeks = parseInt(req.query.weeks) || 12;
        const history = getHistoricalData(weeks);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/velocity/record
 * Manually record a completion
 */
app.post('/api/velocity/record', (req, res) => {
    try {
        const { itemId, completedDate, startDate } = req.body;

        if (!itemId || !completedDate) {
            return res.status(400).json({ error: 'itemId and completedDate are required' });
        }

        const completion = recordCompletion(itemId, completedDate, startDate);
        res.json({ success: true, completion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/velocity/predict
 * Predict completion date based on remaining items
 */
app.post('/api/velocity/predict', (req, res) => {
    try {
        const { remainingItems } = req.body;

        if (!remainingItems || remainingItems <= 0) {
            return res.status(400).json({ error: 'remainingItems must be a positive number' });
        }

        const prediction = predictCompletionDate(remainingItems);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/velocity/auto-detect
 * Auto-detect completions from git-tracked deployed items
 */
app.post('/api/velocity/auto-detect', async (req, res) => {
    try {
        const newCompletions = await autoDetectCompletions();
        res.json({ success: true, newCompletions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/archive/items
 * List archived items
 */
app.get('/api/archive/items', (req, res) => {
    try {
        const items = getArchivedItems();
        res.json({ items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/archive/run
 * Manually trigger archival
 */
app.post('/api/archive/run', (req, res) => {
    try {
        const { daysThreshold, dryRun } = req.body;
        const result = archiveOldItems(daysThreshold || 30, dryRun || false);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/archive/restore/:itemId
 * Restore item from archive to roadmap
 */
app.post('/api/archive/restore', (req, res) => {
    try {
        const { itemText } = req.body;

        if (!itemText) {
            return res.status(400).json({ error: 'itemText is required' });
        }

        const result = restoreItem(itemText);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/archive/preview
 * Preview items that would be archived
 */
app.get('/api/archive/preview', (req, res) => {
    try {
        const daysThreshold = parseInt(req.query.days) || 30;
        const result = archiveOldItems(daysThreshold, true); // dry run
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/bugs/priority-suggestions
 * Returns priority suggestions for all bugs (git-automated)
 */
app.get('/api/bugs/priority-suggestions', async (req, res) => {
    try {
        const bugs = await gitData.getBugs();
        // Map git bugs to priority suggestion format
        const suggestions = bugs.map(bug => ({
            id: bug.id,
            title: bug.title,
            currentStatus: bug.status,
            suggestedPriority: bug.status === 'dev' ? 'P0' : bug.status === 'staging' ? 'P1' : 'P2',
            reason: bug.status === 'deployed' ? 'Already deployed' : `Pending deploy (${bug.status})`
        }));
        const stats = {
            total: suggestions.length,
            deployed: bugs.filter(b => b.status === 'deployed').length,
            pending: bugs.filter(b => b.status !== 'deployed').length
        };

        res.json({ source: 'git-automated', suggestions, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/docs/sync
 * Manually trigger full documentation sync
 */
app.post('/api/docs/sync', async (req, res) => {
    try {
        const results = await runFullSync();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/docs/sync/status
 * Get sync status and history
 */
app.get('/api/docs/sync/status', (req, res) => {
    try {
        const status = getSyncStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/summary
 * Returns combined dashboard summary (git-automated)
 */
app.get('/api/summary', async (req, res) => {
    try {
        const [kanban, bugs, features, parity, repoStats] = await Promise.all([
            gitData.getKanbanData(),
            gitData.getBugs(),
            gitData.getFeatures(),
            checkEnvParity(),
            getRepoStats()
        ]);

        res.json({
            source: 'git-automated',
            kanban: kanban.summary,
            bugs: { count: bugs.length, bugs: bugs.slice(0, 10) },
            features: { count: features.length, features: features.slice(0, 10) },
            parity: parity.summary,
            git: repoStats,
            lastRefresh: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/refresh
 * Trigger manual data refresh - clears all caches
 */
app.post('/api/refresh', (req, res) => {
    try {
        const deploymentTracker = require('./deploymentTracker');
        // Clear deployment tracker ancestry cache
        deploymentTracker.clearCache();
        // Clear git data provider items cache
        gitData.clearCache();
        res.json({
            success: true,
            message: 'All caches cleared',
            clearedCaches: ['deploymentTracker', 'gitDataProvider'],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Catch-all route - serve index.html for client-side routing
 * Must set no-cache to prevent browsers from caching stale builds
 */
app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

/**
 * Schedule daily archival at 2 AM
 */
cron.schedule('0 2 * * *', () => {
    console.log('[CRON] Running daily archival...');
    try {
        const result = archiveOldItems(30, false);
        console.log(`[CRON] Archival complete: ${result.message}`);
    } catch (error) {
        console.error('[CRON] Archival failed:', error.message);
    }
});

/**
 * Schedule hourly velocity auto-detection from git
 */
cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Running hourly velocity auto-detect...');
    try {
        const newCompletions = await autoDetectCompletions();
        console.log(`[CRON] Auto-detect complete: ${newCompletions} new completions recorded`);
    } catch (error) {
        console.error('[CRON] Auto-detect failed:', error.message);
    }
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  🚀 Anchor OS PM Dashboard                     ║
║                                                                ║
║  📊 Dashboard: http://localhost:${PORT}                        ║
║  🔄 Auto-refresh: Enabled                                      ║
║  📁 Data Source: Git History + roadmap.json (auto-detected)    ║
║                                                                ║
║  ⚡ Features:                                                   ║
║     • Git-Based Tracking (zero manual maintenance)            ║
║     • Deployment Ancestry (git merge-base)                    ║
║     • Velocity Auto-Detect (from git deploys)                 ║
║     • Auto-Archive (daily at 2 AM)                            ║
║     • Environment Parity (3-env tracking)                     ║
╚════════════════════════════════════════════════════════════════╝
    `);

    // Start file watchers for real-time updates
    startFileWatchers();

    // Start conversation processor for AI-detected bugs/features
    initializeDashboardDir();
    watchMarkerFiles((type, result) => {
        console.log(`[CONVERSATION AI] Auto-filed ${result.processed} ${type}, skipped ${result.skipped} duplicates`);
        // Trigger full sync after filing
        runFullSync().catch(err => console.error('[CONVERSATION AI] Sync failed:', err.message));
    });
    // Signal PM2 that we're ready
    if (process.send) {
        process.send('ready');
    }
});

// Handle port in use error
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error('   Run: lsof -ti:3001 | xargs kill -9');
        console.error('   Then restart the dashboard.');
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n[SHUTDOWN] Received SIGTERM, shutting down gracefully...');
    stopFileWatchers();
    server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n[SHUTDOWN] Received SIGINT, shutting down gracefully...');
    stopFileWatchers();
    server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
    });
});
