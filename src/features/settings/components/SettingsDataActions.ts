/**
 * SettingsDataActions - Data wipe and account deletion handlers
 * Extracted from SettingsView.tsx per CLAUDE.md §3.2 (200-line rule)
 * BATCH-001: Fixed Firestore 500-op limit in wipe data
 */
// @ts-nocheck

import { captureError } from '../../../utils/error';

import type { User } from 'firebase/auth';

type ShowToast = (message: string, type: 'success' | 'error' | 'info') => void;

const BATCH_LIMIT = 400; // Stay under Firestore's 500 limit with margin
const COLLECTIONS = ['accounts', 'finance', 'commitments', 'notifications', 'recurring'];

export async function handleWipeData(userId: string, showToast: ShowToast): Promise<void> {
    try {
        const { getDocs, collection, writeBatch, doc } = await import('firebase/firestore');
        const { db, APP_ID } = await import('../../../config/firebase');
        let totalOpCount = 0;

        const docsToDelete: { collection: string; id: string }[] = [];
        for (const colName of COLLECTIONS) {
            const snap = await getDocs(collection(db, 'artifacts', APP_ID, 'users', userId, colName));
            snap.docs.forEach(d => docsToDelete.push({ collection: colName, id: d.id }));
        }

        for (let i = 0; i < docsToDelete.length; i += BATCH_LIMIT) {
            const chunk = docsToDelete.slice(i, i + BATCH_LIMIT);
            const batch = writeBatch(db);
            chunk.forEach(d => batch.delete(doc(db, 'artifacts', APP_ID, 'users', userId, d.collection, d.id)));
            await batch.commit();
            totalOpCount += chunk.length;
        }

        if (totalOpCount > 0) {
            showToast(`Wiped ${totalOpCount} records.`, 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast('Nothing to wipe.', 'info');
        }
    } catch (e) {
        captureError(e, 'Settings.wipeData');
        showToast('Wipe failed: ' + (e as Error).message, 'error');
    }
}

export async function handleDeleteAccount(
    user: User | null,
    familyConnection: unknown,
    disconnectFamily: (action: 'remove_member' | 'leave') => Promise<void>,
    logout: () => void,
    showToast: ShowToast,
): Promise<void> {
    try {
        if (familyConnection) await disconnectFamily('leave');

        const { getDocs, collection, writeBatch, doc } = await import('firebase/firestore');
        const { db, APP_ID } = await import('../../../config/firebase');
        const uid = user?.uid;
        if (!uid) throw new Error('No user ID');

        // BATCH-001: Use chunked batches for safety
        const docsToDelete: { collection: string; id: string }[] = [];
        for (const colName of COLLECTIONS) {
            const snap = await getDocs(collection(db, 'artifacts', APP_ID, 'users', uid, colName));
            snap.docs.forEach(d => docsToDelete.push({ collection: colName, id: d.id }));
        }
        docsToDelete.push({ collection: '', id: '' }); // Placeholder for profile doc

        for (let i = 0; i < docsToDelete.length; i += BATCH_LIMIT) {
            const chunk = docsToDelete.slice(i, i + BATCH_LIMIT);
            const batch = writeBatch(db);
            chunk.forEach(d => {
                if (d.collection) batch.delete(doc(db, 'artifacts', APP_ID, 'users', uid, d.collection, d.id));
            });
            batch.delete(doc(db, 'artifacts', APP_ID, 'users', uid));
            await batch.commit();
        }

        const { deleteUser } = await import('firebase/auth');
        if (user) {
            try {
                await deleteUser(user);
                showToast('Account deleted successfully.', 'success');
            } catch (authErr: unknown) {
                const errCode = authErr != null && typeof authErr === 'object' && 'code' in authErr
                    ? (authErr as { code: string }).code : '';
                if (errCode === 'auth/requires-recent-login') {
                    showToast('Account data deleted. Sign in again to complete deletion.', 'info');
                } else {
                    throw authErr;
                }
            }
        }

        setTimeout(() => logout(), 500);
    } catch (e) {
        captureError(e, 'Settings.deleteAccount');
        showToast('Error: ' + (e as Error).message, 'error');
    }
}
