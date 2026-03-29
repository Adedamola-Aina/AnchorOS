// @ts-nocheck
'use strict';

const router = require('express').Router();
const { getAllDocs } = require('../docReader/index');
const { getImpactAnalysis } = require('../gitAnalyzer');
const { getPrioritySuggestions } = require('../prioritySuggester');
const { getDependencyHealth } = require('../dependencyChecker');
const { getProgressReport } = require('../progressTracker');
const { runFullSync, getSyncStatus } = require('../docUpdater');
const { publishEvent } = require('../eventIngestion');
const gitData = require('../gitDataProvider');
const { scanSecureDbCompliance } = require('../secureDbScanner');
const { scanCodeQuality } = require('../codeQualityScanner');
const { getCommitQuality } = require('../commitQualityTracker');
const { getBundleSizeReport } = require('../bundleSizeTracker');
const { getE2EResults, markAsKnown } = require('../e2eResultsReader');
const { getFunctionsCoverageSummary } = require('../functionsCoverageReader');

router.get('/api/bugs', async (req, res) => {
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

router.get('/api/features', async (req, res) => {
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

router.get('/api/docs', async (req, res) => {
    try {
        const docs = await getAllDocs();
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/roadmap', async (req, res) => {
    try {
        res.redirect('/api/git/roadmap');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/bugs/priority-suggestions', async (req, res) => {
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

router.get('/api/impact', async (req, res) => {
    try {
        const analysis = await getImpactAnalysis();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/suggestions', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const suggestions = await getPrioritySuggestions(limit);
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/dependencies', async (req, res) => {
    try {
        const health = await getDependencyHealth();
        res.json(health);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/progress', async (req, res) => {
    try {
        const progress = await getProgressReport();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/docs/sync', async (req, res) => {
    try {
        publishEvent({
            source: 'api',
            type: 'docs:sync:start',
            level: 'info',
            message: 'Manual docs sync requested'
        });
        const results = await runFullSync();
        publishEvent({
            source: 'api',
            type: 'docs:sync:complete',
            level: 'info',
            status: 'completed',
            message: 'Manual docs sync completed'
        });
        res.json(results);
    } catch (error) {
        publishEvent({
            source: 'api',
            type: 'docs:sync:failed',
            level: 'warning',
            status: 'failed',
            message: 'Manual docs sync failed',
            payload: { error: error.message }
        });
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/docs/sync/status', (req, res) => {
    try {
        const status = getSyncStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── New codebase integration endpoints ───────────────────────────────────────

/** secureDb compliance scan — P0 security rule */
router.get('/api/code-health/securedb', (req, res) => {
    try {
        const result = scanSecureDbCompliance();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** Code quality scan — console.log + any type drift */
router.get('/api/code-health/quality', (req, res) => {
    try {
        const result = scanCodeQuality();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** Commit quality metrics */
router.get('/api/code-health/commits', (req, res) => {
    try {
        const window = parseInt(req.query.window) || 50;
        const result = getCommitQuality(window);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** Bundle size history and trend */
router.get('/api/code-health/bundle', (req, res) => {
    try {
        const result = getBundleSizeReport();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** E2E test results */
router.get('/api/code-health/e2e', (req, res) => {
    try {
        const result = getE2EResults();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** Mark E2E failures as known pre-existing (POST body: { ids: string[] }) */
router.post('/api/code-health/e2e/mark-known', (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ error: 'ids must be an array' });
        }
        const result = markAsKnown(ids);
        res.json({ ok: true, knownCount: result.failures.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** Functions coverage summary */
router.get('/api/code-health/functions-coverage', (req, res) => {
    try {
        const result = getFunctionsCoverageSummary();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** Full code health dashboard — all signals in one call */
router.get('/api/code-health', (req, res) => {
    try {
        const secureDb = scanSecureDbCompliance();
        const quality = scanCodeQuality();
        const commits = getCommitQuality(50);
        const bundle = getBundleSizeReport();
        const e2e = getE2EResults();
        const funcCoverage = getFunctionsCoverageSummary();

        res.json({
            generatedAt: new Date().toISOString(),
            secureDb: {
                compliant: secureDb.violationCount === 0,
                violationCount: secureDb.violationCount,
                violations: secureDb.violations,
            },
            codeQuality: {
                consoleLogs: quality.consoleLogs,
                anyTypes: quality.anyTypes,
            },
            commitQuality: commits,
            bundleSize: bundle.available ? {
                totalKb: bundle.current.totalKb,
                trend: bundle.trend,
            } : { available: false },
            e2e: {
                status: e2e.status,
                summary: e2e.summary,
                newFailures: e2e.newFailures,
            },
            functionsCoverage: funcCoverage,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
