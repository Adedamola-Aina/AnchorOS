// @ts-nocheck
'use strict';

const cron = require('node-cron');

function setupCrons({ archiveOldItems, autoDetectCompletions, publishEvent }) {
    /**
     * Schedule daily archival at 2 AM
     */
    cron.schedule('0 2 * * *', () => {
        console.log('[CRON] Running daily archival...');
        try {
            const result = archiveOldItems(30, false);
            console.log(`[CRON] Archival complete: ${result.message}`);
            publishEvent({
                source: 'cron',
                type: 'archive:daily',
                level: 'info',
                status: 'completed',
                message: 'Daily archival completed',
                payload: { archivedCount: result.archivedCount || 0 }
            });
        } catch (error) {
            console.error('[CRON] Archival failed:', error.message);
            publishEvent({
                source: 'cron',
                type: 'archive:daily',
                level: 'warning',
                status: 'failed',
                message: 'Daily archival failed',
                payload: { error: error.message }
            });
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
            publishEvent({
                source: 'cron',
                type: 'velocity:auto-detect',
                level: 'info',
                status: 'completed',
                message: 'Velocity auto-detect completed',
                payload: { newCompletions }
            });
        } catch (error) {
            console.error('[CRON] Auto-detect failed:', error.message);
            publishEvent({
                source: 'cron',
                type: 'velocity:auto-detect',
                level: 'warning',
                status: 'failed',
                message: 'Velocity auto-detect failed',
                payload: { error: error.message }
            });
        }
    });
}

module.exports = { setupCrons };
