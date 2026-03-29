/**
 * SettingsDataActions - Data wipe and account deletion handlers
 * Extracted from SettingsView.tsx per CLAUDE.md §3.2 (200-line rule)
 * BATCH-001: Fixed Firestore 500-op limit in wipe data
 */
// @ts-nocheck

import { captureError } from '../../../utils/error';
import { httpsCallable } from 'firebase/functions';
import { functions, APP_ID } from '../../../config/firebase';
import { getDocs, collection, writeBatch, doc, db } from '../../../utils/secureDb';

import type { User } from 'firebase/auth';

type ShowToast = (message: string, type: 'success' | 'error' | 'info') => void;

const BATCH_LIMIT = 400; // Stay under Firestore's 500 limit with margin
const COLLECTIONS = ['accounts', 'finance', 'commitments', 'notifications', 'recurring'];

export async function handleWipeData(userId: string, showToast: ShowToast): Promise<void> {
    try {
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
        const uid = user?.uid;
        if (!uid) throw new Error('No user ID');

        const deleteMyAccount = httpsCallable<Record<string, never>, { success: boolean }>(functions, 'deleteMyAccount');
        await deleteMyAccount({});
        showToast('Account deleted successfully.', 'success');

        setTimeout(() => logout(), 500);
    } catch (e) {
        const code = e != null && typeof e === 'object' && 'code' in e
            ? String((e as { code: string }).code)
            : '';
        if (code === 'functions/failed-precondition' || code === 'failed-precondition') {
            showToast('Please re-authenticate and try account deletion again.', 'info');
            return;
        }
        captureError(e, 'Settings.deleteAccount');
        showToast('Error: ' + (e as Error).message, 'error');
    }
}
