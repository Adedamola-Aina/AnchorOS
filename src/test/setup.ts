import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase for unit tests (will be overridden in integration tests)
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApp: vi.fn(),
    getApps: vi.fn(() => []),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(),
    httpsCallable: vi.fn(() => Promise.resolve(({ data: {} }))),
    connectFunctionsEmulator: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn(() => () => { }),
    limit: vi.fn((n) => n),
    enableIndexedDbPersistence: vi.fn(() => Promise.resolve()),
    increment: vi.fn((n) => n),
    writeBatch: vi.fn(() => ({
        update: vi.fn(),
        set: vi.fn(),
        commit: vi.fn(() => Promise.resolve()),
    })),
    deleteField: vi.fn(),
    initializeFirestore: vi.fn(() => ({})),
    memoryLocalCache: vi.fn(),
}));

// Mock ResizeObserver for @tanstack/react-virtual
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};
