/**
 * passkeyRegistration — GAP-011
 *
 * Tests for server-side WebAuthn registration completion.
 * Mirrors the mock pattern from passkeyAuth.test.ts.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Hoisted mock state ──────────────────────────────────────────────────────
const mockState = vi.hoisted(() => {
    const createAuditLog = vi.fn().mockResolvedValue(undefined);

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

    return { createAuditLog, docGet, docSet, docDelete, clearDocs, docs };
});

// ── Module mocks ────────────────────────────────────────────────────────────
vi.mock('./callable', () => ({
    secureOnCall: <T, R>(handler: (req: T) => Promise<R>): ((req: T) => Promise<R>) => handler,
}));

vi.mock('./helpers', () => ({
    createAuditLog: (...args: unknown[]) => mockState.createAuditLog(...args),
}));

vi.mock('firebase-admin/firestore', () => ({
    FieldValue: { serverTimestamp: () => 'server-ts' },
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
    verifyRegistrationResponse: vi.fn(),
}));

import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { completePasskeyRegistration as _completePasskeyRegistration, deletePasskey as _deletePasskey } from './passkeyRegistration';

type TestCallable = (req: Record<string, unknown>) => Promise<Record<string, string>>;
const completePasskeyRegistration = _completePasskeyRegistration as unknown as TestCallable;
const deletePasskeyFn = _deletePasskey as unknown as TestCallable;

const validCredential = {
    id: 'cred-new-123',
    rawId: 'cred-new-123',
    response: {
        clientDataJSON: 'base64url-client-data',
        attestationObject: 'base64url-attestation',
    },
    type: 'public-key',
    authenticatorAttachment: 'platform',
};

const validRequest = {
    auth: { uid: 'uid-abc' },
    data: {
        challengeId: 'chal-reg-1',
        credential: validCredential,
    },
};

describe('completePasskeyRegistration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.clearDocs();
    });

    it('rejects unauthenticated callers', async () => {
        await expect(
            completePasskeyRegistration({ data: { challengeId: 'c', credential: validCredential } }),
        ).rejects.toMatchObject({ code: 'unauthenticated' });
    });

    it('rejects missing fields', async () => {
        await expect(
            completePasskeyRegistration({ auth: { uid: 'u' }, data: {} }),
        ).rejects.toMatchObject({ code: 'invalid-argument' });
    });

    it('rejects when challenge does not exist', async () => {
        await expect(completePasskeyRegistration(validRequest)).rejects.toMatchObject({
            code: 'not-found',
        });
    });

    it('rejects when challenge purpose is not register', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'authenticate',
        };
        await expect(completePasskeyRegistration(validRequest)).rejects.toMatchObject({
            code: 'invalid-argument',
        });
    });

    it('rejects when challenge belongs to a different user', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'register',
            userId: 'different-user',
        };
        await expect(completePasskeyRegistration(validRequest)).rejects.toMatchObject({
            code: 'permission-denied',
        });
    });

    it('rejects an expired challenge', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() - 5 * 60 * 1000 },
            purpose: 'register',
            userId: 'uid-abc',
        };
        await expect(completePasskeyRegistration(validRequest)).rejects.toMatchObject({
            code: 'deadline-exceeded',
        });
    });

    it('rejects when attestation verification fails', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'register',
            userId: 'uid-abc',
        };

        vi.mocked(verifyRegistrationResponse).mockRejectedValueOnce(
            new Error('attestation invalid'),
        );

        await expect(completePasskeyRegistration(validRequest)).rejects.toMatchObject({
            code: 'permission-denied',
        });
    });

    it('rejects when verification returns verified: false', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'register',
            userId: 'uid-abc',
        };

        vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
            verified: false,
        } as never);

        await expect(completePasskeyRegistration(validRequest)).rejects.toMatchObject({
            code: 'permission-denied',
        });
    });

    it('stores credential public key in Firestore on success', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'register',
            userId: 'uid-abc',
        };

        vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
            verified: true,
            registrationInfo: {
                credential: {
                    id: 'cred-verified-id',
                    publicKey: new Uint8Array([1, 2, 3, 4]),
                    counter: 0,
                },
                fmt: 'none',
                aaguid: 'test-aaguid',
            },
        } as never);

        const result = await completePasskeyRegistration(validRequest);
        expect(result).toHaveProperty('credentialId', 'cred-verified-id');

        const credPath = 'artifacts/anchor-os/users/uid-abc/passkeys/cred-verified-id';
        const setCall = mockState.docSet.mock.calls.find((c) => c[0] === credPath);
        expect(setCall).toBeDefined();
        const stored = setCall![1] as Record<string, unknown>;
        expect(stored.publicKey).toBe(Buffer.from(new Uint8Array([1, 2, 3, 4])).toString('base64url'));
        expect(stored.counter).toBe(0);
        expect(stored.credentialId).toBe('cred-verified-id');
    });

    it('deletes the challenge after use (prevents replay)', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'register',
            userId: 'uid-abc',
        };

        vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
            verified: true,
            registrationInfo: {
                credential: {
                    id: 'cred-id',
                    publicKey: new Uint8Array([1]),
                    counter: 0,
                },
            },
        } as never);

        await completePasskeyRegistration(validRequest);
        expect(mockState.docDelete).toHaveBeenCalledWith('passkey_challenges/chal-reg-1');
    });

    it('writes an audit log on success', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'register',
            userId: 'uid-abc',
        };

        vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
            verified: true,
            registrationInfo: {
                credential: {
                    id: 'cred-id',
                    publicKey: new Uint8Array([1]),
                    counter: 0,
                },
            },
        } as never);

        await completePasskeyRegistration(validRequest);
        expect(mockState.createAuditLog).toHaveBeenCalledWith(
            'passkey_register_success',
            'uid-abc',
            expect.objectContaining({ credentialId: 'cred-id' }),
        );
    });

    it('writes an audit log on verification failure', async () => {
        mockState.docs['passkey_challenges/chal-reg-1'] = {
            challenge: 'server-challenge',
            expiresAt: { toMillis: () => Date.now() + 60_000 },
            purpose: 'register',
            userId: 'uid-abc',
        };

        vi.mocked(verifyRegistrationResponse).mockRejectedValueOnce(new Error('bad'));

        await expect(completePasskeyRegistration(validRequest)).rejects.toBeDefined();
        expect(mockState.createAuditLog).toHaveBeenCalledWith(
            'passkey_register_failure',
            'uid-abc',
            expect.objectContaining({ credentialId: 'cred-new-123' }),
        );
    });
});

describe('deletePasskey', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.clearDocs();
    });

    it('rejects unauthenticated callers', async () => {
        await expect(
            deletePasskeyFn({ data: { credentialId: 'cred-1' } }),
        ).rejects.toMatchObject({ code: 'unauthenticated' });
    });

    it('rejects when credentialId is missing', async () => {
        await expect(
            deletePasskeyFn({ auth: { uid: 'uid-abc' }, data: {} }),
        ).rejects.toMatchObject({ code: 'invalid-argument' });
    });

    it('rejects when passkey credential does not exist', async () => {
        await expect(
            deletePasskeyFn({ auth: { uid: 'uid-abc' }, data: { credentialId: 'nonexistent' } }),
        ).rejects.toMatchObject({ code: 'not-found' });
    });

    it('deletes the passkey credential document on success', async () => {
        const credPath = 'artifacts/anchor-os/users/uid-abc/passkeys/cred-del-1';
        mockState.docs[credPath] = {
            credentialId: 'cred-del-1',
            publicKey: 'base64url-pub-key',
            counter: 5,
        };
        await deletePasskeyFn({ auth: { uid: 'uid-abc' }, data: { credentialId: 'cred-del-1' } });
        expect(mockState.docDelete).toHaveBeenCalledWith(credPath);
    });

    it('returns success: true', async () => {
        const credPath = 'artifacts/anchor-os/users/uid-abc/passkeys/cred-del-1';
        mockState.docs[credPath] = { credentialId: 'cred-del-1' };
        const result = await deletePasskeyFn({ auth: { uid: 'uid-abc' }, data: { credentialId: 'cred-del-1' } });
        expect(result).toHaveProperty('success', true);
    });

    it('writes an audit log on deletion', async () => {
        const credPath = 'artifacts/anchor-os/users/uid-abc/passkeys/cred-del-1';
        mockState.docs[credPath] = { credentialId: 'cred-del-1' };
        await deletePasskeyFn({ auth: { uid: 'uid-abc' }, data: { credentialId: 'cred-del-1' } });
        expect(mockState.createAuditLog).toHaveBeenCalledWith(
            'passkey_deleted',
            'uid-abc',
            expect.objectContaining({ credentialId: 'cred-del-1' }),
        );
    });
});
