import { createHash } from 'node:crypto';
import { db, APP_ID } from './config';

export const REMINDER_CLAIM_LEASE_MS = 90 * 1000;
export const REMINDER_CLAIM_TTL_MS = 24 * 60 * 60 * 1000;

interface ClaimDecisionInput {
    existingRunId?: string;
    existingLeaseUntilMs?: number;
    nowMs: number;
    nextRunId: string;
}

interface ClaimParams {
    userId: string;
    dedupeKey: string;
    runId: string;
    nowMs: number;
    leaseMs?: number;
    ttlMs?: number;
}

interface ReleaseParams {
    userId: string;
    dedupeKey: string;
    runId: string;
}

interface ReminderClaimDocument {
    runId?: string;
    leaseUntilMs?: number;
}

export function buildReminderClaimId(userId: string, dedupeKey: string): string {
    return createHash('sha256').update(`${userId}:${dedupeKey}`).digest('hex');
}

export function canClaimReminderSlot({
    existingRunId,
    existingLeaseUntilMs,
    nowMs,
    nextRunId,
}: ClaimDecisionInput): boolean {
    if (!existingRunId || !existingLeaseUntilMs) {
        return true;
    }

    if (existingRunId === nextRunId) {
        return true;
    }

    return existingLeaseUntilMs <= nowMs;
}

export function buildClaimExpiryDate({ nowMs, ttlMs }: { nowMs: number; ttlMs: number }): Date {
    return new Date(nowMs + ttlMs);
}

export async function claimReminderDeliverySlot({
    userId,
    dedupeKey,
    runId,
    nowMs,
    leaseMs = REMINDER_CLAIM_LEASE_MS,
    ttlMs = REMINDER_CLAIM_TTL_MS,
}: ClaimParams): Promise<boolean> {
    const claimId = buildReminderClaimId(userId, dedupeKey);
    const claimRef = db.collection('artifacts').doc(APP_ID)
        .collection('reminder_delivery_claims').doc(claimId);

    return db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(claimRef);
        const data = (snapshot.data() || {}) as ReminderClaimDocument;

        const allowed = canClaimReminderSlot({
            existingRunId: data.runId,
            existingLeaseUntilMs: data.leaseUntilMs,
            nowMs,
            nextRunId: runId,
        });

        if (!allowed) {
            return false;
        }

        transaction.set(claimRef, {
            userId,
            dedupeKey,
            runId,
            claimedAtMs: nowMs,
            leaseUntilMs: nowMs + leaseMs,
            expiresAt: buildClaimExpiryDate({ nowMs, ttlMs }),
            updatedAtMs: nowMs,
        }, { merge: true });

        return true;
    });
}

export async function releaseReminderDeliverySlot({
    userId,
    dedupeKey,
    runId,
}: ReleaseParams): Promise<void> {
    const claimId = buildReminderClaimId(userId, dedupeKey);
    const claimRef = db.collection('artifacts').doc(APP_ID)
        .collection('reminder_delivery_claims').doc(claimId);

    await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(claimRef);
        if (!snapshot.exists) {
            return;
        }

        const data = (snapshot.data() || {}) as ReminderClaimDocument;
        if (data.runId !== runId) {
            return;
        }

        transaction.delete(claimRef);
    });
}
