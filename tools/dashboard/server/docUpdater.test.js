// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

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
