// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const docUpdater = require('./docUpdater');

describe('docUpdater sync log persistence guard', () => {
    it('does not persist no-op velocity sync events', () => {
        expect(docUpdater.shouldPersistSyncEvent('velocity', { newCompletions: 0 })).toBe(false);
    });

    it('persists velocity events when completions are detected', () => {
        expect(docUpdater.shouldPersistSyncEvent('velocity', { newCompletions: 2 })).toBe(true);
    });

    it('does not persist no-op archive sync events', () => {
        expect(docUpdater.shouldPersistSyncEvent('archive', { archivedCount: 0 })).toBe(false);
    });

    it('persists sync events when there is an error', () => {
        expect(docUpdater.shouldPersistSyncEvent('velocity', { success: false, error: 'boom' })).toBe(true);
    });

    it('persists priority sync events only when review work exists', () => {
        expect(docUpdater.shouldPersistSyncEvent('priority', { needsReview: 0 })).toBe(false);
        expect(docUpdater.shouldPersistSyncEvent('priority', { needsReview: 3 })).toBe(true);
    });
});

describe('docUpdater sync log path resolution', () => {
    it('uses runtime path by default instead of repository data path', () => {
        const resolved = docUpdater.resolveSyncLogPath({});
        expect(resolved).toContain(path.join('anchor-dashboard', 'doc_sync_log.json'));
        expect(resolved).not.toContain(path.join('tools', 'dashboard', 'data'));
    });

    it('uses explicit path when ANCHOR_DASHBOARD_SYNC_LOG_PATH is provided', () => {
        const customPath = '/tmp/custom-anchor-sync-log.json';
        const resolved = docUpdater.resolveSyncLogPath({
            ANCHOR_DASHBOARD_SYNC_LOG_PATH: customPath
        });
        expect(resolved).toBe(customPath);
    });
});
