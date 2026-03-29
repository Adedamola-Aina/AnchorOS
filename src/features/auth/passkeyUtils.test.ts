/**
 * passkeyUtils — AUTH-002, GAP-011
 * Tests: encoding helpers and performPasskeyRegistration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase/functions', () => ({
    httpsCallable: vi.fn(),
}));

vi.mock('../../config/firebase', () => ({ functions: {} }));

vi.stubGlobal('navigator', {
    credentials: {
        create: vi.fn(),
        get: vi.fn(),
    },
});

import { httpsCallable } from 'firebase/functions';
import { bufferToBase64url, base64urlToBuffer, performPasskeyRegistration } from './passkeyUtils';

const mockIssueChallenge = vi.fn().mockResolvedValue({
    data: { challengeId: 'chal-1', challenge: 'dGVzdC1jaGFsbGVuZ2U' },
});
const mockCompleteRegistration = vi.fn().mockResolvedValue({
    data: { credentialId: 'server-cred-id' },
});

vi.mocked(httpsCallable).mockImplementation((_functions, name) => {
    if (name === 'issuePasskeyChallenge') return mockIssueChallenge as never;
    if (name === 'completePasskeyRegistration') return mockCompleteRegistration as never;
    return vi.fn() as never;
});

const mockCredential = {
    id: 'cred-abc',
    rawId: new ArrayBuffer(8),
    type: 'public-key' as const,
    response: {
        clientDataJSON: new ArrayBuffer(16),
        attestationObject: new ArrayBuffer(32),
        getAuthenticatorData: () => new ArrayBuffer(8),
        getPublicKey: () => null,
        getPublicKeyAlgorithm: () => -7,
        getTransports: () => ['internal'],
    },
    getClientExtensionResults: () => ({}),
    authenticatorAttachment: 'platform' as const,
    toJSON: () => ({}),
};

describe('bufferToBase64url / base64urlToBuffer round-trip', () => {
    it('encodes and decodes a buffer correctly', () => {
        const original = new Uint8Array([1, 2, 3, 4, 255, 0, 128]).buffer;
        const encoded = bufferToBase64url(original);
        const decoded = base64urlToBuffer(encoded);
        expect(new Uint8Array(decoded)).toEqual(new Uint8Array(original));
    });

    it('produces URL-safe base64 (no +, /, or = characters)', () => {
        const buf = new Uint8Array(32).fill(0xfb).buffer;
        const encoded = bufferToBase64url(buf);
        expect(encoded).not.toMatch(/[+/=]/);
    });
});

describe('performPasskeyRegistration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIssueChallenge.mockResolvedValue({
            data: { challengeId: 'chal-1', challenge: 'dGVzdC1jaGFsbGVuZ2U' },
        });
        mockCompleteRegistration.mockResolvedValue({ data: { credentialId: 'server-cred-id' } });
        vi.mocked(navigator.credentials.create).mockResolvedValue(mockCredential as never);
    });

    it('fetches a server challenge before calling credentials.create', async () => {
        await performPasskeyRegistration('uid-1', 'a@b.com', 'A B');
        expect(mockIssueChallenge).toHaveBeenCalledWith({ purpose: 'register' });
        expect(navigator.credentials.create).toHaveBeenCalledTimes(1);
    });

    it('sends attestation to completePasskeyRegistration and returns credentialId', async () => {
        const credId = await performPasskeyRegistration('uid-1', 'a@b.com', 'A B');
        expect(mockCompleteRegistration).toHaveBeenCalledWith(
            expect.objectContaining({
                challengeId: 'chal-1',
                credential: expect.objectContaining({ id: 'cred-abc' }),
            })
        );
        expect(credId).toBe('server-cred-id');
    });

    it('returns null when navigator.credentials.create returns null', async () => {
        vi.mocked(navigator.credentials.create).mockResolvedValue(null as never);
        const credId = await performPasskeyRegistration('uid-1', 'a@b.com', 'A B');
        expect(credId).toBeNull();
    });
});
