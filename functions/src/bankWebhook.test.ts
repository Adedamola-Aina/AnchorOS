import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * monoWebhook contract tests (mocked backend).
 *
 * Covers Mono's documented authentication — a shared `mono-webhook-secret`
 * header matched against the configured secret (no HMAC) — and the
 * claim/complete/release lifecycle decisions.
 *
 * Real transaction and concurrency behavior is covered separately by
 * bankWebhook.emulator.test.ts against the Firestore emulator.
 */
type StoredDoc = Record<string, unknown>;

const mockState = vi.hoisted(() => ({
    store: new Map<string, StoredDoc>(),
    failCompletionWrite: false,
    handleAccountUpdated: vi.fn(),
    handleReauthorisation: vi.fn(),
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('firebase-functions', () => ({ logger: mockState.logger }));

// Invoke the handler directly: the real onRequest wrapper expects an Express
// response stream, which this unit test does not need.
vi.mock('firebase-functions/v2/https', () => ({
    onRequest: (first: unknown, second?: unknown) => (typeof first === 'function' ? first : second),
}));

vi.mock('./config', () => {
    const write = (id: string, data: StoredDoc, opts?: { merge?: boolean }) => {
        if (data.status === 'completed' && mockState.failCompletionWrite) {
            throw new Error('completion write failed');
        }
        mockState.store.set(id, opts?.merge ? { ...(mockState.store.get(id) ?? {}), ...data } : data);
    };

    const db = {
        collection: () => ({
            doc: (id: string) => ({
                id,
                set: async (data: StoredDoc, opts?: { merge?: boolean }) => write(id, data, opts),
                delete: async () => {
                    mockState.store.delete(id);
                },
            }),
        }),
        runTransaction: async (fn: (txn: unknown) => unknown) =>
            fn({
                get: async (ref: { id: string }) => ({
                    exists: mockState.store.has(ref.id),
                    data: () => mockState.store.get(ref.id),
                }),
                set: (ref: { id: string }, data: StoredDoc, opts?: { merge?: boolean }) => write(ref.id, data, opts),
                delete: (ref: { id: string }) => {
                    mockState.store.delete(ref.id);
                },
            }),
    };

    return { db, APP_ID: 'anchor-os' };
});

vi.mock('./webhookHandlers', () => ({
    handleAccountUpdated: (...args: unknown[]) => mockState.handleAccountUpdated(...args),
    handleReauthorisation: (...args: unknown[]) => mockState.handleReauthorisation(...args),
}));

import { monoWebhook, eventKey, verifyWebhookSecret, CLAIM_LEASE_MS, MAX_CLAIM_ATTEMPTS } from './bankWebhook';
import type { MonoWebhookEvent } from './mono/monoTypes';

const SECRET = 'mono-webhook-shared-secret';
const ACCOUNT_ID = 'mono-acc-1';
const EVENT_ID = 'tDZCfxYASzx75YtXe3zbrgNzQtohDd6AE2BwWRvKf4';

function payload(overrides: Partial<MonoWebhookEvent> = {}): MonoWebhookEvent {
    return {
        event: 'mono.events.account_updated',
        event_id: EVENT_ID,
        data: { account: { _id: ACCOUNT_ID } },
        ...overrides,
    };
}

interface MockResponse {
    statusCode: number;
    body: unknown;
    status(code: number): MockResponse;
    json(body: unknown): MockResponse;
    send(body: unknown): MockResponse;
}

function mockResponse(): MockResponse {
    const res: MockResponse = {
        statusCode: 0,
        body: undefined,
        status(code) {
            res.statusCode = code;
            return res;
        },
        json(body) {
            res.body = body;
            return res;
        },
        send(body) {
            res.body = body;
            return res;
        },
    };
    return res;
}

type Handler = (req: unknown, res: unknown) => Promise<void>;

async function invoke(
    body: unknown = payload(),
    headers: Record<string, string> = { 'mono-webhook-secret': SECRET },
    method = 'POST',
): Promise<MockResponse> {
    const res = mockResponse();
    await (monoWebhook as unknown as Handler)({ method, headers, body }, res);
    return res;
}

/** Key the handler derives for the default payload (object body → JSON fallback). */
function keyFor(p: MonoWebhookEvent = payload()): string {
    return eventKey(p, JSON.stringify(p));
}

describe('monoWebhook authentication (documented shared-secret contract)', () => {
    beforeEach(() => {
        mockState.store.clear();
        mockState.failCompletionWrite = false;
        mockState.handleAccountUpdated.mockClear();
        process.env.MONO_WEBHOOK_SECRET = SECRET;
    });

    it('accepts a matching secret', () => {
        expect(verifyWebhookSecret(SECRET, SECRET)).toBe(true);
    });

    it('fails closed when the configured secret is missing', () => {
        delete process.env.MONO_WEBHOOK_SECRET;

        expect(verifyWebhookSecret(SECRET)).toBe(false);
    });

    it('fails closed when the header is missing', () => {
        expect(verifyWebhookSecret(undefined, SECRET)).toBe(false);
    });

    it('rejects a wrong header value without processing', async () => {
        const res = await invoke(payload(), { 'mono-webhook-secret': 'not-the-secret' });

        expect(res.statusCode).toBe(401);
        expect(mockState.handleAccountUpdated).not.toHaveBeenCalled();
        expect(mockState.store.size).toBe(0);
    });

    it('rejects when MONO_WEBHOOK_SECRET is not configured', async () => {
        delete process.env.MONO_WEBHOOK_SECRET;

        const res = await invoke();

        expect(res.statusCode).toBe(401);
        expect(mockState.handleAccountUpdated).not.toHaveBeenCalled();
    });

    it('never writes the secret value to logs', async () => {
        await invoke();
        await invoke(payload(), { 'mono-webhook-secret': 'wrong' });

        const logged = JSON.stringify([
            ...mockState.logger.info.mock.calls,
            ...mockState.logger.warn.mock.calls,
            ...mockState.logger.error.mock.calls,
        ]);
        expect(logged).not.toContain(SECRET);
    });
});

describe('monoWebhook processing lifecycle', () => {
    beforeEach(() => {
        mockState.store.clear();
        mockState.failCompletionWrite = false;
        vi.clearAllMocks();
        process.env.MONO_WEBHOOK_SECRET = SECRET;
        mockState.handleAccountUpdated.mockResolvedValue(undefined);
    });

    it('processes an event and records completion', async () => {
        const res = await invoke();

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({ received: true });
        expect(mockState.handleAccountUpdated).toHaveBeenCalledWith(ACCOUNT_ID, EVENT_ID);
        expect(mockState.store.get(keyFor())).toMatchObject({ status: 'completed' });
    });

    it('acknowledges a completed duplicate without reprocessing', async () => {
        await invoke();
        mockState.handleAccountUpdated.mockClear();

        const res = await invoke();

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({ duplicate: true });
        expect(mockState.handleAccountUpdated).not.toHaveBeenCalled();
    });

    it('does not discard an event held by a live claim — asks for redelivery', async () => {
        mockState.store.set(keyFor(), {
            status: 'processing',
            claimId: 'other-worker',
            leaseUntilMs: Date.now() + CLAIM_LEASE_MS,
            attempts: 1,
        });

        const res = await invoke();

        expect(res.statusCode).toBe(503);
        expect(res.body).toMatchObject({ retry: true });
        expect(mockState.handleAccountUpdated).not.toHaveBeenCalled();
    });

    it('recovers an abandoned claim and processes the event', async () => {
        mockState.store.set(keyFor(), {
            status: 'processing',
            claimId: 'dead-worker',
            leaseUntilMs: Date.now() - 1000,
            attempts: 1,
        });

        const res = await invoke();

        expect(res.statusCode).toBe(200);
        expect(mockState.handleAccountUpdated).toHaveBeenCalledWith(ACCOUNT_ID, EVENT_ID);
        expect(mockState.store.get(keyFor())).toMatchObject({ status: 'completed' });
    });

    it('stops auto-reclaiming once attempts are exhausted', async () => {
        mockState.store.set(keyFor(), {
            status: 'processing',
            claimId: 'dead-worker',
            leaseUntilMs: Date.now() - 1000,
            attempts: MAX_CLAIM_ATTEMPTS,
        });

        const res = await invoke();

        expect(res.statusCode).toBe(500);
        expect(res.body).toMatchObject({ reason: 'attempts_exhausted' });
        expect(mockState.handleAccountUpdated).not.toHaveBeenCalled();
    });

    it('releases the claim when the handler fails so redelivery is processed', async () => {
        mockState.handleAccountUpdated.mockRejectedValueOnce(new Error('downstream down'));

        const res = await invoke();
        expect(res.statusCode).toBe(500);
        expect(mockState.store.has(keyFor())).toBe(false);

        mockState.handleAccountUpdated.mockResolvedValueOnce(undefined);
        const retry = await invoke();
        expect(retry.statusCode).toBe(200);
        expect(mockState.handleAccountUpdated).toHaveBeenCalledTimes(2);
    });

    it('acknowledges when completion recording fails, without re-running financial work', async () => {
        mockState.failCompletionWrite = true;

        const res = await invoke();

        expect(res.statusCode).toBe(200);
        expect(mockState.handleAccountUpdated).toHaveBeenCalledTimes(1);
        // The claim stays 'processing'; recovery re-runs the handler, whose own
        // event_id guard (webhookHandlers.test.ts) prevents duplicate changes.
        expect(mockState.store.get(keyFor())).toMatchObject({ status: 'processing' });
    });

    it('rejects a non-POST method', async () => {
        const res = await invoke(payload(), { 'mono-webhook-secret': SECRET }, 'GET');

        expect(res.statusCode).toBe(405);
    });
});

describe('eventKey (lossless event identity)', () => {
    it('does not alias an unusual ID with a literal ID equal to its digest', () => {
        const id = 'abcd.12345678';
        const digest = createHash('sha256').update(id).digest('hex');
        expect(eventKey(payload({ event_id: id }), '')).not.toBe(
            eventKey(payload({ event_id: digest }), ''),
        );
    });

    it("hashes Mono's documented event_id consistently", () => {
        expect(eventKey(payload(), 'ignored')).toBe(`evt_${createHash('sha256').update(EVENT_ID).digest('hex')}`);
    });

    it('keeps distinct event ids distinct even when they differ only in characters that are not document-id-safe', () => {
        const withDot = eventKey(payload({ event_id: 'abcd.12345678' }), 'raw');
        const withoutDot = eventKey(payload({ event_id: 'abcd12345678' }), 'raw');

        expect(withDot).not.toBe(withoutDot);
        expect(withDot).toMatch(/^evt_[0-9a-f]{64}$/);
    });

    it('never emits a document-id-unsafe key for exotic ids', () => {
        const key = eventKey(payload({ event_id: 'a/b/c.ünïcode/'.repeat(20) }), 'raw');

        expect(key).toMatch(/^evt_[0-9a-f]{64}$/);
        expect(key).not.toContain('/');
    });

    it('is deterministic for the same id', () => {
        const id = 'not/doc/safe';
        expect(eventKey(payload({ event_id: id }), 'one')).toBe(eventKey(payload({ event_id: id }), 'two'));
    });

    it('namespaces id-bearing events apart from id-less ones', () => {
        const raw = '{"event":"mono.events.account_updated"}';
        const withoutId = eventKey(payload({ event_id: undefined }), raw);

        expect(withoutId).toMatch(/^body_[0-9a-f]{64}$/);
        expect(withoutId.startsWith('evt_')).toBe(false);
    });

    it('preserves identity for ids shorter than the document-safe minimum', () => {
        const short = eventKey(payload({ event_id: 'abc' }), 'raw');

        expect(short).toMatch(/^evt_[0-9a-f]{64}$/);
        expect(short).not.toBe(eventKey(payload({ event_id: undefined }), 'raw'));
    });
});
