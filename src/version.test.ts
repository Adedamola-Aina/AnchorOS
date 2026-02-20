/**
 * version.test.ts — TDD tests for the version module
 *
 * RED phase: These tests define the contract that src/version.ts must satisfy.
 * __APP_VERSION__ and __APP_ENV__ are injected by Vite's define block.
 * In the test environment, vitest globals via vite config define them.
 */
import { describe, it, expect } from 'vitest';
import { APP_VERSION, APP_ENV, getDisplayVersion } from './version';

describe('version module', () => {
    it('APP_VERSION is a non-empty string', () => {
        expect(typeof APP_VERSION).toBe('string');
        expect(APP_VERSION.length).toBeGreaterThan(0);
    });

    it('APP_VERSION is a valid semver string', () => {
        // Matches: 1.7.7, 1.8.0-dev.3, 1.8.0-rc.1
        const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+(\.\d+)?)?$/;
        expect(APP_VERSION).toMatch(semverPattern);
    });

    it('APP_ENV is one of development, staging, or production', () => {
        expect(['development', 'staging', 'production']).toContain(APP_ENV);
    });

    it('getDisplayVersion() returns format "v{semver} ({env})"', () => {
        const display = getDisplayVersion();
        expect(display).toMatch(/^v\d+\.\d+\.\d+(-[a-zA-Z0-9]+(\.\d+)?)? \((development|staging|production)\)$/);
    });

    it('getDisplayVersion() includes both version and env', () => {
        const display = getDisplayVersion();
        expect(display).toContain(APP_VERSION);
        expect(display).toContain(APP_ENV);
    });
});
