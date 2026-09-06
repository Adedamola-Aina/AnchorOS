/**
 * Shared configuration for Cloud Functions
 * 
 * Firebase admin initialization, Firestore reference, and environment-aware
 * URL resolution.
 */


import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const db = getFirestore();
export const APP_ID = 'anchor-os';
export const BCRYPT_SALT_ROUNDS = 12;

// Used by the Firebase Trigger Email extension's `mail` collection.
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Anchor OS <noreply@adedamola.us>';

// Determine APP_URL based on Firebase project ID
function getAppUrl(): string {
    if (process.env.APP_URL) return process.env.APP_URL;

    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || '';

    if (projectId === 'anchor-os') {
        return 'https://anchor-os.web.app';
    } else if (projectId === 'anchor-os-staging') {
        return 'https://anchor-os-staging.web.app';
    } else if (projectId.includes('dev')) {
        return 'https://anchor-os-dev-1c6ec.web.app';
    }

    return 'https://anchor-os.web.app';
}

export const APP_URL = getAppUrl();
