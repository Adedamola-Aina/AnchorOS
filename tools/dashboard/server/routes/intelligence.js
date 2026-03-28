// @ts-nocheck
'use strict';

const router = require('express').Router();
const { publishEvent, getRecentEvents, getEventStats } = require('../eventIngestion');
const { getTrustReport } = require('../trustScorer');
const { getIntegrationStatus, ingestWebhook, syncProvider } = require('../integrationBridge');

router.get('/api/intelligence/events', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const source = req.query.source;
        const type = req.query.type;
        const events = getRecentEvents({ limit, source, type });
        const stats = getEventStats(24);
        res.json({ count: events.length, events, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/intelligence/trust', async (req, res) => {
    try {
        const trust = await getTrustReport();
        res.json(trust);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/integrations/status', (req, res) => {
    try {
        const status = getIntegrationStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/integrations/:provider/webhook', (req, res) => {
    try {
        const provider = String(req.params.provider || '').toLowerCase();
        const result = ingestWebhook(provider, req.body, {
            ip: req.ip,
            headers: req.headers,
            rawBody: req.rawBody
        });
        res.json(result);
    } catch (error) {
        const isUnauthorized = /unauthorized/i.test(error.message);
        const isConfigError = /not configured/i.test(error.message);
        const status = isUnauthorized ? 401 : (isConfigError ? 503 : 400);
        res.status(status).json({ error: error.message });
    }
});

router.post('/api/integrations/:provider/sync', async (req, res) => {
    try {
        const provider = String(req.params.provider || '').toLowerCase();
        const mode = req.body?.mode || 'dry-run';
        const items = req.body?.items || [];
        const result = await syncProvider(provider, { mode, items });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
