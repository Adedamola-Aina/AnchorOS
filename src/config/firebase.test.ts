// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
    initializeApp: vi.fn(),
    initializeAuth: vi.fn(),
    initializeAppCheck: vi.fn(),
    ReCaptchaEnterpriseProvider: vi.fn(),
    initializeFirestore: vi.fn(),
    memoryLocalCache: vi.fn(),
    getFunctions: vi.fn(),
    getMessaging: vi.fn(),
    connectAuthEmulator: vi.fn(),
    connectFirestoreEmulator: vi.fn(),
    connectFunctionsEmulator: vi.fn(),
    getStorage: vi.fn(),
    connectStorageEmulator: vi.fn(),
}));

vi.mock('firebase/app', () => ({
    initializeApp: (...args: unknown[]) => mockState.initializeApp(...args),
}));

vi.mock('firebase/auth', () => ({
    initializeAuth: (...args: unknown[]) => mockState.initializeAuth(...args),
    browserLocalPersistence: 'browser-local-persistence',
    browserPopupRedirectResolver: 'browser-popup-redirect-resolver',
    connectAuthEmulator: (...args: unknown[]) => mockState.connectAuthEmulator(...args),
}));

vi.mock('firebase/app-check', () => ({
    initializeAppCheck: (...args: unknown[]) => mockState.initializeAppCheck(...args),
    ReCaptchaEnterpriseProvider: function ReCaptchaEnterpriseProvider(siteKey: string) {
        return mockState.ReCaptchaEnterpriseProvider(siteKey);
    },
}));

vi.mock('firebase/firestore', () => ({
    initializeFirestore: (...args: unknown[]) => mockState.initializeFirestore(...args),
    memoryLocalCache: (...args: unknown[]) => mockState.memoryLocalCache(...args),
    connectFirestoreEmulator: (...args: unknown[]) => mockState.connectFirestoreEmulator(...args),
}));

vi.mock('firebase/functions', () => ({
    getFunctions: (...args: unknown[]) => mockState.getFunctions(...args),
    connectFunctionsEmulator: (...args: unknown[]) => mockState.connectFunctionsEmulator(...args),
}));

vi.mock('firebase/messaging', () => ({
    getMessaging: (...args: unknown[]) => mockState.getMessaging(...args),
}));

vi.mock('firebase/storage', () => ({
    getStorage: (...args: unknown[]) => mockState.getStorage(...args),
    connectStorageEmulator: (...args: unknown[]) => mockState.connectStorageEmulator(...args),
}));

function setBaseEnv(overrides: Record<string, string> = {}) {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'api-key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'auth.domain');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'demo-anchor-os');
    vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'bucket');
    vi.stubEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'sender-id');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'app-id');
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'measurement-id');
    vi.stubEnv('VITE_APP_ENV', 'development');
    vi.stubEnv('DEV', 'true');
    vi.stubEnv('VITE_FIREBASE_APP_CHECK_SITE_KEY', '');
    vi.stubEnv('VITE_APP_CHECK_DEBUG_TOKEN', '');

    // Deterministic browser hostname (the app derives the emulator host from
    // window.location.hostname in development). happy-dom defaults to
    // 'localhost'; individual tests override via setBrowserHostname.
    setBrowserHostname('localhost');

    for (const [key, value] of Object.entries(overrides)) {
        vi.stubEnv(key, value);
    }
}

function setBrowserHostname(hostname: string) {
    Object.defineProperty(window, 'location', {
        value: { hostname },
        configurable: true,
        writable: true,
    });
}

describe('firebase config module', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        vi.unstubAllEnvs();

        mockState.initializeApp.mockReturnValue({ app: 'firebase-app' });
        mockState.initializeAuth.mockReturnValue({ auth: 'firebase-auth' });
        mockState.memoryLocalCache.mockReturnValue({ cache: 'memory' });
        mockState.initializeFirestore.mockReturnValue({ db: 'firestore' });
        mockState.getFunctions.mockReturnValue({ functions: 'region' });
        mockState.getMessaging.mockReturnValue({ messaging: 'instance' });
        mockState.ReCaptchaEnterpriseProvider.mockImplementation((siteKey: string) => ({ siteKey }));
        mockState.initializeAppCheck.mockReturnValue(undefined);
    });

    it('initializes core firebase services and wires ALL SDKs to the emulators in development', async () => {
        setBaseEnv({ VITE_FIREBASE_VAPID_KEY: 'vapid-key' });

        const module = await import('./firebase');

        expect(mockState.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({
                apiKey: 'api-key',
                projectId: 'demo-anchor-os',
                measurementId: 'measurement-id',
            }),
        );
        expect(mockState.initializeAuth).toHaveBeenCalledWith(
            { app: 'firebase-app' },
            { persistence: 'browser-local-persistence', popupRedirectResolver: 'browser-popup-redirect-resolver' },
        );
        expect(mockState.initializeFirestore).toHaveBeenCalledWith(
            { app: 'firebase-app' },
            { localCache: { cache: 'memory' } },
        );
        expect(mockState.getFunctions).toHaveBeenCalledWith({ app: 'firebase-app' }, 'us-central1');

        // Development = emulator: Auth/Firestore/Functions wired exactly once.
        expect(mockState.connectAuthEmulator).toHaveBeenCalledTimes(1);
        expect(mockState.connectAuthEmulator).toHaveBeenCalledWith(
            { auth: 'firebase-auth' },
            'http://127.0.0.1:9099',
            { disableWarnings: true },
        );
        expect(mockState.connectFirestoreEmulator).toHaveBeenCalledTimes(1);
        expect(mockState.connectFirestoreEmulator).toHaveBeenCalledWith(
            { db: 'firestore' }, '127.0.0.1', 8080,
        );
        expect(mockState.connectFunctionsEmulator).toHaveBeenCalledTimes(1);
        expect(mockState.connectFunctionsEmulator).toHaveBeenCalledWith(
            { functions: 'region' }, '127.0.0.1', 5001,
        );

        // Messaging is lazy — not initialized at module load, only on demand
        expect(mockState.getMessaging).not.toHaveBeenCalled();
        expect(mockState.initializeAppCheck).not.toHaveBeenCalled();

        expect(module.APP_ID).toBe('anchor-os');
        expect(module.auth).toEqual({ auth: 'firebase-auth' });
        expect(module.db).toEqual({ db: 'firestore' });
        expect(module.functions).toEqual({ functions: 'region' });
        // FCM is DISABLED in emulator development even when a VAPID key exists
        expect(await module.getMessagingInstance()).toBeNull();
        expect(mockState.getMessaging).not.toHaveBeenCalled();
    });

    it('connects the dynamically-created Storage instance to the emulator in development', async () => {
        setBaseEnv();

        const module = await import('./firebase');
        const storage = await module.getAppStorage();

        expect(mockState.getStorage).toHaveBeenCalledWith({ app: 'firebase-app' });
        expect(mockState.connectStorageEmulator).toHaveBeenCalledTimes(1);
        expect(mockState.connectStorageEmulator).toHaveBeenCalledWith(storage, '127.0.0.1', 9199);
        // Idempotent: a second call reuses the memoized instance (no re-connect)
        await module.getAppStorage();
        expect(mockState.getStorage).toHaveBeenCalledTimes(1);
        expect(mockState.connectStorageEmulator).toHaveBeenCalledTimes(1);
    });

    it('fails fast in development when configured with a real/cloud project ID', async () => {
        setBaseEnv({ VITE_FIREBASE_PROJECT_ID: 'anchor-os' });
        const errSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

        await expect(import('./firebase')).rejects.toThrow(/demo-anchor-os/);
        expect(mockState.initializeApp).not.toHaveBeenCalled();
        expect(mockState.connectAuthEmulator).not.toHaveBeenCalled();
        errSpy.mockRestore();
    });

    it('fails fast in development when the project ID is unset', async () => {
        setBaseEnv({ VITE_FIREBASE_PROJECT_ID: '' });
        const errSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

        await expect(import('./firebase')).rejects.toThrow(/demo-anchor-os/);
        errSpy.mockRestore();
    });

    it('does NOT initialize App Check in emulator development even when a site key is present', async () => {
        setBaseEnv({ VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key' });

        await import('./firebase');

        expect(mockState.initializeAppCheck).not.toHaveBeenCalled();
        expect(mockState.ReCaptchaEnterpriseProvider).not.toHaveBeenCalled();
    });

    it('initializes App Check but never writes a debug token in staging', async () => {
        setBaseEnv({
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            VITE_APP_CHECK_DEBUG_TOKEN: 'true',
            DEV: 'false',
            VITE_APP_ENV: 'staging',
        });

        const tokenWindow = window as Window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean };
        delete tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN;

        await import('./firebase');

        expect(mockState.ReCaptchaEnterpriseProvider).toHaveBeenCalledWith('site-key');
        expect(mockState.initializeAppCheck).toHaveBeenCalledWith(
            { app: 'firebase-app' },
            {
                provider: { siteKey: 'site-key' },
                isTokenAutoRefreshEnabled: true,
            },
        );
        expect(tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN).toBeUndefined();
    });

    it('never activates a debug token in staging builds (DEV=false, APP_ENV=staging)', async () => {
        setBaseEnv({
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            VITE_APP_CHECK_DEBUG_TOKEN: 'my-staging-token',
            DEV: 'false',
            VITE_APP_ENV: 'staging',
        });

        const tokenWindow = window as Window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean };
        delete tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN;

        await import('./firebase');

        expect(tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN).toBeUndefined();
        expect(mockState.initializeAppCheck).toHaveBeenCalled();
    });

    it('honours a debug token only in emulator development (local/test infrastructure)', async () => {
        setBaseEnv({
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            VITE_APP_CHECK_DEBUG_TOKEN: 'local-dev-token',
            DEV: 'true',
            VITE_APP_ENV: 'development',
        });

        const tokenWindow = window as Window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean };
        delete tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN;

        await import('./firebase');

        expect(tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN).toBe('local-dev-token');
        // App Check itself stays disabled in emulator development.
        expect(mockState.initializeAppCheck).not.toHaveBeenCalled();
    });

    it('suppresses debug token in production builds', async () => {
        setBaseEnv({
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            VITE_APP_CHECK_DEBUG_TOKEN: 'should-be-ignored',
            DEV: 'false',
            VITE_APP_ENV: 'production',
        });

        const tokenWindow = window as Window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean };
        delete tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN;

        await import('./firebase');

        expect(tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN).toBeUndefined();
        expect(mockState.initializeAppCheck).toHaveBeenCalled();
    });

    it('swallows App Check failures and falls back when messaging is unsupported (staging)', async () => {
        setBaseEnv({
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            VITE_FIREBASE_VAPID_KEY: 'vapid-key',
            DEV: 'false',
            VITE_APP_ENV: 'staging',
        });
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        mockState.initializeAppCheck.mockImplementation(() => {
            throw new Error('app-check-failed');
        });
        mockState.getMessaging.mockImplementation(() => {
            throw new Error('messaging-unsupported');
        });

        const module = await import('./firebase');

        expect(warnSpy).toHaveBeenCalledWith('[Firebase] App Check initialization failed');
        expect(await module.getMessagingInstance()).toBeNull();
        expect(warnSpy).toHaveBeenCalledWith('[Firebase] Messaging not initialized (environment may not support it)');
    });

    it('resolves messaging to null when no VAPID key is configured (staging)', async () => {
        setBaseEnv({ VITE_FIREBASE_VAPID_KEY: '', VITE_APP_ENV: 'staging' });

        await import('./firebase').then(async (m) => {
            expect(await m.getMessagingInstance()).toBeNull();
        });
        expect(mockState.getMessaging).not.toHaveBeenCalled();
    });

    it('STAGING never connects to emulators (cloud behavior unchanged)', async () => {
        setBaseEnv({
            VITE_APP_ENV: 'staging',
            VITE_FIREBASE_PROJECT_ID: 'anchor-os-staging',
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
        });

        const module = await import('./firebase');

        expect(mockState.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({ projectId: 'anchor-os-staging' }),
        );
        expect(mockState.connectAuthEmulator).not.toHaveBeenCalled();
        expect(mockState.connectFirestoreEmulator).not.toHaveBeenCalled();
        expect(mockState.connectFunctionsEmulator).not.toHaveBeenCalled();
        expect(mockState.connectStorageEmulator).not.toHaveBeenCalled();
        // App Check still runs in staging
        expect(mockState.initializeAppCheck).toHaveBeenCalled();
        // Storage instance created without any emulator wiring
        await module.getAppStorage();
        expect(mockState.getStorage).toHaveBeenCalled();
        expect(mockState.connectStorageEmulator).not.toHaveBeenCalled();
    });

    it('PRODUCTION never connects to emulators (cloud behavior unchanged)', async () => {
        setBaseEnv({
            VITE_APP_ENV: 'production',
            VITE_FIREBASE_PROJECT_ID: 'anchor-os',
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            DEV: 'false',
        });

        await import('./firebase');

        expect(mockState.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({ projectId: 'anchor-os' }),
        );
        expect(mockState.connectAuthEmulator).not.toHaveBeenCalled();
        expect(mockState.connectFirestoreEmulator).not.toHaveBeenCalled();
        expect(mockState.connectFunctionsEmulator).not.toHaveBeenCalled();
        expect(mockState.connectStorageEmulator).not.toHaveBeenCalled();
        expect(mockState.initializeAppCheck).toHaveBeenCalled();
    });

    // --- Emulator host selection (simple Tailscale dev access) -----------------

    it('resolveEmulatorHost maps loopback browser hostnames to 127.0.0.1', async () => {
        setBaseEnv();
        const { resolveEmulatorHost } = await import('./firebase');

        expect(resolveEmulatorHost('localhost')).toBe('127.0.0.1');
        expect(resolveEmulatorHost('127.0.0.1')).toBe('127.0.0.1');
        expect(resolveEmulatorHost('::1')).toBe('127.0.0.1');
        expect(resolveEmulatorHost('[::1]')).toBe('127.0.0.1');
        expect(resolveEmulatorHost('LOCALHOST')).toBe('127.0.0.1');
        expect(resolveEmulatorHost(undefined)).toBe('127.0.0.1');
        expect(resolveEmulatorHost(null)).toBe('127.0.0.1');
        expect(resolveEmulatorHost('')).toBe('127.0.0.1');
    });

    it('resolveEmulatorHost passes remote hostnames (e.g. Tailscale) through unchanged', async () => {
        setBaseEnv();
        const { resolveEmulatorHost } = await import('./firebase');

        expect(resolveEmulatorHost('anchor.tail2fa2e.ts.net')).toBe('anchor.tail2fa2e.ts.net');
        expect(resolveEmulatorHost('Anchor.Tail2fa2e.TS.net')).toBe('anchor.tail2fa2e.ts.net');
        expect(resolveEmulatorHost('mybox.example.com')).toBe('mybox.example.com');
    });

    it('dials the emulators at the Tailscale hostname when the page is loaded over Tailscale', async () => {
        setBaseEnv();
        setBrowserHostname('anchor.tail2fa2e.ts.net');

        const module = await import('./firebase');

        // Project identity stays hard-locked to the demo project
        expect(mockState.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({ projectId: 'demo-anchor-os' }),
        );
        // ...while every emulator client dials the Tailscale hostname
        expect(mockState.connectAuthEmulator).toHaveBeenCalledWith(
            { auth: 'firebase-auth' },
            'http://anchor.tail2fa2e.ts.net:9099',
            { disableWarnings: true },
        );
        expect(mockState.connectFirestoreEmulator).toHaveBeenCalledWith(
            { db: 'firestore' }, 'anchor.tail2fa2e.ts.net', 8080,
        );
        expect(mockState.connectFunctionsEmulator).toHaveBeenCalledWith(
            { functions: 'region' }, 'anchor.tail2fa2e.ts.net', 5001,
        );
        const storage = await module.getAppStorage();
        expect(mockState.connectStorageEmulator).toHaveBeenCalledWith(
            storage, 'anchor.tail2fa2e.ts.net', 9199,
        );
    });

    it('staging/production NEVER use the browser hostname for emulator wiring', async () => {
        setBaseEnv({
            VITE_APP_ENV: 'staging',
            VITE_FIREBASE_PROJECT_ID: 'anchor-os-staging',
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
        });
        setBrowserHostname('anchor.tail2fa2e.ts.net');

        const module = await import('./firebase');

        expect(mockState.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({ projectId: 'anchor-os-staging' }),
        );
        expect(mockState.connectAuthEmulator).not.toHaveBeenCalled();
        expect(mockState.connectFirestoreEmulator).not.toHaveBeenCalled();
        expect(mockState.connectFunctionsEmulator).not.toHaveBeenCalled();
        await module.getAppStorage();
        expect(mockState.connectStorageEmulator).not.toHaveBeenCalled();
    });
});