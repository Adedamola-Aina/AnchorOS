// @ts-nocheck
'use strict';

const cache = new Map();

function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}

function setCached(key, value, ttlMs = 30_000) {
    cache.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
    });
}

function clearDashboardCache() {
    cache.clear();
}

module.exports = {
    getCached,
    setCached,
    clearDashboardCache,
};
