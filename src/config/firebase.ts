// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence, browserPopupRedirectResolver } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

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
if (import.meta.env.DEV) console.info(`[Firebase] Initializing for ${env} environment (${firebaseConfig.projectId})...`);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize App Check when a site key is configured.
// This protects Firestore/Functions from scripted abuse in web environments.
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY as string | undefined;
if (appCheckSiteKey && typeof window !== 'undefined' && window.location.protocol !== 'capacitor:') {
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
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';

export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});

import { getMessaging } from "firebase/messaging";
import { getFunctions } from "firebase/functions";
import { getStorage } from 'firebase/storage';

// APP_ID is always 'anchor-os' for consistent Firestore data paths
// The actual Firebase project is determined by projectId
export const APP_ID = 'anchor-os';
export const functions = getFunctions(app, 'us-central1'); // Region must match function deployment
export function getAppStorage() {
  return getStorage(app);
}
// Initialize Messaging only when VAPID key is configured.
// Without a valid VAPID key, getToken() fails with 401 and also pollutes
// httpsCallable context (Firebase SDK auto-fetches FCM token for callables).
let messagingInstance;
if (import.meta.env.VITE_FIREBASE_VAPID_KEY) {
  try {
    messagingInstance = getMessaging(app);
  } catch (_e) {
    console.warn('[Firebase] Messaging not initialized (environment may not support it)');
  }
}
export const messaging = messagingInstance;
if (import.meta.env.DEV) console.info(`[Firebase] Connected to ${firebaseConfig.projectId}`);