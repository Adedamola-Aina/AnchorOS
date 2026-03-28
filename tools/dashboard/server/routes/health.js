// @ts-nocheck
'use strict';

const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const { getHealthReport } = require('../fileHealthMonitor');
const { getEnhancedKanbanBoard } = require('../docReader/index');
const { getDeduplicationStats, findDuplicates, getNextId } = require('../deduplicator');
const gitData = require('../gitDataProvider');

router.get('/api/health', async (req, res) => {
    try {
        const health = await getHealthReport();
        res.json(health);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/board', async (req, res) => {
    try {
        const data = await gitData.getKanbanData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/kanban-enhanced', async (req, res) => {
    try {
        const kanban = await getEnhancedKanbanBoard();
        res.json(kanban);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/dedup', async (req, res) => {
    try {
        const stats = await getDeduplicationStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/dedup/duplicates', async (req, res) => {
    try {
        const duplicates = await findDuplicates();
        res.json({ duplicates, count: duplicates.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/dedup/next/:prefix', async (req, res) => {
    try {
        const prefix = req.params.prefix.toUpperCase();
        const nextId = await getNextId(prefix);
        res.json({ prefix, nextId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/coverage', async (_req, res) => {
    try {
        const coveragePath = path.join(__dirname, '../../../..', 'coverage', 'coverage-final.json');

        if (!fs.existsSync(coveragePath)) {
            return res.json({
                available: false,
                message: 'No coverage data. Run: npm run test -- --run --coverage'
            });
        }

        const raw = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        const stats = fs.statSync(coveragePath);

        let totalStatements = 0, coveredStatements = 0;
        let totalBranches = 0, coveredBranches = 0;
        let totalFunctions = 0, coveredFunctions = 0;
        let totalLines = 0, coveredLines = 0;

        for (const file of Object.values(raw)) {
            // Statements
            const s = file.s || {};
            for (const count of Object.values(s)) {
                totalStatements++;
                if (count > 0) coveredStatements++;
            }
            // Branches
            const b = file.b || {};
            for (const counts of Object.values(b)) {
                for (const count of counts) {
                    totalBranches++;
                    if (count > 0) coveredBranches++;
                }
            }
            // Functions
            const f = file.f || {};
            for (const count of Object.values(f)) {
                totalFunctions++;
                if (count > 0) coveredFunctions++;
            }
            // Lines (derive from statementMap + s)
            const sm = file.statementMap || {};
            const lineSet = new Set();
            const coveredLineSet = new Set();
            for (const [key, loc] of Object.entries(sm)) {
                const line = loc.start?.line;
                if (line) {
                    lineSet.add(line);
                    if (s[key] > 0) coveredLineSet.add(line);
                }
            }
            totalLines += lineSet.size;
            coveredLines += coveredLineSet.size;
        }

        const pct = (covered, total) => total === 0 ? 100 : Math.round((covered / total) * 10000) / 100;

        const thresholds = { statements: 80, branches: 70, functions: 90, lines: 80 };
        const coverage = {
            statements: { covered: coveredStatements, total: totalStatements, pct: pct(coveredStatements, totalStatements) },
            branches: { covered: coveredBranches, total: totalBranches, pct: pct(coveredBranches, totalBranches) },
            functions: { covered: coveredFunctions, total: totalFunctions, pct: pct(coveredFunctions, totalFunctions) },
            lines: { covered: coveredLines, total: totalLines, pct: pct(coveredLines, totalLines) }
        };

        const passing = Object.entries(coverage).every(([key, val]) => val.pct >= (thresholds[key] || 0));

        res.json({
            available: true,
            generatedAt: stats.mtime.toISOString(),
            filesAnalyzed: Object.keys(raw).length,
            coverage,
            thresholds,
            passing,
            status: passing ? 'healthy' : 'below-threshold'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
