/**
 * usePasskeyAuth — AUTH-002, GAP-011
 * Tests: WebAuthn passkey registration and authentication
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock Firebase Cloud Functions SDK
vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(() => ({})),
    httpsCallable: vi.fn(),
}));

// Mock Firebase Auth signInWithCustomToken
vi.mock('firebase/auth', () => ({
    signInWithCustomToken: vi.fn(),
    getAuth: vi.fn(() => ({})),
}));

vi.mock('../../config/firebase', () => ({ auth: {}, app: {} }));

// Mock Web Authentication API
const mockCredential = {
    id: 'cred-123',
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

const mockAssertion = {
    id: 'cred-123',
    rawId: new ArrayBuffer(8),
    type: 'public-key' as const,
    response: {
        clientDataJSON: new ArrayBuffer(16),
        authenticatorData: new ArrayBuffer(16),
        signature: new ArrayBuffer(32),
        userHandle: null,
    },
    getClientExtensionResults: () => ({}),
    authenticatorAttachment: 'platform' as const,
    toJSON: () => ({}),
};

vi.stubGlobal('navigator', {
    credentials: {
        create: vi.fn().mockResolvedValue(mockCredential),
        get: vi.fn().mockResolvedValue(mockAssertion),
    },
});

import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { usePasskeyAuth } from './usePasskeyAuth';

const mockIssueChallenge = vi.fn().mockResolvedValue({
    data: { challengeId: 'chal-server-1', challenge: 'server-challenge-base64url' },
});
const mockVerifyAssertion = vi.fn().mockResolvedValue({
    data: { customToken: 'firebase-custom-token' },
});
const mockCompleteRegistration = vi.fn().mockResolvedValue({
    data: { credentialId: 'server-verified-cred-id' },
});

vi.mocked(httpsCallable).mockImplementation((_functions, name) => {
    if (name === 'issuePasskeyChallenge') return mockIssueChallenge as never;
    if (name === 'verifyPasskeyAssertion') return mockVerifyAssertion as never;
    if (name === 'completePasskeyRegistration') return mockCompleteRegistration as never;
    return vi.fn() as never;
});

describe('usePasskeyAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(navigator.credentials.create).mockResolvedValue(mockCredential as never);
        vi.mocked(navigator.credentials.get).mockResolvedValue(mockAssertion as never);
        mockIssueChallenge.mockResolvedValue({
            data: { challengeId: 'chal-server-1', challenge: 'server-challenge-base64url' },
        });
        mockVerifyAssertion.mockResolvedValue({ data: { customToken: 'firebase-custom-token' } });
        mockCompleteRegistration.mockResolvedValue({ data: { credentialId: 'server-verified-cred-id' } });
        vi.mocked(signInWithCustomToken).mockResolvedValue({} as never);
    });

    it('isSupported returns true when credentials API exists', () => {
        const { result } = renderHook(() => usePasskeyAuth());
        expect(result.current.isSupported).toBe(true);
    });

    it('registerPasskey calls navigator.credentials.create', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.registerPasskey('user-123', 'test@example.com', 'Test User');
        });
        expect(navigator.credentials.create).toHaveBeenCalledTimes(1);
    });

    it('authenticateWithPasskey calls navigator.credentials.get', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.authenticateWithPasskey();
        });
        expect(navigator.credentials.get).toHaveBeenCalledTimes(1);
    });

    it('sets loading to true during registration', async () => {
        let resolveCreate!: (v: unknown) => void;
        vi.mocked(navigator.credentials.create).mockReturnValue(
            new Promise(r => { resolveCreate = r; }) as never
        );
        const { result } = renderHook(() => usePasskeyAuth());
        act(() => { void result.current.registerPasskey('u', 'e@e.com', 'E'); });
        expect(result.current.loading).toBe(true);
        await act(async () => { resolveCreate(mockCredential); });
        expect(result.current.loading).toBe(false);
    });

    it('sets error state on failure', async () => {
        vi.mocked(navigator.credentials.create).mockRejectedValue(new Error('NotAllowedError'));
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.registerPasskey('u', 'e@e.com', 'E');
        });
        expect(result.current.error).toBeTruthy();
        expect(result.current.loading).toBe(false);
    });

    it('registerPasskey does NOT lock to platform authenticator (allows YubiKey/roaming keys)', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.registerPasskey('user-123', 'test@example.com', 'Test User');
        });
        const callArg = vi.mocked(navigator.credentials.create).mock.calls[0][0] as CredentialCreationOptions;
        const selection = callArg.publicKey?.authenticatorSelection;
        // Must NOT be 'platform' — that silently blocks YubiKey and all hardware FIDO2 keys
        expect(selection?.authenticatorAttachment).not.toBe('platform');
    });

    // ── GAP-011: Server-side challenge + assertion verification ──────────────

    it('registerPasskey fetches challenge from server before calling credentials.create', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.registerPasskey('user-123', 'test@example.com', 'Test User');
        });
        expect(mockIssueChallenge).toHaveBeenCalledWith({ purpose: 'register' });
        expect(navigator.credentials.create).toHaveBeenCalledTimes(1);
    });

    it('registerPasskey uses server-issued challenge in publicKey.challenge', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.registerPasskey('user-123', 'test@example.com', 'Test User');
        });
        const callArg = vi.mocked(navigator.credentials.create).mock.calls[0][0] as CredentialCreationOptions;
        // challenge must NOT be a local random buffer — it must come from server response
        expect(callArg.publicKey?.challenge).toBeDefined();
    });

    it('registerPasskey sends attestation to completePasskeyRegistration', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.registerPasskey('user-123', 'test@example.com', 'Test User');
        });
        expect(mockCompleteRegistration).toHaveBeenCalledWith(
            expect.objectContaining({
                challengeId: 'chal-server-1',
                credential: expect.objectContaining({
                    id: 'cred-123',
                }),
            })
        );
    });

    it('registerPasskey returns server-verified credentialId', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        let credId: string | null = null;
        await act(async () => {
            credId = await result.current.registerPasskey('user-123', 'test@example.com', 'Test User');
        });
        expect(credId).toBe('server-verified-cred-id');
    });

    it('authenticateWithPasskey fetches challenge from server before credentials.get', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.authenticateWithPasskey();
        });
        expect(mockIssueChallenge).toHaveBeenCalledWith({ purpose: 'authenticate' });
        expect(navigator.credentials.get).toHaveBeenCalledTimes(1);
    });

    it('authenticateWithPasskey calls verifyPasskeyAssertion with assertion response', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.authenticateWithPasskey('cred-123');
        });
        expect(mockVerifyAssertion).toHaveBeenCalledWith(
            expect.objectContaining({
                challengeId: 'chal-server-1',
                credentialId: 'cred-123',
            })
        );
    });

    it('authenticateWithPasskey calls signInWithCustomToken with returned token', async () => {
        const { result } = renderHook(() => usePasskeyAuth());
        await act(async () => {
            await result.current.authenticateWithPasskey();
        });
        expect(signInWithCustomToken).toHaveBeenCalledWith(expect.anything(), 'firebase-custom-token');
    });

    it('authenticateWithPasskey returns UserCredential from signInWithCustomToken', async () => {
        const mockUserCred = { user: { uid: 'u-123' } };
        vi.mocked(signInWithCustomToken).mockResolvedValueOnce(mockUserCred as never);
        const { result } = renderHook(() => usePasskeyAuth());
        let cred: unknown;
        await act(async () => {
            cred = await result.current.authenticateWithPasskey();
        });
        expect(cred).toEqual(mockUserCred);
    });
});
