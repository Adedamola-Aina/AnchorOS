/**
 * Telemetry service — trace, logEvent, createTracer
 * Target: 90%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/react';

vi.mock('@sentry/react', () => ({
    addBreadcrumb: vi.fn(),
}));

// We need to control import.meta.env.DEV
// By default in vitest environment DEV=true

import { trace, logEvent, logProductEvent, createTracer } from './index';

describe('trace', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns the result of the traced function', async () => {
        const result = await trace('op', () => 42);
        expect(result).toBe(42);
    });

    it('returns result from async function', async () => {
        const result = await trace('async-op', async () => {
            await new Promise(r => setTimeout(r, 5));
            return 'done';
        });
        expect(result).toBe('done');
    });

    it('re-throws errors from traced function', async () => {
        await expect(
            trace('fail-op', () => { throw new Error('boom'); })
        ).rejects.toThrow('boom');
    });

    it('adds Sentry breadcrumb on failure', async () => {
        try {
            await trace('fail-op', () => { throw new Error('fail'); });
        } catch { /* expected */ }

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            category: 'trace',
            level: 'error',
            data: expect.objectContaining({ error: 'fail' }),
        }));
    });

    it('passes attributes through to breadcrumbs on error', async () => {
        try {
            await trace('fail-op', () => { throw new Error('x'); }, { attributes: { key: 'val' } });
        } catch { /* expected */ }

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ key: 'val' }),
        }));
    });

    it('handles non-Error thrown values', async () => {
        try {
            await trace('fail-op', () => { throw 'string-error'; });
        } catch { /* expected */ }

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ error: 'Unknown error' }),
        }));
    });
});

describe('logEvent', () => {
    beforeEach(() => vi.clearAllMocks());

    it('sends Sentry breadcrumb for info event', () => {
        logEvent('user.click', { level: 'info', attributes: { btn: 'save' } });

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            category: 'event',
            message: 'user.click',
            level: 'info',
            data: { btn: 'save' },
        }));
    });

    it('maps error level correctly', () => {
        logEvent('crash', { level: 'error' });

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            level: 'error',
        }));
    });

    it('maps warn level to warning', () => {
        logEvent('slow', { level: 'warn' });

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            level: 'warning',
        }));
    });

    it('defaults to info level', () => {
        logEvent('plain');

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            level: 'info',
        }));
    });
});

describe('createTracer', () => {
    beforeEach(() => vi.clearAllMocks());

    it('prefixes operation name with feature name', async () => {
        const tracer = createTracer('Finance');
        const result = await tracer.trace('load', () => 'ok');
        expect(result).toBe('ok');
    });

    it('prefixes event name with feature name', () => {
        const tracer = createTracer('Auth');
        tracer.logEvent('login');

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Auth.login',
        }));
    });

    it('propagates trace errors with scoped name', async () => {
        const tracer = createTracer('Tasks');
        try {
            await tracer.trace('save', () => { throw new Error('fail'); });
        } catch { /* expected */ }

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('Tasks.save'),
        }));
    });
});

describe('logProductEvent', () => {
    beforeEach(() => vi.clearAllMocks());

    it('logs validated product events with product prefix', () => {
        logProductEvent('onboarding_started', { source: 'new_user' });

        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
            category: 'event',
            message: 'product.onboarding_started',
            data: { source: 'new_user' },
        }));
    });

    it('throws for invalid contract payload', () => {
        expect(() => logProductEvent('onboarding_completed', { durationMs: -1 })).toThrow();
    });
});
