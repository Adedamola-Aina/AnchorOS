// @ts-nocheck
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);

// Initialize Firestore with modern persistence (replaces deprecated enableIndexedDbPersistence)
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';

export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});

import { getMessaging } from "firebase/messaging";
import { getFunctions } from "firebase/functions";

// APP_ID is always 'anchor-os' for consistent Firestore data paths
// The actual Firebase project is determined by projectId
export const APP_ID = 'anchor-os';
export const functions = getFunctions(app, 'us-central1'); // Region must match function deployment
// Initialize Messaging safely (failed in tests/node env)
let messagingInstance;
try {
  messagingInstance = getMessaging(app);
} catch (_e) {
  console.warn('[Firebase] Messaging not initialized (environment may not support it)');
}
export const messaging = messagingInstance;
if (import.meta.env.DEV) console.info(`[Firebase] Connected to ${firebaseConfig.projectId}`);