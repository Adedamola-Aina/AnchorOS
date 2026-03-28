// @ts-nocheck
'use strict';

const router = require('express').Router();
const { archiveOldItems, getArchivedItems, restoreItem } = require('../archiveManager');

router.get('/api/archive/items', (req, res) => {
    try {
        const items = getArchivedItems();
        res.json({ items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/archive/run', (req, res) => {
    try {
        const { daysThreshold, dryRun } = req.body;
        const result = archiveOldItems(daysThreshold || 30, dryRun || false);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/archive/restore', (req, res) => {
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

router.get('/api/archive/preview', (req, res) => {
    try {
        const daysThreshold = parseInt(req.query.days) || 30;
        const result = archiveOldItems(daysThreshold, true); // dry run
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
