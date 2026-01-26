// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Environment-based Firebase configuration
// Reads from .env.development, .env.staging, or .env.production
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'anchor-os';

// Firebase configurations for each environment
const configs: Record<string, {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}> = {
  // Production (default)
  'anchor-os': {
    apiKey: "AIzaSyBiJ9rSE11D29A-356F9KtzvnTV6Ajs_mQ",
    authDomain: "anchor-os.firebaseapp.com",
    projectId: "anchor-os",
    storageBucket: "anchor-os.firebasestorage.app",
    messagingSenderId: "501329205014",
    appId: "1:501329205014:web:1092c50e54faa5216ea237",
    measurementId: "G-LBNK80WWNS"
  },
  // Staging
  'anchor-os-staging': {
    apiKey: "AIzaSyDoQevJKyequof4p1XdIXCPz3hE3QaKSUc",
    authDomain: "anchor-os-staging.firebaseapp.com",
    projectId: "anchor-os-staging",
    storageBucket: "anchor-os-staging.firebasestorage.app",
    messagingSenderId: "251281982839",
    appId: "1:251281982839:web:bae102a18f2d209432cd72"
  },
  // Development
  'anchor-os-dev-1c6ec': {
    apiKey: "AIzaSyAcRCcHADYhsh1YLo_qZs4sXLgLEEJd5PA",
    authDomain: "anchor-os-dev-1c6ec.firebaseapp.com",
    projectId: "anchor-os-dev-1c6ec",
    storageBucket: "anchor-os-dev-1c6ec.firebasestorage.app",
    messagingSenderId: "151437822604",
    appId: "1:151437822604:web:fdd06a38842d7992d109a9"
  }
};

// Select config based on environment
const firebaseConfig = configs[projectId] || configs['anchor-os'];

// Log which environment we're connecting to
const env = import.meta.env.VITE_APP_ENV || 'production';
console.log(`[Firebase] Initializing for ${env} environment (${projectId})...`);

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
} catch (e) {
  console.warn('[Firebase] Messaging not initialized (environment may not support it)');
}
export const messaging = messagingInstance;
console.log(`[Firebase] Connected to ${projectId}`);