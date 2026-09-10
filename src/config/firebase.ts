// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  connectAuthEmulator,
} from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// ============================================================================
// ENVIRONMENT CONTRACT
//
//   development = Firebase Emulator Suite under the local demo project
//                 identity "demo-anchor-os". Development NEVER talks to a
//                 real/cloud Firebase project.
//   staging     = anchor-os-staging (cloud)
//   production  = anchor-os (cloud)
// ============================================================================

/** The ONLY project identity allowed in emulator development. */
export const DEMO_PROJECT_ID = 'demo-anchor-os';

const EMULATOR_PORTS = { auth: 9099, firestore: 8080, functions: 5001, storage: 9199 } as const;

/**
 * Development-only emulator host selection.
 *
 * The Firebase emulators listen on 0.0.0.0, so the app can reach them by
 * whatever hostname the browser used to load the page:
 *   - localhost / 127.0.0.1 / ::1   ->  127.0.0.1 (loopback)
 *   - anchor.tail2fa2e.ts.net       ->  the Tailscale hostname itself
 *
 * Any other hostname passes through unchanged. This only decides which
 * interface the EMULATOR clients dial in development — the project identity
 * stays hard-locked to demo-anchor-os, the fail-closed checks below are
 * unaffected, and staging/production never use this path.
 */
export function resolveEmulatorHost(browserHostname?: string | null): string {
  if (!browserHostname) return '127.0.0.1';
  const host = String(browserHostname).trim().toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]') {
    return '127.0.0.1';
  }
  return host;
}

function currentBrowserHostname(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.location?.hostname ?? null;
  } catch {
    return null;
  }
}

// Environment-based Firebase configuration
// All values come from .env.development, .env.staging, or .env.production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

// Log which environment we're connecting to
const env = import.meta.env.VITE_APP_ENV || 'production';
// Emulator-only development. There is deliberately NO flag that lets
// development silently fall back to a cloud Firebase project.
const isEmulatorDevelopment = env === 'development';

// Fail fast: development MUST run against the local demo project. A real
// (cloud) project ID here would silently send local traffic to a live
// Firebase project — the exact accident this contract exists to prevent.
if (isEmulatorDevelopment && firebaseConfig.projectId !== DEMO_PROJECT_ID) {
  throw new Error(
    `[Firebase] Development is emulator-only and requires VITE_FIREBASE_PROJECT_ID="${DEMO_PROJECT_ID}". ` +
    `Got: "${firebaseConfig.projectId ?? '(unset)'}". ` +
    `Copy .env.example to .env.development and never use real staging/production project IDs in development.`,
  );
}

if (import.meta.env.DEV) console.info(`[Firebase] Initializing for ${env} environment (${firebaseConfig.projectId})...`);

// Emulator host follows the browser hostname (see resolveEmulatorHost) so the
// same dev server works locally (localhost) and over Tailscale. Cloud
// environments (staging/production) never use this value.
const EMULATOR_HOST = isEmulatorDevelopment ? resolveEmulatorHost(currentBrowserHostname()) : '127.0.0.1';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize App Check when a site key is configured — but NEVER in emulator
// development: the emulator does not validate App Check assertions and there
// is no real site key locally.
// This protects Firestore/Functions from scripted abuse in web environments.
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY as string | undefined;
if (!isEmulatorDevelopment && appCheckSiteKey && typeof window !== 'undefined' && window.location.protocol !== 'capacitor:') {
  const debugToken = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN as string | undefined;
  // Allow debug token in dev and staging — never in production (VITE_APP_ENV=production)
  if (debugToken && import.meta.env.VITE_APP_ENV !== 'production') {
    (window as Window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN =
      debugToken === 'true' ? true : debugToken;
  }

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
    if (import.meta.env.DEV) console.info('[Firebase] App Check initialized');
  } catch (_e) {
    console.warn('[Firebase] App Check initialization failed');
  }
}

// PLT-001: Always use browserLocalPersistence (localStorage-based).
// getAuth() defaults to indexedDB persistence which hangs in Capacitor's
// capacitor:// origin WebView. browserLocalPersistence works everywhere
// and is sufficient for auth token storage.
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

// Initialize Firestore with modern persistence (replaces deprecated enableIndexedDbPersistence)
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator } from 'firebase/firestore';

export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});

import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// APP_ID is always 'anchor-os' for consistent Firestore data paths
// The actual Firebase project is determined by projectId
export const APP_ID = 'anchor-os';
export const functions = getFunctions(app, 'us-central1'); // Region must match function deployment

// ----------------------------------------------------------------------------
// Emulator wiring (development only).
// Module-level execution = each SDK instance is connected exactly once.
// ----------------------------------------------------------------------------
if (isEmulatorDevelopment) {
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`, { disableWarnings: true });
  connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORTS.firestore);
  connectFunctionsEmulator(functions, EMULATOR_HOST, EMULATOR_PORTS.functions);
  if (import.meta.env.DEV) {
    console.info(
      `[Firebase] Development emulator wiring: auth=${EMULATOR_HOST}:${EMULATOR_PORTS.auth} ` +
      `firestore=${EMULATOR_HOST}:${EMULATOR_PORTS.firestore} ` +
      `functions=${EMULATOR_HOST}:${EMULATOR_PORTS.functions} ` +
      `storage=${EMULATOR_HOST}:${EMULATOR_PORTS.storage}`,
    );
  }
}

// PERFORMANCE: Storage and Messaging SDKs are dynamically imported so they are
// NOT part of the eagerly-loaded startup bundle. They are only needed on
// authenticated screens (avatar/artwork upload) or after the user grants
// notification permission, so loading them on demand keeps first paint fast.
import type { Messaging } from 'firebase/messaging';
import type { FirebaseStorage } from 'firebase/storage';

let storagePromise: Promise<FirebaseStorage> | null = null;
export function getAppStorage(): Promise<FirebaseStorage> {
  if (!storagePromise) {
    storagePromise = import('firebase/storage').then(({ getStorage, connectStorageEmulator }) => {
      const storage = getStorage(app);
      // The dynamically-created Storage instance must also be wired to the
      // local emulator in development — before any caller can use it.
      if (isEmulatorDevelopment) {
        connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORTS.storage);
      }
      return storage;
    });
  }
  return storagePromise;
}

// Initialize Messaging only when VAPID key is configured.
// Without a valid VAPID key, getToken() fails with 401 and also pollutes
// httpsCallable context (Firebase SDK auto-fetches FCM token for callables).
//
// In emulator development Messaging ALWAYS resolves to null: no cloud FCM
// token is requested and no push strategy exists for the local emulator
// suite. If that ever changes it must be an explicit FCM emulator strategy —
// never a silent cloud token request from development.
let messagingPromise: Promise<Messaging | null> | null = null;
export function getMessagingInstance(): Promise<Messaging | null> {
  if (!messagingPromise) {
    if (isEmulatorDevelopment || !import.meta.env.VITE_FIREBASE_VAPID_KEY) {
      messagingPromise = Promise.resolve(null);
    } else {
      messagingPromise = import('firebase/messaging')
        .then(({ getMessaging }) => getMessaging(app))
        .catch(() => {
          console.warn('[Firebase] Messaging not initialized (environment may not support it)');
          return null;
        });
    }
  }
  return messagingPromise;
}
if (import.meta.env.DEV) console.info(`[Firebase] Connected to ${firebaseConfig.projectId}`);