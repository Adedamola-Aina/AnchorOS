// @ts-nocheck
import { describe, it, expect, beforeEach } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const eventIngestion = require('./eventIngestion');

describe('eventIngestion', () => {
    beforeEach(() => {
        eventIngestion.resetEvents();
        eventIngestion.stopHeartbeat();
    });

    it('stores events and filters by source', () => {
        eventIngestion.publishEvent({ source: 'watcher', type: 'file:changed', message: 'roadmap changed' });
        eventIngestion.publishEvent({ source: 'api', type: 'refresh', message: 'manual refresh' });

        const watcherEvents = eventIngestion.getRecentEvents({ source: 'watcher' });
        expect(watcherEvents).toHaveLength(1);
        expect(watcherEvents[0].type).toBe('file:changed');
    });

    it('builds event stats for the configured window', () => {
        eventIngestion.publishEvent({ source: 'cron', type: 'archive:daily', message: 'done' });
        eventIngestion.publishEvent({ source: 'cron', type: 'archive:daily', message: 'done again' });
        eventIngestion.publishEvent({ source: 'watcher', type: 'git:changed', message: 'git changed' });

        const stats = eventIngestion.getEventStats(24);
        expect(stats.total).toBe(3);
        expect(stats.bySource.cron).toBe(2);
        expect(stats.byType['archive:daily']).toBe(2);
    });
});
