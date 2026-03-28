// @ts-nocheck
/** Ancestry result cache for deployment status checks. */

const CACHE_TTL = 60000; // 1 minute

const ancestryCache = new Map();
let cacheTimestamp = Date.now();

function checkCacheValidity() {
    if (Date.now() - cacheTimestamp > CACHE_TTL) {
        ancestryCache.clear();
        cacheTimestamp = Date.now();
    }
}

function clearCache() {
    ancestryCache.clear();
    cacheTimestamp = Date.now();
}

module.exports = { ancestryCache, checkCacheValidity, clearCache };
