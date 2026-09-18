// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHmac } from 'node:crypto';

/**
 * FI-01 / FI-02 contract tests:
 *  - the HMAC is verified over the raw bytes (not a re-serialized body)
 *  - an event is claimed before handling, marked processed only on success, and
 *    released on failure so Mono's retry converges instead of being dropped
 */
const mockState = vi.hoisted(() => ({
    store: new Map<string, Record<string, unknown>>(),
    handleAccountUpdated: vi.fn(),
    handleReauthorisation: vi.fn(),
}));

vi.mock('firebase-functions', () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Invoke the handler directly: the real onRequest wrapper expects an Express
// response stream (`res.on`) which this unit test does not need.
vi.mock('firebase-functions/v2/https', () => ({
    onRequest: (_options: unknown, handler: unknown) =>
        typeof _options === 'function' ? _options : handler,
}));

vi.mock('./config', () => {
    const docApi = (id: string) => ({
        id,
        set: async (data: Record<string, unknown>, opts?: { merge?: boolean }) => {
            mockState.store.set(
                id,
                opts?.merge ? { ...(mockState.store.get(id) ?? {}), ...data } : data,
            );
        },
        delete: async () => {
            mockState.store.delete(id);
        },
    });

    const db = {
        collection: () => ({ doc: (id: string) => docApi(id) }),
        runTransaction: async (fn: (txn: unknown) => unknown) =>
            fn({
                get: async (ref: { id: string }) => ({
                    exists: mockState.store.has(ref.id),
                    data: () => mockState.store.get(ref.id),
                }),
                set: (ref: { id: string }, data: Record<string, unknown>) => {
                    mockState.store.set(ref.id, data);
                },
            }),
    };

    return { db, APP_ID: 'anchor-os' };
});

vi.mock('./webhookHandlers', () => ({
    handleAccountUpdated: (...args: unknown[]) => mockState.handleAccountUpdated(...args),
    handleReauthorisation: (...args: unknown[]) => mockState.handleReauthorisation(...args),
}));

import { monoWebhook, verifySignature, eventFingerprint } from './bankWebhook';

const SECRET = 'webhook-test-secret';
const RAW = '{"event":"account_updated",   "data":{"account":{"_id":"mono-acc-1"}}}';

function signedRequest(raw = RAW) {
    const signature = createHmac('sha512', SECRET).update(Buffer.from(raw)).digest('hex');
    return {
        method: 'POST',
        rawBody: Buffer.from(raw),
        headers: { 'mono-webhook-secret': signature },
        body: JSON.parse(raw),
    };
}

function mockResponse() {
    const res: Record<string, unknown> = { statusCode: undefined, body: undefined };
    res.status = vi.fn((code: number) => { res.statusCode = code; return res; });
    res.json = vi.fn((payload: unknown) => { res.body = payload; return res; });
    res.send = vi.fn((payload: unknown) => { res.body = payload; return res; });
    return res as never;
}

describe('monoWebhook', () => {
    beforeEach(() => {
        mockState.store.clear();
        vi.clearAllMocks();
        process.env.MONO_WEBHOOK_SECRET = SECRET;
        mockState.handleAccountUpdated.mockResolvedValue(undefined);
    });

    it('verifies the signature over raw bytes (FI-02)', () => {
        const raw = Buffer.from(RAW);
        const signature = createHmac('sha512', SECRET).update(raw).digest('hex');

        expect(verifySignature(raw, signature)).toBe(true);

        // Regression: the old implementation signed JSON.stringify(req.body),
        // which strips the padding and therefore never matched.
        const reserialized = Buffer.from(JSON.stringify(JSON.parse(RAW)));
        expect(reserialized.equals(raw)).toBe(false);
        expect(verifySignature(reserialized, signature)).toBe(false);
    });

    it('rejects a request with an invalid signature', async () => {
        const res = mockResponse();
        const req = { ...signedRequest(), headers: { 'mono-webhook-secret': 'deadbeef' } };

        await monoWebhook(req as never, res);

        expect(res.statusCode).toBe(401);
        expect(mockState.handleAccountUpdated).not.toHaveBeenCalled();
        expect(mockState.store.size).toBe(0);
    });

    it('claims, handles and marks the event processed', async () => {
        const res = mockResponse();

        await monoWebhook(signedRequest() as never, res);

        expect(mockState.handleAccountUpdated).toHaveBeenCalledWith('mono-acc-1');
        expect(res.statusCode).toBe(200);
        expect(mockState.store.get(eventFingerprint(Buffer.from(RAW)))).toMatchObject({
            status: 'processed',
        });
    });

    it('releases the claim when handling fails so a retry converges (FI-01)', async () => {
        mockState.handleAccountUpdated.mockRejectedValueOnce(new Error('downstream down'));
        const res = mockResponse();

        await monoWebhook(signedRequest() as never, res);

        expect(res.statusCode).toBe(500);
        expect(mockState.store.has(eventFingerprint(Buffer.from(RAW)))).toBe(false);
    });

    it('rejects a duplicate delivery without re-handling', async () => {
        mockState.store.set(eventFingerprint(Buffer.from(RAW)), { status: 'processed' });
        const res = mockResponse();

        await monoWebhook(signedRequest() as never, res);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({ duplicate: true });
        expect(mockState.handleAccountUpdated).not.toHaveBeenCalled();
    });

    it('rejects a non-POST method', async () => {
        const res = mockResponse();

        await monoWebhook({ ...signedRequest(), method: 'GET' } as never, res);

        expect(res.statusCode).toBe(405);
    });
});
