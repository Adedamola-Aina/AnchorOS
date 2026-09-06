/**
 * LedgerService — ARCH-022
 *
 * Immutable per-user financial mutation log written to `users/{uid}/ledger/{id}`.
 * Each write is append-only (Firestore rules: allow create; deny update/delete).
 * Provides a tamper-evident audit trail for all balance-affecting operations.
 *
 * Call `LedgerService.record()` after every financial mutation.
 * Failures are silently swallowed — the ledger must never block business ops.
 */

import { createHash } from '../utils/hashUtils';
import { secureDb } from '../utils/secureDb';

type LedgerAction =
    | 'transaction_created'
    | 'transaction_updated'
    | 'transaction_deleted'
    | 'account_created'
    | 'account_archived'
    | 'balance_changed';

type LedgerEntityType = 'transaction' | 'account';

interface LedgerEntry {
    action: LedgerAction;
    entityId: string;
    entityType: LedgerEntityType;
    /** Signed delta in smallest currency unit (cents/kobo) */
    amountCentsDelta: number;
    snapshotBefore?: Record<string, unknown> | null;
    snapshotAfter: Record<string, unknown> | null;
}

interface StoredLedgerEntry extends LedgerEntry {
    actorUid: string;
    ledgerDocId: string;
    timestamp: string;
    integrityHash: string;
}

function buildIntegrityHash(entry: StoredLedgerEntry): string {
    const payload = JSON.stringify({
        action: entry.action,
        entityId: entry.entityId,
        actorUid: entry.actorUid,
        amountCentsDelta: entry.amountCentsDelta,
        timestamp: entry.timestamp,
    });
    return createHash(payload);
}

function generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export const LedgerService = {
    async record(actorUid: string, entry: LedgerEntry): Promise<void> {
        try {
            const docId = generateId();
            const timestamp = new Date().toISOString();

            const stored: StoredLedgerEntry = {
                ...entry,
                actorUid,
                ledgerDocId: docId,
                timestamp,
                integrityHash: '',
            };
            stored.integrityHash = buildIntegrityHash(stored);

            await secureDb.setDocument(actorUid, ['ledger', docId], stored as unknown as Record<string, unknown>);
        } catch {
            // Ledger must never interrupt business operations
        }
    },
};
