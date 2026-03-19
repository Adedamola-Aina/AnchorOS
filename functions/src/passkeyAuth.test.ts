/**
 * passkeyAuth — GAP-011
 *
 * Tests for server-side WebAuthn challenge issuance and assertion verification.
 * RED phase: all tests fail until passkeyAuth.ts is implemented.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Hoisted mock state ──────────────────────────────────────────────────────
const mockState = vi.hoisted(() => {
    const enforceRateLimit = vi.fn().mockResolvedValue(undefined);
    const createAuditLog = vi.fn().mockResolvedValue(undefined);
    const createCustomToken = vi.fn().mockResolvedValue('custom-token-abc');

    // Firestore mock — tracks set/get/delete calls per docPath
    const docs: Record<string, Record<string, unknown>> = {};
    const docGet = vi.fn(async (path: string) => {
        const data = docs[path];
        return { exists: !!data, data: () => data };
    });
    const docSet = vi.fn(async (path: string, data: Record<string, unknown>) => {
        docs[path] = data;
    });
    const docDelete = vi.fn(async (path: string) => {
        delete docs[path];
    });
    const clearDocs = () => Object.keys(docs).forEach((k) => delete docs[k]);

    return {
        enforceRateLimit,
        createAuditLog,
        createCustomToken,
        docGet,
        docSet,
        docDelete,
        clearDocs,
        docs,
    };
});

// ── Module mocks ────────────────────────────────────────────────────────────
vi.mock('./callable', () => ({
    // Typed so TypeScript sees the exported functions as (req) => Promise<R>, not HttpsFunction
    secureOnCall: <T, R>(handler: (req: T) => Promise<R>): ((req: T) => Promise<R>) => handler,
}));

vi.mock('./rateLimit', () => ({
    enforceRateLimit: (...args: unknown[]) => mockState.enforceRateLimit(...args),
}));

vi.mock('./helpers', () => ({
    createAuditLog: (...args: unknown[]) => mockState.createAuditLog(...args),
}));

vi.mock('firebase-admin/auth', () => ({
    getAuth: () => ({
        createCustomToken: (...args: unknown[]) => mockState.createCustomToken(...args),
    }),
}));

vi.mock('firebase-admin/firestore', () => ({
    FieldValue: {
        serverTimestamp: () => 'server-ts',
    },
    Timestamp: {
        now: () => ({ seconds: Math.floor(Date.now() / 1000), toMillis: () => Date.now() }),
        fromMillis: (ms: number) => ({ seconds: Math.floor(ms / 1000), toMillis: () => ms }),
    },
}));

vi.mock('./config', () => ({
    APP_ID: 'anchor-os',
    db: {
        collection: (col: string) => ({
            doc: (docId: string) => {
                const path = `${col}/${docId}`;
                return {
                    get: () => mockState.docGet(path),
                    set: (data: Record<string, unknown>, _opts?: unknown) => mockState.docSet(path, data),
                    delete: () => mockState.docDelete(path),
                    collection: (subCol: string) => ({
                        doc: (subDocId: string) => {
                            const subPath = `${path}/${subCol}/${subDocId}`;
                            return {
                                get: () => mockState.docGet(subPath),
                                set: (data: Record<string, unknown>, _opts?: unknown) => mockState.docSet(subPath, data),
                                delete: () => mockState.docDelete(subPath),
                                collection: (subSubCol: string) => ({
                                    doc: (subSubDocId: string) => {
                                        const deepPath = `${subPath}/${subSubCol}/${subSubDocId}`;
                                        return {
                                            get: () => mockState.docGet(deepPath),
                                            set: (data: Record<string, unknown>, _opts?: unknown) => mockState.docSet(deepPath, data),
                                            delete: () => mockState.docDelete(deepPath),
                                        };
                                    },
                                }),
                            };
                        },
                    }),
                };
            },
        }),
    },
}));

vi.mock('@simplewebauthn/server', () => ({
    verifyAuthenticationResponse: vi.fn(),
    verifyRegistrationResponse: vi.fn(),
}));

import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { issuePasskeyChallenge as _issuePasskeyChallenge, verifyPasskeyAssertion as _verifyPasskeyAssertion } from './passkeyAuth';

// secureOnCall mock returns the raw handler (not a CallableFunction/HttpsFunction wrapper).
// Cast to allow single-arg invocation without TypeScript errors; runtime is correct.
type TestCallable = (req: Record<string, unknown>) => Promise<Record<string, string>>;
const issuePasskeyChallenge = _issuePasskeyChallenge as unknown as TestCallable;
const verifyPasskeyAssertion = _verifyPasskeyAssertion as unknown as TestCallable;

// ── issuePasskeyChallenge ───────────────────────────────────────────────────
describe('issuePasskeyChallenge', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.clearDocs();
    });

    it('rejects missing purpose', async () => {
        await expect(issuePasskeyChallenge({ data: {} })).rejects.toMatchObject({
            code: 'invalid-argument',
        });
    });

    it('rejects unknown purpose', async () => {
        await expect(issuePasskeyChallenge({ data: { purpose: 'hack' } })).rejects.toMatchObject({
            code: 'invalid-argument',
        });
    });

    it('returns a base64url challenge string for register purpose (authenticated)', async () => {
        const result = await issuePasskeyChallenge({
            auth: { uid: 'uid-abc' },
            data: { purpose: 'register' },
        });
        expect(result).toHaveProperty('challenge');
        expect(typeof result.challenge).toBe('string');
        expect(result.challenge.length).toBeGreaterThan(0);
    });

    it('challenge for register contains no + / = characters (base64url)', async () => {
        const result = await issuePasskeyChallenge({
            auth: { uid: 'uid-abc' },
            data: { purpose: 'register' },
        });
        expect(result.challenge).not.toMatch(/[+/=]/);
    });

    it('returns a challengeId for later verification', async () => {
        const result = await issuePasskeyChallenge({
            auth: { uid: 'uid-abc' },
            data: { purpose: 'register' },
        });
        expect(result).toHaveProperty('challengeId');
        expect(typeof result.challengeId).toBe('string');
    });

    it('stores the challenge in Firestore with TTL', async () => {
        await issuePasskeyChallenge({
            auth: { uid: 'uid-abc' },
            data: { purpose: 'register' },
        });
        // Verify that at least one document was written
        expect(mockState.docSet).toHaveBeenCalled();
        const callArgs = mockState.docSet.mock.calls[0];
        const storedData = callArgs[1] as Record<string, unknown>;
        expect(storedData).toHaveProperty('challenge');
        expect(storedData).toHaveProperty('expiresAt');
    });

    it('enforce rate limit for register', async () => {
        await issuePasskeyChallenge({
            auth: { uid: 'uid-abc' },
            data: { purpose: 'register' },
        });
        expect(mockState.enforceRateLimit).toHaveBeenCalledWith('passkeyChallenge', 'uid-abc');
    });

    it('rejects register when caller is not authenticated', async () => {
        await expect(
            issuePasskeyChallenge({ data: { purpose: 'register' } })
        ).rejects.toMatchObject({ code: 'unauthenticated' });
    });

    it('returns a challenge for authenticate purpose (unauthenticated allowed)', async () => {
        const result = await issuePasskeyChallenge({
            data: { purpose: 'authenticate' },
        });
        expect(result).toHaveProperty('challenge');
        expect(result).toHaveProperty('challengeId');
    });

    it('enforce rate limit for authenticate using IP fallback', async () => {
        await issuePasskeyChallenge({
            data: { purpose: 'authenticate' },
            rawRequest: { ip: '1.2.3.4' },
        });
        expect(mockState.enforceRateLimit).toHaveBeenCalledWith('passkeyChallenge', '1.2.3.4');
    });
});

// ── verifyPasskeyAssertion ──────────────────────────────────────────────────
describe('verifyPasskeyAssertion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.clearDocs();
    });

    const validRequest = {
        data: {
            challengeId: 'chal-123',
            credentialId: 'cred-abc',
            userId: 'uid-xyz',
            response: {
                authenticatorData: 'base64url-auth-data',
                clientDataJSON: 'base64url-client-data',
                signature: 'base64url-sig',
            },
        },
    };

    it('rejects missing fields', async () => {
        await expect(verifyPasskeyAssertion({ data: {} })).rejects.toMatchObject({
            code: 'invalid-argument',
        });
    });

    it('rejects when challengeId does not exist in Firestore', async () => {
        // docGet returns { exists: false } by default (empty docs map)
        await expect(verifyPasskeyAssertion(validRequest)).rejects.toMatchObject({
            code: 'not-found',
        });
    });

    it('rejects an expired challenge', async () => {
        const expiredAt = Date.now() - 5 * 60 * 1000; // 5 min ago
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => expiredAt },
            purpose: 'authenticate',
        };

        await expect(verifyPasskeyAssertion(validRequest)).rejects.toMatchObject({
            code: 'deadline-exceeded',
        });
    });

    it('rejects when no passkey credential is stored for the user', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        // credential doc path: artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc → doesn't exist

        await expect(verifyPasskeyAssertion(validRequest)).rejects.toMatchObject({
            code: 'not-found',
        });
    });

    it('rejects when @simplewebauthn/server verification fails', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        mockState.docs['artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc'] = {
            credentialId: 'cred-abc',
            publicKey: 'base64url-public-key',
            counter: 0,
        };

        vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
            verified: false,
        } as never);

        await expect(verifyPasskeyAssertion(validRequest)).rejects.toMatchObject({
            code: 'permission-denied',
        });
    });

    it('returns a Firebase Custom Token on success', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        mockState.docs['artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc'] = {
            credentialId: 'cred-abc',
            publicKey: 'base64url-public-key',
            counter: 0,
        };

        vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
            verified: true,
            authenticationInfo: { newCounter: 1 },
        } as never);

        const result = await verifyPasskeyAssertion(validRequest);
        expect(result).toHaveProperty('customToken', 'custom-token-abc');
    });

    it('updates the counter in Firestore after successful verification', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        mockState.docs['artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc'] = {
            credentialId: 'cred-abc',
            publicKey: 'base64url-public-key',
            counter: 0,
        };

        vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
            verified: true,
            authenticationInfo: { newCounter: 5 },
        } as never);

        await verifyPasskeyAssertion(validRequest);

        const credPath = 'artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc';
        const setCall = mockState.docSet.mock.calls.find((c) => c[0] === credPath);
        expect(setCall).toBeDefined();
        expect((setCall![1] as Record<string, unknown>).counter).toBe(5);
    });

    it('deletes the challenge from Firestore after use (prevents replay)', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        mockState.docs['artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc'] = {
            credentialId: 'cred-abc',
            publicKey: 'base64url-public-key',
            counter: 0,
        };

        vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
            verified: true,
            authenticationInfo: { newCounter: 1 },
        } as never);

        await verifyPasskeyAssertion(validRequest);

        expect(mockState.docDelete).toHaveBeenCalledWith('passkey_challenges/chal-123');
    });

    it('writes an audit log on success', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        mockState.docs['artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc'] = {
            credentialId: 'cred-abc',
            publicKey: 'base64url-public-key',
            counter: 0,
        };

        vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
            verified: true,
            authenticationInfo: { newCounter: 1 },
        } as never);

        await verifyPasskeyAssertion(validRequest);

        expect(mockState.createAuditLog).toHaveBeenCalledWith(
            'passkey_verify_success',
            'uid-xyz',
            expect.objectContaining({ credentialId: 'cred-abc' })
        );
    });

    it('writes an audit log on verification failure', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        mockState.docs['artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc'] = {
            credentialId: 'cred-abc',
            publicKey: 'base64url-public-key',
            counter: 0,
        };

        vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
            verified: false,
        } as never);

        await expect(verifyPasskeyAssertion(validRequest)).rejects.toBeDefined();

        expect(mockState.createAuditLog).toHaveBeenCalledWith(
            'passkey_verify_failure',
            'uid-xyz',
            expect.objectContaining({ credentialId: 'cred-abc' })
        );
    });

    it('enforces rate limit on verify attempts', async () => {
        mockState.docs['passkey_challenges/chal-123'] = {
            challenge: 'some-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        mockState.docs['artifacts/anchor-os/users/uid-xyz/passkeys/cred-abc'] = {
            credentialId: 'cred-abc',
            publicKey: 'base64url-public-key',
            counter: 0,
        };

        vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
            verified: true,
            authenticationInfo: { newCounter: 1 },
        } as never);

        await verifyPasskeyAssertion(validRequest);

        expect(mockState.enforceRateLimit).toHaveBeenCalledWith('passkeyVerify', 'uid-xyz');
    });
});
