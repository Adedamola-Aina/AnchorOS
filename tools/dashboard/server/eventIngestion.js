// @ts-nocheck

const MAX_EVENTS = 500;

let events = [];
let sequence = 0;
let heartbeatTimer = null;

function normalizeLevel(level) {
    const value = String(level || 'info').toLowerCase();
    if (value === 'critical' || value === 'warning' || value === 'info') {
        return value;
    }
    return 'info';
}

function publishEvent(input = {}) {
    const now = new Date().toISOString();
    const event = {
        id: `evt-${Date.now()}-${++sequence}`,
        timestamp: now,
        source: input.source || 'system',
        type: input.type || 'event',
        level: normalizeLevel(input.level || input.severity),
        message: input.message || input.type || 'event',
        status: input.status || 'observed',
        entityId: input.entityId || null,
        payload: input.payload || {}
    };

    events.unshift(event);
    if (events.length > MAX_EVENTS) {
        events = events.slice(0, MAX_EVENTS);
    }

    return event;
}

function getRecentEvents(options = {}) {
    const limit = Number(options.limit || 50);
    const source = options.source;
    const type = options.type;
    const since = options.since ? new Date(options.since).getTime() : null;

    return events
        .filter((event) => !source || event.source === source)
        .filter((event) => !type || event.type === type)
        .filter((event) => !since || new Date(event.timestamp).getTime() >= since)
        .slice(0, Math.max(1, Math.min(limit, 200)));
}

function getEventStats(hours = 24) {
    const cutoff = Date.now() - (Number(hours || 24) * 60 * 60 * 1000);
    const recent = events.filter((event) => new Date(event.timestamp).getTime() >= cutoff);

    const bySource = {};
    const byType = {};

    for (const event of recent) {
        bySource[event.source] = (bySource[event.source] || 0) + 1;
        byType[event.type] = (byType[event.type] || 0) + 1;
    }

    return {
        hours: Number(hours || 24),
        total: recent.length,
        bySource,
        byType,
        latestEventAt: recent[0]?.timestamp || null
    };
}

function startHeartbeat(options = {}) {
    const intervalMs = Number(options.intervalMs || 60_000);
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
    }

    heartbeatTimer = setInterval(() => {
        publishEvent({
            source: 'system',
            type: 'heartbeat',
            level: 'info',
            message: 'dashboard heartbeat',
            payload: {
                uptimeSeconds: Math.round(process.uptime())
            }
        });
    }, intervalMs);

    return heartbeatTimer;
}

function stopHeartbeat() {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }
}

function resetEvents() {
    events = [];
    sequence = 0;
}

module.exports = {
    publishEvent,
    getRecentEvents,
    getEventStats,
    startHeartbeat,
    stopHeartbeat,
    resetEvents
};
