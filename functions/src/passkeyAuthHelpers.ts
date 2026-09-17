/**
 * passkeyAuthHelpers — GAP-011
 *
 * Shared constants, types, Firestore refs, and pure helpers for
 * passkeyAuth.ts Cloud Functions. Extracted per ARCH-001 (200-line limit).
 */

// 

// 

// 


import { FieldValue } from 'firebase-admin/firestore';
import { APP_ID, db } from './config';

// ── Constants ───────────────────────────────────────────────────────────────

export const CHALLENGE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/** Allowed origins per environment — derived from project ID at runtime */
export function getAllowedOrigins(): string[] {
    const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? '';
    if (projectId === 'anchor-os') return ['https://anchor-os.web.app', 'https://anchor-os.firebaseapp.com'];
    if (projectId === 'anchor-os-staging') return ['https://anchor-os-staging.web.app', 'https://anchor-os-staging.firebaseapp.com'];
    // Local emulator development — localhost origins only.
    return ['http://localhost:5173', 'http://localhost:4173'];
}

export function getRpId(): string {
    const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? '';
    if (projectId === 'anchor-os') return 'anchor-os.web.app';
    if (projectId === 'anchor-os-staging') return 'anchor-os-staging.web.app';
    // Local emulator development (WebAuthn against localhost).
    return 'localhost';
}

// ── Pure helpers ─────────────────────────────────────────────────────────────

export function generateBase64urlChallenge(bytes = 32): string {
    if (typeof globalThis.crypto?.getRandomValues === 'function') {
        const buf = new Uint8Array(bytes);
        globalThis.crypto.getRandomValues(buf);
        return Buffer.from(buf).toString('base64url');
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { randomBytes } = require('node:crypto') as typeof import('node:crypto');
    return randomBytes(bytes).toString('base64url');
}

export function generateChallengeId(): string {
    return generateBase64urlChallenge(16);
}

/**
 * RA-03 (#150): resolve a stable rate-limit identifier for challenge issuance.
 *
 * Prefer the authenticated uid. For anonymous (pre-auth) challenge requests the
 * client IP is the only available discriminator, and Cloud Functions delivers it
 * in `x-forwarded-for`. Falling straight through to a literal 'anon' collapses
 * every anonymous caller into one bucket, so a single attacker can exhaust the
 * limit — and therefore passkey login/registration availability — for everyone.
 */
export function resolveChallengeRateLimitId(input: {
    uid?: string | null;
    forwardedFor?: string | string[] | undefined;
    remoteIp?: string | undefined;
}): string {
    const uid = input.uid?.trim();
    if (uid) return uid;

    const forwarded = Array.isArray(input.forwardedFor)
        ? input.forwardedFor[0]
        : input.forwardedFor;
    const firstForwarded = forwarded?.split(',')[0]?.trim();
    if (firstForwarded) return `ip:${firstForwarded}`;

    const remoteIp = input.remoteIp?.trim();
    if (remoteIp) return `ip:${remoteIp}`;

    return 'anon';
}

// ── Firestore references ────────────────────────────────────────────────────

export function challengeRef(challengeId: string) {
    return db.collection('passkey_challenges').doc(challengeId);
}

export function credentialRef(userId: string, credentialId: string) {
    return db
        .collection('artifacts').doc(APP_ID)
        .collection('users').doc(userId)
        .collection('passkeys').doc(credentialId);
}

/**
 * Fallback lookup when userHandle is absent from the WebAuthn assertion.
 * Queries the passkeys collection group by credentialId field and resolves
 * the owning userId from the document path.
 * Path shape: artifacts/{APP_ID}/users/{userId}/passkeys/{credentialId}
 */
export async function findCredentialByCredentialId(credentialId: string): Promise<{
    data: CredentialDoc;
    userId: string;
    ref: FirebaseFirestore.DocumentReference;
} | null> {
    const snap = await (db as FirebaseFirestore.Firestore)
        .collectionGroup('passkeys')
        .where('credentialId', '==', credentialId)
        .limit(1)
        .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const parts = doc.ref.path.split('/');
    const userId = parts[3]; // artifacts/{APP_ID}/users/{userId}/passkeys/{credId}
    return { data: doc.data() as CredentialDoc, userId, ref: doc.ref };
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface ChallengeDoc {
    challenge: string;
    expiresAt: { toMillis(): number };
    purpose: 'register' | 'authenticate';
    userId?: string;
}

export interface CredentialDoc {
    credentialId: string;
    publicKey: string; // base64url-encoded COSE public key
    counter: number;
}

export interface IssueChallengeData {
    purpose?: string;
}

export interface VerifyAssertionData {
    challengeId?: string;
    credentialId?: string;
    userId?: string;
    response?: {
        authenticatorData?: string;
        clientDataJSON?: string;
        signature?: string;
        userHandle?: string;
    };
}

export { FieldValue };
