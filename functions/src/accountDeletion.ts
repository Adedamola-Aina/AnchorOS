/**
 * Account deletion orchestration (A-04)
 *
 * Right-to-erasure flow with three properties the previous implementation lacked:
 *
 *  1. **Complete erasure.** Every resource holding user data is erased: sessions
 *     and tokens, provider (Mono) links, Storage objects, family grants and
 *     artefacts, the Firestore tree, and finally the auth user.
 *  2. **Ordering.** The auth user is deleted LAST. Until every other step has
 *     succeeded there is still an account to authenticate with, so a failure stays
 *     retryable instead of leaving an unreachable, half-erased account.
 *  3. **Idempotence and resume.** Each completed step is recorded in a server-only
 *     `deletion_jobs/{uid}` document; a retry skips finished steps, and a repeated
 *     request is a no-op.
 *
 * Side effects are injected (`DeletionDeps`) so the erasure contract can be proven
 * deterministically against the emulator without touching real Storage or Mono.
 */

import { FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { logger } from 'firebase-functions';
import { APP_ID, db } from './config';
import { unlinkAccount as monoUnlink } from './mono/monoClient';
import { markSessionsRevoked } from './sessionEnforcement';

const DELETE_CHUNK_SIZE = 100;
const WRITE_BATCH_CHUNK_SIZE = 400;

export const DELETION_STEPS = ['sessions', 'provider', 'storage', 'family', 'tree', 'auth'] as const;
export type DeletionStep = (typeof DELETION_STEPS)[number];

export interface DeletionJob {
    uid: string;
    requestedAt: string;
    completedSteps: DeletionStep[];
    status: 'in_progress' | 'complete' | 'failed';
    lastError?: string;
    completedAt?: string;
}

export interface DeletionDeps {
    /** Revoke every session and refuse tokens issued before now (A-03 epoch). */
    revokeSessions(uid: string): Promise<void>;
    /** Unlink the user's bank connections at the provider. Returns links unlinked. */
    unlinkProvider(uid: string): Promise<number>;
    /** Delete Storage objects the user owns. Returns objects deleted. */
    eraseStorage(uid: string): Promise<number>;
    /** Remove family grants and family artefacts in both directions. */
    eraseFamily(uid: string, email?: string): Promise<void>;
    /** Delete the user's Firestore document tree. */
    eraseTree(uid: string): Promise<void>;
    /** Delete the auth user (must run last). */
    deleteAuthUser(uid: string): Promise<void>;
}

function jobRef(uid: string) {
    return db.collection('artifacts').doc(APP_ID).collection('deletion_jobs').doc(uid);
}

export async function readDeletionJob(uid: string): Promise<DeletionJob | null> {
    const snap = await jobRef(uid).get();
    return snap.exists ? (snap.data() as DeletionJob) : null;
}

async function recordStep(uid: string, step: DeletionStep): Promise<void> {
    await jobRef(uid).set({ completedSteps: FieldValue.arrayUnion(step) }, { merge: true });
}

/** Storage prefixes that belong to a user (see config/storage.rules). */
export function storagePrefixes(uid: string): string[] {
    return [`avatars/${uid}/`, `artifacts/${APP_ID}/users/${uid}/`];
}

// ---------------------------------------------------------------------------
// Tree / family helpers (moved here from deleteAccount.ts — one erasure path)
// ---------------------------------------------------------------------------

async function deleteDocumentTree(docRef: FirebaseFirestore.DocumentReference): Promise<void> {
    const subcollections = await docRef.listCollections();
    for (const subcollection of subcollections) {
        await deleteCollectionTree(subcollection);
    }
    await docRef.delete();
}

async function deleteCollectionTree(collectionRef: FirebaseFirestore.CollectionReference): Promise<void> {
    while (true) {
        const snapshot = await collectionRef.limit(DELETE_CHUNK_SIZE).get();
        if (snapshot.empty) return;

        for (const docSnapshot of snapshot.docs) {
            await deleteDocumentTree(docSnapshot.ref);
        }

        if (snapshot.size < DELETE_CHUNK_SIZE) return;
    }
}

async function revokeSharedAccess(userUid: string): Promise<void> {
    const sharedAccounts = await db.collectionGroup('accounts')
        .where(`sharedWith.${userUid}.grantedAt`, '!=', null)
        .get();

    if (sharedAccounts.empty) return;

    for (let index = 0; index < sharedAccounts.docs.length; index += WRITE_BATCH_CHUNK_SIZE) {
        const chunk = sharedAccounts.docs.slice(index, index + WRITE_BATCH_CHUNK_SIZE);
        const batch = db.batch();
        chunk.forEach((docSnapshot) => {
            batch.update(docSnapshot.ref, { [`sharedWith.${userUid}`]: FieldValue.delete() });
        });
        await batch.commit();
    }
}

async function deleteFamilyArtifacts(userUid: string, userEmail?: string): Promise<void> {
    const artifactsRef = db.collection('artifacts').doc(APP_ID);

    const [ownerConnections, memberConnections, ownerInvitations] = await Promise.all([
        artifactsRef.collection('family_connections').where('ownerUid', '==', userUid).get(),
        artifactsRef.collection('family_connections').where('memberUid', '==', userUid).get(),
        artifactsRef.collection('family_invitations').where('ownerUid', '==', userUid).get(),
    ]);

    const docsToDelete: FirebaseFirestore.QueryDocumentSnapshot[] = [
        ...ownerConnections.docs,
        ...memberConnections.docs,
        ...ownerInvitations.docs,
    ];

    if (userEmail) {
        const inviteeInvitations = await artifactsRef.collection('family_invitations')
            .where('inviteeEmail', '==', userEmail)
            .get();
        docsToDelete.push(...inviteeInvitations.docs);
    }

    for (let index = 0; index < docsToDelete.length; index += WRITE_BATCH_CHUNK_SIZE) {
        const chunk = docsToDelete.slice(index, index + WRITE_BATCH_CHUNK_SIZE);
        const batch = db.batch();
        chunk.forEach((docSnapshot) => batch.delete(docSnapshot.ref));
        await batch.commit();
    }
}

export const defaultDeletionDeps: DeletionDeps = {
    async revokeSessions(uid: string): Promise<void> {
        await getAuth().revokeRefreshTokens(uid);
        await markSessionsRevoked(uid, 'account_deletion');
    },

    async unlinkProvider(uid: string): Promise<number> {
        const connections = await db.collectionGroup('bankConnections')
            .where('userId', '==', uid)
            .get();

        let unlinked = 0;
        for (const connection of connections.docs) {
            const monoAccountId = connection.data()?.monoAccountId;
            if (typeof monoAccountId !== 'string' || !monoAccountId) continue;

            try {
                await monoUnlink(monoAccountId);
                unlinked += 1;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                // A link the provider no longer knows about is already unlinked.
                if (!/404|not found/i.test(message)) throw error;
                unlinked += 1;
            }
        }
        return unlinked;
    },

    async eraseStorage(uid: string): Promise<number> {
        const bucket = getStorage().bucket();
        let deleted = 0;
        for (const prefix of storagePrefixes(uid)) {
            const [files] = await bucket.getFiles({ prefix });
            if (files.length === 0) continue;
            await bucket.deleteFiles({ prefix });
            deleted += files.length;
        }
        return deleted;
    },

    async eraseFamily(uid: string, email?: string): Promise<void> {
        await revokeSharedAccess(uid);
        await deleteFamilyArtifacts(uid, email);
    },

    async eraseTree(uid: string): Promise<void> {
        const userDocRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(uid);
        const snap = await userDocRef.get();
        if (snap.exists) await deleteDocumentTree(userDocRef);
    },

    async deleteAuthUser(uid: string): Promise<void> {
        try {
            await getAuth().deleteUser(uid);
        } catch (error) {
            const code = error != null && typeof error === 'object' && 'code' in error
                ? String((error as { code: string }).code)
                : '';
            if (code !== 'auth/user-not-found') throw error;
        }
    },
};

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

export interface DeletionOutcome {
    status: 'complete' | 'failed';
    completedSteps: DeletionStep[];
    /** Steps performed by THIS call. */
    executed: DeletionStep[];
    alreadyComplete: boolean;
    error?: string;
}

/**
 * Erase an account, resuming from whatever previous attempts completed.
 *
 * A failing step marks the job `failed` and returns; the auth user is only removed
 * once every other step has succeeded, so the caller can retry while still able to
 * authenticate. A repeat request after completion is a no-op.
 */
export async function deleteAccountData(
    uid: string,
    email?: string,
    deps: DeletionDeps = defaultDeletionDeps,
): Promise<DeletionOutcome> {
    const existing = await readDeletionJob(uid);

    if (existing?.status === 'complete') {
        return {
            status: 'complete',
            completedSteps: existing.completedSteps ?? [],
            executed: [],
            alreadyComplete: true,
        };
    }

    const completed = new Set<DeletionStep>(existing?.completedSteps ?? []);
    const executed: DeletionStep[] = [];

    if (!existing) {
        await jobRef(uid).set({
            uid,
            requestedAt: new Date().toISOString(),
            completedSteps: [],
            status: 'in_progress',
        } satisfies DeletionJob);
    } else {
        await jobRef(uid).set({ status: 'in_progress', lastError: FieldValue.delete() }, { merge: true });
    }

    const run: Record<DeletionStep, () => Promise<void>> = {
        sessions: () => deps.revokeSessions(uid),
        provider: async () => { await deps.unlinkProvider(uid); },
        storage: async () => { await deps.eraseStorage(uid); },
        family: () => deps.eraseFamily(uid, email),
        tree: () => deps.eraseTree(uid),
        auth: () => deps.deleteAuthUser(uid),
    };

    try {
        for (const step of DELETION_STEPS) {
            if (completed.has(step)) continue;

            await run[step]();
            await recordStep(uid, step);
            completed.add(step);
            executed.push(step);
        }

        await jobRef(uid).set({ status: 'complete', completedAt: new Date().toISOString() }, { merge: true });

        return { status: 'complete', completedSteps: [...completed], executed, alreadyComplete: false };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`[AccountDeletion] step failed for ${uid}:`, message);
        await jobRef(uid).set({ status: 'failed', lastError: message }, { merge: true });

        return {
            status: 'failed',
            completedSteps: [...completed],
            executed,
            alreadyComplete: false,
            error: message,
        };
    }
}


