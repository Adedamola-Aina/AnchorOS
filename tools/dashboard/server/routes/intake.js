// @ts-nocheck
'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const gitData = require('../gitDataProvider');
const { findPotentialDuplicate } = require('../helpers/dedup');

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

/**
 * POST /api/intake
 * Submit a new bug/feature/enhancement request
 * Auto-generates ticket ID and adds to roadmap.json
 *
 * SINGLE SOURCE OF TRUTH: ID allocation uses gitData.getNextId() which
 * checks BOTH git history AND roadmap.json to prevent duplicate IDs.
 * This ensures IDs are never reused even if they only appear in git.
 */
router.post('/api/intake', async (req, res) => {
    try {
        const { type, title, description, priority, team } = req.body;

        // Validate required fields
        if (!type || !title || !description) {
            return res.status(400).json({
                error: 'Missing required fields: type, title, description'
            });
        }

        // Read current roadmap
        const roadmapPath = path.join(__dirname, '../roadmap.json');
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

        const prefix = prefixMap[type.toLowerCase()] || 'MISC';

        // SINGLE SOURCE OF TRUTH: Get next ID from centralized function
        // This checks BOTH git history AND roadmap.json to prevent collisions
        const newId = await gitData.getNextId(prefix);

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
router.get('/api/intake/next-id', async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({ error: 'Missing type parameter' });
        }

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
router.get('/api/intake/used-ids', async (req, res) => {
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

module.exports = router;
