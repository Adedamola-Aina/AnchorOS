/**
 * Migration Store — ENG-003
 *
 * Firestore persistence for migration records.
 * Isolated from runner logic for ARCH-001 (200-line limit).
 */

import { db, APP_ID } from '../config';
import type { MigrationRecord } from './types';

/** Read a stored migration record from Firestore. */
export async function getStoredRecord(
    migrationId: string
): Promise<MigrationRecord | null> {
    const ref = db
        .collection('artifacts')
        .doc(APP_ID)
        .collection('migrations')
        .doc(migrationId);
    const snap = await ref.get();
    if (!snap.exists) return null;
    return snap.data() as MigrationRecord;
}

/** Persist a migration record to Firestore. */
export async function saveRecord(record: MigrationRecord): Promise<void> {
    const ref = db
        .collection('artifacts')
        .doc(APP_ID)
        .collection('migrations')
        .doc(record.migrationId);
    await ref.set(record, { merge: true });
}
