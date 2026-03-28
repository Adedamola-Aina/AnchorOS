// @ts-nocheck
/**
 * envChecker.js
 *
 * Shim — re-exports all symbols from envCheckerCore.js and envCheckerHealth.js
 * so existing consumers of require('./envChecker') continue to work unchanged.
 * Logic split per ARCH-001 (≤200 lines per file).
 */

const core = require('./envCheckerCore');
const health = require('./envCheckerHealth');

module.exports = {
    ...core,
    ...health
};
