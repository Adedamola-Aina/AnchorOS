// @ts-nocheck
/**
 * health.js — dashboard self-health and cache refresh.
 * The only non-read endpoint is the explicit cache refresh.
 */
const express = require('express');
const { clearDashboardCache } = require('../cacheStore');
const { clearCache: clearDeploymentCache } = require('../deploymentTracker');
const gitData = require('../gitDataProvider');
const { getCoverageSummary } = require('../coverageReader');

const router = express.Router();

router.get('/api/health', async (_req, res) => {
    try {
        let coverageAvailable = false;
        try {
            const coverage = await getCoverageSummary();
            coverageAvailable = Boolean(coverage);
        } catch { /* report is optional */ }
        res.json({
            status: 'ok',
            service: 'anchoros-engineering-console',
            coverageReportAvailable: coverageAvailable,
            uptimeSeconds: Math.round(process.uptime()),
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Cache refresh only — does not mutate project/work-item state.
router.post('/api/refresh', (_req, res) => {
    try {
        clearDashboardCache();
        clearDeploymentCache();
        gitData.clearCache();
        res.json({ ok: true, refreshedAt: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

module.exports = router;
