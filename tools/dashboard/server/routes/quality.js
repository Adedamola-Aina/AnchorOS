// @ts-nocheck
/**
 * quality.js — consolidated engineering quality telemetry.
 * Read-only snapshots: coverage, dependencies, secureDb compliance, code
 * quality, bundle size, E2E results, Functions coverage. Missing generated
 * reports are surfaced as unavailable, never as pass/fail.
 */
const express = require('express');
const { getCoverageSummary } = require('../coverageReader');
const { getFunctionsCoverageSummary } = require('../functionsCoverageReader');
const { getDependencyHealth } = require('../dependencyChecker');
const { scanSecureDbCompliance } = require('../secureDbScanner');
const { scanCodeQuality } = require('../codeQualityScanner');
const { getBundleSizeReport } = require('../bundleSizeTracker');
const { getE2EResults } = require('../e2eResultsReader');

const router = express.Router();

function snapshot(promise) {
    return Promise.resolve(promise)
        .then((data) => (data && typeof data === 'object' && !Array.isArray(data)
            ? { ...data, available: data.available !== false }
            : { available: true, data }))
        .catch((error) => ({ available: false, error: error.message }));
}

router.get('/api/coverage', async (_req, res) => {
    try {
        const [app, functions] = await Promise.all([
            snapshot(getCoverageSummary()),
            snapshot(getFunctionsCoverageSummary())
        ]);
        res.json({ app, functions, generatedAt: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/dependencies', async (_req, res) => {
    try {
        res.json(await getDependencyHealth());
    } catch (error) {
        res.status(500).json({ available: false, error: error.message });
    }
});

router.get('/api/code-health', async (_req, res) => {
    try {
        const [secureDb, quality, bundle, e2e] = await Promise.all([
            snapshot(scanSecureDbCompliance()),
            snapshot(scanCodeQuality()),
            snapshot(getBundleSizeReport()),
            snapshot(getE2EResults())
        ]);
        res.json({ secureDb, quality, bundle, e2e, generatedAt: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/quality', async (_req, res) => {
    try {
        const [coverage, dependencies, secureDb, quality, bundle, e2e, functionsCoverage] = await Promise.all([
            snapshot(getCoverageSummary()),
            snapshot(getDependencyHealth()),
            snapshot(scanSecureDbCompliance()),
            snapshot(scanCodeQuality()),
            snapshot(getBundleSizeReport()),
            snapshot(getE2EResults()),
            snapshot(getFunctionsCoverageSummary())
        ]);
        res.json({
            coverage,
            functionsCoverage,
            dependencies,
            secureDb,
            quality,
            bundle,
            e2e,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
