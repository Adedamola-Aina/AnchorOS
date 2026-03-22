// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
    initializeApp: vi.fn(),
    initializeAuth: vi.fn(),
    initializeAppCheck: vi.fn(),
    ReCaptchaV3Provider: vi.fn(),
    initializeFirestore: vi.fn(),
    memoryLocalCache: vi.fn(),
    getFunctions: vi.fn(),
    getMessaging: vi.fn(),
}));

vi.mock('firebase/app', () => ({
    initializeApp: (...args: unknown[]) => mockState.initializeApp(...args),
}));

vi.mock('firebase/auth', () => ({
    initializeAuth: (...args: unknown[]) => mockState.initializeAuth(...args),
    browserLocalPersistence: 'browser-local-persistence',
    browserPopupRedirectResolver: 'browser-popup-redirect-resolver',
}));

vi.mock('firebase/app-check', () => ({
    initializeAppCheck: (...args: unknown[]) => mockState.initializeAppCheck(...args),
    ReCaptchaV3Provider: function ReCaptchaV3Provider(siteKey: string) {
        return mockState.ReCaptchaV3Provider(siteKey);
    },
}));

vi.mock('firebase/firestore', () => ({
    initializeFirestore: (...args: unknown[]) => mockState.initializeFirestore(...args),
    memoryLocalCache: (...args: unknown[]) => mockState.memoryLocalCache(...args),
}));

vi.mock('firebase/functions', () => ({
    getFunctions: (...args: unknown[]) => mockState.getFunctions(...args),
}));

vi.mock('firebase/messaging', () => ({
    getMessaging: (...args: unknown[]) => mockState.getMessaging(...args),
}));

function setBaseEnv(overrides: Record<string, string> = {}) {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'api-key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'auth.domain');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'project-id');
    vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'bucket');
    vi.stubEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'sender-id');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'app-id');
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'measurement-id');
    vi.stubEnv('VITE_APP_ENV', 'dev');
    vi.stubEnv('DEV', 'true');
    vi.stubEnv('VITE_FIREBASE_APP_CHECK_SITE_KEY', '');
    vi.stubEnv('VITE_APP_CHECK_DEBUG_TOKEN', '');

    for (const [key, value] of Object.entries(overrides)) {
        vi.stubEnv(key, value);
    }
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
        mockState.ReCaptchaV3Provider.mockImplementation((siteKey: string) => ({ siteKey }));
        mockState.initializeAppCheck.mockReturnValue(undefined);
    });

    it('initializes core firebase services and exports messaging when supported', async () => {
        setBaseEnv();

        const module = await import('./firebase');

        expect(mockState.initializeApp).toHaveBeenCalledWith(
            expect.objectContaining({
                apiKey: 'api-key',
                projectId: 'project-id',
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
        expect(mockState.getMessaging).toHaveBeenCalledWith({ app: 'firebase-app' });
        expect(mockState.initializeAppCheck).not.toHaveBeenCalled();

        expect(module.APP_ID).toBe('anchor-os');
        expect(module.auth).toEqual({ auth: 'firebase-auth' });
        expect(module.db).toEqual({ db: 'firestore' });
        expect(module.functions).toEqual({ functions: 'region' });
        expect(module.messaging).toEqual({ messaging: 'instance' });
    });

    it('initializes App Check and writes debug token when site key is provided', async () => {
        setBaseEnv({
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            VITE_APP_CHECK_DEBUG_TOKEN: 'true',
            DEV: 'true',
        });

        const tokenWindow = window as Window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean };
        delete tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN;

        await import('./firebase');

        expect(mockState.ReCaptchaV3Provider).toHaveBeenCalledWith('site-key');
        expect(mockState.initializeAppCheck).toHaveBeenCalledWith(
            { app: 'firebase-app' },
            {
                provider: { siteKey: 'site-key' },
                isTokenAutoRefreshEnabled: true,
            },
        );
        expect(tokenWindow.FIREBASE_APPCHECK_DEBUG_TOKEN).toBe(true);
    });

    it('swallows App Check failures and falls back when messaging is unsupported', async () => {
        setBaseEnv({
            VITE_FIREBASE_APP_CHECK_SITE_KEY: 'site-key',
            DEV: 'false',
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
        expect(warnSpy).toHaveBeenCalledWith('[Firebase] Messaging not initialized (environment may not support it)');
        expect(module.messaging).toBeUndefined();
    });
});