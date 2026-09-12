import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Focused tests proving the Functions deployment configuration resolves to
 * App Check enforcement enabled for staging and production, while local
 * emulator development may remain unenforced.
 *
 * callable.ts reads GCLOUD_PROJECT / ENFORCE_APPCHECK at module load, so each
 * case imports a fresh module after setting the environment.
 */

const mockOnCall = vi.hoisted(() => vi.fn((options, handler) => ({ options, handler })));
const mockWithTracing = vi.hoisted(() => vi.fn((_name, handler) => handler));

vi.mock('firebase-functions/v2/https', () => ({
    onCall: (...args: unknown[]) => mockOnCall(...args),
}));

vi.mock('./tracing', () => ({
    withTracing: (...args: unknown[]) => mockWithTracing(...args),
}));

const ENV_KEYS = ['GCLOUD_PROJECT', 'GCP_PROJECT', 'ENFORCE_APPCHECK'] as const;

async function loadCallableWith(env: Record<string, string | undefined>) {
    vi.resetModules();
    mockOnCall.mockClear();
    for (const key of ENV_KEYS) delete process.env[key];
    for (const [key, value] of Object.entries(env)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
    return import('./callable');
}

describe('callable App Check enforcement resolution', () => {
    const saved: Record<string, string | undefined> = {};

    beforeEach(() => {
        for (const key of ENV_KEYS) saved[key] = process.env[key];
    });

    afterEach(() => {
        for (const key of ENV_KEYS) {
            if (saved[key] === undefined) delete process.env[key];
            else process.env[key] = saved[key];
        }
    });

    it('enforces App Check by default in staging', async () => {
        const { secureOnCall } = await loadCallableWith({ GCLOUD_PROJECT: 'anchor-os-staging' });
        secureOnCall(() => undefined);
        expect(mockOnCall.mock.calls[0][0].enforceAppCheck).toBe(true);
    });

    it('enforces App Check by default in production', async () => {
        const { secureOnCall } = await loadCallableWith({ GCLOUD_PROJECT: 'anchor-os' });
        secureOnCall(() => undefined);
        expect(mockOnCall.mock.calls[0][0].enforceAppCheck).toBe(true);
    });

    it('does not enforce App Check by default in local emulator development', async () => {
        const { secureOnCall } = await loadCallableWith({ GCLOUD_PROJECT: 'demo-anchor-os' });
        secureOnCall(() => undefined);
        expect(mockOnCall.mock.calls[0][0].enforceAppCheck).toBe(false);
    });

    it('honours an explicit ENFORCE_APPCHECK=true for staging', async () => {
        const { secureOnCall } = await loadCallableWith({
            GCLOUD_PROJECT: 'anchor-os-staging',
            ENFORCE_APPCHECK: 'true',
        });
        secureOnCall(() => undefined);
        expect(mockOnCall.mock.calls[0][0].enforceAppCheck).toBe(true);
    });
});
