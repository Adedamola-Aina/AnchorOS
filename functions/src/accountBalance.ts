/**
 * Balance application for linked accounts (FI-04).
 *
 * The provider is the source of truth for a linked account's balance, but several
 * writers can observe it at once — a webhook refresh, a manual sync, a scheduled
 * sync. The previous code performed a blind `update({ balanceCents })`, so two
 * writers could apply their observations in the wrong order and the *older*
 * balance could win.
 *
 * Applying an observation is therefore transactional and ordered by the moment the
 * provider reported it: an observation older than the one already applied is
 * discarded rather than written. This is non-destructive (no delta arithmetic that
 * can double-apply) and makes concurrent writers converge on the newest state.
 */

import { db } from './config';

/**
 * Normalize a provider-supplied timestamp to epoch milliseconds, falling back to
 * "now" when the provider did not give one we can parse.
 */
export function observedAtFrom(...candidates: Array<string | undefined | null>): number {
    for (const candidate of candidates) {
        if (!candidate) continue;
        const ms = Date.parse(candidate);
        if (Number.isFinite(ms)) return ms;
    }
    return Date.now();
}

/**
 * Apply an observed provider balance, unless a newer observation is already stored.
 *
 * Returns true when the observation was written, false when it was stale or the
 * account no longer exists.
 */
export async function applyObservedBalance(
    accountRef: FirebaseFirestore.DocumentReference,
    balanceCents: number,
    observedAtMs: number,
): Promise<boolean> {
    return db.runTransaction(async (txn) => {
        const snap = await txn.get(accountRef);
        if (!snap.exists) return false;

        const appliedAtMs = Number(snap.data()?.externalConnection?.balanceAsOfMs ?? 0);
        if (observedAtMs < appliedAtMs) return false;

        txn.update(accountRef, {
            balanceCents,
            'externalConnection.balanceAsOfMs': observedAtMs,
            'externalConnection.lastSyncedAt': new Date(observedAtMs).toISOString(),
            'externalConnection.syncStatus': 'active',
        });
        return true;
    });
}
