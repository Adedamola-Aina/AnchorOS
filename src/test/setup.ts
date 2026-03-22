// @ts-nocheck
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ============================================================================
// GLOBAL FIREBASE MOCKS FOR ALL TESTS
// These provide sensible defaults - individual tests can override with vi.mock
// ============================================================================

// Mock Firebase App
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApp: vi.fn(),
    getApps: vi.fn(() => []),
}));

// Mock Firebase Auth with MFA support
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({ currentUser: null })),
    initializeAuth: vi.fn(() => ({ currentUser: null })),
    browserLocalPersistence: { type: 'LOCAL' },
    browserPopupRedirectResolver: { type: 'POPUP_REDIRECT' },
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    sendEmailVerification: vi.fn(),
    multiFactor: vi.fn(() => ({
        enrolledFactors: [],
        getSession: vi.fn(() => Promise.resolve('mock-session')),
        enroll: vi.fn(() => Promise.resolve()),
        unenroll: vi.fn(() => Promise.resolve()),
    })),
    // TotpMultiFactorGenerator mock for MFA tests
    TotpMultiFactorGenerator: {
        generateSecret: vi.fn(() => Promise.resolve({
            secretKey: 'MOCK_SECRET_KEY_BASE32',
            generateQrCodeUrl: vi.fn(() => 'otpauth://totp/Anchor:test@test.com?secret=MOCK'),
            codeLength: 6,
            codeIntervalSeconds: 30,
            hashingAlgorithm: 'SHA1',
        })),
        assertionForEnrollment: vi.fn(() => ({ factorId: 'totp' })),
        assertionForSignIn: vi.fn(() => ({ factorId: 'totp' })),
    },
    MultiFactorResolver: vi.fn(),
    reauthenticateWithCredential: vi.fn(() => Promise.resolve()),
    EmailAuthProvider: {
        credential: vi.fn(() => ({})),
    },
    sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
}));

// Mock Firebase Functions with proper httpsCallable structure
vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(() => ({})),
    // httpsCallable returns a FUNCTION that when called returns a Promise
    httpsCallable: vi.fn((functions, name) => {
        // Return a callable function that returns mock data based on function name
        return vi.fn(async () => {
            // Default mock responses for known functions
            const mockResponses: Record<string, any> = {
                'getSharedAccounts': { accounts: [], transactions: [] },
                'shareAccount': { success: true },
                'disconnectFamily': { success: true },
                'createInvitation': { inviteToken: 'mock-token', inviteId: 'mock-id' },
                'acceptInvitation': { success: true },
                'confirmConnection': { success: true },
                'validateToken': { valid: true, ownerName: 'Test Owner' },
                'revokeInvitation': { success: true },
            };
            return { data: mockResponses[name] || {} };
        });
    }),
    connectFunctionsEmulator: vi.fn(),
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
    doc: vi.fn((db, ...paths) => ({ path: paths.join('/') })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
    setDoc: vi.fn(() => Promise.resolve()),
    getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
    getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    query: vi.fn((ref, ...constraints) => ({ ...ref, _constraints: constraints })),
    where: vi.fn((...args) => ({ type: 'where', args })),
    orderBy: vi.fn((...args) => ({ type: 'orderBy', args })),
    onSnapshot: vi.fn(() => () => { }),
    limit: vi.fn((n) => ({ type: 'limit', n })),
    enableIndexedDbPersistence: vi.fn(() => Promise.resolve()),
    increment: vi.fn((n) => ({ _increment: n })),
    writeBatch: vi.fn(() => ({
        update: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
        commit: vi.fn(() => Promise.resolve()),
    })),
    deleteField: vi.fn(() => 'DELETE_FIELD'),
    initializeFirestore: vi.fn(() => ({})),
    memoryLocalCache: vi.fn(),
    runTransaction: vi.fn(async (db, callback) => {
        const tx = {
            get: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
            set: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };
        return callback(tx);
    }),
    serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
}));

// Mock ResizeObserver for @tanstack/react-virtual
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
