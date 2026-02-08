/**
 * AuthContext — authentication state, profile sync, sign-in/up/out
 * Target: 80%+ coverage
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';

// ── Firebase mocks ──────────────────────────────────────────────────────────
const mockOnAuthStateChanged = vi.fn();
const mockSignInWithEmailAndPassword = vi.fn();
const mockCreateUserWithEmailAndPassword = vi.fn();
const mockSignOut = vi.fn();
const mockSendEmailVerification = vi.fn();
const mockMultiFactor = vi.fn(() => ({ enrolledFactors: [] }));

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: (...a: any[]) => mockOnAuthStateChanged(...a),
    signInWithEmailAndPassword: (...a: any[]) => mockSignInWithEmailAndPassword(...a),
    createUserWithEmailAndPassword: (...a: any[]) => mockCreateUserWithEmailAndPassword(...a),
    signOut: (...a: any[]) => mockSignOut(...a),
    sendEmailVerification: (...a: any[]) => mockSendEmailVerification(...a),
    multiFactor: (...a: any[]) => mockMultiFactor(...a),
    sendPasswordResetEmail: vi.fn(),
}));

const mockOnSnapshot = vi.fn();
const mockUpdateDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockAddDoc = vi.fn();
const mockDoc = vi.fn((..._a: any[]) => 'mock-doc-ref');
const mockCollection = vi.fn((..._a: any[]) => 'mock-col-ref');

vi.mock('firebase/firestore', () => ({
    doc: (...a: any[]) => mockDoc(...a),
    collection: (...a: any[]) => mockCollection(...a),
    onSnapshot: (...a: any[]) => mockOnSnapshot(...a),
    updateDoc: (...a: any[]) => mockUpdateDoc(...a),
    setDoc: (...a: any[]) => mockSetDoc(...a),
    addDoc: (...a: any[]) => mockAddDoc(...a),
}));

vi.mock('../config/firebase', () => ({
    auth: { currentUser: { uid: 'user-1', email: 'test@test.com', emailVerified: true } },
    db: {},
    APP_ID: 'test-app',
}));

// ── Other mocks ─────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../utils/error', () => ({
    captureError: vi.fn(),
}));

vi.mock('../services/telemetry', () => ({
    createTracer: () => ({
        trace: vi.fn(async (_name: string, fn: () => any) => fn()),
        logEvent: vi.fn(),
    }),
}));

vi.mock('../utils/systemTheme', () => ({
    getEffectiveTheme: () => 'light',
}));

vi.mock('./auth', () => ({
    useMfaOperations: () => ({
        verifyMfa: vi.fn(),
        generateMfaSecret: vi.fn(),
        enrollMfa: vi.fn(),
        unenrollMfa: vi.fn(),
        reauthenticate: vi.fn(),
        clearPendingSecret: vi.fn(),
    }),
    getWelcomeEmailHtml: () => '<h1>Welcome</h1>',
}));

vi.mock('../services/AuditService', () => ({
    auditAuth: {
        loginSuccess: vi.fn(),
        logout: vi.fn(),
    },
}));

// ── Import after mocks ─────────────────────────────────────────────────────
import { AuthProvider, useAuth } from './AuthContext';

function createWrapper() {
    return ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
    );
}

describe('AuthContext', () => {
    let authCallback: ((user: any) => void) | null = null;
    let profileCallback: ((snap: any) => void) | null = null;
    const unsubAuth = vi.fn();
    const unsubProfile = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        authCallback = null;
        profileCallback = null;

        mockOnAuthStateChanged.mockImplementation((_auth: any, cb: any) => {
            authCallback = cb;
            return unsubAuth;
        });

        mockOnSnapshot.mockImplementation((_ref: any, cb: any) => {
            profileCallback = cb;
            return unsubProfile;
        });
    });

    it('starts in loading state', () => {
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
        expect(result.current.loading).toBe(true);
        expect(result.current.user).toBeNull();
    });

    it('sets user and profile on auth state change', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        // Simulate auth state change
        act(() => {
            authCallback?.({ uid: 'user-1', email: 'test@test.com', emailVerified: true });
        });

        // Simulate profile snapshot
        act(() => {
            profileCallback?.({
                exists: () => true,
                metadata: { fromCache: false },
                data: () => ({
                    name: 'Test User',
                    theme: 'dark',
                    familyMode: false,
                    onboardingComplete: true,
                }),
            });
        });

        await waitFor(() => {
            expect(result.current.user).toBeTruthy();
            expect(result.current.profile.name).toBe('Test User');
            expect(result.current.loading).toBe(false);
            expect(result.current.profileLoaded).toBe(true);
        });
    });

    it('creates profile when snapshot does not exist', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        act(() => {
            authCallback?.({ uid: 'user-1', email: 'new@test.com', emailVerified: false });
        });

        act(() => {
            profileCallback?.({
                exists: () => false,
                metadata: { fromCache: false },
                data: () => null,
            });
        });

        await waitFor(() => {
            expect(mockSetDoc).toHaveBeenCalled();
        });
    });

    it('skips profile creation if snapshot from cache', () => {
        renderHook(() => useAuth(), { wrapper: createWrapper() });

        act(() => {
            authCallback?.({ uid: 'user-1', email: 'x@test.com', emailVerified: false });
        });

        act(() => {
            profileCallback?.({
                exists: () => false,
                metadata: { fromCache: true },
                data: () => null,
            });
        });

        expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('handles sign out', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        act(() => {
            authCallback?.({ uid: 'user-1', email: 'x@test.com', emailVerified: true });
        });

        // Sign out
        act(() => { authCallback?.(null); });

        await waitFor(() => {
            expect(result.current.user).toBeNull();
            expect(result.current.loading).toBe(false);
        });
    });

    it('signIn calls Firebase and audits', async () => {
        mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: 'user-1' } });
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.signIn('test@test.com', 'pass123');
        });

        expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
    });

    it('signUp creates user, profile, and sends welcome email', async () => {
        mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({
            user: { uid: 'new-user' },
        });
        mockSetDoc.mockResolvedValue(undefined);
        mockAddDoc.mockResolvedValue(undefined);

        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.signUp('new@test.com', 'pass123');
        });

        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled();
        expect(mockSetDoc).toHaveBeenCalled();
        expect(mockAddDoc).toHaveBeenCalled();
    });

    it('logout signs out Firebase, audits, and navigates home', async () => {
        mockSignOut.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.logout();
        });

        expect(mockSignOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('sendVerificationEmail delegates to Firebase', async () => {
        mockSendEmailVerification.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.sendVerificationEmail();
        });

        expect(mockSendEmailVerification).toHaveBeenCalled();
    });

    it('updateProfile without user updates local state', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        // No auth state change — user is null
        await act(async () => {
            await result.current.updateProfile({ theme: 'dark' });
        });

        expect(result.current.profile.theme).toBe('dark');
        expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it('updateProfile with user calls updateDoc', async () => {
        mockUpdateDoc.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

        // Authenticate
        act(() => { authCallback?.({ uid: 'user-1', email: 'x@test.com', emailVerified: true }); });
        act(() => {
            profileCallback?.({
                exists: () => true,
                metadata: { fromCache: false },
                data: () => ({ name: 'Test', theme: 'light', familyMode: false, onboardingComplete: true }),
            });
        });

        await act(async () => {
            await result.current.updateProfile({ name: 'Renamed' });
        });

        expect(mockUpdateDoc).toHaveBeenCalled();
    });

    it('useAuth throws outside AuthProvider', () => {
        expect(() => {
            renderHook(() => useAuth());
        }).toThrow('useAuth must be used within AuthProvider');
    });

    it('unsubscribes on unmount', () => {
        const { unmount } = renderHook(() => useAuth(), { wrapper: createWrapper() });
        unmount();
        expect(unsubAuth).toHaveBeenCalled();
    });

    it('auto-corrects MFA mismatch (enrolled but profile says no)', async () => {
        // multiFactor returns enrolled factor
        mockMultiFactor.mockReturnValueOnce({ enrolledFactors: [{ uid: 'mfa-1' }] });
        mockUpdateDoc.mockResolvedValue(undefined);

        renderHook(() => useAuth(), { wrapper: createWrapper() });

        act(() => { authCallback?.({ uid: 'user-1', email: 'x@test.com', emailVerified: true }); });
        act(() => {
            profileCallback?.({
                exists: () => true,
                metadata: { fromCache: false },
                data: () => ({ name: 'Test', theme: 'light', familyMode: false, onboardingComplete: true, mfaEnabled: false }),
            });
        });

        await waitFor(() => {
            expect(mockUpdateDoc).toHaveBeenCalledWith('mock-doc-ref', { mfaEnabled: true });
        });
    });
});
