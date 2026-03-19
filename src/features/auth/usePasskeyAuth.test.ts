/**
 * usePasskeyAuth — AUTH-002
 * Tests: WebAuthn passkey registration and authentication
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

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

import { usePasskeyAuth } from './usePasskeyAuth';

describe('usePasskeyAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(navigator.credentials.create).mockResolvedValue(mockCredential as never);
        vi.mocked(navigator.credentials.get).mockResolvedValue(mockAssertion as never);
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
});
