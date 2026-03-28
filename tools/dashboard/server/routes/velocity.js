// @ts-nocheck
'use strict';

const router = require('express').Router();
const { getVelocityStats, getHistoricalData, recordCompletion, predictCompletionDate, autoDetectCompletions } = require('../velocityTracker');

router.get('/api/velocity/stats', (req, res) => {
    try {
        const stats = getVelocityStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/velocity/history', (req, res) => {
    try {
        const weeks = parseInt(req.query.weeks) || 12;
        const history = getHistoricalData(weeks);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/velocity/record', (req, res) => {
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

router.post('/api/velocity/predict', (req, res) => {
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

router.post('/api/velocity/auto-detect', async (req, res) => {
    try {
        const newCompletions = await autoDetectCompletions();
        res.json({ success: true, newCompletions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
